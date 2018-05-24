import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import Appointment from './modelapt.js';
import Slot from './modelslot.js';
import moment from 'moment';
import validator from 'validator'


let app = express();
let port = '2707';

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(morgan('dev'));

// CORS cross-origin
app.use(function (req, res, next) {
 res.header(`Access-Control-Allow-Origin`, `*`);
 res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
 res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
 next();
});


//this route is called from home and will send back the slots.
app.get('/', (req, res) => {
	console.log('get route is OK');
	Slot.find({}, (err, result) => {
		if (err) {console.log('error in Slot.find')}
		if (!result){
			res.status(200).json({success:true, message:'any time available for now'})
		}
		else {
			res.status(200).json({success:true, message:'Here are the slots', content:result})
		}
	})
})


//this route is called from authentication after appointment time is selected,
// it will check if no appointment at this time, then store apt i DB
// record a slot for the time.
// and return confirmation
app.post('/', (req, res) => {
	//check that the body exists
		if (req.body){
			let apt = req.body;
			console.log ('apt : ', apt);
			validator.isEmail('foo@bar.com')
			//check if all the requested field of the models are received
			if (apt.name && apt.mail && apt.time && apt.duration && validator.isEmail(apt.mail)){
				//get back the datas in a variable
				let newApt = new Appointment;
				newApt.lastname = apt.name;
				newApt.email = apt.mail;
				newApt.time = apt.time;
				newApt.duration = apt.duration;

				let newSlot = new Slot;
				newSlot.start = moment(apt.time);
				newSlot.duration = apt.duration;
				newSlot.end = moment(newSlot.start).add(apt.duration, 'minutes');
				newSlot.status = 'booked';
				console.log('newSlot:', newSlot);

				//check if no appointment already at that time
				Appointment.findOne({'time': apt.time}, (err, result) => {
					if (err) { console.log('error in Appointment.findOne')}
					if (result){
						// if matching found, means already an appontment at that time
						//sending back a 403 error ( server has understood the request, but reject the execution)
						res.status(403).json({success:false, message:'Le RDV ne peut être confirmé car cet horaire n\'est pas disponible'})
					}
					else{
						//if no matching, means the apt can be save in DB
						newApt.save(function(err){
							if(err){
								res.status(403).json({success:false, message:'Votre RDV n\'a pas été pris en compte dans notre agenda. Merci de réessayer'})
							}
							else{
								newSlot.save(function(err){
									if (err){
										res.status(403).json({success:false, message:'Votre RDV n\'a pas été pris en compte dans notre agenda. Merci de réessayer'})
									}
									else{
										res.status(200).json({success:true, message:'Votre RDV a bien été confirmé'})
									}
								})
							}	
						})
					}
				})
			}
			else{
				//j'ai bien un body, mais il manque un des champs, renvoie un 403: il manque des infos pour confirmer le RDV
				res.status(403).json({success:false, message:'Vous devez renseigner un nom et un email valide'})
			}
		}
		//si je n'ai pas de body
		else{
			res.status(500).json({success:false, message:'Merci de vérifier les données personnelles renseignées'})
		}
})


//this route is call from FrontEndPro
app.get('/clients', (req, res) => {
	console.log('get route clients is OK');
	Appointment.find({}, (err, result) => {
		if (err) {console.log('error in Appointment.find')}
		if (!result){
			res.status(404).json({success:false, message:'No Appointment found'})
		}
		else {
			res.status(200).json({success:true, message:'Here is the client list', content:result})
		}
	})
})





mongoose.connect('mongodb://localhost:27017/bookingappDB', (err) => {
	if (err){throw err;}
	else{
		console.log('the data base is connected');
		app.listen(port, () => {
		console.log ('app running and listening to port' + port);
		});
	}
})
