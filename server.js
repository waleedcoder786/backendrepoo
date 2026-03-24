const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// 1. Connect DB
connectDB();

// 2. Middlewares
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || origin.includes("vercel.app") || origin.includes("localhost")) {
            callback(null, true);
        } else {
            callback(new Error("CORS block"));
        }
    },
    credentials: true
};
app.use(cors(corsOptions));
// app.use(cors());
app.use(express.json({ limit: '50mb' }));

// 3. Route Splitting
app.post('/api/login', require('./controllers/authController').login);
app.use('/api/papers', require('./routes/paperRoutes'));
app.use('/api/teachers', require('./routes/teacherRoutes')); // Create this route similarly
app.use('/api/users', require('./routes/userRoutes'));       // Create this route similarly
app.use('/api/classes', require('./routes/classRoutes'));     // Get classes & Add questions

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server flying on port ${PORT}`));