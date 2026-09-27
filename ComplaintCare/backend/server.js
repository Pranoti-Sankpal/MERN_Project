// ============================================================
// ComplaintCare backend entry point
// React + Node.js + Express.js + MySQL full-stack application
// ============================================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { testConnection } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// ------------------------------------------------------------
// Core middleware
// ------------------------------------------------------------
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------------------------------------------
// Health check
// ------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'ComplaintCare API is running.' });
});

// ------------------------------------------------------------
// Routes
// ------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ------------------------------------------------------------
// 404 + centralized error handling
// ------------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`ComplaintCare API listening on http://localhost:${PORT}`);
  });
}

start();

module.exports = app;
