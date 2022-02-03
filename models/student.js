const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema({
	studentID: { type: String, required: true },
	firstName: { type: String, required: true },
	lastname: { type: String, required: true },
	middleName: { type: String, required: true },
	password: { type: String, required: true },
	course: { type: String, required: true },
	semester: { type: String, default: '1st' },
	yearSection: { type: String, required: true },
	status: { type: Object, default: 'activated' },
	dateArchived: String
});


const Student = new mongoose.model('Students', studentSchema);

module.exports = Student;