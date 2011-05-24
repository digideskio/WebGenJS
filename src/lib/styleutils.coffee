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

exports.rotate = (degrees) ->
	rotation = "rotate(#{degrees}deg)"
	{'-moz-transform': rotation
	'-webkit-transform': rotation
	'-o-transform': rotation
	'-ms-transform': rotation}

exports.borderRadius = (width) ->
	{'-webkit-border-radius': width
	'-moz-border-radius': width
	'border-radius': width}

exports.boxShadow = (shadow) ->
	{'-webkit-box-shadow': shadow
	'-moz-box-shadow': shadow
	'box-shadow': shadow
	filter: 'progid:DXImageTransform.Microsoft.Shadow(Color=#000000,' +
		' Direction=190)'}

exports.linearGradientTop = (from, to) ->
	{background: ["-webkit-gradient(linear, left top, left bottom, " +
		"from(#{from}), to(#{to}))",
		"-moz-linear-gradient(top, #{from}, #{to})",
		"linear-gradient(top, #{from}, #{to})"],
		filter: "progid:DXImageTransform.Microsoft.Gradient(gradientType=0," +
		"startColorStr=#{from},endColorStr=#{to})",
		'-ms-filter': "\'progid:DXImageTransform.Microsoft.Gradient" +
			"(gradientType=0,startColorStr=#{from},endColorStr=#{to}\'"}