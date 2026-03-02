const Class = require('../models/Class');

// Get all structure
exports.getAllClasses = async (req, res) => {
    try {
        const data = await Class.find({});
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add Question with Auto-Topic-Creation Logic
exports.addQuestion = async (req, res) => {
    const { classId, subjectName, chapterName, newQuestion, type, category } = req.body;
    const topicName = newQuestion.topic || "General";

    try {
        const doc = await Class.findOne({ "classes.id": classId });
        if (!doc) return res.status(404).json({ message: "Class not found" });

        const classIdx = doc.classes.findIndex(c => c.id === classId);
        const subjects = doc.classes[classIdx].subjects;

        // 1. Subject Match
        const subjectIdx = subjects.findIndex(s => s.name.trim().toLowerCase() === subjectName.trim().toLowerCase());
        if (subjectIdx === -1) return res.status(404).json({ message: "Subject not found" });

        // 2. Chapter Match (Convert string to object if necessary)
        let chapters = doc.classes[classIdx].subjects[subjectIdx].chapters;
        let chapterIdx = chapters.findIndex(ch => 
            (typeof ch === 'string' ? ch : ch.name).trim().toLowerCase() === chapterName.trim().toLowerCase()
        );

        if (chapterIdx === -1) {
            // Naya chapter agar nahi hai
            doc.classes[classIdx].subjects[subjectIdx].chapters.push({ name: chapterName, topics: [] });
            chapterIdx = doc.classes[classIdx].subjects[subjectIdx].chapters.length - 1;
        } else if (typeof chapters[chapterIdx] === 'string') {
            // String chapter ko object mein upgrade karein
            doc.classes[classIdx].subjects[subjectIdx].chapters[chapterIdx] = { name: chapters[chapterIdx], topics: [] };
        }

        let targetChapter = doc.classes[classIdx].subjects[subjectIdx].chapters[chapterIdx];
        if (!targetChapter.topics) targetChapter.topics = [];

        // 3. Topic Match (NEW TOPIC LOGIC - Auto Push at end)
        let topicIdx = targetChapter.topics.findIndex(t => 
            t.name.trim().toLowerCase() === topicName.trim().toLowerCase()
        );

        if (topicIdx === -1) {
            const newTopicTemplate = {
                name: topicName,
                questionTypes: {
                    mcqs: { categories: [] },
                    shorts: { categories: [] },
                    longs: { categories: [] }
                }
            };
            targetChapter.topics.push(newTopicTemplate); // Hamesha list ke end mein add hoga
            topicIdx = targetChapter.topics.length - 1;
        }

        const targetTopic = targetChapter.topics[topicIdx];
        const typeKey = type === 'mcq' ? 'mcqs' : type === 'short' ? 'shorts' : 'longs';
        
        if (!targetTopic.questionTypes[typeKey]) {
            targetTopic.questionTypes[typeKey] = { categories: [] };
        }

        // 4. Category Match (Exercise / Additional etc.)
        let categories = targetTopic.questionTypes[typeKey].categories;
        let catIdx = categories.findIndex(c => c.name.trim().toLowerCase() === category.trim().toLowerCase());

        if (catIdx === -1) {
            categories.push({ name: category, questions: [] });
            catIdx = categories.length - 1;
        }

        // 5. Final Push Question
        categories[catIdx].questions.push({
            id: newQuestion.q_no || Date.now(),
            question: newQuestion.question,
            options: newQuestion.options,
            answer: newQuestion.answer
        });

        // 6. Save and Mark Modified
        doc.markModified('classes');
        await doc.save();

        res.status(200).json({ 
            success: true, 
            message: `Successfully added to topic: ${topicName}` 
        });

    } catch (err) {
        console.error("AddQuestion Error:", err);
        res.status(500).json({ error: err.message });
    }
};
