// Changes made by @MdFarhanAhmad
import React from 'react';
import { X, Waves, Landmark, Mountain, UtensilsCrossed, ArrowRight, MapPin, Compass, ShieldCheck } from 'lucide-react';
import { StateTourism } from '../../types';
import { COMPLETE_TOURISM_REGISTRY } from '../../data/destinations';

export type TravelStyleKey = 'coastal' | 'heritage' | 'mountains' | 'food';

interface ThemeDestinationsModalProps {
  styleKey: TravelStyleKey | null;
  onClose: () => void;
  onOpenDossier: (stateId: string) => void;
  onPlanTrip: (stateId: string) => void;
}

const THEME_CONFIGS: Record<TravelStyleKey, {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  themeColor: string;
  badgeBg: string;
  badgeText: string;
  stateIds: string[];
}> = {
  coastal: {
    title: "Backwaters, Lagoons & Coastal Havens",
    subtitle: "Tranquil backwater houseboats, pristine coral atolls, laterite cliff walks, and palm-fringed maritime corridors.",
    icon: <Waves className="w-7 h-7 text-blue-600" />,
    themeColor: "from-blue-600 to-teal-700",
    badgeBg: "bg-blue-50 border-blue-200/80",
    badgeText: "text-blue-700",
    stateIds: ['kerala', 'goa', 'andaman', 'odisha', 'puducherry', 'lakshadweep']
  },
  heritage: {
    title: "Heritage Citadels, Forts & UNESCO Wonders",
    subtitle: "Immerse in the royal legacies of the Kakatiyas, Rajputs, Mughals, and Cholas across architectural masterpieces.",
    icon: <Landmark className="w-7 h-7 text-orange-600" />,
    themeColor: "from-orange-600 to-amber-700",
    badgeBg: "bg-orange-50 border-orange-200/80",
    badgeText: "text-orange-700",
    stateIds: ['telangana', 'rajasthan', 'uttarpradesh', 'tamilnadu', 'karnataka', 'madhyapradesh', 'bihar']
  },
  mountains: {
    title: "Misty Mountain Trails & Alpine Passes",
    subtitle: "High-altitude Himalayan mountain passes, emerald tea terraces, cedar pine valleys, and crystal lakes.",
    icon: <Mountain className="w-7 h-7 text-emerald-600" />,
    themeColor: "from-emerald-600 to-teal-800",
    badgeBg: "bg-emerald-50 border-emerald-200/80",
    badgeText: "text-emerald-700",
    stateIds: ['himachal', 'uttarakhand', 'ladakh', 'sikkim', 'meghalaya', 'arunachalpradesh']
  },
  food: {
    title: "Gastronomy, Spice Trails & Royal Kitchens",
    subtitle: "Savor authentic Sadya banana leaf feasts, Hyderabadi Dum Biryani, Awadhi Dum Pukht, and coastal seafood curries.",
    icon: <UtensilsCrossed className="w-7 h-7 text-amber-600" />,
    themeColor: "from-amber-600 to-rose-700",
    badgeBg: "bg-amber-50 border-amber-200/80",
    badgeText: "text-amber-800",
    stateIds: ['kerala', 'uttarpradesh', 'punjab', 'westbengal', 'goa', 'telangana', 'rajasthan']
  }
};

export const ThemeDestinationsModal: React.FC<ThemeDestinationsModalProps> = ({
  styleKey,
  onClose,
  onOpenDossier,
  onPlanTrip
}) => {
  if (!styleKey) return null;

  const config = THEME_CONFIGS[styleKey];
  if (!config) return null;

  const destinations: StateTourism[] = config.stateIds
    .map(id => COMPLETE_TOURISM_REGISTRY[id])
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-5xl w-full overflow-hidden flex flex-col max-h-[92vh] text-left">
        
        {/* Modal Header */}
        <div className={`p-6 sm:p-8 bg-gradient-to-r ${config.themeColor} text-white relative flex flex-col justify-between`}>
          
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white flex items-center justify-center transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg">
              {config.icon}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {destinations.length} Curated Destinations
            </span>
          </div>

          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white pr-10">
            {config.title}
          </h2>
          <p className="text-sm text-white/90 mt-2 max-w-3xl leading-relaxed">
            {config.subtitle}
          </p>
        </div>

        {/* Scrollable Destination Grid */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Compass className="w-4 h-4 text-orange-600" />
              Recommended States & Union Territories
            </span>
            <span className="text-xs text-slate-700">
              Click any place to explore dossier or build pass
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {destinations.map((dest) => (
              <div 
                key={dest.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group justify-between"
              >
                {/* Destination Image & Badges */}
                <div className="relative h-44 overflow-hidden">
                  <img 
                    src={dest.image} 
                    alt={dest.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                      {dest.badge || dest.region.toUpperCase()}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] font-medium text-white/90 block">
                      {dest.capital} • {dest.duration}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-white leading-tight">
                      {dest.name}
                    </h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>

                  {/* Highlights */}
                  {dest.whereToVisit && dest.whereToVisit.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                        Top Attractions:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {dest.whereToVisit.slice(0, 2).map((place, idx) => (
                          <span 
                            key={idx}
                            className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium flex items-center gap-1"
                          >
                            <MapPin className="w-2.5 h-2.5 text-orange-600" />
                            {place.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-3">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenDossier(dest.id);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1"
                    >
                      <span>View Dossier</span>
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onPlanTrip(dest.id);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1"
                    >
                      <span>Plan Circuit</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            All destinations include 0% host surcharge, official state transport passes, and 24x7 SHE-teams safety corridors.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
          >
            Close Explorer
          </button>
        </div>

      </div>

    </div>
  );
};
