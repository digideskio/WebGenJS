#!/usr/bin/node
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

var assert = require('assert');
var cssgen = require('../lib/cssgen');
var testrunner = require('./testrunner');

testrunner.runTests([

function cssWithSelector(callback) {
	var input = {sel: 'p', style: {color: 'red'}};

	var expectedOutput = 'p { color:red; }\n';

	cssgen.generateCSS(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
},

function cssWithId(callback) {
	var input = {id: 'body', style: {color: 'blue'}};

	var expectedOutput = '#body { color:blue; }\n';

	cssgen.generateCSS(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
},

function cssWithClass(callback) {
	var input = {cl: 'body', style: {color: 'green'}};

	var expectedOutput = '.body { color:green; }\n';

	cssgen.generateCSS(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
},

function cssWithSelectorAndClass(callback) {
	var input = {sel: 'h1', cl: 'stuff', style: {color: 'white'}};

	var expectedOutput = 'h1.stuff { color:white; }\n';

	cssgen.generateCSS(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
},

function cssWithSelectorAndIdWithError(callback) {
	var input = {sel: 'h1', id: 'stuff', style: {color: 'white'}};

	cssgen.generateCSS(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		callback();
	});
},

function cssWithClassAndIdWithError(callback) {
	var input = {cl: 'h1', id: 'stuff', style: {color: 'white'}};

	cssgen.generateCSS(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		callback();
	});
},

function cssAsFunction(callback) {
	function input (callback) {
		callback(null, {sel: 'p', style: {color: 'red'}});
	}

	var expectedOutput = 'p { color:red; }\n';

	cssgen.generateCSS(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
},

function cssAsArray(callback) {
	var input = [
		{sel: 'p', style: {color: 'red'}},
		{id: 'body', style: {color: 'blue'}}
	];

	var expectedOutput = 'p { color:red; }\n#body { color:blue; }\n';

	cssgen.generateCSS(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
},

function cssWithStyleAsFunction(callback) {

	function styleFunc(callback) {
		callback(null, {color: 'blue'});
	}

	var input = {sel: 'p', style: styleFunc};

	var expectedOutput = 'p { color:blue; }\n';

	cssgen.generateCSS(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
},

function cssWithStyleAsFunctionWithError(callback) {
	var expectedError = 'Test11Error';

	function styleFunc(callback) {
		callback(expectedError);
	}

	var input = {sel: 'p', style: styleFunc};

	cssgen.generateCSS(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.strictEqual(err, expectedError);
		callback();
	});
},

function cssAsFunctionWithError(callback) {
	var expectedError = 'Test12Error';

	function input(callback) {
		callback(expectedError);
	}

	cssgen.generateCSS(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.strictEqual(err, expectedError);
		callback();
	});
},

function cssWithInvalidStyleAndError(callback) {
	var input = {cl: 'body', style: { nonstyle: 'styleval'}};

	cssgen.generateCSS(input, function (err, result) {
			assert.ok(typeof result === 'undefined');
			assert.notStrictEqual(err, null);
			callback();
	});
},

function cssWith100Classes(callback) {
	var i;
	var input = [];
	var expectedOutput = '';

	for (i = 0; i < 100; i++) {
		input.push({cl: 'body' + i, style: {color: 'green'}});
		expectedOutput = expectedOutput.concat(
			'.body' + i +' { color:green; }\n');
	}

	cssgen.generateCSS(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}
]);