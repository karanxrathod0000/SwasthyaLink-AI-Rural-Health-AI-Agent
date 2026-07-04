import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Ensure Gemini API key is configured
const apiKey = process.env.GEMINI_API_KEY || '';
if (!apiKey) {
  console.warn('WARNING: GEMINI_API_KEY environment variable is missing.');
}

// Initialize GoogleGenAI SDK
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const app = express();
app.use(express.json());

const PORT = 3000;
const STORE_PATH = path.join(process.cwd(), 'data-store.json');

// --- DATABASE IN-MEMORY / JSON STORE SETUP ---
const INITIAL_FACILITIES = [
  {
    id: 'SC-1',
    name: 'SubCenter Bhadrak',
    type: 'SubCenter',
    distanceKm: 2,
    coordinates: { lat: 20.8985, lng: 86.5123 },
    equipment: ['Digital Thermometer', 'Automated BP Monitor', 'Rapid Malaria Kits', 'Glucometer', 'First Aid Kit', 'Basic Oxygen Concentrator'],
    specializedStaff: ['ANM Srimati Lata (Auxiliary Nurse)', 'Community Health Officer (CHO)'],
    bedCapacity: { total: 2, occupied: 0 },
    activeDoctors: 0,
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
    bedCapacity: { total: 1, occupied: 1 },
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

interface EmergencyAlert {
  id: string;
  triageId?: string;
  workerId: string;
  locationNode: string;
  patientBrief: string;
  category: string;
  nearestFacilityId: string;
  timestamp: string;
  status: 'PENDING' | 'ACKNOWLEDGED' | 'DISPATCHED' | 'RESOLVED';
}

const INITIAL_ALERTS: EmergencyAlert[] = [
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

interface DataStore {
  facilities: typeof INITIAL_FACILITIES;
  logs: typeof INITIAL_LOGS;
  triageRecords: typeof INITIAL_TRIAGE_RECORDS;
  anomalies: typeof INITIAL_ANOMALIES;
  alerts: typeof INITIAL_ALERTS;
}

// Load DB from file or initialize
function getDB(): DataStore {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, 'utf-8');
      return JSON.parse(data);
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
  };
  saveDB(defaultDB);
  return defaultDB;
}

function saveDB(db: DataStore) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB', err);
  }
}

// Ensure the DB exists
getDB();

// --- API ENDPOINTS ---

// 1. Facilities
app.get('/api/facilities', (req, res) => {
  const db = getDB();
  res.json(db.facilities);
});

// Update facility occupancy or beds
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

// Create alert manually
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

  // Fallback data structure if Gemini fails or is missing an API key
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
Analyze the following patient clinical parameters and symptom descriptions to conduct a strict triage categorization and routing recommendation:

PATIENT PROFILE:
- Age: ${patientDetails?.age || 'Unknown'}
- Gender: ${patientDetails?.gender || 'Unknown'}
- Pregnancy Status: ${patientDetails?.pregnancyStatus || 'NO'}

PATIENT VITALS:
- Pulse: ${vitals?.pulse || 'N/A'} bpm
- Temperature: ${vitals?.temp || 'N/A'} °F
- Blood Pressure: ${vitals?.bloodPressure || 'N/A'} mmHg
- Respiratory Rate: ${vitals?.respiratoryRate || 'N/A'} breaths/min
- Oxygen Saturation: ${vitals?.oxygenSat || 'N/A'} %

SYMPTOMS REPORTED:
"${symptoms}"

CRITICAL HEALTH FACILITIES CURRENTLY OPERATIONAL:
${JSON.stringify(db.facilities, null, 2)}

TASK:
1. Categorize patient priority as either LOW, MEDIUM, HIGH, or CRITICAL.
   - LOW: Standard minor symptoms, stable vitals.
   - MEDIUM: Persistent mild-to-moderate symptoms, stable but requires monitoring.
   - HIGH: Pre-eclampsia risks, labor complications, severe infection signs, breathing difficulties, or temperature spikes.
   - CRITICAL: Shock, acute respiratory distress, heavy bleeding, heart attack signs (chest pain radiating to arm), oxygen saturation below 90%, unconsciousness.
2. Formulate clinical reasoning explaining the category. Cite specific signs or vitals.
3. Formulate highly actionable, immediate recommended steps for the ASHA worker (clinical protocol).
4. Explain which specialized facility and resource is needed to treat this case (e.g. active ultrasound for pregnancy, cardiac ICU for chest pain).

