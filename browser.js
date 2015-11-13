'use strict';

const notification = require('./lib/notification');

window.onload = function() {
  window.$ = window.jQuery = require('./jquery.js');
  notification.init();
  notification.notify();
  setInterval(notification.query, 500);
}
