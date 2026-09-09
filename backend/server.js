const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins (frontend communication)
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

// Optional MongoDB Connection with Graceful Fallback
let isMongoConnected = false;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/agritrade';

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => {
    isMongoConnected = true;
    console.log('🍃 Connected to MongoDB Database');
  })
  .catch((err) => {
    isMongoConnected = false;
    console.log('⚠️ MongoDB not detected running locally. Using in-memory store for seamless experience.');
  });

// Demo Role Accounts
const demoUsers = [
  { id: '1', role: 'admin', name: 'System Admin', email: 'admin@agritrade.com' },
  { id: '2', role: 'farmer', name: 'John Farmer', email: 'farmer@agritrade.com' },
  { id: '3', role: 'collection_manager', name: 'Sarah Collection', email: 'collection@agritrade.com' },
  { id: '4', role: 'inspector', name: 'David Inspector', email: 'inspector@agritrade.com' },
  { id: '5', role: 'buyer', name: 'Global Buyer Inc.', email: 'buyer@agritrade.com' },
  { id: '6', role: 'logistics', name: 'Express Freight', email: 'logistics@agritrade.com' }
];

// Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'AgriTrade Backend API',
    version: '1.0.0',
    mongoStatus: isMongoConnected ? 'connected' : 'in-memory fallback',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isMongoConnected ? 'MongoDB Connected' : 'In-Memory Demo Active'
  });
});

// Login Endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required'
    });
  }

  const user = demoUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || {
    id: 'user_' + Date.now(),
    role: role || 'user',
    name: email.split('@')[0],
    email: email
  };

  // Set HTTP-only Cookie simulation header
  res.cookie('agritrade_session', 'mock_jwt_token_' + Date.now(), {
    httpOnly: true,
    secure: false, // set true in HTTPS production
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  });

  console.log(`[LOGIN] User ${email} authenticated successfully.`);

  return res.json({
    success: true,
    message: `Welcome back to AgriTrade, ${user.name}!`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.agritrade_session_' + Date.now()
  });
});

// Biometric Auth Endpoint
app.post('/api/auth/biometric', (req, res) => {
  console.log('[BIOMETRIC] Biometric verification requested.');
  return res.json({
    success: true,
    message: 'Biometric verification passed!',
    user: demoUsers[1] // Default to farmer role
  });
});

// Get Roles Endpoint
app.get('/api/roles', (req, res) => {
  res.json({ success: true, roles: demoUsers });
});

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🌾 AgriTrade API Server Running  `);
  console.log(`📡 Listening on: http://localhost:${PORT} `);
  console.log(`=================================`);
});

// Keep-alive handle for smooth operation
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server process terminated.');
    process.exit(0);
  });
});
