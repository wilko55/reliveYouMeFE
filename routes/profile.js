'use strict';

const profileController = require('../controllers/profile');
const middleware = require('../middleware');

module.exports = function (app) {
  app.get('/profile', middleware.isAuthenticated, profileController.getProfile);
  app.get('/edit-profile', middleware.isAuthenticated, profileController.editProfile);
  app.post('/edit-profile', middleware.isAuthenticated, profileController.updateProfile);
  app.post('/edit-school', middleware.isAuthenticated, profileController.updateSchool);

  app.get('/logout', (req, res) => {
    res.clearCookie('auth');
    res.redirect('/');
  });
};
