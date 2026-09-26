// Changes made by @MdFarhanAhmad
import React, { useState } from 'react';
import { X, ShieldAlert, PhoneCall, AlertOctagon, CheckCircle } from 'lucide-react';

interface PartnerEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentId: string;
  onReportEmergency: (type: string, description: string) => void;
}

export const PartnerEmergencyModal: React.FC<PartnerEmergencyModalProps> = ({
  isOpen,
  onClose,
  assignmentId,
  onReportEmergency
}) => {
  const [emergencyType, setEmergencyType] = useState('Vehicle Breakdown / Flat Tire');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const emergencyTypes = [
    'Vehicle Breakdown / Flat Tire',
    'Engine / Battery Electrical Fault',
    'Minor Traffic Incident / Collision',
    'Road Blockage / Landslide',
    'Traveler Medical Urgent Assistance'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReportEmergency(emergencyType, description.trim());
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 text-left">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-red-200">
        
        {/* Header */}
        <div className="p-5 border-b border-red-200 flex items-center justify-between bg-red-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-red-700 tracking-wider">
                Emergency & Breakdown Protocol
              </span>
              <h3 className="font-serif font-bold text-lg text-slate-950">
                Immediate Incident Response
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

        {!submitted ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Safe Traveler Reminder */}
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-red-900 leading-relaxed">
              <AlertOctagon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-red-950 font-bold mb-0.5">Step 1: Traveler Safety First</strong>
                Ensure the vehicle is safely pulled over onto the shoulder with hazard lights activated. Guide travelers to a secure footpath or shaded turnout.
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1.5">Nature of Incident:</label>
              <div className="space-y-1.5">
                {emergencyTypes.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setEmergencyType(t)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                      emergencyType === t
                        ? 'bg-red-50 border-red-400 text-red-950 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{t}</span>
                    {emergencyType === t && <div className="w-2.5 h-2.5 rounded-full bg-red-600" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Details & Exact Milestone Location:</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Pulled over safely near Mile Marker 42, NH-85. Front right tire punctured. Jack ready."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* Emergency Direct Hotlines */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="tel:112"
                className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition text-center shadow-xs"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Police SOS (112)</span>
              </a>
              <a
                href="tel:18004257388"
                className="p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition text-center shadow-xs"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Ops Dispatch (24/7)</span>
              </a>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
              >
                Close
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition shadow-md"
              >
                Trigger Operations Backup
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-3xl mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-xl text-slate-950">Incident Dispatched to Ops Center</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                Emergency desk is actively tracking your vehicle via GPS. Nearby verified partner fleet & roadside assistance notified for immediate support.
              </p>
            </div>
            <div className="p-3.5 bg-slate-100 rounded-2xl text-xs text-slate-800 font-mono">
              Incident Ref: <strong>INC-EMERGENCY-{assignmentId}</strong>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition text-xs"
            >
              Return to Active Trip
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

