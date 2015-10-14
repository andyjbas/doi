'use strict';

module.exports = {
  query: query,
  notify: notify,
  init: init
}

const ipc = require('ipc'),
      _ = require('lodash');

let lastNotified = new Date();
let updates = {
  emptyInbox: 0,
  unread: 0
}

function init() {
  Object.observe(updates, module.exports.notify);
}

function query() {
  let unread = document.getElementsByClassName('ss');
  let emptyInbox = document.getElementsByClassName('dw');
  updates.unread = unread.length;
  updates.emptyInbox = emptyInbox.length;
}

function notify() {
  return _.throttle(() => {
    $.get('https://mail.google.com/mail/feed/atom')
      .done(parseFeedXML);
  },
  2000,
  {trailing: true})();
}

function parseFeedXML(xml) {
  let entries = $(xml).find('entry').toArray();

  _.chain(entries)
    .slice(0, 5)
    .map($)
    .filter(($value) => {
      let issued = $value.find('issued').text();
      return new Date(issued) > lastNotified;
    })
    .reverse()
    .each(($value) => {
      let issued = $value.find('issued').text();
      let title = $value.find('title').text();
      let summary = $value.find('summary').text();

      setLastNotified(issued);
      new Notification(title, {body: summary});
    })
    .value()

  let count = $(xml).find('fullcount').text();
  if (count === '0') {
    count = null;
  }

  updateBadge(count);
}

function setLastNotified(dateString) {
  var date = new Date(dateString);

  if (date > lastNotified) {
    lastNotified = date;
  }
}

function isEmptyInbox() {
  return !!document.getElementsByClassName('dw').length;
}

function updateBadge(newBadge) {
  newBadge = newBadge ? newBadge : '.';
  if (isEmptyInbox()) { newBadge = ''; }
  ipc.send('setBadge', newBadge);
}
