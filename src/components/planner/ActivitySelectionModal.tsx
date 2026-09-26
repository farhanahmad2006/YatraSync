// Changes made by @MdFarhanAhmad
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Sparkles, 
  Clock, 
  MapPin, 
  Check, 
  Plus, 
  ShieldCheck, 
  Filter, 
  Sun, 
  Sunset, 
  Moon, 
  Compass, 
  Info,
  IndianRupee
} from 'lucide-react';
import { DestinationActivityItem } from '../../types';

interface ActivitySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  destinationKey: string;
  destinationName: string;
  userPreferences?: string[];
  currentDayActivities: DestinationActivityItem[];
  onAddActivity: (dayNumber: number, activity: DestinationActivityItem) => void;
  preloadedActivities?: DestinationActivityItem[];
}

const CATEGORIES = [
  'All',
  'Culture',
  'Heritage',
  'Nature',
  'Adventure',
  'Food',
  'Relaxation',
  'Wildlife',
  'Spiritual',
  'Shopping',
  'Beach'
];

export const ActivitySelectionModal: React.FC<ActivitySelectionModalProps> = ({
  isOpen,
  onClose,
  dayNumber,
  destinationKey,
  destinationName,
  userPreferences = [],
  currentDayActivities = [],
  onAddActivity,
  preloadedActivities = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activities, setActivities] = useState<DestinationActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  // Initialize or fetch activities when modal opens or destination changes
  useEffect(() => {
    if (!isOpen) return;

    // Track currently assigned activities on this day
    const existing = new Set<string>(currentDayActivities.map(a => a.id));
    setAddedIds(existing);
    setSearchQuery('');
    setSelectedCategory('All');

    // Fetch live activities from PostgreSQL backend
    setIsLoading(true);
    const cleanKey = destinationKey.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    
    fetch(`/api/v1/custom-journeys/activities?destination_key=${encodeURIComponent(cleanKey)}&limit=50`)
      .then(res => (res.ok ? res.json() : []))
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted: DestinationActivityItem[] = data.map(item => ({
            id: item.id || `act-${Math.random().toString(36).substr(2, 9)}`,
            destinationKey: item.destinationKey || cleanKey,
            name: item.name,
            category: item.category || 'Culture',
            cost: item.approxCostInr ?? item.cost ?? 0,
            approxCostInr: item.approxCostInr ?? item.cost ?? 0,
            duration: item.duration || `${item.durationHours || 2.0} hrs`,
            durationHours: item.durationHours || 2.0,
            timeOfDay: item.timeOfDay || 'Morning',
            locationName: item.locationName || destinationName,
            description: item.description || `Verified attraction in ${destinationName}`,
            isVerified: item.isVerified ?? true
          }));
          setActivities(formatted);
        } else if (preloadedActivities && preloadedActivities.length > 0) {
          setActivities(preloadedActivities);
        } else {
          setActivities([]);
        }
      })
      .catch(err => {
        console.error('Error loading destination activities:', err);
        if (preloadedActivities && preloadedActivities.length > 0) {
          setActivities(preloadedActivities);
        }
      })
      .finally(() => setIsLoading(false));
  }, [isOpen, destinationKey, destinationName]);

  if (!isOpen) return null;

  // Filter activities based on search query and category
  const filteredActivities = activities.filter(act => {
    const matchesCategory =
      selectedCategory === 'All' ||
      act.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !searchQuery.trim() ||
      act.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.locationName?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleAdd = (act: DestinationActivityItem) => {
    onAddActivity(dayNumber, act);
    setAddedIds(prev => new Set(prev).add(act.id));
  };

  const getTimeIcon = (timeOfDay?: string) => {
    const tod = (timeOfDay || '').toLowerCase();
    if (tod.includes('sunset')) return <Sunset className="w-3.5 h-3.5 text-amber-500" />;
    if (tod.includes('evening') || tod.includes('night')) return <Moon className="w-3.5 h-3.5 text-indigo-400" />;
    return <Sun className="w-3.5 h-3.5 text-orange-500" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] text-left">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950 text-white flex items-start justify-between relative">
          <div className="space-y-1.5 pr-8">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-orange-500 text-white font-black text-[11px] uppercase tracking-wider">
                Day {dayNumber}
              </span>
              <span className="text-xs font-bold text-orange-300">
                {destinationName} Activity Catalog
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              Add Places & Activities
            </h3>
            <p className="text-xs text-slate-300">
              Browse verified attractions, culinary walks, and experiences in {destinationName}.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/80 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder={`Search attractions, heritage trails, food, or nature in ${destinationName}...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-600 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Activities List Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1 bg-[#faf8f5]/60">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-bold text-slate-500">
                Loading verified activities for {destinationName} from database...
              </p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="py-12 text-center space-y-3 bg-white rounded-2xl border border-slate-200 p-8">
              <Compass className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">No activities found matching your criteria</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try clearing the search query or switching to 'All' categories to view all available experiences.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredActivities.map(act => {
                const isAdded = addedIds.has(act.id);
                const isPreferenceMatch = userPreferences.some(
                  p => p.toLowerCase() === act.category.toLowerCase()
                );

                return (
                  <div
                    key={act.id}
                    className={`p-4 rounded-2xl border transition flex flex-col justify-between gap-3 text-left ${
                      isAdded
                        ? 'bg-emerald-50/70 border-emerald-300 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-orange-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="space-y-2">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-800 text-[10px] font-extrabold uppercase tracking-wide">
                            {act.category}
                          </span>
                          {isPreferenceMatch && (
                            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              Matches Style
                            </span>
                          )}
                        </div>

                        {act.isVerified && (
                          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Verified
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h4 className="font-serif font-bold text-sm text-slate-950 leading-snug">
                        {act.name}
                      </h4>
                      {act.description && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {act.description}
                        </p>
                      )}

                      {/* Meta: Duration, Timing & Location */}
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 flex-wrap">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {act.duration || `${act.durationHours || 2} hrs`}
                        </span>
                        {act.timeOfDay && (
                          <span className="flex items-center gap-1 font-medium">
                            {getTimeIcon(act.timeOfDay)}
                            {act.timeOfDay}
                          </span>
                        )}
                        {act.locationName && (
                          <span className="flex items-center gap-1 font-medium text-slate-600">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {act.locationName}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Cost & Action Button */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-sm font-black text-slate-900 font-mono">
                          {act.cost > 0 ? `₹${act.cost.toLocaleString('en-IN')}` : 'Free / Included'}
                        </span>
                        <span className="text-[10px] text-slate-400 block">per person</span>
                      </div>

                      <button
                        onClick={() => handleAdd(act)}
                        disabled={isAdded}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                          isAdded
                            ? 'bg-emerald-600 text-white cursor-default'
                            : 'bg-slate-900 hover:bg-orange-600 text-white shadow-xs'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added to Day {dayNumber}</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Add to Day {dayNumber}</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex items-center justify-between">
          <div className="text-xs text-slate-500">
            <span className="font-bold text-slate-800">{filteredActivities.length}</span> activities available for {destinationName}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
