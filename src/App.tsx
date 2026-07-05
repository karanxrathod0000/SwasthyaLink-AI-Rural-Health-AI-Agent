import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';

// Auth
import { AuthProvider, useAuth } from './context/AuthContext';
import { apiFetch as globalApiFetch } from './utils/api';
import { PrivateRoute } from './components/PrivateRoute';

// Pages
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ServiceSelection from './components/ServiceSelection';

// Dashboard
import MainLayout from './components/MainLayout';
import DashboardTab from './components/DashboardTab';
import TriageConsoleTab from './components/TriageConsoleTab';
import ResourceLocatorTab from './components/ResourceLocatorTab';
import PatientManagementTab from './components/PatientManagementTab';
import SettingsTab from './components/SettingsTab';
import InventoryTab from './components/InventoryTab';
import PatientsTab from './components/PatientsTab';
import BedsTab from './components/BedsTab';
import DoctorsTab from './components/DoctorsTab';
import TestsTab from './components/TestsTab';
import AnalyticsTab from './components/AnalyticsTab';
import AdminTab from './components/AdminTab';

import {
  Facility, AttendanceLog, LogAnomaly, EmergencyAlert, TriageResult,
  Medicine, RestockRecommendation, PatientRegistration, FootfallForecast,
  StaffingRecommendation, Bed, Doctor, DoctorAttendance, LeaveRequest,
  DiagnosticTest, LabSample, RedistributionRecommendation, FacilityPerformance
} from './types';
import { UserX } from 'lucide-react';

// ─── Dashboard Shell ─────────────────────────────────────────────────────────

const VALID_TABS = ['dashboard','triage','resources','workers','inventory','patients','beds','doctors','tests','analytics','admin','settings'];

