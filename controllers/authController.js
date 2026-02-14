const User = require('../models/user');
const Teacher = require('../models/Teacher');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && user.password === password) return res.json({ type: 'user', data: user });

        const teacher = await Teacher.findOne({ email });
        if (teacher && teacher.password === password) return res.json({ type: 'teacher', data: teacher });

        res.status(401).json({ message: "Invalid credentials" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};