'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _modelauth = require('./modules/professional/auth/modelauth.js');

var _modelauth2 = _interopRequireDefault(_modelauth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.connect('mongodb://localhost:27017/bookingappDB', err => {
	if (err) {
		throw err;
	} else {
		console.log('the data base is connected');
	}
});

let user = new _modelauth2.default({
	username: 'pro@gmail.com',
	password: '123'
});

user.save(function (err, result) {
	if (err) {
		console.log('error');
	} else {
		console.log('Seeder user saved');
		_mongoose2.default.disconnect();
	}
});