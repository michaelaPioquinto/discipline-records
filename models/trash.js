const mongoose = require('mongoose');
const { Schema } = mongoose;

const trashSchema = new Schema({
	firstname: { type: String, required: true },
	middlename: { type: String, required: true },
	lastname: { type: String, required: true },
	username: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String },
	role: { type: String, required: true }
});


const Trash = new mongoose.model('Trashes', trashSchema);

module.exports = Trash;