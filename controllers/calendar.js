'use strict';

const axios = require('axios');
const config = require('../config').config();

module.exports = {
  getEvent: (req, res) => {
    axios.get(`${config.backendUrl}/event/${req.params.eventId}`, { headers: {
      Authorization: `JWT ${req.cookies.auth}` } })
    .then((result) => {
      res.render('event', { user: req.user, eventData: result.data.event, formattedData: result.data.prettyData });
    })
    .catch((err) => {
      res.render('errors/500', { err });
    });
  },
  getCalendar: (req, res) => {
    const days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ];
    const calendarData = [];

    if (req.user && req.user.type === 'school') {
      res.render('school-calendar', { user: req.user, calendarData, days });
    } else {
      // fetch teacher calendar
      axios.get(`${config.backendUrl}/calendar/teacher/`, { headers: {
        Authorization: `JWT ${req.cookies.auth}` } })
      .then((result) => {
        res.render('user-calendar', { user: req.user, calendarData: result.data, days });
      })
      .catch((err) => {
        console.log(err);
      });
    }
  },
  editCalendar: (req, res) => {
    const days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ];

    axios.get(`${config.backendUrl}/calendar/teacher/`, { headers: {
      Authorization: `JWT ${req.cookies.auth}` } })
    .then((result) => {
      res.render('user-edit-calendar', { user: req.user, calendarData: result.data, days });
    })
    .catch((err) => {
      console.log(err);
    });
  },
  updateCalendar: (req, res) => {
    // work out which number = available/ not available and update teacher in db
    axios.post(`${config.backendUrl}/calendar/teacher/`, { calendarData: req.body }, { headers: {
      Authorization: `JWT ${req.cookies.auth}` } })
    .then(() => {
      res.status(200).json({ msg: 'Calendar updated' });
    })
    .catch((err) => {
      console.log(err);
    });
  },
  createEventGet: (req, res) => {
    // validate event details

    res.render('create-event', { user: req.user });
  },
  createEventPost: (req, res) => {
    const eventData = req.body;

    axios.post(`${config.backendUrl}/event/create/`, { eventData }, { headers: {
      Authorization: `JWT ${req.cookies.auth}` } })
    .then((event) => {
      axios.get(`${config.backendUrl}/event/matches/${event.data.eventId}`, { headers: {
        Authorization: `JWT ${req.cookies.auth}` } })
      .then((results) => {
        res.render('reliever-results', { results: results.data.matches });
      })
      .catch((err) => {
        console.log('err', err);
        res.redirect(500, '/profile');
      });
    })
    .catch((err) => {
      console.log(err);
      res.render('create-event', err);
    });
  },
  eventMatches: (req, res) => {
    const eventId = req.params.eventId;

    axios.get(`${config.backendUrl}/event/matches/${eventId}`, { headers: {
      Authorization: `JWT ${req.cookies.auth}` } })
    .then((results) => {
      res.render('reliever-results', { results: results.data.matches, user: req.user });
    })
    .catch((err) => {
      console.log('err', err);
      res.redirect(500, '/profile');
    });
  }
};
