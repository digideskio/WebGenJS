#Copyright 2011 Patchwork Solutions AB. All rights reserved.
#
#Redistribution and use in source and binary forms, with or without
#modification, are permitted provided that the following conditions are met:
#
#     1. Redistributions of source code must retain the above copyright notice,
#       this list of conditions and the following disclaimer.
#
#     2. Redistributions in binary form must reproduce the above copyright
#       notice, this list of conditions and the following disclaimer in the
#       documentation and/or other materials provided with the distribution.
#
#THIS SOFTWARE IS PROVIDED BY Patchwork Solutions AB ``AS IS'' AND ANY EXPRESS
#OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
#OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
#EVENT SHALL Patchwork Solutions AB OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
#INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
#BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
#DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
#OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
#NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
#EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
#
#The views and conclusions contained in the software and documentation are
#those of the authors and should not be interpreted as representing official
#policies, either expressed or implied, of Patchwork Solutions AB.

stringgen = require './stringgen'

handleXMLString = (data, session, callback) -> callback null, [data, '\n']

handleXMLNumber = (data, session, callback) -> callback null, [data, '\n']

generateXMLJSMLData = (object, session, callback) ->
	dataArray = []
	tag = object.tag
	count = 0
	
	generateXMLBodyArray = ->
		bodyArray = object.body.map (item, index) ->
			count++
			exports.generateXML item, session, (err, data) ->
				if err then callback err
				else
					count--
					bodyArray[index] = data
					callback err, dataArray if count is 0
		dataArray.push bodyArray
	
	generateXMLBodyData = ->
		dataArray.push ''
		count++
		bodyPos = dataArray.length - 1
		
		exports.generateXML object.body, session, (err, result) ->
			if err then callback err
			else
				count--
				dataArray[bodyPos] = result
				callback err, dataArray if count is 0
	
	callAttributeFuncObject = (data, position) ->
		process.nextTick ->
			count++
			data (err, data) ->
				if err then callback err
				else
					count--
					dataArray[position] = data
					callback err, dataArray if count is 0

	generateXMLAttributes = ->
		callAttributeGenerator = (generator, data, position) ->
			count++
			process.nextTick ->
				generator data, (err, data) ->
					if err then callback err
					else
						count--
						dataArray[position] = data
						callback err, dataArray if count is 0

		for own attribute, generator of object
			if session? and session.attributeGenerators?
				attrGenerator = session.attributeGenerators[attribute]
			if attribute isnt 'tag' and attribute isnt 'body'
				dataArray.push [' ', attribute, '=\"']
				dataArray.push ''
				if typeof attrGenerator is 'function'
					callAttributeGenerator attrGenerator, object[attribute],
						dataArray.length - 1
				else
					if typeof object[attribute] is 'function'
						callAttributeFuncObject object[attribute],
							dataArray.length - 1
					else dataArray.push object[attribute]
				dataArray.push '\"'

	if not tag? and session? then tag = session.defaultTag
	if tag?
		dataArray.push '<'
	
		if typeof tag is 'function'
			dataArray.push ''
			callAttributeFuncObject tag, dataArray.length - 1
		else dataArray.push tag

		generateXMLAttributes()

		if object.body?
			dataArray.push '>\n'
			if object.body instanceof Array then generateXMLBodyArray()
			else generateXMLBodyData()
			dataArray.push ['<\/', tag, '>\n']
		else
			dataArray.push ' />\n'
			callback null, dataArray if count is 0
	else callback new Error 'Undeclared tag, and default missing'

handleXMLObject = (object, session, callback) ->
	if object?
		if typeof object.toJSML is 'function'
			object.toJSML (err, result) ->
				if err then callback err
				else exports.generateXML result, session, callback
		else generateXMLJSMLData object, session, callback
	else callback new Error 'Null'

handleXMLFunction = (xml, session, callback) ->
	xml (err, data) ->
		process.nextTick ->
			if (err) then callback err
			else exports.generateXML data, session, callback

handleXMLUndefined = (xml, session, callback) ->
	callback new Error 'XML Generator Error: Undefined'

routeXML =
	'object': handleXMLObject
	'function': handleXMLFunction
	'undefined': handleXMLUndefined
	'number': handleXMLNumber
	'string': handleXMLString

exports.generateXML = (xml, session, callback) ->
	process.nextTick ->
		routeXML[typeof xml] xml, session, (err, data) ->
			process.nextTick ->
				if err then callback err
				else stringgen.generateString data, callback