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

var cssgen = require('./cssgen');

//=============================================================================
//Layouts
function horizontalScalingLayout(itemArray) {
	return horizontalScalingGridLayout(itemArray, 1);
}

function horizontalLayout(itemArray) {
	return horizontalGridLayout(itemArray, 1);
}

function verticalScalingLayout(itemArray) {
	return scalingGridLayout(itemArray, 1);
}

function verticalLayout(itemArray) {
	return gridLayout(itemArray, 1);
}

function horizontalGridLayout(itemArray, height) {
	var gridArray = [];
	var rowArray = [];

	if (typeof height !== 'number') {
		throw 'Not a number';
	}

	if (typeof itemArray !== 'object' ||
		!(itemArray instanceof Array)) {
		throw 'Not an array';
	}

	var rowLength = Math.floor(itemArray.length/height) +
		((itemArray.length%height > 0) ? 1 : 0);

	for (var i = 0; i < itemArray.length;) {
		rowArray = [];

		for (var j = 0; i < itemArray.length && j < rowLength; i++, j++) {
			rowArray.push({tag:'td', body:itemArray[i]});
		}
		gridArray.push({tag:'tr', body:{body:rowArray}});
	}
	return {tag:'table', cellspacing:0, body:gridArray};
}

function horizontalScalingGridLayout(itemArray, height, margin) {
	var gridArray = [];
	var rowArray = [];

	if (typeof height !== 'number') {
		throw 'Not a number';
	}

	if (typeof itemArray !== 'object' ||
		!(itemArray instanceof Array)) {
		throw 'Not an array';
	}

	var rowLength = Math.floor(itemArray.length/height) +
		((itemArray.length%height > 0) ? 1 : 0);

	for (var i = 0; i < itemArray.length;) {
		rowArray = [];

		for (var j = 0; i < itemArray.length && j < rowLength; i++, j++) {
			rowArray.push({tag:'td', body:itemArray[i]});
		}
		gridArray.push({tag:'tr', body:{body:rowArray}});
	}
	return {tag:'table', cellspacing:0,  style:{height:'100%'}, body:gridArray};
}

function gridLayout(itemArray, width) {
	var gridArray = [];
	var rowArray = [];

	if (typeof width !== 'number') {
		throw 'Not a number';
	}

	if (typeof itemArray !== 'object' ||
		!(itemArray instanceof Array)) {
		throw 'Not an array';
	}

	for (var i = 0; i < itemArray.length;) {
		rowArray = [];

		for (var j = 0; i < itemArray.length && j < width; i++, j++) {
			rowArray.push({tag:'td', body:itemArray[i]});
		}
		gridArray.push({tag:'tr', body:{body:rowArray}});
	}
	return {tag:'table', cellspacing:0, body:gridArray};
}

function scalingGridLayout(itemArray, width) {
	var gridArray = [];
	var rowArray = [];

	if (typeof width !== 'number') {
		throw 'Not a number';
	}

	if (typeof itemArray !== 'object' ||
		!(itemArray instanceof Array)) {
		throw 'Not an array';
	}

	for (var i = 0; i < itemArray.length;) {
		rowArray = [];

		for (var j = 0; i < itemArray.length && j < width; i++, j++) {
			rowArray.push({tag:'td', body:itemArray[i]});
		}
		gridArray.push({tag:'tr', body:{body:rowArray}});
	}
	return {tag:'table', cellspacing:0, style:{width:'100%'}, body:gridArray};
}

//=============================================================================
//Lists
function mapListItem(text) {
	return {tag:'li', body:text};
}

function bulletedList(textArray) {
	if (typeof textArray !== 'object' ||
		!(textArray instanceof Array)) {
		throw 'Not an array';
	}
	return {tag:'ul', body:textArray.map(mapListItem)};
}

function numberedList(textArray, start) {
	var localStart = typeof(start) !== 'undefined' ? start : 1;

	if (typeof textArray !== 'object' ||
		!(textArray instanceof Array)) {
		throw 'Not an array';
	}
	return {tag:'ol', 'start':localStart, body:textArray.map(mapListItem)};
}

function definitionList(definitionsArray) {
	var resultingArray = [];

	if (typeof definitionsArray !== 'object' ||
		!(definitionsArray instanceof Array)) {
		throw 'Not an array';
	}

	for (var i = 0; i < definitionsArray.length; i++) {
		resultingArray.push({tag:'dt',
			body:definitionsArray[i].item});

		resultingArray.push({tag:'dd',
			body:definitionsArray[i].desc});
	}
	return {tag:'dl', body:resultingArray};
}

//=============================================================================
//Style

function style(style) {
	return function (callback) {
		cssgen.generateCSS(style, function(result) {
			callback({tag:'style', type:'text/css', body:result});
		});
	};
}

function styleSelector(sel, style) {
	return function (callback) {
		cssgen.generateCSS({sel:sel, style:style}, function(result) {
			callback({tag:'style', type:'text/css', body:result});
		});
	};
}

function styleId(id, style) {
	return function (callback) {
		cssgen.generateCSS({id:id, style:style}, function(result) {
			callback({tag:'style', type:'text/css', body:result});
		});
	};
}


function styleClass(cl, style) {
	return function (callback) {
		cssgen.generateCSS({cl:cl, style:style}, function(result) {
			callback({tag:'style', type:'text/css', body:result});
		});
	};
}

function styleSelectorAndClass(sel, cl, style) {
	return function (callback) {
		cssgen.generateCSS({cl:cl, sel:sel, style:style}, function(result) {
			callback({tag:'style', type:'text/css', body:result});
		});
	};
}


//=============================================================================
//Scripts
function loadScript(script) {
	if (typeof script !== 'function') {
		throw 'Not a function object';
	}

	if (typeof script.name === 'undefined') {
		throw 'Anonymous functions cannot be deployed';
	}
	return {tag:'script', type:'text/javascript',
		body:('var ' + script.name + ';\n' + script.toString() +
		';\n' + script.name + '.call();')};
}

function script(script) {
	if (typeof script !== 'function') {
		throw 'Not a function object';
	}

	if (typeof script.name === 'undefined') {
		throw 'Anonymous functions cannot be deployed';
	}
	return {tag:'script', type:'text/javascript', body:script.toString()};
}

//=============================================================================
//Other
function scalingImage(src, height, width) {
	var retVal = {tag:'img', 'src':src, style:{width:'100%', height:'100%'}};

	if (typeof height === 'number') {
		retVal.height = height;
	}

	if (typeof width === 'number') {
		retVal.width = width;
	}
	return retVal;
}

function image(src, height, width) {
	var retVal = {tag:'img', 'src':src};

	if (typeof height === 'number') {
		retVal.height = height;
	}

	if (typeof width === 'number') {
		retVal.width = width;
	}
	return retVal;
}

function br(callback) {
	callback({tag:'br'});
}

function hr(callback) {
	callback({tag:'hr'});
}

function link(href, body) {
	return {tag:'a', 'href':href, 'body': body};
}

//=============================================================================
//Exports
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
exports.style = style;
exports.styleSelector = styleSelector;
exports.styleId = styleId;
exports.styleClass = styleClass;
exports.styleSelectorAndClass = styleSelectorAndClass;
exports.script = script;
exports.loadScript = loadScript;
exports.image = image;
exports.scalingImage = scalingImage;
exports.link = link;
exports.br = br;
exports.hr = hr;
