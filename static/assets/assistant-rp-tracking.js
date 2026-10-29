/* Assistant RP — PostHog + tarteaucitron, V2 (mission de tracking v2.1, 29/10/2026)
 * Adapté à partir de reference-v1/assistant-rp-tracking.js (dossier Claude non modifié).
 * Changements vs V1 :
 *   - Ajout d'une propriété technique `environment` sur chaque évènement
 *     (development|test|staging|production), lue dans window.ARP_TRACKING_CONFIG.
 *   - `cleanUrl()` ne dépend plus du nom d'hôte littéral "app.assistant-rp.com" :
 *     la réduction d'URL applicative se fonde uniquement sur `surface: 'app'`,
 *     pour fonctionner aussi sur l'URL réelle de préproduction (inconnue d'avance).
 *   - Nom du cookie de consentement configurable (`cfg.consentCookieName`), pour
 *     isoler la recette de la production (voir .env.example : arp_consent_staging).
 *   - Expose `distinctId()` et `consentState()` : nécessaires pour relier, côté
 *     serveur, le paiement Stripe au contexte analytique autorisé du navigateur
 *     qui a rempli /__souscrire (voir souscription.js).
 *   - Expose `disabled` dans l'objet retourné : true si aucun jeton PostHog n'est
 *     configuré — tarteaucitron s'initialise quand même (le choix de consentement
 *     doit rester disponible et cohérent entre pages même quand l'export est
 *     coupé), mais aucun service analytique n'est proposé ni chargé.
 *
 * Charger tarteaucitron AVANT ce fichier. Ne pas charger un autre snippet PostHog.
 * Configuration attendue : window.ARP_TRACKING_CONFIG (voir INSTALLATION.md).
 */
