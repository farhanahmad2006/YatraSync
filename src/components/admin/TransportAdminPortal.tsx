// Changes made by @MdFarhanAhmad
import React, { useState, useEffect } from 'react';
import {
  UserSession,
  FleetVehicleData,
  FleetDriverData,
  TransportTripAssignmentData,
  FleetAnalyticsData,
  TransportCredentialData,
  TransportChangeRequestData
} from '../../types';
import {
  Truck,
  Car,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Wrench,
  Plus,
  UserCheck,
  MapPin,
  Calendar,
  KeyRound,
  Search,
  Filter,
  Navigation,
  Activity,
  Award,
  Zap,
  Phone,
  Radio,
  FileCheck,
  TrendingUp,
  X,
  Check,
  AlertTriangle,
  FileText,
  RefreshCw,
  Sliders,
  CheckSquare,
  Building,
  UserPlus
} from 'lucide-react';
import { ChangePasswordModal } from '../modals/ChangePasswordModal';

interface TransportAdminPortalProps {
  user: UserSession;
  onNavigate: (view: any) => void;
}

const SAMPLE_VEHICLES: FleetVehicleData[] = [
  {
    id: 'veh-1',
    name: 'Tata Nexon EV Max (High-Range Long Distance)',
    manufacturer: 'Tata Motors',
    model: 'Nexon EV Max',
    variant: 'XZ+ Lux',
    modelYear: 2024,
    category: 'suv',
    seatingCapacity: 5,
    transmission: 'Automatic',
    fuelType: 'Electric',
    acAvailable: true,
    dailyRate: 3200,
    hourlyRate: 350,
    registrationState: 'KL-07',
    registrationNumber: 'KL-07-CS-4412',
    rentalLocation: 'Cochin Airport / Ernakulam Hub',
    vendorName: 'YatraSync Green Fleet Kerala',
    vendorPhone: '+91 98470 11223',
    vendorRating: 4.95,
    operationalStatus: 'AVAILABLE',
    assignedDriverId: 'dr-101',
    assignedDriverName: 'Suresh Kurup',
    fitnessCertificateExpiry: '2028-06-30',
    insurancePolicyNumber: 'ICICI-LOMB-9014812',
    insuranceExpiry: '2027-04-15',
    pucExpiry: '2026-12-31',
    lastMaintenanceDate: '2026-08-20',
    nextMaintenanceKm: 5000,
    photos: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80']
  },
  {
    id: 'veh-2',
    name: 'Toyota Innova Crysta 2.4 ZX (Hill Spec)',
    manufacturer: 'Toyota',
    model: 'Innova Crysta',
    variant: 'ZX 7-Seater',
    modelYear: 2024,
    category: 'muv',
    seatingCapacity: 7,
    transmission: 'Manual',
    fuelType: 'Diesel',
    acAvailable: true,
    dailyRate: 4800,
    registrationState: 'KL-07',
    registrationNumber: 'KL-07-DB-8819',
    rentalLocation: 'Munnar Base Station',
    vendorName: 'Highland Tour Transport',
    vendorPhone: '+91 94471 99001',
    vendorRating: 4.92,
    operationalStatus: 'ON_TRIP',
    assignedDriverId: 'dr-102',
    assignedDriverName: 'Kishore Nair',
    fitnessCertificateExpiry: '2028-10-15',
    insurancePolicyNumber: 'HDFC-ERGO-8841299',
    insuranceExpiry: '2027-08-30',
    pucExpiry: '2026-11-20',
    lastMaintenanceDate: '2026-09-01',
    nextMaintenanceKm: 3200,
    photos: ['https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=600&auto=format&fit=crop&q=80']
  },
  {
    id: 'veh-3',
    name: 'Force Urbania 12-Seater Luxury Tour Cruiser',
    manufacturer: 'Force Motors',
    model: 'Urbania Luxury',
    variant: 'Medium Wheelbase Executive',
    modelYear: 2024,
    category: 'tempo_traveller',
    seatingCapacity: 12,
    transmission: 'Manual',
    fuelType: 'Diesel',
    acAvailable: true,
    dailyRate: 8500,
    registrationState: 'KL-07',
    registrationNumber: 'KL-07-EU-1044',
    rentalLocation: 'Kochi - Munnar Expressway Corridor',
    vendorName: 'YatraSync Group Transit',
    vendorPhone: '+91 98460 33445',
    vendorRating: 4.98,
    operationalStatus: 'AVAILABLE',
    fitnessCertificateExpiry: '2029-01-10',
    insurancePolicyNumber: 'NEW-INDIA-5582910',
    insuranceExpiry: '2027-05-18',
    pucExpiry: '2026-10-12',
    lastMaintenanceDate: '2026-08-15',
    nextMaintenanceKm: 8000,
    photos: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80']
  }
];

