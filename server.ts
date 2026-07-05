import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Ensure Gemini API key is configured
const apiKey = process.env.GEMINI_API_KEY || '';
if (!apiKey) {
  console.warn('WARNING: GEMINI_API_KEY environment variable is missing.');
}

// Initialize GoogleGenAI SDK
const ai = new GoogleGenAI({
  apiKey: apiKey || 'dummy-gemini-api-key-for-demo',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = 3000;
const STORE_PATH = path.join(process.cwd(), 'data-store.json');
const TMP_STORE_PATH = path.join('/tmp', 'data-store.json');

// --- INITIAL DATASETS ---

const INITIAL_FACILITIES = [
  {
    id: 'SC-1',
    name: 'SubCenter Bhadrak',
    type: 'SubCenter',
    distanceKm: 2,
    coordinates: { lat: 20.8985, lng: 86.5123 },
    equipment: ['Digital Thermometer', 'Automated BP Monitor', 'Rapid Malaria Kits', 'Glucometer', 'First Aid Kit', 'Basic Oxygen Concentrator'],
    specializedStaff: ['ANM Srimati Lata (Auxiliary Nurse)', 'Community Health Officer (CHO)'],
    bedCapacity: { total: 5, occupied: 3 },
    activeDoctors: 1,
    status: 'FULL_OPERATIONAL',
    contactNo: '+91 6784-250101'
  },
  {
    id: 'SC-2',
    name: 'SubCenter Dhamnagar',
    type: 'SubCenter',
    distanceKm: 15,
    coordinates: { lat: 20.8124, lng: 86.4356 },
    equipment: ['Manual BP Cuff', 'Digital Thermometer', 'Rapid Diagnostic Kits', 'Nebulizer'],
    specializedStaff: ['ANM Gita Rani (Auxiliary Nurse)'],
    bedCapacity: { total: 2, occupied: 2 },
    activeDoctors: 0,
    status: 'LIMITED_SERVICE',
    contactNo: '+91 6784-250102'
  },
  {
    id: 'CHC-1',
    name: 'Community Health Center (CHC) Dhamnagar',
    type: 'CHC',
    distanceKm: 11,
    coordinates: { lat: 20.8190, lng: 86.4420 },
    equipment: ['Active Ultrasound Unit', 'Maternity Labor Room Suite', 'Semi-Auto Biochem Analyzer', '20L Oxygen Concentrators', 'Infant Warmer', 'X-Ray Machine'],
    specializedStaff: ['Gynecologist (Dr. A. K. Sahoo)', 'Pediatrician (Dr. R. K. Patra)', 'General Physician (Dr. B. Das)', 'Staff Nurses (4)'],
    bedCapacity: { total: 30, occupied: 18 },
    activeDoctors: 3,
    status: 'FULL_OPERATIONAL',
    contactNo: '+91 6784-253450'
  },
  {
    id: 'DH-1',
    name: 'District Hospital Bhadrak',
    type: 'DistrictHospital',
    distanceKm: 22,
    coordinates: { lat: 20.9022, lng: 86.5215 },
    equipment: ['Cardiac Care ICU (CCU)', 'Pediatric ICU (PICU)', 'Fully Equipped Blood Bank', '3D Ultrasound & MRI Scan', 'Advanced Ventilators', 'Trauma Surgical Theatre'],
    specializedStaff: ['Chief Cardiologist (Dr. S. Mohanty)', 'Senior Obstetrician (Dr. M. Nayak)', 'Emergency Medicine Specialist', 'Anesthetists (2)', 'Specialist Surgeons (3)', 'ICU Nurses (12)'],
    bedCapacity: { total: 200, occupied: 142 },
    activeDoctors: 18,
    status: 'CRITICAL_LOAD',
    contactNo: '+91 6784-261200'
  }
];

const INITIAL_LOGS = [
  {
    id: 'LOG-1',
    workerId: 'ASHA_ID-401',
    workerName: 'Rashmi Prava Mallick',
    locationNode: 'SubCenter Bhadrak',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'ACTIVE',
    notes: 'Checked blood pressure for elderly patient at SC-1. BP 130/85. Advised reduced salt intake.',
    geofenceVerified: true
  },
  {
    id: 'LOG-2',
    workerId: 'ASHA_ID-402',
    workerName: 'Subhasini Sahu',
    locationNode: 'SubCenter Dhamnagar',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'ACTIVE',
    notes: 'Conducted home visits in Dhamnagar outer ward. Met with young mother to advise on newborn vaccination timelines.',
    geofenceVerified: true
  }
];

const INITIAL_TRIAGE_RECORDS = [
  {
    id: 'TRI-1',
    patientAge: 28,
    patientGender: 'F',
    pregnancyStatus: 'YES',
    symptoms: 'Patient is at 32 weeks gestation, reporting persistent lower abdominal cramping and mild vaginal spotting. Vitals are elevated.',
    vitals: {
      pulse: 98,
      temp: 99.1,
      bloodPressure: '135/88',
      respiratoryRate: 20,
      oxygenSat: 98
    },
    category: 'HIGH',
    clinicalReasoning: 'Maternal spotting at 32 weeks is a significant preterm labor threat. Combined with elevated BP and pulse, this requires immediate fetal and maternal monitoring.',
    recommendedAction: 'Prepare for immediate transport to CHC Dhamnagar. Advise patient to remain left-lateral recumbent during transit. Maintain vitals log.',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    allocatedFacilityId: 'CHC-1',
    isSyncedToFirebase: true
  }
];

const INITIAL_ANOMALIES = [
  {
    id: 'ANOM-1',
    logId: 'LOG-2',
    workerId: 'ASHA_ID-402',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    anomalyType: 'SPATIAL_DISCREPANCY',
    severity: 'WARNING',
    description: 'Check-in registered at SubCenter Dhamnagar, but activities description states worker spent the entire shift at Jamujhadi village (12km away) without active commute logs.',
    resolved: false
  }
];

const INITIAL_ALERTS = [
  {
    id: 'ALERT-1',
    triageId: 'TRI-1',
    workerId: 'ASHA_ID-402',
    locationNode: 'SubCenter Dhamnagar',
    patientBrief: '28F, 32W Pregnant, severe abdominal cramping + spotting.',
    category: 'HIGH',
    nearestFacilityId: 'CHC-1',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    status: 'ACKNOWLEDGED'
  }
];

// --- MODULE-SPECIFIC INITIAL DATASETS ---

const INITIAL_INVENTORY = [
  // SubCenter Bhadrak (SC-1)
  { id: 'inv-1', facilityId: 'SC-1', name: 'Paracetamol 500mg', category: 'essential', currentStock: 0, minimumThreshold: 50, maximumThreshold: 500, unit: 'tablets', batchNumber: 'P-9982', expiryDate: '2026-08-15', supplier: 'Kalinga Med Distrib', lastRestocked: '2026-06-01' },
  { id: 'inv-2', facilityId: 'SC-1', name: 'Amoxicillin 250mg', category: 'critical', currentStock: 5, minimumThreshold: 20, maximumThreshold: 200, unit: 'capsules', batchNumber: 'A-1082', expiryDate: '2026-11-20', supplier: 'Utkal Pharma Ltd', lastRestocked: '2026-05-15' },
  { id: 'inv-3', facilityId: 'SC-1', name: 'ORS Packets', category: 'essential', currentStock: 10, minimumThreshold: 30, maximumThreshold: 300, unit: 'packets', batchNumber: 'O-2021', expiryDate: '2026-07-20', supplier: 'National Health Depot', lastRestocked: '2026-06-10' },
  { id: 'inv-4', facilityId: 'SC-1', name: 'Sterile Gloves (Size 7)', category: 'general', currentStock: 200, minimumThreshold: 100, maximumThreshold: 1000, unit: 'vials', batchNumber: 'G-8811', expiryDate: '2027-01-10', supplier: 'SurgeTech Supplies', lastRestocked: '2026-06-15' },
  { id: 'inv-5', facilityId: 'SC-1', name: 'Disposable Syringes 5ml', category: 'general', currentStock: 150, minimumThreshold: 50, maximumThreshold: 500, unit: 'tablets', batchNumber: 'S-7762', expiryDate: '2026-12-01', supplier: 'SurgeTech Supplies', lastRestocked: '2026-06-15' },
  { id: 'inv-6', facilityId: 'SC-1', name: 'Normal Saline (IV 500ml)', category: 'essential', currentStock: 30, minimumThreshold: 20, maximumThreshold: 100, unit: 'bottles', batchNumber: 'NS-921', expiryDate: '2026-09-01', supplier: 'Kalinga Med Distrib', lastRestocked: '2026-05-20' },
  
  // SubCenter Dhamnagar (SC-2)
  { id: 'inv-7', facilityId: 'SC-2', name: 'Paracetamol 500mg', category: 'essential', currentStock: 450, minimumThreshold: 50, maximumThreshold: 500, unit: 'tablets', batchNumber: 'P-9982', expiryDate: '2026-08-15', supplier: 'Kalinga Med Distrib', lastRestocked: '2026-06-01' },
  { id: 'inv-8', facilityId: 'SC-2', name: 'ORS Packets', category: 'essential', currentStock: 250, minimumThreshold: 30, maximumThreshold: 300, unit: 'packets', batchNumber: 'O-2021', expiryDate: '2026-07-20', supplier: 'National Health Depot', lastRestocked: '2026-06-10' }
];

const INITIAL_PATIENTS = [
  { id: 'pat-1', facilityId: 'SC-1', name: 'Ram Sahoo', age: 42, gender: 'M', contact: '+91 94371-29182', department: 'general', visitType: 'OPD', triagePriority: 'routine', registrationTime: new Date(Date.now() - 3600000).toISOString(), status: 'with_doctor' },
  { id: 'pat-2', facilityId: 'SC-1', name: 'Priya Mishra', age: 24, gender: 'F', contact: '+91 98610-82731', department: 'gynecology', visitType: 'OPD', triagePriority: 'urgent', registrationTime: new Date(Date.now() - 1800000).toISOString(), status: 'waiting' },
  { id: 'pat-3', facilityId: 'SC-1', name: 'Amit Kumar', age: 8, gender: 'Other', contact: '+91 99388-12938', department: 'pediatrics', visitType: 'OPD', triagePriority: 'routine', registrationTime: new Date(Date.now() - 900000).toISOString(), status: 'waiting' }
];

const INITIAL_BEDS = [
  // SubCenter Bhadrak (SC-1)
  { id: 'bed-1', facilityId: 'SC-1', department: 'general', bedNumber: 'G-101', status: 'occupied', occupiedBy: 'Harish Chandra Jena', occupiedSince: new Date(Date.now() - 86400000 * 2).toISOString(), expectedDischarge: new Date(Date.now() + 86400000).toISOString() },
  { id: 'bed-2', facilityId: 'SC-1', department: 'general', bedNumber: 'G-102', status: 'occupied', occupiedBy: 'Minati Mahapatra', occupiedSince: new Date(Date.now() - 86400000).toISOString(), expectedDischarge: new Date(Date.now() + 86400000 * 2).toISOString() },
  { id: 'bed-3', facilityId: 'SC-1', department: 'maternity', bedNumber: 'M-201', status: 'occupied', occupiedBy: 'Saraswati Mohanty', occupiedSince: new Date(Date.now() - 3600000 * 4).toISOString(), expectedDischarge: new Date(Date.now() + 86400000 * 3).toISOString() },
  { id: 'bed-4', facilityId: 'SC-1', department: 'maternity', bedNumber: 'M-202', status: 'available' },
  { id: 'bed-5', facilityId: 'SC-1', department: 'pediatric', bedNumber: 'P-301', status: 'available' },

  // SubCenter Dhamnagar (SC-2)
  { id: 'bed-6', facilityId: 'SC-2', department: 'general', bedNumber: 'DG-101', status: 'occupied', occupiedBy: 'Ganesh Sahoo', occupiedSince: new Date(Date.now() - 86400000).toISOString() },
  { id: 'bed-7', facilityId: 'SC-2', department: 'general', bedNumber: 'DG-102', status: 'occupied', occupiedBy: 'Niranjan Barik', occupiedSince: new Date().toISOString() }
];

const INITIAL_DOCTORS = [
  { id: 'doc-1', name: 'Dr. Ramesh Sharma', department: 'general', facilityId: 'SC-1', specialization: 'General Medicine', contact: '+91 94372-88121', workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
  { id: 'doc-2', name: 'Dr. Anita Gupta', department: 'gynecology', facilityId: 'CHC-1', specialization: 'Maternal Care / OBGYN', contact: '+91 99371-22918', workingDays: ['monday', 'wednesday', 'friday'] },
  { id: 'doc-3', name: 'Dr. Rabindra Reddy', department: 'pediatrics', facilityId: 'CHC-1', specialization: 'Neonatology / Child Specialist', contact: '+91 98610-33291', workingDays: ['tuesday', 'thursday', 'saturday'] },
  { id: 'doc-4', name: 'Dr. Bikram Singh', department: 'surgery', facilityId: 'DH-1', specialization: 'Orthopedic Surgery', contact: '+91 99388-77182', workingDays: ['monday', 'wednesday', 'friday'] },
  { id: 'doc-5', name: 'Dr. Priyabrata Patel', department: 'dental', facilityId: 'SC-1', specialization: 'General Dentistry', contact: '+91 94379-11029', workingDays: ['tuesday', 'thursday'] }
];

const INITIAL_DOCTOR_ATTENDANCE = [
  { id: 'att-1', doctorId: 'doc-1', facilityId: 'SC-1', date: new Date().toISOString().split('T')[0], status: 'present', checkIn: new Date(Date.now() - 3600000 * 3).toISOString(), patientsSeen: 14 }
];

const INITIAL_LEAVE_REQUESTS = [
  { id: 'leave-1', doctorId: 'doc-5', doctorName: 'Dr. Priyabrata Patel', facilityId: 'SC-1', fromDate: new Date().toISOString().split('T')[0], toDate: new Date().toISOString().split('T')[0], reason: 'Dental equipment maintenance block', status: 'approved' }
];

const INITIAL_TESTS = [
  { id: 'test-1', facilityId: 'SC-1', name: 'Complete Blood Count (CBC)', category: 'Hematology', availability: 'available', turnaroundTime: '4 hours', equipmentStatus: 'operational', sampleCount: 2 },
  { id: 'test-2', facilityId: 'SC-1', name: 'Random Blood Sugar (RBS)', category: 'Biochemistry', availability: 'available', turnaroundTime: '30 mins', equipmentStatus: 'operational', sampleCount: 5 },
  { id: 'test-3', facilityId: 'SC-1', name: 'Electrocardiogram (ECG)', category: 'Cardiology', availability: 'unavailable', turnaroundTime: '1 hour', equipmentStatus: 'down', sampleCount: 0 },
  { id: 'test-4', facilityId: 'CHC-1', name: 'Ultrasound Pelvis', category: 'Radiology', availability: 'available', turnaroundTime: '2 hours', equipmentStatus: 'operational', sampleCount: 8 }
];

const INITIAL_LAB_SAMPLES = [
  { id: 'smpl-1', patientId: 'pat-1', patientName: 'Ram Sahoo', facilityId: 'SC-1', testId: 'test-2', testName: 'Random Blood Sugar (RBS)', collectedAt: new Date(Date.now() - 3600000).toISOString(), status: 'completed', result: '142 mg/dL (Post-prandial)' },
  { id: 'smpl-2', patientId: 'pat-2', patientName: 'Priya Mishra', facilityId: 'SC-1', testId: 'test-1', testName: 'Complete Blood Count (CBC)', collectedAt: new Date(Date.now() - 1800000).toISOString(), status: 'processing' }
];

const INITIAL_MOVEMENTS = [
  { id: 'mv-1', facilityId: 'SC-1', medicineId: 'inv-1', medicineName: 'Paracetamol 500mg', type: 'REMOVAL', quantity: -50, timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), notes: 'Issued to outpatient clinic' }
];

interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'Admin' | 'PHC-Staff' | 'ASHA-Worker';
}

const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-demo',
    name: 'Test Admin',
    email: 'admin@test.com',
    passwordHash: '$2b$10$noZ1PSfpjirfTmxBgMT/9.RwMEf/BA5tGvX6a8LYK0rI5jcyGAuT.', // test123456
    role: 'Admin'
  },
  {
    id: 'user-staff-demo',
    name: 'CHO Officer',
    email: 'cho@test.com',
    passwordHash: '$2b$10$noZ1PSfpjirfTmxBgMT/9.RwMEf/BA5tGvX6a8LYK0rI5jcyGAuT.',
    role: 'PHC-Staff'
  },
  {
    id: 'user-asha-demo',
    name: 'ASHA Worker',
    email: 'asha@test.com',
    passwordHash: '$2b$10$noZ1PSfpjirfTmxBgMT/9.RwMEf/BA5tGvX6a8LYK0rI5jcyGAuT.',
    role: 'ASHA-Worker'
  }
];

