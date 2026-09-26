// Changes made by @MdFarhanAhmad
import React, { useState, useEffect } from 'react';
import {
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Eye,
  EyeOff,
  KeyRound,
  Copy,
  Check,
  ShieldCheck,
  FileCheck,
  MapPin,
  Phone,
  Mail,
  Users,
  Bed,
  Layers,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  MessageSquare,
  PauseCircle,
  PlayCircle,
  PlusCircle,
  UserPlus,
  Lock,
  Unlock,
  Ban
} from 'lucide-react';
import { UserSession, HotelPropertyData, PropertyApprovalStatus } from '../../types';

interface HotelAdminPortalProps {
  user: UserSession;
  onNavigate: (view: any) => void;
}

export const HotelAdminPortal: React.FC<HotelAdminPortalProps> = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'owners' | 'analytics' | 'audit'>('pending');
  const [pendingHotels, setPendingHotels] = useState<HotelPropertyData[]>([]);
  const [allHotels, setAllHotels] = useState<HotelPropertyData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Inspection & Action Modal State
  const [inspectHotel, setInspectHotel] = useState<HotelPropertyData | null>(null);
  const [decisionModal, setDecisionModal] = useState<{
    hotel: HotelPropertyData;
    action: 'APPROVE' | 'REJECT' | 'CHANGES' | 'SUSPEND' | 'ACTIVATE' | 'BLOCK' | 'UNBLOCK';
  } | null>(null);
  const [decisionNote, setDecisionNote] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Create Hotel & Assign Owner Modal State
  const [showCreateHotelModal, setShowCreateHotelModal] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [createForm, setCreateForm] = useState({
    propertyName: '',
    propertyType: 'homestay' as 'hotel' | 'resort' | 'homestay' | 'ecolodge' | 'heritage',
    ownerName: '',
    ownerId: '',
    ownerPassword: '',
    contactPhone: '',
    contactEmail: '',
    addressLine: '',
    city: 'Kochi',
    state: 'Kerala',
    pincode: '682001',
    roomCount: 4,
    baseTariffINR: 2200,
    description: '',
    panNumber: 'ABCDE1234F',
    gstin: '32ABCDE1234F1Z5'
  });

  // Assign Owner Modal State
  const [assignOwnerModal, setAssignOwnerModal] = useState<{ hotel: HotelPropertyData } | null>(null);
  const [showAssignPassword, setShowAssignPassword] = useState(false);
  const [assignOwnerForm, setAssignOwnerForm] = useState({
    ownerId: '',
    ownerName: '',
    password: '',
    mobile: '',
    notes: ''
  });

  // Credential Modal State for Admin sharing
  const [credentialModal, setCredentialModal] = useState<{
    title: string;
    propertyName: string;
    ownerName: string;
    loginId: string;
    password?: string;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const generateRandomPassword = (target: 'assign' | 'create') => {
    const specialChars = '@#$&*!';
    const randomChar = specialChars[Math.floor(Math.random() * specialChars.length)];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const generated = `Safar${randomChar}${randomNum}`;
    if (target === 'assign') {
      setAssignOwnerForm(prev => ({ ...prev, password: generated }));
      setShowAssignPassword(true);
    } else {
      setCreateForm(prev => ({ ...prev, ownerPassword: generated }));
      setShowCreatePassword(true);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 3000);
  };

  // Initial Sample Properties if none returned by backend
  const SAMPLE_PENDING: HotelPropertyData[] = [
    {
      id: 'prop-102',
      propertyName: 'Wayanad Wild Rainforest Heritage Lodge',
      propertyType: 'resort',
      ownerName: 'George Kurian',
      contactPhone: '+91 98460 11223',
      contactEmail: 'george@wayanadwild.in',
      address: {
        line: 'Lakkidi Ghat View, Rainforest Edge',
        city: 'Wayanad',
        state: 'Kerala',
        pincode: '673577',
        landmark: 'Near Chain Tree'
      },
      details: {
        roomCount: 8,
        baseTariffINR: 3400,
        description: 'Eco-certified bamboo and teak forest chalets with zero plastic footprint, guided canopy walks, and tribal organic food.',
        amenities: ['Wi-Fi', 'Forest View Balcony', 'Organic Breakfast', 'Ayurvedic Wellness', '24x7 Power Backup'],
        photos: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80']
      },
      verification: {
        panNumber: 'FGHIJ5678K',
        gstin: '32FGHIJ5678K1Z2',
        digiLockerVerified: true,
        documentUrls: ['https://yatrasync.gov.in/docs/ktdc-cert-102.pdf']
      },
      approvalStatus: 'UNDER_REVIEW',
      rating: 4.9,
      totalBookings: 0,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: 'prop-103',
      propertyName: 'Fort Kochi Heritage Sea Breeze Homestay',
      propertyType: 'homestay',
      ownerName: 'Savio Fernandez',
      contactPhone: '+91 94471 22334',
      contactEmail: 'savio@fortkochistay.in',
      address: {
        line: 'Princess Street, Fort Kochi',
        city: 'Kochi',
        state: 'Kerala',
        pincode: '682001',
        landmark: 'Near Santa Cruz Basilica'
      },
      details: {
        roomCount: 4,
        baseTariffINR: 1950,
        description: '300-year-old Portuguese colonial villa with courtyard gardens, seafood culinary experiences, and bike rentals.',
        amenities: ['Wi-Fi', 'Air Conditioning', 'Free Breakfast', 'Attached Bath', 'Bicycle Rental'],
        photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80']
      },
      verification: {
        panNumber: 'KLMNO9012P',
        gstin: '32KLMNO9012P1Z8',
        digiLockerVerified: true,
        documentUrls: ['https://yatrasync.gov.in/docs/homestay-cert-103.pdf']
      },
      approvalStatus: 'SUBMITTED',
      rating: 4.8,
      totalBookings: 0,
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
    }
  ];

  const SAMPLE_APPROVED: HotelPropertyData[] = [
    {
      id: 'prop-101',
      propertyName: 'Munnar Tea Hills Heritage Resort',
      propertyType: 'resort',
      ownerName: 'Mathew Joseph',
      contactPhone: '+91 94471 88990',
      contactEmail: 'mathew@munnarteahills.in',
      address: {
        line: 'Pothamedu Viewpoint Road, Silent Valley',
        city: 'Munnar',
        state: 'Kerala',
        pincode: '685612',
        landmark: 'Near Tata Tea Museum'
      },
      details: {
        roomCount: 12,
        baseTariffINR: 2800,
        description: 'Luxury organic tea mountain resort with 360-degree plantation views, Ayurvedic spa, and traditional Kerala cuisine.',
        amenities: ['Wi-Fi', 'Valley View Balcony', 'Ayurvedic Spa', 'Free Breakfast', '24x7 Power Backup', 'Parking'],
        photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80']
      },
      verification: {
        panNumber: 'ABCDE1234F',
        gstin: '32ABCDE1234F1Z5',
        digiLockerVerified: true,
        documentUrls: ['https://yatrasync.gov.in/docs/ktdc-cert-101.pdf']
      },
      approvalStatus: 'APPROVED',
      rating: 4.85,
      totalBookings: 42,
      createdAt: new Date(Date.now() - 3600000 * 240).toISOString()
    }
  ];

  const getAuthHeaders = () => {
    const token = localStorage.getItem('safarsetu_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  };

  const fetchHotelsData = async () => {
    setIsLoading(true);
    try {
      const authHdrs = getAuthHeaders();
      const [pendingRes, allRes] = await Promise.all([
        fetch('/api/admin/hotels/pending', { headers: authHdrs }).catch(() => null),
        fetch('/api/admin/hotels/all', { headers: authHdrs }).catch(() => null)
      ]);

      if (pendingRes && pendingRes.ok) {
        const data = await pendingRes.json();
        setPendingHotels(Array.isArray(data) ? data : []);
      } else {
        setPendingHotels(SAMPLE_PENDING);
      }

      if (allRes && allRes.ok) {
        const data = await allRes.json();
        setAllHotels(Array.isArray(data) ? data : []);
      } else {
        setAllHotels([...SAMPLE_APPROVED, ...SAMPLE_PENDING]);
      }
    } catch (e) {
      setPendingHotels(SAMPLE_PENDING);
      setAllHotels([...SAMPLE_APPROVED, ...SAMPLE_PENDING]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelsData();
  }, []);

  // Execute Hotel Admin Actions
  const handleExecuteDecision = async () => {
    if (!decisionModal) return;
    const { hotel, action } = decisionModal;
    setIsLoading(true);

    try {
      let endpoint = '';
      let payload: any = {};

      if (action === 'APPROVE') {
        endpoint = `/api/admin/hotels/${hotel.id}/approve`;
        payload = { notes: decisionNote };
      } else if (action === 'REJECT') {
        endpoint = `/api/admin/hotels/${hotel.id}/reject`;
        payload = { reason: decisionNote || 'Registration does not fulfill zero-surcharge criteria.' };
      } else if (action === 'CHANGES') {
        endpoint = `/api/admin/hotels/${hotel.id}/request-changes`;
        payload = { notes: decisionNote || 'Please update room photos and provide updated GST document.' };
      } else if (action === 'SUSPEND') {
        endpoint = `/api/admin/hotels/${hotel.id}/suspend`;
        payload = { reason: decisionNote || 'Operational review in progress.' };
      } else if (action === 'ACTIVATE') {
        endpoint = `/api/admin/hotels/${hotel.id}/activate`;
      } else if (action === 'BLOCK') {
        endpoint = `/api/admin/hotels/${hotel.id}/block`;
        payload = { reason: decisionNote || 'Access blocked by platform administrator.' };
      } else if (action === 'UNBLOCK') {
        endpoint = `/api/admin/hotels/${hotel.id}/unblock`;
      }

      await fetch(endpoint, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      // Update local state optimistically
      const newStatus: PropertyApprovalStatus = 
        action === 'APPROVE' ? 'APPROVED' :
        action === 'REJECT' ? 'REJECTED' :
        action === 'CHANGES' ? 'CHANGES_REQUESTED' :
        action === 'SUSPEND' ? 'SUSPENDED' :
        action === 'BLOCK' ? 'BLOCKED' :
        action === 'UNBLOCK' ? 'APPROVED' : 'ACTIVE';

      setPendingHotels(prev => prev.filter(h => h.id !== hotel.id));
      setAllHotels(prev => prev.map(h => h.id === hotel.id ? { ...h, approvalStatus: newStatus } : h));

      setActionSuccessMsg(`Successfully executed action '${action}' for property "${hotel.propertyName}".`);
      setTimeout(() => setActionSuccessMsg(null), 4500);
    } catch (err) {
      setActionSuccessMsg(`Action updated locally for "${hotel.propertyName}".`);
      setTimeout(() => setActionSuccessMsg(null), 4500);
    } finally {
      setIsLoading(false);
      setDecisionModal(null);
      setDecisionNote('');
      if (inspectHotel?.id === hotel.id) setInspectHotel(null);
    }
  };

  const handleCreateHotelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        propertyName: createForm.propertyName,
        propertyType: createForm.propertyType,
        ownerId: createForm.ownerId || undefined,
        ownerName: createForm.ownerName,
        ownerPassword: createForm.ownerPassword || undefined,
        contactPhone: createForm.contactPhone,
        contactEmail: createForm.contactEmail,
        address: {
          line: createForm.addressLine || 'Main Road',
          city: createForm.city,
          state: createForm.state,
          pincode: createForm.pincode
        },
        details: {
          roomCount: Number(createForm.roomCount) || 1,
          baseTariffINR: Number(createForm.baseTariffINR) || 1800,
          description: createForm.description || 'Partner hotel property created by Admin.',
          amenities: ['Wi-Fi', 'Free Breakfast', 'Attached Bath'],
          photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80']
        },
        verification: {
          panNumber: createForm.panNumber,
          gstin: createForm.gstin,
          digiLockerVerified: true
        },
        approvalStatus: 'APPROVED'
      };

      const res = await fetch('/api/admin/hotels/create', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      }).catch(() => null);

      let createdProp: HotelPropertyData;
      let effectiveLoginId = createForm.contactEmail || createForm.ownerId || 'owner';
      let effectivePassword = createForm.ownerPassword || 'Owner@123';

      if (res && res.ok) {
        const data = await res.json();
        createdProp = data.property || {
          ...payload,
          id: `prop-${Date.now()}`,
          createdAt: new Date().toISOString(),
          details: payload.details,
          verification: { ...payload.verification, documentUrls: [] },
          approvalStatus: 'APPROVED',
          rating: 4.9,
          totalBookings: 0
        };
        if (data.credentials?.loginId) {
          effectiveLoginId = data.credentials.loginId;
        }
      } else {
        createdProp = {
          id: `prop-${Date.now()}`,
          propertyName: createForm.propertyName,
          propertyType: createForm.propertyType,
          ownerId: createForm.ownerId || 'owner-sample-1',
          ownerName: createForm.ownerName,
          contactPhone: createForm.contactPhone,
          contactEmail: createForm.contactEmail,
          address: {
            line: createForm.addressLine || 'Main Road',
            city: createForm.city,
            state: createForm.state,
            pincode: createForm.pincode
          },
          details: {
            roomCount: Number(createForm.roomCount) || 1,
            baseTariffINR: Number(createForm.baseTariffINR) || 1800,
            description: createForm.description,
            amenities: ['Wi-Fi', 'Free Breakfast'],
            photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80']
          },
          verification: {
            panNumber: createForm.panNumber,
            gstin: createForm.gstin,
            digiLockerVerified: true,
            documentUrls: []
          },
          approvalStatus: 'APPROVED',
          rating: 4.9,
          totalBookings: 0,
          createdAt: new Date().toISOString()
        };
      }

      setAllHotels(prev => [createdProp, ...prev]);
      setShowCreateHotelModal(false);

      // Open credentials share modal
      setCredentialModal({
        title: 'Hotel Created & Owner Credentials Ready',
        propertyName: createdProp.propertyName,
        ownerName: createdProp.ownerName,
        loginId: effectiveLoginId,
        password: effectivePassword
      });

      setCreateForm({
        propertyName: '',
        propertyType: 'homestay',
        ownerName: '',
        ownerId: '',
        ownerPassword: '',
        contactPhone: '',
        contactEmail: '',
        addressLine: '',
        city: 'Kochi',
        state: 'Kerala',
        pincode: '682001',
        roomCount: 4,
        baseTariffINR: 2200,
        description: '',
        panNumber: 'ABCDE1234F',
        gstin: '32ABCDE1234F1Z5'
      });
      setShowCreatePassword(false);
      setActionSuccessMsg(`Successfully created hotel "${createdProp.propertyName}" and assigned to "${createdProp.ownerName}".`);
      setTimeout(() => setActionSuccessMsg(null), 5000);
    } catch (err) {
      setActionSuccessMsg('Hotel created locally.');
      setTimeout(() => setActionSuccessMsg(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignOwnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignOwnerModal) return;
    setIsLoading(true);
    try {
      const hotel = assignOwnerModal.hotel;
      const res = await fetch(`/api/admin/hotels/${hotel.id}/assign-owner`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(assignOwnerForm)
      }).catch(() => null);

      let loginIdentifier = assignOwnerForm.ownerId;
      let updatedOwnerName = assignOwnerForm.ownerName || assignOwnerForm.ownerId;
      let updatedOwnerId = assignOwnerForm.ownerId;

      if (res && res.ok) {
        const data = await res.json();
        if (data.loginId) loginIdentifier = data.loginId;
        if (data.ownerId) updatedOwnerId = data.ownerId;
        if (data.ownerName) updatedOwnerName = data.ownerName;
      } else {
        const errData = await res?.json().catch(() => ({}));
        const errDetail = errData?.detail || 'Failed to update hotel owner assignment in database.';
        setActionSuccessMsg(`Error: ${errDetail}`);
        setTimeout(() => setActionSuccessMsg(null), 5000);
        setIsLoading(false);
        return;
      }

      setAllHotels(prev => prev.map(h => {
        if (h.id === hotel.id) {
          return {
            ...h,
            ownerId: updatedOwnerId,
            ownerName: updatedOwnerName,
            contactEmail: assignOwnerForm.ownerId.includes('@') ? assignOwnerForm.ownerId : h.contactEmail
          };
        }
        return h;
      }));

      setPendingHotels(prev => prev.map(h => {
        if (h.id === hotel.id) {
          return {
            ...h,
            ownerId: updatedOwnerId,
            ownerName: updatedOwnerName,
            contactEmail: assignOwnerForm.ownerId.includes('@') ? assignOwnerForm.ownerId : h.contactEmail
          };
        }
        return h;
      }));

      // Open credentials share modal
      setCredentialModal({
        title: 'Hotel Owner Assigned & Login Configured',
        propertyName: hotel.propertyName,
        ownerName: updatedOwnerName,
        loginId: loginIdentifier,
        password: assignOwnerForm.password || 'Owner@123'
      });

      setActionSuccessMsg(`Hotel "${hotel.propertyName}" successfully assigned to owner "${updatedOwnerName}".`);
      setTimeout(() => setActionSuccessMsg(null), 5000);
      setAssignOwnerModal(null);
      setAssignOwnerForm({ ownerId: '', ownerName: '', password: '', mobile: '', notes: '' });
      setShowAssignPassword(false);
    } catch (err: any) {
      setActionSuccessMsg(`Failed to assign owner: ${err.message || 'Network error'}`);
      setTimeout(() => setActionSuccessMsg(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // KPI Calculations
  const pendingCount = pendingHotels.length;
  const approvedCount = allHotels.filter(h => ['APPROVED', 'ACTIVE'].includes(h.approvalStatus)).length;
  const totalRoomsCount = allHotels.reduce((acc, h) => acc + (h.details?.roomCount || 0), 0);
  const totalBookingsCount = allHotels.reduce((acc, h) => acc + (h.totalBookings || 0), 0);

  // Filtered Hotels list
  const filteredAllHotels = allHotels.filter(h => {
    const matchesSearch = 
      h.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || h.approvalStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-24">
      {/* Top Header Banner */}
      <div className="bg-slate-950/80 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-lg shadow-indigo-900/30">
              <Building2 className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white">Platform Hotel Administration Desk</h1>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700/60 uppercase tracking-widest">
                  Staff Portal
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Governance, Onboarding Reviews, DigiLocker KYC Audits & Multi-Property Inventory Controls
              </p>
            </div>
          </div>

          {/* Quick Refresh & Role Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={fetchHotelsData}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
              <span>Refresh Desk</span>
            </button>
            <div className="px-3 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-800/80 text-xs text-indigo-200 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold">{user.name} ({user.role})</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-6">
        
        {/* Flash Message Toast */}
        {actionSuccessMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-sm font-semibold flex items-center gap-3 shadow-lg animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* KPI METRIC CARDS                                              */}
        {/* ============================================================ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div 
            onClick={() => setActiveTab('pending')}
            className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-amber-950/30 border-amber-500/60 shadow-lg shadow-amber-950/20'
                : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Pending Reviews</span>
              <div className="w-8 h-8 rounded-lg bg-amber-900/40 text-amber-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{pendingCount}</div>
            <p className="text-[11px] text-slate-400 mt-1">Requires platform staff audit</p>
          </div>

          <div 
            onClick={() => setActiveTab('all')}
            className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer ${
              activeTab === 'all'
                ? 'bg-indigo-950/30 border-indigo-500/60 shadow-lg shadow-indigo-950/20'
                : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Active Properties</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-900/40 text-indigo-400 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{approvedCount}</div>
            <p className="text-[11px] text-slate-400 mt-1">Discoverable with 0% markup</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Total Rooms</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-900/40 text-emerald-400 flex items-center justify-center">
                <Bed className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{totalRoomsCount}</div>
            <p className="text-[11px] text-slate-400 mt-1">Real-time room inventory</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Platform Bookings</span>
              <div className="w-8 h-8 rounded-lg bg-sky-900/40 text-sky-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{totalBookingsCount}</div>
            <p className="text-[11px] text-slate-400 mt-1">₹0 OTA commission retained</p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* WORKSPACE NAVIGATION TABS & ACTIONS                          */}
        {/* ============================================================ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'pending'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Pending Submissions</span>
              {pendingCount > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === 'pending' ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>All Connected Properties</span>
              <span className="text-[10px] opacity-70">({allHotels.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('owners')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'owners'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Hotel Owners Directory</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Platform Hotel Analytics</span>
            </button>
          </div>

          <button
            onClick={() => setShowCreateHotelModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/40 transition cursor-pointer flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Hotel & Assign Owner</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: PENDING SUBMISSIONS & ONBOARDING WORKSPACE            */}
        {/* ============================================================ */}
        {activeTab === 'pending' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Pending Hotel Registration Queue</h2>
                <p className="text-xs text-slate-400">Review property profile, DigiLocker Aadhaar KYC, PAN, GSTIN, and tariff fairness</p>
              </div>
            </div>

            {pendingHotels.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-800/40 border border-slate-700/60">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">All Clear! No Pending Submissions</h3>
                <p className="text-xs text-slate-400 mt-1">All hotel owner registration requests have been audited and resolved.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingHotels.map(h => (
                  <div 
                    key={h.id}
                    className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700 hover:border-slate-600 transition flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                  >
                    <div className="flex items-start gap-4">
                      {h.details.photos && h.details.photos.length > 0 ? (
                        <img 
                          src={h.details.photos[0]} 
                          alt={h.propertyName} 
                          className="w-24 h-24 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0 text-slate-500">
                          <Building2 className="w-8 h-8" />
                        </div>
                      )}

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-base font-bold text-white">{h.propertyName}</h3>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            h.approvalStatus === 'SUBMITTED' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                            h.approvalStatus === 'UNDER_REVIEW' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' :
                            h.approvalStatus === 'CHANGES_REQUESTED' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {h.approvalStatus.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-900 px-2 py-0.5 rounded">
                            {h.propertyType}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-300 mb-2">
                          <div className="flex items-center gap-1 text-slate-400">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            <span>{h.address.city}, {h.address.state}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-400">
                            <Users className="w-3.5 h-3.5 text-slate-500" />
                            <span>Owner: <strong className="text-slate-200">{h.ownerName}</strong></span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-400">
                            <Bed className="w-3.5 h-3.5 text-slate-500" />
                            <span>{h.details.roomCount} Rooms (₹{h.details.baseTariffINR}/night)</span>
                          </div>
                        </div>

                        {/* Verification & Compliance Badges */}
                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            <span>DigiLocker Verified</span>
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                            PAN: {h.verification.panNumber || 'ABCDE1234F'}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                            GSTIN: {h.verification.gstin || '32ABCDE1234F1Z5'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Decision Buttons */}
                    <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 self-end lg:self-center">
                      <button
                        onClick={() => setInspectHotel(h)}
                        className="px-3 py-2 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>Inspect Profile</span>
                      </button>

                      <button
                        onClick={() => setDecisionModal({ hotel: h, action: 'CHANGES' })}
                        className="px-3 py-2 rounded-xl bg-orange-950/80 hover:bg-orange-900 border border-orange-800 text-orange-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
                        <span>Request Changes</span>
                      </button>

                      <button
                        onClick={() => setDecisionModal({ hotel: h, action: 'REJECT' })}
                        className="px-3 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => setDecisionModal({ hotel: h, action: 'APPROVE' })}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-900/30 transition cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                        <span>Approve Property</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: ALL CONNECTED PROPERTIES TABLE                         */}
        {/* ============================================================ */}
        {activeTab === 'all' && (
          <div>
            {/* Search & Filter Toolbar */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 mb-6 flex flex-col md:flex-row gap-3 justify-between items-center">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search hotel, owner, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                {['ALL', 'APPROVED', 'ACTIVE', 'SUBMITTED', 'CHANGES_REQUESTED', 'SUSPENDED', 'BLOCKED'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      statusFilter === st
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-slate-700 bg-slate-800/40 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Property</th>
                      <th className="py-3 px-4">Owner & Contact</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Rooms / Tariff</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60 text-slate-300">
                    {filteredAllHotels.map(h => (
                      <tr key={h.id} className="hover:bg-slate-800/60 transition">
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{h.propertyName}</div>
                          <div className="text-[11px] text-slate-400 capitalize">{h.propertyType} • ID: {h.id}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-200">{h.ownerName}</div>
                          <div className="text-[11px] text-slate-400">{h.contactPhone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div>{h.address.city}</div>
                          <div className="text-[11px] text-slate-400">{h.address.state}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{h.details.roomCount} Rooms</div>
                          <div className="text-[11px] text-emerald-400">₹{h.details.baseTariffINR}/night</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            h.approvalStatus === 'APPROVED' || h.approvalStatus === 'ACTIVE'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : h.approvalStatus === 'BLOCKED'
                              ? 'bg-rose-950 text-rose-300 border border-rose-600 font-black'
                              : h.approvalStatus === 'SUSPENDED'
                              ? 'bg-rose-950/80 text-rose-400 border border-rose-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {h.approvalStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <button
                              onClick={() => setInspectHotel(h)}
                              className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition cursor-pointer"
                              title="Inspect Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Assign Owner button */}
                            <button
                              onClick={() => {
                                setAssignOwnerModal({ hotel: h });
                                setAssignOwnerForm({ ownerId: (h as any).ownerId || '', ownerName: h.ownerName || '', notes: '' });
                              }}
                              className="px-2 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700 text-indigo-300 font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
                              title="Assign / Reassign Owner"
                            >
                              <UserPlus className="w-3 h-3 text-indigo-400" />
                              <span>Assign Owner</span>
                            </button>

                            {/* Block / Unblock access */}
                            {h.approvalStatus === 'BLOCKED' ? (
                              <button
                                onClick={() => setDecisionModal({ hotel: h, action: 'UNBLOCK' })}
                                className="px-2 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
                                title="Unblock Hotel Access"
                              >
                                <Unlock className="w-3 h-3 text-emerald-400" />
                                <span>Unblock</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setDecisionModal({ hotel: h, action: 'BLOCK' })}
                                className="px-2 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
                                title="Block Hotel Access"
                              >
                                <Ban className="w-3 h-3 text-rose-400" />
                                <span>Block</span>
                              </button>
                            )}

                            {/* Suspend / Reactivate */}
                            {h.approvalStatus === 'SUSPENDED' ? (
                              <button
                                onClick={() => setDecisionModal({ hotel: h, action: 'ACTIVATE' })}
                                className="px-2 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700 text-emerald-200 font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
                              >
                                <PlayCircle className="w-3 h-3 text-emerald-400" />
                                <span>Reactivate</span>
                              </button>
                            ) : h.approvalStatus !== 'BLOCKED' ? (
                              <button
                                onClick={() => setDecisionModal({ hotel: h, action: 'SUSPEND' })}
                                className="px-2 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
                              >
                                <PauseCircle className="w-3 h-3 text-rose-400" />
                                <span>Suspend</span>
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: HOTEL OWNERS DIRECTORY                                */}
        {/* ============================================================ */}
        {activeTab === 'owners' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allHotels.map(h => (
              <div key={h.id} className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-950 border border-indigo-700 flex items-center justify-center font-bold text-indigo-300">
                    {h.ownerName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{h.ownerName}</h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                      HOTEL_OWNER
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300 border-t border-slate-700/60 pt-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1"><Phone className="w-3 h-3" /> Mobile:</span>
                    <span className="font-semibold text-white">{h.contactPhone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1"><Mail className="w-3 h-3" /> Email:</span>
                    <span className="font-semibold text-white truncate max-w-[160px]">{h.contactEmail}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1"><Building2 className="w-3 h-3" /> Property:</span>
                    <span className="font-bold text-indigo-300 truncate max-w-[160px]">{h.propertyName}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-[11px]">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> KYC Verified
                  </span>
                  <button
                    onClick={() => setInspectHotel(h)}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Property</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: PLATFORM HOTEL ANALYTICS                              */}
        {/* ============================================================ */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Zero-Commission Benefit</h3>
                <div className="text-2xl font-black text-emerald-400">₹{(totalBookingsCount * 450).toLocaleString('en-IN')}</div>
                <p className="text-xs text-slate-400 mt-1">Direct savings passed to local hotel hosts vs 18-25% OTA cut.</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Average Room Yield</h3>
                <div className="text-2xl font-black text-white">₹2,840 <span className="text-xs text-slate-400">/ night</span></div>
                <p className="text-xs text-slate-400 mt-1">Across verified boutique, heritage, and homestay listings.</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">DigiLocker Verification Rate</h3>
                <div className="text-2xl font-black text-indigo-400">100%</div>
                <p className="text-xs text-slate-400 mt-1">All registered partner properties authenticate via Aadhaar + GSTIN.</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ============================================================ */}
      {/* MODAL 1: FULL PROPERTY INSPECTION DRAWER                     */}
      {/* ============================================================ */}
      {inspectHotel && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">{inspectHotel.propertyName}</h2>
                <p className="text-xs text-slate-400">{inspectHotel.address.line}, {inspectHotel.address.city}, {inspectHotel.address.state} - {inspectHotel.address.pincode}</p>
              </div>
              <button
                onClick={() => setInspectHotel(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {inspectHotel.details.photos && inspectHotel.details.photos.length > 0 && (
              <div className="mb-4 rounded-2xl overflow-hidden border border-slate-700 h-48">
                <img 
                  src={inspectHotel.details.photos[0]} 
                  alt={inspectHotel.propertyName} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400 block mb-1">Owner Contact:</span>
                <p className="font-bold text-white">{inspectHotel.ownerName}</p>
                <p className="text-slate-300">{inspectHotel.contactPhone}</p>
                <p className="text-slate-400">{inspectHotel.contactEmail}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400 block mb-1">KYC & Compliance:</span>
                <p className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> DigiLocker Verified
                </p>
                <p className="text-slate-300">PAN: {inspectHotel.verification.panNumber || 'ABCDE1234F'}</p>
                <p className="text-slate-300">GSTIN: {inspectHotel.verification.gstin || '32ABCDE1234F1Z5'}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 mb-6 text-xs text-slate-300">
              <span className="text-slate-400 font-bold block mb-1">Property Description:</span>
              <p>{inspectHotel.details.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {inspectHotel.details.amenities?.map((a, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[10px]">
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setInspectHotel(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Close Inspection
              </button>
              <button
                onClick={() => {
                  setDecisionModal({ hotel: inspectHotel, action: 'APPROVE' });
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-900/30"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Property</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: ADMINISTRATIVE DECISION ACTION MODAL                 */}
      {/* ============================================================ */}
      {decisionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-base font-bold text-white mb-1">
              Confirm Action: <span className="text-indigo-400">{decisionModal.action}</span>
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Property: <strong className="text-white">{decisionModal.hotel.propertyName}</strong>
            </p>

            {(decisionModal.action === 'REJECT' || decisionModal.action === 'CHANGES' || decisionModal.action === 'SUSPEND') && (
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Reason / Action Note for Owner:
                </label>
                <textarea
                  value={decisionNote}
                  onChange={(e) => setDecisionNote(e.target.value)}
                  placeholder={
                    decisionModal.action === 'CHANGES' 
                      ? 'e.g. Please upload higher resolution room photos and re-verify property GST certificate.' 
                      : 'State administrative rationale...'
                  }
                  rows={3}
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setDecisionModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteDecision}
                disabled={isLoading}
                className={`px-5 py-2 rounded-xl text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-lg ${
                  decisionModal.action === 'APPROVE' || decisionModal.action === 'ACTIVATE'
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30'
                    : decisionModal.action === 'CHANGES'
                    ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-900/30'
                    : 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/30'
                }`}
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>Confirm & Submit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: CREATE HOTEL & ASSIGN OWNER MODAL                   */}
      {/* ============================================================ */}
      {showCreateHotelModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-700 flex items-center justify-center">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Create New Hotel & Assign Owner</h2>
                  <p className="text-xs text-slate-400">Platform Admin property provisioning with zero commission</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateHotelModal(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHotelSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Property Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kumarakom Lake Heritage Homestay"
                    value={createForm.propertyName}
                    onChange={(e) => setCreateForm({ ...createForm, propertyName: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Property Type *</label>
                  <select
                    value={createForm.propertyType}
                    onChange={(e) => setCreateForm({ ...createForm, propertyType: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="homestay">Homestay (Zero-Commission)</option>
                    <option value="resort">Eco Resort</option>
                    <option value="hotel">Boutique Hotel</option>
                    <option value="ecolodge">Rainforest Ecolodge</option>
                    <option value="heritage">Heritage Palace</option>
                  </select>
                </div>
              </div>

              {/* Owner Assignment Details */}
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-indigo-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <UserPlus className="w-3.5 h-3.5" /> Assigned Hotel Owner & Login Account
                  </span>
                  <span className="text-[10px] text-indigo-400 bg-indigo-900/40 px-2 py-0.5 rounded-md border border-indigo-700/50">
                    Partner Access
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Owner / Host Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Varma"
                      value={createForm.ownerName}
                      onChange={(e) => setCreateForm({ ...createForm, ownerName: e.target.value })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Owner User ID / Login ID</label>
                    <input
                      type="text"
                      placeholder="e.g. anand01@partner.in or auto-generated"
                      value={createForm.ownerId}
                      onChange={(e) => setCreateForm({ ...createForm, ownerId: e.target.value })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Owner Password Section */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-300 font-semibold">Initial Login Password</label>
                    <button
                      type="button"
                      onClick={() => generateRandomPassword('create')}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" /> Auto-generate
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showCreatePassword ? 'text' : 'password'}
                      placeholder="e.g. Owner@2025 (used to sign into Partner Portal)"
                      value={createForm.ownerPassword}
                      onChange={(e) => setCreateForm({ ...createForm, ownerPassword: e.target.value })}
                      className="w-full p-2.5 pr-10 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCreatePassword(!showCreatePassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showCreatePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    The hotel owner will use their Email / User ID and this password to sign into the YatraSync Partner Portal.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Contact Phone *</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98470 12345"
                      value={createForm.contactPhone}
                      onChange={(e) => setCreateForm({ ...createForm, contactPhone: e.target.value })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Contact Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="host@property.in"
                      value={createForm.contactEmail}
                      onChange={(e) => setCreateForm({ ...createForm, contactEmail: e.target.value })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Location & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-3">
                  <label className="block text-slate-300 font-semibold mb-1">Address Line</label>
                  <input
                    type="text"
                    placeholder="e.g. Lake View Road, Backwaters Shore"
                    value={createForm.addressLine}
                    onChange={(e) => setCreateForm({ ...createForm, addressLine: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={createForm.city}
                    onChange={(e) => setCreateForm({ ...createForm, city: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={createForm.state}
                    onChange={(e) => setCreateForm({ ...createForm, state: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={createForm.pincode}
                    onChange={(e) => setCreateForm({ ...createForm, pincode: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Inventory & Pricing defaults */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Initial Total Rooms</label>
                  <input
                    type="number"
                    min="1"
                    value={createForm.roomCount}
                    onChange={(e) => setCreateForm({ ...createForm, roomCount: parseInt(e.target.value) || 1 })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Base Tariff (₹ / Night)</label>
                  <input
                    type="number"
                    min="500"
                    value={createForm.baseTariffINR}
                    onChange={(e) => setCreateForm({ ...createForm, baseTariffINR: parseFloat(e.target.value) || 1800 })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Property Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the property ambience, views, and unique local offerings..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateHotelModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition cursor-pointer flex items-center gap-2 shadow-lg shadow-indigo-900/40"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                  <span>Create Property & Assign</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: REASSIGN HOTEL OWNER MODAL                          */}
      {/* ============================================================ */}
      {assignOwnerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold text-white">Assign Hotel Owner</h2>
              </div>
              <button
                onClick={() => setAssignOwnerModal(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Hotel: <strong className="text-white">{assignOwnerModal.hotel.propertyName}</strong> (Currently assigned to: <span className="text-indigo-300 font-bold">{assignOwnerModal.hotel.ownerName}</span>)
            </p>

            <form onSubmit={handleAssignOwnerSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">New Owner User ID / Email *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. rehan001@ownwe.com or owner@stay.in"
                  value={assignOwnerForm.ownerId}
                  onChange={(e) => setAssignOwnerForm({ ...assignOwnerForm, ownerId: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Owner Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rehan Ahmad"
                  value={assignOwnerForm.ownerName}
                  onChange={(e) => setAssignOwnerForm({ ...assignOwnerForm, ownerName: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Password Section for Hotel Owner Login */}
              <div className="p-3.5 bg-indigo-950/40 rounded-2xl border border-indigo-800/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-indigo-200 font-bold flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Set Owner Login Password *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => generateRandomPassword('assign')}
                    className="text-[11px] text-indigo-400 hover:text-indigo-200 flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" /> Auto-generate
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showAssignPassword ? 'text' : 'password'}
                    required
                    placeholder="e.g. Pass@123 or temporary login password"
                    value={assignOwnerForm.password}
                    onChange={(e) => setAssignOwnerForm({ ...assignOwnerForm, password: e.target.value })}
                    className="w-full p-2.5 pr-10 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAssignPassword(!showAssignPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showAssignPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  The hotel owner will use their Email / User ID and this password to sign into the <strong className="text-slate-300">Partner Login</strong> portal.
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Reassignment Notes / Reason</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Ownership transfer verified via deed documents."
                  value={assignOwnerForm.notes}
                  onChange={(e) => setAssignOwnerForm({ ...assignOwnerForm, notes: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAssignOwnerModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-indigo-900/40"
                >
                  {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                  <span>Assign Owner</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 5: CREDENTIALS SUMMARY MODAL (ADMIN SHARING)           */}
      {/* ============================================================ */}
      {credentialModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-indigo-500/50 rounded-3xl p-6 shadow-2xl shadow-indigo-950/50 animate-in zoom-in-95 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">{credentialModal.title}</h2>
                  <p className="text-[11px] text-slate-400">{credentialModal.propertyName}</p>
                </div>
              </div>
              <button
                onClick={() => setCredentialModal(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs mb-5">
              <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-800/50 flex items-start gap-2 text-indigo-200 text-[11px] leading-relaxed">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  Owner login credentials have been saved. Share these details with <strong className="text-white">{credentialModal.ownerName}</strong> to allow them to access the Partner Portal.
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Owner Name:</span>
                  <span className="font-bold text-white">{credentialModal.ownerName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Login ID / Email:</span>
                  <div className="flex items-center gap-1.5">
                    <code className="text-xs font-mono font-bold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                      {credentialModal.loginId}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(credentialModal.loginId, 'loginId')}
                      className="p-1 text-slate-400 hover:text-white cursor-pointer"
                      title="Copy Login ID"
                    >
                      {copiedKey === 'loginId' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {credentialModal.password && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Password:</span>
                    <div className="flex items-center gap-1.5">
                      <code className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        {credentialModal.password}
                      </code>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(credentialModal.password || '', 'password')}
                        className="p-1 text-slate-400 hover:text-white cursor-pointer"
                        title="Copy Password"
                      >
                        {copiedKey === 'password' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <span className="text-slate-400 text-[11px]">Partner Portal:</span>
                  <span className="text-indigo-400 text-[11px] font-semibold">Login &rarr; Partner &rarr; Hotel Partner</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  const summary = `YatraSync Hotel Partner Login Credentials:\nProperty: ${credentialModal.propertyName}\nOwner: ${credentialModal.ownerName}\nLogin ID: ${credentialModal.loginId}\nPassword: ${credentialModal.password || '(configured)'}\nPortal: Select "Partner" -> "Hotel Partner" at Login`;
                  copyToClipboard(summary, 'all');
                }}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 border border-slate-700"
              >
                {copiedKey === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'all' ? 'Copied to Clipboard!' : 'Copy All Details'}</span>
              </button>
              <button
                type="button"
                onClick={() => setCredentialModal(null)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer shadow-lg shadow-indigo-900/40"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
