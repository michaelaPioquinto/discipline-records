const mongoose = require('mongoose');
const { Schema } = mongoose;

const dutyReportSchema = new Schema({
	studentID: { type: String, required: true },
	filePath: { type: String, required: true },
	date: { type: String, required: true },
});

const DutyReport = new mongoose.model('DutyReports', dutyReportSchema);

module.exports = DutyReport;