interface DataStore {
  facilities: typeof INITIAL_FACILITIES;
  logs: typeof INITIAL_LOGS;
  triageRecords: typeof INITIAL_TRIAGE_RECORDS;
  anomalies: typeof INITIAL_ANOMALIES;
  alerts: typeof INITIAL_ALERTS;
  
  // NEW TABLES
  inventory: typeof INITIAL_INVENTORY;
  patients: typeof INITIAL_PATIENTS;
  beds: typeof INITIAL_BEDS;
  doctors: typeof INITIAL_DOCTORS;
  doctorAttendance: typeof INITIAL_DOCTOR_ATTENDANCE;
  leaveRequests: typeof INITIAL_LEAVE_REQUESTS;
  tests: typeof INITIAL_TESTS;
  labSamples: typeof INITIAL_LAB_SAMPLES;
  movements: typeof INITIAL_MOVEMENTS;
  users: User[];
}

let cachedDB: DataStore | null = null;

// Load DB from file or initialize
function getDB(): DataStore {
  if (cachedDB) return cachedDB;
  try {
    const possiblePaths = [
      TMP_STORE_PATH,
      STORE_PATH,
      path.join(process.cwd(), 'data-store.json'),
      path.join(process.cwd(), '..', 'data-store.json'),
      path.resolve('data-store.json')
    ];
    const pathToRead = possiblePaths.find(p => fs.existsSync(p));
    if (pathToRead) {
      const data = fs.readFileSync(pathToRead, 'utf-8');
      const db = JSON.parse(data);
      // Ensure new tables are initialized if reading an older file
      if (!db.inventory) db.inventory = INITIAL_INVENTORY;
      if (!db.patients) db.patients = INITIAL_PATIENTS;
      if (!db.beds) db.beds = INITIAL_BEDS;
      if (!db.doctors) db.doctors = INITIAL_DOCTORS;
      if (!db.doctorAttendance) db.doctorAttendance = INITIAL_DOCTOR_ATTENDANCE;
      if (!db.leaveRequests) db.leaveRequests = INITIAL_LEAVE_REQUESTS;
      if (!db.tests) db.tests = INITIAL_TESTS;
      if (!db.labSamples) db.labSamples = INITIAL_LAB_SAMPLES;
      if (!db.movements) db.movements = INITIAL_MOVEMENTS;
      if (!db.users || db.users.length === 0) db.users = INITIAL_USERS;
      cachedDB = db;
      return db;
    }
  } catch (err) {
    console.error('Error reading DB, using defaults', err);
  }
  const defaultDB: DataStore = {
    facilities: INITIAL_FACILITIES,
    logs: INITIAL_LOGS,
    triageRecords: INITIAL_TRIAGE_RECORDS,
    anomalies: INITIAL_ANOMALIES,
    alerts: INITIAL_ALERTS,
    inventory: INITIAL_INVENTORY,
    patients: INITIAL_PATIENTS,
    beds: INITIAL_BEDS,
    doctors: INITIAL_DOCTORS,
    doctorAttendance: INITIAL_DOCTOR_ATTENDANCE,
    leaveRequests: INITIAL_LEAVE_REQUESTS,
    tests: INITIAL_TESTS,
    labSamples: INITIAL_LAB_SAMPLES,
    movements: INITIAL_MOVEMENTS,
    users: INITIAL_USERS
  };
  cachedDB = defaultDB;
  saveDB(defaultDB);
  return defaultDB;
}