function DashboardShell() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read tab directly from URL ?tab= param; fall back to 'dashboard'
  const tabFromUrl = searchParams.get('tab');
  const activeTab = tabFromUrl && VALID_TABS.includes(tabFromUrl) ? tabFromUrl : 'dashboard';

  // When user switches tabs via sidebar or anywhere else, update the URL query param so it persists and is shareable
  const handleSetActiveTab = (tab: string) => {
    setSearchParams({ tab }, { replace: true });
  };
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [anomalies, setAnomalies] = useState<LogAnomaly[]>([]);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [triageRecords, setTriageRecords] = useState<TriageResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [inventory, setInventory] = useState<Medicine[]>([]);
  const [recommendations, setRecommendations] = useState<RestockRecommendation[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [patients, setPatients] = useState<PatientRegistration[]>([]);
  const [forecast, setForecast] = useState<FootfallForecast[]>([]);
  const [staffingRecommendation, setStaffingRecommendation] = useState<StaffingRecommendation | null>(null);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [bedForecast, setBedForecast] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [attendance, setAttendance] = useState<DoctorAttendance[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [attendanceForecast, setAttendanceForecast] = useState<any[]>([]);
  const [tests, setTests] = useState<DiagnosticTest[]>([]);
  const [samples, setSamples] = useState<LabSample[]>([]);
  const [routingRecommendations, setRoutingRecommendations] = useState<any[]>([]);
  const [redistributions, setRedistributions] = useState<RedistributionRecommendation[]>([]);
  const [performance, setPerformance] = useState<FacilityPerformance[]>([]);

  const fetchOperationalData = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoints = [
        '/api/facilities', '/api/logs', '/api/anomalies', '/api/alerts', '/api/triage',
        '/api/inventory', '/api/inventory/recommendations', '/api/inventory/movements',
        '/api/patients', '/api/patients/footfall/forecast', '/api/patients/staffing-recommendations',
        '/api/beds', '/api/beds/forecast',
        '/api/doctors', '/api/doctors/attendance', '/api/doctors/leaves', '/api/doctors/forecast',
        '/api/tests', '/api/tests/samples', '/api/tests/recommendations',
        '/api/admin/redistribution', '/api/admin/performance'
      ];

      const responses = await Promise.all(endpoints.map(ep => globalApiFetch(ep)));

      const failed = responses.filter(r => !r.ok);
      if (failed.length > 0) throw new Error(`${failed.length} API resources failed to load.`);

      const data = await Promise.all(responses.map(r => r.json()));

      setFacilities(data[0]); setLogs(data[1]); setAnomalies(data[2]); setAlerts(data[3]);
      setTriageRecords(data[4]); setInventory(data[5]); setRecommendations(data[6]);
      setMovements(data[7]); setPatients(data[8]); setForecast(data[9]);
      setStaffingRecommendation(data[10]); setBeds(data[11]); setBedForecast(data[12]);
      setDoctors(data[13]); setAttendance(data[14]); setLeaves(data[15]);
      setAttendanceForecast(data[16]); setTests(data[17]); setSamples(data[18]);
      setRoutingRecommendations(data[19]); setRedistributions(data[20]); setPerformance(data[21]);
    } catch (err: any) {
      setError(err.message || 'Failed to sync live operational data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOperationalData(); }, []);

  // ── Mutation handlers ────────────────────────────────────────────────────
  const apiFetch = async (url: string, method = 'POST', body?: any) => {
    const res = await globalApiFetch(url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
    });
    return res;
  };

  const handleUpdateOccupancy = async (id: string, occupied: number, status?: Facility['status']) => {
    const res = await apiFetch(`/api/facilities/${id}/update-occupancy`, 'POST', { occupied, status });
    if (res.ok) fetchOperationalData();
  };

  const handleUpdateAlertStatus = async (id: string, status: EmergencyAlert['status']) => {
    const res = await apiFetch(`/api/alerts/${id}/status`, 'POST', { status });
    if (res.ok) fetchOperationalData();
  };

  const handleResolveAnomaly = async (id: string) => {
    const res = await apiFetch(`/api/anomalies/${id}/resolve`);
    if (res.ok) fetchOperationalData();
  };

  const handleAddStock = async (medicineId: string, quantity: number, notes?: string) => {
    const res = await apiFetch('/api/inventory/update', 'POST', { medicineId, quantity, notes, type: 'ADDITION' });
    if (res.ok) fetchOperationalData();
  };

  const handleTriggerReorder = async (orders: { medicineId: string; quantity: number }[]) => {
    const res = await apiFetch('/api/inventory/reorder', 'POST', { orders });
    if (res.ok) fetchOperationalData();
  };

  const handleRegisterPatient = async (data: Omit<PatientRegistration, 'id' | 'registrationTime'>) => {
    const res = await apiFetch('/api/patients/register', 'POST', data);
    if (res.ok) fetchOperationalData();
  };

  const handleCallNextPatient = async (facilityId: string) => {
    const res = await apiFetch('/api/patients/queue/call-next', 'POST', { facilityId });
    if (res.ok) fetchOperationalData();
  };

  const handleAdmitPatient = async (bedId: string, patientId: string, reason: string, expectedDays: number) => {
    const res = await apiFetch('/api/beds/admit', 'POST', { bedId, patientId, reason, expectedDays });
    if (res.ok) fetchOperationalData();
  };

  const handleDischargePatient = async (bedId: string) => {
    const res = await apiFetch('/api/beds/discharge', 'POST', { bedId });
    if (res.ok) { fetchOperationalData(); setTimeout(fetchOperationalData, 11000); }
  };

  const handleMarkDoctorAttendance = async (doctorId: string, status: DoctorAttendance['status'], notes?: string) => {
    const res = await apiFetch('/api/doctors/attendance', 'POST', { doctorId, status, notes });
    if (res.ok) fetchOperationalData();
  };

  const handleSubmitLeave = async (doctorId: string, fromDate: string, toDate: string, reason: string) => {
    const res = await apiFetch('/api/doctors/leave', 'POST', { doctorId, fromDate, toDate, reason });
    if (res.ok) fetchOperationalData();
  };

  const handleCollectSample = async (patientId: string, testId: string) => {
    const res = await apiFetch('/api/tests/samples/collect', 'POST', { patientId, testId });
    if (res.ok) fetchOperationalData();
  };

  const handleUpdateSampleStatus = async (sampleId: string, status: LabSample['status'], result?: string) => {
    const res = await apiFetch('/api/tests/samples/update', 'POST', { sampleId, status, result });
    if (res.ok) fetchOperationalData();
  };

  const handleToggleEquipment = async (testId: string, equipmentStatus: DiagnosticTest['equipmentStatus']) => {
    const res = await apiFetch('/api/tests/update-status', 'POST', { testId, equipmentStatus });
    if (res.ok) fetchOperationalData();
  };

  const handleTriggerRedistribute = async (id: string) => {
    const res = await apiFetch('/api/admin/redistribute', 'POST', { id });
    if (res.ok) fetchOperationalData();
  };

  const handleTriageCreated = (newTriage: TriageResult, _requirement: string) => {
    setTriageRecords(prev => [newTriage, ...prev]);
    fetchOperationalData();
  };

  const handleLogValidated = (newLog: AttendanceLog, newAnomaly: LogAnomaly | null) => {
    setLogs(prev => [newLog, ...prev]);
    if (newAnomaly) setAnomalies(prev => [newAnomaly, ...prev]);
    fetchOperationalData();
  };

  const triggerEmergencyAlert = async () => {
    const isPregnant = confirm('Is this emergency alert related to a maternal/pregnancy case?');
    const brief = isPregnant
      ? 'Pregnant patient with sudden onset uterine hemorrhage and shock.'
      : 'Severe pediatric case presenting with acute dehydration and severe diarrhea.';
    const res = await apiFetch('/api/triage', 'POST', {
      symptoms: brief,
      vitals: { pulse: 110, temp: 101.4, bloodPressure: '80/50', respiratoryRate: 28, oxygenSat: 88 },
      patientDetails: { age: isPregnant ? 24 : 4, gender: isPregnant ? 'F' : 'Other', pregnancyStatus: isPregnant ? 'YES' : 'NO' },
      workerId: 'ASHA_ID-401'
    });
    if (res.ok) { alert('🚨 Critical priority dispatch created!'); fetchOperationalData(); }
  };

  // ── Tab renderer ─────────────────────────────────────────────────────────
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab facilities={facilities} alerts={alerts} triageRecords={triageRecords} logs={logs} setActiveTab={handleSetActiveTab} onUpdateAlertStatus={handleUpdateAlertStatus} triggerEmergencyAlert={triggerEmergencyAlert} openNewPatientIntake={() => handleSetActiveTab('triage')} />;
      case 'triage':
        return <TriageConsoleTab facilities={facilities} onTriageCreated={handleTriageCreated} />;
      case 'resources':
        return <ResourceLocatorTab facilities={facilities} onUpdateOccupancy={handleUpdateOccupancy} />;
      case 'workers':
        return <PatientManagementTab logs={logs} anomalies={anomalies} onLogValidated={handleLogValidated} onResolveAnomaly={handleResolveAnomaly} />;
      case 'inventory':
        return <InventoryTab facilities={facilities} inventory={inventory} recommendations={recommendations} movements={movements} onAddStock={handleAddStock} onTriggerReorder={handleTriggerReorder} />;
      case 'patients':
        return <PatientsTab facilities={facilities} patients={patients} forecast={forecast} staffingRecommendation={staffingRecommendation} onRegisterPatient={handleRegisterPatient} onCallNextPatient={handleCallNextPatient} />;
      case 'beds':
        return <BedsTab facilities={facilities} beds={beds} patients={patients} onAdmitPatient={handleAdmitPatient} onDischargePatient={handleDischargePatient} bedForecast={bedForecast} />;
      case 'doctors':
        return <DoctorsTab facilities={facilities} doctors={doctors} attendance={attendance} leaves={leaves} onMarkAttendance={handleMarkDoctorAttendance} onSubmitLeave={handleSubmitLeave} attendanceForecast={attendanceForecast} />;
      case 'tests':
        return <TestsTab facilities={facilities} tests={tests} samples={samples} patients={patients} onCollectSample={handleCollectSample} onUpdateSampleStatus={handleUpdateSampleStatus} onToggleEquipment={handleToggleEquipment} routingRecommendations={routingRecommendations} />;
      case 'analytics':
        return <AnalyticsTab facilities={facilities} triageRecords={triageRecords} alerts={alerts} forecast={forecast} />;
      case 'admin':
        return <AdminTab facilities={facilities} anomalies={anomalies} redistributions={redistributions} performance={performance} onResolveAnomaly={handleResolveAnomaly} onTriggerRedistribute={handleTriggerRedistribute} />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <div className="p-8 text-center text-xs font-mono text-slate-400">Navigation node unrecognized.</div>;
    }
  };

  return (
    <MainLayout activeTab={activeTab} setActiveTab={handleSetActiveTab} alerts={alerts} facilities={facilities} triageRecords={triageRecords} onUpdateAlertStatus={handleUpdateAlertStatus}>
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <UserX className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-semibold font-mono">{error}</p>
          </div>
          <button onClick={fetchOperationalData} className="bg-rose-600 text-white hover:bg-rose-700 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono">Retry</button>
        </div>
      )}
      {loading && facilities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-mono">Synchronizing regional health ledger index...</p>
        </div>
      ) : (
        renderActiveTab()
      )}
    </MainLayout>
  );
}

// ─── Root App ────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public / Demo */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected (Demo Mode Allowed) */}
          <Route path="/select-service" element={<PrivateRoute><ServiceSelection /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardShell /></PrivateRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
