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

var stylegen = require('stylegen');

exports.testStyleAsOneValue = function (test, assert) {
	var input = {background: 'red'};

	var expectedOutput = 'background:red;';

	stylegen.generateStyle(input, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testStyleAsMultipleValuesWithNumber = function (test, assert) {
	var input = {background: 'red', height: 100};

	var expectedOutput = 'background:red;height:100;';

	stylegen.generateStyle(input, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testStyleAsFunction = function (test, assert) {
	 function input(callback) {
		callback(null, {background: 'red', height: 100});
	}

	var expectedOutput = 'background:red;height:100;';

	stylegen.generateStyle(input, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testStyleAsFunctionWithError = function (test, assert) {
	var expectedError = 'Test4Error';

	function input(callback) {
		callback(expectedError);
	}

	stylegen.generateStyle(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.strictEqual(err, expectedError);
		test.finish();
	});
};

exports.testStyleAsArray = function (test, assert) {
	var input = [{background: 'red', height: 100}, {width: 100}];

	var expectedOutput = 'background:red;height:100;width:100;';

	stylegen.generateStyle(input, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testStyleWithValuesAsArray = function (test, assert) {
	var input = {background: ['red', 'green'], height: 100};

	var expectedOutput = 'background:red;background:green;height:100;';

	stylegen.generateStyle(input, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testStyleAsArrayWithUndefined = function (test, assert) {

	var empty;
	
	var input = [empty];

	stylegen.generateStyle(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		test.finish();
	});
};

exports.testStyleAsString = function (test, assert) {
	var input = 'input';

	stylegen.generateStyle(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		test.finish();
	});
};

exports.testStyleAsNumber = function (test, assert) {
	var input = 3;

	stylegen.generateStyle(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		test.finish();
	});
};

exports.testStyleWith100Styles = function (test, assert) {
	var i;
	var input = [];
	var expectedOutput = '';

	for (i = 0; i < 100; i++) {
		input.push({background: 'red', height: 100});
		expectedOutput = expectedOutput.concat('background:red;height:100;');
	}

	stylegen.generateStyle(input, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};