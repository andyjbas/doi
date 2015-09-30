'use strict';

var remote = require('remote');
var windowInstance = remote.getCurrentWindow();
var sinon = require('sinon');

let xhr = sinon.useFakeXMLHttpRequest();
windowInstance.fakeXHR = xhr;
console.log(windowInstance.fakeXHR);
