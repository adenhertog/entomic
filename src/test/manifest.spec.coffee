Manifest = require "../manifest"
configuration = require "../config"

describe "manifest", -> 
	manifest = null

	configuration.componentPath = "dist\\test\\components"
	manifest = new Manifest()

	describe "when initializing the manifest", -> 
		it "should resolve all the available components", -> 
			expect(manifest.components.length).not.toBe(0)