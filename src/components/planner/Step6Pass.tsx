// Changes made by @MdFarhanAhmad
import React from 'react';
import { CheckCircle, QrCode, ShieldCheck, Download, Calendar, Luggage, KeyRound, Plus } from 'lucide-react';
import { BookingRecord } from '../../types';

interface Step6PassProps {
  booking: BookingRecord | null;
  onOpenMyTrips: () => void;
  onViewTimeline: () => void;
  onOpenRentalModal?: (booking: BookingRecord) => void;
}

export const Step6Pass: React.FC<Step6PassProps> = ({
  booking,
  onOpenMyTrips,
  onViewTimeline,
  onOpenRentalModal
}) => {
  if (!booking) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4">
        <p className="text-slate-500">No active confirmed pass found. Please review and confirm your journey in Step 5.</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const getSafeString = (val: any, fallback = 'Confirmed'): string => {
    if (typeof val === 'string') return val;
    if (val && typeof val === 'object') {
      return val.name || val.title || val.destinationName || fallback;
    }
    return fallback;
  };

  const transportStr = getSafeString(booking.transport, 'Confirmed Transit');
  const stayStr = getSafeString(booking.stay, 'Verified Homestay Reservation');
  const driverStr = getSafeString(booking.driver, 'Assigned Regional Chauffeur');
  const issuedDateStr = booking.timestamp || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div id="content-confirmation" className="space-y-6 text-left">
      <div id="voucher-card" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-subtle-card max-w-3xl mx-auto space-y-6">
        
        {/* Pass Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-xl shadow-md">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Verified Booking Confirmed
              </span>
              <h3 className="font-serif font-bold text-2xl text-slate-950 mt-1">
                YatraSync Unified Travel Pass
              </h3>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono font-bold text-xs bg-[#faf8f5] px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800 block">
              {booking.id}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Issued: {issuedDateStr}
            </span>
          </div>
        </div>

        {/* Pass Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4 text-xs">
            
            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block">
                Traveler & Route Credentials
              </span>
              <div className="grid grid-cols-2 gap-3 text-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">Destination</span>
                  <strong>{booking.destinationName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Origin</span>
                  <strong>{booking.origin}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Travel Dates</span>
                  <strong>{booking.dates}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Guests / Nights</span>
                  <strong>{booking.guests} Guests • {booking.nights} Nights</strong>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Transport Booking</span>
                  <span className="text-slate-600">{transportStr}</span>
                </div>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Confirmed</span>
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Homestay Reservation</span>
                  <span className="text-slate-600">{stayStr}</span>
                </div>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Host Briefed</span>
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Storyteller Chauffeur</span>
                  <span className="text-slate-600">{driverStr}</span>
                </div>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Assigned</span>
                </span>
              </div>

              {/* Rental Vehicle Pass Row */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                <div>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-orange-600" />
                    <span>Rental Vehicle (Self-Drive)</span>
                  </span>
                  <span className="text-slate-600">
                    {booking.rentalVehicle ? `${booking.rentalVehicle.vehicle.name} (${booking.rentalVehicle.rentalDays} Days)` : 'No rental vehicle attached'}
                  </span>
                </div>
                {booking.rentalVehicle ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Attached</span>
                  </span>
                ) : (
                  onOpenRentalModal && (
                    <button
                      onClick={() => onOpenRentalModal(booking)}
                      className="px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Rent a Vehicle</span>
                    </button>
                  )
                )}
              </div>
            </div>

          </div>

          {/* DigiLocker QR Card */}
          <div className="bg-slate-950 text-white p-5 rounded-2xl flex flex-col justify-between items-center text-center space-y-4 shadow-xl">
            <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">
              DigiLocker QR Sync
            </span>
            <div className="w-32 h-32 bg-white p-2 rounded-xl flex items-center justify-center text-slate-950 shadow-inner">
              <QrCode className="w-24 h-24 text-slate-950" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 block font-mono">
                PNR: {booking.pnr}
              </span>
              <span className="text-xs font-bold text-emerald-400">
                Total Paid: {booking.totalCost}
              </span>
            </div>
            <p className="text-[9px] text-slate-400 leading-tight">
              Scan code with TTE, homestay host & storyteller chauffeur.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>0% Middleman Fee • Direct Host Payout Active</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-900 flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print / Download</span>
            </button>
            <button
              onClick={onOpenMyTrips}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-900 flex items-center gap-1.5 transition"
            >
              <Luggage className="w-3.5 h-3.5" />
              <span>View in My Trips</span>
            </button>
            <button
              onClick={onViewTimeline}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold flex items-center gap-1.5 hover:bg-orange-700 transition"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>View Timeline</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

