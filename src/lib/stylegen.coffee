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

handleStyleUndefined = (style, callback) ->
	callback new Error 'Style Generator Error: Undefined'

handleStyleString = (style, callback) ->
	callback new Error 'Style Generator Error: String'

handleStyleNumber = (style, callback) ->
	callback new Error 'Style Generator Error: Number'

handleStyleFunction = (styles, callback) ->
	styles (err, data) ->
		process.nextTick ->
			if err then callback err
			else exports.generateStyle data, callback

handleStyleData = (styles, callback) ->
	count = 0
	stylesArray = []

	callStyleValueFunction = (styleValues, pos) ->
		process.nextTick ->
			styleValues (err, result) ->
				process.nextTick ->
					count--
					if count is 0
						stylesArray[pos] = result
						callback err, stylesArray

	if styles?
		for own style, styleValues of styles
			if styleValues instanceof Array
				stylesArray.push styleValues.map (item) ->
					stylesArray.push [style, ':']
					if typeof item is 'function'
						stylesArray.push ':'
						count++
						callStyleValueFunction item, stylesArray.length - 1
					else stylesArray.push item
					stylesArray.push ';'
					return ''
			else
				stylesArray.push [style, ':']
				if typeof styleValues is 'function'
					stylesArray.push ''
					count++
					callStyleValueFunction styleValues, stylesArray.length - 1
				else stylesArray.push styleValues
				stylesArray.push ';'
		callback null, stylesArray if count is 0
	else callback new Error 'Not a valid object'

handleStyleArray = (styles, callback) ->
	count = styles.length
	stylesArray = styles.map (item, index) ->
		exports.generateStyle item, (err, result) ->
			if err then callback err
			else
				count--
				stylesArray[index] = result
				callback err, stylesArray if count is 0

handleStyleObject = (styles, callback) ->
	if styles instanceof Array then handleStyleArray styles, callback
	else handleStyleData styles, callback

routeStyle =
	'object': handleStyleObject
	'function': handleStyleFunction
	'undefined': handleStyleUndefined
	'string': handleStyleString
	'number': handleStyleNumber

exports.generateStyle = (styles, callback) ->
	process.nextTick ->
		routeStyle[typeof styles] styles, (err, result) ->
			process.nextTick ->
				if err then callback err
				else stringgen.generateString result, callback