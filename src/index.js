import express from 'express';
import bodyParser from 'body-parser';
// import babel-polyfill from 'babel-polyfill'
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



app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error:{
			message: error.message
		}
	})
})





// *********FRONT_END Routes************


//this route is called from calendar and will send back the slots.
app.get('/', (req, res) => {
	console.log('get route is OK');
	Slot.find({}, (err, result) => {
		if (err) {console.log('error in Slot.find')}
		if (!result){
			res.status(204).send({success:true, message:'Désolé, aucune disponibilité n\'a été paramétrée'})
			//204: requete comprise, mais rien à renvoyer
		}
		else {
			res.status(200).send({success:true, message:'Voici les slots', content:result})
		}
	})
})


//this route is called from authentication after appointment time is selected,
// it will check if slot is well available, and then record apt and amend slot status
app.post('/', (req, res) => {
	//check that the body exists
		if (req.body){
			let apt = req.body;
			console.log ('apt : ', apt);
			//check if all the requested field of the models are received
			if (apt.aptName && apt.aptEmail && apt.aptTime && apt.aptDuration && validator.isEmail(apt.aptEmail) && apt.aptSlot._id) {
				
			//step1 - check that slot is well available:
				Slot.findOne({'_id': apt.aptSlot._id}, (err, result) => {
						console.log('step1: matching slot :' ,result);
						if (err) console.log('test 1');
						if (!result){
							console.log('test 2');
							//no matching id found, means the time is not 'available' for appointment
							res.status(403).send({success:false, message:'Le RDV ne peut être confirmé car cet horaire n\'est pas disponible'})
						};
						if (result){
							console.log('test 3');
							if (result.status == 'booked'){
								console.log('sorry slot is booked');
								res.status(403).send({success:false, message:'Le RDV ne peut être confirmé car cet horaire n\'est pas disponible'})
							}
							if ( result.status == 'available'){
								
								//code qui marche sans async
								// createNewApt(apt);
								// updateSlot(apt, 'booked');
								// res.status(200).send({success:true, message:'6 -Votre RDV a bien été confirmé'})
							
								//test async await qui marche aussi
								confirmApt(apt, 'booked', res);
							}
						}
				})
			}
			else{
				//j'ai bien un body, mais il manque un des champs, renvoie un 403: il manque des infos pour confirmer le RDV
				res.status(403).send({success:false, message:'Vous devez renseigner un nom et un email valide'})
			}
		}
		//si je n'ai pas de body
		else{
			res.status(500).send({success:false, message:'Merci de vérifier les données personnelles renseignées'})
		}
});


async function createNewApt(apt){
	console.log('createNewApt called');
	let newApt = new Appointment;
	newApt.lastname = apt.aptName;
	newApt.email = apt.aptEmail;
	newApt.time = apt.aptTime;
	newApt.duration = apt.aptDuration;
	newApt.save(function(err, created){
		if(err){
			return err;
		}
		else{
			console.log('from createNewApt : newApt well saved,', created);
		}
	})
}

async function updateSlot(apt, newStatus){
	console.log('updateSlot called');
	Slot.findOne({'_id': apt.aptSlot._id}, (err, updated) => {
		if (err){
			return err
		}
		else {
			updated.status = newStatus;
			updated.save(function(err){
				if (err){
					return err
				}
				else {
				console.log('from updateSlot: here is the slot to updated:', updated);
				}
			});
		}
	})
}

function sendReply(a,b, res){
		res.status(200).send({success:true, message:'Votre RDV a bien été confirmé'})
}


async function confirmApt(apt, booked, res) {
	let newAptcreated = await createNewApt(apt);
	let slotUpdated = await updateSlot(apt, booked);
	sendReply(newAptcreated, slotUpdated, res);
	console.log('async works');
	
}



// *********FRONT_END_PRO Routes************


app.get('/clients', (req, res) => {
	console.log('get route clients called');
	Appointment.find({}, (err, result) => {
		if (err) {console.log('error in Appointment.find')}
		if (!result){
			res.status(404).send({success:false, message:'No Appointment found'})
		}
		else {
			res.status(200).send({success:true, message:'Here is the client list', content:result})
		}
	})
})

app.get('/slots', (req, res) => {
	console.log('get route slots called');
	Slot.find({}, (err, result) => {
		if (err) {console.log('error in slot.find')}
		if (!result){
			res.status(404).send({success:false, message:'No Slot found'})
		}
		else {
			res.status(200).send({success:true, message:'Here is the Slot list', content:result})
		}
	})
})


app.post('/availabilities', (req, res) => {
	console.log('post route availabilities called, req.body:', req.body);
	let slotlist = req.body;
	let slotlistavailable = slotlist;
	Slot.find({'status': 'booked'}, (err, result) => {
		if (err) {console.log('error')};
		if (!result){
			console.log(' CAS !RESULT: je vais enregistrer tous les slots envoyés');
			for (let i=0; i<slotlist.length; i++){
				let newSlot = new Slot;
				newSlot.start = slotlist[i].start;
				newSlot.duration = slotlist[i].duration;
				newSlot.end = slotlist[i].end;
				newSlot.status = slotlist[i].status;
				console.log('newSlot:', newSlot);
				newSlot.save(function(err){
					if(err){
						console.log('cas !result: error when saving');
						return err;
					}
					else {
						console.log('newSlot saved')
					}
				});
			}
			console.log('headers: ', res.headers);
			console.log('res.headersSent:', res.headersSent)
			res.status(200).send({success:true, message:"NO CONFLICT as no booked slots in the DB: new slot well saved"})	
		}
		if (result){
			console.log('CAS RESULT : voici les slots booked: ', result)
			console.log('je vais vérifier si certains slots booked sont des duplicates avec la liste du body');
			console.log('slotlistlength: ', slotlist.length);
			
				for (let j=0; j<result.length; j++){
					for (let i=0; i<slotlist.length; i++){
						console.log('slotlist[i]: ', slotlist[i])
						if (slotlist[i].start == result[j].start && slotlist[i].duration == result[j].duration){
							console.log('matching slots: ', slotlist[i]);
							slotlistavailable.splice(i,1);
						}
						else{
							console.log('no matching found');
						}
					}
				}
				console.log('slotlistavailable length', slotlistavailable.length);

				for (let k=0; k<slotlistavailable.length; k++){

					// create new slot object
					let newSlot = new Slot;
					newSlot.start = slotlistavailable[k].start;
					newSlot.duration = slotlistavailable[k].duration;
					newSlot.end = slotlistavailable[k].end;
					newSlot.status = slotlistavailable[k].status;
					console.log('newSlot:', newSlot);
					
					// save slot in db
					newSlot.save(function(err){
						if(err){
							console.log('error RESULT when saving');
							return err
						}
						else {
							console.log('newSlot saved')
						}
					});
				}
			console.log('res.headersSent:', res.headersSent)
			res.status(200).send({success:true, message:"NO CONFLICT: new slot 'available' well saved"})
		}
	})	
});



//handling error in case wrong url
// app.use((req, res, next) =>{
// 	const error = new Error('Not found');
// 	error.status = 404;
// 	next(error);
// })

mongoose.connect('mongodb://localhost:27017/bookingappDB', (err) => {
	if (err){throw err;}
	else{
		console.log('the data base is connected');
		app.listen(port, () => {
		console.log ('app running and listening to port' + port);
		});
	}
})


