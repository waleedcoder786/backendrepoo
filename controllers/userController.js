const User = require('../models/user');

// 1. Get All Registered Admins/Users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 2. Create/Register New Admin User
exports.createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ 
            success: true, 
            data: newUser 
        });
    } catch (err) {
        // Check for duplicate email error (MongoDB Code 11000)
        if (err.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }
        res.status(500).json({ success: false, error: err.message });
    }
};

// 3. Update User Profile
exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json({ success: true, data: updatedUser });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 4. Delete User
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "User account deleted" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};