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
var xmlgen = require('../lib/xmlgen');

var timeout = 100;
var calls = 1000;
var counter = 1;

function testGenerateXML(input, callback, session) {
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
		xmlgen.generateXML(input, function (err, result) {
			count--;
			var endTime = (new Date).getTime();
			clearTimeout(testTimeout);
			if (count === 0) {
				callback(err, result);
				time = (endTime - startTime);
				console.log(test + ': ' + 
					time + ' ms (average ' + (time / calls) + 'ms).');
			}
		}, session);
	}
}

//=============================================================================
// Test 1
function test1(callback) {
	var input = {tag: 'tag'};
	var expectedOutput = '<tag />\n';
	testGenerateXML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}

//=============================================================================
// Test 2
function test2(callback) {
	var input = {tag: 'tag', body: 'body'};
	var expectedOutput = '<tag>\nbody\n</tag>\n';

	testGenerateXML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}

//=============================================================================
// Test 3
function test3(callback) {
	var input = {tag: 'tag', body: ['body']};
	var expectedOutput = '<tag>\nbody\n</tag>\n';

	testGenerateXML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}

//=============================================================================
// Test 4
function test4(callback) {
	var input = {tag: 'tag1', body: [
		'body1',
		{tag: 'tag2', body: 'body2'},
		{tag: 'tag3', body: 'body3'},
	]};

	var expectedOutput = '<tag1>' +
		'\nbody1\n' +
		'<tag2>\nbody2\n</tag2>\n' +
		'<tag3>\nbody3\n</tag3>\n' +
		'</tag1>\n';

	testGenerateXML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}

//=============================================================================
// Test 5
function test5(callback) {
	var input = {tag: 'tag', body: function (callback) {
		callback(null, 'body');
	}};
	var expectedOutput = '<tag>\nbody\n</tag>\n';

	testGenerateXML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}

//=============================================================================
// Test 6
function test6(callback) {
	var input = function (callback) {
		callback(null, {tag: 'tag', body: 'body'});
	};

	var expectedOutput = '<tag>\nbody\n</tag>\n';


	testGenerateXML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}

//=============================================================================
// Test 7
function test7(callback) {
	var input = {tag: 'tag', body: [ 'body1', function (callback) {
		callback(null, 'body2');
	}]};
	var expectedOutput = '<tag>\nbody1\nbody2\n</tag>\n';

	testGenerateXML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}

//=============================================================================
// Test 8
function test8(callback) {
	var input = {tag: 'tag', attr:'attrvalue'};
	var expectedOutput = '<tag attr=\"attrvalue\" />\n';

	testGenerateXML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		callback();
	});
}

//=============================================================================
// Test 9
function test9(callback) {
	var input = {attr1: 'attrvalue1', body:[
		{tag: 'tag2', body: 'body2'},
		{body: 'body3'},
		{attr2: 'attrvalue2'}
	]};
	var expectedOutput = '<defaulttag attr1=\"attrvalue1\">\n' +
		'<tag2>\nbody2\n</tag2>\n' +
		'<defaulttag>\nbody3\n</defaulttag>\n' +
		'<defaulttag attr2=\"attrvalue2\" />\n' +
		'</defaulttag>\n';

	testGenerateXML(input,
		function(err, result) {
			assert.strictEqual(result, expectedOutput);
			callback();
		},
		{defaultTag:'defaulttag'}
	);
}

//=============================================================================
// Test 10
function test10(callback) {
	var attributeValue = 'attrvalue1';
	var attributeValueRepl = 'attrvaluerepl1';
	
	var input = {tag: 'tag',
		attr1: attributeValue,
		attr2: 'attrvalue2'
	};

	function generateAttribute(attribute, position, callback) {
		assert.strictEqual(attribute, attributeValue);
		callback(null, [attributeValueRepl], position);
	}

	var expectedOutput = '<tag attr1=\"' + attributeValueRepl +
		'\" attr2=\"attrvalue2\" />\n';


	testGenerateXML(input,
		function(err, result) {
			assert.strictEqual(result, expectedOutput);
			callback();
		}, {attributeGenerators:{attr1: generateAttribute}});
}

//=============================================================================
// Test 11
function test11(callback) {
	var input = {tag: 'tag1', body: {tag: 'tag2'}};

	var validated = 0;

	var expectedOutput = '<tag1>\n<tag2 />\n</tag1>\n';

	function validateTag(tag, parent) {
		var retVal = false;
		if (tag === 'tag1' && typeof parent === 'undefined') {
			retVal = true;
		} else if (tag === 'tag2' && parent === 'tag1') {
			retVal = true;
		} else {
			assert.ok(false);
		}
		validated++;
		return retVal;
	}

	testGenerateXML(input,
		function (err, result) {
			assert.strictEqual(result, expectedOutput);
			assert.strictEqual(validated / calls, 2);
			callback();
	}, {tagValidator:validateTag});
}

//=============================================================================
// Test 12
function test12(callback) {
	var i;
	var body = [];
	var input = {tag: 'tag', body: body};
	var expectedOutput = '<tag>\n';
	
	
	for (i = 0; i < 100; i++) {
		body.push({tag: 'tag', body:'body'});
		expectedOutput = expectedOutput.concat(
			'<tag>\nbody\n</tag>\n');
	}
	
	expectedOutput = expectedOutput.concat('</tag>\n');
	testGenerateXML(input,
		function (err, result) {
			assert.strictEqual(result, expectedOutput);
			callback();
	});
}

//=============================================================================
// Test 13
function test13(callback) {
	var input = {tag: 'tag1', body: {tag: 'tag2'}};

	function validateTag(tag, parent) {
		var retVal = false;
		if (tag === 'tag1' && typeof parent === 'undefined') {
			retVal = true;
		} else if (tag === 'tag2' && parent === 'tag1') {
			assert.ok(false);
			retVal = true;
		}
		assert.ok(!retVal);
		return retVal;
	}

	testGenerateXML(input,
		function (err, result) {
			assert.ok(typeof result === 'undefined');
			assert.notStrictEqual(err, null);
			callback();
	}, {tagValidator:validateTag}
	);
}

//=============================================================================
// Test 14
function test14(callback) {	
	var input = {tag: 'tag', body: 'body'};

	function generateAttribute() {
	}
	
	testGenerateXML(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		callback();
	}, {attributeGenerators:{tag: generateAttribute}});
}

//=============================================================================
// Test 15
function test15(callback) {	
	var input = {tag: 'tag', body: 'body'};

	function generateAttribute() {
	}
	
	testGenerateXML(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		callback();
	}, {attributeGenerators:{body: generateAttribute}});
}

//=============================================================================
// Test 16
function test16(callback) {	
	var input = {body: 'body'};
	
	testGenerateXML(input,
		function(err, result) {
			assert.ok(typeof result === 'undefined');
			assert.notStrictEqual(err, null);
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
		test16
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