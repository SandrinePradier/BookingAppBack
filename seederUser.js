require('./seederUser')


import mongoose from 'mongoose';
import User from './modules/professional/auth/modelauth.js'


mongoose.connect('process.env.DB', (err) => {
	if (err){throw err;}
	else{
		console.log('the data base is connected');


	}
})

let user = new User({
	username: 'pro@gmail.com',
	password: '123',
})

user.save(function(err, result){
	if (err){
		console.log('error');
	}
	else{
		console.log('Seeder user saved');
		mongoose.disconnect();
	}
})



