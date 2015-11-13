'use strict';

let chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    _ = require('lodash'),
    xmlBuilder = require('xmlbuilder'),
    remote = require('remote'),
    remoteIpc = remote.require('ipc'),
    subject = require('../lib/notification');

chai.use(require('sinon-chai'));

describe('Notifications', () => {
  let testDivs = [];

  function insertDiv(klass, count) {
    _.times(count, () => {
      let div = document.createElement('div');
      div.setAttribute('class', klass);
      testDivs.push(div);
      document.body.appendChild(div);
    });
  }

  function removeDivs() {
    testDivs.forEach((div) => {
      document.body.removeChild(div);
    });

    testDivs = [];
  }

  afterEach(() => {
    removeDivs();
  });

  describe('query()', () => {
    let notifySpy;

    beforeEach(() => {
      notifySpy = sinon.stub(subject, 'notify');
      subject.init();
    });

    afterEach(() => {
      subject.notify.restore();
    });

    function assert(desc, opts) {
      it('triggers "notify()" on '+desc, (done) => {
        insertDiv(opts.elClass, 1);
        subject.query();
        removeDivs();
        setTimeout(subject.query);

        setTimeout(() => {
          expect(notifySpy).to.have.callCount(2);
          done();
        });
      });
    }

    assert('new and read mail', {elClass: 'ss'});
    assert('cleared and uncleared inbox', {elClass: 'dw'});
  });

  describe('notify()', () => {
    let server;
    let notification;

    function fakeEntry() {
      return {
        title: 'foobar',
        issued: new Date().toISOString(),
        summary: 'foobar'
      }
    }

    function generateXML(entries) {
      let xml = xmlBuilder.create('feed');

      xml.e('fullcount', {}, entries.length);

      entries.forEach((entry) => {
        let xmlEntry = xml.e('entry');
        for (var key in entry) {
          xmlEntry.e(key, entry[key]);
        }
      });

      return xml.end();
    }

    function stubGmailFeed(entries) {
      server.respondWith(
        'https://mail.google.com/mail/feed/atom',
        generateXML(entries));
    }

    beforeEach(() => {
      notification = sinon.stub(window, 'Notification');
      server = sinon.fakeServer.create();
    });

    afterEach(() => {
      server.restore();
      notification.restore();
    });

    it('creates a notification for new messages', () => {
      stubGmailFeed([fakeEntry()]);

      subject.notify();
      server.respond();

      expect(notification).to.have.been.calledWith(fakeEntry().title, {
        body: fakeEntry().summary
      });
    });

    it('does not repeat notifications', () => {
      stubGmailFeed([fakeEntry()]);

      subject.notify();
      server.respond();

      subject.notify();
      server.respond();

      expect(notification).to.have.been.calledOnce;
    });

    it('only sends notifications for last 5 new messages', () => {
      stubGmailFeed([
        fakeEntry(),
        fakeEntry(),
        fakeEntry(),
        fakeEntry(),
        fakeEntry(),
        fakeEntry()
      ]);

      subject.notify();
      server.respond();

      expect(notification).to.have.callCount(5);
    });

    it('updates badge with unread count', (done) => {
      stubGmailFeed([fakeEntry(), fakeEntry()]);

      remoteIpc.once('setBadge', (event, data) => {
        expect(data).to.eq('2');
        done();
      });

      subject.notify();
      server.respond();
    });

    it('sets non-numberic badge when all read, non-empty inbox', (done) => {
      stubGmailFeed([]);

      remoteIpc.once('setBadge', (event, data) => {
        expect(data).to.eq('\u2022');
        done();
      });

      subject.notify();
      server.respond();
    });

    it('removes badge when inbox is empty', (done) => {
      insertDiv('dw', 1);
      stubGmailFeed([]);

      remoteIpc.once('setBadge', (event, data) => {
        expect(data).to.eq('');
        done();
      });

      subject.notify();
      server.respond();
    });
  });
});
