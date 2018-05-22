'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var appointmentSchema = new Schema({
	lastname: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	time: {
		type: Date,
		required: true
	},
	duration: {
		type: Number,
		required: true
	}
});

var Appointment = _mongoose2.default.model('appointment', appointmentSchema);

exports.default = Appointment;