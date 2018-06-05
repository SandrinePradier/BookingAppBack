'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let Schema = _mongoose2.default.Schema;

let appointmentSchema = new Schema({
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

let Appointment = _mongoose2.default.model('appointment', appointmentSchema);

exports.default = Appointment;