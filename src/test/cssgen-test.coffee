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

cssgen = require '../lib-cov/cssgen'

exports.testCSSWithSelector = (test, assert) ->
	input =
		sel: 'p'
		style:
			color: 'red'

	expectedOutput = 'p { color:red; }\n'

	cssgen.generateCSS input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testCSSWithId = (test, assert) ->
	input = {id: 'body', style: {color: 'blue'}}

	expectedOutput = '#body { color:blue; }\n'

	cssgen.generateCSS input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testCSSWithClass = (test, assert) ->
	input = {cl: 'body', style: {color: 'green'}}

	expectedOutput = '.body { color:green; }\n'

	cssgen.generateCSS input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testCSSWithSelectorAndClass = (test, assert) ->
	input = {sel: 'h1', cl: 'stuff', style: {color: 'white'}}

	expectedOutput = 'h1.stuff { color:white; }\n'

	cssgen.generateCSS input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testCSSWithSelectorAndIdWithError = (test, assert) ->
	input = {sel: 'h1', id: 'stuff', style: {color: 'white'}}

	cssgen.generateCSS input, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testCSSWithClassAndIdWithError = (test, assert) ->
	input = {cl: 'h1', id: 'stuff', style: {color: 'white'}}

	cssgen.generateCSS input, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testCSSAsFunction = (test, assert) ->
	input = (callback) -> callback null, {sel: 'p', style: {color: 'red'}}

	expectedOutput = 'p { color:red; }\n'

	cssgen.generateCSS input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testCSSAsArray = (test, assert) ->
	input = [
		{sel: 'p', style: {color: 'red'}}
		{id: 'body', style: {color: 'blue'}}
	]

	expectedOutput = 'p { color:red; }\n#body { color:blue; }\n'

	cssgen.generateCSS input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testCSSWithStyleAsFunction = (test, assert) ->

	styleFunc = (callback) -> callback null, {color: 'blue'}

	input = {sel: 'p', style: styleFunc}

	expectedOutput = 'p { color:blue; }\n'

	cssgen.generateCSS input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testCSSWithStyleAsFunctionWithError = (test, assert) ->
	expectedError = new Error 'TestError'

	styleFunc = (callback) -> callback expectedError

	input =  {sel: 'p', style: styleFunc}

	cssgen.generateCSS input, (err, result) ->
		assert.ok not result?
		assert.strictEqual err, expectedError
		test.finish()

exports.testCSSAsFunctionWithError = (test, assert) ->
	expectedError = new Error 'TestError'

	input = (callback) -> callback expectedError

	cssgen.generateCSS input, (err, result) ->
		assert.ok not result?
		assert.strictEqual err, expectedError
		test.finish()

exports.testCSSAsArrayWithUndefined = (test, assert) ->
	expectedError = new Error 'TestError'
	tmp = {tmp: 'tmp'}
	input = [tmp.empty]

	cssgen.generateCSS input, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testCSSAsArrayWithNull = (test, assert) ->
	expectedError = new Error 'TestError'
	input = [null]

	cssgen.generateCSS input, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testCSSAsString = (test, assert) ->
	expectedError = new Error 'TestError'

	input = ['input']

	cssgen.generateCSS input, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testCSSAsNumber = (test, assert) ->
	expectedError = new Error 'TestError'

	input = [3]

	cssgen.generateCSS input, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testCSSWith100Classes = (test, assert) ->
	input = []
	expectedOutput = ''
	
	for i in [100..1]
		input.push {cl: 'body' + i, style: {color: 'green'}}
		expectedOutput = expectedOutput.concat ".body#{i} { color:green; }\n"

	cssgen.generateCSS input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()