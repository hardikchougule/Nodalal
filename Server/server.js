// server/server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const roomRoutes = require('./routes/room.routes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// --- CORRECT MIDDLEWARE ORDER ---

// 1. Enable CORS for all incoming requests
app.use(cors());

// 2. Enable the server to parse JSON data. THIS MUST COME BEFORE THE ROUTES.
app.use(express.json());

// 3. Now, define the routes. The request body will be parsed by this point.
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

// --- DATABASE CONNECTION ---
const uri = process.env.MONGO_URI;
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// --- START THE SERVER ---
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});