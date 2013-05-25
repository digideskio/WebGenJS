fs = require 'fs'
{exec} = require 'child_process'

srcDir = 'src'
genDir = 'gen'

libSrcDir = "#{srcDir}/lib"
testSrcDir = "../#{srcDir}/test"
libGenDir = "#{genDir}/lib"
testGenDir = "test"
libGenCovDir = "lib-cov"
testReportPath = "report.txt"

build = (src, dst, callback) ->
	fs.readdir src, (err, files) ->
		count = 0
		for file, index in files then do (file, index) ->
			count++
			exec "coffee --bare --output #{dst} --compile
			 #{src}/#{file}", (err, stdout, stderr) ->
				console.log "Compiled #{file}"
				console.log stderr if stderr
				console.log stdout if stdout
				console.log err if err
				count--
				callback() if count is 0 and callback?

pretest = (callback) ->
	process.chdir genDir
	build testSrcDir, testGenDir, ->
		fs.readdir testGenDir, (err, files) ->
			paths = files.map (file) -> "#{testGenDir}/#{file}"
			pathsString = paths.join ' '
			callback pathsString if callback?

posttest = (err, stdout, stderr, callback) ->
	console.log stderr if stderr
	console.log stdout if stdout
	console.log err if err
	fs.writeFile testReportPath, stdout, (err) ->
		console.log err if err
	callback() if callback?
    
test = (callback) ->
	pretest (pathsString) ->
		exec "NODE_PATH=lib-cov/ whiskey --coverage -t \"#{pathsString}\"",
		(err, stdout, stderr) ->
			posttest err, stdout, stderr, ->
				callback() if callback?

htmltest = (callback) ->
	pretest (pathsString, callback) ->
		exec "whiskey --coverage
		--coverage-reporter html --coverage-dir cov
		-t \"#{pathsString}\"",
		(err, stdout, stderr) ->
			posttest err, stdout, stderr, ->
				callback() if callback?

buildAll = (callback) ->
	build libSrcDir, libGenDir, callback

task 'all', 'build and test all', ->
	buildAll ->
		test()

task 'build', 'build all files', ->
	buildAll()

task 'test', 'run all tests', ->
	test()

task 'test-html', 'run all tests with html coverage report', ->
	htmltest()

