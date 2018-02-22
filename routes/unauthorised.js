'use strict';

const axios = require('axios');
const _ = require('underscore');
const config = require('../config').config();

module.exports = function (app) {
  const staticRoutes = [
    { template: 'home', url: '/' }
  ];

  _.each(staticRoutes, (page) => {
    app.get(page.url, (req, res) => {
      res.render(page.template);
    });
  });

  app.get('/login', (req, res) => {
    res.clearCookie('auth');
    res.render('login');
  });

  app.post("/login", (req, res) => {
    axios.post(`${config.backendUrl}/login`, { email: req.body.email, password: req.body.password })
    .then((data) => {
      res.cookie('auth', data.data.token);
      res.redirect('/profile');
    })
    .catch((err) => {
      console.log(err)
      res.render('login', { err: 'Error, try again' });
    });
  });

  app.get('/signup-school', (req, res) => {
    res.render('signup-school');
  });

  app.get('/signup-teacher', (req, res) => {
    res.render('signup-teacher');
  });

  app.post('/signup-teacher', (req, res) => {
    // validate req
    const firstNameEncoded = encodeURIComponent(req.body['first-name']);
    const lastNameEncoded = encodeURIComponent(req.body['last-name']);
    const regNumberEncoded = encodeURIComponent(req.body['reg-number']);

    axios.get(`${config.backendUrl}/reg-lookup/${regNumberEncoded}/${firstNameEncoded}/${lastNameEncoded}`)
    .then(() => {
      res.render('signup-teacher-2', { userData: req.body });
    })
    .catch(() => {
      res.render('signup-teacher', { err: true });
    });
  });

  app.post('/signup-teacher-2', (req, res) => {
    axios.post(`${config.backendUrl}/signup/teacher`, {
      name: `${req.body['first-name']} ${req.body['last-name']}`,
      regNumber: req.body['reg-number'],
      email: req.body.email,
      password: req.body.password })
    .then((data) => {
      res.cookie('auth', data.data.token);
      res.redirect('/profile');
    })
    .catch(() => {
      res.render('signup-teacher-2', { err: true });
    });
  });

  app.post('/signup-school', (req, res) => {
    axios.post(`${config.backendUrl}/signup/school`, {
      contactName: req.body.contactName,
      school: req.body.schoolName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password })
    .then((data) => {
      res.cookie('auth', data.data.token);
      res.redirect('/school-profile');
    })
    .catch((err) => {
      console.log(err)
      res.render('signup-school', { err: true });
    });
  });
};
