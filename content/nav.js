/* Comportement de la nav sur les pages statiques (blog). L'app React (index.html)
   gère ce même comportement elle-même ; ce script ne tourne que sur les pages
   générées par Eleventy. */
(function () {
  "use strict";
  var header = document.getElementById("top");
  var menuButton = document.querySelector(".menu-button");
  var navLinks = document.querySelector(".nav-links");

  function onScroll() {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", open);
      menuButton.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
      menuButton.classList.toggle("is-open", open);
    });
  }
})();
