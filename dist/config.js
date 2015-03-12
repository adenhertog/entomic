exports.defaults = function() {
  return {
    entomic: {
      extensions: ["html", "htm"],
      componentPath: "./component",
      styleOutput: "bin/public/stylesheets",
      scriptOutput: "bin/public/javascripts"
    }
  };
};

exports.validate = function(mimosaConfig, validators) {
  return [];
};
