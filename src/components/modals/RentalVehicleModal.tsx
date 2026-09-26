// Changes made by @MdFarhanAhmad
import React, { useState } from 'react';
import { X, KeyRound, ShieldCheck, CheckCircle2, Star, Users, Fuel, Gauge, Zap, MapPin, Calendar, Clock, AlertCircle } from 'lucide-react';
import { RentalVehicleOption, RentalVehicleBooking, BookingRecord } from '../../types';
import { getRentalVehicles } from '../../data/destinations';
import { VehicleImage } from '../common/VehicleImage';

interface RentalVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingRecord;
  onAttachVehicle: (bookingId: string, vehicleBooking: RentalVehicleBooking) => void;
}

export const RentalVehicleModal: React.FC<RentalVehicleModalProps> = ({
  isOpen,
  onClose,
  booking,
  onAttachVehicle,
}) => {
  if (!isOpen) return null;

  const availableVehicles = getRentalVehicles(booking.destinationKey || 'kerala');
  const [selectedVehicle, setSelectedVehicle] = useState<RentalVehicleOption | null>(availableVehicles[0] || null);
  const [rentalMode, setRentalMode] = useState<'self_drive' | 'with_driver'>('self_drive');
  const [rentalDurationType, setRentalDurationType] = useState<'trip_duration' | 'custom_days' | 'custom_hours'>('trip_duration');
  const [rentalDays, setRentalDays] = useState<number>(booking.nights || 3);
  const [rentalHours, setRentalHours] = useState<number>(12);
  const [pickupLocation, setPickupLocation] = useState<string>(`${booking.destinationName} Airport / Hotel Lobby`);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Calculate pricing breakdown
  const dailyRate = selectedVehicle ? selectedVehicle.dailyRate : 0;
  const daysToCharge = rentalDurationType === 'custom_hours' ? Math.max(1, Math.ceil(rentalHours / 24)) : rentalDays;
  
  const vehicleRentalCost = rentalDurationType === 'custom_hours' && selectedVehicle?.hourlyRate 
    ? selectedVehicle.hourlyRate * rentalHours 
    : dailyRate * daysToCharge;

  const driverCharges = rentalMode === 'with_driver' ? (selectedVehicle?.driverChargePerDay || 500) * daysToCharge : 0;
  const subtotal = vehicleRentalCost + driverCharges;
  const taxesAndGst = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + taxesAndGst;

  const handleConfirmAttach = () => {
    if (!selectedVehicle) return;

    // Enforce trip date boundaries
    if (rentalDays > (booking.nights || 7)) {
      setValidationError(`Rental duration (${rentalDays} days) cannot exceed active trip duration (${booking.nights || 7} days).`);
      return;
    }
    setValidationError(null);

    setIsConfirming(true);
    setTimeout(() => {
      const vehicleBooking: RentalVehicleBooking = {
        vehicle: selectedVehicle,
        rentalType: rentalMode,
        rentalDays: daysToCharge,
        rentalHours: rentalDurationType === 'custom_hours' ? rentalHours : undefined,
        pickupDate: booking.dates?.split(' - ')[0] || 'Today (Active Trip)',
        returnDate: booking.dates?.split(' - ')[1] || 'Trip Conclusion',
        pickupLocation,
        dailyRate,
        totalCost: grandTotal,
        securityDeposit: selectedVehicle.securityDeposit,
        priceBreakdown: {
          vehicleRental: vehicleRentalCost,
          driverCharges,
          taxesAndGst,
          securityDeposit: selectedVehicle.securityDeposit,
          grandTotal
        },
        bookingRef: `RENT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        status: 'CONFIRMED'
      };

      onAttachVehicle(booking.id, vehicleBooking);
      setIsConfirming(false);
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-left">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-100">
        
        {/* Header */}
        <div className="p-6 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white font-bold shadow-md">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded">
                  Active Trip Rental
                </span>
                <span className="text-xs text-slate-400 font-mono">PNR: {booking.pnr}</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-white mt-0.5">
                Rent a Vehicle for Active Trip ({booking.destinationName})
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {successMessage ? (
          <div className="p-12 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-serif font-bold text-2xl text-slate-900">Rental Vehicle Confirmed!</h4>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your <strong>{selectedVehicle?.manufacturer} {selectedVehicle?.model}</strong> has been attached to active pass <strong>{booking.pnr}</strong>.
            </p>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            
            {/* Active Trip Info Banner */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-orange-950">
              <div className="space-y-0.5">
                <span className="font-bold block text-orange-900">Active Journey Dates: {booking.dates}</span>
                <p className="text-orange-800 text-[11px]">
                  Vehicle delivery is available directly at your active hotel in {booking.destinationName} or city pickup station.
                </p>
              </div>
              <span className="bg-white text-orange-900 font-bold px-3 py-1.5 rounded-xl border border-orange-200 shrink-0 text-[11px] shadow-xs">
                0% Platform Commission
              </span>
            </div>

            {/* Rental Duration Selector */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <label className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block">
                Select Active Rental Duration
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRentalDurationType('trip_duration');
                    setRentalDays(booking.nights || 3);
                  }}
                  className={`p-3 rounded-xl border font-bold text-xs transition text-left ${rentalDurationType === 'trip_duration' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'}`}
                >
                  <span>Full Remaining Trip</span>
                  <span className="block text-[10px] font-normal opacity-90">{booking.nights || 3} Days</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRentalDurationType('custom_days')}
                  className={`p-3 rounded-xl border font-bold text-xs transition text-left ${rentalDurationType === 'custom_days' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'}`}
                >
                  <span>Select Days</span>
                  <span className="block text-[10px] font-normal opacity-90">Custom Day Count</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRentalDurationType('custom_hours')}
                  className={`p-3 rounded-xl border font-bold text-xs transition text-left ${rentalDurationType === 'custom_hours' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'}`}
                >
                  <span>Hourly Rental</span>
                  <span className="block text-[10px] font-normal opacity-90">Short Duration</span>
                </button>
              </div>

              {rentalDurationType === 'custom_days' && (
                <div className="pt-2 flex items-center gap-3">
                  <label className="font-semibold text-slate-700">Days:</label>
                  <select
                    value={rentalDays}
                    onChange={(e) => setRentalDays(Number(e.target.value))}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 font-bold"
                  >
                    {Array.from({ length: booking.nights || 7 }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>{num} Days</option>
                    ))}
                  </select>
                </div>
              )}

              {rentalDurationType === 'custom_hours' && (
                <div className="pt-2 flex items-center gap-3">
                  <label className="font-semibold text-slate-700">Hours:</label>
                  <select
                    value={rentalHours}
                    onChange={(e) => setRentalHours(Number(e.target.value))}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 font-bold"
                  >
                    {[4, 8, 12, 24, 48].map(hrs => (
                      <option key={hrs} value={hrs}>{hrs} Hours</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-2">
                <label className="font-semibold text-slate-700 block mb-1">Pickup Location:</label>
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="e.g. Hotel Lobby / Central Station"
                />
              </div>
            </div>

            {validationError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Vehicle Selection List */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase text-slate-900 tracking-wider">
                Select Verified Indian Fleet
              </h4>

              <div className="space-y-3">
                {availableVehicles.map(vehicle => {
                  const isSelected = selectedVehicle?.id === vehicle.id;

                  return (
                    <div
                      key={vehicle.id}
                      onClick={() => setSelectedVehicle(vehicle)}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col sm:flex-row items-center gap-4 ${isSelected ? 'bg-orange-50/50 border-orange-500 ring-2 ring-orange-500/20' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                    >
                      <div className="w-full sm:w-36 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-900">
                        <VehicleImage vehicle={vehicle} className="w-full h-full" />
                      </div>

                      <div className="flex-1 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-sm text-slate-900">{vehicle.manufacturer} {vehicle.model}</h5>
                          <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px]">
                            ★ {vehicle.vendorRating}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500">
                          {vehicle.variant} • {vehicle.seatingCapacity} Seats · {vehicle.fuelType} · {vehicle.transmission}
                        </p>

                        <p className="text-[11px] text-slate-600">
                          Vendor: {vehicle.vendorName} (Reg: {vehicle.registrationState})
                        </p>
                      </div>

                      <div className="text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                        <div>
                          <span className="font-serif font-bold text-base text-slate-950 block">₹{vehicle.dailyRate} <span className="text-xs font-normal text-slate-500">/day</span></span>
                        </div>
                        <button
                          type="button"
                          className={`mt-2 text-xs font-bold px-3 py-1.5 rounded-xl transition ${isSelected ? 'bg-orange-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                        >
                          {isSelected ? 'Selected ✓' : 'Select'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price Breakdown Preview */}
            <div className="bg-[#faf8f5] p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block border-b border-slate-200 pb-1">
                Itemized Price Breakdown
              </span>

              <div className="space-y-1.5 text-slate-600 pt-1">
                <div className="flex justify-between">
                  <span>Vehicle Rental:</span>
                  <span className="font-mono text-slate-900 font-semibold">₹{vehicleRentalCost.toLocaleString('en-IN')}</span>
                </div>
                {rentalMode === 'with_driver' && (
                  <div className="flex justify-between">
                    <span>Driver Allowance:</span>
                    <span className="font-mono text-slate-900 font-semibold">₹{driverCharges.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxes & GST (18%):</span>
                  <span className="font-mono text-slate-900 font-semibold">₹{taxesAndGst.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-bold text-slate-950">
                  <span>Total Payable:</span>
                  <span className="font-mono text-xl text-orange-700">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Footer Actions */}
        {!successMessage && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Tariff</span>
              <span className="font-serif font-bold text-lg text-slate-950">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAttach}
                disabled={!selectedVehicle || isConfirming}
                className="text-xs font-bold px-6 py-2.5 rounded-xl bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2 shadow-md"
              >
                {isConfirming ? 'Attaching to Active Trip...' : 'Confirm & Attach Rental'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
