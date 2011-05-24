#Copyright 2011 Patchwork Solutions AB. All rights reserved.
#
#Redistribution and use in source and binary forms, with or without
#modification, are permitted provided that the following conditions are met:
#
#     1. Redistributions of source code must retain the above copyright notice,
#       this list of conditions and the following disclaimer.
#
#     2. Redistributions in binary form must reproduce the above copyright
#       notice, this list of conditions and the following disclaimer in the
#       documentation and/or other materials provided with the distribution.
#
#THIS SOFTWARE IS PROVIDED BY Patchwork Solutions AB ``AS IS'' AND ANY EXPRESS
#OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
#OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
#EVENT SHALL Patchwork Solutions AB OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
#INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
#BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
#DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
#OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
#NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
#EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
#
#The views and conclusions contained in the software and documentation are
#those of the authors and should not be interpreted as representing official
#policies, either expressed or implied, of Patchwork Solutions AB.

htmlutils = require '../lib-cov/htmlutils'
htmlgen = require '../lib-cov/htmlgen'

exports.testHtmlUtilsHr = (test, assert) ->
	input = htmlutils.hr

	expectedOutput = '<hr />\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.strictEqual result, expectedOutput
		assert.ok not err?
		test.finish()

exports.testHtmlUtilsBr = (test, assert) ->
	input = htmlutils.br

	expectedOutput = '<br />\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.strictEqual result, expectedOutput
		assert.ok not err?
		test.finish()

exports.testHtmlUtilsBulletedList = (test, assert) ->
	input = htmlutils.bulletedList ['Test1', 'Test2', 'Test3', 'Test4']

	expectedOutput = '<ul>\n<li>\nTest1\n</li>\n<li>\nTest2\n</li>\n' +
		'<li>\nTest3\n</li>\n<li>\nTest4\n</li>\n</ul>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testHtmlUtilsBulletedListWithWrongObject = (test, assert) ->
	pass = false
	try htmlutils.bulletedList {input: 'input'}, 3 
	catch error then pass = true
	
	assert.ok pass
	test.finish()

exports.testHtmlUtilsNumberedList = (test, assert) ->
	input = htmlutils.numberedList ['Test1', 'Test2', 'Test3'], 3

	expectedOutput = '<ol start=\"3\">\n<li>\nTest1\n</li>\n' +
	'<li>\nTest2\n</li>\n<li>\nTest3\n</li>\n</ol>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testHtmlUtilsNumberedListWithoutStart = (test, assert) ->
	input = htmlutils.numberedList ['Test1', 'Test2', 'Test3']

	expectedOutput = '<ol start=\"1\">\n<li>\nTest1\n</li>\n' +
	'<li>\nTest2\n</li>\n<li>\nTest3\n</li>\n</ol>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testHtmlUtilsNumberedListWithWrongObject = (test, assert) ->
	pass = false
	try htmlutils.numberedList({input: 'input'}, 3)
	catch error then pass = true

	assert.ok pass
	test.finish()

exports.testHtmlUtilsDefinitionList = (test, assert) ->
	input = htmlutils.definitionList [
		{item: 'Item1', desc: 'Desc1'}
		{item: 'Item2', desc: 'Desc2'}
		{item: 'Item3', desc: 'Desc3'}
	]

	expectedOutput = '<dl>\n' +
	'<dt>\nItem1\n</dt>\n<dd>\nDesc1\n</dd>\n' +
	'<dt>\nItem2\n</dt>\n<dd>\nDesc2\n</dd>\n' +
	'<dt>\nItem3\n</dt>\n<dd>\nDesc3\n</dd>\n' +
	'</dl>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testHtmlUtilsDefinitionListWithWrongObject = (test, assert) ->
	pass = false
	try htmlutils.definitionList {input: 'input'}
	catch error then pass = true
	assert.ok pass
	test.finish()

