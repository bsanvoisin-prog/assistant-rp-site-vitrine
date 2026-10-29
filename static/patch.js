/* ==========================================================================
   Patch assistant-rp.com — 22/10/2026, mis à jour le 23/10/2026
   Ne modifie pas main.js. Injecte dans le DOM une fois le site React monté :
   1. Le composant "cibles" (3 profils à onglets) dans la section .promise
   2. Deux questions FAQ supplémentaires (Entreprise, engagement annuel)
   (Le correctif forçant l'affichage de "42 modules" a été retiré le
   23/10/2026 : décision d'équipe de ne plus afficher de comptage précis.)
   ========================================================================== */
(function () {
  "use strict";

  var ICON_PLUS =
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" ' +
    'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
    'stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"></path>' +
    '<path d="M12 5v14"></path></svg>';

  var CIBLES_HTML = [
    '<div class="wrap"><div class="cibles-embed">',
    '<div class="head">',
    '<div>',
    '<div class="eyebrow">Conçu pour celles et ceux qui font les relations médias</div>',
    '<h2 id="cibles-title">Trois façons d’exercer le métier.<em>Les mêmes journées trop courtes.</em></h2>',
    '</div>',
    '<p class="lead">Choisissez votre quotidien. Voici ce qui vous prend du temps et ce que la plateforme prend en charge.</p>',
    '</div>',

    '<div class="tabs" role="tablist" aria-label="Profils">',
    '<button class="tab" role="tab" id="t-ind" aria-controls="p-ind" aria-selected="true">',
    '<span class="name">Indépendants</span><span class="tag">Toute la chaîne, en solo</span></button>',
    '<button class="tab" role="tab" id="t-ag" aria-controls="p-ag" aria-selected="false" tabindex="-1">',
    '<span class="name">Agences RP</span><span class="tag">Plusieurs clients, une même exigence</span></button>',
    '<button class="tab" role="tab" id="t-eq" aria-controls="p-eq" aria-selected="false" tabindex="-1">',
    '<span class="name">Équipes communication</span><span class="tag">La presse, et tout le reste</span></button>',
    '</div>',

    '<div class="panel" role="tabpanel" id="p-ind" aria-labelledby="t-ind">',
    '<div class="intro"><h3>Vous êtes l’agence entière.<br>Sans l’équipe.</h3>',
    '<p class="scene"><b>Un lundi ordinaire</b><br>8 h, un communiqué à boucler pour un client tech. 11 h, des relances pour un autre, dans l’agroalimentaire. 16 h, le reporting du troisième. Et la prospection, quand&nbsp;?</p></div>',
    '<div class="pains">',
    '<article class="pain"><span class="n">01</span><h4>Personne à qui déléguer</h4>',
    '<p>Premier jet, mise en forme, déclinaisons&nbsp;: sans junior, tout passe par vous. Même ce qui ne demande pas votre expertise.</p>',
    '<div class="fix"><span class="lbl">La plateforme prépare</span><div class="chips"><span class="chip">Communiqué de presse</span><span class="chip">Titres et accroches presse</span><span class="chip">Communiqué décliné en posts</span></div></div></article>',
    '<article class="pain"><span class="n">02</span><h4>Les heures que personne ne paie</h4>',
    '<p>Votre forfait est fixe. Chaque heure passée à compiler une revue de presse ou à rédiger des relances grignote votre marge.</p>',
    '<div class="fix"><span class="lbl">La plateforme prépare</span><div class="chips"><span class="chip">Revue de presse</span><span class="chip">Relance presse</span><span class="chip">Analyse de notoriété</span></div></div></article>',
    '<article class="pain"><span class="n">03</span><h4>Changer de client, changer de tête</h4>',
    '<p>D’un secteur à l’autre, il faut retrouver le contexte, le vocabulaire, le ton. Le brief est dans un mail, les éléments dans un autre.</p>',
    '<div class="fix"><span class="lbl">La plateforme organise</span><div class="chips"><span class="chip">Un espace par client</span><span class="chip">Prise de brief</span><span class="chip">Dépôt de vos documents</span></div></div></article>',
    '</div>',
    '<div class="outro"><p>La plateforme prend la fabrication. Vous gardez le conseil, celui que vos clients vous paient.</p>',
    '<a class="cta" href="#prix">Voir l’offre Indépendant <small>59&nbsp;€/mois</small><span>↗</span></a></div>',
    '</div>',

    '<div class="panel" role="tabpanel" id="p-ag" aria-labelledby="t-ag" hidden>',
    '<div class="intro"><h3>Vos seniors réécrivent.<br>Vos marges fondent.</h3>',
    '<p class="scene"><b>Un jeudi ordinaire</b><br>L’appel d’offres tombe pour lundi. Le junior livre un premier communiqué, la directrice conseil le reprend à 22&nbsp;h. Pendant ce temps, un client attend son angle sur l’actu du jour.</p></div>',
    '<div class="pains">',
    '<article class="pain"><span class="n">01</span><h4>La qualité dépend de qui tient le stylo</h4>',
    '<p>Entre un junior et un senior, l’écart se voit sur chaque livrable. Et c’est le senior qui le comble, en relecture, le soir.</p>',
    '<div class="fix"><span class="lbl">Un cadre commun pour l’équipe</span><div class="chips"><span class="chip">Communiqué de presse</span><span class="chip">Dossier de presse</span><span class="chip">Questions / réponses presse</span></div></div></article>',
    '<article class="pain"><span class="n">02</span><h4>Les recos qu’on ne facture pas</h4>',
    '<p>Appels d’offres, recommandations, propositions d’angles&nbsp;: un travail lourd, souvent gratuit, toujours urgent.</p>',
    '<div class="fix"><span class="lbl">La plateforme prépare</span><div class="chips"><span class="chip">Prise de brief</span><span class="chip">Stratégie RP</span><span class="chip">Priorisation 80/20</span></div></div></article>',
    '<article class="pain"><span class="n">03</span><h4>L’actu n’attend pas le brief</h4>',
    '<p>Un sujet émerge, le client veut réagir. Il faut un angle, un texte et des relances dans l’heure, sans lâcher les autres comptes.</p>',
    '<div class="fix"><span class="lbl">La plateforme prépare</span><div class="chips"><span class="chip">Rebond à chaud</span><span class="chip">Signaux faibles et risques</span><span class="chip">Relance presse</span></div></div></article>',
    '</div>',
    '<div class="outro"><p>Un espace distinct par client, un cadre commun pour toute l’équipe. Vos seniors reviennent au conseil.</p>',
    '<a class="cta" href="#prix">Voir l’offre Agence <small>dès 99&nbsp;€/mois · 2 comptes</small><span>↗</span></a></div>',
    '</div>',

    '<div class="panel" role="tabpanel" id="p-eq" aria-labelledby="t-eq" hidden>',
    '<div class="intro"><h3>Les relations presse,<br>entre deux validations.</h3>',
    '<p class="scene"><b>Un mardi ordinaire</b><br>Le communiqué en est à sa version 7. Le directeur général donne une interview jeudi et n’a pas encore lu son brief. Le juridique a des remarques. Et le post LinkedIn attend depuis lundi.</p></div>',
    '<div class="pains">',
    '<article class="pain"><span class="n">01</span><h4>Un périmètre qui déborde</h4>',
    '<p>Presse, interne, réseaux sociaux, événements&nbsp;: une petite équipe couvre tout. Les RP passent après l’urgence du jour.</p>',
    '<div class="fix"><span class="lbl">La plateforme prépare</span><div class="chips"><span class="chip">Communiqué de presse</span><span class="chip">Post LinkedIn</span><span class="chip">Communiqué décliné en posts</span></div></div></article>',
    '<article class="pain"><span class="n">02</span><h4>Des porte-parole pressés</h4>',
    '<p>Vos dirigeants ont vingt minutes avant l’interview. Il leur faut l’essentiel&nbsp;: qui est le journaliste, les messages clés, les questions qui fâchent.</p>',
    '<div class="fix"><span class="lbl">La plateforme prépare</span><div class="chips"><span class="chip">Fiche interlocuteur</span><span class="chip">Média training</span><span class="chip">Simulation d’appel</span></div></div></article>',
    '<article class="pain"><span class="n">03</span><h4>Des experts qui écrivent pour des experts</h4>',
    '<p>La note technique fait quarante pages. Le journaliste veut une idée forte, trois chiffres et un exemple.</p>',
    '<div class="fix"><span class="lbl">La plateforme prépare</span><div class="chips"><span class="chip">Dossier de presse</span><span class="chip">Tribune et avis d’expert</span><span class="chip">Titres et accroches presse</span></div></div></article>',
    '</div>',
    '<div class="outro"><p>Vos sujets, votre contexte et vos références internes dans la même plateforme. Moins d’allers-retours, des porte-parole mieux préparés.</p>',
    '<a class="cta" href="#prix">Parler de l’offre Entreprise <span>↗</span></a></div>',
    '</div>',

    '</div></div>'
  ].join("");

  var FAQ_EXTRA = [
    {
      q: "Un engagement annuel est-il proposé&nbsp;?",
      a: "Facturation mensuelle sans durée minimale, ou annuelle avec 12&nbsp;% de remise."
    },
    {
      q: "Une offre existe-t-elle pour les grandes entreprises&nbsp;?",
      a: "Oui, l’offre Entreprise, sur devis&nbsp;: un service RP intégré à votre échelle, un accompagnement sur mesure."
    }
  ];

  function patchCibles() {
    var promise = document.querySelector(".promise");
    if (!promise || promise.querySelector(".cibles-embed")) return false;
    promise.innerHTML = CIBLES_HTML;
    wireTabs(promise);
    return true;
  }

  function wireTabs(scope) {
    var tabs = Array.prototype.slice.call(scope.querySelectorAll('[role="tab"]'));
    function select(t) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute("aria-selected", on);
        x.tabIndex = on ? 0 : -1;
        var p = document.getElementById(x.getAttribute("aria-controls"));
        if (!p) return;
        p.hidden = !on;
        if (on) {
          p.classList.remove("enter");
          void p.offsetWidth;
          p.classList.add("enter");
        }
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (d) {
          var n = tabs[(i + d + tabs.length) % tabs.length];
          n.focus();
          select(n);
        }
      });
    });
  }

  function patchFaq() {
    var faqSection = document.querySelector("section.faq");
    if (!faqSection) return false;
    var list = faqSection.querySelector("div");
    if (!list || list.getAttribute("data-patched") === "1") return false;
    FAQ_EXTRA.forEach(function (item) {
      var d = document.createElement("details");
      var summary = document.createElement("summary");
      summary.innerHTML = item.q + ICON_PLUS;
      var p = document.createElement("p");
      p.innerHTML = item.a;
      d.appendChild(summary);
      d.appendChild(p);
      list.appendChild(d);
    });
    list.setAttribute("data-patched", "1");
    return true;
  }

  /* ------------------------------------------------------------------
     Mission de tracking v2.1 (lot A) : pageview + cta_clicked.
     Rien ici ne dépend de assistant-rp-tracking.js pour fonctionner sans
     lui — window.arpAnalytics est simplement absent tant que le script
     n'a pas chargé, et chaque appel est gardé en conséquence.
     ------------------------------------------------------------------ */

  function patchPageview() {
    if (document.documentElement.getAttribute("data-pv-patched") === "1") return false;
    if (!window.arpAnalytics) return false;
    // Même bundle, deux pages statiques : on les distingue par le chemin,
    // comme le fait déjà main.js lui-même pour choisir quoi rendre.
    var surAtelier = location.pathname === "/atelier.html";
    window.arpAnalytics.page({
      content_id: surAtelier ? "atelier" : "accueil",
      content_type: "page",
      content_theme: surAtelier ? "interne" : "produit"
    });
    document.documentElement.setAttribute("data-pv-patched", "1");
    return true;
  }

  // Un identifiant technique dérivé du texte visible du bouton/lien, pas un
  // libellé marketing à maintenir à la main : il suit le bouton si son texte
  // change, sans qu'il faille revenir ici.
  function ctaId(el) {
    var texte = (el.textContent || "").trim().toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 60);
    return texte || "cta";
  }

  // La section englobante donne la position sans qu'il faille lister à la
  // main chaque emplacement de bouton — robuste à une réorganisation de la
  // page tant que les sections gardent un nom de classe.
  function ctaPosition(el) {
    var conteneur = el.closest("header, footer, section[class], .cibles-embed, .hero-cta, .final-cta");
    if (!conteneur) return "non_classe";
    var tag = conteneur.tagName;
    if (tag === "HEADER") return "navigation";
    if (tag === "FOOTER") return "pied_de_page";
    var premiere = (conteneur.className || "").toString().trim().split(/\s+/)[0];
    return premiere || "non_classe";
  }

  function patchCtaTracking() {
    if (document.documentElement.getAttribute("data-cta-patched") === "1") return false;
    // Un seul écouteur délégué, posé une fois pour toute la vie de la page :
    // il couvre aussi les boutons injectés plus tard (patchCibles, FAQ...).
    document.addEventListener("click", function (e) {
      if (!window.arpAnalytics) return;
      var el = e.target.closest(".login, .nav-signup, .button-citron, .button, .cta");
      if (!el) return;
      window.arpAnalytics.capture("cta_clicked", {
        cta_id: ctaId(el),
        position: ctaPosition(el)
      });
    }, true);
    document.documentElement.setAttribute("data-cta-patched", "1");
    return true;
  }

  function patchBlogNavLink() {
    var navLinks = document.querySelector(".nav-links");
    if (!navLinks || navLinks.querySelector('a[href="/blog/"]')) return false;
    var a = document.createElement("a");
    a.href = "/blog/";
    a.textContent = "Blog";
    navLinks.appendChild(a);
    return true;
  }

  // Mission de tracking v2.1 (§5.1) : « Gérer mes cookies » sur le site aussi
  // (déjà posé côté blog, dans base.njk). Le pied de page React n'a pas de
  // sélecteur dédié : on repère le groupe de liens légaux par la classe des
  // boutons qu'il contient déjà, et on y glisse un bouton de plus, au même
  // gabarit — sans toucher à main.js.
  function patchCookiesFooter() {
    var legal = document.querySelector("footer .legal-link");
    if (!legal) return false;
    var groupe = legal.parentElement;
    if (groupe.querySelector(".legal-link-cookies")) return false;
    var btn = document.createElement("button");
    btn.className = "legal-link legal-link-cookies";
    btn.type = "button";
    btn.textContent = "Gérer mes cookies";
    btn.onclick = function () {
      if (window.tarteaucitron && window.tarteaucitron.userInterface) {
        window.tarteaucitron.userInterface.openPanel();
      }
    };
    var contact = groupe.querySelector('a[href^="mailto:"]');
    groupe.insertBefore(btn, contact || null);
    return true;
  }

  function runAll() {
    patchCibles();
    patchFaq();
    patchBlogNavLink();
    patchCookiesFooter();
    patchPageview();
    patchCtaTracking();
  }

  // Le site est une SPA React : le contenu n'existe pas encore au chargement du script.
  // On observe le montage puis on réapplique si React re-rend ces zones.
  var root = document.getElementById("root") || document.body;
  var observer = new MutationObserver(function () {
    runAll();
  });
  observer.observe(root, { childList: true, subtree: true });

  runAll();
  // Filet de sécurité : si l'observer rate quelque chose (hydratation tardive), on retente.
  [300, 800, 1500, 3000].forEach(function (ms) {
    setTimeout(runAll, ms);
  });
})();
