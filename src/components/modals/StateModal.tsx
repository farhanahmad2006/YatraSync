// Changes made by @MdFarhanAhmad
import React, { useState } from 'react';
import { X, Calendar, MapPin, Tag, ShieldCheck, Phone, CheckCircle, Compass, Star } from 'lucide-react';
import { StateTourism } from '../../types';

interface StateModalProps {
  stateData: StateTourism | null;
  onClose: () => void;
  onPlanTripAroundState: (stateId: string) => void;
}

export const StateModal: React.FC<StateModalProps> = ({
  stateData,
  onClose,
  onPlanTripAroundState
}) => {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'places' | 'season' | 'food' | 'safety'>('itinerary');
  const [itineraryDays, setItineraryDays] = useState<5 | 7>(5);

  if (!stateData) return null;

  const currentItinerary = (itineraryDays === 5 ? (stateData.itinerary5Days || stateData.itinerary5Day) : (stateData.itinerary7Days || stateData.itinerary7Day)) || [];
  const places = stateData.placesToVisit || (stateData.whereToVisit ? stateData.whereToVisit.map(w => ({ name: w.name, tag: w.type, desc: w.desc, bestTime: "All Year" })) : []);
  const foodItems = stateData.foodAndCrafts?.food || (stateData.cuisineAndCrafts?.food ? stateData.cuisineAndCrafts.food.map(f => ({ dish: f, desc: "Traditional regional preparation with local ingredients." })) : []);
  const craftItems = stateData.foodAndCrafts?.crafts || (stateData.cuisineAndCrafts?.crafts ? stateData.cuisineAndCrafts.crafts.map(c => ({ item: c, origin: stateData.name })) : []);
  const safetyList = stateData.safety?.corridors || stateData.safetyAndFeatures || [
    "Airport / Railway Station to major district hubs monitored by 24/7 highway patrol.",
    "Government pre-paid taxi and electric shuttle stands active throughout the night.",
    "Tourist police kiosks stationed at all major monument entrance plazas."
  ];

  return (
    <div id="state-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div id="state-modal-container" className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-left border border-slate-200">
        
        {/* Header Hero Banner */}
        <div className="relative h-60 sm:h-72 bg-slate-900 shrink-0">
          <img
            src={stateData.image}
            alt={stateData.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-orange-600 text-[10px] font-bold uppercase tracking-wider">
                {stateData.badge || (stateData.isUT ? "Union Territory" : "State Tourism Dossier")}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {stateData.capital} • {stateData.duration}
              </span>
            </div>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-white drop-shadow">
              {stateData.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 max-w-2xl">
              {stateData.description}
            </p>
          </div>
        </div>

        {/* Dossier Tabs */}
        <div className="flex border-b border-slate-200 bg-[#faf8f5] px-6 overflow-x-auto scrollbar-none text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`py-3.5 px-4 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'itinerary' ? 'border-slate-950 text-slate-950 font-extrabold' : 'border-transparent hover:text-slate-950'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-orange-600" />
            <span>Day-wise Itinerary</span>
          </button>
          <button
            onClick={() => setActiveTab('places')}
            className={`py-3.5 px-4 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'places' ? 'border-slate-950 text-slate-950 font-extrabold' : 'border-transparent hover:text-slate-950'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-orange-600" />
            <span>Places to Visit ({places.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('season')}
            className={`py-3.5 px-4 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'season' ? 'border-slate-950 text-slate-950 font-extrabold' : 'border-transparent hover:text-slate-950'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-orange-600" />
            <span>When to Visit & Savings</span>
          </button>
          <button
            onClick={() => setActiveTab('food')}
            className={`py-3.5 px-4 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'food' ? 'border-slate-950 text-slate-950 font-extrabold' : 'border-transparent hover:text-slate-950'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-orange-600" />
            <span>Food & Crafts</span>
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`py-3.5 px-4 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'safety' ? 'border-slate-950 text-slate-950 font-extrabold' : 'border-transparent hover:text-slate-950'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Safety Corridors</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          
          {/* TAB 1: ITINERARY */}
          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-sm text-slate-950">
                  Curated Day-by-Day Journey Breakdown
                </span>
                <div className="inline-flex p-1 bg-slate-100 rounded-xl font-bold">
                  <button
                    onClick={() => setItineraryDays(5)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition ${
                      itineraryDays === 5 ? 'bg-slate-900 text-white' : 'text-slate-700'
                    }`}
                  >
                    5-Day Itinerary
                  </button>
                  <button
                    onClick={() => setItineraryDays(7)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition ${
                      itineraryDays === 7 ? 'bg-slate-900 text-white' : 'text-slate-700'
                    }`}
                  >
                    7-Day Complete Immersion
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {currentItinerary.map((dayItem) => (
                  <div key={dayItem.day} className="p-4 rounded-2xl bg-[#faf8f5] border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-950 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs">
                          {dayItem.day}
                        </span>
                        <span>{dayItem.title}</span>
                      </span>
                    </div>
                    <div className="space-y-1.5 pl-8 text-slate-600">
                      <div><strong className="text-slate-900">Morning:</strong> {dayItem.morning}</div>
                      <div><strong className="text-slate-900">Afternoon:</strong> {dayItem.afternoon}</div>
                      <div><strong className="text-slate-900">Evening:</strong> {dayItem.evening}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PLACES TO VISIT */}
          {activeTab === 'places' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {places.map((place, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-950">{place.name}</h4>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                      {place.tag}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{place.desc}</p>
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-orange-700 font-semibold flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>Best Time: {place.bestTime}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: WHEN TO VISIT & SAVINGS */}
          {activeTab === 'season' && stateData.whenToVisit && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#faf8f5] border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Peak Season</span>
                  <div className="font-bold text-sm text-slate-950">{stateData.whenToVisit.bestSeason}</div>
                  <p className="text-slate-600">{stateData.whenToVisit.climateNote || "Pleasant weather across heritage corridors and sightseeing spots."}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#faf8f5] border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Shoulder Season (Best Value)</span>
                  <div className="font-bold text-sm text-emerald-800">{stateData.whenToVisit.shoulderSeason || "Early Monsoon / Spring"}</div>
                  <p className="text-slate-600">Fewer crowds, lush landscapes, and substantial savings.</p>
                </div>
              </div>

              {stateData.whenToVisit.budgetAnalysis && (
                <div className="p-5 rounded-2xl bg-slate-950 text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase text-orange-400">Budget Analysis & Direct Pass Advantage</span>
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">
                      {stateData.whenToVisit.budgetAnalysis.averageSavings}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">Typical Hotel + Taxi Booking:</span>
                      <strong className="font-mono text-slate-300">{stateData.whenToVisit.budgetAnalysis.typicalCost || "₹22,000"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">With YatraSync Direct Host Pass:</span>
                      <strong className="font-mono text-emerald-400">{stateData.whenToVisit.budgetAnalysis.safarSetuCost || "₹16,500"}</strong>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 pt-2 border-t border-slate-800">
                    {stateData.whenToVisit.budgetAnalysis.tip || stateData.whenToVisit.budgetAnalysis.budgetTip}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FOOD & CRAFTS */}
          {activeTab === 'food' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm text-slate-950 mb-3">Authentic Regional Gastronomy</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {foodItems.map((dish, idx) => (
                    <div key={idx} className="p-3 bg-[#faf8f5] rounded-xl border border-slate-200 flex items-start gap-2">
                      <Star className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-950 block">{dish.dish}</strong>
                        <span className="text-slate-600 text-[11px]">{dish.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <h4 className="font-bold text-sm text-slate-950 mb-3">Handicraft & Artisan Heritage</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {craftItems.map((craft, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2 shadow-xs">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-950 block">{craft.item}</strong>
                        <span className="text-slate-600 text-[11px]">{craft.origin}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SAFETY CORRIDORS */}
          {activeTab === 'safety' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  <div>
                    <h4 className="font-bold text-sm text-emerald-950">
                      Women Traveler Safety Rating: {stateData.safety?.womanTravelerRating || "Verified Safe Corridor (4.8/5)"}
                    </h4>
                    <p className="text-emerald-800 text-[11px]">
                      Verified night transit corridors, GPS monitored storytelling chauffeurs, and state tourist police booths.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Tourist Police Helpline</span>
                  <div className="text-base font-bold text-slate-950 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-orange-600" />
                    <span>{stateData.safety?.touristPoliceHelpline || "112 / +91 1800-425-4747"}</span>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Medical Emergency Network</span>
                  <div className="text-base font-bold text-slate-950 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>108 (Ambulance)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#faf8f5] rounded-xl border border-slate-200 space-y-2">
                <strong className="text-slate-900 block">Vetted Safety Corridors & Night Transit:</strong>
                <ul className="space-y-1 text-slate-600 pl-4 list-disc">
                  {safetyList.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer CTA */}
        <div className="p-5 border-t border-slate-200 bg-[#faf8f5] flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Zero-commission bookings direct to certified homestays & drivers.
          </span>
          <button
            onClick={() => {
              onClose();
              onPlanTripAroundState(stateData.id);
            }}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Plan Trip Around {stateData.name}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
