import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let slotSchema = new Schema({
	start: {
		type: Date,
		required: true
	},
	end: {
		type: Date,
		required: true
	},
	duration : {
		type: Number,
		required: true
	},
	status : {
		type: String,
		required: true
	}
})

let Slot = mongoose.model('slot', slotSchema);

export default Slot;