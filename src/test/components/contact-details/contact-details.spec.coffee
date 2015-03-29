Entomic = require "../../../Entomic"
fs = require "fs"

describe "contact-details", -> 

	options = { componentPath: "dist\\test\\components" }
	engine = new Entomic(options)

	fixture = fs.readFileSync __dirname + "/fixture.html", "utf8"
	expected = fs.readFileSync __dirname + "/expected.html", "utf8"

	describe "when transforming a component", -> 
		it "should return the correct html", -> 
			result = engine.transform fixture
			expect(result.html).toEqual expected