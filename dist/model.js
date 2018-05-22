'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Slot = exports.Appointment = undefined;

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

var slotSchema = new Schema({
	start: {
		type: String,
		required: true
	},
	end: {
		type: String,
		required: true
	},
	duration: {
		type: Number,
		required: true
	},
	status: {
		type: String,
		required: true
	}
});

var Slot = _mongoose2.default.model('slot', slotSchema);

exports.Appointment = Appointment;
exports.Slot = Slot;