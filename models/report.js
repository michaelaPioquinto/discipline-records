const mongoose = require('mongoose');
const { Schema } = mongoose;


const reportsSchema = new Schema({
	studentID: String,
	reportedBy: String,
	role: String,
	duty: [ String ],
	semester: String,
	dateOfReport: String,
	incidentNo: Number,
	studentName: String,
	dateOfIncident: String,
	courseYearSection: String,
	timeOfIncident: String,
	dutyHrs: String,
	location: String,
	specificArea: String,
	images: [ String ],
	additionalPersonInvolved: String,
	witnesses: String,
	incidentDescription: String,
	descriptionOfUnacceptable: String,
	resultingActionExecuted: String,
	employeeName: String,
	employeeDate: String,
	headName: String,
	headDate: String,
	minorProblemBehavior: [ String ],
	majorProblemBehavior: [ String ],
	initialActionGiven: String,
	administrativeDecision: [ String ],
	administrativeComment: String,
	firstOffenses: [ String ],
	secondOffenses: [ String ],
	thirdOffenses: [ String ],
	status: { type: String, default: 'activated' }
});


const Report = new mongoose.model('Reports', reportsSchema);

module.exports = Report;