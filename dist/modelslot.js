'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let Schema = _mongoose2.default.Schema;

let slotSchema = new Schema({
	start: {
		type: Date,
		required: true
	},
	end: {
		type: Date,
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

let Slot = _mongoose2.default.model('slot', slotSchema);

exports.default = Slot;