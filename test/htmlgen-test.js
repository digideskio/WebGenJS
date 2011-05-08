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
var htmlgen = require('../lib/htmlgen');

var timeout = 100;
var calls = 1000;
var counter = 1;

function testGenerateHTML(input, callback) {
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
		htmlgen.generateHTML(input, function (err, result) {
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
	var input = {tag: 'p'};
	var expectedOutput = '<p />\n';
	testGenerateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}

//=============================================================================
// Test 2
function test2(callback) {
	var input = {tag: 'p', body: 'body'};
	var expectedOutput = '<p>\nbody\n</p>\n';

	testGenerateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}

//=============================================================================
// Test 3
function test3(callback) {
	var input = {tag: 'p', body: ['body']};
	var expectedOutput = '<p>\nbody\n</p>\n';

	testGenerateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}

//=============================================================================
// Test 4
function test4(callback) {
	var input = {tag: 'div', body: [
		'body1',
		{tag: 'h1', body: 'body2'},
		{tag: 'p', body: 'body3'},
	]};

	var expectedOutput = '<div>' +
		'\nbody1\n' +
		'<h1>\nbody2\n</h1>\n' +
		'<p>\nbody3\n</p>\n' +
		'</div>\n';

	testGenerateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}

//=============================================================================
// Test 5
function test5(callback) {
	var input = {tag: 'p', body: function (callback) {
		callback(null, 'body');
	}};
	var expectedOutput = '<p>\nbody\n</p>\n';

	testGenerateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}

//=============================================================================
// Test 6
function test6(callback) {
	var input = function (callback) {
		callback(null, {tag: 'p', body: 'body'});
	};

	var expectedOutput = '<p>\nbody\n</p>\n';


	testGenerateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}

//=============================================================================
// Test 7
function test7(callback) {
	var input = {tag: 'p', body: [ 'body1', function (callback) {
		callback(null, 'body2');
	}]};
	var expectedOutput = '<p>\nbody1\nbody2\n</p>\n';

	testGenerateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}

//=============================================================================
// Test 8
function test8(callback) {
	var input = {tag: 'img', src:'img.png'};
	var expectedOutput = '<img src=\"img.png\" />\n';

	testGenerateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}

//=============================================================================
// Test 9
function test9(callback) {
	var input = {'class': 'divclass', body:[
		{tag: 'p', body: 'body2'},
		{body: 'body3'}
	]};
	var expectedOutput = '<div class=\"divclass\">\n' +
		'<p>\nbody2\n</p>\n' +
		'<div>\nbody3\n</div>\n' +
		'</div>\n';

	testGenerateHTML(input,
		function(err, result) {
			assert.strictEqual(result, expectedOutput);
			callback();
		}
	);
}

//=============================================================================
// Test 10
function test10(callback) {
	var input = {tag: 'div', body: 'body',
		'class': ['class1', 'class2'],
		style: {background: 'red'}
	};
	
	var expectedOutput = '<div class=\"class1 class2 \" ' +
		'style=\"background:red;\">\nbody\n</div>\n';


	testGenerateHTML(input,
		function(err, result) {
			assert.strictEqual(result, expectedOutput);
			callback();
		}
	);
}

//=============================================================================
// Test 11
function test11(callback) {
	var i;
	var body = [];
	var input = {tag: 'div', body: body};
	var expectedOutput = '<div>\n';
	
	
	for (i = 0; i < 100; i++) {
		body.push({tag: 'div', body:'body'});
		expectedOutput = expectedOutput.concat(
			'<div>\nbody\n</div>\n');
	}
	
	expectedOutput = expectedOutput.concat('</div>\n');
	testGenerateHTML(input,
		function (err, result) {
			assert.strictEqual(result, expectedOutput);
			callback();
	});
}

//=============================================================================
// Test 12
function test12(callback) {
	var input = {tag: 'nonhtml', body: 'body'};

	testGenerateHTML(input,
		function (err, result) {
			assert.ok(typeof result === 'undefined');
			assert.notStrictEqual(err, null);
			callback();
		}
	);
}

//=============================================================================
// Test 13
function test13(callback) {
	var input = {tag: 'div', style: { nonstyle: 'styleval'}, body: 'body'};

	testGenerateHTML(input,
		function (err, result) {
			assert.ok(typeof result === 'undefined');
			assert.notStrictEqual(err, null);
			callback();
		}
	);
}

//=============================================================================
// Test 14
function test14(callback) {
	
	function styleFunc(callback) {
		callback(null, {background: 'red'});
	}
	
	var input = {tag: 'div', body: 'body', style: styleFunc};
	
	var expectedOutput = '<div style=\"background:red;\">\nbody\n</div>\n';

	testGenerateHTML(input,
		function(err, result) {
			assert.strictEqual(result, expectedOutput);
			callback();
		}
	);
}

//=============================================================================
// Test 15
function test15(callback) {
	
	function classFunc(callback) {
		callback(null, ['class1', 'class2']);
	}
	
	var input = {tag: 'div', body: 'body', 'class': classFunc};
	
	var expectedOutput = '<div class=\"class1 class2 \">\nbody\n</div>\n';

	testGenerateHTML(input,
		function(err, result) {
			assert.strictEqual(result, expectedOutput);
			callback();
		}
	);
}

//=============================================================================
// Test 16
function test16(callback) {
	var expectedError = 'Test16Error';

	function styleFunc(callback) {
		callback(expectedError);
	}

	var input = {tag: 'div', body: 'body', style: styleFunc};

	testGenerateHTML(input,
		function(err, result) {
			assert.ok(typeof result === 'undefined');
			assert.strictEqual(err, expectedError);
			callback();
		}
	);
}

//=============================================================================
// Test 17
function test17(callback) {
	var expectedError = 'Test17Error';

	function classFunc(callback) {
		callback(expectedError);
	}

	var input = {tag: 'div', body: 'body', 'class': classFunc};

	testGenerateHTML(input,
		function(err, result) {
			assert.ok(typeof result === 'undefined');
			assert.strictEqual(err, expectedError);
			callback();
		}
	);
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
		test14,
		test15,
		test16,
		test17
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
