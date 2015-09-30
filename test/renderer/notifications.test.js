'use strict';

let expect = require('chai').expect;
let sinon = require('sinon');
let path = require('path');
// let fixtures = path.resolve(__dirname, '../fixtures');
// let fixture = path.join(fixtures, 'notifications.html');


let webview;

beforeEach(() => {
  webview = new WebView;

  webview.addEventListener('console-message', function(e) {
    console.log('WEBVIEW: ', e.message);
  });
});

afterEach(() => {
  if (document.body.contains(webview)) {
    console.log("removing webview");
    document.body.removeChild(webview);
  }
});

describe('on new mail', () => {
  it.only('fetches the mail feed', (done) => {
    webview.addEventListener('dom-ready', () => {
      webview.executeJavaScript('console.log("ejs")');
      console.log('webview ready');
      done();
    });


    let file = path.join(__dirname, '../../browser.js');
    let template = path.join(__dirname, 'dum.html');
    console.log(file);
    console.log(template);
    webview.setAttribute('preload', file);
    webview.src = "file://"+template;
    document.body.appendChild(webview);
  });

  it('sets the dock badge to new mail count', () => {

  });

  it('sends a Notification for the new mail', () => {

  });
});

describe('on mail marked read', () => {
  it('fetches the mail feed', () => {

  });

  it('sets the dock badge to new mail count', () => {

  });
});

describe('on all mail read', () => {
  it('sets the dock badge to non-numeric', () => {

  });
});

describe('on all mail cleared', () => {
  it('removes the dock badge', () => {

  });
});
