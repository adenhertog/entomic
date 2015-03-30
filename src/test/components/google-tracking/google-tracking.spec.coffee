Entomic = require "../../../Entomic"
fs = require "fs"

describe "google-tracking", -> 

	options = {componentPath: "dist\\test\\components"}
	engine = new Entomic(options)

	fixture = fs.readFileSync __dirname + "/fixture.html", "utf8"
	expected = fs.readFileSync __dirname + "/expected.html", "utf8"

	describe "when transforming a component", -> 
		result = engine.transform fixture

		it "should return the correct html", -> 
			expect(result.html).toEqual expected

		it "should include the script", -> 
			expect(result.scripts).toContain { library: "entomic-google-tracking", path: "script.js", key: 1104760460 }