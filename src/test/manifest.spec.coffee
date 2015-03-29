Manifest = require "../manifest"
fs = require "fs"

describe "manifest", -> 
	manifest = null

	describe "when initializing the manifest", -> 
		it "should resolve all the available components", -> 
			opts = { componentPath: "dist\\test\\components" }
			manifest = new Manifest(opts)
			expect(manifest.components.length).not.toBe(0)

		it "should load no components for an empty directory", -> 
			opts = { componentPath: "dist\\test\\empty-component" }
			manifest = new Manifest(opts)
			expect(manifest.components.length).toBe(0)

		it "should error on loading components for a non-existent folder", -> 
			opts = { componentPath: "dist\\test\\phantom-component" }
			expect(-> new Manifest(opts)).toThrow(new Error("ENOENT, no such file or directory '#{__dirname}\\phantom-component'"))
