// Changes made by @MdFarhanAhmad
import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
  PlaneTakeoff,
  Calendar,
  Users,
  Search,
  Smartphone,
  Zap,
  RefreshCw,
  DollarSign,
  Sparkles
} from 'lucide-react';
import { ALL_STATES_AND_UTS } from '../data/destinations';

export interface AnimatedDestination {
  id: string;
  title: string;
  location: string;
  image: string;
  tagline: string;
}

export const HERO_ANIMATED_DESTINATIONS: AnimatedDestination[] = [
  {
    id: 'taj-mahal',
    title: 'Taj Mahal',
    location: 'Agra, Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&auto=format&fit=crop&q=80',
    tagline: 'Iconic Symbol of Eternal Love & UNESCO Heritage'
  },
  {
    id: 'kerala-backwaters',
    title: 'Kerala Backwaters',
    location: 'Alleppey, Kerala',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1600&auto=format&fit=crop&q=80',
    tagline: 'Serene Houseboat Cruises & Heritage Palm Lagoons'
  },
  {
    id: 'varanasi-ghats',
    title: 'Varanasi Ganga Ghats',
    location: 'Varanasi, Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=1600&auto=format&fit=crop&q=80',
    tagline: 'Spiritual Heart of India & Ancient Ganga Aarti'
  },
  {
    id: 'hampi-ruins',
    title: 'Hampi Stone Chariot',
    location: 'Vijayanagara, Karnataka',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1600&auto=format&fit=crop&q=80',
    tagline: 'Ancient Empire Boulders & Monumental Temples'
  },
  {
    id: 'pangong-lake',
    title: 'Pangong Tso Lake',
    location: 'Leh Ladakh, UT',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=1600&auto=format&fit=crop&q=80',
    tagline: 'High-Altitude Azure Salt Lake in Himalayan Valleys'
  },
  {
    id: 'hawa-mahal',
    title: 'Hawa Mahal & Palaces',
    location: 'Jaipur, Rajasthan',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1600&auto=format&fit=crop&q=80',
    tagline: 'Pink City Royal Architecture & Desert Forts'
  },
  {
    id: 'golden-temple',
    title: 'Sri Harmandir Sahib',
    location: 'Amritsar, Punjab',
    image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=1600&auto=format&fit=crop&q=80',
    tagline: 'Golden Sanctuary of Peace, Community & Heritage'
  }
];

