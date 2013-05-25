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

classgen = (require '../lib-cov/webgenjs').classgen

exports.testClassAsString = (test, assert) ->
	input = 'class2'
	expectedOutput = 'class2'

	classgen.generateClass input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testClassesAsArray = (test, assert) ->
	input = ['class1', 'class2']
	expectedOutput = 'class1 class2'

	classgen.generateClass input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testClassesAsArrayWithUndefined = (test, assert) ->
	tmp = {tmp: 'tmp'}
	input = ['class1', tmp.empty]

	classgen.generateClass input, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testClassesAsArrayWithNull = (test, assert) ->
	empty = null
	input = ['class1', empty]

	classgen.generateClass input, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testClassesAsArrayWithFunction = (test, assert) ->
	testFunc = (callback) -> callback null, 'class2'

	input = ['class1', testFunc]

	classgen.generateClass input, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testClassesAsFunction = (test, assert) ->
	input = (callback) -> callback null, ['class1', 'class2']

	expectedOutput = 'class1 class2'

	classgen.generateClass input, (err, result) ->
		assert.ok not result?
		test.finish()

exports.testClassesAsFunctionWithError = (test, assert) ->
	expectedError = 'Test4Error'

	input = (callback) -> callback expectedError

	classgen.generateClass input, (err, result) -> 
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testClassesAsUndefined = (test, assert) ->
	input = null
	classgen.generateClass input, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testClassesAsNumber = (test, assert) ->
	input = 2

	classgen.generateClass input, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testClassesAsWrongObject = (test, assert) ->
	input = {input: 'input'}

	classgen.generateClass input, (err, result) ->
		assert.ok not result?
		assert.ok err?
		test.finish()

exports.testClassWith100Classes = (test, assert) ->
	input = []
	for i in [100..1]
		input.push 'class' + i

	expectedOutput = input.join ' '

	classgen.generateClass input, (err, result) ->
		assert.ok not err?
		assert.strictEqual result, expectedOutput
		test.finish()
