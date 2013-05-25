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

xmlgen = require '../lib-cov/xmlgen'

exports.testXMLWithoutBody = (test, assert) ->
	input = {tag: 'tag'}
	expectedOutput = '<tag />\n'
	xmlgen.generateXML input, null, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testXMLWithStringAsBody = (test, assert) ->
	input = {tag: 'tag', body: 'body'}
	expectedOutput = '<tag>\nbody\n</tag>\n'

	xmlgen.generateXML input, null, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testXMLWithNumberAsBody = (test, assert) ->
	input = {tag: 'tag', body: 3}
	expectedOutput = '<tag>\n3\n</tag>\n'

	xmlgen.generateXML input, null, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testXMLWithStringArrayAsBody = (test, assert) ->
	input = {tag: 'tag', body: ['body']}
	expectedOutput = '<tag>\nbody\n</tag>\n'

	xmlgen.generateXML input, null, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testXMLWithTagArrayAsBody = (test, assert) ->
	input = {tag: 'tag1', body: [
		'body1',
		{tag: 'tag2', body: 'body2'},
		{tag: 'tag3', body: 'body3'},
	]}

	expectedOutput = '<tag1>' +
		'\nbody1\n' +
		'<tag2>\nbody2\n</tag2>\n' +
		'<tag3>\nbody3\n</tag3>\n' +
		'</tag1>\n'

	xmlgen.generateXML input, null, (err, result) ->
		assert.strictEqual(err, null)
		assert.strictEqual(result, expectedOutput)
		test.finish()

exports.testXMLWithBodyAsFunction = (test, assert) ->
	input = {tag: 'tag', body: (callback) -> callback null, 'body' }
	expectedOutput = '<tag>\nbody\n</tag>\n'

	xmlgen.generateXML input, null, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testXMLAsFunction = (test, assert) ->
	input = (callback) -> callback null, {tag: 'tag', body: 'body'}

	expectedOutput = '<tag>\nbody\n</tag>\n'

	xmlgen.generateXML input, null, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testXMLWithArrayWithFunctionAsBody = (test, assert) ->
	input = {tag: 'tag', body: [ 'body1', (callback) ->
		callback null, 'body2' ]}

	expectedOutput = '<tag>\nbody1\nbody2\n</tag>\n'

	xmlgen.generateXML input, null, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testXMLWithoutBodyWithAttribute = (test, assert) ->
	input = {tag: 'tag', attr:'attrvalue'}
	expectedOutput = '<tag attr=\"attrvalue\" />\n'

	xmlgen.generateXML input, null, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testXMLWithFunctionAsAttribute = (test, assert) ->
	input = {tag: 'tag', attr: (callback) ->
		callback null, 'attrvalue' }
	expectedOutput = '<tag attr=\"attrvalue\" />\n'

	xmlgen.generateXML input, null, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testXMLWithFunctionAsAttributeWithError = (test, assert) ->
	input = {tag: 'tag', attr: (callback) ->
		callback new Error 'TestError'}

	xmlgen.generateXML input, null, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testXMLWithFunctionAsTag = (test, assert) ->
	input = {tag: (callback) -> callback null, 'tagname'}

	expectedOutput = '<tagname />\n'

	xmlgen.generateXML input, null, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testXMLWithFunctionAsTagWithError = (test, assert) ->
	input = {tag: (callback) -> callback new Error 'TestError'}

	xmlgen.generateXML input, null, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testXMLWithBodyAndAttribute = (test, assert) ->
	input = {attr1: 'attrvalue1', body:[
		{tag: 'tag2', body: 'body2'},
		{body: 'body3'},
		{attr2: 'attrvalue2'}
	]}
	expectedOutput = '<defaulttag attr1=\"attrvalue1\">\n' +
		'<tag2>\nbody2\n</tag2>\n' +
		'<defaulttag>\nbody3\n</defaulttag>\n' +
		'<defaulttag attr2=\"attrvalue2\" />\n' +
		'</defaulttag>\n'

	xmlgen.generateXML input, {defaultTag:'defaulttag'}, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testXMLWithAttributeGenerator = (test, assert) ->
	attributeValue = 'attrvalue1'
	attributeValueRepl = 'attrvaluerepl1'

	input =
		tag: 'tag'
		attr1: attributeValue
		attr2: 'attrvalue2'

	generateAttribute = (attribute, callback) ->
		assert.strictEqual attribute, attributeValue
		callback null, [attributeValueRepl]

	expectedOutput = '<tag attr1=\"' + attributeValueRepl +
		'\" attr2=\"attrvalue2\" />\n'


	xmlgen.generateXML input, {
		attributeGenerators:{attr1: generateAttribute}
	}, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testXMLWithAttributeGeneratorWithError = (test, assert) ->
	attributeValue = 'attrvalue1'
	attributeValueRepl = 'attrvaluerepl1'

	input =
		tag: 'tag',
		attr1: attributeValue,
		attr2: 'attrvalue2'

	generateAttribute = (attribute, callback) ->
		callback new Error 'TestError'

	xmlgen.generateXML input, {
		attributeGenerators:{attr1: generateAttribute}
	}, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testXMLWithoutTagAndDefaultTag = (test, assert) ->
	input = {body: 'body'}

	xmlgen.generateXML input, null, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testXMLWithJSMLObject = (test, assert) ->
	class JSMLObject
		toJSML: (callback) ->
			callback null, {tag: 'tag1', body: {tag: 'tag2'}}

	input = new JSMLObject

	expectedOutput = '<tag1>\n<tag2 />\n</tag1>\n'

	xmlgen.generateXML input, null, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testXMLWithJSMLObjectWithError = (test, assert) ->
	input = {input: 'input'}

	xmlgen.generateXML input, null, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testXMLWithXMLObjectWithError = (test, assert) ->
	class JSMLObject
		toJSML: (callback) ->
			callback new Error 'TestError'

	input = new JSMLObject

	xmlgen.generateXML input, null, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testXMLAsFunctionWithError = (test, assert) ->
	input = (callback) -> callback new Error 'TestError'

	xmlgen.generateXML input, null, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testXMLWithWrongObjectInBody = (test, assert) ->
	input = {tag:'tag', body: {errordata: null}}

	xmlgen.generateXML input, null, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testXMLWithUndefinedInBodyArray = (test, assert) ->
	tmp = {tmp: 'tmp'}
	input = {tag:'tag', body: [tmp.empty]}

	xmlgen.generateXML input, null, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testXMLWithNullInBodyArray = (test, assert) ->
	input = {tag:'tag', body: [null]}

	xmlgen.generateXML input, null, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testXMLWith100Tags = (test, assert) ->
	body = []
	input = {tag: 'tag', body: body}
	expectedOutput = '<tag>\n'

	for i in [100..1]
		body.push {tag: 'tag', body:'body'}
		expectedOutput = expectedOutput.concat '<tag>\nbody\n</tag>\n'

	expectedOutput = expectedOutput.concat '</tag>\n'
	xmlgen.generateXML input, null, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()
