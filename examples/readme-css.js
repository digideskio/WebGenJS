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
//= The style sheet syntax
//=============================================================================

//=============================================================================
//The style sheet model is just any JavaScript object, using a few special
//properties. Here is an example of a simple style:
var tagSelector = {sel:'h1', style:{color:'red'}};

var idSelector = {id:'body', style:{color:'blue'}};

var classSelector = {cl:'body', style:{color:'green'}};

var classAndTagSelector = {sel:'h1', cl:'stuff', style:{color:'white'}};

var allExamples = [
	tagSelector,
	idSelector,
	classSelector,
	classAndTagSelector
];

//=============================================================================
//= Generating CSS
//=============================================================================

//=============================================================================
//CSS can be generated by using the CSS generator:
var cssgen = require('../lib/cssgen');

cssgen.generateCSS(allExamples, function (cssString) {
	console.log(cssString);
});

