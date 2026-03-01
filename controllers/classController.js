const Class = require('../models/Class');

exports.getAllClasses = async (req, res) => {
    const classes = await Class.find({});
    res.json(classes);
};
exports.addQuestion = async (req, res) => {
    const { classId, subjectName, chapterName, newQuestion, type, category } = req.body;
    
    try {
        const doc = await Class.findOne({ "classes.id": classId });
        if (!doc) return res.status(404).json({ message: "Class not found" });

        const classIdx = doc.classes.findIndex(c => c.id === classId);
        const subjects = doc.classes[classIdx].subjects || [];

        // 1. Subject Match
        const subjectIdx = subjects.findIndex(s => 
            s.name?.toString().trim().toLowerCase() === subjectName.trim().toLowerCase()
        );

        if (subjectIdx === -1) return res.status(404).json({ message: "Subject not found" });

        let chapters = doc.classes[classIdx].subjects[subjectIdx].chapters || [];

        // 2. Chapter Match (String ya Object dono ko handle karega)
        let chapterIdx = chapters.findIndex(ch => {
            if (typeof ch === 'string') return ch.trim().toLowerCase() === chapterName.trim().toLowerCase();
            if (typeof ch === 'object') return ch.name?.trim().toLowerCase() === chapterName.trim().toLowerCase();
            return false;
        });

        if (chapterIdx === -1) {
            // Agar chapter bilkul nahi hai to naya object banayein
            doc.classes[classIdx].subjects[subjectIdx].chapters.push({
                name: chapterName,
                topics: [], MCQs: {}, shorts: {}, longs: {}
            });
            chapterIdx = doc.classes[classIdx].subjects[subjectIdx].chapters.length - 1;
        } else if (typeof chapters[chapterIdx] === 'string') {
            // AGAR CHAPTER SIRF STRING HAI: To usay Object mein convert karein
            const chName = chapters[chapterIdx];
            doc.classes[classIdx].subjects[subjectIdx].chapters[chapterIdx] = {
                name: chName,
                topics: [],
                MCQs: {},
                shorts: {},
                longs: {}
            };
        }

        // 3. Data Entry
        let targetChapter = doc.classes[classIdx].subjects[subjectIdx].chapters[chapterIdx];
        const fieldName = type === 'mcq' ? 'MCQs' : type === 'short' ? 'shorts' : 'longs';

        if (!targetChapter[fieldName]) targetChapter[fieldName] = {};
        if (!Array.isArray(targetChapter[fieldName][category])) {
            targetChapter[fieldName][category] = [];
        }

        targetChapter[fieldName][category].push(newQuestion);

        // Topic Sync
        if (newQuestion.topic) {
            if (!targetChapter.topics) targetChapter.topics = [];
            if (!targetChapter.topics.includes(newQuestion.topic)) targetChapter.topics.push(newQuestion.topic);
        }

        // 4. Save
        doc.markModified('classes');
        await doc.save();

        res.status(200).json({ success: true, message: "Chapter converted and data saved!" });

    } catch (err) {
        console.error("LOG:", err);
        res.status(500).json({ error: err.message });
    }
};
