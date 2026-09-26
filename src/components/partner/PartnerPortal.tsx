// Changes made by @MdFarhanAhmad
import React, { useState, useEffect } from 'react';
import {
  Car,
  Compass,
  MapPin,
  Clock,
  User,
  Phone,
  MessageSquare,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Calendar,
  FileText,
  HelpCircle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Award,
  Layers,
  CheckCheck,
  Luggage,
  Volume2,
  Eye,
  Sliders,
  Send,
  KeyRound
} from 'lucide-react';
import {
  PartnerAssignment,
  PartnerProfileData,
  PartnerRole,
  AssignmentStatus,
  PartnerDocument,
  PartnerPayoutRecord,
  PartnerSupportTicket,
  UserSession
} from '../../types';
import { PartnerChatModal } from './PartnerChatModal';
import { PartnerDelayModal } from './PartnerDelayModal';
import { PartnerEmergencyModal } from './PartnerEmergencyModal';

interface PartnerPortalProps {
  partnerId?: string;
  user?: UserSession | null;
  onExitPortal: () => void;
}

const mapUserRoleToPartnerRole = (user?: UserSession | null, defaultRole: PartnerRole = 'DRIVER_STORYTELLER'): PartnerRole => {
  if (!user) return defaultRole;
  if (user.role === 'vehicle_rental_partner' || user.partnerRole === 'VEHICLE_RENTAL_PARTNER') return 'VEHICLE_RENTAL_PARTNER';
  if (user.partnerRole) return user.partnerRole;
  if (user.operatorSubRole === 'GUIDE') return 'LOCAL_STORYTELLER';
  if (user.operatorSubRole === 'DRIVER') return 'DRIVER';
  if (user.operatorSubRole === 'GUIDE_DRIVER' || user.operatorSubRole === 'both') return 'DRIVER_STORYTELLER';
  return defaultRole;
};

