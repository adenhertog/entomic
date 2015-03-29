﻿Entomic = require "../../../Entomic"
fs = require "fs"

describe "bootstrap", -> 

	options = { componentPath: "dist\\test\\components" }
	engine = new Entomic(options)

	fixture = fs.readFileSync __dirname + "/fixture.html", "utf8"
	expected = fs.readFileSync __dirname + "/expected.html", "utf8"

	describe "when transforming a component", -> 
		result = engine.transform fixture

		it "should return the correct html", -> 
			expect(result.html).toEqual expected

		it "should include the bootstrap css file in the result", -> 
			expect(result.styles).toEqual ["dist\\test\\components\\entomic-bootstrap\\bootstrap.css"]