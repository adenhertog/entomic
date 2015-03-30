fs = require "fs"
path = require "path"
handlebars = require "handlebars"
cheerio = require "cheerio"
Manifest = require "./manifest"
Parser = require "./parser"

_ = require "lodash"

class Entomic
	constructor: (options) ->
		@setDefaults = -> 
			@options = @options || {}
			@options.componentPath = @options.componentPath || "./node_modules"

		@setDefaults()

		@manifest = new Manifest(options)
		@parser = new Parser(@manifest)

		@getTemplate = (component) -> 
			templatePath = @manifest.templatePath component
			if fs.existsSync templatePath
				template = fs.readFileSync templatePath, "utf8"
				return template
			else return "" # components without templates simply remove the snippet

		@transformSnippet = (snippet, componentManifest) -> 
			return @parser.parse snippet, componentManifest

	transform: (html) -> 
		$ = cheerio.load html, { xmlMode: true } # xmlMode enabled for self-closing tags

		result =
			html: null
			scripts: []
			styles: []
			assets: []

		#search for registered components in the html
		for component in @manifest.components
			componentQuery = $(component.name)
			continue unless componentQuery.length

			#add any component scripts/styles to the result
			result.styles.push style for style in @manifest.getStylePaths component
			result.scripts.push script for script in @manifest.getScriptPaths component
			result.scripts.push asset for asset in @manifest.getAssetPaths component

			#transform the html for the matched component
			templateHtml = @getTemplate component
			template = handlebars.default.compile templateHtml

			#flick through and transform each call to this reference 
			for snippet in componentQuery
				model = @transformSnippet snippet, component
				render = template model
				$(snippet).replaceWith render

		result.styles = _.uniq result.styles, 'key'
		result.scripts = _.uniq result.scripts, 'key'
		result.assets = _.uniq result.assets, 'key'

		result.html = $.html()
		return result

module.exports = Entomic