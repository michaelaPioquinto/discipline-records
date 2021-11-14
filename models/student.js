const mongoose = require('mongoose');
const { Schema } = mongoose;


const studentSchema = new Schema({
	studentID: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	middleName: { type: String, required: true },
	course: { type: String, required: true },
	yearSection: { type: String, required: true }
});


const Student = new mongoose.model('Students', studentSchema);

module.exports = Student;