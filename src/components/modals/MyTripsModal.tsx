// Changes made by @MdFarhanAhmad
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  CheckCircle, 
  Ban, 
  ArrowRight, 
  FileText, 
  KeyRound, 
  Plus, 
  Lock, 
  LogIn,
  Sparkles,
  Bookmark,
  Trash2
} from 'lucide-react';
import { BookingRecord, SavedDraft, UserSession, CustomJourneyRecord } from '../../types';

interface MyTripsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingRecord[];
  savedDrafts: SavedDraft[];
  user?: UserSession | null;
  onOpenAuth?: () => void;
  onCancelBooking: (id: string) => void;
  onLoadDraft: (draft: SavedDraft) => void;
  onSelectBookingForPass: (booking: BookingRecord) => void;
  onOpenRentalModal?: (booking: BookingRecord) => void;
  onLoadCustomJourney?: (journey: CustomJourneyRecord) => void;
}

export const MyTripsModal: React.FC<MyTripsModalProps> = ({
  isOpen,
  onClose,
  bookings,
  savedDrafts,
  user,
  onOpenAuth,
  onCancelBooking,
  onLoadDraft,
  onSelectBookingForPass,
  onOpenRentalModal,
  onLoadCustomJourney
}) => {
  const [activeTab, setActiveTab] = useState<'confirmed' | 'drafts' | 'custom'>('confirmed');
  const [customJourneys, setCustomJourneys] = useState<CustomJourneyRecord[]>([]);
  const [isLoadingCustom, setIsLoadingCustom] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setIsLoadingCustom(true);
      const token = localStorage.getItem('safarsetu_jwt_token') || '';
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      fetch('/api/v1/custom-journeys', { headers })
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          if (Array.isArray(data)) {
            setCustomJourneys(data);
          }
        })
        .catch(err => console.error('Failed to load custom journeys:', err))
        .finally(() => setIsLoadingCustom(false));
    }
  }, [isOpen, user]);

  const handleDeleteCustomJourney = async (id: string) => {
    if (!confirm('Are you sure you want to delete this custom journey?')) return;
    const token = localStorage.getItem('safarsetu_jwt_token') || '';
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`/api/v1/custom-journeys/${id}`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) {
        setCustomJourneys(prev => prev.filter(j => j.id !== id));
      }
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  if (!isOpen) return null;

  const displayBookings = user ? bookings : [];
  const displayDrafts = user ? savedDrafts : [];

  return (
    <div id="my-trips-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div id="my-trips-modal" className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-left border border-slate-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#faf8f5]">
          <div>
            <h3 className="font-serif font-bold text-xl text-slate-950">My Journeys & Vouchers</h3>
            <p className="text-xs text-slate-500">Access confirmed travel passes, custom itineraries & saved drafts</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!user ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-lg text-slate-900">Please log in to view your trips</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Sign in to access your confirmed travel passes, DigiLocker credentials, storyteller chauffeur details, and custom journeys.
              </p>
            </div>
            {onOpenAuth && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl transition inline-flex items-center gap-2 shadow-md shadow-orange-500/20"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In / Register</span>
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Tab Controls */}
            <div className="flex border-b border-slate-200 px-5 text-xs font-bold bg-white overflow-x-auto">
              <button
                onClick={() => setActiveTab('confirmed')}
                className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'confirmed' ? 'border-slate-950 text-slate-950' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Travel Passes ({displayBookings.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('custom')}
                className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'custom' ? 'border-orange-600 text-orange-700' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>Custom Journeys ({customJourneys.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('drafts')}
                className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'drafts' ? 'border-slate-950 text-slate-950' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                <span>Predefined Drafts ({displayDrafts.length})</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
              
              {/* Tab 1: Confirmed Passes */}
              {activeTab === 'confirmed' && (
                <>
                  {displayBookings.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 space-y-2">
                      <p className="text-sm">No confirmed travel passes yet.</p>
                      <p className="text-xs">Configure your journey in the builder or planner and confirm your first pass!</p>
                    </div>
                  ) : (
                    displayBookings.map((b) => (
                      <div key={b.id} className="p-4 rounded-2xl bg-[#faf8f5] border border-slate-200 shadow-xs space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                b.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-900'
                              }`}>
                                {b.status}
                              </span>
                              <span className="font-mono text-slate-400 text-[11px]">{b.id}</span>
                            </div>
                            <h4 className="font-serif font-bold text-base text-slate-950 mt-1">
                              {b.origin} → {b.destinationName}
                            </h4>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold text-sm text-slate-950 block">{b.totalCost}</span>
                            <span className="text-[10px] text-slate-500">{b.paymentMethod}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-slate-600 pt-2 border-t border-slate-200">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{b.dates} ({b.nights}N)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>PNR: {b.pnr}</span>
                          </div>
                        </div>

                        {/* Rental Vehicle status */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px]">
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <KeyRound className="w-3.5 h-3.5 text-orange-600" />
                            {b.rentalVehicle ? (
                              <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                Attached: {b.rentalVehicle.vehicle.name} ({b.rentalVehicle.rentalDays}D)
                              </span>
                            ) : (
                              <span className="text-slate-500">No rental vehicle attached</span>
                            )}
                          </div>

                          {b.status !== 'Cancelled' && !b.rentalVehicle && onOpenRentalModal && (
                            <button
                              onClick={() => {
                                onOpenRentalModal(b);
                                onClose();
                              }}
                              className="text-orange-700 hover:text-orange-900 font-bold flex items-center gap-1 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 transition"
                            >
                              <Plus className="w-3 h-3" />
                              <span>+ Rent Vehicle</span>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                          {b.status !== 'Cancelled' && (
                            <button
                              onClick={() => onCancelBooking(b.id)}
                              className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold flex items-center gap-1 transition"
                            >
                              <Ban className="w-3 h-3" />
                              <span>Cancel Booking</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              onSelectBookingForPass(b);
                              onClose();
                            }}
                            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-bold hover:bg-orange-700 transition flex items-center gap-1"
                          >
                            <span>View Pass & Voucher</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}

              {/* Tab 2: Custom Journeys */}
              {activeTab === 'custom' && (
                <>
                  {isLoadingCustom ? (
                    <div className="text-center py-12 text-slate-400 space-y-2">
                      <Sparkles className="w-6 h-6 animate-spin mx-auto text-orange-600" />
                      <p className="text-xs">Loading your saved custom journeys...</p>
                    </div>
                  ) : customJourneys.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 space-y-2">
                      <p className="text-sm">No custom journeys saved yet.</p>
                      <p className="text-xs">Use "Customize My Journey" to design and save your multi-destination travel route!</p>
                    </div>
                  ) : (
                    customJourneys.map(j => (
                      <div key={j.id} className="p-4 rounded-2xl bg-[#faf8f5] border border-slate-200 shadow-xs space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-extrabold text-orange-800 bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-full">
                                {j.status || 'PLANNING'}
                              </span>
                              <span className="font-mono text-slate-400 text-[11px]">{j.id}</span>
                            </div>
                            <h4 className="font-serif font-bold text-base text-slate-950 mt-1">
                              {j.title}
                            </h4>
                            <p className="text-xs text-slate-600 mt-0.5">
                              {j.startLocation} → {j.destinations.map(d => d.destinationName).join(' → ')}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold text-sm text-slate-950 block">
                              ₹{(j.costEstimate?.total || 0).toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-slate-500">{j.durationDays} Days / {j.totalNights}N</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px]">
                          <span className="text-slate-500">
                            {j.adultsCount} Adults • {j.preferences?.join(', ')}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDeleteCustomJourney(j.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Delete Saved Journey"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {onLoadCustomJourney && (
                              <button
                                onClick={() => {
                                  onLoadCustomJourney(j);
                                  onClose();
                                }}
                                className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1"
                              >
                                <span>Open in Builder</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}

              {/* Tab 3: Predefined Drafts */}
              {activeTab === 'drafts' && (
                <>
                  {displayDrafts.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 space-y-2">
                      <p className="text-sm">No saved journey drafts yet.</p>
                      <p className="text-xs">Click "Save Draft" in the top bar of the planner to save your route.</p>
                    </div>
                  ) : (
                    displayDrafts.map((d) => (
                      <div key={d.id} className="p-4 rounded-2xl bg-[#faf8f5] border border-slate-200 shadow-xs flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="font-bold text-slate-950 block">{d.origin} → {d.destinationName}</span>
                          <span className="text-[11px] text-slate-500 block">{d.dates} • Saved {d.updatedAt}</span>
                        </div>
                        <button
                          onClick={() => {
                            onLoadDraft(d);
                            onClose();
                          }}
                          className="px-3.5 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-orange-700 transition"
                        >
                          Load in Planner
                        </button>
                      </div>
                    ))
                  )}
                </>
              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
};
