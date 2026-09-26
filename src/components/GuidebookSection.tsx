// Changes made by @MdFarhanAhmad
import React, { useState } from 'react';
import { BookOpen, CheckCircle, Mail, Send } from 'lucide-react';

export const GuidebookSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
      }, 4000);
    }
  };

  return (
    <section id="guidebook-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>

          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-white">
            Download Free Official India Travel Guidebook 2026
          </h2>

          <p className="text-sm sm:text-base text-orange-100 leading-relaxed max-w-2xl">
            Get comprehensive 5-day itineraries for all 28 States & 8 UTs, turnstile gate entry tips, local dish recommendations, and storyteller driver contacts sent straight to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="pt-2 flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 absolute left-4 top-4 text-orange-700" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full bg-white text-slate-900 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-bold focus:outline-none shadow-md placeholder:text-slate-400 placeholder:font-medium"
              />
            </div>
            <button
              type="submit"
              className="bg-slate-950 hover:bg-slate-900 text-white px-7 py-3.5 rounded-2xl font-extrabold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 shrink-0"
            >
              <span>{submitted ? 'Guidebook Sent!' : 'Get Free Guidebook'}</span>
              {submitted ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Send className="w-4 h-4 text-orange-400" />}
            </button>
          </form>

          {submitted && (
            <p className="text-xs font-bold text-amber-200 flex items-center gap-1.5 pt-1">
              <CheckCircle className="w-4 h-4 text-emerald-300" />
              Success! Check your inbox for the PDF download link.
            </p>
          )}

        </div>
      </div>
    </section>
  );
};



