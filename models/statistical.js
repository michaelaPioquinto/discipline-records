const mongoose = require('mongoose');
const { Schema } = mongoose;


const statisticalSchema = new Schema({
	semester1: { type: Number, default: 0 },
	semester2: { type: Number, default: 0 },
	year: { type: Number, required: true },
});


const Statistical = new mongoose.model('Statisticals', statisticalSchema);

module.exports = Statistical;