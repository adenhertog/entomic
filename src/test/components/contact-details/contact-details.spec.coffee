Entomic = require "../../../Entomic"
configuration = require "../../../config"
fs = require "fs"

describe "contact-details", -> 

	configuration.componentPath = "dist\\test\\components"
	engine = new Entomic()

	fixture = fs.readFileSync __dirname + "/fixture.html", "utf8"
	expected = fs.readFileSync __dirname + "/expected.html", "utf8"

	describe "when transforming a component", -> 
		it "should return the correct html", -> 
			result = engine.transform fixture
			expect(result.html).toEqual expected