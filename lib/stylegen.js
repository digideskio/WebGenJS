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

var styleval = require('./styleval');

var styleMap = {
	'object': styleObject,
	'function': styleFunction,
	'undefined': argumentError,
	'string': argumentError,
	'number': argumentError,
};

function argumentError() {
	throw 'Style Argument Error';
}

function generateStyle(styles, position, callback) {
	process.nextTick(function() {
		styleMap[typeof styles](styles, position, callback);
	});
}

function styleData(style, position, callback) {
	callback([style], position);
}

function styleFunction(styles, position, callback) {
	styles(function(data) {
		generateStyle(data, position, callback);
	});
}

function styleObject(styles, position, callback) {
	var dataArray = [];
	var styleValues;
	var count = 0;

	if (styles instanceof Array) {
		for (var style in styles) {
			dataArray.push('');
			count++;
			generateStyle(styles[style], dataArray.length - 1,
				function (cbdata, cbposition) {
					count--;
					dataArray[cbposition] = cbdata;
					if (count == 0) {
						callback(dataArray, position);
					}
				}
			);
		}
	} else {
		for (var style in styles) {
			if (!styleval.validateStyleName(style)) {
				throw 'Invalid style:' + style;
			}

			styleValues = styles[style];

			if (styleValues instanceof Array) {
				for (var styleValue in styleValues) {
					dataArray.push(style + ':' + styleValues[styleValue] + ';');
				}
			} else {
				dataArray.push(style + ':' + styleValues + ';');
			}
		}
		callback(dataArray, position);
	}
}

exports.generateStyle = generateStyle;
