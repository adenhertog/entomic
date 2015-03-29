fs = require "fs"
path = require "path"
$ = require "cheerio"
_ = require "lodash"

Manifest = require "./manifest"

# Parser
# Responsible for converting an HTML snippet into a JSON data structure
class Parser
	constructor: (@manifest) -> 

		@parseNode = (spec, query) -> 
			model = {}

			for key, prop of spec
				element = query.find("> #{key}")
				if spec[key].type is "object" then model[key] = @parseNode prop, query.find("> #{key}")
				else model[key] = query.find("> #{key}").html()

			return model

	# parses the model out from an HTML component snippet
	parse: (html, componentManifest) -> 
		# 1. find the component name
		query = $(html)

		unless componentManifest?
			componentName = query.get(0).tagName
			return null unless _.some(@manifest.components, { name: componentName })
			componentManifest = @manifest.getComponentManifest componentName

		# 2. get the model from the manifest for that component
		spec = componentManifest.model

		# 3. walk the model tree, converting the elements -> json
		model = @parseNode spec, query

		# 4. validate the model 
			#TODO - this needs to be validated against the model spec in the manifest

		# 5. return the model
		return model

module.exports = Parser