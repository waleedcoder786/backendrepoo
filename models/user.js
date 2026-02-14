const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    institute: String,
    address: String,
    watermark: String,
    logo: String,
    role: { type: String, default: 'admin' },
    profilePic: String
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);