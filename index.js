import express from 'express';

import mongoose from 'mongoose';

import User from './modules/professional/auth/modelauth.js'

import bodyParser from 'body-parser';
import morgan from 'morgan';

import moment from 'moment';
import validator from 'validator';

import dotEnv from 'dotenv';
// Init .env
// Il faut absolement declarer la config de dotenv immediatement
// Pour que les process.env.VARIABLE soient utilisable depuis les imports (de routes)
dotEnv.config();

import routerAuth from './modules/professional/auth/routesauth.js';
import routerApt from './modules/professional/main/routesapt.js';
import routerSlot from './modules/professional/main/routesslot.js';
import routerClient from './modules/client/routesclient.js';

//here we will import our modules for routes

let app = express();

app.use(morgan('dev'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// CORS cross-origin
app.use(function (req, res, next) {
 // res.header(`Access-Control-Allow-Origin`, `https://mybookingapppro.herokuapp.com`);
 res.header(`Access-Control-Allow-Origin`, `*`);
 res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE, OPTIONS`);
 res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept, token`);
 // res.header(`Access-Control-Expose-Headers`,  `token`);
 // intercept OPTIONS method
  if ('OPTIONS' == req.method) res.sendStatus(200);
  else next();
 
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
app.use('/auth', routerAuth);
app.use('/apt', routerApt);
app.use('/slot', routerSlot);
app.use('/client', routerClient);


mongoose.connect(process.env.DB, (err) => {
	if (err){throw err;}
	else{
		let port = process.env.PORT || '2707';
		console.log('the data base is connected');
		app.listen(port, () => {
		console.log ('app running and listening to port' + port);
		});
	}
})


// Seeder 1st time / to leave commented
// let user = new User({
// 	username: 'pro@gmail.com',
// 	password: '123',
// })

// user.save(function(err, result){
// 	if (err){
// 		console.log('error');
// 	}
// 	else{
// 		console.log('Seeder user saved');
// 		mongoose.disconnect();
// 	}
// })

