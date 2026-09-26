// Changes made by @MdFarhanAhmad
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Check, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Wifi, 
  Coffee, 
  Zap, 
  Sparkles, 
  Clock, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Building2,
  Maximize2
} from 'lucide-react';
import { StayOption } from '../../types';

interface HotelDetailsModalProps {
  stay: StayOption | null;
  isOpen: boolean;
  onClose: () => void;
  isSelected: boolean;
  onReserve: (stay: StayOption) => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80';

export const HotelDetailsModal: React.FC<HotelDetailsModalProps> = ({
  stay,
  isOpen,
  onClose,
  isSelected,
  onReserve
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [allPhotos, setAllPhotos] = useState<string[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);

  // Fetch real-time photos from backend whenever stay changes
  useEffect(() => {
    if (!isOpen || !stay) return;

    setActivePhotoIndex(0);
    const initialPhotos: string[] = [];

    if (stay.photos && stay.photos.length > 0) {
      initialPhotos.push(...stay.photos);
    } else if (stay.image) {
      initialPhotos.push(stay.image);
    }

    setAllPhotos(initialPhotos.length > 0 ? initialPhotos : [FALLBACK_IMAGE]);

    // Check if dynamic server images exist
    if (stay.id && !stay.id.startsWith('ker-') && !stay.id.startsWith('default-')) {
      setIsLoadingPhotos(true);
      fetch(`/api/v1/hotels/${stay.id}/images`)
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            const serverUrls = data.map((img: any) => img.imageUrl).filter(Boolean);
            if (serverUrls.length > 0) {
              setAllPhotos(serverUrls);
            }
          }
        })
        .catch(() => {
          // Keep initial photos
        })
        .finally(() => {
          setIsLoadingPhotos(false);
        });
    }
  }, [stay, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'ArrowRight') handleNextPhoto();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, allPhotos.length]);

  if (!isOpen || !stay) return null;

  const handlePrevPhoto = () => {
    setActivePhotoIndex(prev => (prev === 0 ? allPhotos.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    setActivePhotoIndex(prev => (prev === allPhotos.length - 1 ? 0 : prev + 1));
  };

  const currentPhoto = allPhotos[activePhotoIndex] || stay.image || FALLBACK_IMAGE;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                  {stay.category || 'Verified Property'}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Direct Host Synced
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight mt-0.5">{stay.name}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            title="Close Details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Main Photo Gallery Carousel */}
          <div className="space-y-3">
            <div className="relative aspect-16/9 sm:aspect-21/9 w-full bg-slate-900 rounded-2xl overflow-hidden shadow-md group">
              <img
                key={currentPhoto}
                src={currentPhoto}
                alt={`${stay.name} photo ${activePhotoIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
              />

              {/* Navigation Arrows */}
              {allPhotos.length > 1 && (
                <>
                  <button
                    onClick={handlePrevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition shadow-lg opacity-90 hover:opacity-100 cursor-pointer"
                    title="Previous Photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition shadow-lg opacity-90 hover:opacity-100 cursor-pointer"
                    title="Next Photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Badges Overlay */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-semibold shadow-xs">
                  {activePhotoIndex === 0 ? 'Cover Photo' : `Photo #${activePhotoIndex + 1}`}
                </span>
                {isLoadingPhotos && (
                  <span className="px-2.5 py-1 rounded-lg bg-blue-600/80 text-white text-[11px] font-medium animate-pulse">
                    Syncing live gallery...
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-xs font-bold shadow-xs">
                📸 {activePhotoIndex + 1} / {allPhotos.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {allPhotos.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
                {allPhotos.map((photoUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`relative shrink-0 w-20 sm:w-24 aspect-4/3 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activePhotoIndex === idx
                        ? 'border-blue-600 ring-2 ring-blue-500/30 scale-102 shadow-md'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photoUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                      }}
                    />
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[8px] font-bold px-1 rounded">
                        Cover
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Summary Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">{stay.rating} / 5.0 Rating</div>
                <div className="text-[11px] text-slate-500">{stay.reviews} verified guest reviews</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 truncate">{stay.location}</div>
                <div className="text-[11px] text-slate-500">Prime Eco-Corridor</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Host: {stay.hostName}</div>
                <div className="text-[11px] text-emerald-700 font-medium">0% Commission Host</div>
              </div>
            </div>
          </div>

          {/* Detailed Information & Amenities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Description & Overview */}
            <div className="space-y-3 text-left">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">About This Stay</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {stay.description || 'Experience authentic local hospitality nestled amidst serene natural surroundings. Enjoy home-cooked regional cuisine prepared with farm-fresh ingredients, eco-friendly accommodation, and customized travel guidance provided directly by your verified local host.'}
              </p>

              <div className="p-3.5 bg-amber-50/60 border border-amber-200/70 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>YatraSync Authentic Stay Guarantee</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-normal">
                  All tariffs are 100% transparent with 0% hidden middleman commissions. Direct Host Channel Sync ensures your room is reserved in real-time.
                </p>
              </div>
            </div>

            {/* Amenities & Features Included */}
            <div className="space-y-3 text-left">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Amenities & Features</h4>
              <div className="grid grid-cols-2 gap-2">
                {stay.features && stay.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{feature}</span>
                  </div>
                ))}
                {(!stay.features || stay.features.length === 0) && (
                  <>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                      <Wifi className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Complimentary Wi-Fi</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                      <Coffee className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Farm Fresh Breakfast</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                      <Zap className="w-3.5 h-3.5 text-yellow-600 shrink-0" />
                      <span>24x7 Power Backup</span>
                    </div>
                  </>
                )}
              </div>

              {/* Policies */}
              <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Check-in: 12:00 PM</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Check-out: 11:00 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar with Reservation Action */}
        <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nightly Tariff</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-serif text-slate-900">
                ₹{stay.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500">/ night</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold block">All taxes & fees included</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              Back to Stays
            </button>
            <button
              type="button"
              onClick={() => {
                onReserve(stay);
                onClose();
              }}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-slate-900 hover:bg-orange-700 text-white'
              }`}
            >
              {isSelected ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Reserved</span>
                </>
              ) : (
                <span>Reserve This Stay</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
