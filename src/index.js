import express from 'express';

import bodyParser from 'body-parser';
import morgan from 'morgan';

import mongoose from 'mongoose';
import moment from 'moment';
import validator from 'validator';


import routerAuth from './modules/professional/auth/routesauth.js';
import routerApt from './modules/professional/main/routesapt.js';
import routerSlot from './modules/professional/main/routesslot.js';
import routerClient from './modules/client/routesclient.js';

//here we will import our modules for routes

let app = express();
let port = '2707';

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(morgan('dev'));

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
app.use('/auth', routerAuth);
app.use('/apt', routerApt);
app.use('/slot', routerSlot);
app.use('/client', routerClient);




mongoose.connect('mongodb://localhost:27017/bookingappDB', (err) => {
	if (err){throw err;}
	else{
		console.log('the data base is connected');
		app.listen(port, () => {
		console.log ('app running and listening to port' + port);
		});
	}
})


