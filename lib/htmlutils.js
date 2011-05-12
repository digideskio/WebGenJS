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

var cssgen = require('./cssgen');

//=============================================================================
//Layouts

function horizontalGridLayout(itemArray, height) {
	var gridArray = [];
	var rowArray = [];
	var retVal = {tag: 'table', body: gridArray};
	var i;
	var j;

	if (typeof height !== 'number') {
		throw new Error('Not a number');
	}

	if (typeof itemArray !== 'object' || !(itemArray instanceof Array)) {
		throw new Error('Not an array');
	}

	var rowLength = Math.floor(itemArray.length / height) +
		((itemArray.length % height > 0) ? 1 : 0);
	for (i = 0; i < itemArray.length;) {
		rowArray = [];

		for (j = 0; i < itemArray.length && j < rowLength; i++, j++) {
			rowArray.push({tag: 'td', body: itemArray[i]});
		}
		gridArray.push({tag: 'tr', body: rowArray});
	}
	return retVal;
}

function horizontalScalingGridLayout(itemArray, height) {
	var retVal = horizontalGridLayout(itemArray, height);
	retVal.style = {height: '100%'};
	return retVal;
}

function horizontalScalingLayout(itemArray) {
	return horizontalScalingGridLayout(itemArray, 1);
}

function horizontalLayout(itemArray) {
	return horizontalGridLayout(itemArray, 1);
}

function gridLayout(itemArray, width) {
	var gridArray = [];
	var retVal = {tag: 'table', body: gridArray};
	var rowArray = [];
	var i;
	var j;

	if (typeof width !== 'number') {
		throw new Error('Not a number');
	}

	if (typeof itemArray !== 'object' || !(itemArray instanceof Array)) {
		throw new Error('Not an array');
	}

	for (i = 0; i < itemArray.length;) {
		rowArray = [];

		for (j = 0; i < itemArray.length && j < width; i++, j++) {
			rowArray.push({tag: 'td', body: itemArray[i]});
		}
		gridArray.push({tag: 'tr', body: rowArray});
	}
	return retVal;
}

function scalingGridLayout(itemArray, width) {
	var retVal = gridLayout(itemArray, width);
	retVal.style = {width: '100%'};
	return retVal;
}

function verticalScalingLayout(itemArray) {
	return scalingGridLayout(itemArray, 1);
}

function verticalLayout(itemArray) {
	return gridLayout(itemArray, 1);
}

//=============================================================================
//Lists
function mapListItem(text) {
	return {tag: 'li', body: text};
}

function bulletedList(textArray) {
	if (typeof textArray !== 'object' || !(textArray instanceof Array)) {
		throw new Error('Not an array');
	}
	return {tag: 'ul', body: textArray.map(mapListItem)};
}

function numberedList(textArray, start) {
	var localStart = typeof start !== 'undefined' ? start : 1;

	if (typeof textArray !== 'object' || !(textArray instanceof Array)) {
		throw new Error('Not an array');
	}
	return {tag: 'ol', 'start': localStart, body: textArray.map(mapListItem)};
}

function definitionList(definitionsArray) {
	var resultingArray = [];
	var i;

	if (typeof definitionsArray !== 'object' ||
			!(definitionsArray instanceof Array)) {
		throw new Error('Not an array');
	}

	for (i = 0; i < definitionsArray.length; i++) {
		resultingArray.push({tag: 'dt',
			body: definitionsArray[i].item});

		resultingArray.push({tag: 'dd',
			body: definitionsArray[i].desc});
	}
	return {tag: 'dl', body: resultingArray};
}

//=============================================================================
//Style

function css(styleParam) {
	return function (callback) {
		cssgen.generateCSS(styleParam, function (err, result) {
			if (err) {
				callback(err);
			} else {
				callback(err, {tag: 'style', type: 'text/css', body: result});
			}
		});
	};
}

function cssSelector(sel, style) {
	return css({sel: sel, style: style});
}

function cssId(id, style) {
	return css({id: id, style: style});
}

function cssClass(cl, style) {
	return css({cl: cl, style: style});
}

function cssSelectorAndClass(sel, cl, style) {
	return css({sel: sel, cl: cl, style: style});
}


//=============================================================================
//Scripts
function loadScript(scriptData) {
	var retVal = script(scriptData);
	retVal.body = retVal.body + '.call();';
	return retVal;
}

function script(scriptData) {
	if (typeof scriptData !== 'function') {
		throw new Error('Not a function object');
	}

	if (typeof scriptData.name === 'undefined' || scriptData.name === '') {
		throw new Error('Anonymous functions cannot be deployed');
	}
	return {tag: 'script', type: 'text/javascript',
		body: scriptData.toString()};
}

//=============================================================================
//Other
function scalingImage(src, width, height) {
	var retVal = image(src, width, height);
	retVal.style = {width: '100%', height: '100%'};
	return retVal;
}

function image(src, width, height) {
	var retVal = {tag: 'img', 'src': src};

	if (typeof width === 'number') {
		retVal.width = width;
	}
	
	if (typeof height === 'number') {
		retVal.height = height;
	}

	return retVal;
}

function br(callback) {
	callback(null, {tag: 'br'});
}

function hr(callback) {
	callback(null, {tag: 'hr'});
}

function link(href, body) {
	return {tag: 'a', 'href': href, 'body': body};
}

//=============================================================================
//Exports
var exports;

exports.gridLayout = gridLayout;
exports.scalingGridLayout = scalingGridLayout;
exports.horizontalGridLayout = horizontalGridLayout;
exports.horizontalScalingGridLayout = horizontalScalingGridLayout;
exports.verticalLayout = verticalLayout;
exports.verticalScalingLayout = verticalScalingLayout;
exports.horizontalLayout = horizontalLayout;
exports.horizontalScalingLayout = horizontalScalingLayout;
exports.bulletedList = bulletedList;
exports.numberedList = numberedList;
exports.definitionList = definitionList;
exports.css = css;
exports.cssSelector = cssSelector;
exports.cssId = cssId;
exports.cssClass = cssClass;
exports.cssSelectorAndClass = cssSelectorAndClass;
exports.script = script;
exports.loadScript = loadScript;
exports.image = image;
exports.scalingImage = scalingImage;
exports.link = link;
exports.br = br;
exports.hr = hr;
