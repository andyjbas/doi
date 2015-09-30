'use strict';

console.log("guest page alive");

// var ipc = require('ipc'),
//     _ = require('lodash'),
//     lastNotified = new Date();

// function setLastNotified(dateString) {
//   var date = new Date(dateString);

//   if (date > lastNotified) {
//     lastNotified = date;
//   }
// }

// function fetchChanges() {
//   console.log("FETCHING CHANGES");
//   _.throttle(function() {
//     $.get('https://mail.google.com/mail/feed/atom')
//       .done(function(xml) {
//         console.log("DONE");
//         var toNotify = $(xml).find('entry').slice(0, 5).filter(function(index) {
//           return new Date($(this).find('issued').text()) > lastNotified;
//         });

//         toNotify.toArray().reverse().forEach(function(value) {
//           value = $(value);
//           setLastNotified(value.find('issued').text());
//           new Notification(value.find('title').text(), {body: value.find('summary').text()});
//         });

//         var count = $(xml).find('fullcount').text();

//         if (count === '0') {
//           count = null;
//         }

//         updateBadge(count);
//       });
//   }, 1500, {trailing: true})();
// }

// function isEmptyInbox() {
//   return !!document.getElementsByClassName('dw').length;
// }

// function updateBadge(newBadge) {
//   newBadge = newBadge ? newBadge : '.';
//   if (isEmptyInbox()) { newBadge = ''; }
//   ipc.send('setBadge', newBadge);
// }

// var mailCounts = {
//   sunshine: 0,
//   unread: 0
// }

// Object.observe(mailCounts, fetchChanges);

// function queryUpdates() {
//   var unread = document.getElementsByClassName('ss').length;
//   var sunshine = document.getElementsByClassName('dw').length;

//   mailCounts.unread = unread;
//   mailCounts.sunshine = sunshine;
// }

// window.onload = function() {
//   window.$ = window.jQuery = require('jquery');
//   fetchChanges();
//   window.setInterval(queryUpdates, 500);
// }
