import express from 'express';
import mongoose from 'mongoose';
import Appointment from './modelapt.js'

import * as helpers from './../../../helpers.js';

let router = express.Router();

router.get('/clients',helpers.checkToken, (req, res) => {
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

export default router;