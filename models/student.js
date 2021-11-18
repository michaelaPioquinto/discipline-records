const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema({
	studentID: { type: String, required: true },
	firstName: { type: String, required: true },
	lastname: { type: String, required: true },
	middleName: { type: String, required: true },
	password: { type: String, required: true },
	course: { type: String, required: true },
	yearSection: { type: String, required: true },
	archived: { type: Boolean, required: true }
});


const Student = new mongoose.model('Students', studentSchema);

module.exports = Student;