exports.testHtmlUtilsCSS = (test, assert) ->
	input = htmlutils.css {sel:'h1', style: {background: 'red'}}

	expectedOutput =
		'<style type=\"text/css\">\n' +
		'h1 { ' +
		'background:red;' +
		' }\n\n' +
		'</style>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testHtmlUtilsCSSWithError = (test, assert) ->
	input = htmlutils.css {sel:'h1', style: null}

	htmlgen.generateHTML input, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testHtmlUtilsCSSSelector = (test, assert) ->
	input = htmlutils.cssSelector 'h1', {background: 'red'}

	expectedOutput =
		'<style type=\"text/css\">\n' +
		'h1 { ' +
		'background:red;' +
		' }\n\n' +
		'</style>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testHtmlUtilsCSSClass = (test, assert) ->
	input = htmlutils.cssClass 'cl', {background: 'red'}

	expectedOutput =
		'<style type=\"text/css\">\n' +
		'.cl { ' +
		'background:red;' +
		' }\n\n' +
		'</style>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testHtmlUtilsCSSSelectorAndClass = (test, assert) ->
	input = htmlutils.cssSelectorAndClass 'h1', 'cl', {background: 'red'}

	expectedOutput =
		'<style type=\"text/css\">\n' +
		'h1.cl { ' +
		'background:red;' +
		' }\n\n' +
		'</style>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testHtmlUtilsCSSId = (test, assert) ->
	input = htmlutils.cssId 'testId', {background: 'red'}

	expectedOutput =
		'<style type=\"text/css\">\n' +
		'#testId { ' +
		'background:red;' +
		' }\n\n' +
		'</style>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

testFunc = () -> 1

	
exports.testHtmlUtilsScript = (test, assert) ->
	input = htmlutils.script testFunc, 'testFunc'

	expectedOutput =
		'<script type=\"text/javascript\">\n' +
		'var testFunc = function () {\n' +
		'  return 1;\n' +
		'}\n' +
		'</script>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testHtmlUtilsLoadScript = (test, assert) ->
	input = htmlutils.loadScript testFunc, 'testFunc'

	expectedOutput =
		'<script type=\"text/javascript\">\n' +
		'var testFunc = function () {\n' +
		'  return 1;\n' +
		'}.call();\n' +
		'</script>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testHtmlUtilsScriptWithUndefined = (test, assert) ->
	pass = false
	try htmlutils.script null, null
	catch error then pass = true

	assert.ok pass
	test.finish()

exports.testHtmlUtilsScriptWithAnonymousFunction = (test, assert) ->
	pass = false
	try htmlutils.script testFunc, null
	catch error then pass = true

	assert.ok pass
	test.finish()

exports.testHtmlUtilsGridLayout = (test, assert) ->
	input = htmlutils.gridLayout ['Test1', 'Test2', 'Test3'], 2

	expectedOutput =
		'<table>\n' +
		'<tr>\n<td>\nTest1\n</td>\n<td>\nTest2\n</td>\n</tr>\n' +
		'<tr>\n<td>\nTest3\n</td>\n</tr>\n' +
		'</table>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.strictEqual result, expectedOutput
		assert.ok not err?
		test.finish()

exports.testHtmlUtilsGridLayoutWrongWidth = (test, assert) ->
	pass = false
	try htmlutils.gridLayout ['Test1', 'Test2', 'Test3'], 'input'
	catch error then pass = true
	assert.ok pass
	test.finish()

exports.testHtmlUtilsGridLayoutWrongArray = (test, assert) ->
	pass = false
	try htmlutils.gridLayout {input: 'input'}, 2
	catch error then pass = true

	assert.ok pass
	test.finish()

exports.testHtmlUtilsScalingGridLayout = (test, assert) ->
	input = htmlutils.scalingGridLayout ['Test1', 'Test2', 'Test3'], 2

	expectedOutput =
		'<table style=\"width:100%;\">\n' +
		'<tr>\n<td>\nTest1\n</td>\n<td>\nTest2\n</td>\n</tr>\n' +
		'<tr>\n<td>\nTest3\n</td>\n</tr>\n' +
		'</table>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.strictEqual result, expectedOutput
		assert.ok not err?
		test.finish()

exports.testHtmlUtilsVerticalLayout = (test, assert) ->
	input = htmlutils.verticalLayout ['Test1', 'Test2', 'Test3']

	expectedOutput =
		'<table>\n' +
		'<tr>\n<td>\nTest1\n</td>\n</tr>\n' +
		'<tr>\n<td>\nTest2\n</td>\n</tr>\n' +
		'<tr>\n<td>\nTest3\n</td>\n</tr>\n' +
		'</table>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.strictEqual result, expectedOutput
		assert.ok not err?
		test.finish()

