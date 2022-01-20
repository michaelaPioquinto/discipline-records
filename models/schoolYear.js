const mongoose = require('mongoose');
const { Schema } = mongoose;

const schoolYearSchema = new Schema({
	schoolYear: { type: String, required: true },
	semester: { type: String, required: true },	
	status: { type: String, default: 'activated' },	
});

const SchoolYear = new mongoose.model('SchoolYears', schoolYearSchema);

module.exports = SchoolYear;