Return your analysis in valid JSON according to the schema below.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an elite, enterprise-grade clinical routing and logistics AI assisting rural health workers (ASHAs) under severe resource constraints. Your recommendations are logistically sound and clinically highly accurate.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: {
                type: Type.STRING,
                description: 'The triage category: LOW, MEDIUM, HIGH, or CRITICAL.'
              },
              clinicalReasoning: {
                type: Type.STRING,
                description: 'Comprehensive clinical explanation mapping symptoms and vitals to regional health protocols.'
              },
              recommendedAction: {
                type: Type.STRING,
                description: 'Step-by-step immediate protocols for the local health worker.'
              },
              nearestFacilityRequirement: {
                type: Type.STRING,
                description: 'Description of specialized equipment or staff needed to handle this specific presentation.'
              }
            },
            required: ['category', 'clinicalReasoning', 'recommendedAction', 'nearestFacilityRequirement']
          }
        }
      });

      if (response.text) {
        aiResponse = JSON.parse(response.text.trim());
      }
    } catch (err) {
      console.error('Error generating triage via Gemini, using fallback', err);
    }
  }

  // Route to the most appropriate facility based on category and facility offerings.
  // We match facilities by specialized requirements or capacity.
  let matchedFacilityId = 'SC-1'; // Default
  const lowerCategory = aiResponse.category.toUpperCase();

  if (lowerCategory === 'CRITICAL') {
    // Needs advanced ICU, PICU, Cardiac or Surgeons -> District Hospital is best
    matchedFacilityId = 'DH-1';
  } else if (lowerCategory === 'HIGH') {
    // If pregnancy related, CHC Dhamnagar has active Ultrasound and Obstetrician!
    if (patientDetails?.pregnancyStatus === 'YES' || symptoms.toLowerCase().includes('pregnant') || symptoms.toLowerCase().includes('pregnancy') || symptoms.toLowerCase().includes('baby')) {
      matchedFacilityId = 'CHC-1';
    } else {
      matchedFacilityId = 'DH-1';
    }
  } else {
    // LOW or MEDIUM
    // Default to nearest SubCenter SC-1
    matchedFacilityId = 'SC-1';
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

  // If case is HIGH or CRITICAL, automatically spawn an Emergency Alert!
  if (newTriage.category === 'HIGH' || newTriage.category === 'CRITICAL') {
    const brief = `${newTriage.patientAge}${newTriage.patientGender}, ${newTriage.pregnancyStatus === 'YES' ? 'Pregnant, ' : ''}${symptoms.substring(0, 50)}...`;
    const newAlert = {
      id: `ALERT-${Date.now()}`,
      triageId: newTriage.id,
      workerId: workerId || 'ASHA_ID-401',
      locationNode: 'SubCenter Bhadrak',
      patientBrief: brief,
      category: newTriage.category,
      nearestFacilityId: matchedFacilityId,
      timestamp: new Date().toISOString(),
      status: 'PENDING' as const
    };
    db.alerts.unshift(newAlert);
  }

  saveDB(db);
  res.json({ triage: newTriage, requirement: aiResponse.nearestFacilityRequirement });
});

// 6. Worker Log & Geofence Verification (AI-Powered)
app.post('/api/logs/validate', async (req, res) => {
  const { workerId, workerName, locationNode, timestamp, notes } = req.body;
  const db = getDB();

  // Create the standard worker log first
  const newLog = {
    id: `LOG-${Date.now()}`,
    workerId: workerId || 'ASHA_ID-401',
    workerName: workerName || 'Rashmi Prava Mallick',
    locationNode: locationNode || 'SubCenter Bhadrak',
    timestamp: timestamp || new Date().toISOString(),
    status: 'ACTIVE' as const,
    notes: notes || '',
    geofenceVerified: true // Assume default GPS validation passes
  };

  db.logs.unshift(newLog);

  let isAnomalyDetected = false;
  let anomalyDetails = null;

  if (apiKey && notes) {
    try {
      const prompt = `
Analyze the following rural health worker check-in entry for administrative, temporal, or spatial anomalies.

WORKER PROFILE:
- ID: ${newLog.workerId}
- Name: ${newLog.workerName}

CHECK-IN SUBMITTED:
- Location Node (GPS locked): "${newLog.locationNode}"
- Timestamp: "${newLog.timestamp}"
- Activity / Visit notes: "${newLog.notes}"

REGIONAL INFRASTRUCTURE REFERENCE:
- SubCenter Bhadrak (SC-1) is the core operational base.
- SubCenter Dhamnagar (SC-2) is 15km south.
- CHC Dhamnagar (CHC-1) is 11km south-west.
- District Hospital Bhadrak (DH-1) is 22km north.

ANOMALY DEFINITION:
- SPATIAL_DISCREPANCY: Notes describe visiting patients/villages that are physically too far (e.g. >10km) from the GPS-locked location within the shift.
- TIMESTAMP_CONFLICT: Notes claim activities during times that overlap with other check-ins or are highly implausible (e.g., traveling 15km in 5 minutes).
- INCOHERENT_CASE_NOTES: Notes describe administering medication or handling equipment not physically available at that node (e.g. performing an ultrasound scan at SubCenter SC-1, which has NO ultrasound unit).
- SUSPICIOUS_PATTERN: Implausible patient records or repetitive duplicate phrases indicating copy-pasted logs.

TASK:
1. Determine if this log contains an anomaly.
2. If YES, categorize its type, set severity (CRITICAL or WARNING), and write a clear, concise technical description explaining the conflict.

Return your analysis in valid JSON format matching this schema:
{
  "isAnomaly": boolean,
  "anomalyType": "SPATIAL_DISCREPANCY" | "TIMESTAMP_CONFLICT" | "INCOHERENT_CASE_NOTES" | "SUSPICIOUS_PATTERN",
  "severity": "CRITICAL" | "WARNING",
  "description": "Clear explanation of the discrepancy"
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an administrative auditing and log verification AI supporting rural healthcare operation logs. You detect discrepancies between geofenced check-in coordinates and patient treatment case summaries with absolute precision.',
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
          // Flag this log as geofence issue/not fully verified
          newLog.geofenceVerified = false;
        }
      }
    } catch (err) {
      console.error('Error validating worker log via Gemini', err);
    }
  }

  saveDB(db);
  res.json({ success: true, log: newLog, anomalyDetected: isAnomalyDetected, anomaly: anomalyDetails });
});

// Initialize Vite server for asset handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
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

startServer();
