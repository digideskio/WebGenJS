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

var xmlgen = require('../lib/xmlgen');

exports.testXMLWithoutBody = function (test, assert) {
	var empty;
	var input = {tag: 'tag'};
	var expectedOutput = '<tag />\n';
	xmlgen.generateXML(input, empty, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testXMLWithStringAsBody = function (test, assert) {
	var empty;
	var input = {tag: 'tag', body: 'body'};
	var expectedOutput = '<tag>\nbody\n</tag>\n';

	xmlgen.generateXML(input, empty, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testXMLWithNumberAsBody = function (test, assert) {
	var empty;
	var input = {tag: 'tag', body: 3};
	var expectedOutput = '<tag>\n3\n</tag>\n';

	xmlgen.generateXML(input, empty, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testXMLWithStringArrayAsBody = function (test, assert) {
	var empty;
	var input = {tag: 'tag', body: ['body']};
	var expectedOutput = '<tag>\nbody\n</tag>\n';

	xmlgen.generateXML(input, empty, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testXMLWithTagArrayAsBody = function (test, assert) {
	var empty;
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

	xmlgen.generateXML(input, empty, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testXMLWithBodyAsFunction = function (test, assert) {
	var empty;
	var input = {tag: 'tag', body: function (callback) {
		callback(null, 'body');
	}};
	var expectedOutput = '<tag>\nbody\n</tag>\n';

	xmlgen.generateXML(input, empty, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testXMLAsFunction = function (test, assert) {
	var empty;
	var input = function (callback) {
		callback(null, {tag: 'tag', body: 'body'});
	};

	var expectedOutput = '<tag>\nbody\n</tag>\n';


	xmlgen.generateXML(input, empty, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testXMLWithArrayWithFunctionAsBody = function (test, assert) {
	var empty;
	var input = {tag: 'tag', body: [ 'body1', function (callback) {
		callback(null, 'body2');
	}]};
	var expectedOutput = '<tag>\nbody1\nbody2\n</tag>\n';

	xmlgen.generateXML(input, empty, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testXMLWithoutBodyWithAttribute = function (test, assert) {
	var empty;
	var input = {tag: 'tag', attr:'attrvalue'};
	var expectedOutput = '<tag attr=\"attrvalue\" />\n';

	xmlgen.generateXML(input, empty, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testXMLWithFunctionAsAttribute = function (test, assert) {
	var empty;
	var input = {tag: 'tag', attr: function (callback) {
		callback(null, 'attrvalue');
	}};
	var expectedOutput = '<tag attr=\"attrvalue\" />\n';

	xmlgen.generateXML(input, empty, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testXMLWithFunctionAsAttributeWithError = function (test, assert) {
	var empty;
	var input = {tag: 'tag', attr: function (callback) {
		callback(new Error('TestError'));
	}};

	xmlgen.generateXML(input, empty, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		test.finish();
	});
};

exports.testXMLWithFunctionAsTag = function (test, assert) {
	var empty;
	var input = {tag: function (callback) {
		callback(null, 'tagname');
	}};
	var expectedOutput = '<tagname />\n';

	xmlgen.generateXML(input, empty, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testXMLWithFunctionAsTagWithError = function (test, assert) {
	var empty;
	var input = {tag: function (callback) {
		callback(new Error('TestError'));
	}};

	xmlgen.generateXML(input, empty, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		test.finish();
	});
};

exports.testXMLWithBodyAndAttribute = function (test, assert) {
	var empty;
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

	xmlgen.generateXML(input, {defaultTag:'defaulttag'},
		function(err, result) {
			assert.strictEqual(err, null);
			assert.strictEqual(result, expectedOutput);
			test.finish();
		}
	);
};

exports.testXMLWithAttributeGenerator = function (test, assert) {
	var empty;
	var attributeValue = 'attrvalue1';
	var attributeValueRepl = 'attrvaluerepl1';

	var input = {tag: 'tag',
		attr1: attributeValue,
		attr2: 'attrvalue2'
	};

	function generateAttribute(attribute, callback) {
		assert.strictEqual(attribute, attributeValue);
		callback(null, [attributeValueRepl]);
	}

	var expectedOutput = '<tag attr1=\"' + attributeValueRepl +
		'\" attr2=\"attrvalue2\" />\n';


	xmlgen.generateXML(input, {attributeGenerators:{attr1: generateAttribute}},
		function(err, result) {
			assert.strictEqual(err, null);
			assert.strictEqual(result, expectedOutput);
			test.finish();
		}
	);
};

exports.testXMLWithAttributeGeneratorWithError = function (test, assert) {
	var empty;
	var attributeValue = 'attrvalue1';
	var attributeValueRepl = 'attrvaluerepl1';

	var input = {tag: 'tag',
		attr1: attributeValue,
		attr2: 'attrvalue2'
	};

	function generateAttribute(attribute, callback) {
		callback(new Error('TestError'));
	}

	xmlgen.generateXML(input, {attributeGenerators:{attr1: generateAttribute}},
		function(err, result) {
			assert.ok(typeof result === 'undefined');
			assert.notStrictEqual(err, null);
			test.finish();
		}
	);
};

exports.testXMLWithoutTagAndDefaultTag = function (test, assert) {
	var empty;
	var input = {body: 'body'};

	xmlgen.generateXML(input, empty,
		function(err, result) {
			assert.ok(typeof result === 'undefined');
			assert.notStrictEqual(err, null);
			test.finish();
		}
	);
};

exports.testXMLWithJSMLObject = function (test, assert) {
	var empty;
	var input;
	var expectedOutput;

	function JSMLObject() {
		this.toJSML = function (callback) {
			callback(null, {tag: 'tag1', body: {tag: 'tag2'}});
		}
	}
	input = new JSMLObject();

	expectedOutput = '<tag1>\n<tag2 />\n</tag1>\n';

	xmlgen.generateXML(input, empty, function(err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};

exports.testXMLWithJSMLObjectWithError = function (test, assert) {
	var empty;
	var input;

	xmlgen.generateXML(input, empty, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		test.finish();
	});
};

exports.testXMLWithUndefined = function (test, assert) {
	var empty;
	var input;

	function JSMLObject() {
		this.toJSML = function (callback) {
			callback(new Error('TestError'));
		}
	}
	input = new JSMLObject();

	xmlgen.generateXML(input, empty, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		test.finish();
	});
};

exports.testXMLAsFunction = function (test, assert) {
	var empty;
	var input = function (callback) {
		callback(new Error('TestError'));
	};

	xmlgen.generateXML(input, empty, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		test.finish();
	});
};

exports.testXMLWithWrongObjectInBody= function (test, assert) {
	var empty;
	var input = {tag:'tag', body: {errordata: empty}};

	xmlgen.generateXML(input, empty, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		test.finish();
	});
};

exports.testXMLWithUndefinedInBodyArray = function (test, assert) {
	var empty;
	var input = {tag:'tag', body: [empty]};

	xmlgen.generateXML(input, empty, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		test.finish();
	});
};

exports.testXMLWith100Tags = function (test, assert) {
	var empty;
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
	xmlgen.generateXML(input, empty, function (err, result) {
		assert.strictEqual(err, null);
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
};