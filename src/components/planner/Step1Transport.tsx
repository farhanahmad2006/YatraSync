// Changes made by @MdFarhanAhmad
import React from 'react';
import { Plane, Train, Bus, Car, Gauge, CheckCircle } from 'lucide-react';
import { TransportOption } from '../../types';

interface Step1TransportProps {
  transports: TransportOption[];
  selectedTransport: TransportOption | null;
  onSelectTransport: (transport: TransportOption) => void;
  origin: string;
  destinationName: string;
}

export const Step1Transport: React.FC<Step1TransportProps> = ({
  transports,
  selectedTransport,
  onSelectTransport,
  origin,
  destinationName
}) => {
  const getIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'flight': return <Plane className="w-4 h-4 text-slate-700" />;
      case 'train': return <Train className="w-4 h-4 text-slate-700" />;
      case 'bus': return <Bus className="w-4 h-4 text-slate-700" />;
      default: return <Car className="w-4 h-4 text-slate-700" />;
    }
  };

  return (
    <div id="content-transport" className="space-y-6 text-left">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-subtle-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <span className="font-bold text-sm text-slate-900 block">
            {origin} → {destinationName} Route Options
          </span>
          <p className="text-slate-600">
            Calculates true delay probabilities based on seasonal fog, mountain curves, and historical punctuality.
          </p>
        </div>
        <div className="px-3 py-1.5 bg-[#faf8f5] rounded-xl border border-slate-200 font-semibold text-slate-700 shrink-0 flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Synced: IRCTC • Amadeus • RedBus</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {transports.map((item) => {
          const isSelected = selectedTransport?.id === item.id;
          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border p-4 flex flex-col justify-between shadow-subtle-card transition text-left ${isSelected ? 'border-slate-900 ring-2 ring-slate-900' : 'border-slate-200'}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    {getIcon(item.mode)}
                    <span>{item.mode}</span>
                  </span>
                  {item.recommended && (
                    <span className="text-[10px] bg-orange-100 text-orange-900 font-bold px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-sm text-slate-900 leading-snug">{item.title}</h4>
                <p className="text-[11px] text-slate-500">{item.operator}</p>
                
                <div className="mt-3 p-2 bg-[#faf8f5] rounded-xl border border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="font-bold flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-orange-600" />
                    <span>{item.reliabilityScore}% Reliability</span>
                  </span>
                  <span className="text-slate-600">{item.reliabilityBadge}</span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Departure</span>
                    <div className="font-bold text-slate-900">{item.departure}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Duration</span>
                    <div className="font-bold text-slate-900">{item.duration}</div>
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-slate-500">
                  Carbon footprint: <span className="font-semibold text-emerald-800">{item.carbon}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Fare (Per Guest)</span>
                  <div className="font-serif font-bold text-lg text-slate-950">
                    ₹{item.price.toLocaleString('en-IN')}
                  </div>
                </div>
                <button
                  onClick={() => onSelectTransport(item)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition ${isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-900 hover:bg-orange-700 text-white'}`}
                >
                  {isSelected ? '✓ Selected' : 'Select'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

