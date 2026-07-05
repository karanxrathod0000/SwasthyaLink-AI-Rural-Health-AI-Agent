export type TriageCategory = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Vitals {
  pulse: number; // bpm
  temp: number; // F
  bloodPressure: string; // e.g., "120/80"
  respiratoryRate: number; // breaths/min
  oxygenSat: number; // %
}

export interface PatientDetails {
  age: number;
  gender: 'M' | 'F' | 'Other';
  pregnancyStatus: 'YES' | 'NO' | 'NOT_APPLICABLE';
}

export interface TriageResult {
  id: string;
  patientAge: number;
  patientGender: 'M' | 'F' | 'Other';
  pregnancyStatus: 'YES' | 'NO' | 'NOT_APPLICABLE';
  symptoms: string;
  vitals: Vitals;
  category: TriageCategory;
  clinicalReasoning: string;
  recommendedAction: string;
  timestamp: string;
  allocatedFacilityId: string;
  isSyncedToFirebase: boolean;
}

export interface Facility {
  id: string;
  name: string;
  type: 'SubCenter' | 'CHC' | 'DistrictHospital';
  distanceKm: number;
  coordinates: { lat: number; lng: number };
  equipment: string[];
  specializedStaff: string[];
  bedCapacity: { total: number; occupied: number };
  activeDoctors: number;
  status: 'FULL_OPERATIONAL' | 'LIMITED_SERVICE' | 'CRITICAL_LOAD';
  contactNo: string;
}

export interface AttendanceLog {
  id: string;
  workerId: string;
  workerName: string;
  locationNode: string;
  timestamp: string;
  status: 'ACTIVE' | 'EMERGENCY_DISPATCH' | 'OFFLINE';
  notes: string;
  geofenceVerified: boolean;
}

export interface LogAnomaly {
  id: string;
  logId: string;
  workerId: string;
  timestamp: string;
  anomalyType: 'SPATIAL_DISCREPANCY' | 'TIMESTAMP_CONFLICT' | 'INCOHERENT_CASE_NOTES' | 'SUSPICIOUS_PATTERN';
  severity: 'WARNING' | 'CRITICAL';
  description: string;
  resolved: boolean;
}

export interface EmergencyAlert {
  id: string;
  triageId?: string;
  workerId: string;
  locationNode: string;
  patientBrief: string;
  category: TriageCategory;
  nearestFacilityId: string;
  timestamp: string;
  status: 'PENDING' | 'ACKNOWLEDGED' | 'DISPATCHED' | 'RESOLVED';
}

// --- NEW OPERATIONAL MANAGEMENT MODULE TYPES ---

export interface Medicine {
  id: string;
  facilityId: string;
  name: string;
  category: 'essential' | 'critical' | 'general';
  currentStock: number;
  minimumThreshold: number;
  maximumThreshold: number;
  unit: 'tablets' | 'capsules' | 'packets' | 'bottles' | 'vials';
  batchNumber: string;
  expiryDate: string;
  supplier: string;
  lastRestocked: string;
}

export interface StockMovement {
  id: string;
  facilityId: string;
  medicineId: string;
  medicineName: string;
  type: 'ADDITION' | 'REMOVAL' | 'TRANSFER';
  quantity: number;
  timestamp: string;
  notes?: string;
}

export interface RestockRecommendation {
  medicineId: string;
  medicineName: string;
  currentStock: number;
  weeklyConsumption: number;
  recommendedOrder: number;
  unit: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface PatientRegistration {
  id: string;
  facilityId: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  contact: string;
  department: 'general' | 'gynecology' | 'pediatrics' | 'surgery' | 'dental';
  visitType: 'OPD' | 'IPD';
  triagePriority: 'routine' | 'urgent' | 'emergency';
  registrationTime: string;
  doctorAssigned?: string;
  status: 'waiting' | 'with_doctor' | 'completed' | 'admitted';
  admittedBedId?: string;
}

export interface FootfallForecast {
  date: string;
  predictedCount: number;
}

export interface StaffingRecommendation {
  dailyAdjustments: { day: string; additionalDoctors: number; additionalNurses: number }[];
  peakHoursCoverage: string;
  specialistCoverage: string;
}

export interface Bed {
  id: string;
  facilityId: string;
  department: 'general' | 'icu' | 'pediatric' | 'maternity' | 'isolation';
  bedNumber: string;
  status: 'available' | 'occupied' | 'cleaning' | 'maintenance';
  occupiedBy?: string; // Patient ID or Name
  occupiedSince?: string;
  expectedDischarge?: string;
}

export interface Doctor {
  id: string;
  name: string;
  department: 'general' | 'gynecology' | 'pediatrics' | 'surgery' | 'dental';
  facilityId: string;
  specialization: string;
  contact: string;
  workingDays: string[]; // e.g. ["monday", "tuesday"]
  avatar?: string;
}

export interface DoctorAttendance {
  id: string;
  doctorId: string;
  facilityId: string;
  date: string;
  status: 'present' | 'absent' | 'half_day' | 'on_leave';
  checkIn?: string;
  checkOut?: string;
  patientsSeen: number;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  doctorId: string;
  doctorName: string;
  facilityId: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface DiagnosticTest {
  id: string;
  facilityId: string;
  name: string;
  category: string;
  availability: 'available' | 'limited' | 'unavailable';
  turnaroundTime: string;
  equipmentStatus: 'operational' | 'down' | 'maintenance';
  sampleCount: number;
}

export interface LabSample {
  id: string;
  patientId: string;
  patientName: string;
  facilityId: string;
  testId: string;
  testName: string;
  collectedAt: string;
  status: 'collected' | 'processing' | 'completed' | 'failed';
  result?: string;
}

export interface RedistributionRecommendation {
  id: string;
  fromFacilityId: string;
  fromFacilityName: string;
  toFacilityId: string;
  toFacilityName: string;
  medicineId: string;
  medicineName: string;
  quantity: number;
  unit: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  reason: string;
}

export interface FacilityPerformance {
  facilityId: string;
  facilityName: string;
  score: number; // 0-100
  status: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'CRITICAL_GAPS';
  waitTimeRating: string;
  stockRating: string;
  attendanceRating: string;
  bedRating: string;
  recommendations: string[];
}
