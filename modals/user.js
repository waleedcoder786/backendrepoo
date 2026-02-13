const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    institute: { type: String, required: true },
    watermark: { type: String, default: '' }, // Optional
    address: { type: String, default: '' },   // Optional
    logo: { type: String, default: '' },      // Optional
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    profilePic: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }
}, { timestamps: true });

export default  User = mongoose.model('User', UserSchema);