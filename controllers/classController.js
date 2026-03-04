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

<<<<<<< HEAD
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

=======
// Add Question (With Empty DB & Hierarchy Support)
exports.addQuestion = async (req, res) => {
    const { classId, subjectName, chapterName, topic, type, category, newQuestion } = req.body;
    const topicName = topic || "General";

    try {
        let doc = await Class.findOne({});
        if (!doc) {
            doc = new Class({ classes: [] });
        }

        // 1. Class Level
        let classIdx = doc.classes.findIndex(c => c.id === classId);
        if (classIdx === -1) {
            doc.classes.push({ 
                id: classId, 
                title: classId + "th", 
                sub: "New Academic Year", 
                color: "from-blue-600 to-blue-400",
                subjects: [] 
            });
            classIdx = doc.classes.length - 1;
        }

        // 2. Subject Level
        let subjects = doc.classes[classIdx].subjects;
        let subIdx = subjects.findIndex(s => s.name.trim().toLowerCase() === subjectName.trim().toLowerCase());
        if (subIdx === -1) {
            subjects.push({ name: subjectName, chapters: [], color: "bg-blue-600" });
            subIdx = subjects.length - 1;
        }

        // 3. Chapter Level
        let chapters = doc.classes[classIdx].subjects[subIdx].chapters;
        let chapIdx = chapters.findIndex(ch => 
            (typeof ch === 'string' ? ch : ch.name).trim().toLowerCase() === chapterName.trim().toLowerCase()
        );

        if (chapIdx === -1) {
            chapters.push({ name: chapterName, topics: [] });
            chapIdx = chapters.length - 1;
        } else if (typeof chapters[chapIdx] === 'string') {
            chapters[chapIdx] = { name: chapters[chapIdx], topics: [] };
        }

        // 4. Topic Level
        let targetChapter = doc.classes[classIdx].subjects[subIdx].chapters[chapIdx];
        if (!targetChapter.topics) targetChapter.topics = [];
        
        let topIdx = targetChapter.topics.findIndex(t => t.name.trim().toLowerCase() === topicName.trim().toLowerCase());
        if (topIdx === -1) {
            targetChapter.topics.push({
                name: topicName,
                questionTypes: { mcqs: { categories: [] }, shorts: { categories: [] }, longs: { categories: [] } }
            });
            topIdx = targetChapter.topics.length - 1;
        }

        // 5. Question & Category Level
        const typeKey = type === 'mcq' ? 'mcqs' : type === 'short' ? 'shorts' : 'longs';
        let categories = targetChapter.topics[topIdx].questionTypes[typeKey].categories;
        let catIdx = categories.findIndex(c => c.name === category);
>>>>>>> f7381f3 (CHANGES LOGICS)
        if (catIdx === -1) {
            categories.push({ name: category, questions: [] });
            catIdx = categories.length - 1;
        }

<<<<<<< HEAD
        // 5. Final Push Question
        categories[catIdx].questions.push({
            id: newQuestion.q_no || Date.now(),
=======
        categories[catIdx].questions.push({
            id: Date.now(),
>>>>>>> f7381f3 (CHANGES LOGICS)
            question: newQuestion.question,
            options: newQuestion.options,
            answer: newQuestion.answer
        });

<<<<<<< HEAD
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
=======
        doc.markModified('classes');
        await doc.save();
        res.status(200).json({ success: true, message: "Synced to Database!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.deleteBulkQuestions = async (req, res) => {
    // Check if body exists
    if (!req.body) return res.status(400).json({ message: "Request body is missing" });

    const { classId, subjectName, chapterName, topicName, type, category, questionIds } = req.body;
    const typeKey = type === 'mcq' ? 'mcqs' : type === 'short' ? 'shorts' : 'longs';

    try {
        const doc = await Class.findOne({}); // Aapka single doc structure hai to filter ki zaroorat nahi ya "classes.id" use karein
        if (!doc) return res.status(404).json({ message: "Database document not found" });

        const classIdx = doc.classes.findIndex(c => c.id === classId);
        if (classIdx === -1) return res.status(404).json({ message: "Class not found" });

        const subIdx = doc.classes[classIdx].subjects.findIndex(s => s.name === subjectName);
        if (subIdx === -1) return res.status(404).json({ message: "Subject not found" });

        const chapters = doc.classes[classIdx].subjects[subIdx].chapters;
        const chapIdx = chapters.findIndex(ch => 
            (typeof ch === 'string' ? ch : ch.name) === chapterName
        );
        if (chapIdx === -1) return res.status(404).json({ message: "Chapter not found" });
        
        let targetChapter = doc.classes[classIdx].subjects[subIdx].chapters[chapIdx];
        const topIdx = targetChapter.topics.findIndex(t => t.name === topicName);
        if (topIdx === -1) return res.status(404).json({ message: "Topic not found" });
        
        let categoryObj = targetChapter.topics[topIdx].questionTypes[typeKey].categories
            .find(c => c.name === category);

        if (categoryObj) {
            // IDs ko string mein convert karke compare karein taaki mismatch na ho
            categoryObj.questions = categoryObj.questions.filter(q => 
                !questionIds.includes(String(q.id)) && !questionIds.includes(String(q._id))
            );
        }

        doc.markModified('classes');
        await doc.save();
        res.status(200).json({ success: true, message: "Deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// Add this to your controller file
exports.deleteHierarchy = async (req, res) => {
    const { level, classId, subjectName, chapterName, topicName } = req.body;

    try {
        let doc = await Class.findOne({});
        if (!doc) return res.status(404).json({ message: "Database not found" });

        // 1. Find Class Index
        const classIdx = doc.classes.findIndex(c => c.id === classId);
        if (classIdx === -1) return res.status(404).json({ message: "Class not found" });

        if (level === 'class') {
            // Poori class remove kardo
            doc.classes.splice(classIdx, 1);
        } 
        else if (level === 'subject') {
            // Specific subject remove kardo
            const subIdx = doc.classes[classIdx].subjects.findIndex(s => s.name === subjectName);
            if (subIdx !== -1) {
                doc.classes[classIdx].subjects.splice(subIdx, 1);
            }
        } 
        else if (level === 'chapter') {
            // Specific chapter remove kardo
            const subIdx = doc.classes[classIdx].subjects.findIndex(s => s.name === subjectName);
            if (subIdx === -1) return res.status(404).json({ message: "Subject not found" });

            const chapters = doc.classes[classIdx].subjects[subIdx].chapters;
            const chapIdx = chapters.findIndex(ch => 
                (typeof ch === 'string' ? ch : ch.name) === chapterName
            );
            if (chapIdx !== -1) {
                doc.classes[classIdx].subjects[subIdx].chapters.splice(chapIdx, 1);
            }
        } 
        else if (level === 'topic') {
            // Specific topic remove kardo
            const subIdx = doc.classes[classIdx].subjects.findIndex(s => s.name === subjectName);
            const chapters = doc.classes[classIdx].subjects[subIdx].chapters;
            const chapIdx = chapters.findIndex(ch => 
                (typeof ch === 'string' ? ch : ch.name) === chapterName
            );
            
            let targetChapter = doc.classes[classIdx].subjects[subIdx].chapters[chapIdx];
            if (targetChapter && targetChapter.topics) {
                const topIdx = targetChapter.topics.findIndex(t => t.name === topicName);
                if (topIdx !== -1) {
                    targetChapter.topics.splice(topIdx, 1);
                }
            }
        }

        doc.markModified('classes');
        await doc.save();
        res.status(200).json({ success: true, message: `${level} deleted successfully!` });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
>>>>>>> f7381f3 (CHANGES LOGICS)
