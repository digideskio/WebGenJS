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
var assert = require('assert');

function runTests(tests, calls, timeout) {
	var testCounter = 0;
	var i;
	var maxLength = 0;
	var tmpLength;

	calls = typeof calls === 'undefined' ? 1000 : calls;
	timeout = typeof timeout === 'undefined' ? 10 : timeout;

	for (i = 0; i < tests.length; i++) {
		tmpLength = tests[i].name.length;
		if (tmpLength > maxLength) {
			maxLength = tmpLength;
		}
	}

	function serializeTest() {
		var i;
		var j;
		var testName;
		var startTime;
		var time;
		var timeText;
		var testTimeout;
		var padLength;
		var logMessage;
		var timeMinLength = 5;
		var callCounter = 0;

		testName = tests[testCounter].name;
		startTime = (new Date()).getTime();
		testTimeout = setTimeout(function () {
			assert.ok(false, testName + ' timed out');
		}, (timeout * calls));

		for (i = 0; i < calls; i++) {
			callCounter++;
			tests[testCounter](function () {
				callCounter--;
				var endTime = (new Date).getTime();
				clearTimeout(testTimeout);
				if (callCounter === 0) {
					time = (endTime - startTime);
					padLength = maxLength - testName.length;
					logMessage = testName + ':';
					for (j = 0; j < padLength; j++) {
						logMessage = logMessage + ' ';
					}
					timeText = time + '';
					while (timeText.length < timeMinLength) {
						timeText = ' ' + timeText;
					}
					console.log(logMessage + ' ' +
						timeText + 'ms  (average ' +
						(time / calls).toFixed(4) + 'ms)');
					testCounter++;
					if (testCounter < tests.length) {
						serializeTest();
					} else {
						console.log('Done');
					}
				}
			});
		}
	}

	console.log('' +
		tests.length + ' test, ' +
		calls + ' times, ' + timeout + "ms timeout");
	serializeTest();
}

var exports;

exports.runTests = runTests;

