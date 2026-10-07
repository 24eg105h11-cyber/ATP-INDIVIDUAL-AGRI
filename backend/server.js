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

// Register Endpoint
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, organization, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Name, email, and password are required fields.'
    });
  }

  const existing = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({
      success: false,
      error: 'An account with this email already exists.'
    });
  }

  const newUser = {
    id: 'user_' + Date.now(),
    name,
    email,
    role: role || 'farmer',
    organization: organization || '',
    phone: phone || ''
  };

  demoUsers.push(newUser);
  console.log(`[REGISTER] New account created: ${name} (${email}, role: ${role})`);

  res.cookie('agritrade_session', 'mock_jwt_token_' + Date.now(), {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  });

  return res.status(201).json({
    success: true,
    message: `Account created successfully! Welcome to AgriTrade, ${name}.`,
    user: newUser,
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
    pricePerTon: '₹28,500',
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
    pricePerTon: '₹1,55,000',
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
    pricePerTon: '₹98,000',
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
    pricePerTon: '₹72,000',
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
      escrowSettled: '₹3,54,00,000',
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

// Shipment Schema for MongoDB
const shipmentSchema = new mongoose.Schema({
  shipmentId: { type: String, required: true, unique: true, index: true },
  farmerId: { type: String, required: true, index: true },
  farmerName: { type: String, default: 'John Farmer' },
  productId: { type: String },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'KG' },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  transporter: { type: String, required: true },
  expectedDelivery: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Created', 'Picked Up', 'In Transit', 'At Distribution Center', 'Out for Delivery', 'Delivered'],
    default: 'Created',
    index: true
  },
  qrToken: { type: String, required: true, unique: true, index: true },
  trackingHistory: [
    {
      status: String,
      location: String,
      description: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

const Shipment = mongoose.models.Shipment || mongoose.model('Shipment', shipmentSchema);

// Initial Seed / In-Memory Store for Shipments
let inMemoryShipments = [
  {
    _id: 'shp_001',
    shipmentId: 'SHP-2026-00125',
    farmerId: '2',
    farmerName: 'John Farmer',
    productName: 'Organic Durum Wheat',
    quantity: 500,
    unit: 'Metric Tons',
    origin: 'Hyderabad, TS',
    destination: 'Mumbai, MH',
    transporter: 'AgriExpress Logistics',
    expectedDelivery: new Date('2026-10-12'),
    status: 'In Transit',
    qrToken: 'qr_token_shp_2026_00125',
    trackingHistory: [
      { status: 'Created', location: 'Hyderabad Farm', description: 'Harvest batch registered & QR generated.', timestamp: new Date('2026-10-01T08:30:00Z') },
      { status: 'Picked Up', location: 'Hyderabad Central Logistics Hub', description: 'Produce loaded onto GPS-monitored refrigerated vehicle.', timestamp: new Date('2026-10-02T10:15:00Z') },
      { status: 'In Transit', location: 'Solapur NH-65 Checkpoint', description: 'IoT sensor reporting optimal moisture and 18°C cargo temp.', timestamp: new Date('2026-10-04T14:45:00Z') }
    ],
    createdAt: new Date('2026-10-01T08:30:00Z'),
    updatedAt: new Date('2026-10-04T14:45:00Z')
  },
  {
    _id: 'shp_002',
    shipmentId: 'SHP-2026-00126',
    farmerId: '2',
    farmerName: 'John Farmer',
    productName: 'Arabica Coffee Beans',
    quantity: 120,
    unit: 'Metric Tons',
    origin: 'Coorg, KA',
    destination: 'Bengaluru Port, KA',
    transporter: 'SouthAgri Freight',
    expectedDelivery: new Date('2026-10-09'),
    status: 'Picked Up',
    qrToken: 'qr_token_shp_2026_00126',
    trackingHistory: [
      { status: 'Created', location: 'Highland Estate, Coorg', description: 'Sacks sealed and AAA grade verification attached.', timestamp: new Date('2026-10-03T09:00:00Z') },
      { status: 'Picked Up', location: 'Coorg Collection Depot', description: 'Transporter scanned QR and assumed chain of custody.', timestamp: new Date('2026-10-04T11:20:00Z') }
    ],
    createdAt: new Date('2026-10-03T09:00:00Z'),
    updatedAt: new Date('2026-10-04T11:20:00Z')
  },
  {
    _id: 'shp_003',
    shipmentId: 'SHP-2026-00127',
    farmerId: '2',
    farmerName: 'John Farmer',
    productName: 'Hass Avocados',
    quantity: 85,
    unit: 'Metric Tons',
    origin: 'Nashik, MH',
    destination: 'Delhi Cold Storage, DL',
    transporter: 'ColdChain Transport',
    expectedDelivery: new Date('2026-10-06'),
    status: 'Delivered',
    qrToken: 'qr_token_shp_2026_00127',
    trackingHistory: [
      { status: 'Created', location: 'Nashik Orchard', description: 'Batch created.', timestamp: new Date('2026-09-28T07:00:00Z') },
      { status: 'Picked Up', location: 'Nashik Hub', description: 'Cargo picked up.', timestamp: new Date('2026-09-29T10:00:00Z') },
      { status: 'In Transit', location: 'Indore Expressway', description: 'En route north.', timestamp: new Date('2026-09-30T16:00:00Z') },
      { status: 'At Distribution Center', location: 'Delhi Central Logistics Center', description: 'Arrived at distribution hub.', timestamp: new Date('2026-10-02T05:00:00Z') },
      { status: 'Out for Delivery', location: 'Delhi Metro Fleet', description: 'Dispatched for final mile delivery.', timestamp: new Date('2026-10-03T08:00:00Z') },
      { status: 'Delivered', location: 'Delhi FreshMarket Warehouse', description: 'Recipient verified QR and signed escrow release.', timestamp: new Date('2026-10-04T12:00:00Z') }
    ],
    createdAt: new Date('2026-09-28T07:00:00Z'),
    updatedAt: new Date('2026-10-04T12:00:00Z')
  },
  {
    _id: 'shp_004',
    shipmentId: 'SHP-2026-00128',
    farmerId: '2',
    farmerName: 'John Farmer',
    productName: 'Long-Staple Premium Cotton',
    quantity: 300,
    unit: 'Metric Tons',
    origin: 'Guntur, AP',
    destination: 'Ahmedabad Textile Hub, GJ',
    transporter: 'Deccan Cargo',
    expectedDelivery: new Date('2026-10-15'),
    status: 'Created',
    qrToken: 'qr_token_shp_2026_00128',
    trackingHistory: [
      { status: 'Created', location: 'Guntur Processing Depot', description: 'Shipment created and awaiting driver dispatch.', timestamp: new Date('2026-10-05T14:00:00Z') }
    ],
    createdAt: new Date('2026-10-05T14:00:00Z'),
    updatedAt: new Date('2026-10-05T14:00:00Z')
  }
];

// Helper to sync seed data to MongoDB if connected
async function seedMongoShipments() {
  if (isMongoConnected) {
    try {
      const count = await Shipment.countDocuments();
      if (count === 0) {
        await Shipment.insertMany(inMemoryShipments);
        console.log('📦 Seeded initial shipments to MongoDB');
      }
    } catch (e) {
      console.warn('Mongo shipment seed error:', e.message);
    }
  }
}
setTimeout(seedMongoShipments, 3000);

// Contracts Endpoint
app.get('/api/contracts', (req, res) => {
  res.json({
    success: true,
    contracts: [
      { id: 'CTR-8841', buyer: 'Global Buyer Inc.', seller: 'John Farmer', item: 'Organic Durum Wheat', value: '₹1,28,25,000', status: 'In Escrow', date: '2026-09-10' },
      { id: 'CTR-8839', buyer: 'AgriCorp Roasters', seller: 'Samuel K.', item: 'Arabica Coffee Beans', value: '₹1,86,00,000', status: 'Settled', date: '2026-09-08' },
      { id: 'CTR-8835', buyer: 'FreshMarket Co.', seller: 'Maria Lopez', item: 'Hass Avocados', value: '₹83,30,000', status: 'Delivered', date: '2026-09-04' }
    ]
  });
});

// ==========================================
// SHIPMENT REST API ENDPOINTS
// ==========================================

// GET /api/shipments - Fetch all shipments
app.get('/api/shipments', async (req, res) => {
  try {
    let shipments = [];
    if (isMongoConnected) {
      shipments = await Shipment.find().sort({ createdAt: -1 });
    } else {
      shipments = [...inMemoryShipments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    res.json({ success: true, count: shipments.length, shipments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/shipments/farmer/:farmerId - Fetch shipments for a specific farmer
app.get('/api/shipments/farmer/:farmerId', async (req, res) => {
  try {
    const { farmerId } = req.params;
    let shipments = [];
    if (isMongoConnected) {
      shipments = await Shipment.find({ farmerId }).sort({ createdAt: -1 });
    } else {
      shipments = inMemoryShipments.filter(s => s.farmerId === farmerId || farmerId === '2' || farmerId === 'all')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    res.json({ success: true, count: shipments.length, shipments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/shipments - Create a new shipment with QR Token & Initial History
app.post('/api/shipments', async (req, res) => {
  try {
    const {
      productName,
      quantity,
      unit,
      origin,
      destination,
      transporter,
      expectedDelivery,
      farmerId,
      farmerName
    } = req.body;

    if (!productName || !quantity || !origin || !destination || !transporter) {
      return res.status(400).json({
        success: false,
        error: 'Product, quantity, origin, destination, and transporter are required fields.'
      });
    }

    const uniqueNum = Math.floor(10000 + Math.random() * 90000);
    const shipmentId = `SHP-2026-${uniqueNum}`;
    const qrToken = `token_shp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const now = new Date();

    const initialHistory = [{
      status: 'Created',
      location: origin,
      description: `Shipment created by ${farmerName || 'John Farmer'}. QR token generated.`,
      timestamp: now
    }];

    const shipmentData = {
      shipmentId,
      farmerId: farmerId || '2',
      farmerName: farmerName || 'John Farmer',
      productName,
      quantity: Number(quantity),
      unit: unit || 'KG',
      origin,
      destination,
      transporter,
      expectedDelivery: expectedDelivery ? new Date(expectedDelivery) : new Date(Date.now() + 7 * 86400000),
      status: 'Created',
      qrToken,
      trackingHistory: initialHistory,
      createdAt: now,
      updatedAt: now
    };

    let newShipment;
    if (isMongoConnected) {
      newShipment = new Shipment(shipmentData);
      await newShipment.save();
    } else {
      newShipment = { _id: 'shp_' + Date.now(), ...shipmentData };
      inMemoryShipments.unshift(newShipment);
    }

    console.log(`[SHIPMENT CREATED] ${shipmentId} (QR Token: ${qrToken})`);

    return res.status(201).json({
      success: true,
      message: 'Shipment created successfully!',
      shipment: newShipment
    });
  } catch (err) {
    console.error('Create shipment error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/shipments/:shipmentId - Get shipment by shipmentId OR qrToken
app.get('/api/shipments/:shipmentId', async (req, res) => {
  try {
    const { shipmentId } = req.params;
    let shipment = null;

    if (isMongoConnected) {
      shipment = await Shipment.findOne({
        $or: [{ shipmentId: shipmentId }, { qrToken: shipmentId }]
      });
    } else {
      shipment = inMemoryShipments.find(
        s => s.shipmentId === shipmentId || s.qrToken === shipmentId || s._id === shipmentId
      );
    }

    if (!shipment) {
      return res.status(404).json({
        success: false,
        error: `Shipment '${shipmentId}' not found.`
      });
    }

    res.json({ success: true, shipment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/shipments/:shipmentId/track - Public/Internal tracking endpoint
app.get('/api/shipments/:shipmentId/track', async (req, res) => {
  try {
    const { shipmentId } = req.params;
    let shipment = null;

    if (isMongoConnected) {
      shipment = await Shipment.findOne({
        $or: [{ shipmentId: shipmentId }, { qrToken: shipmentId }]
      });
    } else {
      shipment = inMemoryShipments.find(
        s => s.shipmentId === shipmentId || s.qrToken === shipmentId || s._id === shipmentId
      );
    }

    if (!shipment) {
      return res.status(404).json({
        success: false,
        error: `Shipment record '${shipmentId}' not found.`
      });
    }

    res.json({
      success: true,
      shipmentId: shipment.shipmentId,
      productName: shipment.productName,
      quantity: shipment.quantity,
      unit: shipment.unit,
      origin: shipment.origin,
      destination: shipment.destination,
      transporter: shipment.transporter,
      expectedDelivery: shipment.expectedDelivery,
      status: shipment.status,
      qrToken: shipment.qrToken,
      trackingHistory: shipment.trackingHistory,
      updatedAt: shipment.updatedAt
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/shipments/:shipmentId/qr - Get QR payload & token info
app.get('/api/shipments/:shipmentId/qr', async (req, res) => {
  try {
    const { shipmentId } = req.params;
    let shipment = null;

    if (isMongoConnected) {
      shipment = await Shipment.findOne({
        $or: [{ shipmentId: shipmentId }, { qrToken: shipmentId }]
      });
    } else {
      shipment = inMemoryShipments.find(
        s => s.shipmentId === shipmentId || s.qrToken === shipmentId
      );
    }

    if (!shipment) {
      return res.status(404).json({ success: false, error: 'Shipment not found' });
    }

    const host = req.get('host') || 'localhost:5173';
    const protocol = req.protocol || 'http';
    const trackingUrl = `${protocol}://${host}/track/${shipment.qrToken}`;

    res.json({
      success: true,
      shipmentId: shipment.shipmentId,
      qrToken: shipment.qrToken,
      trackingUrl,
      status: shipment.status
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/shipments/:shipmentId/status - Update status and append tracking history
app.patch('/api/shipments/:shipmentId/status', async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const { status, location, description } = req.body;

    const validStatuses = ['Created', 'Picked Up', 'In Transit', 'At Distribution Center', 'Out for Delivery', 'Delivered'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const now = new Date();
    const newEvent = {
      status,
      location: location || 'Transit Checkpoint',
      description: description || `Status updated to ${status}.`,
      timestamp: now
    };

    let updatedShipment = null;

    if (isMongoConnected) {
      updatedShipment = await Shipment.findOneAndUpdate(
        { $or: [{ shipmentId: shipmentId }, { qrToken: shipmentId }] },
        {
          $set: { status, updatedAt: now },
          $push: { trackingHistory: newEvent }
        },
        { new: true }
      );
    } else {
      const index = inMemoryShipments.findIndex(
        s => s.shipmentId === shipmentId || s.qrToken === shipmentId
      );
      if (index !== -1) {
        inMemoryShipments[index].status = status;
        inMemoryShipments[index].updatedAt = now;
        inMemoryShipments[index].trackingHistory.push(newEvent);
        updatedShipment = inMemoryShipments[index];
      }
    }

    if (!updatedShipment) {
      return res.status(404).json({ success: false, error: 'Shipment not found' });
    }

    console.log(`[STATUS UPDATED] Shipment ${shipmentId} -> ${status}`);

    res.json({
      success: true,
      message: `Shipment status updated to '${status}'.`,
      shipment: updatedShipment
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
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