const getPartnerInitials = (name?: string): string => {
  if (!name) return 'SK';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const PartnerPortal: React.FC<PartnerPortalProps> = ({
  partnerId = 'ptr-1',
  user,
  onExitPortal
}) => {
  // RBAC GUARD FOR TRANSPORT PARTNER PORTAL
  const isAuthorized = !user || user.role === 'tour_operator' || user.role === 'partner' || user.role === 'vehicle_rental_partner' || user.role === 'admin';

  if (user && !isAuthorized) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-left">
        <div className="bg-white rounded-3xl p-8 border border-red-200 shadow-xl space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">Access Restricted — Transport Chauffeur Portal Only</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your account <strong>{user.name || 'User'}</strong> is registered as <span className="font-semibold uppercase text-blue-600">{user.role}</span>. You do not have permission to access Driver & Chauffeur Fleet Operations.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
            <button
              onClick={() => onExitPortal()}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Return to Your Authorized Workspace</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State
  const [activeTab, setActiveTab] = useState<'active_trip' | 'storyteller' | 'assignments' | 'checklist' | 'earnings' | 'availability' | 'documents' | 'safety' | 'profile'>('active_trip');
  const [partner, setPartner] = useState<PartnerProfileData | null>(null);
  const [assignments, setAssignments] = useState<PartnerAssignment[]>([]);
  const [activeAssignment, setActiveAssignment] = useState<PartnerAssignment | null>(null);
  const [documents, setDocuments] = useState<PartnerDocument[]>([]);
  const [tickets, setTickets] = useState<PartnerSupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'offline'>('synced');
  
  // Modals
  const [chatOpen, setChatOpen] = useState(false);
  const [delayOpen, setDelayOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  // Storyteller AI helper state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiStoryScript, setAiStoryScript] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [storyDeliveredStops, setStoryDeliveredStops] = useState<Record<string, boolean>>({});

  // Support ticket form
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState<'Trip Problem' | 'Traveler Problem' | 'Vehicle Problem' | 'Payment Problem' | 'Safety Problem'>('Trip Problem');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [ticketSubmitting, setTicketSubmitting] = useState(false);

  // Load partner data
  const fetchData = async () => {
    try {
      setLoading(true);
      const effectivePartnerId = user?.partnerId || partnerId;
      const [resDashboard, resAssignments, resDocs, resTickets] = await Promise.all([
        fetch('/api/partner/dashboard', { headers: { 'x-partner-id': effectivePartnerId } }),
        fetch('/api/partner/assignments', { headers: { 'x-partner-id': effectivePartnerId } }),
        fetch('/api/partner/documents', { headers: { 'x-partner-id': effectivePartnerId } }),
        fetch('/api/partner/support/tickets', { headers: { 'x-partner-id': effectivePartnerId } })
      ]);

      if (resDashboard.ok) {
        const dData = await resDashboard.json();
        let pData: PartnerProfileData = dData.partner;
        const isTransportRole = user && (user.role === 'tour_operator' || user.role === 'partner' || user.role === 'vehicle_rental_partner');
        if (isTransportRole && user.name) {
          pData = {
            ...pData,
            fullName: user.name,
            phone: user.phone || pData.phone,
            email: user.email || pData.email || `${user.name.toLowerCase().replace(/\s+/g, '.')}@yatrasync.partner`,
            role: mapUserRoleToPartnerRole(user, pData.role),
            id: user.partnerId || pData.id
          };
        }
        setPartner(pData);
        if (dData.nextAssignment) {
          setActiveAssignment(dData.nextAssignment);
        }
      }

      if (resAssignments.ok) {
        const aData = await resAssignments.json();
        setAssignments(aData.assignments || []);
        if (!activeAssignment && aData.assignments && aData.assignments.length > 0) {
          const active = aData.assignments.find((a: PartnerAssignment) => ['ACCEPTED', 'READY', 'EN_ROUTE', 'ARRIVED', 'PICKED_UP', 'IN_PROGRESS'].includes(a.status)) || aData.assignments[0];
          setActiveAssignment(active);
        }
      }

      if (resDocs.ok) {
        const docsData = await resDocs.json();
        setDocuments(docsData);
      }

      if (resTickets.ok) {
        const tData = await resTickets.json();
        setTickets(tData);
      }
    } catch (err) {
      console.warn('Network issue fetching partner operational data, fallback to offline cached state', err);
      setSyncStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [partnerId, user?.id, user?.name]);

  useEffect(() => {
    if (user && user.name && partner) {
      const targetRole = mapUserRoleToPartnerRole(user, partner.role);
      if (partner.fullName !== user.name || partner.phone !== user.phone || partner.role !== targetRole) {
        setPartner(prev => prev ? ({
          ...prev,
          fullName: user.name,
          phone: user.phone || prev.phone,
          email: user.email || prev.email,
          role: targetRole,
          id: user.partnerId || prev.id
        }) : null);
      }
    }
  }, [user, partner?.fullName, partner?.phone, partner?.role]);

  // Handle Trip State Machine Transition
  const handleTransition = async (nextStatus: AssignmentStatus, note?: string) => {
    if (!activeAssignment) return;
    setStatusUpdating(true);
    setSyncStatus('saving');

    try {
      // Accurate geolocation coordinates if available
      let coords: { lat: number; lng: number } | undefined = undefined;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          },
          () => {},
          { timeout: 3000 }
        );
      }

      const res = await fetch(`/api/partner/assignments/${activeAssignment.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-partner-id': partnerId },
        body: JSON.stringify({ nextStatus, coordinates: coords, note })
      });

      if (res.ok) {
        const data = await res.json();
        setActiveAssignment(data.assignment);
        setAssignments(prev => prev.map(a => a.id === data.assignment.id ? data.assignment : a));
        setSyncStatus('synced');
      } else {
        const err = await res.json();
        alert(err.error || 'Unable to transition trip status.');
        setSyncStatus('synced');
      }
    } catch (e) {
      console.error('Offline transition saved locally:', e);
      setSyncStatus('offline');
    } finally {
      setStatusUpdating(false);
    }
  };

  // Complete Stop
  const handleCompleteStop = async (stopIdx: number) => {
    if (!activeAssignment) return;
    try {
      const res = await fetch(`/api/partner/assignments/${activeAssignment.id}/stop-complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-partner-id': partnerId },
        body: JSON.stringify({ stopIndex: stopIdx })
      });
      if (res.ok) {
        const data = await res.json();
        setActiveAssignment(data.assignment);
        setAssignments(prev => prev.map(a => a.id === data.assignment.id ? data.assignment : a));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Report Delay
  const handleReportDelay = async (reason: string, delayMinutes: number, message: string) => {
    if (!activeAssignment) return;
    try {
      const res = await fetch(`/api/partner/assignments/${activeAssignment.id}/delay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-partner-id': partnerId },
        body: JSON.stringify({ reason, delayMinutes, message })
      });
      if (res.ok) {
        const data = await res.json();
        setActiveAssignment(data.assignment);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Report Emergency
  const handleReportEmergency = async (type: string, description: string) => {
    if (!activeAssignment) return;
    try {
      const res = await fetch(`/api/partner/assignments/${activeAssignment.id}/emergency`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-partner-id': partnerId },
        body: JSON.stringify({ type, description })
      });
      if (res.ok) {
        const data = await res.json();
        setActiveAssignment(data.assignment);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Send Chat Message
  const handleSendMessage = async (text: string) => {
    if (!activeAssignment || !partner) return;
    try {
      const res = await fetch(`/api/partner/assignments/${activeAssignment.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          senderRole: partner.role === 'LOCAL_STORYTELLER' ? 'storyteller' : 'driver',
          senderName: partner.fullName
        })
      });
      if (res.ok) {
        const newMsg = await res.json();
        setActiveAssignment(prev => prev ? { ...prev, chatMessages: [...prev.chatMessages, newMsg] } : null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Acknowledge Company Instructions
  const handleAcknowledgeInstructions = () => {
    if (!activeAssignment) return;
    setActiveAssignment(prev => prev ? {
      ...prev,
      safarSetuInstructions: { ...prev.safarSetuInstructions, acknowledgedByPartner: true }
    } : null);
  };

  // Pre-Trip Checklist Submit
  const handleChecklistSubmit = async (type: 'pre-trip' | 'post-trip') => {
    if (!activeAssignment) return;
    try {
      await fetch('/api/partner/checklist/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId: activeAssignment.id, type })
      });
      if (type === 'pre-trip') {
        setActiveAssignment(prev => prev ? { ...prev, preTripChecklistCompleted: true } : null);
      } else {
        setActiveAssignment(prev => prev ? { ...prev, postTripChecklistCompleted: true } : null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Availability Toggle
  const handleToggleAvailability = async (status: 'AVAILABLE' | 'BUSY' | 'OFF_DUTY') => {
    if (!partner) return;
    try {
      const res = await fetch('/api/partner/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-partner-id': partner.id },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const data = await res.json();
        setPartner(prev => prev ? { ...prev, availabilityStatus: data.status } : null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Ask SafarMitra Storyteller AI
  const handleAskSafarMitra = async () => {
    if (!aiQuestion.trim()) return;
    setAiLoading(true);
    try {
      const currentStop = activeAssignment?.stops[activeAssignment.currentStopIndex];
      const res = await fetch('/api/partner/ai/story-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: aiQuestion,
          stopName: currentStop?.location,
          travelerContext: activeAssignment?.travelerPreferences,
          destinationKey: activeAssignment?.destinationKey
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiStoryScript(data.guide);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  // Submit Support Ticket
  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject.trim() || !newTicketMessage.trim()) return;
    setTicketSubmitting(true);
    try {
      const res = await fetch('/api/partner/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-partner-id': partnerId },
        body: JSON.stringify({
          category: newTicketCategory,
          subject: newTicketSubject,
          message: newTicketMessage
        })
      });
      if (res.ok) {
        const created = await res.json();
        setTickets(prev => [created, ...prev]);
        setNewTicketSubject('');
        setNewTicketMessage('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTicketSubmitting(false);
    }
  };

  // Open external navigation
  const handleNavigate = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (user && (user.role === 'hotel_owner' || user.role === 'hotel_partner' || user.role === 'host')) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-slate-800 animate-in fade-in duration-200">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="font-serif font-bold text-xl text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            You are signed in as <span className="font-bold text-slate-900">{user.name}</span> with the role <span className="font-bold text-blue-700">{user.role === 'hotel_owner' ? 'Hotel Owner' : 'Hotel Admin'}</span>. 
            The Partner Portal is restricted to Transport Partners and Storyteller Chauffeurs.
          </p>
          <div className="pt-2">
            <button
              onClick={onExitPortal}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Return to Hotel Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentStop = activeAssignment?.stops[activeAssignment?.currentStopIndex || 0];
  const isDriver = partner?.role === 'DRIVER' || partner?.role === 'DRIVER_STORYTELLER';
  const isStoryteller = partner?.role === 'LOCAL_STORYTELLER' || partner?.role === 'DRIVER_STORYTELLER';

  return (
    <div id="partner-portal-root" className="min-h-screen bg-[#f7f5f0] text-slate-900 pb-20">
      
      {/* 1. TOP OPERATIONAL STATUS BAR */}
      <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          
          {/* Partner Identity & Capability */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-serif font-black text-base shadow-md">
              {getPartnerInitials(partner?.fullName)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base tracking-tight text-white">
                  {partner?.fullName}
                </span>
                <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                  {partner?.role.replace('_', ' & ')}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Partner</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5 flex items-center gap-2">
                <span>Partner ID: {partner?.id.toUpperCase()}</span>
                <span>•</span>
                <span className="text-amber-300 font-semibold">{partner?.rating}★ ({partner?.completedTrips} Trips)</span>
              </p>
            </div>
          </div>

          {/* Quick Controls: Connectivity & Availability */}
          <div className="flex items-center gap-3">
            
            {/* Sync Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-medium">
              <span className={`w-2 h-2 rounded-full ${syncStatus === 'synced' ? 'bg-emerald-400 animate-pulse' : syncStatus === 'saving' ? 'bg-amber-400 animate-spin' : 'bg-red-400'}`} />
              <span>{syncStatus === 'synced' ? 'Live Telemetry Active' : syncStatus === 'saving' ? 'Syncing...' : 'Cached Offline'}</span>
            </div>

            {/* Availability Status Select */}
            <div className="relative">
              <select
                value={partner?.availabilityStatus || 'AVAILABLE'}
                onChange={(e) => handleToggleAvailability(e.target.value as any)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-none shadow-xs ${
                  partner?.availabilityStatus === 'AVAILABLE'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : partner?.availabilityStatus === 'BUSY'
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                <option value="AVAILABLE">🟢 Available for Trips</option>
                <option value="BUSY">🟡 Busy on Assignment</option>
                <option value="OFF_DUTY">⚪ Off Duty</option>
              </select>
            </div>

            {/* Exit to Traveler Site */}
            <button
              onClick={onExitPortal}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
              title="Return to Traveler Interface"
            >
              Exit Portal
            </button>

          </div>

        </div>
      </header>

      {/* 2. OPERATIONAL NAVIGATION TABS (Mobile Friendly Scrolling) */}
      <nav className="bg-white border-b border-slate-200 sticky top-18 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto no-scrollbar py-2 text-xs font-bold">
          
          <button
            onClick={() => setActiveTab('active_trip')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'active_trip'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Car className="w-4 h-4 text-orange-400" />
            <span>Active Trip / Next</span>
            {activeAssignment && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          {isStoryteller && (
            <button
              onClick={() => setActiveTab('storyteller')}
              className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'storyteller'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Storyteller Mode</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">AI Companion</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'assignments'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Assignments ({assignments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'checklist'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Checklists</span>
          </button>

          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'earnings'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Earnings & Payouts</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'documents'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Documents Vault</span>
          </button>

          <button
            onClick={() => setActiveTab('safety')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'safety'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span>Safety & Support</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Partner Profile</span>
          </button>

        </div>
      </nav>

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">

        {/* ========================================================= */}
        {/* TAB 1: ACTIVE TRIP & OPERATIONAL DISPATCH (THE HEART) */}
        {/* ========================================================= */}
        {activeTab === 'active_trip' && (
          <div className="space-y-6">
            
            {activeAssignment ? (
              <>
                {/* HERO NEXT ACTION COMMAND CARD - LARGE TOUCH TARGETS */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-lg text-left relative overflow-hidden">
                  
                  {/* Decorative background aura */}
                  <div className="absolute -right-16 -top-16 w-56 h-56 bg-orange-100/50 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-900 border border-orange-200">
                          {activeAssignment.serviceType}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800">
                          PNR #{activeAssignment.pnr}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200">
                          Status: {activeAssignment.status}
                        </span>
                      </div>
                      <h2 className="font-serif font-black text-2xl text-slate-950 mt-2">
                        {activeAssignment.destinationName}
                      </h2>
                      <p className="text-xs text-slate-600">
                        {activeAssignment.pickupDate} • Pickup at <strong>{activeAssignment.pickupTime}</strong>
                      </p>
                    </div>

                    {/* ETA & Distance Telemetry */}
                    <div className="bg-[#faf8f5] p-3 rounded-2xl border border-slate-200 flex items-center gap-4">
                      <div className="text-right">
                        <span className="block text-[10px] uppercase font-bold text-slate-500">Live Navigation ETA</span>
                        <span className="font-mono font-bold text-xl text-slate-950">{activeAssignment.etaMinutes || 18} Mins</span>
                      </div>
                      <div className="h-8 w-px bg-slate-200" />
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-500">Distance</span>
                        <span className="font-mono font-bold text-xl text-orange-600">~{activeAssignment.estimatedDistanceKm} km</span>
                      </div>
                    </div>
                  </div>

                  {/* CURRENT OPERATIONAL TARGET & PRIMARY TOUCH ACTION */}
                  <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    
                    {/* Left: Location & Task Description */}
                    <div className="lg:col-span-7 space-y-3">
                      <span className="text-[11px] uppercase font-extrabold text-orange-700 tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-orange-600" />
                        <span>Current Operational Milestone (Stop #{currentStop?.stopNumber || 1} of {activeAssignment.stops.length})</span>
                      </span>
                      <h3 className="font-serif font-bold text-xl text-slate-950 leading-tight">
                        {currentStop?.location}
                      </h3>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                        <div className="flex items-start gap-2">
                          <strong className="text-slate-900 font-bold shrink-0">Chauffeur Action:</strong>
                          <span className="text-slate-700">{currentStop?.driverAction}</span>
                        </div>
                        {isStoryteller && currentStop?.storytellerAction && (
                          <div className="flex items-start gap-2 pt-1.5 border-t border-slate-200/80">
                            <strong className="text-amber-800 font-bold shrink-0">Storyteller Task:</strong>
                            <span className="text-slate-700">{currentStop?.storytellerAction}</span>
                          </div>
                        )}
                        {currentStop?.specialInstruction && (
                          <div className="flex items-start gap-2 pt-1.5 border-t border-slate-200/80 text-orange-950 bg-orange-50/50 p-2 rounded-xl">
                            <AlertTriangle className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                            <span className="font-medium text-[11px]">{currentStop?.specialInstruction}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Large Operational Execution Buttons */}
                    <div className="lg:col-span-5 flex flex-col gap-3">
                      
                      {/* Big Navigation Button */}
                      <button
                        onClick={() => handleNavigate(currentStop?.coordinates.lat || 10.1558, currentStop?.coordinates.lng || 76.3860)}
                        className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer"
                      >
                        <ExternalLink className="w-5 h-5 text-orange-400" />
                        <span>Navigate in Maps</span>
                      </button>

                      {/* State Machine Transition Actions */}
                      {activeAssignment.status === 'ACCEPTED' && (
                        <button
                          disabled={statusUpdating}
                          onClick={() => handleTransition('READY', 'Vehicle and documents ready')}
                          className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          <span>I am Ready (Pre-Trip Confirmed)</span>
                        </button>
                      )}

                      {activeAssignment.status === 'READY' && (
                        <button
                          disabled={statusUpdating}
                          onClick={() => handleTransition('EN_ROUTE', 'Dispatched to pickup point')}
                          className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
                        >
                          <Car className="w-5 h-5" />
                          <span>Start Route to Pickup</span>
                        </button>
                      )}

                      {activeAssignment.status === 'EN_ROUTE' && (
                        <button
                          disabled={statusUpdating}
                          onClick={() => handleTransition('ARRIVED', 'Arrived at terminal gate')}
                          className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          <span>I've Arrived at Pickup (Notify Traveler)</span>
                        </button>
                      )}

                      {activeAssignment.status === 'ARRIVED' && (
                        <button
                          disabled={statusUpdating}
                          onClick={() => handleTransition('PICKED_UP', 'Travelers met & luggage loaded')}
                          className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
                        >
                          <Luggage className="w-5 h-5" />
                          <span>Traveler Picked Up / Start Trip</span>
                        </button>
                      )}

                      {(activeAssignment.status === 'PICKED_UP' || activeAssignment.status === 'IN_PROGRESS') && (
                        <div className="space-y-2">
                          {activeAssignment.currentStopIndex < activeAssignment.stops.length - 1 ? (
                            <button
                              disabled={statusUpdating}
                              onClick={() => handleCompleteStop(activeAssignment.currentStopIndex)}
                              className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
                            >
                              <CheckCheck className="w-5 h-5" />
                              <span>Mark Current Stop Completed</span>
                            </button>
                          ) : (
                            <button
                              disabled={statusUpdating}
                              onClick={() => handleTransition('COMPLETED', 'Final homestay drop completed')}
                              className="w-full py-4 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm sm:text-base rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
                            >
                              <CheckCircle2 className="w-5 h-5" />
                              <span>Traveler Dropped / Complete Assignment</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Operational Disruption Controls */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => setDelayOpen(true)}
                          className="py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                        >
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          <span>Report Delay</span>
                        </button>
                        <button
                          onClick={() => setEmergencyOpen(true)}
                          className="py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                          <span>Vehicle SOS</span>
                        </button>
                      </div>

                    </div>

                  </div>

                </div>

                {/* 2-COLUMN OPERATIONAL DETAILS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                  
                  {/* COLUMN 1 & 2: OPERATIONAL STOP-BY-STOP TIMELINE */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Operational Task List */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                        <div>
                          <h4 className="font-serif font-bold text-lg text-slate-950">Stop-by-Stop Operational Tasks</h4>
                          <p className="text-xs text-slate-500">Chronological travel schedule with chauffeur & storyteller deliverables</p>
                        </div>
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
                          {activeAssignment.stops.filter(s => s.completed).length}/{activeAssignment.stops.length} Completed
                        </span>
                      </div>

                      <div className="space-y-4">
                        {activeAssignment.stops.map((stop, idx) => {
                          const isCurrent = idx === activeAssignment.currentStopIndex;
                          const isDone = stop.completed;

                          return (
                            <div
                              key={stop.id}
                              className={`p-4 rounded-2xl border transition ${
                                isCurrent
                                  ? 'bg-orange-50/70 border-orange-300 ring-2 ring-orange-200/60'
                                  : isDone
                                  ? 'bg-slate-50/70 border-slate-200 opacity-70'
                                  : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                    isDone
                                      ? 'bg-emerald-600 text-white'
                                      : isCurrent
                                      ? 'bg-orange-600 text-white'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}>
                                    {isDone ? '✓' : stop.stopNumber}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-xs font-bold text-slate-600">{stop.time}</span>
                                      <span className="text-[10px] text-slate-400">• Depart: {stop.expectedDeparture}</span>
                                      {isCurrent && (
                                        <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-orange-600 text-white">
                                          Active Now
                                        </span>
                                      )}
                                    </div>
                                    <h5 className="font-bold text-sm text-slate-900 mt-0.5">{stop.location}</h5>
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleNavigate(stop.coordinates.lat, stop.coordinates.lng)}
                                  className="text-xs text-orange-700 font-bold hover:underline shrink-0 flex items-center gap-1"
                                >
                                  <span>Map</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Task details */}
                              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs border-t border-slate-100/90 pt-2.5">
                                <div>
                                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Driver Task</span>
                                  <span className="text-slate-700">{stop.driverAction}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold uppercase text-amber-700 block">Storyteller Narrative</span>
                                  <span className="text-slate-700">{stop.storytellerAction}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* SafarSetu Operational Instructions (v2.1) */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-slate-900 text-white">
                            {activeAssignment.safarSetuInstructions.version}
                          </span>
                          <h4 className="font-serif font-bold text-lg text-slate-950">
                            YatraSync Official Partner Mandates
                          </h4>
                        </div>
                        {activeAssignment.safarSetuInstructions.acknowledgedByPartner ? (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Acknowledged</span>
                          </span>
                        ) : (
                          <button
                            onClick={handleAcknowledgeInstructions}
                            className="text-xs font-bold px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition"
                          >
                            Acknowledge Guidelines
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                        {activeAssignment.safarSetuInstructions.items.map((instruction, i) => (
                          <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2">
                            <span className="text-orange-600 font-bold">•</span>
                            <span>{instruction}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* COLUMN 3: TRAVELER & PRIVACY-MINIMIZED PREFERENCES */}
                  <div className="space-y-6">
                    
                    {/* Traveler Handoff Card */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-orange-700 tracking-wider">
                        Customer & Pickup Detail
                      </span>
                      <h4 className="font-serif font-bold text-lg text-slate-950 mt-1">
                        {activeAssignment.travelerName}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {activeAssignment.guestsCount} Guests • {activeAssignment.luggageCount}
                      </p>

                      <div className="my-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Meeting Point</span>
                          <strong className="text-slate-900">{activeAssignment.pickupGate}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Scheduled Time</span>
                          <strong className="text-slate-900">{activeAssignment.pickupTime} ({activeAssignment.pickupDate})</strong>
                        </div>
                      </div>

                      {/* Controlled Communication */}
                      <div className="space-y-2">
                        <button
                          onClick={() => setChatOpen(true)}
                          className="w-full py-2.5 bg-slate-900 hover:bg-orange-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Trip Chat ({activeAssignment.chatMessages.length} Messages)</span>
                        </button>
                        
                        <a
                          href={`tel:${activeAssignment.travelerPhone}`}
                          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
                        >
                          <Phone className="w-4 h-4 text-emerald-600" />
                          <span>Call Masked Line</span>
                        </a>
                      </div>
                    </div>

                    {/* Relevant Traveler Preferences (Data Minimized) */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-4 h-4 text-orange-600" />
                        <h4 className="font-serif font-bold text-base text-slate-950">Traveler Trip Preferences</h4>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Travel Style</span>
                          <span className="font-semibold text-slate-800">{activeAssignment.travelerPreferences.travelStyle}</span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Languages</span>
                          <span className="font-semibold text-slate-800">{activeAssignment.travelerPreferences.languagePreference}</span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Dietary Preferences</span>
                          <span className="font-semibold text-slate-800">{activeAssignment.travelerPreferences.dietary}</span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Interests</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {activeAssignment.travelerPreferences.interests.map((interest, i) => (
                              <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Special Assistance</span>
                          <div className="space-y-1 mt-1">
                            {activeAssignment.travelerPreferences.specialRequirements.map((req, i) => (
                              <span key={i} className="block text-[11px] text-amber-900 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                                ⚠️ {req}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Transparent Trip Earnings Preview */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                        Direct Bank Payout (0% Platform Deductions)
                      </span>
                      <h4 className="font-serif font-bold text-xl text-slate-950 mt-1">
                        ₹{activeAssignment.earnings.totalPayable.toLocaleString('en-IN')}
                      </h4>

                      <div className="mt-3 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                        <div className="flex justify-between">
                          <span>Base Booking Rate:</span>
                          <strong className="text-slate-900">₹{activeAssignment.earnings.baseFare}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Distance ({activeAssignment.estimatedDistanceKm} km):</span>
                          <strong className="text-slate-900">₹{activeAssignment.earnings.distanceComponent}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Storyteller Cultural Fee:</span>
                          <strong className="text-slate-900">₹{activeAssignment.earnings.storytellerFee}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>EV Green Traveler Bonus:</span>
                          <strong className="text-emerald-600">+₹{activeAssignment.earnings.bonus}</strong>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-100 text-slate-950 font-bold">
                          <span>Net Payable:</span>
                          <span className="text-emerald-700 font-mono">₹{activeAssignment.earnings.totalPayable}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-serif font-bold text-xl text-slate-950">No Active Trip Right Now</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Your telemetry is live. As soon as a traveler books or operations dispatches an assignment, it will appear here instantly.
                </p>
                <button
                  onClick={() => setActiveTab('assignments')}
                  className="mt-4 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition"
                >
                  View Upcoming & Offered Assignments
                </button>
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: STORYTELLER KNOWLEDGE & SAFARMITRA AI COMPANION */}
        {/* ========================================================= */}
        {activeTab === 'storyteller' && (
          <div className="space-y-6 text-left">
            <div className="bg-gradient-to-r from-slate-900 to-orange-950 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
              <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">
                Local Cultural Custodian Engine
              </span>
              <h3 className="font-serif font-bold text-2xl mt-1">Storyteller Lore & Knowledge Companion</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Verified regional folklore, architectural secrets, local food gems, and live SafarMitra AI narration assistance tailored for your travelers.
              </p>
            </div>

            {/* AI Prompt Assistant for Storytellers */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-orange-600" />
                <h4 className="font-serif font-bold text-lg text-slate-950">Ask SafarMitra Story Assistant</h4>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Ask for a tailored 2-minute oral script, folklore hook, or child-friendly explanation for any monument or stop.
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder="e.g. Give me a 2-minute explanation of Cheeyappara Waterfalls for a family with kids"
                  className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <button
                  disabled={aiLoading || !aiQuestion.trim()}
                  onClick={handleAskSafarMitra}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                >
                  {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Generate Script</span>
                </button>
              </div>

              {/* Quick AI Prompt Suggestions */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {[
                  "Folklore about Western Ghats cardamom mist",
                  "Why do tea bushes thrive above 3000 ft?",
                  "Traditional Kerala Sadya etiquette explained simply"
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => { setAiQuestion(q); }}
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-lg transition"
                  >
                    "{q}"
                  </button>
                ))}
              </div>

              {/* AI Generated Output Script */}
              {aiStoryScript && (
                <div className="mt-5 p-5 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs space-y-2 text-slate-800 leading-relaxed animate-fade-in">
                  <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                    <span className="font-bold text-amber-950 uppercase text-[10px] tracking-wider">
                      🎙️ SafarMitra Story Script (2-Minute Oral Delivery)
                    </span>
                    <button
                      onClick={() => setAiStoryScript(null)}
                      className="text-amber-700 text-xs hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="whitespace-pre-line font-serif text-sm text-slate-900 pt-1">
                    {aiStoryScript}
                  </div>
                </div>
              )}
            </div>

            {/* Current Trip Destination Dossiers & Lore Highlights */}
            {activeAssignment && (
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-lg text-slate-950">
                  Today's Heritage Stop Lore Cards
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeAssignment.stops.map((stop) => {
                    const delivered = storyDeliveredStops[stop.id] || false;

                    return (
                      <div key={stop.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-orange-700">Stop #{stop.stopNumber} • {stop.time}</span>
                            <button
                              onClick={() => setStoryDeliveredStops(prev => ({ ...prev, [stop.id]: !delivered }))}
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition flex items-center gap-1 ${
                                delivered
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{delivered ? 'Story Delivered ✓' : 'Mark Delivered'}</span>
                            </button>
                          </div>
                          <h5 className="font-bold text-base text-slate-950 mt-1">{stop.location}</h5>

                          {stop.storyNotes && (
                            <div className="mt-3 space-y-2 text-xs">
                              <p className="text-slate-700 italic bg-[#faf8f5] p-3 rounded-xl border border-slate-100">
                                "{stop.storyNotes.narrative}"
                              </p>
                              
                              <div className="pt-2">
                                <span className="font-bold text-slate-900 block text-[11px] mb-1">Key Talking Points:</span>
                                <ul className="space-y-1">
                                  {stop.storyNotes.culturalHighlights.map((hl, idx) => (
                                    <li key={idx} className="flex items-center gap-1.5 text-slate-600">
                                      <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                                      <span>{hl}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-100 text-[11px] text-amber-900">
                                <strong>Local Food Secret:</strong> {stop.storyNotes.localEatsTip}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ASSIGNMENTS & OFFERS */}
        {/* ========================================================= */}
        {activeTab === 'assignments' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-xl text-slate-950">Partner Assignment Queue</h3>
                <p className="text-xs text-slate-500">Live operational trips assigned to you or open for acceptance</p>
              </div>
            </div>

            <div className="space-y-4">
              {assignments.map((asg) => {
                const isOffered = asg.status === 'OFFERED';
                const isCurrentActive = activeAssignment?.id === asg.id;

                return (
                  <div
                    key={asg.id}
                    className={`bg-white rounded-3xl p-6 border transition shadow-xs ${
                      isCurrentActive
                        ? 'border-orange-500 ring-2 ring-orange-100'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-800">#{asg.id}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {asg.serviceType}
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          asg.status === 'OFFERED'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                            : asg.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-slate-900 text-white'
                        }`}>
                          {asg.status}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Earnings</span>
                        <span className="font-mono font-bold text-lg text-emerald-700">
                          ₹{asg.earnings.totalPayable.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Pickup</span>
                        <strong className="text-slate-900 block">{asg.pickupLocation}</strong>
                        <span className="text-slate-500">{asg.pickupDate} at {asg.pickupTime}</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Drop Destination</span>
                        <strong className="text-slate-900 block">{asg.dropLocation}</strong>
                        <span className="text-slate-500">{asg.destinationName}</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Traveler</span>
                        <strong className="text-slate-900 block">{asg.travelerName}</strong>
                        <span className="text-slate-500">{asg.guestsCount} Guests • {asg.luggageCount}</span>
                      </div>
                    </div>

                    {/* Operational Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-slate-500 text-xs">
                        Stops: <strong>{asg.stops.length} Milestones</strong> • Est. Distance: <strong>~{asg.estimatedDistanceKm} km</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        {isOffered ? (
                          <>
                            <button
                              onClick={async () => {
                                await fetch(`/api/partner/assignments/${asg.id}/decline`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json', 'x-partner-id': partnerId },
                                  body: JSON.stringify({ reason: 'Partner unavailable' })
                                });
                                fetchData();
                              }}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                            >
                              Decline
                            </button>
                            <button
                              onClick={async () => {
                                await fetch(`/api/partner/assignments/${asg.id}/accept`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json', 'x-partner-id': partnerId }
                                });
                                fetchData();
                                setActiveAssignment(asg);
                                setActiveTab('active_trip');
                              }}
                              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                            >
                              Accept Assignment
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveAssignment(asg);
                              setActiveTab('active_trip');
                            }}
                            className="px-4 py-1.5 bg-slate-900 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition"
                          >
                            Open in Dispatch
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: CHECKLISTS (PRE-TRIP & POST-TRIP) */}
        {/* ========================================================= */}
        {activeTab === 'checklist' && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="font-serif font-bold text-xl text-slate-950">Operational Readiness Checklists</h3>
              <p className="text-xs text-slate-500">Government safety regulations and YatraSync quality assurances</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Pre-Trip Checklist */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-orange-600" />
                    <h4 className="font-serif font-bold text-lg text-slate-950">Pre-Trip Safety & Readiness</h4>
                  </div>
                  {activeAssignment?.preTripChecklistCompleted ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                      Completed ✓
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                      Pending Action
                    </span>
                  )}
                </div>

                <div className="space-y-2.5 text-xs text-slate-700">
                  {[
                    "Vehicle sanitized & cabin fragrance refreshed",
                    "EV Battery charge > 80% or Fuel tank > 60%",
                    "Tire pressure & spare wheel inspected",
                    "Smart phone charged 100% & GPS active",
                    "YatraSync Welcome Placard ready in vehicle",
                    "Chilled mineral water & tissue box loaded",
                    "Commercial tourist permits & insurance copy onboard",
                    "Emergency kit (first aid & fire extinguisher) verified"
                  ].map((item, idx) => (
                    <label key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition">
                      <input
                        type="checkbox"
                        defaultChecked={activeAssignment?.preTripChecklistCompleted}
                        className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-slate-900 cursor-pointer"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>

                <button
                  onClick={() => handleChecklistSubmit('pre-trip')}
                  className="w-full py-3 bg-slate-900 hover:bg-orange-700 text-white font-bold text-xs rounded-xl transition"
                >
                  Confirm & Submit Pre-Trip Readiness
                </button>
              </div>

              {/* Post-Trip Completion Checklist */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-serif font-bold text-lg text-slate-950">Post-Trip Handover & Closeout</h4>
                  </div>
                  {activeAssignment?.postTripChecklistCompleted ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                      Completed ✓
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl">
                      At Destination Drop
                    </span>
                  )}
                </div>

                <div className="space-y-2.5 text-xs text-slate-700">
                  {[
                    "Traveler escorted safely to homestay front desk",
                    "All bags unloaded & checked off against count",
                    "Cabin & boot thoroughly inspected for forgotten items",
                    "Host introduced to travelers warmly",
                    "Traveler thanked for choosing YatraSync eco-transit",
                    "Zero cash collected (Trip settled via platform)"
                  ].map((item, idx) => (
                    <label key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition">
                      <input
                        type="checkbox"
                        defaultChecked={activeAssignment?.postTripChecklistCompleted}
                        className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-slate-900 cursor-pointer"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>

                <button
                  onClick={() => handleChecklistSubmit('post-trip')}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition"
                >
                  Verify Final Luggage Handover & Close Trip
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: EARNINGS & PAYOUTS */}
        {/* ========================================================= */}
        {activeTab === 'earnings' && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="font-serif font-bold text-xl text-slate-950">Partner Earnings & Direct Bank Transfers</h3>
              <p className="text-xs text-slate-500">100% transparent fee structure • 0% middleman deduction • Weekly NEFT / Instant UPI</p>
            </div>

            {/* Earnings Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Today's Live Trips</span>
                <span className="font-mono font-bold text-2xl text-slate-950 mt-1 block">
                  ₹{activeAssignment ? activeAssignment.earnings.totalPayable.toLocaleString('en-IN') : '0'}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">Active in dispatch</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">This Week's Net</span>
                <span className="font-mono font-bold text-2xl text-emerald-700 mt-1 block">
                  ₹19,450
                </span>
                <span className="text-[10px] text-slate-500">Scheduled for Monday payout</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Month to Date</span>
                <span className="font-mono font-bold text-2xl text-slate-950 mt-1 block">
                  ₹62,700
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">14 completed journeys</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Payout Destination</span>
                <span className="font-bold text-xs text-slate-900 mt-1 block">
                  {partner?.bankAccount.bankName}
                </span>
                <span className="text-[10px] font-mono text-slate-500">{partner?.bankAccount.maskedAccountNumber}</span>
              </div>
            </div>

            {/* Itemized Payout Records */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h4 className="font-serif font-bold text-lg text-slate-950 mb-3">Bank Settlement History</h4>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-2.5">Date</th>
                      <th className="py-2.5">Period</th>
                      <th className="py-2.5">Amount</th>
                      <th className="py-2.5">Reference No</th>
                      <th className="py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 font-semibold text-slate-900">10 Sep 2026</td>
                      <td className="py-3 text-slate-600">Week 1 (1 Sep - 7 Sep)</td>
                      <td className="py-3 font-mono font-bold text-emerald-700">₹19,450</td>
                      <td className="py-3 font-mono text-slate-500">NEFT-FDRL-98124012</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                          PAID ✓
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 font-semibold text-slate-900">03 Sep 2026</td>
                      <td className="py-3 text-slate-600">August Final Settlement</td>
                      <td className="py-3 font-mono font-bold text-emerald-700">₹23,800</td>
                      <td className="py-3 font-mono text-slate-500">NEFT-FDRL-97741289</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                          PAID ✓
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: DOCUMENT VAULT & VERIFICATION */}
        {/* ========================================================= */}
        {activeTab === 'documents' && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="font-serif font-bold text-xl text-slate-950">Official Partner Document Vault</h3>
              <p className="text-xs text-slate-500">Commercial permits, police verification & state tourism credentials</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400">{doc.id}</span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      doc.status === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-900'
                        : doc.status === 'EXPIRING_SOON'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-red-100 text-red-900'
                    }`}>
                      {doc.status}
                    </span>
                  </div>

                  <div>
                    <h5 className="font-bold text-sm text-slate-900">{doc.title}</h5>
                    <p className="text-xs font-mono text-slate-600 mt-1">{doc.documentNumber}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                    <div>Valid Until: <strong className="text-slate-800">{doc.validUntil}</strong></div>
                    <div>Issuer: <span>{doc.issuer}</span></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                All documents are encrypted and synchronized with DigiLocker and State Police databases. No public exposure of private papers.
              </span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: SAFETY CENTER & 24/7 SUPPORT */}
        {/* ========================================================= */}
        {activeTab === 'safety' && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="font-serif font-bold text-xl text-slate-950">Partner Safety & 24/7 Support Desk</h3>
              <p className="text-xs text-slate-500">Direct escalation line to YatraSync emergency operations</p>
            </div>

            {/* Direct Hotlines */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href="tel:112"
                className="bg-red-600 hover:bg-red-700 text-white p-5 rounded-3xl shadow-sm transition block"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-90">National Emergency</span>
                <span className="font-serif font-black text-2xl block mt-1">Dial 112</span>
                <span className="text-xs opacity-90 mt-1 block">Police, Medical & Rescue</span>
              </a>

              <a
                href="tel:1091"
                className="bg-purple-900 hover:bg-purple-950 text-white p-5 rounded-3xl shadow-sm transition block"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-90">Women Traveler Helpline</span>
                <span className="font-serif font-black text-2xl block mt-1">Dial 1091</span>
                <span className="text-xs opacity-90 mt-1 block">24/7 Dedicated Support</span>
              </a>

              <a
                href="tel:18004257388"
                className="bg-slate-900 hover:bg-slate-800 text-white p-5 rounded-3xl shadow-sm transition block"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-90">YatraSync Ops Desk</span>
                <span className="font-serif font-black text-2xl block mt-1">1800-425-SYNC</span>
                <span className="text-xs opacity-90 mt-1 block">Toll Free Partner Priority</span>
              </a>
            </div>

            {/* Create Support Ticket */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h4 className="font-serif font-bold text-lg text-slate-950 mb-3">Open an Operational Support Ticket</h4>
              
              <form onSubmit={handleSubmitTicket} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Issue Category:</label>
                    <select
                      value={newTicketCategory}
                      onChange={(e) => setNewTicketCategory(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
                    >
                      <option value="Trip Problem">Trip Problem</option>
                      <option value="Traveler Problem">Traveler Problem</option>
                      <option value="Vehicle Problem">Vehicle Problem</option>
                      <option value="Payment Problem">Payment Problem</option>
                      <option value="Safety Problem">Safety Problem</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Subject / Summary:</label>
                    <input
                      type="text"
                      value={newTicketSubject}
                      onChange={(e) => setNewTicketSubject(e.target.value)}
                      placeholder="e.g. Mountain road landslide near Adimali bypass"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Detailed Message:</label>
                  <textarea
                    rows={3}
                    value={newTicketMessage}
                    onChange={(e) => setNewTicketMessage(e.target.value)}
                    placeholder="Describe the operational challenge for our lead dispatchers..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={ticketSubmitting}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-orange-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition"
                >
                  {ticketSubmitting ? 'Submitting...' : 'Dispatch Ticket to Operations'}
                </button>
              </form>
            </div>

            {/* Existing Tickets List */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-base text-slate-950">Your Operational Cases</h4>
              {tickets.map((t) => (
                <div key={t.id} className="bg-white p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-500">#{t.id} • {t.category}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <h5 className="font-bold text-sm text-slate-900">{t.subject}</h5>
                  <p className="text-slate-600">{t.messages[0]?.text}</p>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 8: PARTNER PROFILE & REPUTATION */}
        {/* ========================================================= */}
        {activeTab === 'profile' && partner && (
          <div className="space-y-6 text-left">
            <div>
              <h3 className="font-serif font-bold text-xl text-slate-950">Partner Reputation & Profile</h3>
              <p className="text-xs text-slate-500">Your verified public credentials and traveler review scorecard</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Profile Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-slate-900 text-white flex items-center justify-center font-serif text-3xl font-black shadow-md mx-auto">
                  {getPartnerInitials(partner.fullName)}
                </div>
                <div className="text-center">
                  <h4 className="font-serif font-bold text-xl text-slate-950">{partner.fullName}</h4>
                  <p className="text-xs text-orange-600 font-bold uppercase">{partner.role.replace('_', ' & ')}</p>
                  <p className="text-xs text-slate-500 mt-1">{partner.yearsExperience} Years Verified Experience</p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-xs space-y-2 text-slate-700">
                  <div><strong>Phone:</strong> {partner.phone}</div>
                  <div><strong>Email:</strong> {partner.email}</div>
                  <div><strong>Languages:</strong> {partner.languages.join(', ')}</div>
                  <div><strong>Service Corridors:</strong> {partner.serviceAreas.join(' • ')}</div>
                </div>
              </div>

              {/* Scorecard */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-serif font-bold text-lg text-slate-950 border-b border-slate-100 pb-2">
                  Quality & Performance Metrics
                </h4>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Overall Rating</span>
                      <span className="text-amber-600">{partner.rating} / 5.0</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: '99%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Punctuality Rate</span>
                      <span className="text-emerald-700">{partner.onTimeRate}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '98.5%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Cleanliness & Vehicle Comfort</span>
                      <span className="text-slate-900">5.0 / 5.0</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-900 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Local Cultural Knowledge</span>
                      <span className="text-slate-900">5.0 / 5.0</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-600 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Specs */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                <h4 className="font-serif font-bold text-lg text-slate-950 border-b border-slate-100 pb-2">
                  Commercial Fleet Vehicle
                </h4>
                {partner.vehicle ? (
                  <div className="space-y-2 text-xs text-slate-700">
                    <div><strong>Model:</strong> {partner.vehicle.model}</div>
                    <div><strong>Reg Number:</strong> <span className="font-mono font-bold">{partner.vehicle.registrationNumber}</span></div>
                    <div><strong>Capacity:</strong> {partner.vehicle.capacity} Passengers ({partner.vehicle.luggageBagsCapacity} Bags)</div>
                    <div><strong>Climate:</strong> {partner.vehicle.isAC ? 'Climate Controlled AC' : 'Non-AC'}</div>
                    <div><strong>Permit:</strong> {partner.vehicle.permitType}</div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    Storyteller profile (accompanies traveler vehicle, tourist coaches, and walking tours).
                  </p>
                )}
              </div>

            </div>
          </div>
        )}

      </main>

      {/* 4. MODALS */}
      {activeAssignment && (
        <>
          <PartnerChatModal
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
            assignmentId={activeAssignment.id}
            travelerName={activeAssignment.travelerName}
            driverName={activeAssignment.partnerName}
            messages={activeAssignment.chatMessages}
            onSendMessage={handleSendMessage}
            currentUserRole={partner?.role === 'LOCAL_STORYTELLER' ? 'storyteller' : 'driver'}
          />

          <PartnerDelayModal
            isOpen={delayOpen}
            onClose={() => setDelayOpen(false)}
            assignmentId={activeAssignment.id}
            onReportDelay={handleReportDelay}
          />

          <PartnerEmergencyModal
            isOpen={emergencyOpen}
            onClose={() => setEmergencyOpen(false)}
            assignmentId={activeAssignment.id}
            onReportEmergency={handleReportEmergency}
          />
        </>
      )}

    </div>
  );
};
