// Changes made by @MdFarhanAhmad
import React from 'react';
import { PlaneTakeoff, MapPin, Calendar, Users, Compass, Zap } from 'lucide-react';
import { ALL_STATES_AND_UTS } from '../data/destinations';

interface TripConfiguratorProps {
  origin: string;
  onOriginChange: (val: string) => void;
  destination: string;
  onDestinationChange: (val: string) => void;
  datesText: string;
  onDatesChange: (val: string) => void;
  calculatedNights: number;
  persona: string;
  onPersonaChange: (val: string) => void;
  onBuildTrip: () => void;
  activeTags: string[];
  onToggleTag: (tag: string) => void;
}

export const TripConfigurator: React.FC<TripConfiguratorProps> = ({
  origin,
  onOriginChange,
  destination,
  onDestinationChange,
  datesText,
  onDatesChange,
  calculatedNights,
  persona,
  onPersonaChange,
  onBuildTrip,
  activeTags,
  onToggleTag
}) => {
  return (
    <div id="trip-configurator-card" className="relative z-20 -mt-10 sm:-mt-14 max-w-6xl mx-auto px-2 sm:px-4">
      <div className="liquid-glass-panel rounded-3xl p-4 sm:p-6 transition-all">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 text-left items-stretch">
          
          {/* 1. Origin Dropdown */}
          <div className="p-3.5 bg-white/95 rounded-2xl border border-slate-200/70 hover:border-slate-300 transition shadow-xs flex flex-col justify-between h-full">
            <label htmlFor="config-origin-select" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
              <PlaneTakeoff className="w-3.5 h-3.5 text-orange-600" />
              <span>From (Origin)</span>
            </label>
            <select
              id="config-origin-select"
              value={origin}
              onChange={(e) => onOriginChange(e.target.value)}
              className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none cursor-pointer py-1"
            >
              <option value="Hyderabad">Hyderabad (HYD)</option>
              <option value="Bengaluru">Bengaluru (BLR)</option>
              <option value="Mumbai">Mumbai (BOM)</option>
              <option value="Delhi">Delhi (DEL)</option>
              <option value="Chennai">Chennai (MAA)</option>
              <option value="Kolkata">Kolkata (CCU)</option>
            </select>
          </div>

          {/* 2. Destination Selector */}
          <div className="p-3.5 bg-white/95 rounded-2xl border border-slate-200/70 hover:border-slate-300 transition shadow-xs flex flex-col justify-between h-full">
            <label htmlFor="config-dest-select" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span>Where to?</span>
            </label>
            <select
              id="config-dest-select"
              value={destination}
              onChange={(e) => onDestinationChange(e.target.value)}
              className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none cursor-pointer truncate py-1"
            >
              {ALL_STATES_AND_UTS.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.capital})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Dates Picker */}
          <div className="p-3.5 bg-white/95 rounded-2xl border border-slate-200/70 hover:border-slate-300 transition shadow-xs flex flex-col justify-between h-full">
            <label htmlFor="config-dates-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-orange-600" />
              <span>Dates</span>
            </label>
            <div>
              <input
                id="config-dates-input"
                type="text"
                value={datesText}
                onChange={(e) => onDatesChange(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
                placeholder="Oct 14 - Oct 18, 2026"
              />
              <span id="calculated-nights-badge" className="text-[10px] text-orange-800 font-bold block mt-0.5">
                Calculated: {calculatedNights} Nights
              </span>
            </div>
          </div>

          {/* 4. Travelers */}
          <div className="p-3.5 bg-white/95 rounded-2xl border border-slate-200/70 hover:border-slate-300 transition shadow-xs flex flex-col justify-between h-full">
            <label htmlFor="config-travelers-select" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-orange-600" />
              <span>Travelers</span>
            </label>
            <select
              id="config-travelers-select"
              value={persona}
              onChange={(e) => onPersonaChange(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer py-1"
            >
              <option value="couple">2 Adults (Couple)</option>
              <option value="solo_female">1 Adult (Solo Female)</option>
              <option value="family">4 Adults (Family)</option>
              <option value="backpacker">1 Adult (Backpacker)</option>
            </select>
          </div>

          {/* 5. Action Button */}
          <div className="flex items-stretch h-full">
            <button
              id="config-build-trip-btn"
              onClick={onBuildTrip}
              className="w-full min-h-[58px] rounded-2xl bg-slate-900 hover:bg-orange-700 active:scale-98 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-md transition-all duration-300 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-orange-400" />
              <span>Build My Trip</span>
            </button>
          </div>

        </div>

        {/* Quick Passion Filter Chips */}
        <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-500 font-semibold text-[11px]">What do you love?</span>
            {['Backwaters & Lakes', 'Heritage & Forts', 'Authentic Food', 'Misty Mountains'].map(tag => {
              const isSelected = activeTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onToggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition shadow-xs ${isSelected ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-orange-600" />
            <span>Strict destination data isolation active</span>
          </div>
        </div>

      </div>
    </div>
  );
};
