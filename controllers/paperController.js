const Paper = require('../models/Paper');
const Teacher = require('../models/Teacher');

exports.createPaper = async (req, res) => {
    try {
        const newPaper = new Paper(req.body);
        await newPaper.save();
        res.status(201).json({ message: "Paper saved!", id: newPaper._id });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getUserPapers = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: "User ID is required" });

        const teachers = await Teacher.find({ adminId: userId }); 
        const allIds = [userId, ...teachers.map(t => t._id)];

        const papers = await Paper.find({ userId: { $in: allIds } }).sort({ createdAt: -1 });
        res.json(papers);
    } catch (err) { res.status(500).json({ error: "Server Error" }); }
};

exports.getPaperById = async (req, res) => {
    try {
        const paper = await Paper.findById(req.params.id);
        paper ? res.json(paper) : res.status(404).json({ message: "Not found" });
    } catch (err) { res.status(500).json({ message: "Invalid ID" }); }
};

exports.updatePaper = async (req, res) => {
    try {
        const updated = await Paper.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json({ message: "Update Successful", data: updated });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deletePaper = async (req, res) => {
    try {
        await Paper.findByIdAndDelete(req.params.id);
        res.json({ message: "Paper deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};