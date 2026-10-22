/* ============================================================
   ASSISTANT RP — comportements d'interface
   Vanilla JS, aucune dépendance. Chaque bloc est indépendant :
   si un écran ne contient pas le composant, le bloc ne fait rien.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Menus déroulants (données : data-menu / aria-controls) ---------- */
  document.querySelectorAll("[data-menu-trigger]").forEach(function (trigger) {
    var menu = document.getElementById(trigger.getAttribute("aria-controls"));
    if (!menu) return;

    function close() {
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onOutside);
    }
    function onKey(e) {
      if (e.key === "Escape") { close(); trigger.focus(); }
    }
    function onOutside(e) {
      if (!menu.contains(e.target) && !trigger.contains(e.target)) close();
    }
    trigger.addEventListener("click", function () {
      var open = trigger.getAttribute("aria-expanded") === "true";
      if (open) { close(); return; }
      menu.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      document.addEventListener("keydown", onKey);
      document.addEventListener("pointerdown", onOutside);
    });
  });

  /* ---------- Afficher / masquer le mot de passe ---------- */
  document.querySelectorAll("[data-reveal-for]").forEach(function (btn) {
    var input = document.getElementById(btn.getAttribute("data-reveal-for"));
    if (!input) return;
    btn.addEventListener("click", function () {
      var shown = input.type === "text";
      input.type = shown ? "password" : "text";
      btn.setAttribute("aria-label", shown ? "Afficher le mot de passe" : "Masquer le mot de passe");
      btn.setAttribute("aria-pressed", shown ? "false" : "true");
    });
  });

  /* ---------- Onglets (WAI-ARIA : flèches + Home/End) ---------- */
  document.querySelectorAll('[role="tablist"]').forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));

    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        else if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === "Home") next = tabs[0];
        else if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next); next.focus(); }
      });
    });
  });

  /* ---------- Compteur de caractères ---------- */
  document.querySelectorAll("[data-counter-for]").forEach(function (out) {
    var input = document.getElementById(out.getAttribute("data-counter-for"));
    if (!input) return;
    var max = input.getAttribute("maxlength");
    function render() { out.textContent = input.value.length + (max ? " / " + max : ""); }
    input.addEventListener("input", render);
    render();
  });

  /* ---------- Progression du brief : champs requis renseignés ---------- */
  (function () {
    var form = document.querySelector("[data-brief-form]");
    if (!form) return;
    var fill = document.querySelector("[data-progress-fill]");
    var val = document.querySelector("[data-progress-val]");
    var hint = document.querySelector("[data-progress-hint]");
    var submit = form.querySelector("[data-brief-submit]");
    var required = Array.prototype.slice.call(form.querySelectorAll("[required]"));
    var steps = Array.prototype.slice.call(document.querySelectorAll("[data-step]"));

    function update() {
      var done = required.filter(function (f) { return f.value.trim() !== ""; }).length;
      var pct = required.length ? Math.round((done / required.length) * 100) : 100;

      if (fill) fill.style.width = pct + "%";
      if (val) val.textContent = pct + " %";
      if (hint) {
        var missing = required.length - done;
        hint.textContent = missing === 0
          ? "Brief complet — vous pouvez lancer la production."
          : missing + (missing > 1 ? " champs obligatoires restants" : " champ obligatoire restant");
      }
      if (submit) submit.toggleAttribute("aria-disabled", pct < 100);

      /* l'étape 1 passe à « terminée » quand le brief est complet */
      if (steps.length) {
        steps.forEach(function (s, i) {
          if (i === 0) s.setAttribute("data-state", pct === 100 ? "done" : "current");
          else if (i === 1) s.setAttribute("data-state", pct === 100 ? "current" : "");
          else s.setAttribute("data-state", "");
        });
      }
    }
    form.addEventListener("input", update);
    update();

    /* Validation au blur, jamais à la frappe */
    required.forEach(function (f) {
      f.addEventListener("blur", function () {
        var wrap = f.closest(".field");
        if (!wrap) return;
        var err = wrap.querySelector(".error-text");
        var bad = f.value.trim() === "";
        wrap.classList.toggle("field-error", bad);
        if (err) err.hidden = !bad;
        f.setAttribute("aria-invalid", bad ? "true" : "false");
      });
    });
  })();

  /* ---------- Recherche d'intention ----------
     Remplacez MODULES par votre endpoint. La structure attendue est
     identique : { famille, couleur, titre, moteur, resume, repond, url }. */
  var MODULES = [
    { famille: "Rédaction presse", couleur: "var(--f-redaction)", titre: "Communiqué de presse", moteur: "Assistant Communiqué de Presse", resume: "Communiqué de presse, annonce officielle, prise de parole institutionnelle destinée aux médias.", repond: "rédiger un communiqué de presse", url: "module.html" },
    { famille: "Rédaction presse", couleur: "var(--f-redaction)", titre: "Communiqué décalé", moteur: "PR Twist Lab", resume: "Communiqué décalé mais professionnel, avec niveau de décalage au choix.", repond: "communiqué original qui sort du lot", url: "module.html" },
    { famille: "Diffusion", couleur: "var(--f-diffusion)", titre: "Communiqué décliné en posts", moteur: "Press2Post", resume: "Transformer un communiqué en posts adaptés à chaque réseau social.", repond: "transformer mon communiqué en posts", url: "module.html" },
    { famille: "Stratégie & pilotage", couleur: "var(--f-strategie)", titre: "Rebond à chaud", moteur: "Sniper RP", resume: "Veille et rebond à chaud, classés en Urgent / Actionnable / À surveiller.", repond: "réagir à une polémique cette semaine", url: "famille.html" },
    { famille: "Stratégie & pilotage", couleur: "var(--f-strategie)", titre: "Stratégie RP", moteur: "Conseiller en Stratégie RP", resume: "Stratégie RP complète : cadrage, objectifs, SWOT, angles, outils, rétroplanning, KPI.", repond: "construire un plan RP", url: "famille.html" },
    { famille: "Stratégie & pilotage", couleur: "var(--f-strategie)", titre: "Bilan de retombées", moteur: "Assistant Bilan RP", resume: "Bilan de retombées à partir d'une archive d'articles et d'un tableau de suivi.", repond: "rendre compte des résultats d'une campagne", url: "famille.html" },
    { famille: "Diffusion", couleur: "var(--f-diffusion)", titre: "Relance presse", moteur: "Relance Utile", resume: "Relance d'un journaliste qui n'a pas répondu, sans insistance inutile.", repond: "relancer un journaliste", url: "famille.html" },
    { famille: "Prise de parole", couleur: "var(--f-parole)", titre: "Media training express", moteur: "Coach Prise de Parole", resume: "Préparer un dirigeant à une interview : messages clés, pièges, réponses.", repond: "préparer un dirigeant à une interview", url: "famille.html" },
    { famille: "Rédaction presse", couleur: "var(--f-redaction)", titre: "Levée de fonds", moteur: "Assistant Communiqué de Presse", resume: "Annonce de financement : montant, investisseurs, usage des fonds, citations.", repond: "annoncer une levée de fonds", url: "module.html" },
    { famille: "Veille & analyse", couleur: "var(--f-veille)", titre: "Revue de presse", moteur: "Veilleur RP", resume: "Synthèse des retombées et signaux du secteur sur la période choisie.", repond: "faire une revue de presse", url: "famille.html" }
  ];

  (function () {
    var form = document.querySelector("[data-intent-form]");
    if (!form) return;
    var input = form.querySelector("input[type='search']");
    var results = document.querySelector("[data-results]");
    var list = document.querySelector("[data-results-list]");
    var countEl = document.querySelector("[data-results-count]");
    var empty = document.querySelector("[data-results-empty]");
    var live = document.querySelector("[data-results-live]");

    function norm(s) {
      return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function render(q) {
      var query = norm(q.trim());
      if (!query) { results.hidden = true; if (live) live.textContent = ""; return; }

      var hits = MODULES.filter(function (m) {
        return norm(m.titre + " " + m.famille + " " + m.moteur + " " + m.resume + " " + m.repond).indexOf(query) > -1;
      }).slice(0, 6);

      list.innerHTML = "";
      hits.forEach(function (m) {
        var a = document.createElement("a");
        a.className = "result";
        a.href = m.url;
        a.style.setProperty("--c", m.couleur);
        a.innerHTML =
          '<span class="result-fam">' + m.famille + "</span>" +
          '<span class="grow">' +
            "<h3>" + m.titre + "</h3>" +
            '<span class="engine">' + m.moteur + "</span>" +
            "<p>" + m.resume + "</p>" +
            '<span class="answers">répond à : ' + m.repond + "</span>" +
          "</span>" +
          '<svg class="go" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
        list.appendChild(a);
      });

      results.hidden = false;
      empty.hidden = hits.length > 0;
      list.hidden = hits.length === 0;
      if (countEl) countEl.textContent = hits.length + (hits.length > 1 ? " pistes" : " piste");
      if (live) live.textContent = hits.length + (hits.length > 1 ? " pistes trouvées" : " piste trouvée");
    }

    var timer;
    input.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(function () { render(input.value); }, 160);
    });
    form.addEventListener("submit", function (e) { e.preventDefault(); render(input.value); });

    document.querySelectorAll("[data-suggest]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        input.value = chip.getAttribute("data-suggest");
        input.focus();
        render(input.value);
      });
    });
  })();
})();
