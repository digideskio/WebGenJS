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

stylegen = require '../lib-cov/stylegen'

exports.testStyleAsOneValue = (test, assert) ->
	input = {background: 'red'}

	expectedOutput = 'background:red;'

	stylegen.generateStyle input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testStyleAsOneValueAsFunction = (test, assert) ->
	testFunc = (callback) -> callback null, 'red'

	input = {background: testFunc}

	expectedOutput = 'background:red;'

	stylegen.generateStyle input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testStyleAsMultipleValuesWithNumber = (test, assert) ->
	input = {background: 'red', height: 100}

	expectedOutput = 'background:red;height:100;'

	stylegen.generateStyle input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testStyleAsFunction = (test, assert) ->
	input = (callback) -> callback null, {background: 'red', height: 100}

	expectedOutput = 'background:red;height:100;'

	stylegen.generateStyle input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testStyleAsFunctionWithError = (test, assert) ->
	expectedError = 'Test4Error'

	input = (callback) -> callback expectedError

	stylegen.generateStyle input, (err, result) ->
		assert.ok not result?
		assert.strictEqual err, expectedError
		test.finish()

exports.testStyleAsArray = (test, assert) ->
	input = [{background: 'red', height: 100}, {width: 100}]

	expectedOutput = 'background:red;height:100;width:100;'

	stylegen.generateStyle input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testStyleWithValuesAsArray = (test, assert) ->
	input = {background: ['red', 'green'], height: 100}

	expectedOutput = 'background:red;background:green;height:100;'

	stylegen.generateStyle input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testStyleWithValuesAsArrayWithFunction = (test, assert) ->
	testFunc = (callback) -> callback null, 'red'

	input = {background: [testFunc, 'green']}

	expectedOutput = 'background:red;background:green;'

	stylegen.generateStyle input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testStyleAsArrayWithNull = (test, assert) ->
	input = [null]

	stylegen.generateStyle input, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testStyleAsUndefined = (test, assert) ->
	tmp = {tmp: 'tmp'}
	input = tmp.empty

	stylegen.generateStyle input, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testStyleAsString = (test, assert) ->
	input = 'input'

	stylegen.generateStyle input, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testStyleAsNumber = (test, assert) ->
	input = 3

	stylegen.generateStyle input, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testStyleWith100Styles = (test, assert) ->
	input = []
	expectedOutput = ''

	for i in [100.1]
		input.push {background: 'red', height: 100}
		expectedOutput = expectedOutput.concat 'background:red;height:100;'

	stylegen.generateStyle input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()
