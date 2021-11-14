const mongoose = require('mongoose');
const { Schema } = mongoose;


const reportsSchema = new Schema({
	studentID: { type: String, required: true },
	duty: { type: String, required: true },
	report: { type: String, required: true },
	evidence: { type: String, required: true },
	year: { type: String, required: true },
	semester: { type: String, required: true }
});


const Report = new mongoose.model('Reports', reportsSchema);

module.exports = Report;