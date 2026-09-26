// Changes made by @MdFarhanAhmad
import React from 'react';
import { RefreshCw, ShieldCheck, Sparkles, QrCode, Clock } from 'lucide-react';

export const PillarsSection: React.FC = () => {
  const pillars = [
    {
      id: 'free-cancellation',
      icon: RefreshCw,
      iconBg: 'bg-orange-100 text-orange-700',
      title: 'Free Cancellation',
      desc: '100% full refund within 90 days of purchase on unactivated passes.',
    },
    {
      id: 'guaranteed-savings',
      icon: Sparkles,
      iconBg: 'bg-amber-100 text-amber-800',
      title: 'Guaranteed Savings',
      desc: 'Save up to 45% vs individual counter tickets or we refund the difference.',
    },
    {
      id: 'contactless-entry',
      icon: QrCode,
      iconBg: 'bg-emerald-100 text-emerald-800',
      title: 'Contactless Turnstile Scanning',
      desc: 'Scan offline QR passes directly at monument turnstiles & railway gates.',
    },
    {
      id: 'host-transparency',
      icon: ShieldCheck,
      iconBg: 'bg-slate-900 text-white',
      title: '0% Host Commission',
      desc: 'Direct payout to authentic local homestays & verified storyteller drivers.',
    },
    {
      id: 'year-validity',
      icon: Clock,
      iconBg: 'bg-orange-100 text-orange-700',
      title: '1-Year Pass Validity',
      desc: 'Flexible travel timing — your pass activates only upon your first gate scan.',
    },
  ];

  return (
    <section id="yatrasync-pillars" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {pillars.map((pillar) => {
          const IconComponent = pillar.icon;
          return (
            <div
              key={pillar.id}
              id={`pillar-${pillar.id}`}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-orange-400 hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left h-full"
            >
              <div>
                <div className={`w-11 h-11 rounded-xl ${pillar.iconBg} flex items-center justify-center mb-3 shadow-xs`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-950 mb-1 leading-snug">{pillar.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};



