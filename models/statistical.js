const mongoose = require('mongoose');
const { Schema } = mongoose;


const statisticalSchema = new Schema({
	semester: { type: String, required: true },
	year: { type: Number, required: true },
	violators: { type: Number, required: true }
});


const Statistical = new mongoose.model('Statisticals', statisticalSchema);

module.exports = Statistical;