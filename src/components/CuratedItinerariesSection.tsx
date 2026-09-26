// Changes made by @MdFarhanAhmad
import React from 'react';
import { Calendar, MapPin, Sparkles, ArrowRight, ShieldCheck, Star } from 'lucide-react';

export interface PackageItem {
  id: string;
  title: string;
  destinationKey: string;
  city: string;
  state: string;
  days: number;
  image: string;
  priceINR: number;
  originalPriceINR: number;
  savingsINR: number;
  badge: string;
  rating: string;
  highlights: string[];
}

interface CuratedItinerariesSectionProps {
  onSelectPackage: (pkg: PackageItem) => void;
}

export const CuratedItinerariesSection: React.FC<CuratedItinerariesSectionProps> = ({
  onSelectPackage
}) => {
  const packages: PackageItem[] = [
    {
      id: 'kerala-backwaters-5d',
      title: 'Kerala Backwaters & Heritage Homestay Experience',
      destinationKey: 'kerala',
      city: 'Kumarakom & Kochi',
      state: 'Kerala',
      days: 5,
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
      priceINR: 16700,
      originalPriceINR: 24500,
      savingsINR: 7800,
      badge: 'Best Coastal Package',
      rating: '4.95 (1,240 reviews)',
      highlights: [
        'Vande Bharat Express (Train 20631)',
        'Kumarakom Vembanad Heritage Homestay',
        'Certified Storyteller Chauffeur Suresh'
      ]
    },
    {
      id: 'telangana-kakatiya-5d',
      title: 'Royal Nizam & UNESCO Kakatiya Heritage Circuit',
      destinationKey: 'telangana',
      city: 'Hyderabad & Warangal',
      state: 'Telangana',
      days: 5,
      image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?w=800&auto=format&fit=crop&q=80',
      priceINR: 14200,
      originalPriceINR: 21000,
      savingsINR: 6800,
      badge: 'UNESCO Heritage Circuit',
      rating: '4.90 (890 reviews)',
      highlights: [
        'Golconda Sound & Light VIP Entry',
        'Traditional Chowmahalla Durbar Access',
        'Storyteller Chauffeur Narasimha'
      ]
    },
    {
      id: 'himachal-mountain-5d',
      title: 'Himalayan Alpine Valleys & Solang Pass',
      destinationKey: 'himachal',
      city: 'Shimla & Manali',
      state: 'Himachal Pradesh',
      days: 5,
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80',
      priceINR: 18500,
      originalPriceINR: 27000,
      savingsINR: 8500,
      badge: 'Top Mountain Experience',
      rating: '4.92 (1,450 reviews)',
      highlights: [
        'Atal Tunnel Scenic Mountain Corridor',
        'Traditional Deodar Forest Homestay',
        'Storyteller Chauffeur Jagdish'
      ]
    }
  ];

  return (
    <section id="curated-itineraries-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-600"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-700">
              Handcrafted Multimodal Journeys
            </span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-slate-950">
            Curated All-Inclusive Circuits
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            Pre-configured 5-day multimodal passes uniting express train seats, verified homestays, storyteller drivers, and turnstile monument admissions.
          </p>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <div
            key={pkg.id}
            className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-subtle-card hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Cover Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  {pkg.badge}
                </div>
                <div className="absolute bottom-3 left-3 bg-white/95 text-slate-900 text-xs font-bold px-2.5 py-1 rounded-xl shadow-xs flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-orange-600" />
                  <span>{pkg.days} Days / {pkg.days - 1} Nights</span>
                </div>
              </div>

              {/* Package Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-orange-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {pkg.city}, {pkg.state}
                  </span>
                  <span className="font-semibold text-slate-600 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {pkg.rating.split(' ')[0]}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-xl text-slate-950 leading-snug group-hover:text-orange-600 transition-colors">
                  {pkg.title}
                </h3>

                {/* Highlights List */}
                <div className="space-y-1.5 pt-1 border-t border-slate-100">
                  {pkg.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing Line */}
                <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400 line-through">₹{pkg.originalPriceINR.toLocaleString('en-IN')}</span>
                    <span className="text-2xl font-black text-slate-950 ml-2">₹{pkg.priceINR.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-slate-500 block">per traveler • all inclusive</span>
                  </div>
                  <span className="text-xs font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-lg">
                    Save ₹{pkg.savingsINR.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="p-6 pt-0">
              <button
                onClick={() => onSelectPackage(pkg)}
                className="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Book This Curated Package</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
