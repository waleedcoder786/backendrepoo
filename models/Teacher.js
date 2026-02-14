const mongoose = require('mongoose');
const teacherSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    city: String,
    subjects: [String],
    classes: [String],
    adminId: { type: String, required: true }, 
    role: { type: String, default: "teacher" },
    institute: String,
    watermark: String,
    logo: String,
    address: String,
}, { timestamps: true });
module.exports = mongoose.model('Teacher', teacherSchema);