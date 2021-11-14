const mongoose = require('mongoose');
const { Schema } = mongoose;


const archivedSchema = new Schema({
	studentID: { type: String, required: true },
	fileName: { type: String, required: true },
	type: { type: String, required: true },
	size: { type: String, required: true }
});


const Report = new mongoose.model('Reports', archivedSchema);

export default Report;