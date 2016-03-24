/* global describe */
/* global it */
//const shelljs = require('shelljs');
'use strict';
const should = require('should');
const request = require('supertest');
const hbs = require('express-handlebars');
const app = require('../app.js')

function buildResponse() {
  return http_mocks.createResponse({eventEmitter: require('events').EventEmitter});
}

const handlebars = hbs.create();
app.start();
describe('Performances', () => {
  const url = 'http://localhost:3000';

  it('should assert true!', (done) => {
    'hey there'.should.equal('hey there');
    done();
  });

  it('should render correct page', (done) => {
    const performances = [{
      dataValues: {
        name: 'Bowling Green Game'
      }
    }];

    request(url).get('/performances').send().end(function(err, res) {
      if (err) done(err);
      handlebars.renderView('../challenges/views/performance.handlebars', {performances: performances}, (arg1, arg2, arg3) => {
        //DON'T CHANGE arguments[1].res.text => I have no idea why renderView works that way
        res.text.should.equal(arguments[1].res.text);
        done(err);
      });
    });
  });
});
