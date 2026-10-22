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
