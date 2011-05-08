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

//Common functions

function stringArgumentError() {
	throw 'XML Error';
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
	'function': stringArgumentError,
	'undefined': stringArgumentError,
	'number': stringData,
	'string': stringData
};

function generateString(array) {
	return stringMap[typeof array](array);
}

//Body functions

function bodyData(data, session, position, callback) {
	callback(null ,[data + '\n'], position);
}

function bodyObject(object, session, position, callback, parentTag) {
	var i = 0;
	var dataArray = [];
	var bodyArray = [];
	var tag = object.tag;
	var attrGenerator;
	var count = 0;
	var attribute;

	function callAttributeGenerator(generator, agdata, agposition) {
		process.nextTick(function () {
			generator(agdata, agposition, function (err, cbdata, cbposition) {
				if (err) {
					callback(err);
				} else {
					count--;
					dataArray[cbposition] = cbdata;
					if (count === 0) {
						callback(err, dataArray, position);
					}
				}
			});
		});
	}
	
	try {
		if (typeof object.toJSML === 'function') {
			object.toJSML(function (err, data) {
				if (err) {
					callback(err);
				} else {
					generateBody(data, session, position, callback, parentTag);
				}
			});
		} else {
			if (typeof tag === 'undefined') {
				if (typeof session !== 'undefined') {
					tag = session.defaultTag;
				}
			}

			if (typeof tag !== 'string') {
				throw 'Undeclared tag, and default missing';
			}
		
			if ((typeof session !== 'undefined') &&
					(typeof session.tagValidator === 'function') &&
					!session.tagValidator(tag, parentTag)) {
				throw 'Invalid tag';
			}
		
			dataArray.push(['<', tag]);

			for (attribute in object) {
				if (object.hasOwnProperty(attribute)) {
					if ((typeof session !== 'undefined') &&
						(typeof session.attributeGenerators !== 'undefined')) {
						attrGenerator = session.attributeGenerators[attribute];
					}
					if (typeof attrGenerator === 'function') {
						dataArray.push([' ', attribute, '=\"']);
						dataArray.push('');
						count++;
						callAttributeGenerator(attrGenerator,
							object[attribute], dataArray.length - 1);
						dataArray.push('\"');
					} else if ((attribute !== 'tag') &&
							(attribute !== 'body')) {
						dataArray.push([' ', attribute, '=\"',
							object[attribute], '\"']);
					}
				}
			}
			if (typeof object.body === 'undefined') {
				dataArray.push(' />\n');
				if (count === 0) {
					callback(null, dataArray, position);
				}
			} else {
				dataArray.push('>\n');
				if (object.body instanceof Array) {
					bodyArray = object.body.map(function (item, index) {
						count++;
						generateBody(item, session,
							index,
							function (err, cbdata, cbposition) {
								if (err) {
									callback(err);
								} else {
									count--;
									bodyArray[cbposition] = cbdata;
									if (count === 0) {
										callback(err, dataArray, position);
									}
								}
							},
							tag);
						return '';
					});
					dataArray.push(bodyArray);
				} else {
					dataArray.push('');
					count++;
					generateBody(object.body, session, dataArray.length - 1,
						function (err, cbdata, cbposition) {
							if (err) {
								callback(err);
							} else {
								count--;
								dataArray[cbposition] = cbdata;
								if (count === 0) {
									callback(err, dataArray, position);
								}
							}
						}, tag);
				}
				dataArray.push(['<\/', tag, '>\n']);
			}
		}
	} catch (e) {
		callback(e);
	}
}

function bodyFunction(body, session, position, callback, parentTag) {
	body(function (err, data) {
		if (err) {
			callback(err);
		} else {
			generateBody(data, session, position, callback, parentTag);
		}
	});
}

function argumentError(body, session, position, callback, parentTag) {
	try {
		throw 'XML Error';
	} catch (e) {
		callback(e);
	}
}

var bodyMap = {
	'object': bodyObject,
	'function': bodyFunction,
	'undefined': argumentError,
	'number': bodyData,
	'string': bodyData
};

function generateBody(body, session, position, callback, parentTag) {
	process.nextTick(function () {
		bodyMap[typeof body](body, session, position, callback, parentTag);
	});
}

function generateXML(jsml, callback, session) {
	process.nextTick(function () {
		try {
			if (typeof session !== 'undefined') {
				if (typeof session.attributeGenerators !== 'undefined') {
					if (typeof session.attributeGenerators.body
						!== 'undefined') {
						throw 'Body attribute cannot be parsed';
					}

					if (typeof session.attributeGenerators.tag 
						!== 'undefined') {
						throw 'Tag attribute cannot be parsed';
					}
				}
			}
			generateBody(jsml, session, 0, function (err, data, position) {
				if (err) {
					callback(err);
				} else {
					try {
						callback(err, generateString(data));
					} catch (e) {
						callback(e);
					}
				}
			});
		} catch (e) {
			callback(e);
		}
	});
}

var exports;

exports.generateXML = generateXML;
