var $, Manifest, Parser, _, fs, path;

fs = require("fs");

path = require("path");

$ = require("cheerio");

_ = require("lodash");

Manifest = require("./manifest");

Parser = (function() {
  function Parser(manifest) {
    this.manifest = manifest;
    this.parseNode = function(spec, query) {
      var element, key, model, prop;
      model = {};
      for (key in spec) {
        prop = spec[key];
        element = query.find("> " + key);
        if (spec[key].type === "object") {
          model[key] = this.parseNode(prop, query.find("> " + key));
        } else {
          model[key] = query.find("> " + key).html();
        }
      }
      return model;
    };
  }

  Parser.prototype.parse = function(html, componentManifest) {
    var componentName, model, query, spec;
    query = $(html);
    if (componentManifest == null) {
      componentName = query.get(0).tagName;
      if (!_.some(this.manifest.components, {
        name: componentName
      })) {
        return null;
      }
      componentManifest = this.manifest.getComponentManifest(componentName);
    }
    spec = componentManifest.model;
    model = this.parseNode(spec, query);
    return model;
  };

  return Parser;

})();

module.exports = Parser;
