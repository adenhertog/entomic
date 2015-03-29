Manifest = require "../manifest"
Parser = require "../parser"

describe "parser", -> 
	parser = null

	beforeEach -> 
		opts = 
			componentPath: "dist\\test\\components"
		manifest = new Manifest(opts)
		parser = new Parser(manifest)

	describe "when parsing a basic html with registered component", -> 
		it "should return the model for that component", -> 
			model = parser.parse "<contact-details><phone>123</phone></contact-details>"
			expect(model.phone).toBe("123")

	describe "when parsing a basic html without a registered component", ->
		it "should return null", -> 
			model = parser.parse "<contact-details-fake><phone>123</phone></contact-details-fake>"
			expect(model).toBeNull()
