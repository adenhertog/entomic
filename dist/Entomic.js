var Entomic, Manifest, Parser, _, cheerio, fs, handlebars, path;

fs = require("fs");

path = require("path");

handlebars = require("handlebars");

cheerio = require("cheerio");

Manifest = require("./manifest");

Parser = require("./parser");

_ = require("lodash");

Entomic = (function() {
  function Entomic() {
    this.manifest = new Manifest();
    this.parser = new Parser();
    this.getTemplate = function(component) {
      var template, templatePath;
      templatePath = this.manifest.templatePath(component);
      if (fs.existsSync(templatePath)) {
        template = fs.readFileSync(templatePath, "utf8");
        return template;
      } else {
        return "";
      }
    };
    this.transformSnippet = function(snippet, componentManifest) {
      return this.parser.parse(snippet, componentManifest);
    };
  }

  Entomic.prototype.transform = function(html) {
    var $, component, componentQuery, i, j, k, l, len, len1, len2, len3, model, ref, ref1, ref2, render, result, script, snippet, style, template, templateHtml;
    $ = cheerio.load(html, {
      xmlMode: true
    });
    result = {
      html: null,
      scripts: [],
      styles: [],
      assets: []
    };
    ref = this.manifest.components;
    for (i = 0, len = ref.length; i < len; i++) {
      component = ref[i];
      componentQuery = $(component.name);
      if (!componentQuery.length) {
        continue;
      }
      ref1 = this.manifest.getStylePaths(component);
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        style = ref1[j];
        if (result.styles.indexOf(style) < 0) {
          result.styles.push(style);
        }
      }
      ref2 = this.manifest.getScriptPaths(component);
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        script = ref2[k];
        if (result.scripts.indexOf(script) < 0) {
          result.scripts.push(script);
        }
      }
      templateHtml = this.getTemplate(component);
      template = handlebars["default"].compile(templateHtml);
      for (l = 0, len3 = componentQuery.length; l < len3; l++) {
        snippet = componentQuery[l];
        model = this.transformSnippet(snippet, component);
        render = template(model);
        $(snippet).replaceWith(render);
      }
    }
    result.html = $.html();
    return result;
  };

  return Entomic;

})();

module.exports = Entomic;
