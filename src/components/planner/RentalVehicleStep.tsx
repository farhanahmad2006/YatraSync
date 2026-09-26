// Changes made by @MdFarhanAhmad
import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Star, Users, Fuel, Gauge, Zap, CheckCircle, Info, Filter, ArrowRight, Eye } from 'lucide-react';
import { RentalVehicleOption, RentalVehicleBooking, RentalVehicleCategory } from '../../types';
import { VehicleImage } from '../common/VehicleImage';
import { VehicleDetailsModal } from '../modals/VehicleDetailsModal';

interface RentalVehicleStepProps {
  vehicles: RentalVehicleOption[];
  tripDays: number;
  startDate: string;
  endDate: string;
  destinationName: string;
  selectedRentalVehicle: RentalVehicleBooking | null;
  onSelectRentalVehicle: (booking: RentalVehicleBooking | null) => void;
}

export const RentalVehicleStep: React.FC<RentalVehicleStepProps> = ({
  vehicles,
  tripDays,
  startDate,
  endDate,
  destinationName,
  selectedRentalVehicle,
  onSelectRentalVehicle,
}) => {
  const [isBrowsing, setIsBrowsing] = useState<boolean>(Boolean(selectedRentalVehicle));
  const [selectedCategory, setSelectedCategory] = useState<RentalVehicleCategory | 'all'>('all');
  const [rentalTypeFilter, setRentalTypeFilter] = useState<'all' | 'self_drive' | 'with_driver'>('all');
  const [inspectVehicle, setInspectVehicle] = useState<RentalVehicleOption | null>(null);

  const filteredVehicles = vehicles.filter(v => {
    if (selectedCategory !== 'all' && v.category !== selectedCategory) return false;
    if (rentalTypeFilter === 'self_drive' && !v.supportsSelfDrive) return false;
    if (rentalTypeFilter === 'with_driver' && !v.supportsWithDriver) return false;
    return true;
  });

  const handleSelectDirect = (vehicle: RentalVehicleOption) => {
    if (selectedRentalVehicle?.vehicle.id === vehicle.id) {
      onSelectRentalVehicle(null);
    } else {
      const mode = vehicle.supportsSelfDrive ? 'self_drive' : 'with_driver';
      const vehicleRental = vehicle.dailyRate * tripDays;
      const driverCharges = mode === 'with_driver' ? (vehicle.driverChargePerDay || 500) * tripDays : 0;
      const subtotal = vehicleRental + driverCharges;
      const taxesAndGst = Math.round(subtotal * 0.18);
      const grandTotal = subtotal + taxesAndGst;

      const booking: RentalVehicleBooking = {
        vehicle,
        rentalType: mode,
        rentalDays: tripDays,
        pickupDate: startDate || 'Day 1',
        returnDate: endDate || `Day ${tripDays}`,
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
      onSelectRentalVehicle(booking);
    }
  };

  return (
    <div id="content-rental-vehicles" className="space-y-6 text-left">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-subtle-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-orange-600" />
              <span>Optional Service</span>
            </span>
            <h3 className="font-serif font-bold text-2xl text-slate-950">
              🚗 Rent a Vehicle
            </h3>
            <p className="text-xs text-slate-600 max-w-2xl">
              Need a vehicle during your trip? Choose from available vehicles near your destination. All rental vehicles feature direct 0% commission transparent rates, verified Indian models, and fully insured protection.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>0% Platform Commission</span>
            </span>
          </div>
        </div>

        {/* Action Toggle Strip: Skip for now VS Browse Vehicles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsBrowsing(false);
                onSelectRentalVehicle(null);
              }}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition ${!isBrowsing && !selectedRentalVehicle ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
            >
              Skip for now
            </button>

            <button
              onClick={() => setIsBrowsing(true)}
              className={`text-xs font-bold px-5 py-2.5 rounded-xl border transition flex items-center gap-1.5 ${isBrowsing || selectedRentalVehicle ? 'bg-orange-600 text-white border-orange-600 shadow-md' : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'}`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Browse Vehicles</span>
            </button>
          </div>

          {selectedRentalVehicle ? (
            <div className="flex items-center gap-3 text-xs bg-orange-50 border border-orange-200 text-orange-950 px-3.5 py-2 rounded-xl">
              <CheckCircle className="w-4 h-4 text-orange-600 shrink-0" />
              <div>
                <strong>Selected: {selectedRentalVehicle.vehicle.manufacturer} {selectedRentalVehicle.vehicle.model}</strong> • <strong>₹{selectedRentalVehicle.totalCost.toLocaleString('en-IN')}</strong> ({tripDays} days total)
              </div>
              <button
                onClick={() => onSelectRentalVehicle(null)}
                className="ml-auto text-[11px] text-orange-700 underline font-semibold hover:text-orange-900"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-slate-400" />
              <span>Rental vehicles are completely optional. You can skip this step anytime.</span>
            </div>
          )}
        </div>
      </div>

      {/* Vehicles Search & Grid (Rendered when Browsing) */}
      {isBrowsing && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Category Filter Tabs & Mode Toggles */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Filter by Indian Vehicle Category
              </span>
              
              {/* Mode Filter */}
              <div className="flex items-center gap-1 text-xs font-semibold bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setRentalTypeFilter('all')}
                  className={`px-3 py-1 rounded-lg transition ${rentalTypeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                >
                  All Modes
                </button>
                <button
                  onClick={() => setRentalTypeFilter('self_drive')}
                  className={`px-3 py-1 rounded-lg transition ${rentalTypeFilter === 'self_drive' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                >
                  Self-Drive
                </button>
                <button
                  onClick={() => setRentalTypeFilter('with_driver')}
                  className={`px-3 py-1 rounded-lg transition ${rentalTypeFilter === 'with_driver' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                >
                  With Driver
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { key: 'all', label: 'All Vehicles' },
                { key: 'hatchback', label: '🚗 Hatchback' },
                { key: 'suv', label: '🚙 SUV & 4x4' },
                { key: 'muv', label: '🚐 MUV' },
                { key: 'scooter_ev', label: '⚡ EV Scooter' },
                { key: 'tempo_traveller', label: '🚌 Tempo Traveller' },
              ].map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key as any)}
                  className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition whitespace-nowrap ${selectedCategory === cat.key ? 'bg-orange-600 text-white shadow-sm' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map(vehicle => {
              const isSelected = selectedRentalVehicle?.vehicle.id === vehicle.id;

              return (
                <div
                  key={vehicle.id}
                  className={`bg-white rounded-2xl border flex flex-col justify-between overflow-hidden shadow-subtle-card transition text-left ${isSelected ? 'border-orange-500 ring-2 ring-orange-500' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  {/* Verified Image or Fallback Header */}
                  <div className="relative h-44 bg-slate-900 overflow-hidden">
                    <VehicleImage vehicle={vehicle} className="w-full h-full" />

                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide">
                        {vehicle.categoryLabel}
                      </span>
                      {vehicle.fuelType === 'Electric' && (
                        <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          <span>Zero Emission</span>
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-900 text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{vehicle.vendorRating}</span>
                    </div>
                  </div>

                  {/* Vehicle Body Info */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-serif font-bold text-base text-slate-950 leading-snug">
                            {vehicle.manufacturer} {vehicle.model}
                          </h4>
                          <span className="text-[11px] text-slate-500 font-mono block">{vehicle.variant}</span>
                        </div>
                      </div>

                      {/* Specs Bullet Row */}
                      <div className="text-[11px] text-slate-600 font-medium pt-1">
                        {vehicle.seatingCapacity} Seater · {vehicle.fuelType} · {vehicle.transmission}
                      </div>

                      {/* Feature Checkmarks */}
                      <div className="flex flex-wrap gap-2 text-[11px] text-slate-700 font-medium pt-1">
                        {vehicle.acAvailable && (
                          <span className="text-emerald-700 flex items-center gap-1">
                            ✓ AC
                          </span>
                        )}
                        <span className="text-emerald-700 flex items-center gap-1">
                          ✓ Spacious
                        </span>
                        <span className="text-emerald-700 flex items-center gap-1">
                          ✓ Verified
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-400 pt-1">
                        Vendor: <span className="text-slate-700 font-medium">{vehicle.vendorName}</span> (Deposit: ₹{vehicle.securityDeposit.toLocaleString('en-IN')})
                      </div>
                    </div>

                    {/* Price & Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tariff</span>
                          <div className="flex items-baseline gap-1">
                            <span className="font-serif font-bold text-lg text-slate-950">₹{vehicle.dailyRate.toLocaleString('en-IN')}</span>
                            <span className="text-xs text-slate-500">/ day</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700">₹{(vehicle.dailyRate * tripDays).toLocaleString('en-IN')} ({tripDays}D Total)</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setInspectVehicle(vehicle)}
                          className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>View Details</span>
                        </button>

                        <button
                          onClick={() => handleSelectDirect(vehicle)}
                          className={`text-xs font-bold px-3 py-2 rounded-xl transition flex items-center justify-center gap-1 ${isSelected ? 'bg-orange-600 text-white shadow-sm' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                        >
                          <span>{isSelected ? 'Selected ✓' : 'Rent Vehicle'}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Vehicle Details Modal */}
      {inspectVehicle && (
        <VehicleDetailsModal
          isOpen={Boolean(inspectVehicle)}
          onClose={() => setInspectVehicle(null)}
          vehicle={inspectVehicle}
          rentalDays={tripDays}
          startDate={startDate}
          endDate={endDate}
          destinationName={destinationName}
          onConfirmRental={(booking) => {
            onSelectRentalVehicle(booking);
            setInspectVehicle(null);
          }}
        />
      )}

    </div>
  );
};
