Entomic = require "../../../Entomic"
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
			expect(result.styles).toContain { library: "entomic-bootstrap", path: "entomic-bootstrap.css", key: 11596168 }

		it "should include dependant component styles", -> 
			expect(result.styles).toContain { library: "bootstrap-ui", path: "bootstrap-ui.css", key: 1902095368 }

		it "should contain library scripts", -> 
			expect(result.scripts).toContain { library: "bootstrap-ui", path: "bootstrap-ui.js", key: 593737682 }

		it "should contain library dependency scripts", -> 
			expect(result.scripts).toContain { library: 'bootstrap', path: 'bootstrap.js', key: 635438866 }