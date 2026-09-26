// Changes made by @MdFarhanAhmad
import React from 'react';
import { Compass, Circle } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'landing' | 'planner' | 'operator' | 'partner' | 'admin_ops') => void;
  onOpenMyTrips: () => void;
  onTriggerSOS: () => void;
  onToggleOffline: () => void;
  onScrollTo: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenMyTrips,
  onTriggerSOS,
  onToggleOffline,
  onScrollTo
}) => {
  return (
    <footer className="bg-white border-t border-slate-200 text-xs text-slate-600 mt-auto text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-slate-100">
          
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                <Compass className="w-4 h-4 text-orange-500" />
              </div>
              <span className="font-serif font-bold text-xl text-slate-950">
                Yatra<span className="text-orange-600 font-sans font-black">Sync</span>
              </span>
            </div>
            <p className="text-slate-500 max-w-sm leading-relaxed">
              YatraSync — Intelligent Travel Planning & Unified Journey Management Platform. Plan. Connect. Travel. Connecting travelers directly to destination-specific transport, verified local homestays, and certified storyteller drivers.
            </p>
            <p className="text-[11px] text-slate-400">
              Strict destination data isolation active across all 28 States & 8 Union Territories.
            </p>
          </div>

          <div className="space-y-2.5">
            <span className="font-bold text-slate-950 uppercase tracking-wider text-[11px] block">Explore</span>
            <ul className="space-y-2">
              <li><button onClick={() => { onNavigate('landing'); setTimeout(() => onScrollTo('destination-discovery'), 100); }} className="hover:text-slate-950">Destinations</button></li>
              <li><button onClick={() => { onNavigate('landing'); setTimeout(() => onScrollTo('travel-styles'), 100); }} className="hover:text-slate-950">Backwaters & Lakes</button></li>
              <li><button onClick={() => { onNavigate('landing'); setTimeout(() => onScrollTo('travel-styles'), 100); }} className="hover:text-slate-950">Heritage & Forts</button></li>
              <li><button onClick={() => { onNavigate('landing'); setTimeout(() => onScrollTo('travel-styles'), 100); }} className="hover:text-slate-950">Misty Mountains</button></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <span className="font-bold text-slate-950 uppercase tracking-wider text-[11px] block">Traveler Pass</span>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('planner')} className="hover:text-slate-950 text-left">Trip Planner</button></li>
              <li><button onClick={() => onNavigate('planner')} className="hover:text-slate-950 text-left">1. Transport</button></li>
              <li><button onClick={() => onNavigate('planner')} className="hover:text-slate-950 text-left">2. Destination Stays</button></li>
              <li><button onClick={() => onNavigate('planner')} className="hover:text-slate-950 text-left">3. Driver-Storyteller</button></li>
              <li><button onClick={onOpenMyTrips} className="hover:text-slate-950 text-left">Saved Itineraries</button></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <span className="font-bold text-slate-950 uppercase tracking-wider text-[11px] block">Support & Partners</span>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('partner')} className="hover:text-slate-950 text-left font-bold text-orange-700">Driver & Storyteller Portal</button></li>
              <li><button onClick={() => onNavigate('admin_ops')} className="hover:text-slate-950 text-left font-semibold text-slate-800">Operations Control Desk</button></li>
              <li><button onClick={() => onNavigate('operator')} className="hover:text-slate-950 text-left">Homestay Host Portal</button></li>
              <li><button onClick={onTriggerSOS} className="hover:text-slate-950 text-left text-red-600 font-semibold">Tourist Police 112</button></li>
              <li><button onClick={onToggleOffline} className="hover:text-slate-950 text-left">Offline Mode Help</button></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <p>© 2026 YatraSync Platform. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <Circle className="w-2 h-2 fill-emerald-600 text-emerald-600" />
              <span>System Active & Verified</span>
            </span>
            <span>Terms of Travel</span>
            <span>Privacy Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
};



