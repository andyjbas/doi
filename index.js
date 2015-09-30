'use strict';

const app = require('app'),
      BrowserWindow = require('browser-window'),
      fs = require('fs'),
      path = require('path'),
      shell = require('shell');

var ipc = require('ipc');
let mainWindow;

ipc.on('setBadge', function(event, arg) {
  app.dock.setBadge(arg);
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    'min-width': 600,
    'min-height': 500,
    show: false,
    'web-preferences': {
      'node-integration': false,
      'preload': path.join(__dirname, 'browser.js'),
      'web-security': false
    }
  });

  let page = mainWindow.webContents;

  page.on('dom-ready', () => {
    page.insertCSS(fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8'));
    mainWindow.show();
  });

  page.on('new-window', (e, url) => {
    e.preventDefault();
    shell.openExternal(url);
  });

  mainWindow.on('closed', function() {
    // TODO
  });

  mainWindow.loadUrl('https://inbox.google.com');
  mainWindow.openDevTools();
});
