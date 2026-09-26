// Changes made by @MdFarhanAhmad
import React from 'react';
import { Car, BookOpen, ShieldCheck, Star } from 'lucide-react';
import { DriverOption, LocalTransitOption } from '../../types';

interface Step3DriverProps {
  drivers: DriverOption[];
  selectedDriver: DriverOption | null;
  onSelectDriver: (driver: DriverOption) => void;
  localTransit: LocalTransitOption[];
}

export const Step3Driver: React.FC<Step3DriverProps> = ({
  drivers,
  selectedDriver,
  onSelectDriver,
  localTransit
}) => {
  return (
    <div id="content-driver" className="space-y-6 text-left">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle-card space-y-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-orange-600" />
              <BookOpen className="w-3.5 h-3.5 text-orange-600" />
              <span>YatraSync Differentiator: Driver-as-Storyteller</span>
            </span>
            <h3 className="font-serif font-bold text-xl text-slate-950 mt-1">
              Meet your destination chauffeur & certified local storyteller guide
            </h3>
            <p className="text-xs text-slate-600 max-w-2xl">
              Your ride is also your local guide. Certified by state tourism boards, your chauffeur provides regional heritage lore, safe navigation, and authentic food recommendations.
            </p>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Background Checked & Storyteller Certified</span>
          </span>
        </div>
      </div>

      {/* Driver Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((driver) => {
          const isSelected = selectedDriver?.id === driver.id;
          return (
            <div
              key={driver.id}
              className={`bg-white rounded-2xl border p-5 flex flex-col justify-between shadow-subtle-card transition space-y-4 text-left ${isSelected ? 'border-slate-900 ring-2 ring-slate-900' : 'border-slate-200'}`}
            >
              <div className="space-y-3 text-xs">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-sm">
                      {driver.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-950 leading-snug">{driver.name}</h4>
                      <span className="text-[11px] text-orange-700 font-semibold block">{driver.role}</span>
                    </div>
                  </div>
                  <div className="bg-slate-100 text-slate-900 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{driver.rating}</span>
                    <span className="text-[10px] text-slate-400">({driver.reviews})</span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#faf8f5] rounded-xl border border-slate-200 space-y-1">
                  <div className="font-semibold text-slate-900">
                    <Car className="w-3.5 h-3.5 inline mr-1 text-slate-500" />
                    <span>{driver.vehicle} ({driver.vehicleType})</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    <strong>Languages:</strong> {driver.languages.join(', ')}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-800 block mb-1">Storyteller Lore & Regional Expertise:</span>
                  <p className="text-slate-600 leading-relaxed text-[11px] italic">"{driver.storytellerBio}"</p>
                  <div className="mt-2 space-y-1 text-[11px] text-slate-500">
                    {driver.stories.map((s, idx) => (
                      <div key={idx}>• <em>{s}</em></div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                  {driver.safetyFeatures.map((sf, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {sf}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Entire Trip Tariff</span>
                  <div className="font-serif font-bold text-lg text-slate-950">
                    ₹{driver.fixedFullTripPrice.toLocaleString('en-IN')}
                  </div>
                </div>
                <button
                  onClick={() => onSelectDriver(driver)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition ${isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-900 hover:bg-orange-700 text-white'}`}
                >
                  {isSelected ? '✓ Assigned Driver' : 'Choose Driver'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Local Hop-by-Hop Mobility Details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle-card space-y-4 text-left">
        <h4 className="font-serif font-bold text-base text-slate-950">
          On-Ground Destination Mobility & Shuttles
        </h4>
        <div className="space-y-3">
          {localTransit.map((t, idx) => (
            <div key={idx} className="p-3 bg-[#faf8f5] rounded-xl border border-slate-200 flex items-start justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{t.mode}</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded font-semibold border border-slate-200">
                    {t.safetyBadge}
                  </span>
                </div>
                <p className="text-slate-600">{t.route}</p>
                <span className="text-[11px] text-slate-500 italic">{t.tip}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-bold text-slate-900">{t.fare}</span>
                <span className="block text-[10px] text-slate-500">{t.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

