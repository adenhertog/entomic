exports.defaults = ->
	entomic:
		extensions: [ "html", "htm" ]
		componentPath: "./component"
		styleOutput: "bin/public/stylesheets"
		scriptOutput: "bin/public/javascripts"

exports.validate = (mimosaConfig, validators) -> 
	return []