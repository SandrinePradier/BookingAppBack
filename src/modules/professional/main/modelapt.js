import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let appointmentSchema = new Schema({
	lastname : {
		type: String,
		required: true
	},
	email : {
		type: String,
		required: true
	},
	time:  {
		type : Date,
		required: true
	},
	duration: {
		type : Number,
		required: true
	}
})


let Appointment = mongoose.model('appointment', appointmentSchema);


export default Appointment;