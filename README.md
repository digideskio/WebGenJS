# WebGenJS - v0.0.1
A library interpreting a JavaScript object structure as XML or HTML/CSS for 
generating a markup document.

## Features
### The JavaScript object hierarchy markup
* Defines a JavaScript object hierarchy DOM representation meta-model
* Supports function objects to be used directly in the hierarchy,
* Supports arbitrary objects directly in the DOM, implementing a toJSML method

### Generators
* Generator for HTML/styles, creating a string based on the JavaScript markup.
* Generator for XML, creating a string based on the JavaScript markup.

### Utility functions
Utility functions are available, creating a simplified way of representing 
data in a DOM, such as

* Layouts (grids, verticals, horizontals...)
* Lists (bullets, numbered...)
* JavaScript (that is, deploying some of your server scripts on the client...)
* Others (images, links...)

## Quick tutorial
### The markup syntax
The markup syntax is just any JavaScript object, using a few special 
properties. Here is an example of a simple tag:
<pre>
var tag = {tag: 'h1', body: 'Awesome heading!'};
</pre>

It is also possible to add styles to the tag:
<pre>
var otherTag = {tag: 'h1', body: 'Awesome red heading!', style: {color: 'red'}};
</pre>
Note that the style itself is a JavaScript object, not a CSS string.

The body can also be an array of more tags, or more texts
<pre>
var moreTags = {tag: 'div', body:
	[
		{tag: 'h1', body: 'Awesome red heading!', style: {color: 'red'}},
		{tag: 'p', body: 'And some paragraph text...'}
	],
	style: {background: 'blue', padding: 10}
};
</pre>

If the tag property is omitted, 'div' is assumed, thus the example above could 
also be written as:
<pre>
var moreTagsImplicitDiv = {body:
	[
		{tag: 'h1', body: 'Awesome red heading!', style: {color: 'red'}},
		{tag: 'p', body: 'And some paragraph text...'}
	],
	style: {background: 'blue', padding: 10}
};
</pre>

Both body and style can be replaced by function objects that generates data:
<pre>
function redHeading(callback) {
	callback(null, {tag: 'h1', body: 'Awesome red heading!',
	style: {color: 'red'}});
}

var fs = require('fs');

function paragraphText(callback) {
	fs.readFile('paragraph.txt', 'ascii',function (err, data) {
		console.log(err);
		console.log(data);
		callback(null, data);
	});
}

function paddedBlueStyle(callback) {
	callback(null, {background: 'blue', padding: 10});
}

var moreTagsWithFunctions = {body:
	[
		redHeading,
		{tag: 'p', body: paragraphText}
	],
	style: paddedBlueStyle
};
</pre>
These functions are called async when the html is generated.

Function calls with parameters can of course also be used:
<pre>
function redHeadingWithName(text) {
	return {tag: 'h1', body: text, style: {color: 'red'}};
}

var moreTagsWithFunctionsAndParameters = {body:
	[
		redHeadingWithName('Awesome red heading!'),
		{tag: 'p', body: paragraphText}
	],
	style: paddedBlueStyle
};
</pre>

By overloading/implementing the method toJSML in an object, the object can be 
used directly:
<pre>
Date.prototype.toJSML = function (callback) {
	callback(null, {tag: 'time', body: this.getFullYear(),
	style: {color: 'green'}});
};

var moreTagsWithFunctionsParametersAndObjects = {body:
	[
		redHeadingWithName('Awesome red heading!'),
		{tag: 'p', body: 'And some paragraph text...'},
		new Date()
	],
	style: paddedBlueStyle
};
</pre>

All together now!
<pre>
var allExamples = {body:
	[
		tag,
		otherTag,
		moreTags,
		moreTagsImplicitDiv,
		moreTagsWithFunctions,
		moreTagsWithFunctionsAndParameters,
		moreTagsWithFunctionsParametersAndObjects
	]
};
</pre>

### Generating HTML
HTML can be generated by using the HTML generator:
<pre>
var htmlgen = require('webgenjs').htmlgen;

htmlgen.generateHTML(allExamples, function (htmlString) {
	console.log(htmlString);
});
</pre>

### Utility functions
The utility are functions creating hierarchies of tag commonly used. 
Currently available functions are:

* Layouts (grids, verticals, horizontals...)
* Lists (bullets, numbered...)
* Others (images, links...)

The functions are really just JavaScript functions, generating jsml objects. 
They are used as any function in the examples above.

The utility functions can be accessed like this:
<pre>
var utils = require('webgenjs').htmlutils;
var styleutils = require('webgenjs').styleutils;

var breakThatLine = utils.br;
</pre>

Layouts can be used like this:
<pre>
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
</pre>


Any object implementing toJSML can be used in the layouts. This can be used to 
create a domain specific layout syntax:
<pre>
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
</pre>

Lists, such as numbered lists, can be used like this:
<pre>
var startNumber = 33;

var numberedList = {body: utils.numberedList(buddies, startNumber)};
</pre>

Scripts can be deployed in the page like this:
<pre>
function clientSideFunction() {
	alert('hi');
}

var script = utils.script(clientSideFunction);
</pre>

If the script should execute at load time do this:
<pre>
function loadScript() {
	clientSideFunction();
}

var loadScript = utils.loadScript(loadScript);
</pre>
Note that scripts has to be named for this to work (that is, not anonymous).

And again, all can be written to the log as this:
<pre>
var allExamples = {body:[
	breakThatLine,
	buddyLayout,
	buddyObjectLayout,
	numberedList,
	script,
	loadScript
]};

var htmlgen = require('../lib/htmlgen');

htmlgen.generateHTML(allExamples, function (htmlString) {
	console.log(htmlString);
});
</pre>

### Writing own utility functions
Own utility functions can easily be written in order to create a more domain 
specific description, much similar to the buddy object example above.

## Contributions
Any suggestions on improvements or added features? Bring it, I'll see what I 
can do. Any code contributions, perhaps sorting out all those horrible tags 
in the utility functions (I am really horrible when it comes to web 
technology), would be welcome!

## License
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
