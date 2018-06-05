'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseTypeEmail = require('mongoose-type-email');

var _mongooseTypeEmail2 = _interopRequireDefault(_mongooseTypeEmail);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _modelauth = require('./modelauth.js');

var _modelauth2 = _interopRequireDefault(_modelauth);

var _helpers = require('./../../../helpers.js');

var helpers = _interopRequireWildcard(_helpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let router = _express2.default.Router();

// Home
router.get('/', (req, res) => {
	console.log('Welcome to our App');
	helpers.response.ok.message = 'Welcome to our App';
	helpers.response.ok.tokenaccess = 'Token not required';
	res.status(200).send(helpers.response.ok);
});

// create a user
router.post('/signup', (req, res) => {
	let body = req.body;

	//validation
	if (body.username && body.password) {

		if (_validator2.default.isEmail(body.username)) {

			_modelauth2.default.findOne({ 'username': body.username }, function (err, result) {

				if (!result) {
					console.log('user not found in database, lets create it');
					var newUser = new _modelauth2.default();

					//retreive the username and password values and assign them to our model
					newUser.username = req.body.username;
					newUser.password = req.body.password;
					newUser.firstname = req.body.firstname;
					newUser.lastname = req.body.lastname;

					//saving newUser to mongoDB
					newUser.save(function (err) {
						if (err) {
							return err;
							console.log('user not saved');
						} else {
							console.log('user saved', newUser);
						}
					});
					//send response
					helpers.response.ok.tokenaccess = 'Token not required';
					helpers.response.ok.message = 'User created';
					helpers.response.ok.content = newUser;
					res.status(200).send(helpers.response.ok);
				} else {
					helpers.response.error.tokenaccess = 'Token not required';
					helpers.response.error.message = 'Username already exist';
					res.status(403).send(helpers.response.error);
				}
			});
		} else {
			helpers.response.error.tokenaccess = 'Token not required';
			helpers.response.error.message = 'Your username should be a valid email';
			res.status(412).send(helpers.response.error);
		}
	} else {
		helpers.response.error.tokenaccess = 'Token not required';
		helpers.response.error.message = 'You should provide all the required fields';
		res.status(412).send(helpers.response.error);
	}
});

// login
router.post('/login', (req, res) => {

	let body = req.body;
	console.log('body:', body);

	if (body.username && body.password) {

		if (_modelauth2.default.findOne({ 'username': body.username }, function (err, result) {

			if (err) {
				return err;
				console.log(err);
			}

			if (!result) {
				helpers.response.error.tokenaccess = 'Token not required';
				helpers.response.error.message = 'You are not registered';
				res.status(401).send(helpers.response.error);
			} else {
				console.log('result found, one username is matching:', result);

				if (body.password == result.password) {

					//generate the token
					let token = _jsonwebtoken2.default.sign({ username: req.body.username }, 'mysecret');
					//     let token = jwt.sign({ username:req.body.username }, 'mysecret', {
					// expiresIn: 300}); // expires in 5 min ( expiresIn is in seconds)

					//save the token in database
					result.token = token;
					result.save();

					//delivrer the token and response
					helpers.response.ok.tokenaccess = 'Token not required';
					helpers.response.ok.message = 'Token delivered';
					helpers.response.ok.content = token;
					res.status(200).send(helpers.response.ok);
				} else {
					helpers.response.error.tokenaccess = 'Token not required';
					helpers.response.error.message = 'Wrong password';
					res.status(401).send(helpers.response.error);
				}
			}
		})) ;
	} else {
		helpers.response.error.tokenaccess = 'Token not required';
		helpers.response.error.message = 'You should fill in username and password to login';
		res.status(401).send(helpers.response.error);
	}
});

exports.default = router;