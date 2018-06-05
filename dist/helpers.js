'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendReply = exports.updateSlot = exports.confirmApt = exports.createNewApt = exports.checkToken = exports.response = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _modelapt = require('./modules/professional/main/modelapt.js');

var _modelapt2 = _interopRequireDefault(_modelapt);

var _modelslot = require('./modules/professional/main/modelslot.js');

var _modelslot2 = _interopRequireDefault(_modelslot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Variable for responses
let response = {
  ok: {
    status: 'success',
    tokenaccess: '',
    message: '',
    content: ''
  },
  error: {
    status: 'error',
    tokenaccess: '',
    message: ''
  }
};

function sendReply(a, b, res) {
  res.status(200).send({ success: true, message: 'Votre RDV a bien été confirmé' });
}

// Here middleware function to secure all below routes
function checkToken(req, res, next) {

  let token = req.headers['token'];
  let headers = req.headers;
  console.log('header: ', headers);

  if (token) {
    console.log('token: ', token);
    //THIS is for information: only decode the token and see header token detail and payload
    let decodedtoken = _jsonwebtoken2.default.decode(token, { complete: true });
    console.log('decodedheader', decodedtoken.header);
    console.log('decodedpayload', decodedtoken.payload);
    //Decode the token and check if valid
    _jsonwebtoken2.default.verify(token, 'mysecret', (err, decod) => {
      if (err) return err;
      if (!decod) {
        response.error.tokenaccess = 'Token required';
        response.error.message = 'Wrong Token, access denied';
        res.status(403).send(response.error);
      } else {
        req.decoded = decod;
        //here we put decoded token in req so that we can get it in the next route
        next();
        //If decoded then call next() so that respective route is called.  
      }
    });
  } else {
    response.error.tokenaccess = 'Token required';
    response.error.message = 'No Token, access denied';
    res.status(403).send(response.error);
  }
};

async function createNewApt(apt) {
  console.log('createNewApt called');
  let newApt = new _modelapt2.default();
  newApt.lastname = apt.aptName;
  newApt.email = apt.aptEmail;
  newApt.time = apt.aptTime;
  newApt.duration = apt.aptDuration;
  newApt.save(function (err, created) {
    if (err) {
      return err;
    } else {
      console.log('from createNewApt : newApt well saved,', created);
    }
  });
}

async function updateSlot(apt, newStatus) {
  console.log('updateSlot called');
  _modelslot2.default.findOne({ '_id': apt.aptSlot._id }, (err, updated) => {
    if (err) {
      return err;
    } else {
      updated.status = newStatus;
      updated.save(function (err) {
        if (err) {
          return err;
        } else {
          console.log('from updateSlot: here is the slot to updated:', updated);
        }
      });
    }
  });
}

async function confirmApt(apt, booked, res) {
  let newAptcreated = await createNewApt(apt);
  let slotUpdated = await updateSlot(apt, booked);
  sendReply(newAptcreated, slotUpdated, res);
  console.log('async works');
}

exports.response = response;
exports.checkToken = checkToken;
exports.createNewApt = createNewApt;
exports.confirmApt = confirmApt;
exports.updateSlot = updateSlot;
exports.sendReply = sendReply;