function saveDB(db: DataStore) {
  cachedDB = db;
  try {
    if (process.env.VERCEL || process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV) {
      try { fs.writeFileSync(TMP_STORE_PATH, JSON.stringify(db, null, 2), 'utf-8'); } catch (e) {}
      return;
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB', err);
  }
}

// Ensure the DB exists
getDB();

// --- AUTH MIDDLEWARE (defined before routes) ---

const JWT_SECRET = process.env.JWT_SECRET || 'swasthyalink_dev_secret';
const IS_PROD = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

const DEMO_USER = {
  id: 'user-admin-demo',
  name: 'Dr. Karan Rathod (Demo Admin)',
  email: 'demo@swasthyalink.com',
  role: 'Admin'
};

const authenticate = (req: any, res: any, next: any) => {
  // 🔬 DEMO MODE: Bypass auth completely and attach demo admin user
  req.user = DEMO_USER;
  next();
};

const requireRole = (role: string) => (req: any, res: any, next: any) => {
  // 🔬 DEMO MODE: Allow all role checks
  next();
};

// --- AUTH ROUTES (public / demo mode) ---

app.post('/api/auth/register', async (req: any, res: any) => {
  res.status(201).json({ success: true, message: 'Registered (Demo Mode)', token: 'demo-token', user: DEMO_USER });
});

app.post('/api/auth/login', async (req: any, res: any) => {
  res.json({ success: true, message: 'Logged in (Demo Mode)', token: 'demo-token', user: DEMO_USER });
});

app.post('/api/auth/logout', (req: any, res: any) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

app.get('/api/auth/me', (req: any, res: any) => {
  res.json({ success: true, user: DEMO_USER });
});

// --- PROTECT ALL /api ROUTES EXCEPT /api/auth/* ---

app.use('/api', (req: any, res: any, next: any) => {
  req.user = DEMO_USER;
  next();
});

// --- API ENDPOINTS ---

// 1. Facilities
app.get('/api/facilities', (req: any, res: any) => {
  const db = getDB();
  res.json(db.facilities);
});

app.post('/api/facilities/:id/update-occupancy', (req, res) => {
  const { id } = req.params;
  const { occupied, status } = req.body;
  const db = getDB();
  const facility = db.facilities.find(f => f.id === id);
  if (facility) {
    if (typeof occupied === 'number') {
      facility.bedCapacity.occupied = Math.min(facility.bedCapacity.total, Math.max(0, occupied));
    }
    if (status) {
      facility.status = status;
    }
    saveDB(db);
    return res.json({ success: true, facility });
  }
  res.status(404).json({ error: 'Facility not found' });
});

// 2. Active Alerts
app.get('/api/alerts', (req, res) => {
  const db = getDB();
  res.json(db.alerts);
});

app.post('/api/alerts/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = getDB();
  const alert = db.alerts.find(a => a.id === id);
  if (alert) {
    alert.status = status;
    saveDB(db);
    return res.json({ success: true, alert });
  }
  res.status(404).json({ error: 'Alert not found' });
});

app.post('/api/alerts', (req, res) => {
  const { workerId, locationNode, patientBrief, category, nearestFacilityId } = req.body;
  const db = getDB();
  const newAlert = {
    id: `ALERT-${Date.now()}`,
    workerId: workerId || 'ASHA_MANUAL',
    locationNode: locationNode || 'Unknown Node',
    patientBrief: patientBrief || 'Urgent escalation requested',
    category: category || 'HIGH',
    nearestFacilityId: nearestFacilityId || 'DH-1',
    timestamp: new Date().toISOString(),
    status: 'PENDING' as const
  };
  db.alerts.unshift(newAlert);
  saveDB(db);
  res.json({ success: true, alert: newAlert });
});

// 3. Log History
app.get('/api/logs', (req, res) => {
  const db = getDB();
  res.json(db.logs);
});

// 4. Anomalies
app.get('/api/anomalies', (req, res) => {
  const db = getDB();
  res.json(db.anomalies);
});

app.post('/api/anomalies/:id/resolve', (req, res) => {
  const { id } = req.params;
  const db = getDB();
  const anomaly = db.anomalies.find(a => a.id === id);
  if (anomaly) {
    anomaly.resolved = true;
    saveDB(db);
    return res.json({ success: true, anomaly });
  }
  res.status(404).json({ error: 'Anomaly not found' });
});

// 5. Patient Triage (AI-Powered)
app.get('/api/triage', (req, res) => {
  const db = getDB();
  res.json(db.triageRecords);
});

app.post('/api/triage', async (req, res) => {
  const { symptoms, vitals, patientDetails, workerId } = req.body;
  const db = getDB();

  if (!symptoms) {
    return res.status(400).json({ error: 'Symptoms string is required.' });
  }

  const fallbackResult = {
    category: 'MEDIUM' as const,
    clinicalReasoning: 'Standard fallback logic used. Patient exhibits symptomatic parameters that require scheduled evaluation.',
    recommendedAction: 'Schedule a visit to the local SubCenter. Monitor vitals daily. Report any escalation of symptoms immediately.',
    nearestFacilityRequirement: 'Requires basic maternal/primary care setup.'
  };

  let aiResponse = fallbackResult;

  if (apiKey) {
    try {
      const prompt = `
Analyze the following patient clinical parameters and symptom descriptions to conduct a triage categorization:
PATIENT PROFILE: Age: ${patientDetails?.age || 'Unknown'}, Gender: ${patientDetails?.gender || 'Unknown'}, Pregnancy: ${patientDetails?.pregnancyStatus || 'NO'}
VITALS: Pulse: ${vitals?.pulse || 'N/A'}, Temp: ${vitals?.temp || 'N/A'}, BP: ${vitals?.bloodPressure || 'N/A'}, Resp: ${vitals?.respiratoryRate || 'N/A'}, O2: ${vitals?.oxygenSat || 'N/A'}
SYMPTOMS: "${symptoms}"
FACILITIES: ${JSON.stringify(db.facilities)}

Return priority (LOW, MEDIUM, HIGH, CRITICAL), clinical reasoning, recommended action, and facility requirements in JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are a clinical routing assistant. Return valid JSON.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              clinicalReasoning: { type: Type.STRING },
              recommendedAction: { type: Type.STRING },
              nearestFacilityRequirement: { type: Type.STRING }
            },
            required: ['category', 'clinicalReasoning', 'recommendedAction', 'nearestFacilityRequirement']
          }
        }
      });

      if (response.text) {
        aiResponse = JSON.parse(response.text.trim());
      }
    } catch (err) {
      console.error('Triage AI generation error', err);
    }
  }

  let matchedFacilityId = 'SC-1';
  const cat = aiResponse.category.toUpperCase();
  if (cat === 'CRITICAL') {
    matchedFacilityId = 'DH-1';
  } else if (cat === 'HIGH') {
    if (patientDetails?.pregnancyStatus === 'YES' || symptoms.toLowerCase().includes('pregnant')) {
      matchedFacilityId = 'CHC-1';
    } else {
      matchedFacilityId = 'DH-1';
    }
  }

  const newTriage = {
    id: `TRI-${Date.now()}`,
    patientAge: Number(patientDetails?.age) || 30,
    patientGender: (patientDetails?.gender || 'F') as 'M' | 'F' | 'Other',
    pregnancyStatus: (patientDetails?.pregnancyStatus || 'NO') as 'YES' | 'NO' | 'NOT_APPLICABLE',
    symptoms: symptoms,
    vitals: {
      pulse: Number(vitals?.pulse) || 72,
      temp: Number(vitals?.temp) || 98.6,
      bloodPressure: vitals?.bloodPressure || '120/80',
      respiratoryRate: Number(vitals?.respiratoryRate) || 16,
      oxygenSat: Number(vitals?.oxygenSat) || 98
    },
    category: (aiResponse.category || 'MEDIUM') as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    clinicalReasoning: aiResponse.clinicalReasoning,
    recommendedAction: aiResponse.recommendedAction,
    timestamp: new Date().toISOString(),
    allocatedFacilityId: matchedFacilityId,
    isSyncedToFirebase: true
  };

  db.triageRecords.unshift(newTriage);

  if (newTriage.category === 'HIGH' || newTriage.category === 'CRITICAL') {
    const brief = `${newTriage.patientAge}${newTriage.patientGender}, ${symptoms.substring(0, 50)}...`;
    db.alerts.unshift({
      id: `ALERT-${Date.now()}`,
      triageId: newTriage.id,
      workerId: workerId || 'ASHA_ID-401',
      locationNode: 'SubCenter Bhadrak',
      patientBrief: brief,
      category: newTriage.category,
      nearestFacilityId: matchedFacilityId,
      timestamp: new Date().toISOString(),
      status: 'PENDING'
    });
  }

  saveDB(db);
  res.json({ triage: newTriage, requirement: aiResponse.nearestFacilityRequirement });
});

// 6. Worker Log Check-in
app.post('/api/logs/validate', async (req, res) => {
  const { workerId, workerName, locationNode, timestamp, notes } = req.body;
  const db = getDB();

  const newLog = {
    id: `LOG-${Date.now()}`,
    workerId: workerId || 'ASHA_ID-401',
    workerName: workerName || 'Rashmi Prava Mallick',
    locationNode: locationNode || 'SubCenter Bhadrak',
    timestamp: timestamp || new Date().toISOString(),
    status: 'ACTIVE' as const,
    notes: notes || '',
    geofenceVerified: true
  };

  db.logs.unshift(newLog);

  let isAnomalyDetected = false;
  let anomalyDetails = null;

  if (apiKey && notes) {
    try {
      const prompt = `
Analyze ASHA worker notes: "${notes}". Location: "${locationNode}".
Verify if notes claim specialized services (like ultrasound or MRI) not physically present at this location.
SC-1 only has Thermometer, BP Monitor, Glucometer, First Aid, Oxygen Concentrator.
SC-2 only has BP Cuff, Thermometer, Nebulizer.
Return JSON {isAnomaly: boolean, anomalyType: string, severity: string, description: string}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'Auditing assistant. Return JSON.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isAnomaly: { type: Type.BOOLEAN },
              anomalyType: { type: Type.STRING },
              severity: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ['isAnomaly', 'anomalyType', 'severity', 'description']
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        if (parsed.isAnomaly) {
          isAnomalyDetected = true;
          anomalyDetails = {
            id: `ANOM-${Date.now()}`,
            logId: newLog.id,
            workerId: newLog.workerId,
            timestamp: new Date().toISOString(),
            anomalyType: parsed.anomalyType as any,
            severity: parsed.severity as any,
            description: parsed.description,
            resolved: false
          };
          db.anomalies.unshift(anomalyDetails);
          newLog.geofenceVerified = false;
        }
      }
    } catch (err) {
      console.error('Audit validation error', err);
    }
  }

  saveDB(db);
  res.json({ success: true, log: newLog, anomalyDetected: isAnomalyDetected, anomaly: anomalyDetails });
});

