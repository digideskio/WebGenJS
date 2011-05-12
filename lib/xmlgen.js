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

function xmlString(data, session, callback) {
	callback(null, [data, '\n']);
}

function xmlNumber(data, session, callback) {
	callback(null, [data, '\n']);
}

function xmlJSMLFunction(object, session, callback) {
	object.toJSML(function (err, result) {
		if (err) {
			callback(err);
		} else {
			generateXML(result, session, callback);
		}
	});
}

function xmlJSMLData(object, session, callback) {
	var dataArray = [];
	var tag = object.tag;
	var count = 0;

	function xmlBodyArrayObject() {
		var bodyArray = object.body.map(function (item, index) {
			count++;
			generateXML(item, session, function (err, cbdata) {
				if (err) {
					callback(err);
				} else {
					count--;
					bodyArray[index] = cbdata;
					if (count === 0) {
						callback(err, dataArray);
					}
				}
			});
			return '';
		});
		dataArray.push(bodyArray);
	}
	
	function xmlBodyDataObject() {
		var bodyPos;
		dataArray.push('');
		count++;
		bodyPos = dataArray.length - 1;
		generateXML(object.body, session, function (err, result) {
			if (err) {
				callback(err);
			} else {
				count--;
				dataArray[bodyPos] = result;
				if (count === 0) {
					callback(err, dataArray);
				}
			}
		});
	}
	
	function callAttributeFuncObject(agdata, agposition) {
		process.nextTick(function () {
			agdata(function (err, cbdata) {
				if (err) {
					callback(err);
				} else {
					count--;
					dataArray[agposition] = cbdata;
					if (count === 0) {
						callback(err, dataArray);
					}
				}
			});
		});
	}

	function xmlAttributes() {
		var attrGenerator;
		var attribute;
		
		function callAttributeGenerator(generator, agdata, agposition) {
			process.nextTick(function () {
				generator(agdata, function (err, cbdata) {
					if (err) {
						callback(err);
					} else {
						count--;
						dataArray[agposition] = cbdata;
						if (count === 0) {
							callback(err, dataArray);
						}
					}
				});
			});
		}

		for (attribute in object) {
			if (object.hasOwnProperty(attribute)) {
				if ((typeof session !== 'undefined') &&
					(typeof session.attributeGenerators !== 'undefined')) {
					attrGenerator = session.attributeGenerators[attribute];
				}
				if (attribute != 'tag' && attribute != 'body') {
					dataArray.push([' ', attribute, '=\"']);
					dataArray.push('');
					if (typeof attrGenerator === 'function') {
						count++;
						callAttributeGenerator(attrGenerator,
							object[attribute], dataArray.length - 1);
					} else {
						if (typeof object[attribute] === 'function') {
							count++;
							callAttributeFuncObject(object[attribute],
								dataArray.length - 1);
						} else {
							dataArray.push(object[attribute]);
						}
					}
					dataArray.push('\"');
				}
			}
		}
	}
	
	try {
		if ((typeof tag === 'undefined') && (typeof session !== 'undefined')) {
			tag = session.defaultTag;
		}

		if (typeof tag === 'undefined') {
			throw new Error('Undeclared tag, and default missing');
		}
		
		dataArray.push('<');
		
		if (typeof tag === 'function') {
			dataArray.push('');
			count++;
			callAttributeFuncObject(tag, dataArray.length - 1);
		} else {
			dataArray.push(tag);
		}

		xmlAttributes();

		if (typeof object.body === 'undefined') {
			dataArray.push(' />\n');
			if (count === 0) {
				callback(null, dataArray);
			}
		} else {
			dataArray.push('>\n');
			if (object.body instanceof Array) {
				xmlBodyArrayObject();
			} else {
				xmlBodyDataObject();
			}
			dataArray.push(['<\/', tag, '>\n']);
		}
	} catch (e) {
		callback(e);
	}
}

function xmlObject(object, session, callback) {
	if (typeof object.toJSML === 'function') {
		xmlJSMLFunction(object, session, callback);
	} else {
		xmlJSMLData(object, session, callback);
	}
}

function xmlFunction(xml, session, callback) {
	xml(function (err, data) {
		if (err) {
			callback(err);
		} else {
			generateXML(data, session, callback);
		}
	});
}

function xmlErrorUndefined(xml, session, callback) {
	callback(new Error('XML Generator Error: Undefined'));
}

var xmlMap = {
	'object': xmlObject,
	'function': xmlFunction,
	'undefined': xmlErrorUndefined,
	'number': xmlNumber,
	'string': xmlString
};

function generateXML(xml, session, callback) {
	process.nextTick(function () {
		xmlMap[typeof xml](xml, session, function (err, data) {
			process.nextTick(function () {
				if (err) {
					callback(err);
				} else {
					stringgen.generateString(data, callback);
				}
			});
		});
	});
}

var exports;

exports.generateXML = generateXML;
