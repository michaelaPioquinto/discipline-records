const mongoose = require('mongoose');
const { Schema } = mongoose;


const studentSchema = new Schema({
	studentID: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	MiddleName: { type: String, required: true },
	course: { type: String, required: true },
	yearSection: { type: String, required: true }
});


const Student = new mongoose.model('Students', studentSchema);

export default Student;