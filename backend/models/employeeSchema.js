const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var employeeSchema = new Schema({
    dateCreated: { type: Date, default: Date.now },
    fullName: { type: String, required: false },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    school: { type: Number, required: true },
    profilePictureLink: { type: String, required: false },
    setupIsCompleted: { type: Boolean, default: false },
    mainDegree: { type: Number, required: false },
    mainPrograms: [
        {
            programId: { type: Number, required: true },
            type: { type: Number, required: true }
        }
    ],
    mainGradMonth: { type: Number, required: false },
    mainGradYear: { type: Number, required: false }
});


var Employee = mongoose.model('Employee', employeeSchema, 'Employees');


module.exports = Employee;
