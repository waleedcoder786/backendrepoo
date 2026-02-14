const Class = require('../models/Class');

exports.getAllClasses = async (req, res) => {
    const classes = await Class.find({});
    res.json(classes);
};

exports.addQuestion = async (req, res) => {
    const { classId, subjectName, chapterName, newQuestion, type, category } = req.body;
    try {
        const fieldName = type === 'mcq' ? 'MCQs' : type === 'short' ? 'shorts' : 'longs';
        const updatePath = `classes.$[cls].subjects.$[sub].chapters.$[ch].${fieldName}.0.${category}`;

        const result = await Class.updateOne(
            { "classes.id": classId },
            { $push: { [updatePath]: newQuestion } },
            { arrayFilters: [{ "cls.id": classId }, { "sub.name": subjectName }, { "ch.name": chapterName }] }
        );
        res.status(200).send({ message: "Data Synced!" });
    } catch (err) { res.status(500).send({ error: err.message }); }
};