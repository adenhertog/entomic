fs = require "fs"
path = require "path"
$ = require "cheerio"
hash = require "string-hash"

class Manifest

	constructor: (@options) ->
		@loadJson = (path) ->
			text = ""
			try
				text = fs.readFileSync path, "utf8"
			catch e
				if e.code is "ENOENT" then return null #return null if (bower) file not exists
				else throw e

			json = JSON.parse text.toString('utf8').replace(/^\uFEFF/, '')
			return json

		@getComponentManifest = (component) -> 
			return c for c in @components when c.name is component

		@getDirs = (rootDir) ->
			files = fs.readdirSync rootDir
			dirs = []

			for file in files
				if file[0] != '.'
					filePath = path.join rootDir, file
					stat = fs.statSync filePath
					dirs.push file if stat.isDirectory()

			return dirs

		@loadComponentManifest = (component) -> 
			return @loadJson path.join(@options.componentPath, component, "packages.json")

		@loadComponentsFrom = (componentName) -> 
			manifest = @loadComponentManifest componentName
			return unless manifest? and manifest.entomic?

			for c in manifest.entomic.components
				c.dir = path.join @options.componentPath, componentName
				c.manifest = manifest
				@components.push c 

		@loadComponents = ->
			@components = []
			@loadComponentsFrom dir for dir in @getDirs @options.componentPath

		@loadComponents()

		#resource = styles|scripts|assets
		@getResourcePaths = (component, resource) -> 
			result = []

			if component[resource]? 
				result.push { library: component.manifest.name, component: component.name, path: resourcePath } for resourcePath in component[resource]

			# library-level resources
			if component.manifest.entomic[resource]? 
				result.push { library: component.manifest.name, path: resourcePath } for resourcePath in component.manifest.entomic[resource]

			# library-level dependency resources
			if component.manifest.entomic.dependencies?
				for dependency in component.manifest.entomic.dependencies
					if dependency[resource]?
						for resourcePath in dependency[resource]
							result.push {library: dependency.name, path: resourcePath }

			# component-level dependency resources
			if component.dependencies?
				for dependency in component.dependencies
					if dependency[resource]?
						result.push { library: dependency.name, path: resourcePath } for resourcePath in dependency[resource]

			for resource in result
				resource.key = hash "#{resource.library}#{resource.component || ''}#{resource.path}"
		
			return result

	getStylePaths: (component) -> @getResourcePaths component, "styles"

	getScriptPaths: (component) -> @getResourcePaths component, "scripts"

	getAssetPaths: (component) -> @getResourcePaths component, "assets"

	templatePath: (component) -> 
		templatePath = ""

		if component.template? then templatePath = component.template
		else templatePath = "template.html"

		templatePath = path.join component.dir, templatePath
		return templatePath

	components: []

module.exports = Manifest