const SAMPLE_DRIVERS: FleetDriverData[] = [
  {
    id: 'dr-101',
    fullName: 'Suresh Kurup',
    phone: '+91 98470 11223',
    drivingLicense: 'KL-07-2010-009481',
    licenseExpiry: '2032-12-31',
    aadhaarVerified: true,
    policeVerificationStatus: 'VERIFIED',
    vehicleModel: 'Tata Nexon EV Max',
    registrationNumber: 'KL-07-CS-4412',
    rating: 4.96,
    totalTrips: 218,
    languages: ['Malayalam', 'English', 'Hindi', 'Tamil'],
    specialties: ['Western Ghats Biodiversity', 'Spices & Plantations History', 'Eco Driving'],
    dutyStatus: 'AVAILABLE'
  },
  {
    id: 'dr-102',
    fullName: 'Kishore Nair',
    phone: '+91 94471 99001',
    drivingLicense: 'KL-07-2015-081294',
    licenseExpiry: '2035-08-10',
    aadhaarVerified: true,
    policeVerificationStatus: 'VERIFIED',
    vehicleModel: 'Toyota Innova Crysta',
    registrationNumber: 'KL-07-DB-8819',
    rating: 4.92,
    totalTrips: 184,
    languages: ['Malayalam', 'English', 'Tamil'],
    specialties: ['Munnar Ghat Road Expert', 'Plantation Storytelling'],
    dutyStatus: 'ON_DUTY'
  }
];

const SAMPLE_ASSIGNMENTS: TransportTripAssignmentData[] = [
  {
    id: 'tta-101',
    vehicleId: 'veh-2',
    vehicleName: 'Toyota Innova Crysta 2.4 ZX',
    registrationNumber: 'KL-07-DB-8819',
    driverId: 'dr-102',
    driverName: 'Kishore Nair',
    driverPhone: '+91 94471 99001',
    pickupLocation: 'Cochin International Airport (COK) Terminal 1',
    dropLocation: 'Munnar Tea Hills Heritage Resort',
    startTime: '2026-10-15T09:30:00Z',
    tripStatus: 'SCHEDULED',
    liveLat: 10.0889,
    liveLng: 77.0595,
    tourScheduleId: 'sch-101'
  }
];

