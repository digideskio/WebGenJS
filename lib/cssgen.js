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
var stringgen = require('./stringgen');

function cssArrayObject(cssArray, callback) {
	var count = 0;
	var resultArray = [];
	resultArray = cssArray.map(function (item, index) {
		count++;
		generateCSS(item, function (err, result) {
			if (err) {
				callback(err);
			} else {
				count--;
				resultArray[index] = result;
				if (count === 0) {
					callback(err, resultArray);
				}
			}
		});
		return '';
	});
}

function cssDataObject(cssData, callback) {
	var stylePos;
	var resultArray = [];
	var sel = typeof cssData.sel === 'undefined'
		? '' : cssData.sel;
	var cl = typeof cssData.cl === 'undefined'
		? '' : '.' + cssData.cl;
	var id = typeof cssData.id === 'undefined'
		? '' : '#' + cssData.id;
	if (((typeof cssData.sel !== 'undefined') ||
		(typeof cssData.cl !== 'undefined')) &&
			(typeof cssData.id !== 'undefined')) {
		callback(new Error('Cannot combine id selector with other selectors'));
	} else {
		resultArray.push([sel, cl, id, ' { ']);
		resultArray.push('');
		stylePos = resultArray.length - 1;
		stylegen.generateStyle(cssData.style,
			function (err, result) {
				if (err) {
					callback(err);
				} else {
					resultArray[stylePos] = result;
					callback(err, resultArray);
				}
			});
		resultArray.push(' }\n');
	}
}

function cssObject(cssObject, callback) {
	if (cssObject instanceof Array) {
		cssArrayObject(cssObject, callback);
	} else {
		cssDataObject(cssObject, callback);
	}
}

function cssFunction(css, callback) {
	css(function (err, result) {
		if (err) {
			callback(err);
		} else {
			generateCSS(result, callback);
		}
	});
}

function cssError(css, callback) {
	callback(new Error('CSS Generator Error'));
}

var cssMap = {
	'object': cssObject,
	'function': cssFunction,
	'undefined': cssError,
	'string': cssError,
	'number': cssError
};

function generateCSS(css, callback) {
	process.nextTick(function () {
		cssMap[typeof css](css, function (err, result) {
			process.nextTick(function () {
				if (err) {
					callback(err);
				} else {
					stringgen.generateString(result, function (err, result) {
						callback(err, result);
					});
				}
		});
		});
	});
}

var exports;

exports.generateCSS = generateCSS;
