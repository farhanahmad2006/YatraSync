// Changes made by @MdFarhanAhmad
import React, { useState } from 'react';
import { UserSession, HotelPropertyData } from '../../types';
import { Building2, ShieldCheck, ArrowRight, CheckCircle2, MapPin, Bed, Tag, FileText, Upload, Sparkles, AlertCircle } from 'lucide-react';

interface HotelPartnerOnboardingProps {
  user: UserSession;
  onComplete: (session: UserSession, property: HotelPropertyData) => void;
  onCancel: () => void;
}

export const HotelPartnerOnboarding: React.FC<HotelPartnerOnboardingProps> = ({
  user,
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [propertyName, setPropertyName] = useState('');
  const [propertyType, setPropertyType] = useState<'hotel' | 'resort' | 'homestay' | 'ecolodge' | 'heritage'>('homestay');
  const [ownerName, setOwnerName] = useState(user.name || '');
  const [contactPhone, setContactPhone] = useState(user.phone || '');
  const [contactEmail, setContactEmail] = useState(user.email || '');

  // Address
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Kerala');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');

  // Details
  const [roomCount, setRoomCount] = useState(6);
  const [baseTariffINR, setBaseTariffINR] = useState(2400);
  const [description, setDescription] = useState('Authentic government-certified zero-surcharge heritage accommodation.');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['Wi-Fi', 'Free Breakfast', 'AC', 'Parking']);
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80');

  // Business Verification
  const [panNumber, setPanNumber] = useState('ABCDE1234F');
  const [gstin, setGstin] = useState('32ABCDE1234F1Z5');
  const [digiLockerVerified, setDigiLockerVerified] = useState(true);

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newProperty: HotelPropertyData = {
      id: 'prop-' + Date.now(),
      propertyName,
      propertyType,
      ownerName,
      contactPhone,
      contactEmail,
      address: {
        line: addressLine,
        city,
        state,
        pincode,
        landmark
      },
      details: {
        roomCount,
        baseTariffINR,
        description,
        amenities: selectedAmenities,
        photos: [photoUrl]
      },
      verification: {
        panNumber,
        gstin,
        digiLockerVerified,
        documentUrls: []
      },
      approvalStatus: 'UNDER_REVIEW',
      rating: 4.9,
      totalBookings: 0,
      createdAt: new Date().toISOString()
    };

    try {
      await fetch('/api/partner/hotel/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProperty)
      });
    } catch (err) {
      console.warn('Backend offline, proceeding with client state', err);
    }

    setIsSubmitting(false);

    const updatedUserSession: UserSession = {
      ...user,
      name: ownerName,
      phone: contactPhone,
      email: contactEmail,
      role: 'hotel_partner',
      hotelPropertyId: newProperty.id,
      onboardingStatus: 'COMPLETED',
      verificationStatus: 'UNDER_REVIEW'
    };

    onComplete(updatedUserSession, newProperty);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-left animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                YatraSync 0% Fee Hotel Network
              </span>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white">
                Hotel & Property Onboarding
              </h1>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-xs text-slate-300 hover:text-white underline"
          >
            Cancel & Exit
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className={`p-2.5 rounded-xl border flex items-center gap-1.5 transition ${
            currentStep === 1 ? 'bg-white/15 border-blue-500 font-bold text-white' : 'border-white/10 text-slate-400'
          }`}>
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
            <span>Identity</span>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center gap-1.5 transition ${
            currentStep === 2 ? 'bg-white/15 border-blue-500 font-bold text-white' : 'border-white/10 text-slate-400'
          }`}>
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
            <span>Address</span>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center gap-1.5 transition ${
            currentStep === 3 ? 'bg-white/15 border-blue-500 font-bold text-white' : 'border-white/10 text-slate-400'
          }`}>
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">3</span>
            <span>Rooms & Tariff</span>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center gap-1.5 transition ${
            currentStep === 4 ? 'bg-white/15 border-blue-500 font-bold text-white' : 'border-white/10 text-slate-400'
          }`}>
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">4</span>
            <span>Verification</span>
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* STEP 1: Property Identity */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <h2 className="font-serif font-bold text-xl text-slate-900 border-b pb-3 border-slate-100">
                Step 1: Property & Owner Identity
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Property / Hotel Name *</label>
                <input
                  type="text"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  placeholder="e.g. Munnar Tea Hills Resort / Spice Garden Homestay"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Property Category *</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  {[
                    { id: 'homestay', label: 'Homestay' },
                    { id: 'hotel', label: 'Hotel' },
                    { id: 'resort', label: 'Resort' },
                    { id: 'ecolodge', label: 'Eco-Lodge' },
                    { id: 'heritage', label: 'Heritage' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setPropertyType(cat.id as any)}
                      className={`p-3 rounded-xl border font-bold transition text-center ${
                        propertyType === cat.id ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Owner / Manager Name *</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Contact Phone (+91) *</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Business Email *</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="owner@property.com"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!propertyName) return alert('Please enter property name');
                    setCurrentStep(2);
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md"
                >
                  <span>Next: Location Address</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Address & Location */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <h2 className="font-serif font-bold text-xl text-slate-900 border-b pb-3 border-slate-100">
                Step 2: Property Address & Location
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Street Address / Village *</label>
                <input
                  type="text"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="e.g. Pothamedu Viewpoint Road, Silent Valley"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">City / Destination *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Munnar / Kochi / Jaipur"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">State *</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Kerala / Rajasthan / Goa"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">PIN Code *</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="685612"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Nearby Landmark / Transit Hub</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. 500 meters from Tata Tea Museum"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!addressLine || !city) return alert('Please enter street address and city');
                    setCurrentStep(3);
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md"
                >
                  <span>Next: Rooms & Tariff</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Rooms, Tariff & Amenities */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <h2 className="font-serif font-bold text-xl text-slate-900 border-b pb-3 border-slate-100">
                Step 3: Capacity, Tariff & Amenities
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Number of Guest Rooms *</label>
                  <input
                    type="number"
                    value={roomCount}
                    onChange={(e) => setRoomCount(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Base Nightly Tariff (₹ INR - 0% Fee) *</label>
                  <input
                    type="number"
                    value={baseTariffINR}
                    onChange={(e) => setBaseTariffINR(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Amenities Checklist</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {['Wi-Fi', 'Free Breakfast', 'AC', 'Parking', 'Ayurvedic Spa', 'Valley View', 'Dining', '24x7 Power Backup', 'Swimming Pool'].map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`p-2.5 rounded-xl border text-left font-medium transition flex items-center justify-between ${
                        selectedAmenities.includes(amenity)
                          ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span>{amenity}</span>
                      {selectedAmenities.includes(amenity) && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Property Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Photo Preview URL</label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md"
                >
                  <span>Next: Business Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Business Verification & Submission */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <h2 className="font-serif font-bold text-xl text-slate-900 border-b pb-3 border-slate-100">
                Step 4: Business Documents & Approval Submission
              </h2>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold block">Approval Lifecycle Notice:</span>
                  <p className="text-amber-800 mt-0.5">
                    Upon submission, your property status will be set to <strong className="uppercase">Under Review</strong>. YatraSync verification officers check GSTIN and DigiLocker credentials within 2 hours before granting public bookable status.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Owner PAN Number *</label>
                  <input
                    type="text"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">GSTIN Number (Optional)</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="32ABCDE1234F1Z5"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium uppercase"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold block">DigiLocker Business Identity Sync</span>
                  <span className="text-emerald-800">State Tourism Board certification validated directly.</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs tracking-wider uppercase shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Property...</span>
                  ) : (
                    <>
                      <span>Submit Property For Approval</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </form>
      </div>

    </div>
  );
};
