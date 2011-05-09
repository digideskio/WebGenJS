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

var styleval = require('./styleval');
var stringgen = require('./stringgen');

function styleError(style, callback) {
	try {
		throw 'Style Generator Error';
	} catch (e) {
		callback(e);
	}
}

function styleFunction(styles, callback) {
	styles(function (err, data) {
		if (err) {
			callback(err);
		} else {
			generateStyle(data, callback);
		}
	});
}

function styleDataObject(styles, callback) {
	var stylesArray = [];
	var styleValues;
	var style = '';

	function styleMap(item) {
		return [this, ':', item, ';'];
	}
	for (style in styles) {
		if (styles.hasOwnProperty(style)) {
			if (!styleval.validateStyleName(style)) {
				throw 'Invalid style:' + style;
			}

			styleValues = styles[style];

			if (styleValues instanceof Array) {
				stylesArray.push(styleValues.map(styleMap, style));
			} else {
				stylesArray.push([style, ':', styleValues, ';']);
			}
		}
	}
	callback(null, stylesArray);
}

function styleArrayObject(styles, callback) {
	var stylesArray = [];
	var count = 0;
	stylesArray = styles.map(function (item, index) {
		count++;
		generateStyle(item, function (err, result) {
				if (err) {
					callback(err);
				} else {
					count--;
					stylesArray[index] = result;
					if (count === 0) {
						callback(err, stylesArray);
					}
				}
		});
		return '';
	});
}

function styleObject(styles, callback) {
	try {
		if (styles instanceof Array) {
			styleArrayObject(styles, callback);
		} else {
			styleDataObject(styles, callback);
		}
	} catch (e) {
		callback(e);
	}
}

var styleMap = {
	'object': styleObject,
	'function': styleFunction,
	'undefined': styleError,
	'string': styleError,
	'number': styleError,
};

function generateStyle(styles, callback) {
		process.nextTick(function () {
		styleMap[typeof styles](styles, function (err, result) {
			if (err) {
				callback(err);
			} else {
				stringgen.generateString(result, callback);
			}
		});
	});
}

var exports;

exports.generateStyle = generateStyle;
