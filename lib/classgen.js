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

var stringgen = require('./stringgen');

function classError(classes, callback) {
	try {
		throw 'Class Generator Error';
	} catch (e) {
		callback(e);
	}
}

function classData(classes, callback) {
	callback(null, classes);
}

function classFunction(classes, callback) {
	classes(function (err, data) {
		if (err) {
			callback(err);
		} else {
			generateClass(data, callback);
		}
	});
}

function classObject(classes, callback) {
	var classArray = [];

	if (classes instanceof Array) {
		classArray = classes.map(function (item, index, array) {
			var retVal = [item, ' '];
			if (index == (array.length - 1)) {
				retVal = item;
			}
			return retVal;
		});
	} else {
		classArray.push(classes);
	}
	callback(null, classArray);
}

var classMap = {
	'object': classObject,
	'function': classFunction,
	'string': classData,
	'undefined': classError,
	'number': classError,
};

function generateClass(classes, callback) {
	process.nextTick(function () {
		classMap[typeof classes](classes, function (err, data) {
			if (err) {
				callback(err);
			} else {
				stringgen.generateString(data, callback);
			}
		});
	});
}

var exports;

exports.generateClass = generateClass;
