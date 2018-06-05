'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _modelapt = require('./modelapt.js');

var _modelapt2 = _interopRequireDefault(_modelapt);

var _helpers = require('./../../../helpers.js');

var helpers = _interopRequireWildcard(_helpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let router = _express2.default.Router();

router.get('/clients', helpers.checkToken, (req, res) => {
	console.log('get route clients called');
	_modelapt2.default.find({}, (err, result) => {
		if (err) {
			console.log('error in Appointment.find');
		}
		if (!result) {
			res.status(404).send({ success: false, message: 'No Appointment found' });
		} else {
			res.status(200).send({ success: true, message: 'Here is the client list', content: result });
		}
	});
});

exports.default = router;