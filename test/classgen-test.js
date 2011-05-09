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
var testrunner = require('testrunner');
var classgen = require('../lib/classgen');

testrunner.runTests([

function classAsString(callback) {
	var input = 'class2';

	var expectedOutput = 'class2';

	classgen.generateClass(input, function(err, result) {
		callback(function () {
			assert.strictEqual(result, expectedOutput);
		});
	});
},

function classesAsArray(callback) {
	var input = ['class1', 'class2'];

	var expectedOutput = 'class1 class2';

	classgen.generateClass(input, function(err, result) {
		callback(function () {
			assert.strictEqual(result, expectedOutput);
		});
	});
},

function classesAsFunction(callback) {
	 function input(callback) {
		callback(null, ['class1', 'class2']);
	}

	var expectedOutput = 'class1 class2';

	classgen.generateClass(input, function(err, result) {
		callback(function () {
			assert.strictEqual(result, expectedOutput);
		});
	});
},

function classesAsFunctionWithError(callback) {
	var expectedError = 'Test4Error';

	function input(callback) {
		callback(expectedError);
	}

	classgen.generateClass(input, function(err, result) {
		callback(function () {
			assert.ok(typeof result === 'undefined');
			assert.strictEqual(err, expectedError);
		});
	});
},

function classWith100Classes(callback) {
	var i;
	var input = [];
	var expectedOutput;

	for (i = 0; i < 100; i++) {
		input.push('class' + i);
	}

	expectedOutput = input.join(' ');

	classgen.generateClass(input, function(err, result) {
		callback(function () {
		assert.strictEqual(result, expectedOutput);
		});
	});
}
]);