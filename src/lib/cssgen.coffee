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

stylegen = require './stylegen'
stringgen = require './stringgen'

generateCSSArray = (cssArray, callback) ->
	count = cssArray.length
	resultArray = cssArray.map (item, index) ->
		exports.generateCSS item, (err, result) ->
			if err then callback err
			else
				count--
				resultArray[index] = result
				callback err, resultArray if count is 0

generateCSSData = (cssData, callback) ->
	resultArray = []
	if cssData?
		sel = cssData.sel ? ''
		cl = cssData.cl ? ''
		id = cssData.id ? ''
	
		cl = ".#{cl}" unless cl is ''
		id = "##{id}" unless id is ''
	
		if (cssData.sel? or cssData.cl?) and cssData.id?
			callback new Error 'Cannot combine id selector and other selectors'
		else
			resultArray.push [sel, cl, id, ' { ']
			resultArray.push ['']
			stylePos = resultArray.length - 1
			stylegen.generateStyle cssData.style, (err, result) ->
				if err then callback err
				else
					resultArray[stylePos] = result
					callback err, resultArray
			resultArray.push ' }\n'
	else callback new Error 'Data is null'

handleCSSObject = (object, callback) ->
	if object instanceof Array
	    generateCSSArray object, callback
	else generateCSSData object, callback

handleCSSFunction = (css, callback) ->
	css (err, result) ->
		process.nextTick ->
			if err then callback err
			else exports.generateCSS result, callback

handleCSSUndefined = (css, callback) ->
	callback new Error 'CSS Generator Error: Undefined'

handleCSSString = (css, callback) ->
	callback new Error 'CSS Generator Error: String'

handleCSSNumber = (css, callback) ->
	callback new Error 'CSS Generator Error: Number'

routeCSS =
	'object': handleCSSObject
	'function': handleCSSFunction
	'undefined': handleCSSUndefined
	'string': handleCSSString
	'number': handleCSSNumber

exports.generateCSS = (css, callback) ->
	process.nextTick ->
		routeCSS[typeof css] css, (err, result) ->
			process.nextTick ->
				if err then callback err
				else stringgen.generateString result, (err, result) ->
					callback err, result