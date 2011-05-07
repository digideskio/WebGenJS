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

var stylegen = require('./stylegen');

//Common functions

function argumentError(data) {
	throw 'XML Argument Error: ' + data;
}

//String functions

function stringData(data) {
	return data;
}

function stringObject(array) {
	var retVal = [];

	if (array instanceof Array) {
		retVal = array.map(generateString);
	} else {
		throw "Error";
	}
	return retVal.join('');
}

var stringMap = {
	'object': stringObject,
	'function': argumentError,
	'undefined': argumentError,
	'number': argumentError,
	'string': stringData
};

function generateString(array) {
	return stringMap[typeof array](array);
}

//Selector functions

function selectorObject(selObject, position, callback) {
	var dataArray = [];
	var selArray = [];
	var count = 0;
	var sel;
	var cl;
	var id;

	if (selObject instanceof Array) {
		selArray = selObject.map(function (item, index) {
			count++;
			generateSelectors(item, index, function (cbdata, cbposition) {
				count--;
				selArray[cbposition] = cbdata;
				if (count === 0) {
					callback(dataArray, position);
				}
			});
			return '';
		});
		dataArray.push(selArray);
	} else {
		sel = typeof selObject.sel === 'undefined' ? '' : selObject.sel;
		cl = typeof selObject.cl === 'undefined' ? '' : '.' + selObject.cl;
		id = typeof selObject.id === 'undefined' ? '' : '#' + selObject.id;
		if (((typeof selObject.sel !== 'undefined') ||
			(typeof selObject.cl !== 'undefined')) &&
				(typeof selObject.id !== 'undefined')) {
			throw 'Cannot combine id selector with other selectors';
		}
		dataArray.push(['\n', sel, cl, id, ' { ']);
		dataArray.push('');
		stylegen.generateStyle(selObject.style, dataArray.length - 1,
			function (cbdata, cbposition) {
				dataArray[cbposition] = cbdata;
				callback(dataArray, position);
			});
		dataArray.push(' }');
	}
}

function selectorFunction(selectors, position, callback) {
	selectors(function (data) {
		generateSelectors(data, position, callback);
	});
}

var selectorMap = {
	'object': selectorObject,
	'function': selectorFunction,
	'undefined': argumentError,
	'string': argumentError,
	'number': argumentError
};

function generateSelectors(selectors, position, callback) {
	process.nextTick(function () {
		selectorMap[typeof selectors](selectors, position, callback);
	});
}

function generateStyle(style, position, callback) {
	stylegen.generateStyle(style, position, callback);
}

var notice = '/* Generated from JSS, by WebGenJS */';

function generateCSS(jss, callback) {
	process.nextTick(function () {
		generateSelectors(jss, 0, function (data) {
			callback(notice + generateString(data));
		});
	});
}

var exports;

exports.generateCSS = generateCSS;
