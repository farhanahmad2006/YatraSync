// Changes made by @MdFarhanAhmad
import React from 'react';

interface ValueTransparencyProps {
  onConfigureClick: () => void;
}

export const ValueTransparency: React.FC<ValueTransparencyProps> = ({ onConfigureClick }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 lg:p-14 relative overflow-hidden shadow-2xl">
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
              Direct Value & Honest Pricing
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-white">
              Everything you need for your India journey. In one pass.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We eliminate multi-app booking confusion. 100% of accommodation and driver tariffs settle directly to verified local homestay hosts and storyteller chauffeurs with zero middleman fee.
            </p>
            
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800">
              <div>
                <span className="block text-xl sm:text-2xl font-bold font-serif text-white">0%</span>
                <span className="text-xs text-slate-400">Host Platform Fee</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold font-serif text-white">100%</span>
                <span className="text-xs text-slate-400">Direct Host Payout</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold font-serif text-white">&lt; 8 sec</span>
                <span className="text-xs text-slate-400">Replan Resolution</span>
              </div>
            </div>
          </div>

          {/* Cost Estimation Breakdown */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-4 text-left">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10">
              <span className="text-slate-300 font-semibold">Typical 4-Night Journey Cost (2 Guests):</span>
              <span className="text-[11px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded font-bold">Live Breakdown</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Standard Online Travel Agencies:</span>
                <span className="line-through font-mono">₹21,450</span>
              </div>
              <div className="flex justify-between text-white font-bold text-sm">
                <span>With YatraSync Unified Pass:</span>
                <span className="font-mono text-emerald-400">₹16,700</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 flex items-center justify-between text-xs text-orange-200">
                <span>Estimated Traveler Savings:</span>
                <span className="font-bold font-mono">Save ₹4,750 (22%)</span>
              </div>
            </div>

            <button 
              id="value-configure-btn"
              onClick={onConfigureClick} 
              className="w-full py-3 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-orange-50 transition active:scale-95 shadow-md"
            >
              Configure Your Journey Now
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};



