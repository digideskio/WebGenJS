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

var timeout = 100;
var calls = 1000;
var counter = 1;

function testGenerateCSS(input, callback) {
	var test = 'Test ' + counter++;
	var i;
	var count = 0;
	
	var testTimeout = setTimeout(function () {
		assert.ok(false, test + ' timed out');
	}, (timeout * calls));

	var startTime = (new Date()).getTime();
	var time;
	
	for (i = 0; i < calls; i++) {
		count++;
		cssgen.generateCSS(input, function (err, result) {
			count--;
			var endTime = (new Date).getTime();
			clearTimeout(testTimeout);
			if (count === 0) {
				callback(err, result);
				time = (endTime - startTime);
				console.log(test + ': ' + 
					time + ' ms (average ' + (time / calls) + 'ms).');
			}
		});
	}
}

//=============================================================================
// Test 1
function test1(callback) {
	var input = {sel: 'p', style: {color: 'red'}};

	var expectedOutput = 'p { color:red; }\n';

	testGenerateCSS(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}

//=============================================================================
// Test 2
function test2(callback) {
	var input = {id: 'body', style: {color: 'blue'}};

	var expectedOutput = '#body { color:blue; }\n';

	testGenerateCSS(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}

//=============================================================================
// Test 3
function test3(callback) {
	var input = {cl: 'body', style: {color: 'green'}};

	var expectedOutput = '.body { color:green; }\n';

	testGenerateCSS(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}

//=============================================================================
// Test 4
function test4(callback) {
	var input = {sel: 'h1', cl: 'stuff', style: {color: 'white'}};

	var expectedOutput = 'h1.stuff { color:white; }\n';

	testGenerateCSS(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}

//=============================================================================
// Test 5
function test5(callback) {
	var input = {sel: 'h1', id: 'stuff', style: {color: 'white'}};

	testGenerateCSS(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		callback();
	});
}

//=============================================================================
// Test 6
function test6(callback) {
	var input = {cl: 'h1', id: 'stuff', style: {color: 'white'}};

	testGenerateCSS(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		callback();
	});
}

//=============================================================================
// Test 7
function test7(callback) {
	function input (callback) {
		callback(null, {sel: 'p', style: {color: 'red'}});
	}

	var expectedOutput = 'p { color:red; }\n';

	testGenerateCSS(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}

//=============================================================================
// Test 8
function test8(callback) {
	function input (callback) {
		callback(null, {sel: 'p', style: {color: 'red'}});
	}

	var expectedOutput = 'p { color:red; }\n';

	testGenerateCSS(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}

//=============================================================================
// Test 9
function test9(callback) {
	var input = [
		{sel: 'p', style: {color: 'red'}},
		{id: 'body', style: {color: 'blue'}}
	];

	var expectedOutput = 'p { color:red; }\n#body { color:blue; }\n';

	testGenerateCSS(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}

//=============================================================================
// Test 10
function test10(callback) {

	function styleFunc(callback) {
		callback(null, {color: 'blue'});
	}

	var input = {sel: 'p', style: styleFunc};

	var expectedOutput = 'p { color:blue; }\n';

	testGenerateCSS(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}

//=============================================================================
// Test 11
function test11(callback) {
	var expectedError = 'Test11Error';

	function styleFunc(callback) {
		callback(expectedError);
	}

	var input = {sel: 'p', style: styleFunc};

	testGenerateCSS(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.strictEqual(err, expectedError);
		callback();
	});
}

//=============================================================================
// Test 12
function test12(callback) {
	var expectedError = 'Test12Error';

	function input(callback) {
		callback(expectedError);
	}

	testGenerateCSS(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.strictEqual(err, expectedError);
		callback();
	});
}

//=============================================================================
// Test 13
function test13(callback) {
	var i;
	var input = [];
	var expectedOutput = '';
	
	for (i = 0; i < 100; i++) {
		input.push({cl: 'body' + i, style: {color: 'green'}});
		expectedOutput = expectedOutput.concat(
			'.body' + i +' { color:green; }\n');
	}

	testGenerateCSS(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}

//=============================================================================
// Test 14
function test14(callback) {
	var input = {cl: 'body', style: { nonstyle: 'styleval'}};

	testGenerateCSS(input, function (err, result) {
			assert.ok(typeof result === 'undefined');
			assert.notStrictEqual(err, null);
			callback();
	});
}

//=============================================================================
// Test Runner

function runAllTests() {
	var tests = [
		test1,
		test2,
		test3,
		test4,
		test5,
		test6,
		test7,
		test8,
		test9,
		test10,
		test11,
		test12,
		test13,
		test14
	];

	var testCounter = 0;

	function serializeTest() {
		if (testCounter < tests.length) {
			tests[testCounter](serializeTest);
			testCounter++;
		}
	}

	console.log(__filename);
	console.log(calls + ' calls per test.');
	serializeTest();
}

runAllTests();