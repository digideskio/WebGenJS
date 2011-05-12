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

var htmlgen = require('htmlgen');

exports.testHtmlWithoutBody = function (test, assert) {
	var input = {tag: 'p'};
	var expectedOutput = '<p />\n';
	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};


exports.testHtmlWithStringAsBody = function (test, assert) {
	var input = {tag: 'p', body: 'body'};
	var expectedOutput = '<p>\nbody\n</p>\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testHtmlWithStringArrayAsBody = function (test, assert) {
	var input = {tag: 'p', body: ['body']};
	var expectedOutput = '<p>\nbody\n</p>\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testHtmlWithTagArrayAsBody = function (test, assert) {
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

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testHtmlWithFunctionAsBody = function (test, assert) {
	var input = {tag: 'p', body: function (callback) {
		callback(null, 'body');
	}};
	var expectedOutput = '<p>\nbody\n</p>\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testHtmlAsFunction = function (test, assert) {
	var input = function (callback) {
		callback(null, {tag: 'p', body: 'body'});
	};

	var expectedOutput = '<p>\nbody\n</p>\n';


	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testHtmlWithArrayWithFunctionAsBody = function (test, assert) {
	var input = {tag: 'p', body: [ 'body1', function (callback) {
		callback(null, 'body2');
	}]};
	var expectedOutput = '<p>\nbody1\nbody2\n</p>\n';

	htmlgen.generateHTML(input, function(err, result) {
			assert.strictEqual(err, null);
			assert.strictEqual(result, expectedOutput);
			test.finish();
	});
}

exports.testHtmlWithoutBodyWithAttribute = function (test, assert) {
	var input = {tag: 'img', src:'img.png'};
	var expectedOutput = '<img src=\"img.png\" />\n';

	htmlgen.generateHTML(input, function(err, result) {
			assert.strictEqual(err, null);
			assert.strictEqual(result, expectedOutput);
			test.finish();
	});
};

exports.testHtmlWithDefaultTagAndBodyAndAttribute = function (test, assert) {
	var input = {'class': 'divclass', body:[
		{tag: 'p', body: 'body2'},
		{body: 'body3'}
	]};
	var expectedOutput = '<div class=\"divclass\">\n' +
		'<p>\nbody2\n</p>\n' +
		'<div>\nbody3\n</div>\n' +
		'</div>\n';

	htmlgen.generateHTML(input,
		function(err, result) {
			assert.strictEqual(err, null);
			assert.strictEqual(result, expectedOutput);
			test.finish();
		}
	);
};

exports.testHtmlWithStyleAndClass = function (test, assert) {
	var input = {tag: 'div', body: 'body',
		'class': ['class1', 'class2'],
		style: {background: 'red'}
	};

	var expectedOutput = '<div class=\"class1 class2\" ' +
		'style=\"background:red;\">\nbody\n</div>\n';


	htmlgen.generateHTML(input, function(err, result) {
			assert.strictEqual(err, null);
			assert.strictEqual(result, expectedOutput);
			test.finish();
	});
};

exports.testHtmlWithStyleAsFunction = function (test, assert) {

	function styleFunc(callback) {
		callback(null, {background: 'red'});
	}

	var input = {tag: 'div', body: 'body', style: styleFunc};

	var expectedOutput = '<div style=\"background:red;\">\nbody\n</div>\n';

	htmlgen.generateHTML(input, function(err, result) {
			assert.strictEqual(err, null);
			assert.strictEqual(result, expectedOutput);
			test.finish();
	});
};

exports.testHtmlWithClassAsFunction = function (test, assert) {

	function classFunc(callback) {
		callback(null, ['class1', 'class2']);
	}

	var input = {tag: 'div', body: 'body', 'class': classFunc};

	var expectedOutput = '<div class=\"class1 class2\">\nbody\n</div>\n';

	htmlgen.generateHTML(input, function(err, result) {
			assert.strictEqual(err, null);
			assert.strictEqual(result, expectedOutput);
			test.finish();
		}
	);
};

exports.testHtmlWithStyleAsFunctionWithError = function (test, assert) {
	var expectedError = 'Test16Error';

	function styleFunc(callback) {
		callback(expectedError);
	}

	var input = {tag: 'div', body: 'body', style: styleFunc};

	htmlgen.generateHTML(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.strictEqual(err, expectedError);
		test.finish();
	});
};

exports.testHtmlWithClassAsFunctionWithError = function (test, assert) {
	var expectedError = 'Test17Error';

	function classFunc(callback) {
		callback(expectedError);
	}

	var input = {tag: 'div', body: 'body', 'class': classFunc};

	htmlgen.generateHTML(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.strictEqual(err, expectedError);
		test.finish();
	});
};

exports.testHtmlWithJSMLObject = function (test, assert) {
	var empty;
	var input;
	var expectedOutput;

	function JSMLObject() {
		this.toJSML = function (callback) {
			callback(null, {tag: 'div', body: {tag: 'br'}});
		}
	}
	input = new JSMLObject();

	expectedOutput = '<div>\n<br />\n</div>\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testHtmlWith100TagsWithAttributes = function (test, assert) {
	var i;
	var body = [];
	var input = {tag: 'div', body: body};
	var expectedResult = '<div>\n';

	for (i = 0; i < 100; i++) {
		body.push({tag: 'div', style:{background:'red', left: 0, right: 0},
		'class': ['one', 'two'], body:'body'});
		expectedResult = expectedResult.concat(
			'<div style=\"background:red;left:0;right:0;\" ' +
			'class=\"one two\">\nbody\n</div>\n');
	}

	expectedResult = expectedResult.concat('</div>\n');

	htmlgen.generateHTML(input, function (err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedResult);
		test.finish();
	});
};