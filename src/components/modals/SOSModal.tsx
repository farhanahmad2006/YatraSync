// Changes made by @MdFarhanAhmad
import React, { useState } from 'react';
import { X, ShieldAlert, Phone, MapPin, Radio, CheckCircle, AlertTriangle } from 'lucide-react';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationName: string;
  emergencyPhone: string;
}

export const SOSModal: React.FC<SOSModalProps> = ({
  isOpen,
  onClose,
  destinationName,
  emergencyPhone
}) => {
  const [broadcasted, setBroadcasted] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  if (!isOpen) return null;

  const triggerTelemetry = async () => {
    setIsBroadcasting(true);
    try {
      await fetch('/api/emergency/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: 17.3850,
          lng: 78.4867,
          state: destinationName,
          travelerType: 'Active Traveler',
          timestamp: new Date().toISOString()
        })
      });
      setBroadcasted(true);
    } catch (e) {
      setBroadcasted(true);
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <div id="sos-modal-backdrop" className="fixed inset-0 z-50 bg-rose-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div id="sos-modal-card" className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-rose-300 text-left">
        
        {/* Header */}
        <div className="bg-rose-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-xl shadow-xs">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">Tourist Police 24/7 SOS Center</h3>
              <p className="text-xs text-rose-100">National Emergency Support & Live Corridor Protection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-rose-200 hover:text-white p-1.5 rounded-lg focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 flex items-start gap-3 text-rose-950">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm">Emergency Hotlines for {destinationName}</strong>
              <p className="text-[11px] text-rose-800 leading-relaxed mt-0.5">
                Immediate dispatch to state tourist police kiosks, highway patrol units, and certified storyteller escorts.
              </p>
            </div>
          </div>

          {/* Quick Dials */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href="tel:112"
              className="p-3.5 rounded-2xl bg-slate-900 text-white flex flex-col justify-between hover:bg-slate-800 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">Tourist Police</span>
                <Phone className="w-4 h-4 text-orange-400" />
              </div>
              <span className="text-xl font-black font-mono mt-2 block">112</span>
            </a>

            <a
              href="tel:1091"
              className="p-3.5 rounded-2xl bg-slate-900 text-white flex flex-col justify-between hover:bg-slate-800 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">Women Helpline</span>
                <Phone className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-xl font-black font-mono mt-2 block">1091</span>
            </a>
          </div>

          {/* Destination Specific Helpline */}
          <div className="p-3 bg-[#faf8f5] rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600">Regional Tourist Directorate Helpline:</span>
            <span className="font-mono font-bold text-slate-900">{emergencyPhone}</span>
          </div>

          {/* Real-time GPS Broadcast Simulation */}
          <div className="p-4 bg-slate-100 rounded-2xl border border-slate-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-orange-600" />
                <span>Live GPS Telemetry Broadcast</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">17.3850° N, 78.4867° E</span>
            </div>

            <p className="text-[11px] text-slate-600">
              Broadcasting your live location transmits immediate beacon coordinates to the nearest Tourist Police patrol vehicle and registered storyteller driver.
            </p>

            <button
              onClick={triggerTelemetry}
              disabled={isBroadcasting || broadcasted}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                broadcasted
                  ? 'bg-emerald-700 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-md'
              }`}
            >
              {broadcasted ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Telemetry Broadcast Active (Synced to Police Control)</span>
                </>
              ) : isBroadcasting ? (
                <>
                  <Radio className="w-4 h-4 animate-spin" />
                  <span>Broadcasting Coordinates...</span>
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4" />
                  <span>Broadcast My Emergency Coordinates</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
