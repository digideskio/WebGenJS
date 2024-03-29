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

//=============================================================================
//= The markup syntax
//=============================================================================

//=============================================================================
//The markup model is just any JavaScript object, using a few special
//properties. Here is an example of a simple tag:
var tag = {tag: 'h1', body: 'Awesome heading!'};

//=============================================================================
//It is also possible to add styles to the tag:
var otherTag = {tag: 'h1', body: 'Awesome red heading!', style: {color: 'red'}};
//Note that the style itself is a JavaScript object, not a CSS string.

//=============================================================================
//The body can also be an array of more tags, or more texts
var moreTags = {tag: 'div', body:
	[
		{tag: 'h1', body: 'Awesome red heading!', style: {color: 'red'}},
		{tag: 'p', body: 'And some paragraph text...'}
	],
	style: {background: 'blue', padding: 10}
};

//=============================================================================
//If the tag property is omitted, 'div' is assumed, thus the example above
//could also be written as:
var moreTagsImplicitDiv = {body:
	[
		{tag: 'h1', body: 'Awesome red heading!', style: {color: 'red'}},
		{tag: 'p', body: 'And some paragraph text...'}
	],
	style: {background: 'blue', padding: 10}
};

//=============================================================================
//Both body and style can be replaced by function objects that generates
//data:
function redHeading(callback) {
	callback(null, {tag: 'h1', body: 'Awesome red heading!',
		style: {color: 'red'}});
}

var fs = require('fs');

function paragraphText(callback) {
	fs.readFile('paragraph.txt', 'ascii', function (err, data) {
		callback(null, data);
	});
}

function paddedBlueStyle(callback) {
	callback(null, {background: 'blue', padding: 10});
}

var moreTagsWithFunctions = {body:
	[
		redHeading,
		{tag: 'p', body: paragraphText}
	],
	style: paddedBlueStyle
};
//These functions are called async when the html is generated.

//=============================================================================
//Function calls with parameters can of course also be used:
function redHeadingWithName(text) {
	return {tag: 'h1', body: text, style: {color: 'red'}};
}

var moreTagsWithFunctionsAndParameters = {body:
	[
		redHeadingWithName('Awesome red heading!'),
		{tag: 'p', body: paragraphText}
	],
	style: paddedBlueStyle
};

//=============================================================================
//By overloading/implementing the method toJSML in an object, the object can
//be used directly:
Date.prototype.toJSML = function (callback) {
	callback(null, {tag: 'time', body: this.getFullYear(),
	style: {color: 'green'}});
};

var moreTagsWithFunctionsParametersAndObjects = {body:
	[
		redHeadingWithName('Awesome red heading!'),
		{tag: 'p', body: 'And some paragraph text...'},
		new Date()
	],
	style: paddedBlueStyle
};

//=============================================================================
//All together now!
var allExamples = {body:
	[
		tag,
		otherTag,
		moreTags,
		moreTagsImplicitDiv,
		moreTagsWithFunctions,
		moreTagsWithFunctionsAndParameters,
		moreTagsWithFunctionsParametersAndObjects
	]
};

//=============================================================================
//= Generating HTML
//=============================================================================

//=============================================================================
//HTML can be generated by using the HTML generator:
var htmlgen = require('../lib/htmlgen');

htmlgen.generateHTML(allExamples, function (err, htmlString) {
	console.log(htmlString);
});