interface HeroSectionProps {
  onPlanTripClick: () => void;
  onCustomizeJourneyClick?: () => void;
  onExploreClick: () => void;
  origin?: string;
  onOriginChange?: (val: string) => void;
  destination?: string;
  onDestinationChange?: (val: string) => void;
  datesText?: string;
  onDatesChange?: (val: string) => void;
  calculatedNights?: number;
  persona?: string;
  onPersonaChange?: (val: string) => void;
  onBuildTrip?: () => void;
  activeTags?: string[];
  onToggleTag?: (tag: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onPlanTripClick,
  onCustomizeJourneyClick,
  onExploreClick,
  origin = 'Hyderabad',
  onOriginChange,
  destination = 'kerala',
  onDestinationChange,
  datesText = 'Oct 14 - Oct 18, 2026',
  onDatesChange,
  calculatedNights = 4,
  persona = 'couple',
  onPersonaChange,
  onBuildTrip,
  activeTags = [],
  onToggleTag
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto animation slideshow for Indian tourist places (1.5s interval)
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_ANIMATED_DESTINATIONS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_ANIMATED_DESTINATIONS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_ANIMATED_DESTINATIONS.length) % HERO_ANIMATED_DESTINATIONS.length);
  };

  const currentDest = HERO_ANIMATED_DESTINATIONS[currentIndex];

  const handlePrimarySearch = () => {
    if (onBuildTrip) {
      onBuildTrip();
    } else {
      onPlanTripClick();
    }
  };

  return (
    <section id="hero" className="relative pt-4 sm:pt-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* ========================================================================= */}
      {/* 1. TOP HERO IMAGE BANNER CONTAINER WITH ANIMATED INDIAN TOURIST PLACES    */}
      {/* ========================================================================= */}
      <div 
        className="relative rounded-3xl sm:rounded-[36px] overflow-hidden bg-slate-950 min-h-[460px] sm:min-h-[540px] lg:min-h-[580px] p-6 sm:p-10 shadow-2xl transition-all"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        
        {/* Animated Background Slideshow */}
        <div className="absolute inset-0 z-0">
          {HERO_ANIMATED_DESTINATIONS.map((dest, idx) => (
            <div
              key={dest.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === currentIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 pointer-events-none'
              }`}
            >
              <img
                src={dest.image}
                alt={dest.title}
                onError={(e) => {
                  const fallback = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&auto=format&fit=crop&q=80';
                  if (e.currentTarget.src !== fallback) {
                    e.currentTarget.src = fallback;
                  }
                }}
                className="w-full h-full object-cover object-center brightness-105 contrast-105 saturate-[1.12] transition-all"
              />
              {/* Subtle, balanced visual overlays for depth and photo vibrancy */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/20"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/35 via-transparent to-slate-950/15"></div>
            </div>
          ))}
        </div>

        {/* Top Badges over Hero Image */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="bg-slate-900/80 backdrop-blur-md border border-white/15 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white shadow-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Government Verified Partner • Save up to 50%</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 text-xs font-medium text-slate-200 shadow-md">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span>All 28 States & 8 Union Territories</span>
            </span>
          </div>

          <button
            onClick={onExploreClick}
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-xs font-bold text-white border border-white/20 transition cursor-pointer"
          >
            <span>Explore Destinations</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Active Animated Destination Name Badge & Controls (Bottom Left/Right of Hero Frame) */}
        <div className="relative z-20 mt-auto pt-44 sm:pt-52 flex flex-wrap items-end justify-between gap-4">
          
          {/* Destination Badge Overlay */}
          <div className="flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-white shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-orange-600/90 text-white flex items-center justify-center shadow-xs">
              <MapPin className="w-4 h-4 animate-bounce" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm sm:text-base text-white tracking-tight">
                  {currentDest.title}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 flex items-center gap-1 -mt-0.5">
                <span>{currentDest.location}</span>
                <span>•</span>
                <span className="text-amber-300 italic">{currentDest.tagline}</span>
              </p>
            </div>
          </div>

          {/* Slide Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-9 h-9 rounded-full bg-slate-900/80 hover:bg-orange-600 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition shadow-md cursor-pointer"
              title="Previous Tourist Spot"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15">
              {HERO_ANIMATED_DESTINATIONS.map((dest, idx) => (
                <button
                  key={dest.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex ? 'w-6 bg-orange-500' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  title={dest.title}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-9 h-9 rounded-full bg-slate-900/80 hover:bg-orange-600 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition shadow-md cursor-pointer"
              title="Next Tourist Spot"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. OVERLAPPING FLOATING WINDOW CARD (Inspired by Reference Design Image 2) */}
      {/* ========================================================================= */}
      <div className="relative z-30 max-w-5xl mx-auto px-2 sm:px-4 -mt-24 sm:-mt-32 lg:-mt-36">
        <div className="bg-white rounded-3xl sm:rounded-[36px] p-6 sm:p-10 shadow-2xl border border-slate-100 text-slate-900 space-y-6">
          
          {/* Headlines & Subtitles */}
          <div className="text-center space-y-2.5 max-w-3xl mx-auto">
            <h2 className="font-serif font-bold text-2xl sm:text-4xl lg:text-5xl text-slate-950 tracking-tight leading-tight">
              Sightsee the smart way with <span className="text-orange-600 font-black">YatraSync®</span>
            </h2>
            <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              One country. A thousand stories. One digital platform for verified state dossiers, personalized multimodal journeys, heritage homestays, and local storyteller drivers.
            </p>

            {/* Travel Planning Mode Switcher */}
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onPlanTripClick}
                className="px-4 py-2 rounded-2xl bg-white border border-slate-300 text-slate-800 text-xs font-bold shadow-xs hover:border-orange-500 hover:text-orange-700 transition flex items-center gap-1.5"
              >
                <span>Predefined Tour Packages</span>
              </button>

              <button
                type="button"
                onClick={onCustomizeJourneyClick || onPlanTripClick}
                className="px-4 py-2 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-extrabold shadow-md shadow-orange-500/20 transition flex items-center gap-1.5 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-200" />
                <span>Customize My Journey</span>
                <span className="text-[9px] bg-white text-orange-700 px-1.5 py-0.2 rounded-full font-black">NEW</span>
              </button>
            </div>
          </div>

          {/* Embedded Interactive Search & Configurator Bar */}
          <div className="bg-slate-50/90 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-inner">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-stretch">
              
              {/* 1. Origin */}
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 text-left shadow-2xs flex flex-col justify-between">
                <label htmlFor="hero-config-origin" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                  <PlaneTakeoff className="w-3.5 h-3.5 text-orange-600" />
                  <span>From (Origin)</span>
                </label>
                <select
                  id="hero-config-origin"
                  value={origin}
                  onChange={(e) => onOriginChange && onOriginChange(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer py-0.5"
                >
                  <option value="Hyderabad">Hyderabad (HYD)</option>
                  <option value="Bengaluru">Bengaluru (BLR)</option>
                  <option value="Mumbai">Mumbai (BOM)</option>
                  <option value="Delhi">Delhi (DEL)</option>
                  <option value="Chennai">Chennai (MAA)</option>
                  <option value="Kolkata">Kolkata (CCU)</option>
                </select>
              </div>

              {/* 2. Destination */}
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 text-left shadow-2xs flex flex-col justify-between">
                <label htmlFor="hero-config-dest" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  <span>Where to?</span>
                </label>
                <select
                  id="hero-config-dest"
                  value={destination}
                  onChange={(e) => onDestinationChange && onDestinationChange(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer truncate py-0.5"
                >
                  {ALL_STATES_AND_UTS.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.capital})
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Dates */}
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 text-left shadow-2xs flex flex-col justify-between">
                <label htmlFor="hero-config-dates" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-orange-600" />
                  <span>When are you going?</span>
                </label>
                <div>
                  <input
                    id="hero-config-dates"
                    type="text"
                    value={datesText}
                    onChange={(e) => onDatesChange && onDatesChange(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
                    placeholder="Nov 14 - Nov 20, 2026"
                  />
                  <span className="text-[10px] text-orange-700 font-semibold block -mt-0.5">
                    {calculatedNights} Nights Trip
                  </span>
                </div>
              </div>

              {/* 4. Persona */}
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 text-left shadow-2xs flex flex-col justify-between">
                <label htmlFor="hero-config-persona" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-orange-600" />
                  <span>Who's going?</span>
                </label>
                <select
                  id="hero-config-persona"
                  value={persona}
                  onChange={(e) => onPersonaChange && onPersonaChange(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer py-0.5"
                >
                  <option value="couple">2 Adults (Couple)</option>
                  <option value="family">Family (2 Adults, 2 Kids)</option>
                  <option value="solo">Solo Adventurer</option>
                  <option value="friends">Friends Group (4 Adults)</option>
                </select>
              </div>

              {/* 5. Primary Action CTA Button */}
              <div className="flex items-center">
                <button
                  id="hero-find-pass-cta"
                  onClick={handlePrimarySearch}
                  className="w-full h-full py-4 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 hover:shadow-xl transition-all active:scale-95 cursor-pointer min-h-[52px]"
                >
                  <Search className="w-4 h-4" />
                  <span>Find My Pass</span>
                </button>
              </div>

            </div>
          </div>

          {/* Trust Badges Bar */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] sm:text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-orange-600" />
              <span>Instant Mobile Delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>ASI Monument Certified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-orange-600" />
              <span>Best Price & Zero Surcharge Guarantee</span>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. HORIZONTAL FEATURE VALUE CARDS ROW (Matching Image 2 Bottom Cards)      */}
      {/* ========================================================================= */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 mt-6 sm:mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 text-left">
          
          <div className="bg-white/95 p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition space-y-2">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <RefreshCw className="w-4.5 h-4.5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">Free cancellation</h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Within 90 days of purchase on unactivated passes.
            </p>
          </div>

          <div className="bg-white/95 p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4.5 h-4.5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">Guaranteed savings</h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Save with us or we'll gladly refund the difference.
            </p>
          </div>

          <div className="bg-white/95 p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition space-y-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <Smartphone className="w-4.5 h-4.5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">Contactless entry</h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Plan and scan straight from your mobile app offline.
            </p>
          </div>

          <div className="bg-white/95 p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Zap className="w-4.5 h-4.5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">Skip-the-line queue</h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Priority express entry gates at primary monuments.
            </p>
          </div>

          <div className="bg-white/95 p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition space-y-2">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">1-Year validity</h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Activates only upon your first gate scan or trip start.
            </p>
          </div>

        </div>
      </div>

    </section>
  );
};
