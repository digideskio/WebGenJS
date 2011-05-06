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

//Common functions

function argumentError(data) {
	throw 'XML Argument Error: ' + data;
}

//String functions

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

function stringData(data) {
	return data;
}

function stringObject(array) {
	var retVal = [];

	if (array instanceof Array) {
		for (var item in array) {
			retVal.push(generateString(array[item]));
		}
	} else {
		throw "Error";
	}
	return retVal.join('');
}

//Body functions

var bodyMap = {
	'object': bodyObject,
	'function': bodyFunction,
	'undefined': argumentError,
	'number': bodyData,
	'string': bodyData
};

function generateBody(body, session, position, callback, parentTag) {
	process.nextTick(function() {
		bodyMap[typeof body](body, session, position, callback, parentTag);
	});
}

function bodyData(data, session, position, callback) {
	callback([data + '\n'], position);
}

function bodyObject(object, session, position, callback, parentTag) {
	var i = 0;
	var dataArray = [];
	var tag = object.tag;
	var attrParser;
	var count = 0;

	if (typeof object.toJSML === 'function') {
		object.toJSML(function(data) {
			generateBody(data, session, position, callback, parentTag);
		});
	} else {
		if (typeof tag === 'undefined') {
			tag = session.defaultTag;
		}

		if (typeof tag !== 'string') {
			throw 'Undeclared tag, and default missing';
		}

		if (!session.validateTag(tag, parentTag)) {
			throw 'Invalid tag';
		}
		dataArray.push('<' + tag);

		for (var attribute in object) {
			attrParser = session.attributeParsers[attribute];

			if (typeof attrParser === 'function') {
				dataArray.push(' ' + attribute + '=\"')
				dataArray.push('');
				count++;
				attrParser(object[attribute], dataArray.length - 1,
					function(cbdata, cbposition) {
					count--;
					dataArray[cbposition] = cbdata;
					if (count == 0) {
						callback(dataArray, position);
					}
				});
				dataArray.push('\"');
			} else if ((attribute !== 'tag')
				&& (attribute !== 'body')) {
				dataArray.push(' ' + attribute + '=\"' +
					object[attribute] + '\"');
			}
		}
		if (typeof object.body === 'undefined') {
			dataArray.push(' />\n');
			if (count == 0) {
				callback(dataArray, position);
			}
		} else {
			dataArray.push('>\n');
			if (object.body instanceof Array) {
				for (var element in object.body) {
					dataArray.push('');
					count++;
					generateBody(object.body[element], session,
						dataArray.length - 1,
						function (cbdata, cbposition) {
							count--;
							dataArray[cbposition] = cbdata;
							if (count == 0) {
								callback(dataArray, position);
							}
						},
						tag);
				}
			} else {
				dataArray.push('');
				count++;
				generateBody(object.body, session,
						dataArray.length - 1,
						function (cbdata, cbposition) {
							count--;
							dataArray[cbposition] = cbdata;
							if (count == 0) {
								callback(dataArray, position);
							}
						},
						tag);
			}
			dataArray.push('<\/' + tag + '>\n');
		}
	}
}

function bodyFunction(body, session, position, callback, parentTag) {
	body(function(data) {
		generateBody(data, session, position, callback, parentTag);
	});
}

var notice = '<!-- Generated from JSML, by WebGenJS -->\n';

function generateXML(jsml, session, callback) {
	process.nextTick(function() {
		if (typeof session.attributeParser !== 'undefined') {
			if (typeof session.attributeParser['body'] !== 'undefined') {
				throw 'Body attribute cannot be parsed';
			}

			if (typeof session.attributeParsers['tag'] !== 'undefined') {
				throw 'Tag attribute cannot be parsed';
			}
		}
		generateBody(jsml, session, 0, function (data, position) {
			callback(notice + generateString(data));
		});
	});
}

exports.generateXML = generateXML;
