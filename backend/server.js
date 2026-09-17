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

// Produce Catalog Demo Data
const produceCatalog = [
  {
    id: 'prod_01',
    name: 'Organic Durum Wheat',
    category: 'Grains',
    grade: 'A+',
    qualityScore: 99.4,
    origin: 'Green Valley Farms, KS',
    farmer: 'John Farmer',
    quantity: '450 Metric Tons',
    pricePerTon: '$340',
    status: 'Verified & Available',
    harvestDate: '2026-08-28',
    moisture: '11.8%',
    pesticideFree: true
  },
  {
    id: 'prod_02',
    name: 'Arabica Coffee Beans',
    category: 'Specialty',
    grade: 'AAA',
    qualityScore: 98.9,
    origin: 'Highland Estate, Rift Valley',
    farmer: 'Samuel K.',
    quantity: '120 Metric Tons',
    pricePerTon: '$1,850',
    status: 'In Transit',
    harvestDate: '2026-09-02',
    moisture: '10.5%',
    pesticideFree: true
  },
  {
    id: 'prod_03',
    name: 'Hass Avocados',
    category: 'Fruits',
    grade: 'A',
    qualityScore: 96.8,
    origin: 'SunRidge Orchards',
    farmer: 'Maria Lopez',
    quantity: '85 Metric Tons',
    pricePerTon: '$1,200',
    status: 'Quality Passed',
    harvestDate: '2026-09-05',
    moisture: '68.0%',
    pesticideFree: true
  },
  {
    id: 'prod_04',
    name: 'Long-Staple Premium Cotton',
    category: 'Fiber',
    grade: 'AAA',
    qualityScore: 99.1,
    origin: 'Delta Cooperative',
    farmer: 'John Farmer',
    quantity: '300 Metric Tons',
    pricePerTon: '$890',
    status: 'Verified & Available',
    harvestDate: '2026-08-15',
    moisture: '7.2%',
    pesticideFree: true
  }
];

// Dashboard Summary Stats Endpoint
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      totalProduceTons: '1,420 MT',
      verifiedQualityRate: '99.4%',
      activeShipments: 18,
      escrowSettled: '$4,280,500',
      activeContracts: 24,
      iotNodesOnline: 142
    }
  });
});

// Produce Catalog Endpoint
app.get('/api/produce', (req, res) => {
  res.json({
    success: true,
    count: produceCatalog.length,
    produce: produceCatalog
  });
});

// Contracts Endpoint
app.get('/api/contracts', (req, res) => {
  res.json({
    success: true,
    contracts: [
      { id: 'CTR-8841', buyer: 'Global Buyer Inc.', seller: 'John Farmer', item: 'Organic Durum Wheat', value: '$153,000', status: 'In Escrow', date: '2026-09-10' },
      { id: 'CTR-8839', buyer: 'AgriCorp Roasters', seller: 'Samuel K.', item: 'Arabica Coffee Beans', value: '$222,000', status: 'Settled', date: '2026-09-08' },
      { id: 'CTR-8835', buyer: 'FreshMarket Co.', seller: 'Maria Lopez', item: 'Hass Avocados', value: '$102,000', status: 'Delivered', date: '2026-09-04' }
    ]
  });
});

// Start Express Server
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`🌾 AgriTrade API Server Running  `);
    console.log(`📡 Listening on: http://localhost:${PORT} `);
    console.log(`=================================`);
  });

  process.on('SIGINT', () => {
    server.close(() => {
      console.log('Server process terminated.');
      process.exit(0);
    });
  });
}

module.exports = app;
