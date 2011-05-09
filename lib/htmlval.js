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

var validTags = {
	'a': true,
	'abbr': true,
	'address': true,
	'area': true,
	'article': true,
	'aside': true,
	'audio': true,
	'b': true,
	'base': true,
	'bdo': true,
	'blockquote': true,
	'body': true,
	'br': true,
	'button': true,
	'canvas': true,
	'caption': true,
	'cite': true,
	'code': true,
	'col': true,
	'colgroup': true,
	'command': true,
	'datalist': true,
	'dd': true,
	'del': true,
	'details': true,
	'dfn': true,
	'div': true,
	'dl': true,
	'dt': true,
	'em': true,
	'embed': true,
	'fieldset': true,
	'figcaption': true,
	'figure': true,
	'footer': true,
	'form': true,
	'h1': true,
	'h2': true,
	'h3': true,
	'h4': true,
	'h5': true,
	'h6': true,
	'head': true,
	'header': true,
	'hgroup': true,
	'hr': true,
	'html': true,
	'i': true,
	'iframe': true,
	'img': true,
	'input': true,
	'ins': true,
	'keygen': true,
	'kbd': true,
	'label': true,
	'legend': true,
	'li': true,
	'link': true,
	'map': true,
	'mark': true,
	'menu': true,
	'meta': true,
	'meter': true,
	'nav': true,
	'noscript': true,
	'object': true,
	'ol': true,
	'optgroup': true,
	'option': true,
	'output': true,
	'p': true,
	'param': true,
	'pre': true,
	'progress': true,
	'q': true,
	'rp': true,
	'rt': true,
	'ruby': true,
	's': true,
	'samp': true,
	'script': true,
	'section': true,
	'select': true,
	'small': true,
	'source': true,
	'span': true,
	'strong': true,
	'style': true,
	'sub': true,
	'summary': true,
	'sup': true,
	'table': true,
	'tbody': true,
	'td': true,
	'textarea': true,
	'tfoot': true,
	'th': true,
	'thead': true,
	'time': true,
	'title': true,
	'tr': true,
	'ul': true,
	'var': true,
	'video': true,
	'wbr': true
};

function validateTag(tag) {
	var retVal = false;

	if (validTags[tag]) {
		retVal = true;
	}
	return retVal;
}

var exports;

exports.validateTag = validateTag;