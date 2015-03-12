fs = require "fs"
path = require "path"
$ = require "cheerio"

configuration = require "./config"

class Manifest

	constructor: ->
		@loadJson = (path) ->
			text = fs.readFileSync path, "utf8"
			json = JSON.parse text.toString('utf8').replace(/^\uFEFF/, '')
			return json

		@getComponentManifest = (component) -> 
			return c for c in @components when c.name is component

		@getDirs = (rootDir) ->
			files = fs.readdirSync rootDir
			dirs = []

			for file in files
				if file[0] != '.'
					filePath = "#{rootDir}#{path.sep}#{file}"
					stat = fs.statSync filePath
					dirs.push file if stat.isDirectory()

			return dirs

		@loadComponentManifest = (component) -> 
			return @loadJson path.join(configuration.componentPath, component, "bower.json")

		@loadComponentsFrom = (componentName) -> 
			manifestDir = path.join configuration.componentPath, componentName
			manifest = @loadComponentManifest componentName
			for c in manifest.entomic.components
				c.dir = path.join configuration.componentPath, componentName
				c.styles = manifest.entomic.styles || []
				c.scripts = manifest.entomic.scripts || []
				@components.push c 

		@loadComponents = ->
			@components = []
			@loadComponentsFrom dir for dir in @getDirs configuration.componentPath

		@loadComponents()

	getStylePaths: (component) -> 
		return (path.join component.dir, style for style in component.styles)

	getScriptPaths: (component) -> 
		return (path.join component.dir, script for script in component.scripts)

	templatePath: (component) -> 
		templatePath = ""

		if component.template? then templatePath = component.template
		else templatePath = "template.html"

		templatePath = path.join component.dir, templatePath
		return templatePath

	components: []

module.exports = Manifest