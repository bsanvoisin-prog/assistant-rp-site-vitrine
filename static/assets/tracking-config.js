/* Assistant-RP — configuration du tracking (mission v2.1, lot A, site public).
 *
 * Même schéma que tracking-config.js de l'application (assistant-rp-ia-preprod),
 * à dessein : le nom du cookie de consentement (consentCookieName) doit rester
 * identique entre les deux surfaces, car c'est lui qui permettra un jour de
 * partager l'identité analytique entre assistant-rp.com et l'application,
 * via crossSubdomainCookie (voir plus bas) — pas avant que les deux pointent
 * vers le MÊME projet PostHog de production.
 *
 * ⚠️ CECI EST LA CONFIGURATION DE RECETTE (préproduction du site public, pas
 * encore assistant-rp.com lui-même). Avant toute publication en PRODUCTION :
 *   1. Remplacer projectToken par le jeton PUBLIC "phc_..." du projet
 *      PostHog EU de PRODUCTION (celui donné dans la mission :
 *      phc_upUJDu79MVawvhiFTbUUu47sWjdwTm5UjUSeGpmo8CB3 — JAMAIS utilisé ici,
 *      exprès : voir 03_RAPPORT_LIVRAISON.md, lot A, "en attente d'accès").
 *   2. Passer environment à 'production'.
 *   3. Décider alors, et alors seulement, si crossSubdomainCookie doit passer
 *      à true et cookieDomain à '.assistant-rp.com' — jamais avant que le
 *      site ET l'application pointent vers le même projet PostHog.
 * Ce changement nécessite l'autorisation explicite du développeur responsable
 * (00_MISSION_CLAUDE.md §0.1) — ne jamais le faire depuis ce fichier sans
 * validation préalable.
 *
 * projectToken VIDE ci-dessous = export désactivé. Tant qu'aucun projet
 * PostHog EU de TEST distinct n'a été créé et son jeton collé ici, le bandeau
 * de consentement fonctionne (le choix reste disponible et respecté) mais
 * AUCUN évènement ne part nulle part — jamais de repli sur le jeton de
 * production. Voir 03_RAPPORT_LIVRAISON.md, lot A : "en attente d'accès".
 */
window.ARP_TRACKING_CONFIG = {
  projectToken: 'phc_upUJDu79MVawvhiFTbUUu47sWjdwTm5UjUSeGpmo8CB3',
  environment: 'production',
  surface: 'site',
  privacyUrl: 'https://assistant-rp.com/#confidentialite',
  consentCookieName: 'arp_consent_production',
  cookieDomain: '',
  crossSubdomainCookie: false
};
