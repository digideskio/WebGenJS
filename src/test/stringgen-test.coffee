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

stringgen = require '../lib-cov/stringgen'

exports.testStringAsString = (test, assert) ->
	input = 'string'

	expectedOutput = 'string'

	stringgen.generateString input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testStringAsUndefined = (test, assert) ->
	input = {tmp: 'tmp'}

	stringgen.generateString input.empty, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testStringAsNull = (test, assert) ->
	input = null

	stringgen.generateString input, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testStringAsFunction = (test, assert) ->
	input = ->

	stringgen.generateString input, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testStringAsNumber = (test, assert) ->
	input = 2
	
	expectedOutput = '2'

	stringgen.generateString input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testStringAsWrongObject = (test, assert) ->
	input = {input: 'input'}

	stringgen.generateString input, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testStringEmpty = (test, assert) ->
	input = ''

	expectedOutput = ''

	stringgen.generateString input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testStringAsArrayWithOneString = (test, assert) ->
	input = ['string']

	expectedOutput = 'string'

	stringgen.generateString input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testStringAsArrayWithMultipleStrings = (test, assert) ->
	input = ['string', 'string']

	expectedOutput = 'stringstring'

	stringgen.generateString input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testStringAsArrayOfArrays = (test, assert) ->
	input = ['string', ['string']]

	expectedOutput = 'stringstring'

	stringgen.generateString input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()


exports.testStringWith100StringsIn100Arrays = (test, assert) ->
	input = 'string'

	expectedOutput = 'string'
	
	for i in [100..1]
		input = [input, 'string']
		expectedOutput = "#{expectedOutput}string"

	stringgen.generateString input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()