// Changes made by @MdFarhanAhmad
import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Plus, 
  Compass, 
  Car, 
  Check, 
  Star,
  Info
} from 'lucide-react';
import { DestinationSuggestion } from '../../types';

interface DestinationSuggestionPanelProps {
  suggestions: DestinationSuggestion[];
  onAddDestination: (suggestion: DestinationSuggestion) => void;
  selectedKeys: string[];
  lastSelectedName?: string;
  isLoading?: boolean;
}

export const DestinationSuggestionPanel: React.FC<DestinationSuggestionPanelProps> = ({
  suggestions,
  onAddDestination,
  selectedKeys,
  lastSelectedName,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="p-6 rounded-3xl bg-orange-50/50 border border-orange-200/70 text-left space-y-4">
        <div className="flex items-center gap-2 text-orange-800">
          <Sparkles className="w-5 h-5 animate-spin text-orange-600" />
          <h4 className="font-bold text-sm">Computing Smart Destination Suggestions...</h4>
        </div>
        <p className="text-xs text-slate-500">Analyzing geographic proximity, travel times, and your personal travel preferences...</p>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-lg text-slate-950">You May Also Like</h4>
            <p className="text-xs text-slate-500">
              {lastSelectedName 
                ? `Intelligent recommendations around ${lastSelectedName}`
                : 'Intelligent recommendations based on your preferences'}
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-orange-800 bg-orange-100/70 border border-orange-200 px-2.5 py-1 rounded-full">
          AI Suggestion Engine
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.slice(0, 6).map((s) => {
          const isAlreadySelected = selectedKeys.includes(s.key);

          return (
            <div
              key={s.key}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                isAlreadySelected
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200/90 hover:border-orange-400 hover:shadow-md'
              }`}
            >
              <div>
                {/* Image & Badges */}
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {s.state}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-white/95 text-slate-900 text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-xs flex items-center gap-1">
                    <Clock className="w-3 h-3 text-orange-600" />
                    <span>~{s.estimatedTravelHours}h travel</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="font-serif font-bold text-base text-slate-950 leading-snug">
                      {s.name}
                    </h5>
                    <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0">
                      {s.recommendedStayNights}N Stay
                    </span>
                  </div>

                  {/* Distance & Mode */}
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-orange-600" />
                      {s.distanceKm} km
                    </span>
                    <span className="flex items-center gap-1 font-medium truncate">
                      <Car className="w-3.5 h-3.5 text-slate-400" />
                      {s.recommendedTransportMode}
                    </span>
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-1">
                    {s.categories.map((cat, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Explainable recommendation tag */}
                  <div className="p-2 rounded-xl bg-orange-50/70 border border-orange-200/50 text-[11px] text-orange-950 flex items-start gap-1.5 leading-relaxed">
                    <Info className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                    <span>{s.explanation}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 pt-0">
                {isAlreadySelected ? (
                  <button
                    disabled
                    className="w-full py-2 rounded-xl bg-slate-100 text-slate-500 font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Already in Journey</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onAddDestination(s)}
                    className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add to Journey</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
