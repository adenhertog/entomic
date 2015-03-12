Parser = require "../parser"
configuration = require "../config"

describe "parser", -> 
	parser = null

	beforeEach -> 
		configuration.componentPath = "dist\\test\\components"
		parser = new Parser()

	describe "when parsing a basic html with registered component", -> 
		it "should return the model for that component", -> 
			model = parser.parse "<contact-details><phone>123</phone></contact-details>"
			expect(model.phone).toBe("123")

	describe "when parsing a basic html without a registered component", ->
		it "should return null", -> 
			model = parser.parse "<contact-details-fake><phone>123</phone></contact-details-fake>"
			expect(model).toBeNull()
