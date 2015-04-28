var $, Manifest, fs, hash, path;

fs = require("fs");

path = require("path");

$ = require("cheerio");

hash = require("string-hash");

Manifest = (function() {
  function Manifest(options) {
    this.options = options;
    this.loadJson = function(path) {
      var e, json, text;
      text = "";
      try {
        text = fs.readFileSync(path, "utf8");
      } catch (_error) {
        e = _error;
        if (e.code === "ENOENT") {
          return null;
        } else {
          throw e;
        }
      }
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
          filePath = path.join(rootDir, file);
          stat = fs.statSync(filePath);
          if (stat.isDirectory()) {
            dirs.push(file);
          }
        }
      }
      return dirs;
    };
    this.loadComponentManifest = function(component) {
      return this.loadJson(path.join(this.options.componentPath, component, "package.json"));
    };
    this.loadComponentsFrom = function(componentName) {
      var c, i, len, manifest, ref, results;
      manifest = this.loadComponentManifest(componentName);
      if (!((manifest != null) && (manifest.entomic != null))) {
        return;
      }
      ref = manifest.entomic.components;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        c = ref[i];
        c.dir = path.join(this.options.componentPath, componentName);
        c.manifest = manifest;
        results.push(this.components.push(c));
      }
      return results;
    };
    this.loadComponents = function() {
      var dir, i, len, ref, results;
      this.components = [];
      ref = this.getDirs(this.options.componentPath);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        dir = ref[i];
        results.push(this.loadComponentsFrom(dir));
      }
      return results;
    };
    this.loadComponents();
    this.getResourcePaths = function(component, resource) {
      var dependency, i, j, k, l, len, len1, len2, len3, len4, len5, len6, m, n, o, ref, ref1, ref2, ref3, ref4, ref5, resourcePath, result;
      result = [];
      if (component[resource] != null) {
        ref = component[resource];
        for (i = 0, len = ref.length; i < len; i++) {
          resourcePath = ref[i];
          result.push({
            library: component.manifest.name,
            component: component.name,
            path: resourcePath
          });
        }
      }
      if (component.manifest.entomic[resource] != null) {
        ref1 = component.manifest.entomic[resource];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          resourcePath = ref1[j];
          result.push({
            library: component.manifest.name,
            path: resourcePath
          });
        }
      }
      if (component.manifest.entomic.dependencies != null) {
        ref2 = component.manifest.entomic.dependencies;
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          dependency = ref2[k];
          if (dependency[resource] != null) {
            ref3 = dependency[resource];
            for (l = 0, len3 = ref3.length; l < len3; l++) {
              resourcePath = ref3[l];
              result.push({
                library: dependency.name,
                path: resourcePath
              });
            }
          }
        }
      }
      if (component.dependencies != null) {
        ref4 = component.dependencies;
        for (m = 0, len4 = ref4.length; m < len4; m++) {
          dependency = ref4[m];
          if (dependency[resource] != null) {
            ref5 = dependency[resource];
            for (n = 0, len5 = ref5.length; n < len5; n++) {
              resourcePath = ref5[n];
              result.push({
                library: dependency.name,
                path: resourcePath
              });
            }
          }
        }
      }
      for (o = 0, len6 = result.length; o < len6; o++) {
        resource = result[o];
        resource.key = hash("" + resource.library + (resource.component || '') + resource.path);
      }
      return result;
    };
  }

  Manifest.prototype.getStylePaths = function(component) {
    return this.getResourcePaths(component, "styles");
  };

  Manifest.prototype.getScriptPaths = function(component) {
    return this.getResourcePaths(component, "scripts");
  };

  Manifest.prototype.getAssetPaths = function(component) {
    return this.getResourcePaths(component, "assets");
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
