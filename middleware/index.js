'use strict';

const axios = require('axios');
const config = require('../config').config();

module.exports = {
  isAuthenticated: function (req, res, next) {
    axios.post(`${config.backendUrl}/authenticate`, { token: req.cookies.auth }, { headers: {
      Authorization: `JWT ${req.cookies.auth}`
    } })
    .then((res) => {
      req.user = res.data;
      req.user.type = req.user.school ? 'school' : 'teacher';
      req.authorised = true;
      next();
    })
    .catch(() => {
      res.redirect('/login');
    });
  }
};
