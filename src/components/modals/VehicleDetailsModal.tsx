// Changes made by @MdFarhanAhmad
import React, { useState } from 'react';
import { X, ShieldCheck, Star, Users, Fuel, Gauge, CheckCircle2, UserCheck, KeyRound, AlertCircle, FileText, Phone, MapPin, Calendar } from 'lucide-react';
import { RentalVehicleOption, RentalVehicleBooking } from '../../types';
import { VehicleImage } from '../common/VehicleImage';

interface VehicleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: RentalVehicleOption | null;
  rentalDays: number;
  startDate: string;
  endDate: string;
  destinationName: string;
  onConfirmRental: (booking: RentalVehicleBooking) => void;
}

export const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  rentalDays,
  startDate,
  endDate,
  destinationName,
  onConfirmRental,
}) => {
  if (!isOpen || !vehicle) return null;

  const [rentalType, setRentalType] = useState<'self_drive' | 'with_driver'>(
    vehicle.supportsSelfDrive ? 'self_drive' : 'with_driver'
  );

  const vehicleRental = vehicle.dailyRate * rentalDays;
  const driverCharges = rentalType === 'with_driver' ? (vehicle.driverChargePerDay || 500) * rentalDays : 0;
  const subtotal = vehicleRental + driverCharges;
  const taxesAndGst = Math.round(subtotal * 0.18); // 18% GST
  const grandTotal = subtotal + taxesAndGst;

  const handleBookNow = () => {
    const booking: RentalVehicleBooking = {
      vehicle,
      rentalType,
      rentalDays,
      pickupDate: startDate || 'Day 1',
      returnDate: endDate || `Day ${rentalDays}`,
      pickupLocation: vehicle.rentalLocation || `${destinationName} Central Hub`,
      dailyRate: vehicle.dailyRate,
      totalCost: grandTotal,
      securityDeposit: vehicle.securityDeposit,
      priceBreakdown: {
        vehicleRental,
        driverCharges,
        taxesAndGst,
        securityDeposit: vehicle.securityDeposit,
        grandTotal
      },
      bookingRef: `RENT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      status: 'CONFIRMED'
    };
    onConfirmRental(booking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-left">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-100">
        
        {/* Header */}
        <div className="p-5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white font-bold shadow-md">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded">
                Verified Indian Vehicle Record
              </span>
              <h3 className="font-serif font-bold text-xl text-white mt-0.5">
                {vehicle.manufacturer} {vehicle.model}
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

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Vehicle Image & Verified Banner */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <VehicleImage vehicle={vehicle} className="w-full h-56" />
            
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span className="bg-slate-950/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-xl shadow-md">
                Reg: {vehicle.registrationState}
              </span>
              <span className="bg-emerald-600/95 text-white text-[11px] font-bold px-3 py-1 rounded-xl flex items-center gap-1 shadow-md">
                <ShieldCheck className="w-4 h-4" />
                <span>0% Platform Commission</span>
              </span>
            </div>
          </div>

          {/* Title & Key Spec Pills */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-serif font-bold text-xl text-slate-950">
                  {vehicle.manufacturer} {vehicle.model} ({vehicle.variant})
                </h4>
                <p className="text-slate-500 text-xs mt-0.5">
                  Model Year: {vehicle.modelYear} • Category: <strong className="text-slate-800 uppercase">{vehicle.categoryLabel}</strong>
                </p>
              </div>
              <div className="bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 shrink-0">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>{vehicle.vendorRating}</span>
                <span className="text-[10px] text-slate-500 font-normal">vendor rating</span>
              </div>
            </div>

            {/* Spec Icons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Capacity</span>
                  <strong className="text-slate-900">{vehicle.seatingCapacity} Passengers</strong>
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-orange-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Transmission</span>
                  <strong className="text-slate-900">{vehicle.transmission}</strong>
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                <Fuel className="w-4 h-4 text-orange-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Fuel Type</span>
                  <strong className="text-slate-900">{vehicle.fuelType}</strong>
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Aircon</span>
                  <strong className="text-slate-900">{vehicle.acAvailable ? 'Air Conditioned' : 'Non-AC'}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Rental Mode Selector (With Driver vs Self Drive) */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block">
              Choose Rental Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              {vehicle.supportsSelfDrive && (
                <button
                  type="button"
                  onClick={() => setRentalType('self_drive')}
                  className={`p-3.5 rounded-2xl border transition text-left flex items-start gap-3 ${rentalType === 'self_drive' ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/20' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                >
                  <KeyRound className={`w-5 h-5 mt-0.5 ${rentalType === 'self_drive' ? 'text-orange-600' : 'text-slate-400'}`} />
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">Self-Drive Rental</span>
                    <span className="text-[11px] text-slate-500">Drive yourself freely • DL Required</span>
                  </div>
                </button>
              )}

              {vehicle.supportsWithDriver && (
                <button
                  type="button"
                  onClick={() => setRentalType('with_driver')}
                  className={`p-3.5 rounded-2xl border transition text-left flex items-start gap-3 ${rentalType === 'with_driver' ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/20' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                >
                  <UserCheck className={`w-5 h-5 mt-0.5 ${rentalType === 'with_driver' ? 'text-orange-600' : 'text-slate-400'}`} />
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">Chauffeur / With Driver</span>
                    <span className="text-[11px] text-slate-500">+₹{vehicle.driverChargePerDay || 500}/day driver charge</span>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Pickup Location & Provider Details */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Pickup & Return Station:</span>
                <span className="text-slate-600">{vehicle.rentalLocation}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-[11px]">
              <span className="text-slate-500">Fleet Provider: <strong className="text-slate-900">{vehicle.vendorName}</strong></span>
              <span className="text-slate-700 font-mono flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                {vehicle.vendorPhone}
              </span>
            </div>
          </div>

          {/* Transparent Itemized Price Breakdown */}
          <div className="bg-[#faf8f5] p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block border-b border-slate-200 pb-1.5">
              Itemized Fare Breakdown ({rentalDays} Days)
            </span>

            <div className="space-y-1.5 text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>Vehicle Daily Rate (₹{vehicle.dailyRate} × {rentalDays} days):</span>
                <span className="font-mono text-slate-900 font-semibold">₹{vehicleRental.toLocaleString('en-IN')}</span>
              </div>

              {rentalType === 'with_driver' && (
                <div className="flex justify-between">
                  <span>Driver Allowance (₹{vehicle.driverChargePerDay || 500} × {rentalDays} days):</span>
                  <span className="font-mono text-slate-900 font-semibold">₹{driverCharges.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Taxes & GST (18%):</span>
                <span className="font-mono text-slate-900 font-semibold">₹{taxesAndGst.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-emerald-800 font-medium">
                <span>Refundable Security Deposit (Payable at pickup):</span>
                <span className="font-mono text-emerald-800 font-bold">₹{vehicle.securityDeposit.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-bold text-slate-950">
                <span>Grand Total:</span>
                <span className="font-mono text-xl text-orange-700">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Features & Terms */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <span className="font-bold text-slate-900 block text-xs">Included Amenities & Features:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-700">
                {vehicle.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl space-y-1 text-[11px] text-amber-900">
              <span className="font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Rental Terms & Conditions:</span>
              </span>
              <ul className="list-disc pl-4 space-y-0.5">
                {vehicle.termsAndConditions.map((term, idx) => (
                  <li key={idx}>{term}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Tariff</span>
            <span className="font-serif font-bold text-xl text-slate-950">
              ₹{grandTotal.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            >
              Close
            </button>
            <button
              onClick={handleBookNow}
              className="text-xs font-bold px-6 py-2.5 rounded-xl bg-orange-600 text-white hover:bg-orange-700 shadow-md flex items-center gap-1.5"
            >
              <span>Confirm & Rent Vehicle</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
