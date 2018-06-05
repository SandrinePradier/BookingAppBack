'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _modelapt = require('./../professional/main/modelapt.js');

var _modelapt2 = _interopRequireDefault(_modelapt);

var _modelslot = require('./../professional/main/modelslot.js');

var _modelslot2 = _interopRequireDefault(_modelslot);

var _helpers = require('./../../helpers.js');

var helpers = _interopRequireWildcard(_helpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let router = _express2.default.Router();

//this route is called from calendar and will send back the slots.
router.get('/', (req, res) => {
	console.log('get route is OK');
	_modelslot2.default.find({}, (err, result) => {
		if (err) {
			console.log('error in Slot.find');
		}
		if (!result) {
			res.status(204).send({ success: true, message: 'Désolé, aucune disponibilité n\'a été paramétrée' });
			//204: requete comprise, mais rien à renvoyer
		} else {
			res.status(200).send({ success: true, message: 'Voici les slots', content: result });
		}
	});
});

//this route is called from authentication after appointment time is selected,
// it will check if slot is well available, and then record apt and amend slot status
router.post('/', (req, res) => {
	//check that the body exists
	if (req.body) {
		let apt = req.body;
		console.log('apt : ', apt);
		//check if all the requested field of the models are received
		if (apt.aptName && apt.aptEmail && apt.aptTime && apt.aptDuration && _validator2.default.isEmail(apt.aptEmail) && apt.aptSlot._id) {

			//step1 - check that slot is well available:
			_modelslot2.default.findOne({ '_id': apt.aptSlot._id }, (err, result) => {
				console.log('step1: matching slot :', result);
				if (err) console.log('test 1');
				if (!result) {
					console.log('test 2');
					//no matching id found, means the time is not 'available' for appointment
					res.status(403).send({ success: false, message: 'Le RDV ne peut être confirmé car cet horaire n\'est pas disponible' });
				};
				if (result) {
					console.log('test 3');
					if (result.status == 'booked') {
						console.log('sorry slot is booked');
						res.status(403).send({ success: false, message: 'Le RDV ne peut être confirmé car cet horaire n\'est pas disponible' });
					}
					if (result.status == 'available') {

						//code qui marche sans async
						// createNewApt(apt);
						// updateSlot(apt, 'booked');
						// res.status(200).send({success:true, message:'6 -Votre RDV a bien été confirmé'})

						//test async await qui marche aussi
						helpers.confirmApt(apt, 'booked', res);
					}
				}
			});
		} else {
			//j'ai bien un body, mais il manque un des champs, renvoie un 403: il manque des infos pour confirmer le RDV
			res.status(403).send({ success: false, message: 'Vous devez renseigner un nom et un email valide' });
		}
	}
	//si je n'ai pas de body
	else {
			res.status(500).send({ success: false, message: 'Merci de vérifier les données personnelles renseignées' });
		}
});

// async function createNewApt(apt){
// 	console.log('createNewApt called');
// 	let newApt = new Appointment;
// 	newApt.lastname = apt.aptName;
// 	newApt.email = apt.aptEmail;
// 	newApt.time = apt.aptTime;
// 	newApt.duration = apt.aptDuration;
// 	newApt.save(function(err, created){
// 		if(err){
// 			return err;
// 		}
// 		else{
// 			console.log('from createNewApt : newApt well saved,', created);
// 		}
// 	})
// }

// async function updateSlot(apt, newStatus){
// 	console.log('updateSlot called');
// 	Slot.findOne({'_id': apt.aptSlot._id}, (err, updated) => {
// 		if (err){
// 			return err
// 		}
// 		else {
// 			updated.status = newStatus;
// 			updated.save(function(err){
// 				if (err){
// 					return err
// 				}
// 				else {
// 				console.log('from updateSlot: here is the slot to updated:', updated);
// 				}
// 			});
// 		}
// 	})
// }

// function sendReply(a,b, res){
// 		res.status(200).send({success:true, message:'Votre RDV a bien été confirmé'})
// }


// async function confirmApt(apt, booked, res) {
// 	let newAptcreated = await createNewApt(apt);
// 	let slotUpdated = await updateSlot(apt, booked);
// 	sendReply(newAptcreated, slotUpdated, res);
// 	console.log('async works');

// }


exports.default = router;