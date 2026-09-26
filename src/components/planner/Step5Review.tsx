// Changes made by @MdFarhanAhmad
import React from 'react';
import { Plane, Home, UserCheck, ShieldCheck, CreditCard, QrCode, ArrowRight, KeyRound } from 'lucide-react';
import { TransportOption, StayOption, DriverOption, RentalVehicleBooking } from '../../types';

interface Step5ReviewProps {
  origin: string;
  destinationName: string;
  datesText: string;
  nights: number;
  guests: number;
  transport: TransportOption | null;
  stay: StayOption | null;
  driver: DriverOption | null;
  rentalVehicle?: RentalVehicleBooking | null;
  paymentMethod: string;
  onPaymentMethodChange: (val: string) => void;
  onConfirmBooking: () => void;
  onGoToStep: (step: 'transport' | 'stays' | 'rental_vehicle' | 'driver') => void;
}

export const Step5Review: React.FC<Step5ReviewProps> = ({
  origin,
  destinationName,
  datesText,
  nights,
  guests,
  transport,
  stay,
  driver,
  rentalVehicle,
  paymentMethod,
  onPaymentMethodChange,
  onConfirmBooking,
  onGoToStep
}) => {
  const transportCost = transport ? transport.price * guests : 0;
  const stayCost = stay ? stay.price * nights : 0;
  const driverCost = driver ? driver.fixedFullTripPrice : 0;
  const rentalVehicleCost = rentalVehicle ? rentalVehicle.totalCost : 0;
  const totalCost = transportCost + stayCost + driverCost + rentalVehicleCost;

  return (
    <div id="content-review" className="space-y-6 text-left">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-subtle-card space-y-6">
        
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700">
              Step 5 of 6 • Comprehensive Review
            </span>
            <h3 className="font-serif font-bold text-2xl text-slate-950">
              Review Your Custom Journey Pass
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-300">
            0% Middleman Commission Guaranteed
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4 text-xs">
            
            {/* Route & Dates Card */}
            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block uppercase text-[10px] tracking-wider">
                Journey Configuration
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 block">Origin</span>
                  <strong>{origin}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Destination</span>
                  <strong>{destinationName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Dates</span>
                  <strong>{datesText}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Duration / Guests</span>
                  <strong>{nights} Nights • {guests} Guests</strong>
                </div>
              </div>
            </div>

            {/* Selected Items Breakdown */}
            <div className="space-y-3">
              
              {/* Transport Card */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start justify-between gap-3 shadow-xs">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Plane className="w-4 h-4 text-orange-600" />
                    <span>Selected Transport ({guests} Travelers)</span>
                  </span>
                  <p className="text-slate-700 font-medium">
                    {transport ? transport.title : "Not Selected"}
                  </p>
                  <span className="text-[11px] text-slate-500 block">
                    {transport ? `${transport.operator} (${transport.duration})` : (
                      <button onClick={() => onGoToStep('transport')} className="text-orange-600 font-bold underline">
                        Please select transport in Step 1
                      </button>
                    )}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-slate-950 block">
                    ₹{transportCost.toLocaleString('en-IN')}
                  </span>
                  {transport && (
                    <span className="text-[10px] text-slate-400">
                      ₹{transport.price} × {guests}
                    </span>
                  )}
                </div>
              </div>

              {/* Accommodation Card */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start justify-between gap-3 shadow-xs">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Home className="w-4 h-4 text-orange-600" />
                    <span>Selected Accommodation ({nights} Nights)</span>
                  </span>
                  <p className="text-slate-700 font-medium">
                    {stay ? stay.name : "Not Selected"}
                  </p>
                  <span className="text-[11px] text-slate-500 block">
                    {stay ? `${stay.location} • Host: ${stay.hostName}` : (
                      <button onClick={() => onGoToStep('stays')} className="text-orange-600 font-bold underline">
                        Please select stay in Step 2
                      </button>
                    )}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-slate-950 block">
                    ₹{stayCost.toLocaleString('en-IN')}
                  </span>
                  {stay && (
                    <span className="text-[10px] text-slate-400">
                      ₹{stay.price} × {nights} nights
                    </span>
                  )}
                </div>
              </div>

              {/* Storyteller Driver Card */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start justify-between gap-3 shadow-xs">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-orange-600" />
                    <span>Storyteller Chauffeur (Fixed Full Trip)</span>
                  </span>
                  <p className="text-slate-700 font-medium">
                    {driver ? `${driver.name} (${driver.role})` : "Not Selected"}
                  </p>
                  <span className="text-[11px] text-slate-500 block">
                    {driver ? `Vehicle: ${driver.vehicle} (${driver.vehicleType})` : (
                      <button onClick={() => onGoToStep('driver')} className="text-orange-600 font-bold underline">
                        Please select driver in Step 3
                      </button>
                    )}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-slate-950 block">
                    ₹{driverCost.toLocaleString('en-IN')}
                  </span>
                  {driver && (
                    <span className="text-[10px] text-slate-400">Full Trip</span>
                  )}
                </div>
              </div>

              {/* Rental Vehicle Card */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start justify-between gap-3 shadow-xs">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-orange-600" />
                    <span>Self-Drive & Scooter Rental (Optional)</span>
                  </span>
                  <p className="text-slate-700 font-medium">
                    {rentalVehicle ? rentalVehicle.vehicle.name : "None Selected (Skipped)"}
                  </p>
                  <span className="text-[11px] text-slate-500 block">
                    {rentalVehicle ? `${rentalVehicle.vehicle.categoryLabel} • ₹${rentalVehicle.dailyRate}/day × ${rentalVehicle.rentalDays} days` : (
                      <button onClick={() => onGoToStep('rental_vehicle')} className="text-orange-600 font-bold underline">
                        Add a self-drive rental vehicle
                      </button>
                    )}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-slate-950 block">
                    ₹{rentalVehicleCost.toLocaleString('en-IN')}
                  </span>
                  {rentalVehicle && (
                    <span className="text-[10px] text-slate-400">{rentalVehicle.rentalDays} Days</span>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Dynamic Fare Calculation & Checkout Card */}
          <div className="bg-[#faf8f5] rounded-2xl border border-slate-200 p-5 space-y-5 text-xs">
            <h4 className="font-bold text-sm text-slate-950 border-b border-slate-200 pb-2">
              Dynamic Fare Calculation
            </h4>
            
            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>Transport ({guests} travelers):</span>
                <span className="font-mono text-slate-900 font-semibold">₹{transportCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Stay ({nights} nights):</span>
                <span className="font-mono text-slate-900 font-semibold">₹{stayCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Storyteller Chauffeur Tariff:</span>
                <span className="font-mono text-slate-900 font-semibold">₹{driverCost.toLocaleString('en-IN')}</span>
              </div>
              {rentalVehicle && (
                <div className="flex justify-between text-orange-950 font-medium">
                  <span>Rental Vehicle ({rentalVehicle.rentalDays} days):</span>
                  <span className="font-mono text-slate-900 font-semibold">₹{rentalVehicleCost.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Autonomous Shield & Platform Fee:</span>
                <span className="font-bold font-mono">₹0 (0% Commission)</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-bold text-slate-950">
                <span>Calculated Total:</span>
                <span className="font-mono text-xl text-orange-700">₹{totalCost.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <label className="font-bold text-slate-900 block text-[11px]">
                Select Payment Method:
              </label>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300">
                  <input
                    type="radio"
                    name="payMethod"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={(e) => onPaymentMethodChange(e.target.value)}
                    className="text-slate-900"
                  />
                  <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                  <span>BHIM UPI / GPay / PhonePe</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300">
                  <input
                    type="radio"
                    name="payMethod"
                    value="CARD"
                    checked={paymentMethod === 'CARD'}
                    onChange={(e) => onPaymentMethodChange(e.target.value)}
                    className="text-slate-900"
                  />
                  <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                  <span>Credit / Debit Card (RuPay, Visa, Mastercard)</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300">
                  <input
                    type="radio"
                    name="payMethod"
                    value="PAYLATER"
                    checked={paymentMethod === 'PAYLATER'}
                    onChange={(e) => onPaymentMethodChange(e.target.value)}
                    className="text-slate-900"
                  />
                  <span>Pay to Host on Arrival (Verified Token)</span>
                </label>
              </div>
              <p className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>100% of tariff settles directly to verified local host and driver.</span>
              </p>
            </div>

            <button
              id="confirm-booking-btn"
              onClick={onConfirmBooking}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Confirm & Generate Travel Pass</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
