'use strict';

const calendarController = require('../controllers/calendar');
const middleware = require('../middleware');

module.exports = function (app) {
  app.get('/calendar', middleware.isAuthenticated, calendarController.getCalendar);
  app.get('/edit-calendar', middleware.isAuthenticated, calendarController.editCalendar);
  app.post('/edit-calendar', middleware.isAuthenticated, calendarController.updateCalendar);
  app.get('/event/:eventId', middleware.isAuthenticated, calendarController.getEvent);
  app.get('/create-event', middleware.isAuthenticated, calendarController.createEventGet);
  app.post('/create-event', middleware.isAuthenticated, calendarController.createEventPost);
};