// --- NEW OPERATION ENDPOINTS ---

// 1. INVENTORY ENDPOINTS
app.get('/api/inventory', (req, res) => {
  const db = getDB();
  res.json(db.inventory);
});

app.get('/api/inventory/movements', (req, res) => {
  const db = getDB();
  res.json(db.movements);
});

app.post('/api/inventory/update', (req, res) => {
  const { medicineId, quantity, notes, type } = req.body;
  const db = getDB();
  const med = db.inventory.find(i => i.id === medicineId);
  if (!med) {
    return res.status(404).json({ error: 'Medicine not found.' });
  }

  if (type === 'ADDITION') {
    med.currentStock = Math.min(med.maximumThreshold, med.currentStock + quantity);
    med.lastRestocked = new Date().toISOString().split('T')[0];
  } else {
    med.currentStock = Math.max(0, med.currentStock - Math.abs(quantity));
  }

  const movement = {
    id: `MV-${Date.now()}`,
    facilityId: med.facilityId,
    medicineId,
    medicineName: med.name,
    type: type || 'ADDITION',
    quantity,
    timestamp: new Date().toISOString(),
    notes
  };

  db.movements.unshift(movement);
  saveDB(db);
  res.json({ success: true, med, movement });
});

app.post('/api/inventory/reorder', (req, res) => {
  const { orders } = req.body;
  const db = getDB();
  orders.forEach((o: any) => {
    const med = db.inventory.find(i => i.id === o.medicineId);
    if (med) {
      med.currentStock = Math.min(med.maximumThreshold, med.currentStock + o.quantity);
      med.lastRestocked = new Date().toISOString().split('T')[0];
      db.movements.unshift({
        id: `MV-${Date.now()}-${med.id}`,
        facilityId: med.facilityId,
        medicineId: med.id,
        medicineName: med.name,
        type: 'ADDITION',
        quantity: o.quantity,
        timestamp: new Date().toISOString(),
        notes: 'AI restock order completed'
      });
    }
  });
  saveDB(db);
  res.json({ success: true });
});

