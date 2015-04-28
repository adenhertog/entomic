fs = require "fs"
path = require "path"

program = require "commander"
AdmZip = require "adm-zip"
request = require "request"

process.env.INIT_CWD = process.cwd()
finished = false

publish = (dir) -> 
	# get package name
	manifestPath = path.join dir, "package.json"
	manifestText = fs.readFileSync manifestPath, "utf8"
	manifestText = manifestText.substring(manifestText.indexOf('{'))
	manifest = JSON.parse manifestText
	name = manifest.name

	# zip up the folder
	zip = new AdmZip()
	zip.addLocalFolder dir

	zipBuffer = zip.toBuffer() 

	# upload 
	formData =
		package: 
			value: zipBuffer
			options:
				filename: "#{name}.zip"
				contentType: "application/zip"

	request.post { url: "http://localhost:9000/api/component", formData: formData }, (err, res, body) ->
		if err? then console.log "Error publishing: #{name}\nDetails: #{err}"
		else console.log "Successfully published: #{name}"

unpublish = (pkg) -> 
	request.del "http://localhost:9000/api/component/#{pkg}", (err, res, body) ->
		if err? then console.log "Error unpublishing: #{name}\nDetails: #{err}"
		else console.log "Successfully unpublished: #{pkg}"

program
.command "publish <dir>"
.description "publishes a directory to the entomic repository"
.action publish

program
.command "unpublish <package>"
.description "removes a package from the entomic repository"
.action unpublish

program.parse process.argv