export const TransportAdminPortal: React.FC<TransportAdminPortalProps> = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'drivers' | 'credentials' | 'changeRequests' | 'dispatch' | 'telemetry' | 'analytics'>('vehicles');
  const [vehicles, setVehicles] = useState<FleetVehicleData[]>(SAMPLE_VEHICLES);
  const [drivers, setDrivers] = useState<FleetDriverData[]>(SAMPLE_DRIVERS);
  const [assignments, setAssignments] = useState<TransportTripAssignmentData[]>(SAMPLE_ASSIGNMENTS);
  const [credentials, setCredentials] = useState<TransportCredentialData[]>([]);
  const [operators, setOperators] = useState<{ id: string; name: string; email: string; mobile?: string }[]>([]);
  const [changeRequests, setChangeRequests] = useState<TransportChangeRequestData[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [selectedVehicleForMaint, setSelectedVehicleForMaint] = useState<FleetVehicleData | null>(null);

  // Credentials & Change Requests Modals State
  const [isIssueCredModalOpen, setIsIssueCredModalOpen] = useState(false);
  const [selectedCredForManage, setSelectedCredForManage] = useState<TransportCredentialData | null>(null);
  const [isAssignVehModalOpen, setIsAssignVehModalOpen] = useState(false);
  const [isAssignDrModalOpen, setIsAssignDrModalOpen] = useState(false);
  const [selectedChangeReqForReview, setSelectedChangeReqForReview] = useState<TransportChangeRequestData | null>(null);

  // Issue Credential Form State
  const [issueOpId, setIssueOpId] = useState('');
  const [issueCredNum, setIssueCredNum] = useState('');
  const [issueCompliance, setIssueCompliance] = useState<'COMPLIANT' | 'NON_COMPLIANT' | 'UNDER_REVIEW'>('COMPLIANT');
  const [issueNotes, setIssueNotes] = useState('');
  const [issueVehIds, setIssueVehIds] = useState<string[]>([]);
  const [issueDrIds, setIssueDrIds] = useState<string[]>([]);

  // Assign form state
  const [targetVehId, setTargetVehId] = useState('');
  const [targetDrId, setTargetDrId] = useState('');

  // Review Change Request form state
  const [reviewNotes, setReviewNotes] = useState('');

  // New vehicle state
  const [newVehName, setNewVehName] = useState('');
  const [newVehModel, setNewVehModel] = useState('');
  const [newVehCategory, setNewVehCategory] = useState('suv');
  const [newVehSeats, setNewVehSeats] = useState(7);
  const [newVehFuel, setNewVehFuel] = useState('Diesel');
  const [newVehReg, setNewVehReg] = useState('');
  const [newVehRate, setNewVehRate] = useState(4200);

  // New driver state
  const [newDrName, setNewDrName] = useState('');
  const [newDrPhone, setNewDrPhone] = useState('');
  const [newDrLicense, setNewDrLicense] = useState('');

  // Dispatch state
  const [dispatchVehId, setDispatchVehId] = useState(vehicles[0]?.id || '');
  const [dispatchDrId, setDispatchDrId] = useState(drivers[0]?.id || '');
  const [dispatchPickup, setDispatchPickup] = useState('Cochin International Airport (COK)');
  const [dispatchDrop, setDispatchDrop] = useState('Munnar Tea Hills Heritage Resort');

  const showNotification = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // Fetch real backend data
  const fetchTransportData = async () => {
    try {
      const token = localStorage.getItem('safarsetu_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const [vRes, dRes, aRes, cRes, oRes, crRes] = await Promise.all([
        fetch('/api/v1/transport-admin/vehicles', { credentials: 'include', headers }),
        fetch('/api/v1/transport-admin/drivers', { credentials: 'include', headers }),
        fetch('/api/v1/transport-admin/trips/active', { credentials: 'include', headers }),
        fetch('/api/v1/transport-admin/credentials', { credentials: 'include', headers }),
        fetch('/api/v1/transport-admin/operators', { credentials: 'include', headers }),
        fetch('/api/v1/transport-admin/change-requests', { credentials: 'include', headers })
      ]);
      if (vRes.ok) {
        const vData = await vRes.json();
        if (Array.isArray(vData) && vData.length > 0) setVehicles(vData);
      }
      if (dRes.ok) {
        const dData = await dRes.json();
        if (Array.isArray(dData) && dData.length > 0) setDrivers(dData);
      }
      if (aRes.ok) {
        const aData = await aRes.json();
        if (Array.isArray(aData) && aData.length > 0) setAssignments(aData);
      }
      if (cRes.ok) {
        const cData = await cRes.json();
        if (Array.isArray(cData)) setCredentials(cData);
      }
      if (oRes.ok) {
        const oData = await oRes.json();
        if (Array.isArray(oData)) {
          setOperators(oData);
          if (oData.length > 0 && !issueOpId) setIssueOpId(oData[0].id);
        }
      }
      if (crRes.ok) {
        const crData = await crRes.json();
        if (Array.isArray(crData)) setChangeRequests(crData);
      }
    } catch (e) {
      console.log('Using local transport admin data:', e);
    }
  };

  useEffect(() => {
    fetchTransportData();
  }, []);

  const handleIssueCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueOpId) {
      showNotification('error', 'Please select a Tour Operator.');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('safarsetu_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      const payload = {
        tour_operator_id: issueOpId,
        credential_number: issueCredNum || `TC-${Date.now().toString().slice(-6)}`,
        compliance_status: issueCompliance,
        notes: issueNotes,
        vehicle_ids: issueVehIds,
        driver_ids: issueDrIds
      };
      const res = await fetch('/api/v1/transport-admin/credentials', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      if (res.ok) {
        showNotification('success', 'Transport Credential successfully issued.');
        setIsIssueCredModalOpen(false);
        setIssueCredNum('');
        setIssueNotes('');
        setIssueVehIds([]);
        setIssueDrIds([]);
        await fetchTransportData();
      } else {
        const err = await res.json().catch(() => ({}));
        showNotification('error', err.detail || 'Failed to issue credential');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Error issuing credential');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCredStatus = async (credId: string, status: string) => {
    try {
      const token = localStorage.getItem('safarsetu_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      const res = await fetch(`/api/v1/transport-admin/credentials/${credId}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status }),
        credentials: 'include'
      });
      if (res.ok) {
        showNotification('success', `Credential status updated to ${status}.`);
        await fetchTransportData();
      } else {
        showNotification('error', 'Failed to update credential status');
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleAssignVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCredForManage || !targetVehId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('safarsetu_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      const res = await fetch(`/api/v1/transport-admin/credentials/${selectedCredForManage.id}/vehicles`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ vehicle_id: targetVehId }),
        credentials: 'include'
      });
      if (res.ok) {
        showNotification('success', 'Vehicle assigned to credential.');
        setIsAssignVehModalOpen(false);
        setTargetVehId('');
        await fetchTransportData();
      } else {
        const err = await res.json().catch(() => ({}));
        showNotification('error', err.detail || 'Failed to assign vehicle');
      }
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnassignVehicle = async (credId: string, vehicleId: string) => {
    if (!confirm('Are you sure you want to unassign this vehicle from the tour operator credential?')) return;
    try {
      const token = localStorage.getItem('safarsetu_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`/api/v1/transport-admin/credentials/${credId}/vehicles/${vehicleId}`, {
        method: 'DELETE',
        headers,
        credentials: 'include'
      });
      if (res.ok) {
        showNotification('success', 'Vehicle unassigned successfully.');
        await fetchTransportData();
      } else {
        showNotification('error', 'Failed to unassign vehicle');
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleAssignDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCredForManage || !targetDrId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('safarsetu_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      const res = await fetch(`/api/v1/transport-admin/credentials/${selectedCredForManage.id}/drivers`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ driver_id: targetDrId }),
        credentials: 'include'
      });
      if (res.ok) {
        showNotification('success', 'Chauffeur assigned to credential.');
        setIsAssignDrModalOpen(false);
        setTargetDrId('');
        await fetchTransportData();
      } else {
        const err = await res.json().catch(() => ({}));
        showNotification('error', err.detail || 'Failed to assign chauffeur');
      }
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnassignDriver = async (credId: string, driverId: string) => {
    if (!confirm('Are you sure you want to unassign this chauffeur from the tour operator credential?')) return;
    try {
      const token = localStorage.getItem('safarsetu_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`/api/v1/transport-admin/credentials/${credId}/drivers/${driverId}`, {
        method: 'DELETE',
        headers,
        credentials: 'include'
      });
      if (res.ok) {
        showNotification('success', 'Chauffeur unassigned successfully.');
        await fetchTransportData();
      } else {
        showNotification('error', 'Failed to unassign chauffeur');
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleReviewChangeRequest = async (requestId: string, status: 'APPROVED' | 'REJECTED') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('safarsetu_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      const res = await fetch(`/api/v1/transport-admin/change-requests/${requestId}/review`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          status,
          reviewer_notes: reviewNotes || `Processed by Transport Admin (${status})`
        }),
        credentials: 'include'
      });
      if (res.ok) {
        showNotification('success', `Change request marked as ${status} and assignments updated.`);
        setSelectedChangeReqForReview(null);
        setReviewNotes('');
        await fetchTransportData();
      } else {
        const err = await res.json().catch(() => ({}));
        showNotification('error', err.detail || 'Failed to review change request');
      }
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehName) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('safarsetu_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      const payload = {
        destination_key: 'munnar',
        manufacturer: newVehName.split(' ')[0] || 'Toyota',
        model: newVehModel || newVehName,
        variant: 'Standard',
        model_year: 2024,
        name: newVehName,
        category: newVehCategory,
        seating_capacity: Number(newVehSeats) || 5,
        transmission: 'Manual',
        fuel_type: newVehFuel,
        ac_available: true,
        daily_rate: Number(newVehRate) || 3500,
        registration_state: 'KL-07',
        registration_number: newVehReg || `KL-07-${Math.floor(1000 + Math.random() * 9000)}`,
        rental_location: 'Kochi / Munnar Hub',
        vendor_name: 'YatraSync Fleet Hub',
        vendor_phone: '+91 98470 11111',
        supports_self_drive: true,
        supports_with_driver: true
      };

      const res = await fetch('/api/v1/transport-admin/vehicles', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (res.ok) {
        showNotification('success', `Vehicle '${newVehName}' registered successfully.`);
        setIsAddVehicleOpen(false);
        setNewVehName('');
        setNewVehModel('');
        setNewVehReg('');
        await fetchTransportData();
      } else {
        const err = await res.json().catch(() => ({}));
        showNotification('error', err.detail || 'Failed to register vehicle');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Error registering vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrName) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('safarsetu_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      const payload = {
        full_name: newDrName,
        phone: newDrPhone || '+91 98470 00000',
        driving_license: newDrLicense || `KL-07-2024-${Math.floor(100000 + Math.random() * 900000)}`,
        license_expiry: '2034-12-31',
        vehicle_model: 'Fleet Assigned',
        languages_json: ['Malayalam', 'English', 'Hindi'],
        specialties_json: ['Hill Driving Expert', 'Storytelling']
      };

      const res = await fetch('/api/v1/transport-admin/drivers', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (res.ok) {
        showNotification('success', `Chauffeur '${newDrName}' registered successfully.`);
        setIsAddDriverOpen(false);
        setNewDrName('');
        setNewDrPhone('');
        setNewDrLicense('');
        await fetchTransportData();
      } else {
        const err = await res.json().catch(() => ({}));
        showNotification('error', err.detail || 'Failed to register driver');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Error registering driver');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = vehicles.find(veh => veh.id === dispatchVehId) || vehicles[0];
    const d = drivers.find(dr => dr.id === dispatchDrId) || drivers[0];
    if (!v || !d) {
      showNotification('error', 'Please select a valid vehicle and chauffeur.');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('safarsetu_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      const payload = {
        vehicle_id: v.id,
        driver_id: d.id,
        pickup_location: dispatchPickup,
        drop_location: dispatchDrop,
        start_time: new Date().toISOString()
      };
      const res = await fetch('/api/v1/transport-admin/assignments', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      if (res.ok) {
        showNotification('success', 'Dispatch assignment scheduled successfully.');
        setIsDispatchModalOpen(false);
        await fetchTransportData();
      } else {
        const err = await res.json().catch(() => ({}));
        showNotification('error', err.detail || 'Failed to create dispatch assignment');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Error creating dispatch');
    } finally {
      setLoading(false);
    }
  };

  const activeVehiclesCount = vehicles.filter(v => v.operationalStatus === 'AVAILABLE').length;
  const onTripCount = vehicles.filter(v => v.operationalStatus === 'ON_TRIP').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Top Banner & Partner Role Identification */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 border-b border-blue-800/30 px-6 py-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Transport Infrastructure & Fleet Portal</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 border border-blue-400/40 text-blue-300">
                  TRANSPORT_ADMIN
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-2">
                <span>{user.name || 'YatraSync Fleet Operations'}</span>
                <span>•</span>
                <span className="text-blue-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Fleet & Chauffeur Ops Desk
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <KeyRound className="w-4 h-4 text-blue-400" />
              Change Password
            </button>

            <button
              onClick={() => setIsDispatchModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
            >
              <Navigation className="w-4 h-4" />
              Dispatch Trip Assignment
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {[
            { id: 'vehicles', label: 'Fleet & Maintenance', icon: Car },
            { id: 'drivers', label: 'Driver Registry & DigiLocker', icon: UserCheck },
            { id: 'credentials', label: 'Transport Credentials (Operator Issuance)', icon: ShieldCheck },
            { id: 'changeRequests', label: 'Change Requests', icon: AlertCircle },
            { id: 'dispatch', label: 'Dispatch & Assignments', icon: Navigation },
            { id: 'telemetry', label: 'Live Telemetry & GPS', icon: Radio },
            { id: 'analytics', label: 'Fleet Analytics', icon: TrendingUp }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: FLEET & VEHICLE MAINTENANCE */}
        {activeTab === 'vehicles' && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Multimodal Fleet Roster</h2>
                <p className="text-xs text-slate-400">Manage vehicle road fitness, PUC, insurance validity, and service intervals</p>
              </div>

              <button
                onClick={() => setIsAddVehicleOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20"
              >
                <Plus className="w-4 h-4" /> Add Fleet Vehicle
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map(v => (
                <div key={v.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-900">
                          {v.category}
                        </span>
                        <h3 className="text-base font-bold text-white mt-2 leading-snug">{v.name}</h3>
                        <span className="font-mono text-xs text-slate-400">{v.registrationNumber || 'KL-07-CS-4412'}</span>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        v.operationalStatus === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        v.operationalStatus === 'ON_TRIP' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {v.operationalStatus}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-xs text-slate-300">
                      <div className="flex items-center justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-500">Seating & Fuel</span>
                        <span>{v.seatingCapacity} Seats • {v.fuelType}</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-500">Fitness Cert Expiry</span>
                        <span className="text-emerald-400 font-medium">{v.fitnessCertificateExpiry || '2028-06-30'}</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-500">Insurance & PUC</span>
                        <span>Valid ({v.insuranceExpiry || '2027-04-15'})</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-slate-500">Assigned Driver</span>
                        <span className="font-semibold text-slate-200">{v.assignedDriverName || 'None'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Service in</span>
                      <span className="text-xs font-bold text-blue-400">{v.nextMaintenanceKm || 5000} KM</span>
                    </div>

                    <button
                      onClick={() => setSelectedVehicleForMaint(v)}
                      className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Wrench className="w-3.5 h-3.5" /> Log Service
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: DRIVER REGISTRY & DIGILOCKER */}
        {activeTab === 'drivers' && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Chauffeur & Driver Registry</h2>
                <p className="text-xs text-slate-400">DigiLocker Aadhaar & Police Background Verification Management</p>
              </div>

              <button
                onClick={() => setIsAddDriverOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20"
              >
                <Plus className="w-4 h-4" /> Register New Chauffeur
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {drivers.map(d => (
                <div key={d.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 font-bold text-base">
                        {d.fullName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">{d.fullName}</h4>
                        <span className="text-xs text-slate-400">{d.phone}</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      d.dutyStatus === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      d.dutyStatus === 'ON_DUTY' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {d.dutyStatus}
                    </span>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <FileCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-300">DigiLocker Aadhaar:</span>
                      <span className="text-emerald-400 font-semibold">VERIFIED</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-300">Police Check:</span>
                      <span className="text-emerald-400 font-semibold">{d.policeVerificationStatus}</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-500">Commercial DL</span>
                      <span className="font-mono text-slate-200">{d.drivingLicense || 'KL-07-2010-009481'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-500">Total Completed Trips</span>
                      <span className="font-bold text-white">{d.totalTrips} Trips</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Specialties</span>
                      <span className="text-slate-300 truncate max-w-xs">{d.specialties.join(', ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: TRANSPORT CREDENTIALS (TOUR OPERATOR ISSUANCE & FLEET ASSIGNMENT) */}
        {activeTab === 'credentials' && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  Tour Operator Transport Credentials Authority
                </h2>
                <p className="text-xs text-slate-400">
                  Transport Admin is the sole authority issuing official credentials and assigning vetted fleet vehicles & chauffeurs.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchTransportData}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  title="Refresh data"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
                <button
                  onClick={() => setIsIssueCredModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
                >
                  <Plus className="w-4 h-4" /> Issue Transport Credential
                </button>
              </div>
            </div>

            {/* Credential Authority Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Total Issued</span>
                <div className="text-2xl font-bold text-white mt-1">{credentials.length} Credentials</div>
                <div className="mt-1 text-xs text-blue-400 font-medium">Official Registry</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Active & Compliant</span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">
                  {credentials.filter(c => c.status === 'ACTIVE' && c.complianceStatus === 'COMPLIANT').length}
                </div>
                <div className="mt-1 text-xs text-emerald-500 font-medium">Full Operational Clearance</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Under Review / Pending</span>
                <div className="text-2xl font-bold text-amber-400 mt-1">
                  {credentials.filter(c => c.status === 'PENDING' || c.complianceStatus === 'UNDER_REVIEW').length}
                </div>
                <div className="mt-1 text-xs text-amber-500 font-medium">Audit Verification Queue</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Suspended / Deactivated</span>
                <div className="text-2xl font-bold text-rose-400 mt-1">
                  {credentials.filter(c => c.status === 'SUSPENDED' || c.status === 'DEACTIVATED').length}
                </div>
                <div className="mt-1 text-xs text-rose-400 font-medium">Restricted Tour Operations</div>
              </div>
            </div>

            {/* Credentials Roster */}
            {credentials.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No Transport Credentials Issued Yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
                  Issue the first credential to assign vetted vehicles and chauffeurs to an onboarding Tour Operator.
                </p>
                <button
                  onClick={() => setIsIssueCredModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Issue Credential Now
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {credentials.map(c => {
                  const activeAssignedVehicles = (c.assignedVehicles || []).filter(v => v.status === 'ACTIVE');
                  const activeAssignedDrivers = (c.assignedDrivers || []).filter(d => d.status === 'ACTIVE');
                  return (
                    <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all hover:border-slate-700">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
                              {c.credentialNumber}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              c.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              c.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                              'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}>
                              {c.status}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              c.complianceStatus === 'COMPLIANT' ? 'bg-emerald-500/10 text-emerald-300' :
                              'bg-rose-500/10 text-rose-300'
                            }`}>
                              {c.complianceStatus}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <span>{c.tourOperatorName || 'Tour Operator'}</span>
                            <span className="text-xs text-slate-500 font-mono font-normal">({c.tourOperatorId})</span>
                          </h3>
                          {c.notes && <p className="text-xs text-slate-400 italic">“{c.notes}”</p>}
                        </div>

                        {/* Status Change & Quick Action buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-slate-400">Status:</span>
                          <select
                            value={c.status}
                            onChange={(e) => handleUpdateCredStatus(c.id, e.target.value)}
                            className="bg-slate-950 border border-slate-700 text-white rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                          >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="PENDING">PENDING</option>
                            <option value="SUSPENDED">SUSPENDED</option>
                            <option value="DEACTIVATED">DEACTIVATED</option>
                          </select>

                          <button
                            onClick={() => {
                              setSelectedCredForManage(c);
                              setIsAssignVehModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5"
                          >
                            <Car className="w-3.5 h-3.5" /> + Assign Vehicle
                          </button>

                          <button
                            onClick={() => {
                              setSelectedCredForManage(c);
                              setIsAssignDrModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5"
                          >
                            <UserCheck className="w-3.5 h-3.5" /> + Assign Chauffeur
                          </button>
                        </div>
                      </div>

                      {/* Assigned Resources Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {/* Assigned Fleet Vehicles */}
                        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                              <Car className="w-4 h-4 text-blue-400" />
                              Assigned Fleet Vehicles ({activeAssignedVehicles.length})
                            </h4>
                          </div>

                          {activeAssignedVehicles.length === 0 ? (
                            <p className="text-xs text-slate-500 italic py-2">No vehicles currently assigned to this credential.</p>
                          ) : (
                            <div className="space-y-2">
                              {activeAssignedVehicles.map(av => (
                                <div key={av.id} className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs">
                                  <div>
                                    <div className="font-semibold text-white">{av.vehicle?.name || av.vehicleId}</div>
                                    <div className="text-[11px] text-slate-400">
                                      {av.vehicle?.registrationNumber || 'Fleet Unit'} • {av.vehicle?.seatingCapacity || 7} Seats • {av.vehicle?.fuelType || 'Diesel'}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleUnassignVehicle(c.id, av.vehicleId)}
                                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                                    title="Unassign Vehicle"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Assigned Drivers */}
                        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                              <UserCheck className="w-4 h-4 text-emerald-400" />
                              Assigned Vetted Chauffeurs ({activeAssignedDrivers.length})
                            </h4>
                          </div>

                          {activeAssignedDrivers.length === 0 ? (
                            <p className="text-xs text-slate-500 italic py-2">No chauffeurs currently assigned to this credential.</p>
                          ) : (
                            <div className="space-y-2">
                              {activeAssignedDrivers.map(ad => (
                                <div key={ad.id} className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs">
                                  <div>
                                    <div className="font-semibold text-white">{ad.driver?.fullName || ad.driverId}</div>
                                    <div className="text-[11px] text-slate-400">
                                      {ad.driver?.phone} • DL: {ad.driver?.drivingLicense || 'Verified'} • {ad.driver?.dutyStatus || 'AVAILABLE'}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleUnassignDriver(c.id, ad.driverId)}
                                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                                    title="Unassign Chauffeur"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB: CHANGE REQUESTS (OPERATOR FLEET & DRIVER UPGRADES) */}
        {activeTab === 'changeRequests' && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  Tour Operator Fleet Change Requests
                </h2>
                <p className="text-xs text-slate-400">
                  Review and adjudicate formal requests for vehicle/driver upgrades, additions, and route capacity scaling.
                </p>
              </div>

              <button
                onClick={fetchTransportData}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>

            {changeRequests.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">All Clear — No Pending Change Requests</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  Tour Operator upgrade and substitution requests will appear here in real-time for Transport Authority review.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {changeRequests.map(req => (
                  <div key={req.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {req.requestType}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            req.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            req.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                            'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {req.status}
                          </span>
                          <span className="text-xs font-mono text-slate-500">{req.id}</span>
                        </div>
                        <h4 className="text-base font-bold text-white mt-1">
                          Operator: {req.tourOperatorName || req.tourOperatorId}
                        </h4>
                      </div>

                      <div className="text-xs text-slate-400">
                        {req.createdAt ? new Date(req.createdAt).toLocaleString() : 'Recent Request'}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
                          Operator Justification
                        </span>
                        <p className="text-slate-200">{req.justification || 'No justification provided.'}</p>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
                          Requested Changes Data
                        </span>
                        <pre className="text-[11px] font-mono text-blue-300 overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(req.requestedChangesJson, null, 2)}
                        </pre>
                      </div>
                    </div>

                    {req.status === 'PENDING' ? (
                      <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            Reviewer Notes / Instructions for Operator:
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Approved and replaced vehicle in credential assignment."
                            value={selectedChangeReqForReview?.id === req.id ? reviewNotes : ''}
                            onChange={(e) => {
                              setSelectedChangeReqForReview(req);
                              setReviewNotes(e.target.value);
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-3">
                          <button
                            disabled={loading}
                            onClick={() => handleReviewChangeRequest(req.id, 'REJECTED')}
                            className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                          >
                            <X className="w-3.5 h-3.5" /> Reject Request
                          </button>
                          <button
                            disabled={loading}
                            onClick={() => handleReviewChangeRequest(req.id, 'APPROVED')}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve & Update Assignments
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                        <span>Reviewed By: {req.reviewerName || req.reviewerId || 'Transport Admin'}</span>
                        <span>Notes: {req.reviewerNotes || 'None'}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DISPATCH & ASSIGNMENTS */}
        {activeTab === 'dispatch' && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Active Dispatch & Trip Assignments</h2>
                <p className="text-xs text-slate-400">Scheduled transfers, tour linkages, and customer airport pickups</p>
              </div>

              <button
                onClick={() => setIsDispatchModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> New Dispatch
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Assignment ID</th>
                      <th className="px-6 py-4">Vehicle</th>
                      <th className="px-6 py-4">Chauffeur</th>
                      <th className="px-6 py-4">Pickup / Drop Route</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Telemetry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {assignments.map(a => (
                      <tr key={a.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4 font-mono text-blue-400 font-semibold">{a.id}</td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-white">{a.vehicleName}</div>
                          <div className="text-slate-400 text-[11px] font-mono">{a.registrationNumber}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-200">{a.driverName}</div>
                          <div className="text-slate-400 text-[11px]">{a.driverPhone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-200">{a.pickupLocation}</div>
                          <div className="text-slate-400 text-[11px]">➔ {a.dropLocation}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            {a.tripStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-emerald-400">
                          {a.liveLat.toFixed(4)}, {a.liveLng.toFixed(4)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TELEMETRY */}
        {activeTab === 'telemetry' && (
          <div className="mt-6 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Radio className="w-6 h-6 text-emerald-400 animate-pulse" />
                  <div>
                    <h3 className="text-base font-bold text-white">Active Fleet Telemetry Stream</h3>
                    <p className="text-xs text-slate-400">High-altitude Western Ghats GPS transponder feed</p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ALL_SYSTEMS_NOMINAL
                </span>
              </div>

              <div className="h-64 bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
                <div className="text-center p-6 space-y-2">
                  <MapPin className="w-10 h-10 text-blue-400 mx-auto animate-bounce" />
                  <h4 className="text-sm font-semibold text-white">Live Route Telemetry: NH85 Kochi-Munnar Corridor</h4>
                  <p className="text-xs text-slate-400">
                    2 Active Transponders reporting coordinates • Speed avg: 42 km/h • Hill-descent safety threshold active.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: FLEET ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Total Fleet Vehicles</span>
                <div className="text-2xl font-bold text-white mt-1">{vehicles.length} Units</div>
                <div className="mt-2 text-xs text-blue-400">{activeVehiclesCount} Available • {onTripCount} On Trip</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Fleet Health Index</span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">98.6%</div>
                <div className="mt-2 text-xs text-slate-400">0 Overdue Inspections</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Driver Safety Score</span>
                <div className="text-2xl font-bold text-white mt-1">99.2 / 100</div>
                <div className="mt-2 text-xs text-emerald-400">100% Police Verified</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Active Dispatches</span>
                <div className="text-2xl font-bold text-white mt-1">{assignments.length} Scheduled</div>
                <div className="mt-2 text-xs text-slate-500">Zero Breakdown Rate</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ADD VEHICLE MODAL */}
      {isAddVehicleOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Add Fleet Vehicle</h3>
              <button onClick={() => setIsAddVehicleOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Vehicle Name / Model</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Toyota Innova Crysta ZX"
                  value={newVehName}
                  onChange={e => setNewVehName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={newVehCategory}
                    onChange={e => setNewVehCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="suv">SUV</option>
                    <option value="muv">MUV</option>
                    <option value="tempo_traveller">Tempo Traveller</option>
                    <option value="sedan">Sedan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Fuel Type</label>
                  <select
                    value={newVehFuel}
                    onChange={e => setNewVehFuel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Electric">Electric</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    value={newVehSeats}
                    onChange={e => setNewVehSeats(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Registration No</label>
                  <input
                    type="text"
                    placeholder="KL-07-XX-1234"
                    value={newVehReg}
                    onChange={e => setNewVehReg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddVehicleOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Register Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD DRIVER MODAL */}
      {isAddDriverOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Register Chauffeur</h3>
              <button onClick={() => setIsAddDriverOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDriver} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Sharma"
                  value={newDrName}
                  onChange={e => setNewDrName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 00000"
                  value={newDrPhone}
                  onChange={e => setNewDrPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Commercial Driving License</label>
                <input
                  type="text"
                  placeholder="e.g. KL-07-2020-008129"
                  value={newDrLicense}
                  onChange={e => setNewDrLicense(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddDriverOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Save Chauffeur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISPATCH MODAL */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Create Dispatch Assignment</h3>
              <button onClick={() => setIsDispatchModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDispatch} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Fleet Vehicle</label>
                <select
                  value={dispatchVehId}
                  onChange={e => setDispatchVehId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.registrationNumber || 'No Reg'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Assign Chauffeur</label>
                <select
                  value={dispatchDrId}
                  onChange={e => setDispatchDrId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>{d.fullName} (Rating: {d.rating})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Pickup Location</label>
                <input
                  type="text"
                  value={dispatchPickup}
                  onChange={e => setDispatchPickup(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Drop Location</label>
                <input
                  type="text"
                  value={dispatchDrop}
                  onChange={e => setDispatchDrop(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ISSUE CREDENTIAL MODAL */}
      {isIssueCredModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  Issue Tour Operator Transport Credential
                </h3>
                <p className="text-xs text-slate-400">Authorizes Tour Operator and links vetted fleet resources</p>
              </div>
              <button onClick={() => setIsIssueCredModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueCredential} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Tour Operator *</label>
                <select
                  required
                  value={issueOpId}
                  onChange={(e) => setIssueOpId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Choose Operator --</option>
                  {operators.map(op => (
                    <option key={op.id} value={op.id}>
                      {op.name} ({op.email}) — ID: {op.id}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Credential Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. TC-KL-2026-009"
                    value={issueCredNum}
                    onChange={(e) => setIssueCredNum(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Compliance Status</label>
                  <select
                    value={issueCompliance}
                    onChange={(e: any) => setIssueCompliance(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="COMPLIANT">COMPLIANT</option>
                    <option value="UNDER_REVIEW">UNDER REVIEW</option>
                    <option value="NON_COMPLIANT">NON COMPLIANT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Authorization Notes / Regional Scope</label>
                <input
                  type="text"
                  placeholder="e.g. Cleared for Kerala High-Range & Golden Triangle operations."
                  value={issueNotes}
                  onChange={(e) => setIssueNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Assign Initial Vehicles</label>
                <div className="max-h-32 overflow-y-auto space-y-1.5 p-2 bg-slate-950 rounded-xl border border-slate-800">
                  {vehicles.map(v => {
                    const isChecked = issueVehIds.includes(v.id);
                    return (
                      <label key={v.id} className="flex items-center gap-2 p-1.5 hover:bg-slate-900 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) setIssueVehIds([...issueVehIds, v.id]);
                            else setIssueVehIds(issueVehIds.filter(id => id !== v.id));
                          }}
                          className="rounded border-slate-700 bg-slate-900 text-blue-500"
                        />
                        <span className="text-white font-medium">{v.name}</span>
                        <span className="text-slate-400 font-mono text-[10px]">({v.registrationNumber || v.id})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Assign Initial Chauffeurs</label>
                <div className="max-h-32 overflow-y-auto space-y-1.5 p-2 bg-slate-950 rounded-xl border border-slate-800">
                  {drivers.map(d => {
                    const isChecked = issueDrIds.includes(d.id);
                    return (
                      <label key={d.id} className="flex items-center gap-2 p-1.5 hover:bg-slate-900 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) setIssueDrIds([...issueDrIds, d.id]);
                            else setIssueDrIds(issueDrIds.filter(id => id !== d.id));
                          }}
                          className="rounded border-slate-700 bg-slate-900 text-blue-500"
                        />
                        <span className="text-white font-medium">{d.fullName}</span>
                        <span className="text-slate-400 text-[10px]">({d.phone} • {d.policeVerificationStatus})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsIssueCredModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/20"
                >
                  {loading ? 'Issuing...' : 'Issue Credential & Persist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN VEHICLE MODAL */}
      {isAssignVehModalOpen && selectedCredForManage && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-400" />
                Assign Fleet Vehicle to {selectedCredForManage.credentialNumber}
              </h3>
              <button onClick={() => setIsAssignVehModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignVehicle} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Vehicle</label>
                <select
                  required
                  value={targetVehId}
                  onChange={(e) => setTargetVehId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Choose Vehicle --</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.registrationNumber || v.id}) • {v.seatingCapacity} Seats
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAssignVehModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !targetVehId}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  {loading ? 'Assigning...' : 'Assign Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN DRIVER MODAL */}
      {isAssignDrModalOpen && selectedCredForManage && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                Assign Chauffeur to {selectedCredForManage.credentialNumber}
              </h3>
              <button onClick={() => setIsAssignDrModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignDriver} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Chauffeur</label>
                <select
                  required
                  value={targetDrId}
                  onChange={(e) => setTargetDrId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Choose Chauffeur --</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.fullName} ({d.phone}) • {d.policeVerificationStatus}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAssignDrModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !targetDrId}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  {loading ? 'Assigning...' : 'Assign Chauffeur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING STATUS TOAST */}
      {statusMsg && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border text-xs font-semibold shadow-2xl flex items-center gap-2 transition-all ${
          statusMsg.type === 'success'
            ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40 shadow-emerald-900/40'
            : 'bg-rose-950/90 text-rose-300 border-rose-500/40 shadow-rose-900/40'
        }`}>
          {statusMsg.type === 'success' ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
          {statusMsg.text}
        </div>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};
