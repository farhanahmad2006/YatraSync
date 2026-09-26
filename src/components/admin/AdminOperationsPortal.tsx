// Changes made by @MdFarhanAhmad
import React, { useState, useEffect } from 'react';
import {
  Layers,
  Activity,
  UserCheck,
  AlertTriangle,
  Clock,
  Car,
  MapPin,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Search,
  Filter,
  Users
} from 'lucide-react';
import {
  PartnerAssignment,
  PartnerProfileData,
  AuditLogEvent,
  UserSession
} from '../../types';

interface AdminOperationsPortalProps {
  user?: UserSession | null;
  onExit: () => void;
}

export const AdminOperationsPortal: React.FC<AdminOperationsPortalProps> = ({ user, onExit }) => {
  // STRICT SUPER ADMIN RBAC GUARD
  const isAuthorized = user?.role === 'admin';

  if (user && !isAuthorized) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-left">
        <div className="bg-white rounded-3xl p-8 border border-red-200 shadow-xl space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">Access Restricted — Super Admin Control Only</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your account <strong>{user.name || 'User'}</strong> is registered as <span className="font-semibold uppercase text-slate-900">{user.role}</span>. Access to Centralized Fleet Dispatch & Security Telemetry requires verified Super Administrator privileges.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
            <button
              onClick={onExit}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Return to Authorized Workspace</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [stats, setStats] = useState<any>(null);
  const [assignments, setAssignments] = useState<PartnerAssignment[]>([]);
  const [partners, setPartners] = useState<PartnerProfileData[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<PartnerAssignment | null>(null);

  // Matching engine state
  const [matchingCandidates, setMatchingCandidates] = useState<any[]>([]);
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [assigningLoading, setAssigningLoading] = useState(false);

  // Active filter tab
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'UNASSIGNED' | 'DELAYED' | 'INCIDENT'>('ALL');

  const fetchOperationsData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/operations');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setAssignments(data.assignments);
        setPartners(data.partners);
        setAuditLogs(data.auditLogs);
        if (!selectedAssignment && data.assignments.length > 0) {
          setSelectedAssignment(data.assignments[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperationsData();
  }, []);

  // Fetch Smart Match Candidates when assignment changes
  useEffect(() => {
    if (!selectedAssignment) return;
    const fetchMatching = async () => {
      setMatchingLoading(true);
      try {
        const res = await fetch(`/api/admin/matching/${selectedAssignment.id}`);
        if (res.ok) {
          const data = await res.json();
          setMatchingCandidates(data.recommendedCandidates || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setMatchingLoading(false);
      }
    };
    fetchMatching();
  }, [selectedAssignment?.id]);

  // Admin Assign / Reassign
  const handleAssignPartner = async (partnerId: string) => {
    if (!selectedAssignment) return;
    setAssigningLoading(true);
    try {
      const res = await fetch('/api/admin/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: selectedAssignment.id,
          partnerId,
          reason: 'Operations dispatcher smart match allocation'
        })
      });
      if (res.ok) {
        await fetchOperationsData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAssigningLoading(false);
    }
  };

  const filteredAssignments = assignments.filter((a) => {
    if (statusFilter === 'ACTIVE') return ['EN_ROUTE', 'ARRIVED', 'PICKED_UP', 'IN_PROGRESS'].includes(a.status);
    if (statusFilter === 'UNASSIGNED') return a.status === 'OFFERED' && !a.partnerId;
    if (statusFilter === 'DELAYED') return Boolean(a.delayReport);
    if (statusFilter === 'INCIDENT') return a.status === 'INCIDENT';
    return true;
  });

  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-slate-800 animate-in fade-in duration-200">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="font-serif font-bold text-xl text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            The Centralized Operations & Dispatch Control Desk requires <span className="font-bold text-emerald-700">Super Admin</span> privileges. 
            Your current account (<span className="font-bold text-slate-900">{user.name}</span>) is assigned to the <span className="font-bold text-blue-700">{user.role}</span> role.
          </p>
          <div className="pt-2">
            <button
              onClick={onExit}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Exit to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-operations-root" className="min-h-screen bg-[#f3f1ec] text-slate-900 pb-20 text-left">
      
      {/* Control Center Header */}
      <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-bold">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-black text-lg text-white">YatraSync Operations Control Desk</h1>
                <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Live Dispatch
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5">
                Centralized partner assignment, real-time trip state, and disruption monitoring
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchOperationsData}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onExit}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition"
            >
              Exit Ops Desk
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        {/* KPI OVERVIEW RIBBON */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Trips</span>
            <span className="font-mono font-bold text-xl text-slate-950 mt-0.5 block">{stats?.totalAssignments || 0}</span>
            <span className="text-[10px] text-slate-500">In system queue</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Active Journeys</span>
            <span className="font-mono font-bold text-xl text-emerald-700 mt-0.5 block">{stats?.activeTrips || 0}</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Live GPS verified</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Unassigned</span>
            <span className="font-mono font-bold text-xl text-orange-600 mt-0.5 block">{stats?.unassignedTrips || 0}</span>
            <span className="text-[10px] text-orange-700 font-medium">Needs Smart Match</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Reported Delays</span>
            <span className="font-mono font-bold text-xl text-amber-600 mt-0.5 block">{stats?.delayedTrips || 0}</span>
            <span className="text-[10px] text-amber-700">Weather & Traffic</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Active Incidents</span>
            <span className="font-mono font-bold text-xl text-red-600 mt-0.5 block">{stats?.activeIncidents || 0}</span>
            <span className="text-[10px] text-red-700 font-bold">Tier 1 Support</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">On-Time Index</span>
            <span className="font-mono font-bold text-xl text-slate-950 mt-0.5 block">{stats?.onTimePerformance || '98.4%'}</span>
            <span className="text-[10px] text-emerald-600 font-semibold">YatraSync SLA</span>
          </div>
        </div>

        {/* MAIN SPLIT WORKSPACE: LEFT QUEUE, RIGHT INSPECTOR & SMART MATCHER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT 5 COLS: TRIP QUEUE WITH FILTER CHIPS */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Filter Tabs */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200 flex gap-1 text-xs font-bold shadow-xs">
              {(['ALL', 'ACTIVE', 'UNASSIGNED', 'DELAYED', 'INCIDENT'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`flex-1 py-1.5 rounded-xl transition text-[11px] ${
                    statusFilter === tab
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Assignments List */}
            <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
              {filteredAssignments.map((a) => {
                const isSelected = selectedAssignment?.id === a.id;

                return (
                  <div
                    key={a.id}
                    onClick={() => setSelectedAssignment(a)}
                    className={`p-4 rounded-2xl border transition cursor-pointer text-xs space-y-2 bg-white ${
                      isSelected
                        ? 'border-orange-500 ring-2 ring-orange-200 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-500">#{a.id}</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        a.status === 'INCIDENT'
                          ? 'bg-red-100 text-red-900 animate-pulse'
                          : a.status === 'OFFERED'
                          ? 'bg-amber-100 text-amber-900'
                          : a.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-slate-900 text-white'
                      }`}>
                        {a.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{a.destinationName}</h4>
                      <p className="text-slate-500 text-[11px]">{a.travelerName} • {a.guestsCount} Guests</p>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-xl text-[11px] text-slate-700 flex justify-between">
                      <span>Pickup: <strong>{a.pickupTime}</strong></span>
                      <span>Assigned: <strong>{a.partnerName}</strong></span>
                    </div>

                    {a.delayReport && (
                      <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>Delay reported: +{a.delayReport.delayMinutes}m ({a.delayReport.reason})</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT 7 COLS: ASSIGNMENT INSPECTOR & SMART PARTNER MATCHING ENGINE */}
          <div className="lg:col-span-7 space-y-6">
            
            {selectedAssignment ? (
              <>
                {/* Trip Detailed Inspector Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500">#{selectedAssignment.id}</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          PNR: {selectedAssignment.pnr}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-2xl text-slate-950 mt-1">
                        {selectedAssignment.destinationName}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {selectedAssignment.pickupDate} • Scheduled {selectedAssignment.pickupTime}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Fare</span>
                      <span className="font-mono font-bold text-xl text-emerald-700">
                        ₹{selectedAssignment.earnings.totalPayable.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Operational Logistics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Pickup Point & Gate</span>
                      <strong className="text-slate-900 block">{selectedAssignment.pickupLocation}</strong>
                      <span className="text-slate-500">{selectedAssignment.pickupGate}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Drop Location</span>
                      <strong className="text-slate-900 block">{selectedAssignment.dropLocation}</strong>
                      <span className="text-slate-500">Est. Distance: ~{selectedAssignment.estimatedDistanceKm} km</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Customer Information</span>
                      <strong className="text-slate-900 block">{selectedAssignment.travelerName}</strong>
                      <span className="text-slate-500">{selectedAssignment.guestsCount} Guests • {selectedAssignment.luggageCount}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Currently Assigned Partner</span>
                      <strong className="text-orange-700 block">{selectedAssignment.partnerName || 'Unassigned'}</strong>
                      <span className="text-slate-500">{selectedAssignment.assignedRole.replace('_', ' ')}</span>
                    </div>
                  </div>

                  {/* Trip Operational Timeline Status */}
                  <div className="p-3.5 bg-[#faf8f5] rounded-2xl border border-slate-200 text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">Authoritative Trip State History</span>
                    <div className="space-y-1">
                      {selectedAssignment.statusTimeline.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                          <strong className="text-slate-900">{item.status}</strong>
                          <span className="text-slate-400 text-[11px]">({item.timestamp})</span>
                          {item.note && <span className="text-slate-500 italic">- {item.note}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SMART PARTNER MATCHING ENGINE CARD */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-orange-600" />
                      <div>
                        <h4 className="font-serif font-bold text-lg text-slate-950">
                          Smart Partner Matching Engine
                        </h4>
                        <p className="text-xs text-slate-500">
                          Algorithmic ranking based on proximity, language, vehicle capability, and verified rating
                        </p>
                      </div>
                    </div>
                    {matchingLoading && <RefreshCw className="w-4 h-4 animate-spin text-orange-600" />}
                  </div>

                  <div className="space-y-3">
                    {matchingCandidates.map((cand) => {
                      const p = cand.partner;
                      const isCurrentlyAssigned = selectedAssignment.partnerId === p.id;

                      return (
                        <div
                          key={p.id}
                          className={`p-4 rounded-2xl border transition text-xs space-y-2.5 ${
                            isCurrentlyAssigned
                              ? 'bg-orange-50/50 border-orange-300 ring-1 ring-orange-200'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                                {p.fullName.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="font-bold text-sm text-slate-900">{p.fullName}</h5>
                                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                    {p.rating}★ ({p.completedTrips} trips)
                                  </span>
                                </div>
                                <span className="text-slate-500 text-[11px]">
                                  {p.role.replace('_', ' & ')} • {p.languages.slice(0, 3).join(', ')}
                                </span>
                              </div>
                            </div>

                            {/* Smart Match Score Badge */}
                            <div className="text-right">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Match Score</span>
                              <span className="font-mono font-bold text-lg text-emerald-700">{cand.score}/100</span>
                            </div>
                          </div>

                          {/* Explainable Rationale */}
                          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100 text-[11px]">
                            {cand.reasons.map((r: string, idx: number) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                                ✓ {r}
                              </span>
                            ))}
                          </div>

                          {/* Action Button */}
                          <div className="pt-2 flex justify-end">
                            {isCurrentlyAssigned ? (
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Currently Assigned</span>
                              </span>
                            ) : (
                              <button
                                disabled={assigningLoading}
                                onClick={() => handleAssignPartner(p.id)}
                                className="px-4 py-1.5 bg-slate-900 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition"
                              >
                                Assign Partner
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* IMMUTABLE OPERATIONS AUDIT LOG */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                  <h4 className="font-serif font-bold text-base text-slate-950 border-b border-slate-100 pb-2">
                    Operational Event Audit Trail
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto text-xs text-slate-700">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 font-mono text-[11px]">
                        <div className="flex justify-between text-slate-400 mb-0.5">
                          <span>{log.action}</span>
                          <span>{log.timestamp}</span>
                        </div>
                        <p className="text-slate-900 font-sans">{log.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-serif font-bold text-xl text-slate-950">Select a Trip from Queue</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Inspect real-time telemetry, run smart partner matching, and broadcast updates.
                </p>
              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
};
