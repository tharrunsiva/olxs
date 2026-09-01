const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const requestRoutes = require('./routes/requestRoutes');

const app = express();

// ================================
// Middleware
// ================================

app.use(cors({
origin: true,
credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================================
// Serve Uploaded Images
// ================================

app.use(
'/uploads',
express.static(path.join(__dirname, 'uploads'))
);

// ================================
// API Routes
// ================================

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/requests', requestRoutes);

// ================================
// Health Check
// ================================

app.get('/health', (req, res) => {
res.status(200).json({
status: 'OK',
message: 'ReLoop backend is healthy.'
});
});

// ================================
// Root Route
// ================================

app.get('/', (req, res) => {
res.status(200).json({
status: 'OK',
message: 'ReLoop Backend API is running.'
});
});

// ================================
// MongoDB Connection
// ================================

const MONGO_URI =
process.env.MONGO_URI || 'mongodb://mongo:27017/reloop';

const connectDB = async () => {
  console.log('Connecting to MongoDB...');

  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    console.log('Retrying MongoDB connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// ================================
// Start Server
// ================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
console.log(`ReLoop backend is running on port ${PORT}`);
});