exports.testHtmlUtilsVerticalScalingLayout = (test, assert) ->
	input = htmlutils.verticalScalingLayout ['Test1', 'Test2', 'Test3']

	expectedOutput =
		'<table style=\"width:100%;\">\n' +
		'<tr>\n<td>\nTest1\n</td>\n</tr>\n' +
		'<tr>\n<td>\nTest2\n</td>\n</tr>\n' +
		'<tr>\n<td>\nTest3\n</td>\n</tr>\n' +
		'</table>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.strictEqual result, expectedOutput
		assert.ok not err?
		test.finish()

exports.testHtmlUtilsHorizontalGridLayout = (test, assert) ->
	input = htmlutils.horizontalGridLayout ['Test1', 'Test2', 'Test3'], 2

	expectedOutput =
		'<table>\n' +
		'<tr>\n<td>\nTest1\n</td>\n<td>\nTest2\n</td>\n</tr>\n' +
		'<tr>\n<td>\nTest3\n</td>\n</tr>\n' +
		'</table>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.strictEqual result, expectedOutput
		assert.ok not err?
		test.finish()

exports.testHtmlUtilsHorizontalGridLayoutWrongHeight = (test, assert) ->
	pass = false

	try htmlutils.horizontalGridLayout ['Test1', 'Test2', 'Test3'], 'input'
	catch error then pass = true

	assert.ok pass
	test.finish()

exports.testHtmlUtilsHorizontalGridLayoutWrongArray = (test, assert) ->
	pass = false
	try htmlutils.horizontalGridLayout {input: 'input'}, 2
	catch error then pass = true

	assert.ok pass
	test.finish()

exports.testHtmlUtilsHorizontalScalingGridLayout = (test, assert) ->
	input = htmlutils.horizontalScalingGridLayout [
		'Test1'
		'Test2'
		'Test3'], 2

	expectedOutput =
		'<table style=\"height:100%;\">\n' +
		'<tr>\n<td>\nTest1\n</td>\n<td>\nTest2\n</td>\n</tr>\n' +
		'<tr>\n<td>\nTest3\n</td>\n</tr>\n' +
		'</table>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.strictEqual result, expectedOutput
		assert.ok not err?
		test.finish()

exports.testHtmlUtilsHorizontalLayout = (test, assert) ->
	input = htmlutils.horizontalLayout ['Test1', 'Test2', 'Test3']

	expectedOutput =
		'<table>\n' +
		'<tr>\n<td>\nTest1\n</td>\n' +
		'<td>\nTest2\n</td>\n' +
		'<td>\nTest3\n</td>\n</tr>\n' +
		'</table>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.strictEqual result, expectedOutput
		assert.ok not err?
		test.finish()

exports.testHtmlUtilsHorzontalScalingLayout = (test, assert) ->
	input = htmlutils.horizontalScalingLayout ['Test1', 'Test2', 'Test3']

	expectedOutput =
		'<table style=\"height:100%;\">\n' +
		'<tr>\n<td>\nTest1\n</td>\n' +
		'<td>\nTest2\n</td>\n' +
		'<td>\nTest3\n</td>\n</tr>\n' +
		'</table>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.strictEqual result, expectedOutput
		assert.ok not err?
		test.finish()

exports.testHtmlUtilsImage = (test, assert) ->
	input = htmlutils.image 'path/image.png', 200, 100

	expectedOutput =
		'<img src=\"path/image.png\" ' +
		'width=\"200\" height=\"100\" />\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.strictEqual result, expectedOutput
		assert.ok not err?
		test.finish()

exports.testHtmlUtilsScalingImage = (test, assert) ->
	input = htmlutils.scalingImage 'path/image.png', 200, 100

	expectedOutput =
		'<img src=\"path/image.png\" ' +
		'width=\"200\" height=\"100\" style=\"width:100%;height:100%;\" />\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.strictEqual result, expectedOutput
		assert.ok not err?
		test.finish()

exports.testHtmlUtilsLink = (test, assert) ->
	input = htmlutils.link 'http://someurl', 'Link text'

	expectedOutput =
		'<a href=\"http://someurl\">\n' +
		'Link text\n' +
		'</a>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.strictEqual result, expectedOutput
		assert.ok not err?
		test.finish()