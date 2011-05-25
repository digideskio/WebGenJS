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

handleClassUndefined = (classes, callback) ->
	callback new Error 'Class Generator Error: Undefined'

handleClassNumber = (classes, callback) ->
	callback new Error 'Class Generator Error: Number'

handleClassData = (classes, callback) ->
	callback null, classes

handleClassFunction = (classes, callback) ->
	classes (err, data) ->
		process.nextTick ->
			if err then callback err
			else exports.generateClass data, callback

handleClassObject = (classes, callback) ->
	if classes instanceof Array
		count = classes.length
		classArray = classes.map (item, index, array) ->
			exports.generateClass item, (err, result) ->
				if err then callback err
				else
					count--
					if index is array.length - 1
						classArray[index] = result
					else classArray[index] = [result, ' ']
					callback err, classArray if count is 0
	else callback new Error 'Class Generator: Not An Array'

routeClass =
	'object': handleClassObject
	'function': handleClassFunction
	'string': handleClassData,
	'undefined': handleClassUndefined
	'number': handleClassNumber

exports.generateClass = (classes, callback) ->
	process.nextTick ->
		routeClass[typeof classes] classes, (err, data) ->
			process.nextTick ->
				if err then callback err
				else stringgen.generateString data, callback