(function () {
  'use strict';
  if (window.arpAnalytics) return;
  const cfg = window.ARP_TRACKING_CONFIG || {};
  const tac = window.tarteaucitron;
  const SERVICE = 'arpanalytics';
  const API_HOST = 'https://eu.i.posthog.com';
  const ENVIRONMENTS = new Set(['development', 'test', 'staging', 'production']);
  const environment = ENVIRONMENTS.has(cfg.environment) ? cfg.environment : 'development';
  const isApp = cfg.surface === 'app';
  const hasToken = /^phc_[A-Za-z0-9]+$/.test(cfg.projectToken || '');

  if (!tac) {
    console.error('[Assistant RP] tarteaucitron absent : charger tarteaucitron.min.js avant ce fichier.');
    return;
  }
  if (!cfg.privacyUrl) {
    console.error('[Assistant RP] cfg.privacyUrl manquant : la politique de confidentialité doit avoir une adresse réelle.');
  }
  if (window.posthog) {
    console.error('[Assistant RP] PostHog existe deja. Supprimer les autres integrations avant de continuer.');
    return;
  }
  if (!hasToken) {
    console.warn('[Assistant RP] Aucun jeton PostHog de ' + (environment === 'production' ? 'production' : 'test') +
      ' configure : le bandeau de consentement reste actif, mais aucun export analytique ne partira ' +
      '(pas de repli sur un autre jeton).');
  }

  let sdk = null, started = false, enabled = false, lastPage = '';
  let page = { content_id: isApp ? 'application' : 'page_publique',
               content_type: isApp ? 'application' : 'page', content_theme: 'non_classe' };
  const events = new Set(['$pageview', '$identify', 'cta_clicked', 'signup_completed',
    'workspace_created', 'brief_completed', 'production_generated', 'production_kept',
    'member_invited', 'support_requested']);
  const fields = new Set(['content_id', 'content_type', 'content_theme', 'cta_id', 'position',
    'workspace_id', 'module_id', 'production_id', 'action', 'duration_ms', 'channel']);
  const campaignKeys = new Set(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']);

  function granted() {
    // Le cookie de tarteaucitron reste la reference, y compris entre sous-domaines.
    try { return /(?:^|!)arpanalytics=true(?:!|$)/.test(tac.cookie.read()); }
    catch (_) { return false; }
  }
  function safeProperties(input) {
    const out = {};
    if (!input || typeof input !== 'object') return out;
    Object.entries(input).forEach(([key, value]) => {
      if (!fields.has(key)) return;
      if (typeof value === 'number' && Number.isFinite(value)) out[key] = value;
      else if (typeof value === 'string' && /^[A-Za-z0-9_.:-]{1,120}$/.test(value)) out[key] = value;
    });
    return out;
  }
  function cleanUrl(value, referrer) {
    try {
      const u = new URL(value);
      if (!['http:', 'https:'].includes(u.protocol)) return '';
      // Aucun parametre d'URL, fragment, identifiant ou mot de passe.
      // Les chemins de l'application (quel que soit son nom d'hote reel) et des
      // sites referents ne sont pas exportes.
      const path = (referrer || isApp) ? '/' : u.pathname;
      return u.origin + path;
    } catch (_) { return ''; }
  }
  function sanitize(properties) {
    const out = {};
    Object.entries(properties || {}).forEach(([key, value]) => {
      if (key === '$set' || key === '$set_once') { out[key] = sanitize(value); return; }
      if (/title|search_keyword|search_query/i.test(key)) return;
      if (/url|referrer$/i.test(key)) { out[key] = cleanUrl(value, /referrer/i.test(key)); return; }
      if (/pathname/i.test(key) && isApp) { out[key] = '/'; return; }
      const campaignKey = key.replace(/^\$initial_/, '');
      if (campaignKeys.has(campaignKey)) {
        if (typeof value === 'string' && /^[A-Za-z0-9_.-]{1,120}$/.test(value)) out[key] = value;
        return;
      }
      // Exclure les identifiants publicitaires et donnees de recherche non prevus.
      if (/gclid|fbclid|msclkid|dclid|twclid|gbraid|wbraid/i.test(key)) return;
      out[key] = value;
    });
    return out;
  }
  function canCapture() { return hasToken && !!sdk && enabled && granted() && !sdk.has_opted_out_capturing(); }
  function capture(name, properties) {
    if (!events.has(name) || name[0] === '$' || !canCapture()) return false;
    sdk.capture(name, { ...safeProperties(properties), surface: isApp ? 'app' : 'site', environment });
    return true;
  }
  function sendPage() {
    if (!canCapture()) return false;
    const url = isApp ? location.origin + '/' : location.origin + location.pathname;
    const fingerprint = JSON.stringify([url, page]);
    if (lastPage === fingerprint) return false;
    lastPage = fingerprint;
    sdk.capture('$pageview', { ...page, surface: isApp ? 'app' : 'site', environment,
      $current_url: url, $pathname: isApp ? '/' : location.pathname });
    return true;
  }
  function stop() {
    enabled = false;
    lastPage = '';
    if (sdk) sdk.opt_out_capturing({ clear_persistence: true });
  }
  function sync() {
    if (!hasToken) return;
    if (!granted()) { stop(); return; }
    if (!started) { start(); return; }
    if (!sdk) return;
    if (!enabled || sdk.has_opted_out_capturing()) {
      // Pas de reprise retroactive des actions realisees avant l'accord.
      sdk.opt_in_capturing();
      enabled = true;
      window.dispatchEvent(new Event('arp:analytics-ready'));
    }
    sendPage();
  }
  function start() {
    if (started || !hasToken || !granted()) return;
    started = true;
    // Chargeur fourni par PostHog, execute UNIQUEMENT apres accord.
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split('.');2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}p||((p=t.createElement('script')).type='text/javascript',p.crossOrigin='anonymous',p.async=!0,p.src=s.api_host.replace('.i.posthog.com','-assets.i.posthog.com')+'/static/array.js',p.onerror=function(){p=null},(r=t.getElementsByTagName('script')[0]).parentNode.insertBefore(p,r));var u=e;for(void 0!==a?u=e[a]=[]:a='posthog',u.people=u.people||[],Object.defineProperty(u,'toString',{configurable:!0,enumerable:!0,writable:!0,value:function(t){var e='posthog';return'posthog'!==a&&(e+='.'+a),t||(e+=' (stub)'),e}}),Object.defineProperty(u.people,'toString',{configurable:!0,enumerable:!0,writable:!0,value:function(){return u.toString(1)+'.people (stub)'}}),o='capture identify alias reset set_config register register_once unregister opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_distinct_id setPersonProperties unsetPersonProperties debug'.split(' '),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    window.posthog.init(cfg.projectToken, {
      api_host: API_HOST,
      defaults: '2026-05-30',
      person_profiles: 'identified_only',
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      capture_dead_clicks: false,
      capture_heatmaps: false,
      capture_exceptions: false,
      capture_performance: false,
      rageclick: false,
      disable_session_recording: true,
      disable_surveys: true,
      advanced_disable_flags: true,
      opt_out_capturing_by_default: true,
      opt_out_persistence_by_default: true,
      persistence: 'cookie',
      cross_subdomain_cookie: !!cfg.crossSubdomainCookie,
      secure_cookie: true,
      cookie_expiration: 180,
      opt_out_capturing_persistence_type: 'cookie',
      before_send: function (event) {
        if (!granted() || !enabled || !event || !events.has(event.event)) return null;
        event.properties = sanitize(event.properties);
        return event;
      },
      loaded: function (instance) { sdk = instance; sync(); }
    });
  }
  window.arpAnalytics = Object.freeze({
    disabled: !hasToken,
    environment: environment,
    hasConsent: granted,
    ready: canCapture,
    capture: capture,
    page: function (properties) {
      const safe = safeProperties(properties);
      page = { content_id: safe.content_id || page.content_id,
               content_type: safe.content_type || page.content_type,
               content_theme: safe.content_theme || page.content_theme };
      return sendPage();
    },
    identify: function (userId) {
      if (!canCapture() || typeof userId !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(userId)) return false;
      // Identifiant INTERNE opaque. Jamais une adresse email.
      sdk.identify(userId);
      return true;
    },
    reset: function () { if (canCapture()) sdk.reset(true); },
    // Pont consentement -> paiement serveur (voir Lot D : /__souscrire transmet
    // ces deux valeurs a /api/stripe-checkout, jamais directement a PostHog
    // depuis le navigateur pour un evenement financier).
    consentState: function () {
      if (!hasToken) return 'unknown';
      try {
        const raw = tac.cookie.read();
        if (/(?:^|!)arpanalytics=true(?:!|$)/.test(raw)) return 'granted';
        if (/(?:^|!)arpanalytics=false(?:!|$)/.test(raw)) return 'denied';
      } catch (_) { /* cookie illisible -> unknown */ }
      return 'unknown';
    },
    distinctId: function () {
      if (!canCapture()) return null;
      try { return sdk.get_distinct_id() || null; } catch (_) { return null; }
    }
  });
  // Service dedie : ne PAS ajouter aussi le service standard "posthog".
  tac.services[SERVICE] = {
    key: SERVICE, type: 'analytic', name: 'Statistiques du site et de l’application — PostHog',
    uri: 'https://posthog.com/privacy', readmoreLink: cfg.privacyUrl, needConsent: true,
    cookies: hasToken ? ['ph_' + cfg.projectToken + '_posthog'] : [],
    js: function () { setTimeout(sync, 0); },
    fallback: stop
  };
  document.addEventListener(SERVICE + '_allowed', sync);
  document.addEventListener(SERVICE + '_disallowed', stop);
  document.addEventListener(SERVICE + '_consentModeKo', stop);
  window.addEventListener('focus', sync);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) sync(); });
  // Verifier aussi le retrait dans un autre onglet / sous-domaine.
  setInterval(function () { if (sdk && enabled && !granted()) stop(); }, 1000);
  window.tarteaucitronCustomText = window.tarteaucitronCustomText || {};
  window.tarteaucitronCustomText['desc-' + SERVICE] =
    'Mesure des contenus consultes et des etapes d’utilisation sur le site et l’application. ' +
    'Apres connexion, rapprochement avec votre compte pour analyser l’activation et la souscription. ' +
    'Sans enregistrement de session ni contenu de vos documents. Choix modifiable a tout moment.';
  tac.init({
    privacyUrl: cfg.privacyUrl, cookieName: cfg.consentCookieName || 'tarteaucitron',
    cookieDomain: typeof cfg.cookieDomain === 'string' ? cfg.cookieDomain : '',
    hashtag: '#tarteaucitron', orientation: 'middle', serviceDefaultState: 'wait',
    highPrivacy: true, alwaysNeedConsent: true,
    AcceptAllCta: true, DenyAllCta: true, showAlertSmall: false,
    showIcon: true, iconPosition: 'BottomRight', showDetailsOnClick: true,
    groupServices: false, cookieslist: false, mandatory: true, mandatoryCta: false,
    googleConsentMode: false, bingConsentMode: false, pianoConsentMode: false,
    piwikConsentMode: false, softConsentMode: false
  });
  (tac.job = tac.job || []).push(SERVICE);
})();
