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

var htmlutils = require('htmlutils');
var htmlgen = require('htmlgen');

exports.testHtmlUtilsHr = function (test, assert) {
	var input = htmlutils.hr;

	var expectedOutput = '<hr />\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}

exports.testHtmlUtilsBr = function (test, assert) {
	var input = htmlutils.br;

	var expectedOutput = '<br />\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}

exports.testHtmlUtilsBulletedList = function (test, assert) {
	var input = htmlutils.bulletedList(['Test1', 'Test2', 'Test3', 'Test4']);

	var expectedOutput = '<ul>\n<li>\nTest1\n</li>\n<li>\nTest2\n</li>\n' +
		'<li>\nTest3\n</li>\n<li>\nTest4\n</li>\n</ul>\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}

exports.testHtmlUtilsBulletedListWithWrongObject = function (test, assert) {
	var pass = false;
	try {
 		htmlutils.bulletedList({input: 'input'}, 3);
	} catch (e) {
		pass = true;
	}
	assert.ok(pass);
	test.finish();
}

exports.testHtmlUtilsNumberedList = function (test, assert) {
	var input = htmlutils.numberedList(['Test1', 'Test2', 'Test3'], 3);

	var expectedOutput = '<ol start=\"3\">\n<li>\nTest1\n</li>\n' +
	'<li>\nTest2\n</li>\n<li>\nTest3\n</li>\n</ol>\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}

exports.testHtmlUtilsNumberedListWithWrongObject = function (test, assert) {
	var pass = false;
	try {
 		htmlutils.numberedList({input: 'input'}, 3);
	} catch (e) {
		pass = true;
	}
	assert.ok(pass);
	test.finish();
}

exports.testHtmlUtilsDefinitionList = function (test, assert) {
	var input = htmlutils.definitionList([
		{item: 'Item1', desc: 'Desc1'},
		{item: 'Item2', desc: 'Desc2'},
		{item: 'Item3', desc: 'Desc3'}
	]);

	var expectedOutput = '<dl>\n' +
	'<dt>\nItem1\n</dt>\n<dd>\nDesc1\n</dd>\n' +
	'<dt>\nItem2\n</dt>\n<dd>\nDesc2\n</dd>\n' +
	'<dt>\nItem3\n</dt>\n<dd>\nDesc3\n</dd>\n' +
	'</dl>\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}

exports.testHtmlUtilsDefinitionListWithWrongObject = function (test, assert) {
	var pass = false;
	try {
 		htmlutils.definitionList({input: 'input'});
	} catch (e) {
		pass = true;
	}
	assert.ok(pass);
	test.finish();
}

exports.testHtmlUtilsCSS = function (test, assert) {
	var input = htmlutils.css({sel:'h1', style: {background: 'red'}});

	var expectedOutput = '<style type=\"text/css\">\n' +
	'h1 { ' +
	'background:red;' +
	' }\n\n' +
	'</style>\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}

exports.testHtmlUtilsCSSWithError = function (test, assert) {
	var empty;
	var input = htmlutils.css({sel:'h1', style: empty});

	htmlgen.generateHTML(input, function(err, result) {
		assert.ok(typeof result === 'undefined');
		assert.notStrictEqual(err, null);
		test.finish();
	});
}

exports.testHtmlUtilsCSSSelector = function (test, assert) {
	var input = htmlutils.cssSelector('h1', {background: 'red'});

	var expectedOutput = '<style type=\"text/css\">\n' +
	'h1 { ' +
	'background:red;' +
	' }\n\n' +
	'</style>\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}

exports.testHtmlUtilsCSSClass = function (test, assert) {
	var input = htmlutils.cssClass('cl', {background: 'red'});

	var expectedOutput = '<style type=\"text/css\">\n' +
	'.cl { ' +
	'background:red;' +
	' }\n\n' +
	'</style>\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}

exports.testHtmlUtilsCSSSelectorAndClass = function (test, assert) {
	var input = htmlutils.cssSelectorAndClass('h1', 'cl', {background: 'red'});

	var expectedOutput = '<style type=\"text/css\">\n' +
	'h1.cl { ' +
	'background:red;' +
	' }\n\n' +
	'</style>\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}

exports.testHtmlUtilsCSSId = function (test, assert) {
	var input = htmlutils.cssId('testId', {background: 'red'});

	var expectedOutput = '<style type=\"text/css\">\n' +
	'#testId { ' +
	'background:red;' +
	' }\n\n' +
	'</style>\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}

function testFunc() {
	return 1;
}
	
exports.testHtmlUtilsScript = function (test, assert) {
	var input = htmlutils.script(testFunc);

	var expectedOutput = '<script type=\"text/javascript\">\n' +
	'function testFunc() {\n' +
	'\treturn 1;\n' +
	'}\n' +
	'</script>\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}

exports.testHtmlUtilsLoadScript = function (test, assert) {
	var input = htmlutils.loadScript(testFunc);

	var expectedOutput = '<script type=\"text/javascript\">\n' +
	'function testFunc() {\n' +
	'\treturn 1;\n' +
	'}.call();\n' +
	'</script>\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}

exports.testHtmlUtilsScriptWithUndefined = function (test, assert) {
	var pass = false;
	var empty;
	try {
 		htmlutils.script(empty);
	} catch (e) {
		pass = true;
	}
	assert.ok(pass);
	test.finish();
}

exports.testHtmlUtilsScriptWithAnonymousFunction = function (test, assert) {
	var pass = false;
	try {
 		htmlutils.script(function () {});
	} catch (e) {
		pass = true;
	}
	assert.ok(pass);
	test.finish();
}

exports.testHtmlUtilsGridLayout = function (test, assert) {
	var input = htmlutils.gridLayout(['Test1', 'Test2', 'Test3'], 2);

	var expectedOutput = '<table>\n' +
	'<tr>\n<td>\nTest1\n</td>\n<td>\nTest2\n</td>\n</tr>\n' +
	'<tr>\n<td>\nTest3\n</td>\n</tr>\n' +
	'</table>\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}

exports.testHtmlUtilsGridLayoutWrongWidth = function (test, assert) {
	var pass = false;
	try {
 		htmlutils.gridLayout(['Test1', 'Test2', 'Test3'], 'input');
	} catch (e) {
		pass = true;
	}
	assert.ok(pass);
	test.finish();
}

exports.testHtmlUtilsGridLayoutWrongArray = function (test, assert) {
	var pass = false;
	try {
 		htmlutils.gridLayout({input: 'input'}, 2);
	} catch (e) {
		pass = true;
	}
	assert.ok(pass);
	test.finish();
}

exports.testHtmlUtilsScalingGridLayout = function (test, assert) {
	var input = htmlutils.scalingGridLayout(['Test1', 'Test2', 'Test3'], 2);

	var expectedOutput = '<table style=\"width:100%;\">\n' +
	'<tr>\n<td>\nTest1\n</td>\n<td>\nTest2\n</td>\n</tr>\n' +
	'<tr>\n<td>\nTest3\n</td>\n</tr>\n' +
	'</table>\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}

exports.testHtmlUtilsVerticalLayout = function (test, assert) {
	var input = htmlutils.verticalLayout(['Test1', 'Test2', 'Test3']);

	var expectedOutput = '<table>\n' +
	'<tr>\n<td>\nTest1\n</td>\n</tr>\n' +
	'<tr>\n<td>\nTest2\n</td>\n</tr>\n' +
	'<tr>\n<td>\nTest3\n</td>\n</tr>\n' +
	'</table>\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}

exports.testHtmlUtilsVerticalScalingLayout = function (test, assert) {
	var input = htmlutils.verticalScalingLayout(['Test1', 'Test2', 'Test3']);

	var expectedOutput = '<table style=\"width:100%;\">\n' +
	'<tr>\n<td>\nTest1\n</td>\n</tr>\n' +
	'<tr>\n<td>\nTest2\n</td>\n</tr>\n' +
	'<tr>\n<td>\nTest3\n</td>\n</tr>\n' +
	'</table>\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}

exports.testHtmlUtilsHorizontalGridLayout = function (test, assert) {
	var input = htmlutils.horizontalGridLayout(['Test1', 'Test2', 'Test3'], 2);

	var expectedOutput = '<table>\n' +
	'<tr>\n<td>\nTest1\n</td>\n<td>\nTest2\n</td>\n</tr>\n' +
	'<tr>\n<td>\nTest3\n</td>\n</tr>\n' +
	'</table>\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}

exports.testHtmlUtilsHorizontalGridLayoutWrongHeight =function(test, assert) {
	var pass = false;
	try {
 		htmlutils.horizontalGridLayout(['Test1', 'Test2', 'Test3'], 'input');
	} catch (e) {
		pass = true;
	}
	assert.ok(pass);
	test.finish();
}

exports.testHtmlUtilsHorizontalGridLayoutWrongArray =function(test, assert) {
	var pass = false;
	try {
 		htmlutils.horizontalGridLayout({input: 'input'}, 2);
	} catch (e) {
		pass = true;
	}
	assert.ok(pass);
	test.finish();
}

exports.testHtmlUtilsHorizontalScalingGridLayout = function (test, assert) {
	var input = htmlutils.horizontalScalingGridLayout(
		['Test1', 'Test2', 'Test3'], 2);

	var expectedOutput = '<table style=\"height:100%;\">\n' +
	'<tr>\n<td>\nTest1\n</td>\n<td>\nTest2\n</td>\n</tr>\n' +
	'<tr>\n<td>\nTest3\n</td>\n</tr>\n' +
	'</table>\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}

exports.testHtmlUtilsHorizontalLayout = function (test, assert) {
	var input = htmlutils.horizontalLayout(['Test1', 'Test2', 'Test3']);

	var expectedOutput = '<table>\n' +
	'<tr>\n<td>\nTest1\n</td>\n' +
	'<td>\nTest2\n</td>\n' +
	'<td>\nTest3\n</td>\n</tr>\n' +
	'</table>\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}

exports.testHtmlUtilsHorzontalScalingLayout = function (test, assert) {
	var input = htmlutils.horizontalScalingLayout(['Test1', 'Test2', 'Test3']);

	var expectedOutput = '<table style=\"height:100%;\">\n' +
	'<tr>\n<td>\nTest1\n</td>\n' +
	'<td>\nTest2\n</td>\n' +
	'<td>\nTest3\n</td>\n</tr>\n' +
	'</table>\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}

exports.testHtmlUtilsImage = function (test, assert) {
	var input = htmlutils.image('path/image.png', 200, 100);

	var expectedOutput = '<img src=\"path/image.png\" ' +
	'width=\"200\" height=\"100\" />\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}

exports.testHtmlUtilsScalingImage = function (test, assert) {
	var input = htmlutils.scalingImage('path/image.png', 200, 100);

	var expectedOutput = '<img src=\"path/image.png\" ' +
	'width=\"200\" height=\"100\" style=\"width:100%;height:100%;\" />\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}

exports.testHtmlUtilsLink = function (test, assert) {
	var input = htmlutils.link('http://someurl', 'Link text');

	var expectedOutput = '<a href=\"http://someurl\">\n' +
	'Link text\n' +
	'</a>\n';

	htmlgen.generateHTML(input, function(err, result) {
		assert.strictEqual(result, expectedOutput);
		test.finish();
	});
}