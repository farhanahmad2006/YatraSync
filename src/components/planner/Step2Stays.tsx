// Changes made by @MdFarhanAhmad
import React, { useState } from 'react';
import { Home, Star, MapPin, Check, Images, Info, Eye } from 'lucide-react';
import { StayOption } from '../../types';
import { HotelDetailsModal } from './HotelDetailsModal';

interface Step2StaysProps {
  stays: StayOption[];
  selectedStay: StayOption | null;
  onSelectStay: (stay: StayOption) => void;
  destinationName?: string;
}

const FALLBACK_ROOM_IMG = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80';

export const Step2Stays: React.FC<Step2StaysProps> = ({
  stays,
  selectedStay,
  onSelectStay,
  destinationName
}) => {
  const [tierFilter, setTierFilter] = useState<'all' | 'homestay' | 'budget' | 'heritage'>('all');
  const [detailStay, setDetailStay] = useState<StayOption | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredStays = stays.filter(s => {
    if (tierFilter === 'all') return true;
    return s.tier === tierFilter;
  });

  const handleOpenDetails = (stay: StayOption) => {
    setDetailStay(stay);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setDetailStay(null);
  };

  return (
    <div id="content-stays" className="space-y-6 text-left">
      {/* Tier Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle-card text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-500 mr-1">Filter Tier:</span>
          <button
            onClick={() => setTierFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition cursor-pointer ${tierFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
          >
            All Stays
          </button>
          <button
            onClick={() => setTierFilter('homestay')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition flex items-center gap-1 cursor-pointer ${tierFilter === 'homestay' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
          >
            <Home className="w-3.5 h-3.5 text-orange-500" />
            <span>Verified Homestays (0% Fee)</span>
          </button>
          <button
            onClick={() => setTierFilter('budget')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition cursor-pointer ${tierFilter === 'budget' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
          >
            Budget / Eco-Cottage
          </button>
          <button
            onClick={() => setTierFilter('heritage')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition cursor-pointer ${tierFilter === 'heritage' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
          >
            Heritage / Resort
          </button>
        </div>
        <span className="text-slate-500 text-[11px] font-medium">Direct Host Channel Sync Active</span>
      </div>

      {/* Hotel Cards Grid or Empty State */}
      {filteredStays.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 sm:p-14 text-center shadow-subtle-card space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 mx-auto flex items-center justify-center">
            <Home className="w-8 h-8 text-orange-600" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h4 className="font-serif font-bold text-lg sm:text-xl text-slate-900">
              No available stays found for {destinationName || 'this destination'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {tierFilter !== 'all'
                ? `No partner stays match the "${tierFilter}" filter for ${destinationName || 'this destination'}. Try selecting "All Stays" or adjusting your dates.`
                : `We are currently onboarding verified zero-commission homestays and heritage properties for ${destinationName || 'this destination'}.`}
            </p>
          </div>
          {tierFilter !== 'all' && (
            <button
              onClick={() => setTierFilter('all')}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-orange-600 transition shadow-xs cursor-pointer"
            >
              Reset to All Stays
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStays.map((stay) => {
            const isSelected = selectedStay?.id === stay.id;
            const photoCount = stay.photos && stay.photos.length > 0 ? stay.photos.length : 1;

            return (
              <div
                key={stay.id}
                className={`bg-white rounded-2xl border overflow-hidden shadow-subtle-card flex flex-col justify-between transition text-left group hover:shadow-lg ${
                  isSelected ? 'border-slate-900 ring-2 ring-slate-900' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Clickable Image Thumbnail with Gallery Overlay */}
                  <div 
                    className="h-44 w-full bg-slate-100 relative overflow-hidden cursor-pointer"
                    onClick={() => handleOpenDetails(stay)}
                    title="Click to view hotel photos and details"
                  >
                    <img
                      src={stay.image}
                      alt={stay.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_ROOM_IMG;
                      }}
                    />

                    {/* Category Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="bg-white/95 text-slate-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                        {stay.category}
                      </span>
                    </div>

                    {/* Multiple Photos Count Indicator */}
                    <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                      <Images className="w-3 h-3" />
                      <span>{photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}</span>
                    </div>

                    {/* Hover Details Prompt */}
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>View Photos & Info</span>
                      </span>
                    </div>

                    {/* Star Rating */}
                    <div className="absolute bottom-2 right-2 bg-white text-slate-900 font-bold text-xs px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{stay.rating}</span>
                      <span className="text-[10px] text-slate-400">({stay.reviews})</span>
                    </div>
                  </div>

                  {/* Hotel Information Body */}
                  <div className="p-4 space-y-2 text-xs">
                    <div 
                      className="cursor-pointer group/title"
                      onClick={() => handleOpenDetails(stay)}
                    >
                      <h4 className="font-bold text-sm text-slate-950 leading-snug group-hover/title:text-blue-600 transition-colors">
                        {stay.name}
                      </h4>
                    </div>

                    <div className="text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{stay.location}</span>
                    </div>

                    <div className="text-[11px] text-orange-700 font-semibold">
                      Host: {stay.hostName}
                    </div>
                    
                    {/* Dynamic Room Availability Badge */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] font-bold text-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>7 rooms available</span>
                    </div>

                    {/* Key Features / Amenities */}
                    <div className="space-y-1 pt-1 text-slate-600">
                      {stay.features.slice(0, 4).map((f, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Card Footer Actions */}
                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Per Night</span>
                    <div className="font-serif font-bold text-lg text-slate-950">
                      ₹{stay.price.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenDetails(stay)}
                      className="px-2.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold text-xs transition cursor-pointer flex items-center gap-1"
                      title="View Hotel Photos & Details"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectStay(stay)}
                      className={`px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                        isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-900 hover:bg-orange-700 text-white'
                      }`}
                    >
                      {isSelected ? '✓ Reserved' : 'Reserve'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Hotel Details & Multi-Photo Gallery Modal */}
      <HotelDetailsModal
        stay={detailStay}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        isSelected={Boolean(selectedStay && detailStay && selectedStay.id === detailStay.id)}
        onReserve={(stay) => onSelectStay(stay)}
      />
    </div>
  );
};
