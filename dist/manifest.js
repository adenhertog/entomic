var $, Manifest, configuration, fs, path;

fs = require("fs");

path = require("path");

$ = require("cheerio");

configuration = require("./config");

Manifest = (function() {
  function Manifest() {
    this.loadJson = function(path) {
      var json, text;
      text = fs.readFileSync(path, "utf8");
      json = JSON.parse(text.toString('utf8').replace(/^\uFEFF/, ''));
      return json;
    };
    this.getComponentManifest = function(component) {
      var c, i, len, ref;
      ref = this.components;
      for (i = 0, len = ref.length; i < len; i++) {
        c = ref[i];
        if (c.name === component) {
          return c;
        }
      }
    };
    this.getDirs = function(rootDir) {
      var dirs, file, filePath, files, i, len, stat;
      files = fs.readdirSync(rootDir);
      dirs = [];
      for (i = 0, len = files.length; i < len; i++) {
        file = files[i];
        if (file[0] !== '.') {
          filePath = "" + rootDir + path.sep + file;
          stat = fs.statSync(filePath);
          if (stat.isDirectory()) {
            dirs.push(file);
          }
        }
      }
      return dirs;
    };
    this.loadComponentManifest = function(component) {
      return this.loadJson(path.join(configuration.componentPath, component, "bower.json"));
    };
    this.loadComponentsFrom = function(componentName) {
      var c, i, len, manifest, manifestDir, ref, results;
      manifestDir = path.join(configuration.componentPath, componentName);
      manifest = this.loadComponentManifest(componentName);
      ref = manifest.entomic.components;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        c = ref[i];
        c.dir = path.join(configuration.componentPath, componentName);
        c.styles = manifest.entomic.styles || [];
        c.scripts = manifest.entomic.scripts || [];
        results.push(this.components.push(c));
      }
      return results;
    };
    this.loadComponents = function() {
      var dir, i, len, ref, results;
      this.components = [];
      ref = this.getDirs(configuration.componentPath);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        dir = ref[i];
        results.push(this.loadComponentsFrom(dir));
      }
      return results;
    };
    this.loadComponents();
  }

  Manifest.prototype.getStylePaths = function(component) {
    var style;
    return (function() {
      var i, len, ref, results;
      ref = component.styles;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        style = ref[i];
        results.push(path.join(component.dir, style));
      }
      return results;
    })();
  };

  Manifest.prototype.getScriptPaths = function(component) {
    var script;
    return (function() {
      var i, len, ref, results;
      ref = component.scripts;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        script = ref[i];
        results.push(path.join(component.dir, script));
      }
      return results;
    })();
  };

  Manifest.prototype.templatePath = function(component) {
    var templatePath;
    templatePath = "";
    if (component.template != null) {
      templatePath = component.template;
    } else {
      templatePath = "template.html";
    }
    templatePath = path.join(component.dir, templatePath);
    return templatePath;
  };

  Manifest.prototype.components = [];

  return Manifest;

})();

module.exports = Manifest;
