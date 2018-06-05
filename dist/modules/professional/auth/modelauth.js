'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseTypeEmail = require('mongoose-type-email');

var _mongooseTypeEmail2 = _interopRequireDefault(_mongooseTypeEmail);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let Schema = _mongoose2.default.Schema;

let userSchema = new Schema({
	username: {
		type: _mongoose2.default.SchemaTypes.Email,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	firstname: {
		type: String
	},
	lastname: {
		type: String
	},
	token: {
		type: String
	},
	creationDate: {
		type: Date
	}
});

// creation of a model based on our Schema
let User = _mongoose2.default.model('user', userSchema);

exports.default = User;