// Changes made by @MdFarhanAhmad
import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, Download, Calculator, PiggyBank, Landmark } from 'lucide-react';

interface TripCalculatorSectionProps {
  onBuildTrip: () => void;
  onDownloadPDF?: (circuitTitle: string, price: number) => void;
}

interface CircuitData {
  key: string;
  title: string;
  subtitle: string;
  badge: string;
  savingsPercentage: number;
  counterGatePriceINR: number;
  passPriceINR: number;
  savingsINR: number;
  perMonumentCostINR: number;
  days: {
    dayNumber: number;
    title: string;
    gateTotalINR: number;
    attractions: { name: string; category: string }[];
  }[];
}

export const TripCalculatorSection: React.FC<TripCalculatorSectionProps> = ({
  onBuildTrip,
  onDownloadPDF
}) => {
  const circuits: CircuitData[] = [
    {
      key: 'gt',
      title: 'Golden Triangle Pass',
      subtitle: 'Delhi • Agra • Jaipur Express Multimodal Circuit',
      badge: 'Most Popular',
      savingsPercentage: 42,
      counterGatePriceINR: 9850,
      passPriceINR: 5699,
      savingsINR: 4151,
      perMonumentCostINR: 633,
      days: [
        {
          dayNumber: 1,
          title: 'Day 1: Historic Delhi Heritage Core',
          gateTotalINR: 2450,
          attractions: [
            { name: 'Red Fort Express Entry', category: 'UNESCO Fort' },
            { name: 'Qutub Minar Priority Gate', category: 'Heritage Complex' },
            { name: 'Humayun’s Tomb Garden', category: 'Mughal Architecture' }
          ]
        },
        {
          dayNumber: 2,
          title: 'Day 2: Agra Wonders & Taj Sunset',
          gateTotalINR: 4200,
          attractions: [
            { name: 'Taj Mahal VIP Sunrise Entry', category: 'World Wonder' },
            { name: 'Agra Fort Royal Palaces', category: 'Imperial Citadel' },
            { name: 'Mehtab Bagh Viewpoint', category: 'Sunset Garden' }
          ]
        },
        {
          dayNumber: 3,
          title: 'Day 3: Royal Jaipur Citadel Trail',
          gateTotalINR: 3200,
          attractions: [
            { name: 'Amber Fort Elephant Gate Pass', category: 'Hill Citadel' },
            { name: 'City Palace Royal Quarter', category: 'Museum & Palace' },
            { name: 'Jantar Mantar Observatory', category: 'Astronomical Site' }
          ]
        }
      ]
    },
    {
      key: 'kerala',
      title: 'Kerala Backwaters & Hills',
      subtitle: 'Kochi • Munnar • Kumarakom Heritage Circuit',
      badge: 'Top Eco Pass',
      savingsPercentage: 38,
      counterGatePriceINR: 8400,
      passPriceINR: 5199,
      savingsINR: 3201,
      perMonumentCostINR: 742,
      days: [
        {
          dayNumber: 1,
          title: 'Day 1: Fort Kochi Colonial & Cultural Trail',
          gateTotalINR: 2100,
          attractions: [
            { name: 'Mattancherry Dutch Palace', category: 'Museum' },
            { name: 'Kathakali Cultural Performance', category: 'Live Heritage' },
            { name: 'Chinese Fishing Net Promenade', category: 'Maritime Walk' }
          ]
        },
        {
          dayNumber: 2,
          title: 'Day 2: Munnar Tea Estate Corridor',
          gateTotalINR: 2900,
          attractions: [
            { name: 'Eravikulam National Park (Nilgiri Tahr)', category: 'Reserve' },
            { name: 'Tata Tea Museum & Tasting', category: 'Estate Experience' },
            { name: 'Mattupetty Lake Speedboat', category: 'Eco Ride' }
          ]
        },
        {
          dayNumber: 3,
          title: 'Day 3: Kumarakom & Vembanad Backwaters',
          gateTotalINR: 3400,
          attractions: [
            { name: 'Vembanad Solar Houseboat Cruise', category: 'Backwater Pass' },
            { name: 'Kumarakom Bird Sanctuary', category: 'Wildlife Trail' },
            { name: 'Kerala Village Craft Demo', category: 'Artisan Workshop' }
          ]
        }
      ]
    },
    {
      key: 'himalaya',
      title: 'Himalayan Foothills Pass',
      subtitle: 'Shimla • Manali • Dharamshala Alpine Corridor',
      badge: 'Scenic Value',
      savingsPercentage: 35,
      counterGatePriceINR: 9200,
      passPriceINR: 5980,
      savingsINR: 3220,
      perMonumentCostINR: 854,
      days: [
        {
          dayNumber: 1,
          title: 'Day 1: Shimla Heritage Ridge & Viceregal Lodge',
          gateTotalINR: 2600,
          attractions: [
            { name: 'Viceregal Lodge Tour', category: 'Colonial Architecture' },
            { name: 'Jakhoo Ropeway Pass', category: 'Cable Car' },
            { name: 'Gaiety Theatre Heritage Access', category: 'Historic Stage' }
          ]
        },
        {
          dayNumber: 2,
          title: 'Day 2: Manali Solang Valley & Tunnel Route',
          gateTotalINR: 3800,
          attractions: [
            { name: 'Atal Tunnel Corridor Entry', category: 'Engineering Marvel' },
            { name: 'Hadimba Wooden Temple', category: 'Ancient Shrine' },
            { name: 'Solang Valley Adventure Access', category: 'Alpine Sports' }
          ]
        },
        {
          dayNumber: 3,
          title: 'Day 3: Dharamshala & Dalai Lama Complex',
          gateTotalINR: 2800,
          attractions: [
            { name: 'Tsuglagkhang Temple Complex', category: 'Spiritual Center' },
            { name: 'Norbulingka Tibetan Art Center', category: 'Craft Academy' },
            { name: 'Bhagsunag Waterfall Walk', category: 'Nature Corridor' }
          ]
        }
      ]
    },
    {
      key: 'telangana',
      title: 'Telangana Royal Heritage Pass',
      subtitle: 'Hyderabad • Warangal • Ramappa UNESCO Circuit',
      badge: 'UNESCO Circuit',
      savingsPercentage: 40,
      counterGatePriceINR: 7500,
      passPriceINR: 4499,
      savingsINR: 3001,
      perMonumentCostINR: 562,
      days: [
        {
          dayNumber: 1,
          title: 'Day 1: Golconda Fort & Qutb Shahi Tombs',
          gateTotalINR: 2300,
          attractions: [
            { name: 'Golconda Citadel Sound & Light', category: 'Heritage Fort' },
            { name: 'Qutb Shahi Tombs Restoration Zone', category: 'Royal Necropolis' },
            { name: 'Charminar Upper Balcony', category: 'Iconic Monument' }
          ]
        },
        {
          dayNumber: 2,
          title: 'Day 2: Chowmahalla & Salar Jung Royal Museum',
          gateTotalINR: 2600,
          attractions: [
            { name: 'Chowmahalla Palace Durbar Hall', category: 'Nizam Palace' },
            { name: 'Salar Jung Museum VIP Entry', category: 'World Artifacts' },
            { name: 'Birla Mandir Panoramic Terrace', category: 'Spiritual Hill' }
          ]
        },
        {
          dayNumber: 3,
          title: 'Day 3: UNESCO Ramappa & Kakatiya Citadel',
          gateTotalINR: 2600,
          attractions: [
            { name: 'Ramappa Floating Brick Temple (UNESCO)', category: 'World Heritage' },
            { name: 'Warangal Fort Gateway Pillars', category: 'Kakatiya Ruins' },
            { name: 'Thousand Pillar Temple', category: 'Stone Sculpture' }
          ]
        }
      ]
    }
  ];

  const [selectedKey, setSelectedKey] = useState<string>('gt');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const currentCircuit = circuits.find(c => c.key === selectedKey) || circuits[0];

  const handleDownload = () => {
    if (onDownloadPDF) {
      onDownloadPDF(currentCircuit.title, currentCircuit.passPriceINR);
    }
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  return (
    <section id="trip-calculator-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-600"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-700">
              Interactive Multimodal Savings Engine
            </span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-slate-950">
            Compare Gate Tickets vs YatraSync Pass
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            See instant price calculations comparing standalone monument counter gate tickets vs unified multimodal entry passes across flagship Indian circuits.
          </p>
        </div>

        {/* Circuit Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
          {circuits.map(c => {
            const isActive = selectedKey === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setSelectedKey(c.key)}
                className={`px-4 py-2.5 rounded-xl transition shadow-xs whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{c.title}</span>
                {isActive && <span className="text-[10px] bg-orange-600 text-white px-1.5 py-0.5 rounded-md font-extrabold">{c.badge}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Calculator Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Day-by-Day Attractions Breakdown */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-slate-950">{currentCircuit.title}</h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">{currentCircuit.subtitle}</p>
            </div>
            <span className="px-3 py-1 bg-orange-50 border border-orange-200 text-orange-800 rounded-lg text-xs font-bold">
              {currentCircuit.badge}
            </span>
          </div>

          {/* Days List */}
          <div className="space-y-4">
            {currentCircuit.days.map((day) => (
              <div key={day.dayNumber} className="rounded-2xl border border-slate-200/70 p-4 bg-[#faf8f5]/80">
                <div className="flex flex-wrap justify-between items-center mb-3 gap-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                    {day.title}
                  </span>
                  <span className="text-xs text-slate-500">
                    Standalone Gate Total: <span className="font-bold text-slate-950">₹{day.gateTotalINR.toLocaleString('en-IN')}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {day.attractions.map((attr, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-2.5 rounded-xl border border-slate-200/60 flex items-center gap-2 shadow-2xs"
                    >
                      <Landmark className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-slate-900 truncate">{attr.name}</p>
                        <p className="text-[10px] font-medium text-slate-500">{attr.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Savings Calculation Card */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-orange-600/20 rounded-full blur-3xl"></div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Pass Value Breakdown</span>
                <h3 className="font-serif font-bold text-2xl text-white mt-0.5">{currentCircuit.title}</h3>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-orange-600 text-white text-xs font-extrabold shadow-md">
                SAVE {currentCircuit.savingsPercentage}%
              </span>
            </div>

            {/* Price Line Items */}
            <div className="space-y-3.5 py-4 border-y border-slate-800 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Standalone Counter Gate Total:</span>
                <span className="line-through text-slate-500 font-semibold">
                  ₹{currentCircuit.counterGatePriceINR.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  YatraSync Multimodal Pass:
                </span>
                <span className="text-xl font-extrabold text-orange-400">
                  ₹{currentCircuit.passPriceINR.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 pl-5">
                Calculates to approx <strong className="text-slate-200">₹{currentCircuit.perMonumentCostINR}</strong> per priority monument & transit hub!
              </p>
            </div>

            {/* Total Savings Highlight Box */}
            <div className="p-4 rounded-2xl bg-orange-950/70 border border-orange-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-sm">
                  <PiggyBank className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-orange-300 uppercase tracking-wider">Your Guaranteed Net Savings</div>
                  <div className="text-xl text-orange-400 font-black">
                    ₹{currentCircuit.savingsINR.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-medium">per traveler</span>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-2">
              <button
                onClick={onBuildTrip}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3.5 px-6 rounded-2xl font-bold text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                <span>Generate My Trip Savings</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleDownload}
                className="w-full bg-white/10 hover:bg-white/15 text-white py-3 px-6 rounded-2xl font-semibold text-xs border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-orange-400" />
                <span>{downloadSuccess ? 'PDF Downloaded to Device!' : 'Download PDF Itinerary Breakdown'}</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
