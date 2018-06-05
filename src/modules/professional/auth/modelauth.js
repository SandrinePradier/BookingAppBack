import mongoose from 'mongoose';
import mongooseTypeEmail from 'mongoose-type-email';
import validator from 'validator';

let Schema = mongoose.Schema;

let userSchema = new Schema({
	username: {
		type: mongoose.SchemaTypes.Email,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	firstname: {
		type: String,
	},
	lastname: {
		type: String,
	},
	token: {
		type: String
	},
	creationDate: {
		type: Date
	}
});

// creation of a model based on our Schema
let User = mongoose.model('user', userSchema);

export default User;