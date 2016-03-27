/* global describe */
/* global it */
'use strict';
const should = require('should');
const request = require('supertest');
const hbs = require('express-handlebars');
const app = require('../app.js')
const User = require('../models').User;
const config = require('../config');
const handlebars = hbs.create();

describe('Users', () => {
  const url = 'http://localhost:3000';

  it('should render all users correctly', (done) => {
    User.findAll()
      .then((users) => {
        request(url).get('/users').send().end(function(err, res) {
          if (err) done(err);
          handlebars.renderView('../challenges/views/users.handlebars', {users: users}, (arg1, arg2, arg3) => {
            //DON'T CHANGE arguments[1].res.text => I have no idea why renderView works that way
            res.text.should.equal(arguments[1].res.text);
            done(err);
          });
        });
      })
      .catch((e) => {
        done(e);
      });
  });
});
