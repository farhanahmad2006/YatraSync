// Changes made by @MdFarhanAhmad
import React, { useState } from 'react';
import { Users, Calendar, Sparkles, Check, ArrowRight, ShieldCheck, Compass } from 'lucide-react';

interface TripPlannerSectionProps {
  onGeneratePlan: (plan: {
    adults: number;
    children: number;
    durationDays: number;
    interests: string[];
  }) => void;
}

export const TripPlannerSection: React.FC<TripPlannerSectionProps> = ({ onGeneratePlan }) => {
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(1);
  const [durationDays, setDurationDays] = useState<number>(5);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Forts & Palaces',
    'Backwaters & Lakes'
  ]);

  const interestOptions = [
    'Forts & Palaces',
    'Backwaters & Lakes',
    'Temples & Spiritual',
    'Wildlife Reserves',
    'Authentic Regional Cuisine',
    'Himalayan Treks'
  ];

  const toggleInterest = (item: string) => {
    setSelectedInterests(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  // Estimate price dynamically
  const basePricePerAdultDay = 1100;
  const basePricePerChildDay = 550;
  const estimatedPassTotal = Math.round(
    (adults * basePricePerAdultDay + children * basePricePerChildDay) * durationDays * 0.72
  );
  const estimatedGateTotal = Math.round(
    (adults * basePricePerAdultDay + children * basePricePerChildDay) * durationDays
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGeneratePlan({
      adults,
      children,
      durationDays,
      interests: selectedInterests
    });
  };

  return (
    <section id="pass-builder" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-orange-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Smart Custom Pass Builder</span>
              </span>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-white">
                Customize Your Multimodal Journey
              </h2>
              <p className="text-sm text-slate-300">
                Select your group size, travel duration, and favorite experiences to generate a personalized turnstile-ready pass.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Adults & Children Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Adults */}
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block">Adults (12+ yrs)</label>
                    <span className="text-[11px] text-slate-500">Full monument pass access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-extrabold text-sm text-orange-400 w-4 text-center">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(Math.min(10, adults + 1))}
                      className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block">Children (5-11 yrs)</label>
                    <span className="text-[11px] text-slate-500">50% concession pass rate</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-extrabold text-sm text-orange-400 w-4 text-center">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(Math.min(8, children + 1))}
                      className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

              </div>

              {/* Duration Pills */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">Journey Duration</label>
                <div className="grid grid-cols-4 gap-2 text-xs font-bold">
                  {[3, 5, 7, 10].map(days => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setDurationDays(days)}
                      className={`py-3 rounded-xl border text-center transition cursor-pointer ${
                        durationDays === days
                          ? 'bg-orange-600 border-orange-500 text-white shadow-md'
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {days} Days Pass
                    </button>
                  ))}
                </div>
              </div>

              {/* Interest Chips */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">Select Your Interests</label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map(tag => {
                    const isSelected = selectedInterests.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleInterest(tag)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-orange-400" />}
                        <span>{tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-500 text-white py-4 px-6 rounded-2xl font-extrabold text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Compass className="w-4 h-4" />
                <span>Build My Custom Trip Pass & Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          </div>

          {/* Right Column: Live Estimate Summary Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 text-left shadow-xl relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">Estimated Pass Summary</span>
                  <h3 className="font-serif font-bold text-xl text-white mt-0.5">{durationDays}-Day Multimodal Pass</h3>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-[10px] font-bold">
                  28% Savings
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Group Composition:</span>
                  <span className="text-white font-semibold">{adults} Adult(s), {children} Child(ren)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Duration:</span>
                  <span className="text-white font-semibold">{durationDays} Consecutive Days</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Included Services:</span>
                  <span className="text-white font-semibold">Vande Bharat / Express + Homestay + Driver</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Standalone Gate Estimate:</span>
                  <span className="line-through text-slate-500 font-semibold">₹{estimatedGateTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-orange-950/60 border border-orange-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-orange-300 font-bold uppercase tracking-wider block">Est. YatraSync Pass Price</span>
                  <span className="text-2xl font-black text-orange-400">₹{estimatedPassTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 ml-auto mb-0.5" />
                  <span>Turnstile QR Ready</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                ✓ Includes priority gate vouchers, zero host commission, and certified storyteller chauffeur assignment.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
