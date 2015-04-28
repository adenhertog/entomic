#!/usr/bin/env node
var AdmZip, finished, fs, path, program, publish, request, unpublish;

fs = require("fs");

path = require("path");

program = require("commander");

AdmZip = require("adm-zip");

request = require("request");

process.env.INIT_CWD = process.cwd();

finished = false;

publish = function(dir) {
  var formData, manifest, manifestPath, manifestText, name, zip, zipBuffer;
  manifestPath = path.join(dir, "package.json");
  manifestText = fs.readFileSync(manifestPath, "utf8");
  manifestText = manifestText.substring(manifestText.indexOf('{'));
  manifest = JSON.parse(manifestText);
  name = manifest.name;
  zip = new AdmZip();
  zip.addLocalFolder(dir);
  zipBuffer = zip.toBuffer();
  formData = {
    "package": {
      value: zipBuffer,
      options: {
        filename: name + ".zip",
        contentType: "application/zip"
      }
    }
  };
  return request.post({
    url: "http://localhost:9000/api/component",
    formData: formData
  }, function(err, res, body) {
    if (err != null) {
      return console.log("Error publishing: " + name + "\nDetails: " + err);
    } else {
      return console.log("Successfully published: " + name);
    }
  });
};

unpublish = function(pkg) {
  return request.del("http://localhost:9000/api/component/" + pkg, function(err, res, body) {
    if (err != null) {
      return console.log("Error unpublishing: " + name + "\nDetails: " + err);
    } else {
      return console.log("Successfully unpublished: " + pkg);
    }
  });
};

program.command("publish <dir>").description("publishes a directory to the entomic repository").action(publish);

program.command("unpublish <package>").description("removes a package from the entomic repository").action(unpublish);

program.parse(process.argv);
