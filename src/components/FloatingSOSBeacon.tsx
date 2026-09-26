// Changes made by @MdFarhanAhmad
import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface FloatingSOSBeaconProps {
  onTriggerSOS: () => void;
}

export const FloatingSOSBeacon: React.FC<FloatingSOSBeaconProps> = ({ onTriggerSOS }) => {
  return (
    <div id="floating-sos-beacon" className="fixed bottom-5 right-5 z-40">
      <button
        onClick={onTriggerSOS}
        className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-xs shadow-2xl flex items-center gap-2 border-2 border-white animate-bounce-subtle transition-all duration-300 active:scale-95"
        title="Emergency SOS (Police 112 & GPS Beacon)"
        aria-label="Tourist Emergency SOS"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
        <ShieldAlert className="w-4 h-4 text-white" />
        <span className="tracking-wide uppercase font-extrabold text-[11px]">Tourist SOS</span>
      </button>
    </div>
  );
};



