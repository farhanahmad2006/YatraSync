// Changes made by @MdFarhanAhmad
import React, { useState } from 'react';
import { X, Clock, AlertTriangle, Check } from 'lucide-react';

interface PartnerDelayModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentId: string;
  onReportDelay: (reason: string, delayMinutes: number, message: string) => void;
}

export const PartnerDelayModal: React.FC<PartnerDelayModalProps> = ({
  isOpen,
  onClose,
  assignmentId,
  onReportDelay
}) => {
  const [reason, setReason] = useState('Heavy Highway Traffic');
  const [delayMinutes, setDelayMinutes] = useState<number>(15);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const reasons = [
    'Heavy Highway Traffic',
    'Mountain Mist / Heavy Rain',
    'Road Construction / Reroute',
    'Vehicle Slowdown / Inspection',
    'Traveler Flight / Train Delayed',
    'Other Operational Cause'
  ];

  const durations = [10, 15, 25, 40, 60];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReportDelay(reason, delayMinutes, message.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 text-left">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-amber-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider">
                Operational Delay Broadcast
              </span>
              <h3 className="font-serif font-bold text-lg text-slate-950">
                Report Trip Delay
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-800 mb-1.5">Primary Delay Reason:</label>
            <div className="grid grid-cols-1 gap-1.5">
              {reasons.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setReason(r)}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                    reason === r
                      ? 'bg-amber-100/80 border-amber-400 text-amber-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{r}</span>
                  {reason === r && <Check className="w-4 h-4 text-amber-700" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1.5">Estimated Extra Time:</label>
            <div className="flex gap-2">
              {durations.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDelayMinutes(d)}
                  className={`flex-1 py-2 rounded-xl border font-bold text-center transition ${
                    delayMinutes === d
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  +{d}m
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Operational Message to Traveler & Hub (Optional):</label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Slow moving trucks on Neriamangalam ghat section. Driving cautiously."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-800 text-[11px]">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Traveler and YatraSync Operations center will be updated automatically with adjusted ETA.</span>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition shadow-sm"
            >
              Broadcast Delay (+{delayMinutes}m)
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
