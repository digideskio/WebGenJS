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

var validStyleNames = {
	//Dimension Properties
	'height': true,
	'max-height': true,
	'max-width': true,
	'min-height': true,
	'min-width': true,
	'width': true,

	//Generated Content Properties
	'content': true,
	'counter-increment': true,
	'counter-reset': true,
	'quotes': true,

	//List Properties
	'list-style': true,
	'list-style-image': true,
	'list-style-position': true,
	'list-style-type': true,

	//Margin Properties
	'margin': true,
	'margin-bottom': true,
	'margin-left': true,
	'margin-right': true,
	'margin-top': true,

	//Padding Properties
	'padding': true,
	'padding-bottom': true,
	'padding-left': true,
	'padding-right': true,
	'padding-top': true,

	//Positioning Properties
	'bottom': true,
	'clear': true,
	'clip': true,
	'cursor': true,
	'display': true,
	'float': true,
	'left': true,
	'overflow': true,
	'position': true,
	'right': true,
	'top': true,
	'visibility': true,
	'z-index': true,

	//Print Properties
	'orphans': true,
	'page-break-after': true,
	'page-break-before': true,
	'page-break-inside': true,
	'widows': true,

	//Table Properties
	'border-collapse': true,
	'border-spacing': true,
	'caption-side': true,
	'empty-cells': true,
	'table-layout': true,

	//Background Properties
	'background': true,
	'background-attachment': true,
	'background-color': true,
	'background-image': true,
	'background-position': true,
	'background-repeat': true,
	'background-clip': true,
	'background-origin': true,
	'background-size': true,

	//Border Properties
	'border': true,
	'border-bottom': true,
	'border-bottom-color': true,
	'border-bottom-style': true,
	'border-bottom-width': true,
	'border-color': true,
	'border-left': true,
	'border-left-color': true,
	'border-left-style': true,
	'border-left-width': true,
	'border-right': true,
	'border-right-color': true,
	'border-right-style': true,
	'border-right-width': true,
	'border-style': true,
	'border-top': true,
	'border-top-color': true,
	'border-top-style': true,
	'border-top-width': true,
	'border-width': true,
	'outline': true,
	'outline-color': true,
	'outline-style': true,
	'outline-width': true,
	'border-bottom-left-radius': true,
	'border-bottom-right-radius': true,
	'border-image': true,
	'border-image-outset': true,
	'border-image-repeat': true,
	'border-image-slice': true,
	'border-image-source': true,
	'border-image-width': true,
	'border-radius': true,
	'border-top-left-radius': true,
	'border-top-right-radius': true,
	'box-decoration-break': true,
	'box-shadow': true,

	//Text Properties
	'hanging-punctuation': true,
	'punctuation-trim': true,
	'text-align-last': true,
	'text-emphasis': true,
	'text-justify': true,
	'text-outline': true,
	'text-overflow': true,
	'text-shadow': true,
	'text-wrap': true,
	'word-break': true,
	'word-wrap': true,
	'color': true,
	'direction': true,
	'letter-spacing': true,
	'line-height': true,
	'text-align': true,
	'text-decoration': true,
	'text-indent': true,
	'text-shadow': true,
	'text-transform': true,
	'unicode-bidi': true,
	'vertical-align': true,
	'white-space': true,
	'word-spacing': true,

	//Font Properties
	'@font-face': true,
	'font-size-adjust': true,
	'font-stretch': true,
	'font': true,
	'font-family': true,
	'font-size': true,
	'font-style': true,
	'font-variant': true,
	'font-weight': true,

	//Color Properties
	'color-profile': true,
	'opacity': true,
	'rendering-intent': true,

	//2D/3D Transform Properties
	'transform': true,
	'transform-origin': true,
	'transform-style': true,
	'perspective': true,
	'perspective-origin': true,
	'backface-visibility': true,

	//Transition Properties
	'transition': true,
	'transition-property': true,
	'transition-duration': true,
	'transition-timing-function': true,
	'transition-delay': true,

	//Animation Properties
	'@keyframes': true,
	'animation': true,
	'animation-name': true,
	'animation-duration': true,
	'animation-timing-function': true,
	'animation-delay': true,
	'animation-iteration-count': true,
	'animation-direction': true,
	'animation-play-state': true,

	//Box Properties
	'overflow-x': true,
	'overflow-y': true,
	'overflow-style': true,
	'rotation': true,
	'rotation-point': true,

	//Linebox Properties
	'alignment-adjust': true,
	'alignment-baseline': true,
	'baseline-shift': true,
	'dominant-baseline': true,
	'drop-initial-after-adjust': true,
	'drop-initial-after-align': true,
	'drop-initial-before-adjust': true,
	'drop-initial-before-align': true,
	'drop-initial-size': true,
	'drop-initial-value': true,
	'inline-box-align': true,
	'line-stacking': true,
	'line-stacking-ruby': true,
	'line-stacking-shift': true,
	'line-stacking-strategy': true,
	'text-height': true,

	//Flexible Box Properties
	'box-align': true,
	'box-direction': true,
	'box-flex': true,
	'box-flex-group': true,
	'box-lines': true,
	'box-ordinal-group': true,
	'box-orient': true,
	'box-pack': true,

	//Hyperlink Properties
	'target': true,
	'target-name': true,
	'target-new': true,
	'target-position': true,

	//Grid Properties
	'grid-columns': true,
	'grid-rows': true,

	//Multi-column Properties
	'column-count': true,
	'column-fill': true,
	'column-gap': true,
	'column-rule': true,
	'column-rule-color': true,
	'column-rule-style': true,
	'column-rule-width': true,
	'column-span': true,
	'column-width': true,
	'columns': true,

	//User-interface Properties
	'appearance': true,
	'box-sizing': true,
	'icon': true,
	'nav-down': true,
	'nav-index': true,
	'nav-left': true,
	'nav-right': true,
	'nav-up': true,
	'outline-offset': true,
	'resize': true,

	//Marquee Properties
	'marquee-direction': true,
	'marquee-play-count': true,
	'marquee-speed': true,
	'marquee-style': true,

	//Generated Content Properties
	'crop': true,
	'move-to': true,
	'page-policy': true,

	//Paged Media Properties
	'fit': true,
	'fit-position': true,
	'image-orientation': true,
	'page': true,
	'size': true,

	//Content for Paged Media Properties
	'bookmark-label': true,
	'bookmark-level': true,
	'bookmark-target': true,
	'float-offset': true,
	'hyphenate-after': true,
	'hyphenate-before': true,
	'hyphenate-character': true,
	'hyphenate-lines': true,
	'hyphenate-resource': true,
	'hyphens': true,
	'image-resolution': true,
	'marks': true,
	'string-set': true,

	//Ruby Properties
	'ruby-align': true,
	'ruby-overhang': true,
	'ruby-position': true,
	'ruby-span': true,

	//Speech Properties
	'mark': true,
	'mark-after': true,
	'mark-before': true,
	'phonemes': true,
	'rest': true,
	'rest-after': true,
	'rest-before': true,
	'voice-balance': true,
	'voice-duration': true,
	'voice-pitch': true,
	'voice-pitch-range': true,
	'voice-rate': true,
	'voice-stress': true,
	'voice-volume': true,

	//Webkit
	'-webkit-box-shadow': true,
	'-webkit-border-radius': true,

	//Mozilla
	'-moz-box-shadow': true,
	'-moz-border-radius': true,

	//IE
	'filter': true,
	'-ms-filter': true,
}

function validateStyleName(name) {
	var retVal = false;

	if (validStyleNames[name]) {
		retVal = true;
	}
	return retVal;
}

exports.validateStyleName = validateStyleName;