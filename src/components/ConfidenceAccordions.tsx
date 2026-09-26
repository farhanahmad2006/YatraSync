// Changes made by @MdFarhanAhmad
import React, { useState } from 'react';
import { ChevronDown, ShieldCheck, Lock, RefreshCw, QrCode, UserCheck } from 'lucide-react';

export const ConfidenceAccordions: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const accordions = [
    {
      icon: Lock,
      question: 'What is Strict Destination Data Isolation?',
      answer: 'YatraSync enforces isolated data boundaries for every state and UT. When you switch to a destination like Kerala, Himachal, or Telangana, only strictly verified local homestays, storyteller drivers, and regional monument entry passes for that specific state are retrieved. No cross-state data clutter.'
    },
    {
      icon: RefreshCw,
      question: 'What is the 100% Free Cancellation Policy?',
      answer: 'Unactivated YatraSync Multimodal Passes can be cancelled for a 100% full refund within 90 days of purchase. Once activated at your first monument turnstile or railway gate, pass validity remains active for the full duration specified.'
    },
    {
      icon: QrCode,
      question: 'How does Offline Turnstile QR Scanning work?',
      answer: 'When you toggle YatraSync into Offline Travel Mode, your encrypted QR pass and complete day-by-day itinerary are stored locally in your browser cache. You can scan your QR pass at monument turnstiles even in zero-cellular signal areas.'
    },
    {
      icon: UserCheck,
      question: 'Who are Certified Storyteller Chauffeurs?',
      answer: 'Every storyteller driver registered on YatraSync undergoes police background verification, local route safety checks, and regional folklore certification. They provide safe private transit while sharing rich local legends and hidden heritage spots.'
    },
    {
      icon: ShieldCheck,
      question: 'How does 0% Host Commission work?',
      answer: 'Unlike traditional booking platforms that extract 15–25% commissions from local homestay hosts, YatraSync operates on a 0% commission model. 100% of your stay payment goes directly to local families, preserving authentic heritage hospitality.'
    }
  ];

  const toggleAccordion = (idx: number) => {
    setOpenIdx(prev => (prev === idx ? null : idx));
  };

  return (
    <section id="confidence-accordions" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-left">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-700">
          Peace of Mind Guarantee
        </span>
        <h2 className="font-serif font-bold text-3xl sm:text-4xl text-slate-950">
          Book & Travel with Confidence
        </h2>
        <p className="text-sm text-slate-600">
          Everything you need to know about our data security, refunds, and verified local network.
        </p>
      </div>

      <div className="space-y-3 pt-4">
        {accordions.map((acc, idx) => {
          const isOpen = openIdx === idx;
          const IconComp = acc.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs transition-all duration-200"
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-950 hover:text-orange-600 transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 flex items-center justify-center shrink-0">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span>{acc.question}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-orange-600' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pl-16">
                  {acc.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};



