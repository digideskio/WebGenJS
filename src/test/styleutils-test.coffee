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

styleutils = require '../lib-cov/styleutils'
stylegen = require '../lib-cov/stylegen'

exports.testStyleUtilsRotate = (test, assert) ->
	input = styleutils.rotate 5

	expectedOutput = '-moz-transform:rotate(5deg);' +
		'-webkit-transform:rotate(5deg);' +
		'-o-transform:rotate(5deg);' +
		'-ms-transform:rotate(5deg);';

	stylegen.generateStyle input, (err, result) ->
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testStyleUtilsBorderRadius = (test, assert) ->
	input = styleutils.borderRadius 5

	expectedOutput = '-webkit-border-radius:5;' +
		'-moz-border-radius:5;' +
		'border-radius:5;';
	stylegen.generateStyle input, (err, result) ->
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testStyleUtilsBoxShadow = (test, assert) ->
	input = styleutils.boxShadow 5

	expectedOutput = '-webkit-box-shadow:5;' +
		'-moz-box-shadow:5;' +
		'box-shadow:5;' +
		'filter:progid:DXImageTransform.Microsoft.Shadow(Color=#000000,' +
			' Direction=190);';
	stylegen.generateStyle input, (err, result) ->
		assert.strictEqual result, expectedOutput
		test.finish()

exports.testStyleUtilLinearGradientTop = (test, assert) ->
	input = styleutils.linearGradientTop '#001122', '#112233'

	expectedOutput = 'background:-webkit-gradient(linear, left top, ' +
		'left bottom, from(#001122), to(#112233));' +
		'background:-moz-linear-gradient(top, #001122, #112233);' +
		'background:linear-gradient(top, #001122, #112233);' +
		'filter:progid:DXImageTransform.Microsoft.Gradient(' +
		'gradientType=0,startColorStr=#001122,endColorStr=#112233);' +
		'-ms-filter:\'progid:DXImageTransform.Microsoft.Gradient(' +
		'gradientType=0,startColorStr=#001122,endColorStr=#112233\';';

	stylegen.generateStyle input, (err, result) ->
		assert.strictEqual result, expectedOutput
		test.finish()