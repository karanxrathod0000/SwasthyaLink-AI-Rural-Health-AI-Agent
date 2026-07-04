import { useState, useEffect } from 'react';
import MainLayout from './components/MainLayout';
import DashboardTab from './components/DashboardTab';
import TriageConsoleTab from './components/TriageConsoleTab';
import ResourceLocatorTab from './components/ResourceLocatorTab';
import PatientManagementTab from './components/PatientManagementTab';
import PatientsDirectoryTab from './components/PatientsDirectoryTab';
import ReportsTab from './components/ReportsTab';
import SettingsTab from './components/SettingsTab';

import { Facility, AttendanceLog, LogAnomaly, EmergencyAlert, TriageResult } from './types';
import { UserX, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [anomalies, setAnomalies] = useState<LogAnomaly[]>([]);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [triageRecords, setTriageRecords] = useState<TriageResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sub-tab inside patient management (e.g. Directory or Attendance logs)
  const [patientSubTab, setPatientSubTab] = useState<'directory' | 'attendance'>('directory');

  // Load all operational parameters from express server
  const fetchOperationalData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [facRes, logRes, anomRes, alertRes, triRes] = await Promise.all([
        fetch('/api/facilities'),
        fetch('/api/logs'),
        fetch('/api/anomalies'),
        fetch('/api/alerts'),
        fetch('/api/triage')
      ]);

      if (!facRes.ok || !logRes.ok || !anomRes.ok || !alertRes.ok || !triRes.ok) {
        throw new Error('Some API resources failed to load. Verification required.');
      }

      const [facData, logData, anomData, alertData, triData] = await Promise.all([
        facRes.json(),
        logRes.json(),
        anomRes.json(),
        alertRes.json(),
        triRes.json()
      ]);

      setFacilities(facData);
      setLogs(logData);
      setAnomalies(anomData);
      setAlerts(alertData);
      setTriageRecords(triData);
    } catch (err: any) {
      setError(err.message || 'Failed to sync live operational data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperationalData();
  }, []);

  // Action: Update Bed Capacity
  const handleUpdateOccupancy = async (id: string, occupied: number, status?: Facility['status']) => {
    try {
      const response = await fetch(`/api/facilities/${id}/update-occupancy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occupied, status })
      });
      if (response.ok) {
        const data = await response.json();
        setFacilities(prev => prev.map(f => f.id === id ? data.facility : f));
      }
    } catch (err) {
      console.error('Failed to update capacity ledger', err);
    }
  };

  // Action: Update Alert dispatch status
  const handleUpdateAlertStatus = async (id: string, status: EmergencyAlert['status']) => {
    try {
      const response = await fetch(`/api/alerts/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        const data = await response.json();
        setAlerts(prev => prev.map(a => a.id === id ? data.alert : a));
      }
    } catch (err) {
      console.error('Failed to update alert dispatch', err);
    }
  };

  // Action: Resolve attendance anomaly
  const handleResolveAnomaly = async (id: string) => {
    try {
      const response = await fetch(`/api/anomalies/${id}/resolve`, {
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json();
        setAnomalies(prev => prev.map(anom => anom.id === id ? data.anomaly : anom));
      }
    } catch (err) {
      console.error('Failed to resolve anomaly', err);
    }
  };

  // Callback on newly saved triage records
  const handleTriageCreated = (newTriage: TriageResult, requirement: string) => {
    // Inject at top of client-side list
    setTriageRecords(prev => [newTriage, ...prev]);
    // Sync with backend to fetch updated alerts list immediately
    fetchOperationalData();
  };

  // Callback on newly completed attendance work check-in logs
  const handleLogValidated = (newLog: AttendanceLog, newAnomaly: LogAnomaly | null) => {
    setLogs(prev => [newLog, ...prev]);
    if (newAnomaly) {
      setAnomalies(prev => [newAnomaly, ...prev]);
    }
  };

  // Trigger rapid simulation of an emergency alert on-demand
  const triggerEmergencyAlert = async () => {
    const isPregnant = confirm('Is this emergency alert related to a maternal/pregnancy case?');
    const brief = isPregnant 
      ? 'Pregnant patient with sudden onset uterine hemorrhage and shock.' 
      : 'Severe pediatric case presenting with acute dehydration and severe diarrhea.';
    
    try {
      // Post a high-priority triage event which automatically generates an alert
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: brief,
          vitals: {
            pulse: 110,
            temp: 101.4,
            bloodPressure: '80/50',
            respiratoryRate: 28,
            oxygenSat: 88
          },
          patientDetails: {
            age: isPregnant ? 24 : 4,
            gender: isPregnant ? 'F' : 'Other',
            pregnancyStatus: isPregnant ? 'YES' : 'NO'
          },
          workerId: 'ASHA_ID-401'
        })
      });

      if (response.ok) {
        alert('🚨 Critical priority dispatch created! Central emergency ambulance services have been briefed via auto-routing channels.');
        fetchOperationalData();
      }
    } catch (err) {
      console.error('Failed to send rapid alert', err);
    }
  };

  // Render correct page body based on active tab state
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardTab 
            facilities={facilities}
            alerts={alerts}
            triageRecords={triageRecords}
            logs={logs}
            setActiveTab={setActiveTab}
            onUpdateAlertStatus={handleUpdateAlertStatus}
            triggerEmergencyAlert={triggerEmergencyAlert}
            openNewPatientIntake={() => setActiveTab('triage')}
          />
        );
      
      case 'patients':
        return (
          <div className="space-y-6">
            {/* Embedded navigation header inside Patients Tab for outstanding UI flow */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setPatientSubTab('directory')}
                className={`px-5 py-3 text-xs font-bold tracking-wide transition border-b-2 ${
                  patientSubTab === 'directory' 
                    ? 'border-medblue text-medblue' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                👤 Electronic Patient Directory
              </button>
              <button
                onClick={() => setPatientSubTab('attendance')}
                className={`px-5 py-3 text-xs font-bold tracking-wide transition border-b-2 ${
                  patientSubTab === 'attendance' 
                    ? 'border-medblue text-medblue' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                📍 Worker Geofence & Check-in Verification
              </button>
            </div>

            {patientSubTab === 'directory' ? (
              <PatientsDirectoryTab 
                triageRecords={triageRecords}
                facilities={facilities}
                setActiveTab={setActiveTab}
                openNewPatientIntake={() => setActiveTab('triage')}
              />
            ) : (
              <PatientManagementTab 
                logs={logs}
                anomalies={anomalies}
                onLogValidated={handleLogValidated}
                onResolveAnomaly={handleResolveAnomaly}
              />
            )}
          </div>
        );

      case 'triage':
        return (
          <TriageConsoleTab 
            facilities={facilities}
            onTriageCreated={handleTriageCreated}
          />
        );

      case 'resources':
        return (
          <ResourceLocatorTab 
            facilities={facilities}
            onUpdateOccupancy={handleUpdateOccupancy}
          />
        );

      case 'reports':
        return (
          <ReportsTab 
            facilities={facilities}
            triageRecords={triageRecords}
            alerts={alerts}
          />
        );

      case 'settings':
        return <SettingsTab />;

      default:
        return (
          <div className="p-8 text-center text-xs font-mono text-slate-400">
            Navigation node unrecognized.
          </div>
        );
    }
  };

  return (
    <MainLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      alerts={alerts}
      facilities={facilities}
      triageRecords={triageRecords}
      onUpdateAlertStatus={handleUpdateAlertStatus}
    >
      {/* Error display bar */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <UserX className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-semibold font-mono">{error}</p>
          </div>
          <button 
            onClick={fetchOperationalData}
            className="bg-rose-600 text-white hover:bg-rose-700 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main loading shroud */}
      {loading && facilities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-medblue rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-mono">Synchronizing regional health ledger index...</p>
        </div>
      ) : (
        renderActiveTab()
      )}
    </MainLayout>
  );
}
