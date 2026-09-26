// Changes made by @MdFarhanAhmad
import React from 'react';
import { Clock, CloudRain, RotateCcw, AlertTriangle, ArrowRight, MessageSquare, CheckCircle } from 'lucide-react';
import { TimelineDayGroup } from '../../types';

interface Step4ItineraryProps {
  timeline: TimelineDayGroup[];
  durationDays: 5 | 7;
  onChangeDuration: (days: 5 | 7) => void;
  tripId: string;
  onTriggerDisruption: (type: 'transit_delay' | 'weather_alert') => void;
  activeDisruption: {
    type: 'transit_delay' | 'weather_alert';
    title: string;
    description: string;
  } | null;
  onResetDisruption: () => void;
  onPreviewWhatsApp: () => void;
  onApplyReplan: () => void;
  onProceedToReview: () => void;
}

export const Step4Itinerary: React.FC<Step4ItineraryProps> = ({
  timeline,
  durationDays,
  onChangeDuration,
  tripId,
  onTriggerDisruption,
  activeDisruption,
  onResetDisruption,
  onPreviewWhatsApp,
  onApplyReplan,
  onProceedToReview
}) => {
  return (
    <div id="content-itinerary" className="space-y-6 text-left">
      
      {/* Duration Toggle (5 Days vs 7 Days) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-subtle-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-sm text-slate-950 block">Select Itinerary Duration Depth</span>
          <p className="text-slate-600">Switch between standard 5-day and deep-immersion 7-day complete route plans.</p>
        </div>
        <div className="inline-flex p-1 bg-slate-100 rounded-xl font-bold">
          <button
            onClick={() => onChangeDuration(5)}
            className={`px-4 py-2 rounded-lg text-xs transition ${durationDays === 5 ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:text-slate-950'}`}
          >
            5-Day Complete Plan
          </button>
          <button
            onClick={() => onChangeDuration(7)}
            className={`px-4 py-2 rounded-lg text-xs transition ${durationDays === 7 ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:text-slate-950'}`}
          >
            7-Day Complete Plan
          </button>
        </div>
      </div>

      {/* Live Disruption Simulator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-orange-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span>Autonomous Replan Engine (Live Simulation)</span>
            </span>
            <h3 className="font-serif font-bold text-lg text-slate-950">
              Experience real-world travel disruption resilience
            </h3>
            <p className="text-xs text-slate-600 max-w-xl">
              Simulate a real-world delay below. YatraSync recalculates connections, informs your homestay host and storyteller driver, and generates an instant WhatsApp notification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onTriggerDisruption('transit_delay')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Simulate 3h Transit Delay</span>
            </button>
            <button
              onClick={() => onTriggerDisruption('weather_alert')}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
            >
              <CloudRain className="w-3.5 h-3.5 text-orange-600" />
              <span>Simulate Weather Reroute</span>
            </button>
            <button
              onClick={onResetDisruption}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Active Disruption Alert */}
        {activeDisruption && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-start gap-3 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sm">{activeDisruption.title}</span>
                <span className="text-slate-600 leading-relaxed">{activeDisruption.description}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 text-xs">
              <button
                onClick={onPreviewWhatsApp}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white font-bold flex items-center gap-1.5 shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>View WhatsApp Alert</span>
              </button>
              <button
                onClick={onApplyReplan}
                className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-50 flex items-center gap-1"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Apply Replan</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Day-by-Day Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle-card space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-serif font-bold text-lg text-slate-950">
              Day-by-Day Unified Itinerary Timeline ({durationDays} Days)
            </h3>
            <p className="text-xs text-slate-500">Every day includes morning, afternoon, and evening curated exploration.</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
            {tripId}
          </span>
        </div>

        <div className="space-y-6">
          {timeline.map((dayGroup, gIdx) => (
            <div key={gIdx} className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span>
                <span className="text-sm">{dayGroup.day} ({dayGroup.date})</span>
              </div>
              <div className="pt-1 space-y-2">
                {dayGroup.events.map((ev, eIdx) => (
                  <div key={eIdx} className="relative pl-6 pb-2 border-l-2 border-slate-200 last:border-l-0">
                    <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-slate-900 ring-4 ring-white"></span>
                    <div className="bg-[#faf8f5] p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{ev.time} • {ev.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ev.status.includes('✓') ? 'bg-emerald-100 text-emerald-800' : 'bg-white border border-slate-200 text-slate-700'}`}>
                          {ev.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{ev.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onProceedToReview}
            className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-orange-700 transition flex items-center gap-2"
          >
            <span>Proceed to Trip Review</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