app.get('/api/inventory/recommendations', async (req, res) => {
  const db = getDB();
  const fallback = [
    { medicineId: 'inv-1', medicineName: 'Paracetamol 500mg', currentStock: 0, weeklyConsumption: 200, recommendedOrder: 500, unit: 'tablets', priority: 'HIGH' },
    { medicineId: 'inv-2', medicineName: 'Amoxicillin 250mg', currentStock: 5, weeklyConsumption: 50, recommendedOrder: 200, unit: 'capsules', priority: 'HIGH' },
    { medicineId: 'inv-3', medicineName: 'ORS Packets', currentStock: 10, weeklyConsumption: 100, recommendedOrder: 300, unit: 'packets', priority: 'HIGH' }
  ];

  if (!apiKey) {
    return res.json(fallback);
  }

  try {
    const prompt = `Based on this inventory: ${JSON.stringify(db.inventory.filter(i => i.facilityId === 'SC-1'))}. Return a JSON array of restock recommendations for items below threshold. Use fields: medicineId, medicineName, currentStock, weeklyConsumption, recommendedOrder, unit, priority ('HIGH' | 'MEDIUM' | 'LOW')`;
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });
    if (response.text) {
      res.json(JSON.parse(response.text.trim()));
    } else {
      res.json(fallback);
    }
  } catch (err) {
    console.error('AI inventory recommendations error', err);
    res.json(fallback);
  }
});

