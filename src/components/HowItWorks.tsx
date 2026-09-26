// Changes made by @MdFarhanAhmad
import React from 'react';

export const HowItWorks: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      <div className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200/80 shadow-subtle-card">
        
        <div className="max-w-2xl mx-auto text-center space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-700">
            Seamless Multimodal Architecture
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-slate-950">
            India, planned around you.
          </h2>
          <p className="text-sm text-slate-600">
            Six sequential steps from origin departure to resilient on-ground exploration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              01
            </div>
            <h3 className="font-bold text-base text-slate-950">1. Multimodal Transport</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Compare Trains, Flights, Buses, and Cabs side-by-side with real delay reliability scores and carbon metrics tailored to your selected destination.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              02
            </div>
            <h3 className="font-bold text-base text-slate-950">2. Destination Stays</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Book verified rural homestays and heritage suites located strictly inside your destination with 0% middleman platform commission.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              03
            </div>
            <h3 className="font-bold text-base text-slate-950">3. Driver-as-Storyteller</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Choose an accredited local chauffeur who doubles as a certified heritage storyteller guide for your entire journey duration.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              04
            </div>
            <h3 className="font-bold text-base text-slate-950">4. Autonomous Replan</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If transit delays or mountain weather occurs, our autonomous engine recalculates connections and updates your homestay host via WhatsApp.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};



