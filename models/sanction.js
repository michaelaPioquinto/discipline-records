const mongoose = require('mongoose');
const { Schema } = mongoose;

const sanctionSchema = new Schema({
	violation: { type: String, required: true },
	firstOffense: { type: String, required: true },
	secondOffense: { type: String, required: true },
	thirdOffense: { type: String, required: true }
});

const Sanction = new mongoose.model('Sanctions', sanctionSchema);

export default Sanction;