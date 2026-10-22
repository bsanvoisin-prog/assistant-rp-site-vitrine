module.exports = function (eleventyConfig) {
  // Fichiers déjà construits (SPA existante, patch, assets) : copiés tels quels
  // à la racine de la sortie, jamais passés dans un moteur de template.
  eleventyConfig.addPassthroughCopy({ "static": "." });

  // Interface d'administration Decap CMS : copiée telle quelle sous /admin.
  eleventyConfig.addPassthroughCopy({ admin: "admin" });

  // Fichiers du blog qui ne sont pas des templates Nunjucks/Markdown.
  eleventyConfig.addPassthroughCopy("content/blog.css");
  eleventyConfig.addPassthroughCopy("content/nav.js");
  eleventyConfig.addPassthroughCopy({ "content/blog/uploads": "blog/uploads" });

  eleventyConfig.addFilter("readableDate", function (dateObj) {
    if (!dateObj) return "";
    var d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    if (isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(d);
  });

  // Date au format ISO (AAAA-MM-JJ) : utilisée dans sitemap.xml (lastmod) et
  // dans les métadonnées article (OG/Twitter), jamais affichée aux visiteurs.
  eleventyConfig.addFilter("isoDate", function (dateObj) {
    if (!dateObj) return "";
    var d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
  });

  // Convertit du HTML simple (gabarit article) en texte brut : utilisé pour
  // générer une meta description par défaut quand l'article n'a pas d'extrait.
  eleventyConfig.addFilter("stripTags", function (html) {
    if (!html) return "";
    return String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  });

  // Sérialisation JSON sûre pour les blocs JSON-LD (données structurées) :
  // JSON.stringify échappe correctement guillemets/accents, à la différence
  // d'un simple affichage de variable.
  eleventyConfig.addFilter("jsonify", function (value) {
    return JSON.stringify(value);
  });

  return {
    dir: {
      input: "content",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
