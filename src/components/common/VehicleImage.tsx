// Changes made by @MdFarhanAhmad
import React from 'react';
import { Car, ShieldAlert } from 'lucide-react';
import { RentalVehicleOption } from '../../types';

interface VehicleImageProps {
  vehicle: RentalVehicleOption;
  className?: string;
}

export const VehicleImage: React.FC<VehicleImageProps> = ({ vehicle, className = 'w-full h-44' }) => {
  const isImageValid = Boolean(
    vehicle.image_verified && 
    vehicle.image_vehicle_match && 
    vehicle.image_url && 
    vehicle.image_url.trim().length > 0
  );

  if (isImageValid) {
    return (
      <img
        src={vehicle.image_url}
        alt={`${vehicle.manufacturer} ${vehicle.model}`}
        className={`object-cover ${className}`}
      />
    );
  }

  // Strict Fallback for Unverified or Mismatched Images
  return (
    <div className={`bg-gradient-to-br from-slate-800 to-slate-950 text-white flex flex-col items-center justify-center p-4 text-center relative overflow-hidden select-none ${className}`}>
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
      
      <div className="relative z-10 space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 text-orange-400 flex items-center justify-center mx-auto shadow-inner">
          <Car className="w-6 h-6" />
        </div>
        
        <div className="space-y-0.5">
          <span className="font-serif font-bold text-sm text-slate-100 block">
            {vehicle.manufacturer} {vehicle.model}
          </span>
          <span className="text-[10px] text-slate-400 font-mono block">
            {vehicle.variant} ({vehicle.modelYear})
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
          <ShieldAlert className="w-3 h-3 text-amber-400" />
          <span>Vehicle image unavailable</span>
        </div>
      </div>
    </div>
  );
};



