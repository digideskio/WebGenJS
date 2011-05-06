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

var stylegen = require('./stylegen');

var selectorMap = {
	'object': selectorObject,
	'function': selectorFunction,
	'undefined': argumentError,
	'string': argumentError,
	'number': argumentError
};

function argumentError() {
	throw 'CSS Argument Error';
}

function generateSelectors(selectors) {
	return selectorMap[typeof selectors](selectors);
}

function selectorObject(selObject) {
	var selectorArray = [];
	var retArray = [];
	var selObject;
	var sel;
	var cl;
	var id;

	if (selObject instanceof Array) {
		for (var selector in selObject) {
			retArray.push(generateSelectors(selObject[selector]));
		}
	} else {
		sel = typeof selObject.sel === 'undefined' ? '' : selObject.sel;
		cl = typeof selObject.cl === 'undefined' ? '' : '.' + selObject.cl;
		id = typeof selObject.id === 'undefined' ? '' : '#' + selObject.id;
		if (((typeof selObject.sel !== 'undefined') ||
			(typeof selObject.cl !== 'undefined')) &&
			(typeof selObject.id !== 'undefined')) {
				throw 'Cannot combine id selector with other selectors';
		}

		selectorArray.push(sel + cl + id + ' { ' +
			generateStyle(selObject.style) +
			' }');
		retArray.push(selectorArray.join(''));
	}

	return retArray.join('\n');
}

function selectorFunction(selectors) {
	return generateSelectors(selectors());
}

function generateStyle(style) {
	return stylegen.generateStyle(style);
}

var notice = '/* Generated from JSS, by WebGenJS */\n';

function generateCSS(jss, callback) {
	process.nextTick(function () {
		callback(notice + generateSelectors(jss));
	});
}

exports.generateCSS = generateCSS;
