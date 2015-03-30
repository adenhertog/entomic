var Entomic, Manifest, Parser, _, cheerio, fs, handlebars, path;

fs = require("fs");

path = require("path");

handlebars = require("handlebars");

cheerio = require("cheerio");

Manifest = require("./manifest");

Parser = require("./parser");

_ = require("lodash");

Entomic = (function() {
  function Entomic(options) {
    this.setDefaults = function() {
      this.options = this.options || {};
      return this.options.componentPath = this.options.componentPath || "./node_modules";
    };
    this.setDefaults();
    this.manifest = new Manifest(options);
    this.parser = new Parser(this.manifest);
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
    var $, asset, component, componentQuery, i, j, k, l, len, len1, len2, len3, len4, m, model, ref, ref1, ref2, ref3, render, result, script, snippet, style, template, templateHtml;
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
        result.styles.push(style);
      }
      ref2 = this.manifest.getScriptPaths(component);
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        script = ref2[k];
        result.scripts.push(script);
      }
      ref3 = this.manifest.getAssetPaths(component);
      for (l = 0, len3 = ref3.length; l < len3; l++) {
        asset = ref3[l];
        result.scripts.push(asset);
      }
      templateHtml = this.getTemplate(component);
      template = handlebars["default"].compile(templateHtml);
      for (m = 0, len4 = componentQuery.length; m < len4; m++) {
        snippet = componentQuery[m];
        model = this.transformSnippet(snippet, component);
        render = template(model);
        $(snippet).replaceWith(render);
      }
    }
    result.styles = _.uniq(result.styles, 'key');
    result.scripts = _.uniq(result.scripts, 'key');
    result.assets = _.uniq(result.assets, 'key');
    result.html = $.html();
    return result;
  };

  return Entomic;

})();

module.exports = Entomic;
