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

htmlgen = require '../lib-cov/htmlgen'

exports.testHtmlWithoutBody = (test, assert) ->
	input = {tag: 'p'}
	expectedOutput = '<p />\n'
	htmlgen.generateHTML input, (err, result) ->
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testHtmlWithStringAsBody = (test, assert) ->
	input = {tag: 'p', body: 'body'}
	expectedOutput = '<p>\nbody\n</p>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testHtmlWithStringArrayAsBody = (test, assert) ->
	input = {tag: 'p', body: ['body']}
	expectedOutput = '<p>\nbody\n</p>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testHtmlWithTagArrayAsBody = (test, assert) ->
	input = {tag: 'div', body: [
		'body1'
		{tag: 'h1', body: 'body2'}
		{tag: 'p', body: 'body3'}
	]}

	expectedOutput = '<div>' +
		'\nbody1\n' +
		'<h1>\nbody2\n</h1>\n' +
		'<p>\nbody3\n</p>\n' +
		'</div>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testHtmlWithFunctionAsBody = (test, assert) ->
	input = {tag: 'p', body: (callback) -> callback null, 'body'}
	expectedOutput = '<p>\nbody\n</p>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testHtmlAsFunction = (test, assert) ->
	input = (callback) -> callback null, {tag: 'p', body: 'body'}

	expectedOutput = '<p>\nbody\n</p>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testHtmlWithArrayWithFunctionAsBody = (test, assert) ->
	input = {tag: 'p', body: [ 'body1', (callback) -> callback null, 'body2']}

	expectedOutput = '<p>\nbody1\nbody2\n</p>\n'

	htmlgen.generateHTML input, (err, result) ->
			assert.ok not err?
			assert.strictEqual result, expectedOutput
			test.finish()

exports.testHtmlWithoutBodyWithAttribute = (test, assert) ->
	input = {tag: 'img', src:'img.png'}
	expectedOutput = '<img src=\"img.png\" />\n'

	htmlgen.generateHTML input, (err, result) ->
			assert.ok not err?
			assert.strictEqual result, expectedOutput
			test.finish()

exports.testHtmlWithDefaultTagAndBodyAndAttribute = (test, assert) ->
	input = {'class': 'divclass', body:[
		{tag: 'p', body: 'body2'}
		{body: 'body3'}
	]}
	expectedOutput = '<div class=\"divclass\">\n' +
		'<p>\nbody2\n</p>\n' +
		'<div>\nbody3\n</div>\n' +
		'</div>\n'

	htmlgen.generateHTML input, (err, result) ->
			assert.ok not err?
			assert.strictEqual result, expectedOutput
			test.finish()

exports.testHtmlWithStyleAndClass = (test, assert) ->
	input = {
		tag: 'div'
		body: 'body'
		'class': ['class1', 'class2']
		style: {background: 'red'}
	}

	expectedOutput = '<div class=\"class1 class2\" ' +
		'style=\"background:red;\">\nbody\n</div>\n'

	htmlgen.generateHTML input, (err, result) ->
			assert.ok not err?
			assert.strictEqual result, expectedOutput
			test.finish()

exports.testHtmlWithStyleAsFunction = (test, assert) ->

	styleFunc = (callback) -> callback null, {background: 'red'}

	input = {tag: 'div', body: 'body', style: styleFunc}

	expectedOutput = '<div style=\"background:red;\">\nbody\n</div>\n'

	htmlgen.generateHTML input, (err, result) ->
			assert.ok not err?
			assert.strictEqual result, expectedOutput
			test.finish()

exports.testHtmlWithClassAsFunction = (test, assert) ->

	classFunc = (callback) -> callback null, ['class1', 'class2']

	input = {tag: 'div', body: 'body', 'class': classFunc}

	expectedOutput = '<div class=\"class1 class2\">\nbody\n</div>\n'

	htmlgen.generateHTML input, (err, result) ->
			assert.ok not err?
			assert.strictEqual result, expectedOutput
			test.finish()

exports.testHtmlWithStyleAsFunctionWithError = (test, assert) ->
	expectedError = 'Test16Error'

	styleFunc = (callback) -> callback expectedError

	input = {tag: 'div', body: 'body', style: styleFunc}

	htmlgen.generateHTML input, (err, result) ->
		assert.ok not result?
		assert.strictEqual err, expectedError
		test.finish()

exports.testHtmlWithClassAsFunctionWithError = (test, assert) ->
	expectedError = 'Test17Error'

	classFunc = (callback) -> callback expectedError

	input = {tag: 'div', body: 'body', 'class': classFunc}

	htmlgen.generateHTML input, (err, result) ->
		assert.ok not result?
		assert.strictEqual err, expectedError
		test.finish()

exports.testHtmlWithJSMLObject = (test, assert) ->
	class JSMLObject
		toJSML : (callback) ->
			callback null, {tag: 'div', body: {tag: 'br'}}

	input = new JSMLObject

	expectedOutput = '<div>\n<br />\n</div>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testHtmlWith100TagsWithAttributes = (test, assert) ->
	body = []
	input = {tag: 'div', body: body}
	expectedResult = '<div>\n'
	expectedResultTag = '<div style=\"background:red;left:0;right:0;\" ' +
		'class=\"one two\">\nbody\n</div>\n'

	for i in [100..1]
		body.push {
			tag: 'div'
			style:{background:'red', left: 0, right: 0}
			'class': ['one', 'two']
			body:'body'
		}
		expectedResult = expectedResult.concat expectedResultTag

	expectedResult = expectedResult.concat '</div>\n'

	htmlgen.generateHTML input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedResult
		test.finish()
