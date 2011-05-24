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

cssgen = require './cssgen'

exports.horizontalGridLayout = (itemArray, height) ->
	gridArray = []
	retVal = {tag: 'table', body: gridArray}

	unless typeof height is 'number' then throw new Error 'Not a number'
	unless itemArray instanceof Array then throw new Error 'Not an array'

	rowLength = Math.floor itemArray.length / height +
		((itemArray.length % height > 0) ? 1 : 0)
	i = 0
	while i < itemArray.length
		rowArray = []
		j = 0
		while i < itemArray.length and j < rowLength
			rowArray.push {tag: 'td', body: itemArray[i]}
			i++
			j++
		gridArray.push {tag: 'tr', body: rowArray}
	retVal

exports.horizontalScalingGridLayout = (itemArray, height) ->
	retVal = exports.horizontalGridLayout itemArray, height
	retVal.style = {height: '100%'}
	retVal

exports.horizontalScalingLayout = (itemArray) ->
	exports.horizontalScalingGridLayout itemArray, 1

exports.horizontalLayout = (itemArray) ->
	exports.horizontalGridLayout itemArray, 1

exports.gridLayout = (itemArray, width) ->
	gridArray = []
	retVal = {tag: 'table', body: gridArray}

	unless typeof width is 'number' then throw new Error 'Not a number'
	unless itemArray instanceof Array then throw new Error 'Not an array'
	i = 0
	while i < itemArray.length
		rowArray = []
		j = 0
		while i < itemArray.length and j < width
			rowArray.push {tag: 'td', body: itemArray[i]}
			i++
			j++
		gridArray.push {tag: 'tr', body: rowArray}
	retVal

exports.scalingGridLayout = (itemArray, width) ->
	retVal = exports.gridLayout itemArray, width
	retVal.style = {width: '100%'}
	retVal

exports.verticalScalingLayout = (itemArray) ->
	exports.scalingGridLayout itemArray, 1

exports.verticalLayout = (itemArray) ->
	exports.gridLayout itemArray, 1

mapListItem = (text) ->
	{tag: 'li', body: text}

exports.bulletedList = (textArray) ->
	throw new Error 'Not an array' unless textArray instanceof Array

	{tag: 'ul', body: textArray.map mapListItem}

exports.numberedList = (textArray, start) ->
	start ?= 1

	throw new Error 'Not an array' unless textArray instanceof Array

	{tag: 'ol', 'start': start, body: textArray.map mapListItem}

exports.definitionList = (definitions) ->
	retArray = []
	
	throw new Error 'Not an array' unless definitions instanceof Array

	for definition in definitions
		retArray.push {tag: 'dt', body: definition.item}
		retArray.push {tag: 'dd', body: definition.desc}
	{tag: 'dl', body: retArray}

exports.css = (styleParam) ->
	(callback) ->
		cssgen.generateCSS styleParam, (err, result) ->
			if err then callback err
			else callback err, {tag: 'style', type: 'text/css', body: result}


exports.cssSelector = (sel, style) ->
	exports.css {sel: sel, style: style}

exports.cssId = (id, style) ->
	exports.css {id: id, style: style}

exports.cssClass = (cl, style) ->
	exports.css {cl: cl, style: style}

exports.cssSelectorAndClass = (sel, cl, style) ->
	exports.css {sel: sel, cl: cl, style: style}

exports.script = (scriptData, name) ->
	if typeof scriptData isnt 'function'
		throw new Error 'Not a function object'

	throw new Error 'Name missing' unless name?

	{tag: 'script',
	type: 'text/javascript',
	body: "var #{name} = #{scriptData.toString()}"}

exports.loadScript = (scriptData, name) ->
	retVal = exports.script scriptData, name
	retVal.body = retVal.body + '.call();'
	retVal

exports.image = (src, width, height) ->
	retVal = {tag: 'img', 'src': src}

	if typeof width is 'number' then retVal.width = width
	if typeof height is 'number' then retVal.height = height
	retVal

exports.scalingImage = (src, width, height) ->
	retVal = exports.image src, width, height
	retVal.style = {width: '100%', height: '100%'}
	retVal

exports.br = (callback) -> callback null, {tag: 'br'}

exports.hr = (callback) -> callback null, {tag: 'hr'}

exports.link = (href, body) -> {tag: 'a', 'href': href, 'body': body}
