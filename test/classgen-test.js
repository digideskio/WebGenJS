/*
Copyright 2011 Patchwork Solutions AB. All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

     1. Redistributions of source code must retain the above copyright notice,
       this list of conditions and the following disclaimer.

     2. Redistributions in binary form must reproduce the above copyright
       notice, this list of conditions and the following disclaimer in the
       documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY Patchwork Solutions AB ``AS IS'' AND ANY EXPRESS
OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
EVENT SHALL Patchwork Solutions AB OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

The views and conclusions contained in the software and documentation are
those of the authors and should not be interpreted as representing official
policies, either expressed or implied, of Patchwork Solutions AB.
*/

'use strict';

var classgen = require('../lib/classgen');

exports.testClassAsString = function (test, assert) {
	var input = 'class2';

	var expectedOutput = 'class2';

	classgen.generateClass(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}

exports.testClassesAsArray = function (test, assert) {
	var input = ['class1', 'class2'];

	var expectedOutput = 'class1 class2';

	classgen.generateClass(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}

exports.testClassesAsArray = function (test, assert) {
	var empty;
	var input = ['class1', empty];

	classgen.generateClass(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		test.finish();
	});
}

exports.testClassesAsArrayWithFunction = function (test, assert) {
	function testFunc(callback) {
		callback(null, 'class2');
	}
	
	var input = ['class1', testFunc];

	classgen.generateClass(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		test.finish();
	});
}

exports.testClassesAsFunction = function (test, assert) {
	 function input(callback) {
		callback(null, ['class1', 'class2']);
	}

	var expectedOutput = 'class1 class2';

	classgen.generateClass(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}

exports.testClassesAsFunctionWithError = function (test, assert) {
	var expectedError = 'Test4Error';

	function input(callback) {
		callback(expectedError);
	}

	classgen.generateClass(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.strictEqual(err, expectedError);
		test.finish();
	});
}

exports.testClassesAsUndefined = function (test, assert) {
	var input;

	classgen.generateClass(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		test.finish();
	});
}

exports.testClassesAsNumber = function (test, assert) {
	var input = 2;

	classgen.generateClass(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		test.finish();
	});
}

exports.testClassesAsWrongObject = function (test, assert) {
	var input = {input: 'input'};

	classgen.generateClass(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		test.finish();
	});
}

exports.testClassWith100Classes = function (test, assert) {
	var i;
	var input = [];
	var expectedOutput;

	for (i = 0; i < 100; i++) {
		input.push('class' + i);
	}

	expectedOutput = input.join(' ');

	classgen.generateClass(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}