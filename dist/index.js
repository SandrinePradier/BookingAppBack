'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _modelapt = require('./modelapt.js');

var _modelapt2 = _interopRequireDefault(_modelapt);

var _modelslot = require('./modelslot.js');

var _modelslot2 = _interopRequireDefault(_modelslot);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = '2707';

app.use(_bodyParser2.default.json()); // for parsing application/json
app.use(_bodyParser2.default.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use((0, _morgan2.default)('dev'));

// CORS cross-origin
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

//this route is called from home and will send back the slots.
app.get('/', function (req, res) {
	console.log('get route is OK');
	_modelslot2.default.find({}, function (err, result) {
		if (err) {
			console.log('error in Slot.find');
		}
		if (!result) {
			res.status(200).json({ success: true, message: 'any time available for now' });
		} else {
			res.status(200).json({ success: true, message: 'Here are the slots', content: result });
		}
	});
});

//this route is called from authentication after appointment time is selected,
// it will check if no appointment at this time, then store apt i DB
// record a slot for the time.
// and return confirmation
app.post('/', function (req, res) {
	//check that the body exists
	if (req.body) {
		var apt = req.body;
		console.log('apt : ', apt);
		_validator2.default.isEmail('foo@bar.com');
		//check if all the requested field of the models are received
		if (apt.name && apt.mail && apt.time && apt.duration && _validator2.default.isEmail(apt.mail)) {
			//get back the datas in a variable
			var newApt = new _modelapt2.default();
			newApt.lastname = apt.name;
			newApt.email = apt.mail;
			newApt.time = apt.time;
			newApt.duration = apt.duration;

			var newSlot = new _modelslot2.default();
			newSlot.start = (0, _moment2.default)(apt.time);
			newSlot.duration = apt.duration;
			newSlot.end = (0, _moment2.default)(newSlot.start).add(apt.duration, 'minutes');
			newSlot.status = 'booked';
			console.log('newSlot:', newSlot);

			//check if no appointment already at that time
			_modelapt2.default.findOne({ 'time': apt.time }, function (err, result) {
				if (err) {
					console.log('error in Appointment.findOne');
				}
				if (result) {
					// if matching found, means already an appontment at that time
					//sending back a 403 error ( server has understood the request, but reject the execution)
					res.status(403).json({ success: false, message: 'Le RDV ne peut être confirmé car cet horaire n\'est pas disponible' });
				} else {
					//if no matching, means the apt can be save in DB
					newApt.save(function (err) {
						if (err) {
							res.status(403).json({ success: false, message: 'Votre RDV n\'a pas été pris en compte dans notre agenda. Merci de réessayer' });
						} else {
							newSlot.save(function (err) {
								if (err) {
									res.status(403).json({ success: false, message: 'Votre RDV n\'a pas été pris en compte dans notre agenda. Merci de réessayer' });
								} else {
									res.status(200).json({ success: true, message: 'Votre RDV a bien été confirmé' });
								}
							});
						}
					});
				}
			});
		} else {
			//j'ai bien un body, mais il manque un des champs, renvoie un 403: il manque des infos pour confirmer le RDV
			res.status(403).json({ success: false, message: 'Vous devez renseigner un nom et un email valide' });
		}
	}
	//si je n'ai pas de body
	else {
			res.status(500).json({ success: false, message: 'Merci de vérifier les données personnelles renseignées' });
		}
});

_mongoose2.default.connect('mongodb://localhost:27017/bookingappDB', function (err) {
	if (err) {
		throw err;
	} else {
		console.log('the data base is connected');
		app.listen(port, function () {
			console.log('app running and listening to port' + port);
		});
	}
});