// 2. PATIENTS ENDPOINTS
app.get('/api/patients', (req, res) => {
  const db = getDB();
  res.json(db.patients);
});

app.post('/api/patients/register', (req, res) => {
  const data = req.body;
  const db = getDB();
  const newPatient = {
    id: `pat-${Date.now()}`,
    registrationTime: new Date().toISOString(),
    ...data
  };
  db.patients.unshift(newPatient);
  saveDB(db);
  res.json({ success: true, patient: newPatient });
});

app.post('/api/patients/queue/call-next', (req, res) => {
  const { facilityId } = req.body;
  const db = getDB();
  const nextPat = db.patients.find(p => p.facilityId === facilityId && p.status === 'waiting');
  if (nextPat) {
    nextPat.status = 'with_doctor';
    saveDB(db);
    return res.json({ success: true, patient: nextPat });
  }
  res.status(404).json({ error: 'No patients waiting.' });
});

app.get('/api/patients/footfall/forecast', async (req, res) => {
  const fallback = [
    { date: new Date().toISOString().split('T')[0], predictedCount: 145 },
    { date: new Date(Date.now() + 86400000).toISOString().split('T')[0], predictedCount: 132 },
    { date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], predictedCount: 156 },
    { date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], predictedCount: 142 },
    { date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0], predictedCount: 168 }
  ];

  if (!apiKey) {
    return res.json(fallback);
  }

  try {
    const prompt = `Return a 7-day footfall volume forecast JSON array of objects with fields: date, predictedCount. Base it on patient history: ${JSON.stringify(fallback)}`;
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    if (response.text) {
      res.json(JSON.parse(response.text.trim()));
    } else {
      res.json(fallback);
    }
  } catch (err) {
    res.json(fallback);
  }
});

