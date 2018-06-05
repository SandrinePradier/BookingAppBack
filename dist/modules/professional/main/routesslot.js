'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _modelslot = require('./modelslot.js');

var _modelslot2 = _interopRequireDefault(_modelslot);

var _helpers = require('./../../../helpers.js');

var helpers = _interopRequireWildcard(_helpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let router = _express2.default.Router();

router.get('/slots', helpers.checkToken, (req, res) => {
	console.log('get route slots called');
	_modelslot2.default.find({}, (err, result) => {
		if (err) {
			console.log('error in slot.find');
		}
		if (!result) {
			res.status(404).send({ success: false, message: 'No Slot found' });
		} else {
			res.status(200).send({ success: true, message: 'Here is the Slot list', content: result });
		}
	});
});

router.post('/availabilities', helpers.checkToken, (req, res) => {
	console.log('post route availabilities called, req.body:', req.body);
	let slotlist = req.body;
	let slotlistavailable = slotlist;
	_modelslot2.default.find({ 'status': 'booked' }, (err, result) => {
		if (err) {
			console.log('error');
		};
		if (!result) {
			console.log(' CAS !RESULT: je vais enregistrer tous les slots envoyés');
			for (let i = 0; i < slotlist.length; i++) {
				let newSlot = new _modelslot2.default();
				newSlot.start = slotlist[i].start;
				newSlot.duration = slotlist[i].duration;
				newSlot.end = slotlist[i].end;
				newSlot.status = slotlist[i].status;
				console.log('newSlot:', newSlot);
				newSlot.save(function (err) {
					if (err) {
						console.log('cas !result: error when saving');
						return err;
					} else {
						console.log('newSlot saved');
					}
				});
			}
			console.log('headers: ', res.headers);
			console.log('res.headersSent:', res.headersSent);
			res.status(200).send({ success: true, message: "NO CONFLICT as no booked slots in the DB: new slot well saved" });
		}
		if (result) {
			console.log('CAS RESULT : voici les slots booked: ', result);
			console.log('je vais vérifier si certains slots booked sont des duplicates avec la liste du body');
			console.log('slotlistlength: ', slotlist.length);

			for (let j = 0; j < result.length; j++) {
				for (let i = 0; i < slotlist.length; i++) {
					console.log('slotlist[i]: ', slotlist[i]);
					if (slotlist[i].start == result[j].start && slotlist[i].duration == result[j].duration) {
						console.log('matching slots: ', slotlist[i]);
						slotlistavailable.splice(i, 1);
					} else {
						console.log('no matching found');
					}
				}
			}
			console.log('slotlistavailable length', slotlistavailable.length);

			for (let k = 0; k < slotlistavailable.length; k++) {

				// create new slot object
				let newSlot = new _modelslot2.default();
				newSlot.start = slotlistavailable[k].start;
				newSlot.duration = slotlistavailable[k].duration;
				newSlot.end = slotlistavailable[k].end;
				newSlot.status = slotlistavailable[k].status;
				console.log('newSlot:', newSlot);

				// save slot in db
				newSlot.save(function (err) {
					if (err) {
						console.log('error RESULT when saving');
						return err;
					} else {
						console.log('newSlot saved');
					}
				});
			}
			console.log('res.headersSent:', res.headersSent);
			res.status(200).send({ success: true, message: "NO CONFLICT: new slot 'available' well saved" });
		}
	});
});

exports.default = router;