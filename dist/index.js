'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _routesauth = require('./modules/professional/auth/routesauth.js');

var _routesauth2 = _interopRequireDefault(_routesauth);

var _routesapt = require('./modules/professional/main/routesapt.js');

var _routesapt2 = _interopRequireDefault(_routesapt);

var _routesslot = require('./modules/professional/main/routesslot.js');

var _routesslot2 = _interopRequireDefault(_routesslot);

var _routesclient = require('./modules/client/routesclient.js');

var _routesclient2 = _interopRequireDefault(_routesclient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//here we will import our modules for routes

let app = (0, _express2.default)();
let port = '2707';

app.use(_bodyParser2.default.json()); // for parsing application/json
app.use(_bodyParser2.default.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use((0, _morgan2.default)('dev'));

// CORS cross-origin
app.use(function (req, res, next) {
	res.header(`Access-Control-Allow-Origin`, `*`);
	res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
	res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept, token`);
	// res.header(`Access-Control-Expose-Headers`,  `token`);
	next();
});

// app.use((error, req, res, next) => {
// 	res.status(error.status || 500);
// 	res.json({
// 		error:{
// 			message: error.message
// 		}
// 	})
// })

// here we will tell the app to refer to our routes
app.use('/auth', _routesauth2.default);
app.use('/apt', _routesapt2.default);
app.use('/slot', _routesslot2.default);
app.use('/client', _routesclient2.default);

_mongoose2.default.connect('mongodb://localhost:27017/bookingappDB', err => {
	if (err) {
		throw err;
	} else {
		console.log('the data base is connected');
		app.listen(port, () => {
			console.log('app running and listening to port' + port);
		});
	}
});