// Changes made by @MdFarhanAhmad
import React, { useState } from 'react';
import { Search, MapPin, Tag, Clock, ArrowRight, ShieldCheck, Landmark } from 'lucide-react';

export interface Attraction {
  id: string;
  name: string;
  city: string;
  state: string;
  category: 'forts' | 'temples' | 'backwaters' | 'sanctuaries' | 'unesco';
  categoryLabel: string;
  image: string;
  gatePriceINR: number;
  passPriceINR: number;
  rating: string;
  description: string;
  highlights: string[];
}

interface AttractionsSectionProps {
  onSelectAttraction: (attraction: Attraction) => void;
  onViewAll?: () => void;
}

export const AttractionsSection: React.FC<AttractionsSectionProps> = ({
  onSelectAttraction,
  onViewAll
}) => {
  const attractionsData: Attraction[] = [
    {
      id: 'taj-mahal',
      name: 'Taj Mahal Priority Entry',
      city: 'Agra',
      state: 'Uttar Pradesh',
      category: 'unesco',
      categoryLabel: 'UNESCO Wonder',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
      gatePriceINR: 1100,
      passPriceINR: 650,
      rating: '4.9 (42,000+ reviews)',
      description: 'Experience white marble majesty with priority gate access, bypass long general ticket queues, and access royal mausoleum gardens.',
      highlights: ['Priority Gate Access', 'Verified Audio Guide', 'Sunset Viewpoint']
    },
    {
      id: 'amber-fort',
      name: 'Amber Citadel & Sheesh Mahal',
      city: 'Jaipur',
      state: 'Rajasthan',
      category: 'forts',
      categoryLabel: 'Palaces & Forts',
      image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800&auto=format&fit=crop&q=80',
      gatePriceINR: 500,
      passPriceINR: 320,
      rating: '4.8 (18,500+ reviews)',
      description: 'Hilltop Rajput fortress with mirror hall galleries, elephant gate ramparts, and panoramic Maota Lake vistas.',
      highlights: ['Express Rampart Entry', 'Mirror Palace Tour', 'Sound & Light Pass']
    },
    {
      id: 'vembanad-lake',
      name: 'Vembanad Backwaters Solar Cruise',
      city: 'Kumarakom',
      state: 'Kerala',
      category: 'backwaters',
      categoryLabel: 'Backwaters & Lakes',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
      gatePriceINR: 1800,
      passPriceINR: 1150,
      rating: '4.9 (12,300+ reviews)',
      description: 'Glide quietly through coconut palm canals aboard eco-certified solar houseboats with traditional Keralan lunch.',
      highlights: ['Eco Houseboat Pass', 'Traditional Karimeen Feast', 'Bird Sanctuary Shore Access']
    },
    {
      id: 'ramappa-temple',
      name: 'Ramappa Floating Brick Temple',
      city: 'Warangal',
      state: 'Telangana',
      category: 'unesco',
      categoryLabel: 'UNESCO Heritage',
      image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?w=800&auto=format&fit=crop&q=80',
      gatePriceINR: 400,
      passPriceINR: 240,
      rating: '4.9 (6,800+ reviews)',
      description: '13th-century Kakatiya masterpiece built with light floating bricks and intricate carved granite pillars.',
      highlights: ['Guided Sculpture Trail', 'Floating Brick Demo', 'Kakatiya Heritage Pass']
    },
    {
      id: 'qutub-minar',
      name: 'Qutub Minar Victory Tower',
      city: 'New Delhi',
      state: 'Delhi',
      category: 'forts',
      categoryLabel: 'Palaces & Forts',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80',
      gatePriceINR: 600,
      passPriceINR: 360,
      rating: '4.7 (24,100+ reviews)',
      description: 'World’s tallest brick minaret standing amidst 12th-century Indo-Islamic tombs and rust-resistant iron pillar.',
      highlights: ['Turnstile QR Entry', 'Iron Pillar Complex', 'Alai Darwaza Gateway']
    },
    {
      id: 'meenakshi-temple',
      name: 'Meenakshi Amman Gopuram Complex',
      city: 'Madurai',
      state: 'Tamil Nadu',
      category: 'temples',
      categoryLabel: 'Temples & Spiritual',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
      gatePriceINR: 350,
      passPriceINR: 200,
      rating: '4.9 (31,400+ reviews)',
      description: 'Dravidian architectural wonder featuring 14 soaring gopuram towers decorated with thousands of colorful sculptures.',
      highlights: ['Priority Temple Queue', 'Thousand Pillar Hall Access', 'Night Ceremony View']
    },
    {
      id: 'periyar-sanctuary',
      name: 'Periyar Tiger Reserve Boat Safari',
      city: 'Thekkady',
      state: 'Kerala',
      category: 'sanctuaries',
      categoryLabel: 'Sanctuaries & Parks',
      image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800&auto=format&fit=crop&q=80',
      gatePriceINR: 1200,
      passPriceINR: 780,
      rating: '4.8 (9,900+ reviews)',
      description: 'Forest reserve lake safari spotting wild elephant herds, sambar deer, and rare birds along forested shorelines.',
      highlights: ['Morning Boat Safari Slot', 'Spice Plantation Walk', 'Bamboo Rafting Addon']
    },
    {
      id: 'golden-temple',
      name: 'Harmandir Sahib Heritage Corridor',
      city: 'Amritsar',
      state: 'Punjab',
      category: 'temples',
      categoryLabel: 'Temples & Spiritual',
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&auto=format&fit=crop&q=80',
      gatePriceINR: 300,
      passPriceINR: 150,
      rating: '5.0 (55,000+ reviews)',
      description: 'Spiritual heart of Sikhism with gold-gilded sanctum, holy lake, and 24/7 community langar kitchen heritage tour.',
      highlights: ['Heritage Street Walking Tour', 'Langar Kitchen Walkthrough', 'Wagah Border Express Cab']
    }
  ];

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredAttractions = attractionsData.filter(item => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      item.name.toLowerCase().includes(q) ||
      item.city.toLowerCase().includes(q) ||
      item.state.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <section id="attractions-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
      
      {/* Title & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-600"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-700">
              120+ Priority Monument & Experience Pass Network
            </span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-slate-950">
            Top Attractions with Priority Entry
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            Bypass ticket line queues at top heritage sites, forts, UNESCO world heritage monuments, and eco-tours across India.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
          {[
            { id: 'all', label: 'All Top Attractions' },
            { id: 'unesco', label: 'UNESCO Heritage' },
            { id: 'forts', label: 'Palaces & Forts' },
            { id: 'backwaters', label: 'Backwaters & Lakes' },
            { id: 'temples', label: 'Temples & Spiritual' },
            { id: 'sanctuaries', label: 'Sanctuaries' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl transition shadow-xs whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search monuments, cities (Agra, Jaipur, Kochi)..."
          className="w-full bg-white border border-slate-200/90 rounded-2xl pl-11 pr-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-orange-500 shadow-xs"
        />
      </div>

      {/* Attractions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredAttractions.map(item => (
          <div
            key={item.id}
            className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-subtle-card hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {item.categoryLabel}
                </div>
                <div className="absolute bottom-3 right-3 bg-emerald-500 text-slate-950 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Priority Entry</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-1 text-[11px] font-bold text-orange-700">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{item.city}, {item.state}</span>
                </div>

                <h3 className="font-serif font-bold text-lg text-slate-950 leading-snug group-hover:text-orange-600 transition-colors">
                  {item.name}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 line-through text-[11px]">₹{item.gatePriceINR}</span>
                    <span className="font-extrabold text-slate-950 text-sm ml-1.5">₹{item.passPriceINR}</span>
                    <span className="text-[10px] text-emerald-600 font-bold block">Included in Pass</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">
                    ★ {item.rating.split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer Action */}
            <div className="p-4 pt-0">
              <button
                onClick={() => onSelectAttraction(item)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>View Details & Priority Pass</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
