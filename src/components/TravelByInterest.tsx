// Changes made by @MdFarhanAhmad
import React from 'react';
import { Waves, Landmark, Mountain, UtensilsCrossed, ArrowRight } from 'lucide-react';

interface TravelByInterestProps {
  onSelectStyle: (style: 'coastal' | 'heritage' | 'mountains' | 'food') => void;
}

export const TravelByInterest: React.FC<TravelByInterestProps> = ({ onSelectStyle }) => {
  return (
    <section id="travel-styles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-700">
          Tailored by Passion
        </span>
        <h2 className="font-serif font-bold text-3xl sm:text-4xl text-slate-950">
          Travel India your way.
        </h2>
        <p className="text-sm text-slate-600">
          Choose your passion point to explore handpicked multimodal itineraries, zero-commission homestays, and regional storyteller drivers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 text-left">
        
        {/* Style 1: Coastal & Backwaters */}
        <div 
          onClick={() => onSelectStyle('coastal')} 
          className="group cursor-pointer rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition">
            <Waves className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Backwaters & Coasts</h3>
          <p className="text-xs text-slate-600 mt-1">Houseboats, lagoons & peaceful cliff walks</p>
          <span className="inline-flex items-center gap-1 mt-3 text-[11px] font-bold text-orange-700 group-hover:translate-x-1 transition">
            <span>Explore Kerala & Goa</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {/* Style 2: Heritage & Forts */}
        <div 
          onClick={() => onSelectStyle('heritage')} 
          className="group cursor-pointer rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition">
            <Landmark className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Heritage & Forts</h3>
          <p className="text-xs text-slate-600 mt-1">Kakatiyas, Rajputs & UNESCO citadels</p>
          <span className="inline-flex items-center gap-1 mt-3 text-[11px] font-bold text-orange-700 group-hover:translate-x-1 transition">
            <span>Discover Fortresses</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {/* Style 3: Alpine Mountains */}
        <div 
          onClick={() => onSelectStyle('mountains')} 
          className="group cursor-pointer rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition">
            <Mountain className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Misty Mountains</h3>
          <p className="text-xs text-slate-600 mt-1">High passes, cedar pine valleys & tea slopes</p>
          <span className="inline-flex items-center gap-1 mt-3 text-[11px] font-bold text-slate-900 group-hover:translate-x-1 transition">
            <span>View Mountain Trails</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {/* Style 4: Food & Gastronomy */}
        <div 
          onClick={() => onSelectStyle('food')} 
          className="group cursor-pointer rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition">
            <UtensilsCrossed className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Food & Gastronomy</h3>
          <p className="text-xs text-slate-600 mt-1">Sadya feasts, Malabar fish curry & Nawabi kebabs</p>
          <span className="inline-flex items-center gap-1 mt-3 text-[11px] font-bold text-slate-900 group-hover:translate-x-1 transition">
            <span>Taste Regional Specialties</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

      </div>

    </section>
  );
};



