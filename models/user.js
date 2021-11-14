const mongoose = require('mongoose');
const { Schema } = mongoose;


const userSchema = new Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	status: { type: String, required: true },
	role: { type: String, required: true }
});


const User = new mongoose.model('Users', userSchema);

module.exports = User;