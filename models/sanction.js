const mongoose = require('mongoose');
const { Schema } = mongoose;

const sanctionSchema = new Schema({
	violationName: { type: String, required: true },
	firstOffense: { type: String, required: true },
	secondOffense: { type: String, required: true },
	thirdOffense: { type: String, required: true }
});

const Sanction = new mongoose.model('Sanctions', sanctionSchema);

module.exports = Sanction;