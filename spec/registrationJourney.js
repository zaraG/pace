/* jshint node: true */
/* jshint esnext: true */
/* global describe, beforeAll, beforeEach, afterEach, afterAll, xit, it, expect */
'use strict';

const helper = require('./journeyHelper');
const config = require('config');
const registration = require('../service/registration');

describe('registration journey', () => {

  let client, originalRegistrationStatus;

  beforeAll((done) => {
    registration.isClosed().then(isClosed => {
      originalRegistrationStatus = isClosed;
      if(isClosed) {
        registration.reopen().then( () => {
          done();
        });
      } else {
        done();
      }
    });
  });

  beforeEach(() => {
    helper.changeOriginalTimeout();
    client = helper.setUpClient();
  });

  afterEach(() => {
    helper.resetToOriginalTimeout();
  });

  afterAll((done) => {
    if (originalRegistrationStatus) {
      registration.close().then( () => {
        done();
      });
    } else {
      done();
    }
  });

  it('allows to start via the registration page', (done) => {
    client.url(helper.paceUrl)
      .click('a#registration')
      .isVisible('form#registrationForm')
      .setValue('input#firstname', 'Max')
      .setValue('input#lastname', 'Mustermann')
      .setValue('input#email', 'max@example.com')
      .selectByValue('select#category', 'f')
      .setValue('input#birthyear', 2000)
      .setValue('input#team', 'Crazy runners')
      .selectByIndex('select#visibility', 1)
      .click('input#shirt')
      .click('button#submit')
      .isVisible('div.thanks')
      .then((isVisible) => {
        expect(isVisible).toBe(true);
      })
      .isVisible('a#editurl')
      .then(function (isVisible) {
        expect(isVisible).toBe(true);
      })
      .getText('span.amount')
      .then((amount) => {
        expect(amount).toMatch(/20.00/);
      })
      .getText('span.startNumber')
      .then((number) => {
        expect(number).toMatch(/d*/);
      })
      .end(done);
  });

  it('shows a message when the registration is closed', (done) => {
    registration.close().then( () => {
      helper.setUpClient().url(helper.paceUrl)
        .click('a#registration')
        .isVisible('form#registrationForm')
        .then( (isVisible) => {
          expect(isVisible).toBe(false);
        })
        .isVisible('p#registration-closed-message')
        .then( function (isVisible) {
          expect(isVisible).toBe(true);
        })
        .end().then( () => {
        registration.reopen().then( () => {
          done();
        });
      });
    });
  });

});
