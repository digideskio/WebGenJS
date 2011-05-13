#!/usr/bin/node
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

//=============================================================================
//= Utility functions
//=============================================================================

//=============================================================================
//The utility functions can be accessed like this:
var utils = require('../lib/htmlutils');
var styleutils = require('../lib/styleutils');


var breakThatLine = utils.br;

//=============================================================================
//Layouts can be used like this:
var buddies = [
	'Daniel',
	'Johan',
	'Bjorn',
	'Ulf',
	'Nathalie',
	'Truls',
	'Eva',
	'Karl-Anders'
];

var gridWidth = 2;

var buddyLayout = {body: utils.gridLayout(buddies, gridWidth)};

//=============================================================================
//Any object implementing toJSML can be used in the layouts. This can be
//used to create a domain specific layout syntax:

var buddyStyle = [
	styleutils.borderRadius('8px'),
	styleutils.linearGradientTop('#FFFFFF', '#B0B0B0'),
	{
		border: "2px solid black",
		padding: "10px 10px 10px 10px"
	}
];

function Buddy(name) {
	this.name = name;
	this.toJSML = function (callback) {
		callback(null, {style: buddyStyle, body: this.name});
	};
}

var buddyObjects = [
	new Buddy('Daniel'),
	new Buddy('Johan'),
	new Buddy('Bjorn'),
	new Buddy('Ulf'),
	new Buddy('Nathalie'),
	new Buddy('Truls'),
	new Buddy('Eva'),
	new Buddy('Karl-Anders')
];

var gridWidth = 2;

var buddyObjectLayout = {body: utils.gridLayout(buddyObjects, gridWidth)};

//=============================================================================
//Or alternatively read the data async from the file system
var fs = require('fs');

var buddiesPath = 'buddies.txt';
fs.writeFileSync(buddiesPath, buddies.join('\n'));

function loadBuddies(callback) {
	fs.readFile(buddiesPath, function (err, data) {
		
		var buddies = data.toString().split('\n').map(function (line) {
			return new Buddy(line + " (from file)");
		});
		callback(null, utils.gridLayout(buddies, gridWidth));
		fs.unlink(buddiesPath);
	});
}

var buddyObjectLayoutFromFile = {body: loadBuddies};

//=============================================================================
//Lists, such as numbered lists, can be used like this:
var startNumber = 33;

var numberedList = {body: utils.numberedList(buddies, startNumber)};

//=============================================================================
//Scripts can be deployed in the page like this:
function clientSideFunction() {
	alert('hi');
}

var script = utils.script(clientSideFunction);

//=============================================================================
//If the script should execute at load time do this:
function loadScript() {
	clientSideFunction();
}

var loadScript = utils.loadScript(loadScript);

//Note that scripts has to be named for this to work (that is, not anonymous).

//=============================================================================
//And again, HTML can be generated like this:
var allExamples = {body: [
	breakThatLine,
	buddyLayout,
	buddyObjectLayout,
	buddyObjectLayoutFromFile,
	numberedList,
	script,
	loadScript
]};

var htmlgen = require('../lib/htmlgen');

htmlgen.generateHTML(allExamples, function (err, htmlString) {
	console.log(htmlString);
});
