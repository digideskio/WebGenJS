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

var cssgen = require('cssgen');

exports.testCSSWithSelector = function (test, assert) {
	var input = {sel: 'p', style: {color: 'red'}};

	var expectedOutput = 'p { color:red; }\n';

	cssgen.generateCSS(input, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testCSSWithId = function (test, assert) {
	var input = {id: 'body', style: {color: 'blue'}};

	var expectedOutput = '#body { color:blue; }\n';

	cssgen.generateCSS(input, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testCSSWithClass = function (test, assert) {
	var input = {cl: 'body', style: {color: 'green'}};

	var expectedOutput = '.body { color:green; }\n';

	cssgen.generateCSS(input, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testCSSWithSelectorAndClass = function (test, assert) {
	var input = {sel: 'h1', cl: 'stuff', style: {color: 'white'}};

	var expectedOutput = 'h1.stuff { color:white; }\n';

	cssgen.generateCSS(input, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testCSSWithSelectorAndIdWithError = function (test, assert) {
	var input = {sel: 'h1', id: 'stuff', style: {color: 'white'}};

	cssgen.generateCSS(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		test.finish();
	});
};

exports.testCSSWithClassAndIdWithError = function (test, assert) {
	var input = {cl: 'h1', id: 'stuff', style: {color: 'white'}};

	cssgen.generateCSS(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		test.finish();
	});
};

exports.testCSSAsFunction = function (test, assert) {
	function input (callback) {
		callback(null, {sel: 'p', style: {color: 'red'}});
	}

	var expectedOutput = 'p { color:red; }\n';

	cssgen.generateCSS(input, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testCSSAsArray = function (test, assert) {
	var input = [
		{sel: 'p', style: {color: 'red'}},
		{id: 'body', style: {color: 'blue'}}
	];

	var expectedOutput = 'p { color:red; }\n#body { color:blue; }\n';

	cssgen.generateCSS(input, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testCSSWithStyleAsFunction = function (test, assert) {

	function styleFunc(callback) {
		callback(null, {color: 'blue'});
	}

	var input = {sel: 'p', style: styleFunc};

	var expectedOutput = 'p { color:blue; }\n';

	cssgen.generateCSS(input, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testCSSWithStyleAsFunctionWithError = function (test, assert) {
	var expectedError = new Error('TestError');

	function styleFunc(callback) {
		callback(expectedError);
	}

	var input = {sel: 'p', style: styleFunc};

	cssgen.generateCSS(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.strictEqual(err, expectedError);
		test.finish();
	});
};

exports.testCSSAsFunctionWithError = function (test, assert) {
	var expectedError = new Error('TestError');

	function input(callback) {
		callback(expectedError);
	}

	cssgen.generateCSS(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.strictEqual(err, expectedError);
		test.finish();
	});
};

exports.testCSSAsArrayWithUndefined = function (test, assert) {
	var expectedError = new Error('TestError');

	var empty;

	var input = [empty];

	cssgen.generateCSS(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		test.finish();
	});
};

exports.testCSSAsString = function (test, assert) {
	var expectedError = new Error('TestError');

	var input = ['input'];

	cssgen.generateCSS(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		test.finish();
	});
};

exports.testCSSAsNumber = function (test, assert) {
	var expectedError = new Error('TestError');

	var input = [3];

	cssgen.generateCSS(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		test.finish();
	});
};

exports.testCSSWith100Classes = function (test, assert) {
	var i;
	var input = [];
	var expectedOutput = '';

	for (i = 0; i < 100; i++) {
		input.push({cl: 'body' + i, style: {color: 'green'}});
		expectedOutput = expectedOutput.concat(
			'.body' + i +' { color:green; }\n');
	}

	cssgen.generateCSS(input, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};