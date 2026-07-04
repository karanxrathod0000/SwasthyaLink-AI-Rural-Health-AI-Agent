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
