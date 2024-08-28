const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const listRoutes = require('./routes/listRoutes');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const MongoStore = require('connect-mongo');
dotenv.config();

connectDB();

const app = express();

// CORS configuration
const corsOptions = {
    origin: `${process.env.REACT_APP_FRONTEND_URL}`,  // Replace with your frontend URL
    credentials: true,  // Enable cookies to be sent across domains
};

app.use(cors(corsOptions));
app.use(cookieParser());

// Session middleware
app.use(session({
    secret: 'your-secret-key',  // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },  // Set to true if using HTTPS
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,  // Your MongoDB connection string
        collectionName: 'sessions',  // Name of the collection to store sessions
        ttl: 60 * 60,  // Session lifetime in seconds (14 days)
    }),
}));

app.use(express.json());

app.use((req, res, next) => {
    if (req.session) {
        console.log('Session ID:', req.sessionID);
        console.log('Session Data:', req.session);
    }
    next();
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define your routes
app.use('/api/users', userRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
