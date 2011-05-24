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

handleStringErrorFunction = (func) ->
	throw new Error "String Generator Error: Function: #{func}"

handleStringErrorUndefined = () ->
	throw new Error 'String Generator Error: Undefined'

handleStringString = (string) -> string

handleStringNumber = (number) -> number.toString()

handleStringObject = (object) ->
	if object instanceof Array
		retVal = object.map generateStringSync
		retVal.join ''
	else throw new Error "String Generator Error: Non-Array Object: #{object}"

routeString = 
	'object': handleStringObject
	'string': handleStringString
	'function': handleStringErrorFunction
	'undefined': handleStringErrorUndefined
	'number': handleStringNumber

generateStringSync = (strings) -> routeString[typeof strings] strings

exports.generateString = (strings, callback) ->
	process.nextTick () -> 
		try callback null, generateStringSync strings
		catch error then callback error