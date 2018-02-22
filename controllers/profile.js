'use strict';

const axios = require('axios');
const config = require('../config').config();

module.exports = {
  getProfile: (req, res) => {
    if (req.user && req.user.type === 'school') {
      res.render('school-profile', { user: req.user });
    } else {
      res.render('user-profile', { user: req.user });
    }
  },
  editProfile: (req, res) => {
    if (req.user && req.user.type === 'school') {
      res.render('edit-school', { user: req.user });
    } else {
      res.render('edit-profile', { user: req.user });
    }
  },
  updateProfile: (req, res) => {
    const data = req.body;

    const updatedData = {
      jobTitle: data.jobTitle,
      qualification: data.qualification,
      dateQualified: data.dateQualified,
      ageRange: data.ageRange || [],
      specialistSubjects: data.specialistSubjects || [],
      additionalSkills: data.additionalSkills || [],
      areasCovered: data.areasCovered || [],
      phoneNumber: data.phoneNumber,
      email: data.email,
      address: {
        line1: data.line1,
        line2: data.line2,
        line3: data.line3,
        postcode: data.postcode
      },
      about: data.about,
      experience: [
        {
          school: data['exp-school-1'],
          role: data['exp-role-1'],
          address: {
            line1: data['exp-line1-1'],
            line2: data['exp-line2-1'],
            line3: data['exp-line3-1'],
            postcode: data['exp-postcode-1'],
          },
          startDate: data['exp-startDate-1'],
          endDate: data['exp-endDate-1'],
        }
      ]
    };

    axios.post(`${config.backendUrl}/update-teacher`, { updatedData }, { headers: {
      Authorization: `JWT ${req.cookies.auth}` } })
      .then(() => {
        res.redirect('/profile');
      })
      .catch((err) => {
        res.render('edit-profile', { user: req.user, data: req.body });
      });
  },
  updateSchool: (req, res) => {
    const data = req.body;

    const updatedData = {
      phoneNumber: data.phoneNumber,
      email: data.email,
      address: {
        line1: data.addressLine1,
        line2: data.addressLine2,
        line3: data.addressLine3,
        postcode: data.postcode
      },
      about: data.about,
      contact: {
        name: data.contactName,
        email: data.contactEmail,
        phoneNumber: data.contactPhoneNumber
      }
    };

    axios.post(`${config.backendUrl}/update-school`, { updatedData }, { headers: {
      Authorization: `JWT ${req.cookies.auth}` } })
      .then(() => {
        res.redirect('/profile');
      })
      .catch((err) => {
        res.render('edit-school', { user: req.user, data: req.body });
      });
  }
};