app.get('/api/patients/staffing-recommendations', async (req, res) => {
  const fallback = {
    dailyAdjustments: [
      { day: 'Monday', additionalDoctors: 1, additionalNurses: 2 },
      { day: 'Friday', additionalDoctors: 1, additionalNurses: 3 }
    ],
    peakHoursCoverage: 'Requesting standby GP coverage from 11:00 AM to 03:00 PM due to high seasonal load.',
    specialistCoverage: 'Gynecology shifts should start 1 hour earlier on Wednesday.'
  };

  if (!apiKey) {
    return res.json(fallback);
  }

  try {
    const prompt = `Return staffing recommendations matching expected footfalls. Output JSON with fields: dailyAdjustments, peakHoursCoverage, specialistCoverage.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    if (response.text) {
      res.json(JSON.parse(response.text.trim()));
    } else {
      res.json(fallback);
    }
  } catch (err) {
    res.json(fallback);
  }
});

// 3. BEDS ENDPOINTS
app.get('/api/beds', (req, res) => {
  const db = getDB();
  res.json(db.beds);
});

app.post('/api/beds/admit', (req, res) => {
  const { bedId, patientId, reason, expectedDays } = req.body;
  const db = getDB();
  const bed = db.beds.find(b => b.id === bedId);
  const patient = db.patients.find(p => p.id === patientId);
  if (!bed || !patient) {
    return res.status(404).json({ error: 'Bed or Patient not found.' });
  }

  bed.status = 'occupied';
  bed.occupiedBy = patient.name;
  bed.occupiedSince = new Date().toISOString();
  bed.expectedDischarge = new Date(Date.now() + 86400000 * expectedDays).toISOString();
  
  patient.status = 'admitted';
  patient.admittedBedId = bedId;

  const fac = db.facilities.find(f => f.id === bed.facilityId);
  if (fac) {
    fac.bedCapacity.occupied = Math.min(fac.bedCapacity.total, fac.bedCapacity.occupied + 1);
  }

  saveDB(db);
  res.json({ success: true, bed });
});

app.post('/api/beds/discharge', (req, res) => {
  const { bedId } = req.body;
  const db = getDB();
  const bed = db.beds.find(b => b.id === bedId);
  if (!bed) {
    return res.status(404).json({ error: 'Bed not found.' });
  }

  const patientName = bed.occupiedBy;
  bed.status = 'cleaning';
  bed.occupiedBy = undefined;
  bed.occupiedSince = undefined;
  bed.expectedDischarge = undefined;

  const pat = db.patients.find(p => p.name === patientName && p.status === 'admitted');
  if (pat) {
    pat.status = 'completed';
  }

  const fac = db.facilities.find(f => f.id === bed.facilityId);
  if (fac) {
    fac.bedCapacity.occupied = Math.max(0, fac.bedCapacity.occupied - 1);
  }

  saveDB(db);

  // Simulated 10-second sanitization timer
  setTimeout(() => {
    const activeDb = getDB();
    const activeBed = activeDb.beds.find(b => b.id === bedId);
    if (activeBed && activeBed.status === 'cleaning') {
      activeBed.status = 'available';
      saveDB(activeDb);
      console.log(`[Bed Cleaner Timer] Sanitization complete for ${bedId}. Status set to available.`);
    }
  }, 10000);

  res.json({ success: true, bed });
});

app.get('/api/beds/forecast', async (req, res) => {
  const fallback = [
    { date: new Date().toISOString().split('T')[0], predictedAvailable: 3, occupancyRate: 60 },
    { date: new Date(Date.now() + 86400000).toISOString().split('T')[0], predictedAvailable: 2, occupancyRate: 75 },
    { date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], predictedAvailable: 4, occupancyRate: 50 },
    { date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], predictedAvailable: 3, occupancyRate: 60 }
  ];

  if (!apiKey) {
    return res.json(fallback);
  }

  try {
    const prompt = `Return a 7-day bed occupancy forecast JSON array of objects with fields: date, predictedAvailable, occupancyRate.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    if (response.text) {
      res.json(JSON.parse(response.text.trim()));
    } else {
      res.json(fallback);
    }
  } catch (err) {
    res.json(fallback);
  }
});

// 4. DOCTORS ENDPOINTS
app.get('/api/doctors', (req, res) => {
  const db = getDB();
  res.json(db.doctors);
});

app.get('/api/doctors/attendance', (req, res) => {
  const db = getDB();
  res.json(db.doctorAttendance);
});

app.get('/api/doctors/leaves', (req, res) => {
  const db = getDB();
  res.json(db.leaveRequests);
});

app.post('/api/doctors/attendance', (req, res) => {
  const { doctorId, status, notes } = req.body;
  const db = getDB();
  const doc = db.doctors.find(d => d.id === doctorId);
  if (!doc) {
    return res.status(404).json({ error: 'Doctor not found.' });
  }

  const existing = db.doctorAttendance.find(a => a.doctorId === doctorId && a.date === new Date().toISOString().split('T')[0]);
  if (existing) {
    existing.status = status;
    existing.notes = notes;
    if (status === 'absent' || status === 'on_leave') {
      existing.checkIn = undefined;
    }
  } else {
    db.doctorAttendance.push({
      id: `att-${Date.now()}`,
      doctorId,
      facilityId: doc.facilityId,
      date: new Date().toISOString().split('T')[0],
      status,
      checkIn: status === 'present' ? new Date().toISOString() : undefined,
      patientsSeen: 0,
      notes
    });
  }

  saveDB(db);
  res.json({ success: true });
});

app.post('/api/doctors/leave', (req, res) => {
  const { doctorId, fromDate, toDate, reason } = req.body;
  const db = getDB();
  const doc = db.doctors.find(d => d.id === doctorId);
  if (!doc) {
    return res.status(404).json({ error: 'Doctor not found.' });
  }

  const newLeave = {
    id: `leave-${Date.now()}`,
    doctorId,
    doctorName: doc.name,
    facilityId: doc.facilityId,
    fromDate,
    toDate,
    reason,
    status: 'approved' as const
  };

  db.leaveRequests.push(newLeave);

  // Auto-fill attendance as on_leave if it overlaps today
  const todayStr = new Date().toISOString().split('T')[0];
  if (todayStr >= fromDate && todayStr <= toDate) {
    const existing = db.doctorAttendance.find(a => a.doctorId === doctorId && a.date === todayStr);
    if (existing) {
      existing.status = 'on_leave';
    } else {
      db.doctorAttendance.push({
        id: `att-${Date.now()}`,
        doctorId,
        facilityId: doc.facilityId,
        date: todayStr,
        status: 'on_leave',
        patientsSeen: 0,
        notes: `Auto-leave sync: ${reason}`
      });
    }
  }

  saveDB(db);
  res.json({ success: true, leave: newLeave });
});

app.get('/api/doctors/forecast', async (req, res) => {
  const fallback = [
    { date: new Date().toISOString().split('T')[0], presentDoctors: 4, gapSeverity: 'LOW', gapMessage: 'Roster coverage is optimal today.', recommendation: 'None needed' },
    { date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], presentDoctors: 3, gapSeverity: 'HIGH', gapMessage: 'Dr. Anita Gupta (Gynecologist) has approved leave. Coverage is down.', recommendation: 'Arrange standby gynecologist coverage from CHC Dhamnagar.' }
  ];

  if (!apiKey) {
    return res.json(fallback);
  }

  try {
    const prompt = `Return a 3-day doctor availability gap prediction JSON array of objects with fields: date, presentDoctors, gapSeverity ('HIGH' | 'MEDIUM' | 'LOW'), gapMessage, recommendation. Base it on: ${JSON.stringify(fallback)}`;
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    if (response.text) {
      res.json(JSON.parse(response.text.trim()));
    } else {
      res.json(fallback);
    }
  } catch (err) {
    res.json(fallback);
  }
});

// 5. TESTS ENDPOINTS
app.get('/api/tests', (req, res) => {
  const db = getDB();
  res.json(db.tests);
});

app.get('/api/tests/samples', (req, res) => {
  const db = getDB();
  res.json(db.labSamples);
});

app.post('/api/tests/samples/collect', (req, res) => {
  const { patientId, testId } = req.body;
  const db = getDB();
  const pat = db.patients.find(p => p.id === patientId);
  const test = db.tests.find(t => t.id === testId);
  if (!pat || !test) {
    return res.status(404).json({ error: 'Patient or Test not found.' });
  }

  const newSample = {
    id: `smpl-${Date.now()}`,
    patientId,
    patientName: pat.name,
    facilityId: test.facilityId,
    testId,
    testName: test.name,
    collectedAt: new Date().toISOString(),
    status: 'collected' as const
  };

  db.labSamples.unshift(newSample);
  test.sampleCount += 1;
  saveDB(db);
  res.json({ success: true, sample: newSample });
});

