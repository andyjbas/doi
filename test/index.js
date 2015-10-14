'use strict';

let app = require('app'),
    ipc = require('ipc'),
    dialog = require('dialog'),
    path = require('path'),
    BrowserWindow = require('browser-window');

let window;

app.commandLine.appendSwitch('js-flags', '--expose_gc');
app.commandLine.appendSwitch('ignore-certificate-errors');

ipc.on('message', function(event, arg) {
  event.sender.send('message', arg);
});

ipc.on('console.log', function(event, args) {
  console.error.apply(console, args);
});

ipc.on('console.error', function(event, args) {
  console.error.apply(console, args);
});

ipc.on('process.exit', function(event, code) {
  process.exit(code);
});

ipc.on('eval', function(event, script) {
  event.returnValue = eval(script);
});

ipc.on('echo', function(event, msg) {
  event.returnValue = msg;
});

app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {
  window = new BrowserWindow({
    title: 'Tests',
    show: false,
    width: 800,
    height: 600
  });

  window.loadUrl('file://' + __dirname + '/index.html');

  window.on('unresponsive', function() {
    var chosen = dialog.showMessageBox(window, {
      type: 'warning',
      buttons: ['Close', 'Keep Waiting'],
      message: 'Window is not responsing',
      detail: 'The window is not responding. Would you like to force close it or just keep waiting?'
    });
    if (chosen == 0) window.destroy();
  });
});
