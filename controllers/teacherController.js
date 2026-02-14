const Teacher = require('../models/Teacher');

// 1. Register New Teacher
exports.createTeacher = async (req, res) => {
    try {
        const newTeacher = new Teacher(req.body);
        await newTeacher.save();
        res.status(201).json({ 
            success: true, 
            message: "Teacher added successfully", 
            data: newTeacher 
        });
    } catch (err) {
        console.error("Teacher Save Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// 2. Get Teachers for specific Admin
exports.getTeachersByAdmin = async (req, res) => {
    try {
        const { adminId } = req.query;
        // Filter: Agar adminId di hai toh wahi filter use karein, warna empty
        const filter = adminId ? { adminId: adminId } : {};
        
        const teachers = await Teacher.find(filter).sort({ createdAt: -1 });
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 3. Update Teacher Details
exports.updateTeacher = async (req, res) => {
    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        
        if (!updatedTeacher) return res.status(404).json({ message: "Teacher not found" });
        
        res.json({ success: true, data: updatedTeacher });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 4. Delete Teacher
exports.deleteTeacher = async (req, res) => {
    try {
        const deleted = await Teacher.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Teacher not found" });
        
        res.json({ success: true, message: "Teacher deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};