app.post('/api/tests/samples/update', (req, res) => {
  const { sampleId, status, result } = req.body;
  const db = getDB();
  const sample = db.labSamples.find(s => s.id === sampleId);
  if (!sample) {
    return res.status(404).json({ error: 'Sample not found.' });
  }

  sample.status = status;
  if (result) {
    sample.result = result;
  }
  saveDB(db);
  res.json({ success: true, sample });
});

app.post('/api/tests/update-status', (req, res) => {
  const { testId, equipmentStatus } = req.body;
  const db = getDB();
  const test = db.tests.find(t => t.id === testId);
  if (!test) {
    return res.status(404).json({ error: 'Test not found.' });
  }

  test.equipmentStatus = equipmentStatus;
  test.availability = equipmentStatus === 'operational' ? 'available' : 'unavailable';
  saveDB(db);
  res.json({ success: true, test });
});

app.get('/api/tests/recommendations', async (req, res) => {
  const fallback = [
    { testName: 'Electrocardiogram (ECG)', distanceKm: 11, recommendedFacilityName: 'CHC Dhamnagar (CHC-1)', routingInstruction: 'ECG hardware is broken at Bhadrak. Redirect cardiology requests to CHC Dhamnagar reception desk.', destUptime: '99.7%', destBedsAvailable: 12 },
    { testName: 'Ultrasound Scan', distanceKm: 22, recommendedFacilityName: 'District Hospital Bhadrak (DH-1)', routingInstruction: 'Pelvic scan equipment down. Redirect to District Hospital Bhadrak blood-bank ward.', destUptime: '99.9%', destBedsAvailable: 58 }
  ];

  if (!apiKey) {
    return res.json(fallback);
  }

  try {
    const prompt = `Return JSON array of backup routing recommendations for down lab equipment. Base it on: ${JSON.stringify(fallback)}`;
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    if (response.text) {
      res.json(JSON.parse(response.text.trim()));
    } else {
      res.json(fallback);
    }
  } catch (err) {
    res.json(fallback);
  }
});

// 6. ADMIN & OPTIMIZER ENDPOINTS
app.get('/api/admin/redistribution', async (req, res) => {
  const fallback = [
    { id: 'REDIST-1', fromFacilityId: 'SC-2', fromFacilityName: 'SubCenter Dhamnagar', toFacilityId: 'SC-1', toFacilityName: 'SubCenter Bhadrak', medicineId: 'inv-3', medicineName: 'ORS Packets', quantity: 100, unit: 'packets', urgency: 'HIGH', reason: 'SubCenter Bhadrak has active stock-out (10 remaining vs 30 threshold) with high demand, while SubCenter Dhamnagar has surplus stock (250 packets).' }
  ];

  if (!apiKey) {
    return res.json(fallback);
  }

  try {
    const prompt = `Analyze: ${JSON.stringify(getDB().inventory)}. Suggest medicine transfers from surplus facilities to centers with stock-outs. Return JSON array with fields: id, fromFacilityId, fromFacilityName, toFacilityId, toFacilityName, medicineId, medicineName, quantity, unit, urgency ('HIGH' | 'MEDIUM' | 'LOW'), reason.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    if (response.text) {
      res.json(JSON.parse(response.text.trim()));
    } else {
      res.json(fallback);
    }
  } catch (err) {
    res.json(fallback);
  }
});

app.post('/api/admin/redistribute', (req, res) => {
  const { id } = req.body;
  const db = getDB();

  // Mock execution: adjust stock levels at both locations
  // Paracetamol redistribution
  const source = db.inventory.find(i => i.facilityId === 'SC-2' && i.name.includes('ORS'));
  const dest = db.inventory.find(i => i.facilityId === 'SC-1' && i.name.includes('ORS'));
  
  if (source && dest && source.currentStock >= 100) {
    source.currentStock -= 100;
    dest.currentStock += 100;

    db.movements.unshift({
      id: `MV-${Date.now()}-RED-FROM`,
      facilityId: 'SC-2',
      medicineId: source.id,
      medicineName: source.name,
      type: 'TRANSFER',
      quantity: -100,
      timestamp: new Date().toISOString(),
      notes: 'Redistribution dispatch out to SC-1'
    });

    db.movements.unshift({
      id: `MV-${Date.now()}-RED-TO`,
      facilityId: 'SC-1',
      medicineId: dest.id,
      medicineName: dest.name,
      type: 'TRANSFER',
      quantity: 100,
      timestamp: new Date().toISOString(),
      notes: 'Redistribution receipt from SC-2'
    });

    saveDB(db);
    return res.json({ success: true });
  }

  res.status(400).json({ error: 'Redistribution execution parameter conflict.' });
});

app.get('/api/admin/performance', async (req, res) => {
  const fallback = [
    {
      facilityId: 'SC-1',
      facilityName: 'SubCenter Bhadrak',
      score: 85,
      status: 'GOOD',
      waitTimeRating: '92%',
      stockRating: '75%',
      attendanceRating: '90%',
      bedRating: '85%',
      recommendations: [
        'Procure additional Paracetamol to resolve critical stock-out.',
        'Sanitize community ward beds daily.'
      ]
    },
    {
      facilityId: 'SC-2',
      facilityName: 'SubCenter Dhamnagar',
      score: 48,
      status: 'CRITICAL_GAPS',
      waitTimeRating: '60%',
      stockRating: '50%',
      attendanceRating: '0%',
      bedRating: '45%',
      recommendations: [
        'Address absolute doctor absence (currently 0 active).',
        'Redistribute surplus ORS packets to neighboring centers.'
      ]
    }
  ];

  if (!apiKey) {
    return res.json(fallback);
  }

  try {
    const prompt = `Return a JSON array rating all facilities. Calculate score (0-100), status ('EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'CRITICAL_GAPS'), and ratings for waitTimeRating, stockRating, attendanceRating, bedRating, recommendations. Input: ${JSON.stringify(getDB().facilities)}`;
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    if (response.text) {
      res.json(JSON.parse(response.text.trim()));
    } else {
      res.json(fallback);
    }
  } catch (err) {
    res.json(fallback);
  }
});

// Initialize Vite server for asset handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
