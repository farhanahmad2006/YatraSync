// Changes made by @MdFarhanAhmad
import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  AlertTriangle, 
  Sparkles, 
  Hotel, 
  Compass, 
  Sun, 
  Sunset, 
  Moon, 
  Layers, 
  ArrowRightLeft,
  ChevronRight,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { CustomItineraryDay, DestinationActivityItem } from '../../types';
import { ActivitySelectionModal } from './ActivitySelectionModal';

interface DayWiseItineraryBuilderProps {
  days: CustomItineraryDay[];
  userPreferences?: string[];
  onUpdateDays?: (updatedDays: CustomItineraryDay[]) => void;
  onAddActivityToDay: (dayNumber: number, activity: DestinationActivityItem) => void;
  onRemoveActivityFromDay: (dayNumber: number, activityIndex: number) => void;
  onReorderActivityInDay: (dayNumber: number, fromIndex: number, toIndex: number) => void;
  onMoveActivityToDay: (fromDayNumber: number, toDayNumber: number, activityIndex: number) => void;
}

export const DayWiseItineraryBuilder: React.FC<DayWiseItineraryBuilderProps> = ({
  days,
  userPreferences = [],
  onAddActivityToDay,
  onRemoveActivityFromDay,
  onReorderActivityInDay,
  onMoveActivityToDay
}) => {
  // Modal state for adding activity to a specific day
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    dayNumber: number;
    destinationKey: string;
    destinationName: string;
    currentActivities: DestinationActivityItem[];
  }>({
    isOpen: false,
    dayNumber: 1,
    destinationKey: '',
    destinationName: '',
    currentActivities: []
  });

  const handleOpenAddModal = (day: CustomItineraryDay) => {
    // Map current day activities to DestinationActivityItem
    const currentActs: DestinationActivityItem[] = (day.activities || []).map((a, idx) => ({
      id: a.id || `act-day-${day.dayNumber}-${idx}`,
      name: a.name,
      category: a.category || a.type || 'Culture',
      cost: a.cost || a.approxCostInr || 0,
      approxCostInr: a.cost || a.approxCostInr || 0,
      duration: a.duration || `${a.durationHours || 2.0} hrs`,
      durationHours: a.durationHours || 2.0,
      timeOfDay: a.timeOfDay || a.time || 'Morning',
      locationName: a.locationName || day.destinationName,
      description: a.description
    }));

    setModalState({
      isOpen: true,
      dayNumber: day.dayNumber,
      destinationKey: day.destinationKey || day.destinationName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      destinationName: day.destinationName,
      currentActivities: currentActs
    });
  };

  const handleCloseModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  // Calculate duration in hours for a day
  const calculateDayDuration = (day: CustomItineraryDay): number => {
    return (day.activities || []).reduce((total, act) => {
      if (act.durationHours) return total + act.durationHours;
      if (act.duration) {
        const match = act.duration.match(/([0-9.]+)/);
        if (match) return total + parseFloat(match[1]);
      }
      return total + 2.0; // default 2 hours per activity
    }, 0);
  };

  const getTimeIcon = (timeOfDay?: string) => {
    const tod = (timeOfDay || '').toLowerCase();
    if (tod.includes('sunset')) return <Sunset className="w-3.5 h-3.5 text-amber-500" />;
    if (tod.includes('evening') || tod.includes('night')) return <Moon className="w-3.5 h-3.5 text-indigo-400" />;
    return <Sun className="w-3.5 h-3.5 text-orange-500" />;
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <h4 className="font-serif font-bold text-lg text-slate-950 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <span>Universal Day-by-Day Journey Builder</span>
          </h4>
          <p className="text-xs text-slate-500">
            Customize activities, reorder experiences, adjust daytime schedules, or transfer places between days.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200">
          <span>{days.length} Total Days</span>
          <span>•</span>
          <span className="text-orange-700">
            {days.reduce((sum, d) => sum + (d.activities?.length || 0), 0)} Total Activities
          </span>
        </div>
      </div>

      {/* Days List */}
      <div className="space-y-5">
        {days.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
            <Calendar className="w-8 h-8 text-orange-400 mx-auto" />
            <h5 className="font-serif font-bold text-sm text-slate-900">Your Day-by-Day Itinerary</h5>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add one or more destinations above to generate a day-wise timeline and start scheduling curated activities.
            </p>
          </div>
        ) : (
          days.map((day) => {
          const totalHours = calculateDayDuration(day);
          const isOverloaded = totalHours > 8.0;

          return (
            <div
              key={day.dayNumber}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle-card overflow-hidden transition hover:border-orange-200"
            >
              {/* Day Card Header */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-orange-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                    D{day.dayNumber}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-extrabold text-orange-300 uppercase tracking-wider">
                        {day.destinationName}
                      </span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-xs text-slate-300 font-medium">{day.date}</span>
                    </div>
                    <h4 className="font-serif font-bold text-base sm:text-lg text-white">
                      {day.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => handleOpenAddModal(day)}
                    className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Activity</span>
                  </button>
                </div>
              </div>

              {/* Day Body Content */}
              <div className="p-4 sm:p-5 space-y-4">
                
                {/* Daytime Budget / Schedule Density Warning */}
                <div className="flex items-center justify-between text-xs py-1 px-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Planned Activity Time:</span>
                    <strong className="text-slate-900 font-bold">{totalHours.toFixed(1)} hrs</strong>
                  </span>

                  {isOverloaded ? (
                    <span className="text-amber-700 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-md font-bold text-[11px] flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      Packed Day (&gt;8h)
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Relaxed Pace
                    </span>
                  )}
                </div>

                {isOverloaded && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="leading-snug">
                      <strong>High activity density:</strong> You have planned ~{totalHours.toFixed(1)} hours of activities on Day {day.dayNumber}. Consider moving some activities to other days for a more leisurely pace.
                    </p>
                  </div>
                )}

                {/* Activities List */}
                <div className="space-y-2.5">
                  {(!day.activities || day.activities.length === 0) ? (
                    <div className="py-8 text-center space-y-2 bg-[#faf8f5] rounded-2xl border border-dashed border-slate-300 p-6">
                      <Compass className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs font-bold text-slate-600">No custom activities added yet for Day {day.dayNumber}</p>
                      <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                        Explore local heritage, nature trails, or dining experiences in {day.destinationName}.
                      </p>
                      <button
                        onClick={() => handleOpenAddModal(day)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-orange-600 transition cursor-pointer"
                      >
                        Browse {day.destinationName} Activities
                      </button>
                    </div>
                  ) : (
                    day.activities.map((act, aIdx) => {
                      const costVal = act.cost || act.approxCostInr || 0;
                      const durationStr = act.duration || (act.durationHours ? `${act.durationHours} hrs` : '2.0 hrs');

                      return (
                        <div
                          key={act.id || `day-${day.dayNumber}-act-${aIdx}`}
                          className="p-3.5 rounded-2xl bg-[#faf8f5] border border-slate-200 hover:border-orange-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                        >
                          {/* Activity Details */}
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="w-5 h-5 rounded-md bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                                {aIdx + 1}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 text-[10px] font-extrabold uppercase">
                                {act.category || act.type || 'Culture'}
                              </span>
                              {act.timeOfDay && (
                                <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                                  {getTimeIcon(act.timeOfDay)}
                                  {act.timeOfDay}
                                </span>
                              )}
                              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {durationStr}
                              </span>
                            </div>

                            <h5 className="font-serif font-bold text-sm text-slate-950 truncate">
                              {act.name}
                            </h5>

                            {act.description && (
                              <p className="text-xs text-slate-500 line-clamp-1">
                                {act.description}
                              </p>
                            )}

                            {act.locationName && (
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <MapPin className="w-2.5 h-2.5" />
                                {act.locationName}
                              </span>
                            )}
                          </div>

                          {/* Cost & Controls Toolbar */}
                          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/80 shrink-0">
                            {/* Cost Pill */}
                            <div className="text-right">
                              <span className="font-mono font-bold text-xs text-slate-900 block">
                                {costVal > 0 ? `₹${costVal.toLocaleString('en-IN')}` : 'Free / Incl.'}
                              </span>
                              <span className="text-[9px] text-slate-400 block">per person</span>
                            </div>

                            {/* Reorder Buttons */}
                            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                              <button
                                onClick={() => onReorderActivityInDay(day.dayNumber, aIdx, aIdx - 1)}
                                disabled={aIdx === 0}
                                title="Move Activity Up"
                                className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onReorderActivityInDay(day.dayNumber, aIdx, aIdx + 1)}
                                disabled={aIdx === (day.activities?.length || 1) - 1}
                                title="Move Activity Down"
                                className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Move to another Day selector */}
                            {days.length > 1 && (
                              <div className="relative group/move">
                                <select
                                  onChange={(e) => {
                                    const targetDay = parseInt(e.target.value, 10);
                                    if (targetDay && targetDay !== day.dayNumber) {
                                      onMoveActivityToDay(day.dayNumber, targetDay, aIdx);
                                    }
                                  }}
                                  value=""
                                  title="Transfer activity to another day"
                                  className="text-[11px] font-bold bg-white text-slate-700 border border-slate-200 rounded-xl px-2 py-1 hover:border-orange-500 focus:outline-none cursor-pointer"
                                >
                                  <option value="" disabled>Move to...</option>
                                  {days.map(d => (
                                    <option 
                                      key={d.dayNumber} 
                                      value={d.dayNumber}
                                      disabled={d.dayNumber === day.dayNumber}
                                    >
                                      Day {d.dayNumber} ({d.destinationName})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {/* Delete Activity */}
                            <button
                              onClick={() => onRemoveActivityFromDay(day.dayNumber, aIdx)}
                              title="Remove Activity"
                              className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-100/70 transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>

                {/* Overnight Stay Info Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Hotel className="w-3.5 h-3.5 text-slate-400" />
                    <span>Overnight:</span>
                    <strong className="text-slate-800">{day.overnightStay || `${day.destinationName} Homestay / Resort`}</strong>
                  </span>
                  {day.hotelCost && (
                    <span className="font-mono font-bold text-slate-700">
                      ~₹{day.hotelCost.toLocaleString('en-IN')}/night
                    </span>
                  )}
                </div>

              </div>

            </div>
          );
        }))}
      </div>

      {/* Activity Selection Modal */}
      <ActivitySelectionModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        dayNumber={modalState.dayNumber}
        destinationKey={modalState.destinationKey}
        destinationName={modalState.destinationName}
        userPreferences={userPreferences}
        currentDayActivities={modalState.currentActivities}
        onAddActivity={(dayNum, act) => {
          onAddActivityToDay(dayNum, act);
        }}
      />
    </div>
  );
};
