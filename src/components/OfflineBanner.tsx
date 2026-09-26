// Changes made by @MdFarhanAhmad
import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

interface OfflineBannerProps {
  isOffline: boolean;
  onToggleOffline: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOffline, onToggleOffline }) => {
  if (!isOffline) return null;

  return (
    <aside
      id="offline-banner"
      role="status"
      aria-label="Offline travel mode alert"
      className="bg-slate-900 text-white font-medium text-xs px-4 py-2.5 text-center transition-all flex items-center justify-center gap-2 border-b border-slate-800 z-30"
    >
      <WifiOff className="w-3.5 h-3.5 text-amber-400" />
      <span>
        <strong>Offline Travel Mode Active:</strong> Serving verified cached itinerary, offline vouchers, and emergency contact directories for zero-connectivity zones.
      </span>
      <button
        id="offline-reconnect-btn"
        onClick={onToggleOffline}
        className="underline font-bold ml-2 text-amber-300 hover:text-white flex items-center gap-1"
      >
        <RefreshCw className="w-3 h-3" />
        <span>Reconnect</span>
      </button>
    </aside>
  );
};



