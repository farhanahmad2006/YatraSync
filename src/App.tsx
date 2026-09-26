// Changes made by @MdFarhanAhmad
/**
 * YatraSync Main Application Root
 */
import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Sparkles, 
  MapPin, 
  Check, 
  Plane, 
  Home, 
  UserCheck, 
  Calendar, 
  ArrowRight, 
  Bookmark, 
  CheckCircle,
  FileCheck,
  KeyRound,
  ShieldAlert,
  AlertTriangle,
  X
} from 'lucide-react';

import { Header } from './components/Header';
import { OfflineBanner } from './components/OfflineBanner';
import { HeroSection } from './components/HeroSection';
import { TripConfigurator } from './components/TripConfigurator';
import { PillarsSection } from './components/PillarsSection';
import { TripCalculatorSection } from './components/TripCalculatorSection';
import { AttractionsSection, Attraction } from './components/AttractionsSection';
import { TripPlannerSection } from './components/TripPlannerSection';
import { CuratedItinerariesSection, PackageItem } from './components/CuratedItinerariesSection';
import { DestinationDiscovery } from './components/DestinationDiscovery';
import { TravelByInterest } from './components/TravelByInterest';
import { HowItWorks } from './components/HowItWorks';
import { ValueTransparency } from './components/ValueTransparency';
import { ConfidenceAccordions } from './components/ConfidenceAccordions';
import { ReviewsSection } from './components/ReviewsSection';
import { GuidebookSection } from './components/GuidebookSection';
import { Footer } from './components/Footer';
import { HostPortal } from './components/HostPortal';
import { PartnerPortal } from './components/partner/PartnerPortal';
import { AdminOperationsPortal } from './components/admin/AdminOperationsPortal';
import { FloatingSOSBeacon } from './components/FloatingSOSBeacon';

import { Step1Transport } from './components/planner/Step1Transport';
import { Step2Stays } from './components/planner/Step2Stays';
import { RentalVehicleStep } from './components/planner/RentalVehicleStep';
import { Step3Driver } from './components/planner/Step3Driver';
import { Step4Itinerary } from './components/planner/Step4Itinerary';
import { Step5Review } from './components/planner/Step5Review';
import { Step6Pass } from './components/planner/Step6Pass';
import { SafarMitraTab } from './components/planner/SafarMitraTab';
import { CustomizeJourneyPage } from './components/planner/CustomizeJourneyPage';

import { StateModal } from './components/modals/StateModal';
import { MyTripsModal } from './components/modals/MyTripsModal';
import { WhatsAppModal } from './components/modals/WhatsAppModal';
import { SOSModal } from './components/modals/SOSModal';
import { RentalVehicleModal } from './components/modals/RentalVehicleModal';
import { AuthModal } from './components/modals/AuthModal';
import { ChangePasswordModal } from './components/modals/ChangePasswordModal';
import { ThemeDestinationsModal, TravelStyleKey } from './components/modals/ThemeDestinationsModal';

import { AppView } from './components/Header';
import { TourOperatorOnboarding } from './components/onboarding/TourOperatorOnboarding';
import { HotelPartnerOnboarding } from './components/onboarding/HotelPartnerOnboarding';
import { HotelPartnerDashboard } from './components/dashboards/HotelPartnerDashboard';
import { HotelAdminPortal } from './components/admin/HotelAdminPortal';
import { TourOperatorDashboard } from './components/dashboards/TourOperatorDashboard';
import { TransportAdminPortal } from './components/admin/TransportAdminPortal';

import { 
  COMPLETE_TOURISM_REGISTRY, 
  getDestinationPackage, 
  generateDynamicTimeline,
  getRentalVehicles
} from './data/destinations';
import { 
  TransportOption, 
  StayOption, 
  DriverOption, 
  BookingRecord, 
  SavedDraft, 
  UserSession, 
  UserRoleCategory,
  HotelPropertyData,
  StateTourism,
  RentalVehicleBooking,
  normalizeUserRole,
  CustomJourneyRecord
} from './types';

export default function App() {
  // Primary Main Scroll Container Ref for Fixed Viewport App Shell
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Navigation & Primary Views
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [editingCustomJourney, setEditingCustomJourney] = useState<CustomJourneyRecord | null>(null);
  const [userHotelProperty, setUserHotelProperty] = useState<HotelPropertyData | null>(null);
  const [hotelActiveTab, setHotelActiveTab] = useState<'overview' | 'rooms' | 'bookings' | 'verification'>('overview');
  const [plannerStep, setPlannerStep] = useState<
    'transport' | 'stays' | 'rental_vehicle' | 'driver' | 'itinerary' | 'review' | 'confirmation' | 'ai-guide'
  >('transport');

  // Trip Configuration State
  const [origin, setOrigin] = useState('Hyderabad');
  const [destinationKey, setDestinationKey] = useState('kerala');
  const [datesText, setDatesText] = useState('Oct 14 - Oct 18, 2026');
  const [calculatedNights, setCalculatedNights] = useState(4);
  const [persona, setPersona] = useState('couple');
  const [activeTags, setActiveTags] = useState<string[]>(['Backwaters & Lakes']);
  const [durationDays, setDurationDays] = useState<5 | 7>(5);

  // Selected Planner Items
  const [selectedTransport, setSelectedTransport] = useState<TransportOption | null>(null);
  const [selectedStay, setSelectedStay] = useState<StayOption | null>(null);
  const [selectedRentalVehicle, setSelectedRentalVehicle] = useState<RentalVehicleBooking | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<DriverOption | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // Disruption Simulator State
  const [activeDisruption, setActiveDisruption] = useState<{
    type: 'transit_delay' | 'weather_alert';
    title: string;
    description: string;
  } | null>(null);

  // Bookings & Storage
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>([]);
  const [activeBookingForPass, setActiveBookingForPass] = useState<BookingRecord | null>(null);
  const [draftSavedFeedback, setDraftSavedFeedback] = useState(false);

  // User & Settings
  const [user, setUser] = useState<UserSession | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // Modals
  const [stateModalData, setStateModalData] = useState<StateTourism | null>(null);
  const [myTripsOpen, setMyTripsOpen] = useState(false);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authRole, setAuthRole] = useState<'traveler' | 'host'>('traveler');
  const [selectedThemeStyle, setSelectedThemeStyle] = useState<TravelStyleKey | null>(null);
  const [rentalVehicleModalOpen, setRentalVehicleModalOpen] = useState(false);
  const [rentalModalTargetBooking, setRentalModalTargetBooking] = useState<BookingRecord | null>(null);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [liveStays, setLiveStays] = useState<StayOption[]>([]);

  // Load destination package based on destinationKey
  const currentPackage = getDestinationPackage(destinationKey);
  const destinationName = currentPackage.name;

  // Fetch approved stays directly from PostgreSQL database strictly filtered by destinationKey
  useEffect(() => {
    fetch(`/api/v1/hotels?destination_key=${encodeURIComponent(destinationKey)}`)
      .then(res => res.ok ? res.json() : [])
      .then(dbHotels => {
        if (Array.isArray(dbHotels) && dbHotels.length > 0) {
          const mapped: StayOption[] = dbHotels.map((h: any) => {
            const tier = (h.propertyType === 'homestay' ? 'homestay' : (h.propertyType === 'resort' || h.propertyType === 'heritage' ? 'heritage' : 'budget')) as any;
            const photos = h.details?.photos || [];
            const photo = photos[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80';
            const city = h.address?.city || '';
            const state = h.address?.state || '';
            const loc = [h.address?.landmark, city, state].filter(Boolean).join(', ') || `${city || 'Kochi'}, ${state || 'Kerala'}`;
            return {
              id: h.id,
              destinationKey: destinationKey,
              name: h.propertyName,
              tier,
              category: h.propertyType === 'homestay' ? 'Verified Rural Homestay (0% Fee)' : (h.propertyType === 'resort' || h.propertyType === 'heritage' ? 'Heritage / Resort' : 'Verified Partner Stay'),
              hostName: h.ownerName || 'Verified YatraSync Host',
              location: loc,
              rating: String(h.rating || 4.85),
              reviews: (h.totalBookings && h.totalBookings > 0) ? h.totalBookings + 12 : 36,
              price: Number(h.details?.baseTariffINR) || 1800,
              image: photo,
              photos: photos.length > 0 ? photos : [photo],
              description: h.details?.description || 'Authentic regional hospitality with curated local cuisine, comfortable heritage rooms, and dedicated local hosts.',
              contactPhone: h.contactPhone || '+91 98460 11223',
              contactEmail: h.contactEmail || 'stay@yatrasync.in',
              addressLine: h.address?.line || loc,
              amenities: h.details?.amenities || ['Wi-Fi', 'Complimentary Breakfast', '24x7 Power Backup'],
              roomCount: h.details?.roomCount || 8,
              features: (h.details?.amenities && h.details.amenities.length > 0) ? h.details.amenities : ['100% Organic Farm-to-Table Breakfast', 'Direct Host Channel Sync Active', '24x7 Power Backup']
            };
          });
          setLiveStays(mapped);
          setSelectedStay(mapped[0]);
        } else {
          setLiveStays([]);
          if (currentPackage.stays && currentPackage.stays.length > 0) {
            setSelectedStay(currentPackage.stays[0]);
          } else {
            setSelectedStay(null);
          }
        }
      })
      .catch(() => {
        setLiveStays([]);
      });
  }, [destinationKey]);

  // Combined available stays with live PostgreSQL properties prioritized
  const allAvailableStays = liveStays.length > 0 ? liveStays : currentPackage.stays;

  // Auto-select defaults when destination package changes
  useEffect(() => {
    if (currentPackage.transports.length > 0) {
      const rec = currentPackage.transports.find(t => t.recommended) || currentPackage.transports[0];
      setSelectedTransport(rec);
    }
    if (allAvailableStays.length > 0) {
      setSelectedStay(allAvailableStays[0]);
    }
    if (currentPackage.storytellerDrivers.length > 0) {
      setSelectedDriver(currentPackage.storytellerDrivers[0]);
    }
    setActiveDisruption(null);
  }, [destinationKey, liveStays.length]);

  // Fetch authenticated user's trips and bookings directly from FastAPI database
  useEffect(() => {
    if (!user) {
      setBookings([]);
      setSavedDrafts([]);
      return;
    }

    const token = localStorage.getItem('safarsetu_token');
    if (!token) {
      setBookings([]);
      setSavedDrafts([]);
      return;
    }

    const authHeaders = {
      'Authorization': `Bearer ${token}`
    };

    // Load confirmed bookings from database
    fetch('/api/v1/bookings', { headers: authHeaders })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          setBookings(data);
        } else {
          setBookings([]);
        }
      })
      .catch(() => {
        setBookings([]);
      });

    // Load saved drafts from database
    fetch('/api/v1/trips', { headers: authHeaders })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          setSavedDrafts(data);
        } else {
          setSavedDrafts([]);
        }
      })
      .catch(() => {
        setSavedDrafts([]);
      });
  }, [user?.id]);

  // RBAC Access Alert State
  const [rbacAlert, setRbacAlert] = useState<{
    title: string;
    message: string;
    type: 'warning' | 'info';
  } | null>(null);

  // Auto-dismiss RBAC alert after 6 seconds
  useEffect(() => {
    if (rbacAlert) {
      const timer = setTimeout(() => {
        setRbacAlert(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [rbacAlert]);

  // Centralized Helper to Resolve Authorized Dashboard View
  const getRoleDashboardView = (role?: UserRoleCategory | null, onboardingStatus?: string): AppView => {
    const canonical = normalizeUserRole(role);
    if (canonical === 'SUPER_ADMIN') {
      return 'admin_ops';
    }
    if (canonical === 'HOTEL_ADMIN') {
      return 'hotel_admin_portal';
    }
    if (canonical === 'HOTEL_OWNER') {
      if (onboardingStatus === 'PENDING') return 'hotel_onboarding';
      return 'hotel_partner_dashboard';
    }
    if (canonical === 'TOUR_OPERATOR') {
      if (onboardingStatus === 'PENDING') return 'tour_operator_onboarding';
      return 'tour_operator_dashboard';
    }
    if (canonical === 'TRANSPORT_ADMIN') {
      if (onboardingStatus === 'PENDING') return 'tour_operator_onboarding';
      return 'transport_admin_portal';
    }
    return 'landing';
  };

  // Strict RBAC View Permissions Validator
  const isViewAuthorized = (view: AppView, currentSession: UserSession | null): boolean => {
    if (!currentSession) {
      return ['landing', 'planner', 'customize_journey'].includes(view);
    }

    const canonicalRole = normalizeUserRole(currentSession.role);

    // Super Admin has master unrestricted access across all portals
    if (canonicalRole === 'SUPER_ADMIN') return true;

    // Hotel Admin: strictly restricted to Hotel Admin Portal and Read-Only Landing preview
    if (canonicalRole === 'HOTEL_ADMIN') {
      return ['hotel_admin_portal', 'landing'].includes(view);
    }

    // Hotel Owner: strictly restricted to Hotel Dashboard, Hotel Onboarding, and Read-Only Landing preview
    if (canonicalRole === 'HOTEL_OWNER') {
      return ['hotel_partner_dashboard', 'hotel_onboarding', 'landing'].includes(view);
    }

    // Tour Operator: strictly restricted to Tour Operator Dashboard, Onboarding, and Read-Only Landing preview
    if (canonicalRole === 'TOUR_OPERATOR') {
      return ['tour_operator_dashboard', 'tour_operator_onboarding', 'landing'].includes(view);
    }

    // Transport Admin: strictly restricted to Transport Admin Portal, Partner Portal, and Read-Only Landing preview
    if (canonicalRole === 'TRANSPORT_ADMIN') {
      return ['transport_admin_portal', 'partner', 'tour_operator_onboarding', 'landing'].includes(view);
    }

    // Customer / Traveler: can access public landing, trip planner & custom journey
    if (canonicalRole === 'CUSTOMER') {
      return ['landing', 'planner', 'customize_journey'].includes(view);
    }

    return false;
  };

  // Safe Navigation Handler with Strict RBAC Guard
  const handleNavigate = (targetView: AppView) => {
    if (targetView === 'customize_journey') {
      setEditingCustomJourney(null);
    }
    if (isViewAuthorized(targetView, user)) {
      setCurrentView(targetView);
      setRbacAlert(null);
      scrollToTop();
      return;
    }

    const canonicalRole = normalizeUserRole(user?.role);

    // Unauthorized Navigation Handling: Unauthenticated Guest
    if (!user) {
      if (targetView === 'hotel_partner_dashboard' || targetView === 'operator' || targetView === 'hotel_onboarding') {
        setAuthRole('hotel_partner' as any);
        setAuthModalOpen(true);
      } else if (targetView === 'tour_operator_dashboard') {
        setAuthRole('tour_operator' as any);
        setAuthModalOpen(true);
      } else if (targetView === 'transport_admin_portal' || targetView === 'partner' || targetView === 'tour_operator_onboarding') {
        setAuthRole('tour_operator' as any);
        setAuthModalOpen(true);
      } else if (targetView === 'admin_ops') {
        setAuthRole('partner' as any);
        setAuthModalOpen(true);
      }
      setRbacAlert({
        title: 'Authentication Required',
        message: 'Access to operational partner portals and control desks requires verified partner credentials. Please sign in or register.',
        type: 'info'
      });
      return;
    }

    // User is logged in but lacks the required RBAC role
    let explanation = '';
    if (canonicalRole === 'CUSTOMER') {
      explanation = `Access Restricted: You are currently signed in as Traveler (${user.name}). Operational desks (Hotel Management, Tour Operator desk, Transport Dispatch & Admin Ops) require an authorized Partner or Admin account. Switch accounts if you manage a property or fleet.`;
    } else if (canonicalRole === 'HOTEL_OWNER' || canonicalRole === 'HOTEL_ADMIN') {
      explanation = `Access Restricted: Your account (${user.name}) is registered as ${canonicalRole === 'HOTEL_OWNER' ? 'Hotel Owner' : 'Hotel Admin'}. You only have administrative access to Hotel & Homestay properties. Tour Packages, Fleet Management, and Dispatch Controls are restricted to Tour Operators, Transport Partners, and Super Admins.`;
    } else if (canonicalRole === 'TOUR_OPERATOR') {
      explanation = `Access Restricted: Your account (${user.name}) is registered as Tour Operator. You only have access to Tour Packages, Day-Wise Itineraries, and Storyteller Guides. Vehicle Fleet Maintenance and Transport Dispatch are restricted to Transport Admins.`;
    } else if (canonicalRole === 'TRANSPORT_ADMIN') {
      explanation = `Access Restricted: Your account (${user.name}) is registered as Transport Partner. You only have access to Driver, Vehicle & Fleet operations. Tour Package Creation and Hotel Administration are restricted to Tour Operators and Hotel Owners.`;
    } else {
      explanation = `Access Restricted: Your account (${user.name}) is registered as Traveler. Access to operational control desks requires verified partner credentials.`;
    }

    setRbacAlert({
      title: 'Partner Portal Access Restricted',
      message: explanation,
      type: 'warning'
    });
  };

  // Restore and validate persistent user session on app launch
  useEffect(() => {
    const token = localStorage.getItem('safarsetu_token');
    if (!token) {
      localStorage.removeItem('safarsetu_user');
      setUser(null);
      return;
    }

    // Verify token with backend database
    fetch('/api/v1/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Session expired or invalid');
        }
        const dbUser = await res.json();
        
        const sessionRole: UserRoleCategory = normalizeUserRole(dbUser.role);

        const session: UserSession = {
          id: dbUser.id,
          name: dbUser.name,
          phone: dbUser.phone || dbUser.mobile,
          email: dbUser.email,
          role: sessionRole,
          operatorSubRole: dbUser.operatorSubRole,
          partnerId: dbUser.partnerId,
          hotelPropertyId: dbUser.hotelPropertyId,
          onboardingStatus: 'COMPLETED',
          verificationStatus: 'VERIFIED'
        };

        setUser(session);
        localStorage.setItem('safarsetu_user', JSON.stringify(session));

        // Automatically place user in their authorized dashboard
        const targetView = getRoleDashboardView(sessionRole, session.onboardingStatus);
        setCurrentView(targetView);
      })
      .catch((err) => {
        console.warn("Session validation failed:", err);
        localStorage.removeItem('safarsetu_token');
        localStorage.removeItem('safarsetu_user');
        setUser(null);
        setCurrentView('landing');
      });
  }, []);

  // Sync view when user role changes or logs in/out
  useEffect(() => {
    if (user && !isViewAuthorized(currentView, user)) {
      const targetView = getRoleDashboardView(user.role, user.onboardingStatus);
      setCurrentView(targetView);
    }
  }, [user]);

  // Compute guests count
  const guestsCount = persona === 'family' ? 4 : persona === 'couple' ? 2 : 1;

  // Dynamic timeline
  const timeline = generateDynamicTimeline(destinationKey, durationDays, datesText);

  // Scroll to top helper on the primary main scroll container
  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Scroll to element helper inside the main scroll container
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Passion tag toggle
  const togglePassionTag = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Switch destination from Dossier or styles
  const handleOpenDossier = (stateId: string) => {
    const found = COMPLETE_TOURISM_REGISTRY[stateId];
    if (found) {
      setStateModalData(found);
    }
  };

  const handlePlanTripAroundState = (stateId: string) => {
    setDestinationKey(stateId);
    setCurrentView('planner');
    setPlannerStep('transport');
    scrollToTop();
  };

  const handleSelectStyle = (style: TravelStyleKey) => {
    setSelectedThemeStyle(style);
  };

  // Save Draft
  const handleSaveDraft = async () => {
    const token = localStorage.getItem('safarsetu_token');
    const draft: SavedDraft = {
      id: 'draft-' + Date.now(),
      origin,
      destinationKey,
      destinationName,
      dates: datesText,
      nights: calculatedNights,
      persona,
      durationDays,
      transportId: selectedTransport?.id,
      stayId: selectedStay?.id,
      driverId: selectedDriver?.id,
      updatedAt: 'Just now'
    };

    setDraftSavedFeedback(true);
    setTimeout(() => setDraftSavedFeedback(false), 3000);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch('/api/v1/trips/save', {
        method: 'POST',
        headers,
        body: JSON.stringify(draft)
      });
      if (res.ok) {
        const saved = await res.json();
        const savedItem = saved.trip || draft;
        setSavedDrafts(prev => [savedItem, ...prev]);
      } else {
        setSavedDrafts(prev => [draft, ...prev]);
      }
    } catch (e) {
      setSavedDrafts(prev => [draft, ...prev]);
    }
  };

  // Load Saved Draft
  const handleLoadDraft = (draft: SavedDraft) => {
    setOrigin(draft.origin);
    setDestinationKey(draft.destinationKey);
    setDatesText(draft.dates);
    setCalculatedNights(draft.nights);
    setPersona(draft.persona);
    setDurationDays(draft.durationDays);
    setCurrentView('planner');
    setPlannerStep('transport');
  };

  // Disruption Handlers
  const handleTriggerDisruption = (type: 'transit_delay' | 'weather_alert') => {
    if (type === 'transit_delay') {
      setActiveDisruption({
        type: 'transit_delay',
        title: 'Inbound Train Delayed by 3 Hours (Fog/Signal Clearance)',
        description: `Your express service to ${destinationName} is delayed. YatraSync has verified your homestay host will keep late check-in open with zero penalty, and your storyteller driver will arrive at the new ETA.`
      });
    } else {
      setActiveDisruption({
        type: 'weather_alert',
        title: 'Mountain Pass Weather Reroute Activated',
        description: `Local district road safety authority has flagged high-altitude fog. Your certified storyteller chauffeur has shifted route to a scenic lower valley corridor.`
      });
    }
    setWhatsAppModalOpen(true);
  };

  const handleResetDisruption = () => {
    setActiveDisruption(null);
  };

  // Attach rental vehicle to an active/confirmed booking pass
  const handleAttachRentalVehicleToBooking = (bookingId: string, vehicleBooking: RentalVehicleBooking) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        const numericPrev = b.numericTotal || parseInt(b.totalCost.replace(/[^0-9]/g, '')) || 0;
        const newTotal = numericPrev + vehicleBooking.totalCost;
        const updated: BookingRecord = {
          ...b,
          rentalVehicle: vehicleBooking,
          totalCost: `₹${newTotal.toLocaleString('en-IN')}`,
          numericTotal: newTotal
        };
        if (activeBookingForPass?.id === bookingId) {
          setActiveBookingForPass(updated);
        }
        return updated;
      }
      return b;
    }));
  };

  // Confirm Booking
  const handleConfirmBooking = async () => {
    const transportCost = selectedTransport ? selectedTransport.price * guestsCount : 0;
    const stayCost = selectedStay ? selectedStay.price * calculatedNights : 0;
    const driverCost = selectedDriver ? selectedDriver.fixedFullTripPrice : 0;
    const rentalVehicleCost = selectedRentalVehicle ? selectedRentalVehicle.totalCost : 0;
    const totalCostNumber = transportCost + stayCost + driverCost + rentalVehicleCost;

    const token = localStorage.getItem('safarsetu_token');

    const finalDestName = editingCustomJourney && editingCustomJourney.destinations?.length > 1
      ? editingCustomJourney.destinations.map(d => d.destinationName).join(' ➔ ')
      : destinationName;

    const newBooking: BookingRecord = {
      id: `SS-${destinationKey.slice(0, 3).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      pnr: `IRCTC-${Math.floor(10000 + Math.random() * 90000)}-IN`,
      origin,
      destinationKey,
      destinationName: finalDestName,
      dates: datesText,
      guests: guestsCount,
      nights: calculatedNights,
      transport: selectedTransport ? selectedTransport.title : 'Self Arranged',
      stay: selectedStay ? selectedStay.name : 'Homestay',
      driver: selectedDriver ? `${selectedDriver.name} (${selectedDriver.role})` : 'Assigned Chauffeur',
      rentalVehicle: selectedRentalVehicle,
      totalCost: `₹${totalCostNumber.toLocaleString('en-IN')}`,
      numericTotal: totalCostNumber,
      status: 'Confirmed',
      paymentMethod,
      timestamp: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers,
        body: JSON.stringify(newBooking)
      });
      if (res.ok) {
        const saved = await res.json();
        const savedBooking = saved.booking || newBooking;
        setBookings(prev => [savedBooking, ...prev]);
        setActiveBookingForPass(savedBooking);
      } else {
        setBookings(prev => [newBooking, ...prev]);
        setActiveBookingForPass(newBooking);
      }
    } catch (e) {
      setBookings(prev => [newBooking, ...prev]);
      setActiveBookingForPass(newBooking);
    }

    setPlannerStep('confirmation');
    scrollToTop();
  };

  // Cancel Booking
  const handleCancelBooking = async (id: string) => {
    const token = localStorage.getItem('safarsetu_token');
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      await fetch(`/api/v1/bookings/${id}/cancel`, { method: 'POST', headers });
    } catch (e) {
      // Handled
    }
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'Cancelled' } : b))
    );
  };

  return (
    <div className="app-shell min-h-screen h-screen h-[100dvh] bg-[#faf8f5] text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white overflow-hidden">
      
      {/* Offline Alert Banner */}
      <div className="shrink-0">
        <OfflineBanner
          isOffline={isOffline}
          onToggleOffline={() => setIsOffline(!isOffline)}
        />
      </div>

      {/* Global Navigation Header (Fixed Area Inside Shell) */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenMyTrips={() => setMyTripsOpen(true)}
        onOpenSafarMitra={() => {
          setCurrentView('planner');
          setPlannerStep('ai-guide');
          scrollToTop();
        }}
        onScrollTo={scrollToSection}
        isOffline={isOffline}
        onToggleOffline={() => setIsOffline(!isOffline)}
        onOpenAuth={() => {
          setAuthRole('traveler');
          setAuthModalOpen(true);
        }}
        onOpenHostAuth={() => {
          setAuthRole('host');
          setAuthModalOpen(true);
        }}
        user={user}
        onLogout={() => {
          localStorage.removeItem('safarsetu_token');
          localStorage.removeItem('safarsetu_user');
          setUser(null);
          setBookings([]);
          setSavedDrafts([]);
          setCurrentView('landing');
          setPlannerStep('transport');
          setActiveBookingForPass(null);
          setMyTripsOpen(false);
          setAuthModalOpen(false);
          setSosModalOpen(false);
          setChangePasswordModalOpen(false);
          setRentalVehicleModalOpen(false);
          setRbacAlert(null);
          scrollToTop();
        }}
        savedTripsCount={user ? (bookings.length + savedDrafts.length) : 0}
        onTriggerSOS={() => setSosModalOpen(true)}
        selectedLanguage={selectedLanguage}
        onChangeLanguage={(lang) => setSelectedLanguage(lang)}
        hotelActiveTab={hotelActiveTab}
        onSelectHotelTab={(tab) => {
          setHotelActiveTab(tab);
          setCurrentView('hotel_partner_dashboard');
        }}
        onOpenChangePassword={() => setChangePasswordModalOpen(true)}
      />

      {/* RBAC Restriction Sleek Floating Toast Notification */}
      {rbacAlert && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-top-3 duration-200">
          <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-md text-left ${
            rbacAlert.type === 'warning' 
              ? 'bg-amber-50/98 border-amber-300/90 text-amber-950 shadow-amber-950/10' 
              : 'bg-blue-50/98 border-blue-300/90 text-blue-950 shadow-blue-950/10'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  rbacAlert.type === 'warning' ? 'bg-amber-200 text-amber-900' : 'bg-blue-200 text-blue-900'
                }`}>
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <span className="font-extrabold text-xs uppercase tracking-wider block text-slate-950">{rbacAlert.title}</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{rbacAlert.message}</p>
                  
                  {/* Interactive Redirection & Switch Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        setRbacAlert(null);
                        setAuthModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      <span>Switch Account</span>
                    </button>
                    
                    <button
                      onClick={() => setRbacAlert(null)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-medium transition cursor-pointer"
                    >
                      <span>Dismiss</span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setRbacAlert(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200/50 transition shrink-0 cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hotel Admin / Owner Preview Banner */}
      {currentView === 'landing' && (user?.role === 'hotel_owner' || user?.role === 'hotel_partner' || user?.role === 'host') && (
        <div className="shrink-0 bg-blue-900 text-white px-4 py-2.5 text-xs text-center flex items-center justify-center gap-3 font-medium">
          <span>Viewing public traveler site in <strong>{user.role === 'hotel_owner' ? 'Hotel Owner' : 'Hotel Admin'} Mode</strong> ({user.name})</span>
          <button
            onClick={() => setCurrentView('hotel_partner_dashboard')}
            className="px-3 py-1 bg-white text-blue-950 font-bold rounded-lg hover:bg-blue-50 transition shadow-2xs cursor-pointer text-[11px]"
          >
            Return to Hotel Dashboard
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* PRIMARY MAIN SCROLL CONTAINER                                */}
      {/* ============================================================ */}
      <div 
        id="main-scroll-container" 
        ref={scrollContainerRef} 
        className="main-scroll-container flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col"
      >
        {/* MAIN VIEW SWITCHER */}
        <main className="flex-1 pb-16">
          
          {/* ============================================================ */}
          {/* VIEW 1: HOMEPAGE / LANDING VIEW                             */}
          {/* ============================================================ */}
          {currentView === 'landing' && (
            <div className="space-y-16 sm:space-y-24">
              
              {/* Hero Section with Reference Window Design & Animated Tourist Spots */}
              <HeroSection
                onPlanTripClick={() => {
                  setCurrentView('planner');
                  setPlannerStep('transport');
                  scrollToTop();
                }}
                onCustomizeJourneyClick={() => {
                  setEditingCustomJourney(null);
                  setCurrentView('customize_journey');
                  scrollToTop();
                }}
                onExploreClick={() => scrollToSection('destination-discovery')}
                origin={origin}
                onOriginChange={(val) => setOrigin(val)}
                destination={destinationKey}
                onDestinationChange={(val) => setDestinationKey(val)}
                datesText={datesText}
                onDatesChange={(val) => setDatesText(val)}
                calculatedNights={calculatedNights}
                persona={persona}
                onPersonaChange={(val) => setPersona(val)}
                onBuildTrip={() => {
                  setCurrentView('planner');
                  setPlannerStep('transport');
                  scrollToTop();
                }}
                activeTags={activeTags}
                onToggleTag={togglePassionTag}
              />

            {/* 5 Core Value Pillars */}
            <PillarsSection />

            {/* Interactive Multimodal Savings Calculator */}
            <TripCalculatorSection
              onBuildTrip={() => {
                setCurrentView('planner');
                setPlannerStep('transport');
                scrollToTop();
              }}
              onDownloadPDF={(title) => {
                if (bookings.length > 0) {
                  setActiveBookingForPass(bookings[0]);
                }
                setMyTripsOpen(true);
              }}
            />

            {/* 120+ Top Attractions Grid with Category Filter & Search */}
            <AttractionsSection
              onSelectAttraction={(attr) => {
                const foundState = Object.keys(COMPLETE_TOURISM_REGISTRY).find(
                  key => COMPLETE_TOURISM_REGISTRY[key].name.toLowerCase() === attr.state.toLowerCase()
                ) || 'kerala';
                handleOpenDossier(foundState);
              }}
            />

            {/* Smart Custom Multimodal Pass Builder */}
            <TripPlannerSection
              onGeneratePlan={(plan) => {
                setDurationDays(plan.durationDays as 5 | 7);
                setCurrentView('planner');
                setPlannerStep('transport');
                scrollToTop();
              }}
            />

            {/* Curated Multimodal Package Circuits */}
            <CuratedItinerariesSection
              onSelectPackage={(pkg) => {
                setDestinationKey(pkg.destinationKey);
                setCurrentView('planner');
                setPlannerStep('transport');
                scrollToTop();
              }}
            />

            {/* Curated Destination Dossiers Explorer */}
            <DestinationDiscovery
              onOpenDossier={handleOpenDossier}
              onPlanTripAroundState={handlePlanTripAroundState}
            />

            {/* Travel by Interest */}
            <TravelByInterest onSelectStyle={handleSelectStyle} />

            {/* How It Works (Multimodal Architecture) */}
            <HowItWorks />

            {/* Value & Cost Transparency Card */}
            <ValueTransparency
              onConfigureClick={() => {
                setCurrentView('planner');
                setPlannerStep('transport');
                scrollToTop();
              }}
            />

            {/* Buy With Confidence Accordions */}
            <ConfidenceAccordions />

            {/* Verified Customer Reviews */}
            <ReviewsSection />

            {/* Free Destination Guidebook Request */}
            <GuidebookSection />

          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 1B: CUSTOMIZE MY JOURNEY BUILDER (NEW ADDITIVE FEATURE) */}
        {/* ============================================================ */}
        {currentView === 'customize_journey' && (
          <CustomizeJourneyPage
            user={user}
            onOpenAuth={() => {
              setAuthRole('traveler');
              setAuthModalOpen(true);
            }}
            onBackToHome={() => setCurrentView('landing')}
            initialJourney={editingCustomJourney}
            onSaveFeedback={(msg) => {
              setDraftSavedFeedback(true);
              setTimeout(() => setDraftSavedFeedback(false), 3000);
            }}
            onProceedToBooking={(journey) => {
              const firstDest = journey.destinations[0];
              const destKey = firstDest?.destinationKey || 'shimla';
              const totalGuests = (journey.adultsCount || 2) + (journey.childrenCount || 0);

              // Set trip configuration from custom journey
              setOrigin(journey.startLocation || 'Hyderabad');
              setDestinationKey(destKey);
              setDatesText(`${journey.startDate} - ${journey.endDate}`);
              setCalculatedNights(journey.totalNights || 1);
              setPersona(totalGuests >= 3 ? 'family' : totalGuests === 2 ? 'couple' : 'solo');
              setEditingCustomJourney(journey);

              // Reset/initialize selections so user can sequentially configure/confirm each step
              setSelectedTransport(null);
              setSelectedStay(null);
              setSelectedDriver(null);
              setSelectedRentalVehicle(null);

              // Start the sequential booking & selection workflow (Step 1: Transport)
              setCurrentView('planner');
              setPlannerStep('transport');
              scrollToTop();
            }}
          />
        )}

        {/* ============================================================ */}
        {/* VIEW 2: UNIFIED TRIP PLANNER WORKSPACE                      */}
        {/* ============================================================ */}
        {currentView === 'planner' && (
          <div id="planner-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
            
            {/* Planner Top Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-subtle-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-xs">
                  <Compass className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700">
                      Destination Workspace
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                      Strict Data Isolation
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-950">
                      Journey to {destinationName}
                    </h2>
                    
                    {/* Destination Switcher */}
                    <div className="relative">
                      <select
                        value={destinationKey}
                        onChange={(e) => setDestinationKey(e.target.value)}
                        className="text-xs font-bold text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-2 py-1 cursor-pointer focus:outline-none"
                      >
                        {Object.values(COMPLETE_TOURISM_REGISTRY).map(st => (
                          <option key={st.id} value={st.id}>
                            Change to {st.name} ({st.capital})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Save Draft */}
              <div className="flex items-center gap-2.5">
                <button
                  id="save-draft-btn"
                  onClick={handleSaveDraft}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-800 transition flex items-center gap-1.5 shadow-xs"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save Draft</span>
                </button>
                {draftSavedFeedback && (
                  <span className="text-xs font-bold text-emerald-700 animate-fade-in flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </span>
                )}
              </div>
            </div>

            {/* 6-Step Sequential Progress Indicator Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-subtle-card overflow-x-auto scrollbar-none">
              <div className="flex items-center justify-between min-w-[700px] text-xs font-bold">
                
                {/* Step 1 */}
                <button
                  id="tab-transport-btn"
                  onClick={() => setPlannerStep('transport')}
                  className={`flex-1 py-3 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                    plannerStep === 'transport'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : selectedTransport
                      ? 'text-slate-900 hover:bg-slate-100'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span>1. Transport</span>
                  {selectedTransport && plannerStep !== 'transport' && (
                    <Check className="w-3 h-3 text-emerald-600 ml-1" />
                  )}
                </button>

                {/* Step 2 */}
                <button
                  id="tab-stays-btn"
                  onClick={() => setPlannerStep('stays')}
                  className={`flex-1 py-3 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                    plannerStep === 'stays'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : selectedStay
                      ? 'text-slate-900 hover:bg-slate-100'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>2. Stays</span>
                  {selectedStay && plannerStep !== 'stays' && (
                    <Check className="w-3 h-3 text-emerald-600 ml-1" />
                  )}
                </button>

                {/* Step 3: Rental Vehicles */}
                <button
                  id="tab-rental-vehicles-btn"
                  onClick={() => setPlannerStep('rental_vehicle')}
                  className={`flex-1 py-3 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                    plannerStep === 'rental_vehicle'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : selectedRentalVehicle
                      ? 'text-slate-900 hover:bg-slate-100'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5 text-orange-400" />
                  <span>3. Rentals</span>
                  {selectedRentalVehicle && plannerStep !== 'rental_vehicle' && (
                    <Check className="w-3 h-3 text-emerald-600 ml-1" />
                  )}
                </button>

                {/* Step 4 */}
                <button
                  id="tab-driver-btn"
                  onClick={() => setPlannerStep('driver')}
                  className={`flex-1 py-3 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                    plannerStep === 'driver'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : selectedDriver
                      ? 'text-slate-900 hover:bg-slate-100'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>4. Driver</span>
                  {selectedDriver && plannerStep !== 'driver' && (
                    <Check className="w-3 h-3 text-emerald-600 ml-1" />
                  )}
                </button>

                {/* Step 4 */}
                <button
                  id="tab-itinerary-btn"
                  onClick={() => setPlannerStep('itinerary')}
                  className={`flex-1 py-3 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                    plannerStep === 'itinerary'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>4. Itinerary ({durationDays}D)</span>
                </button>

                {/* Step 5 */}
                <button
                  id="tab-review-btn"
                  onClick={() => setPlannerStep('review')}
                  className={`flex-1 py-3 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                    plannerStep === 'review'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>5. Review</span>
                </button>

                {/* Step 6 */}
                <button
                  id="tab-confirmation-btn"
                  onClick={() => setPlannerStep('confirmation')}
                  className={`flex-1 py-3 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                    plannerStep === 'confirmation'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>6. Pass</span>
                </button>

                {/* SafarMitra AI Tab */}
                <button
                  id="tab-ai-companion-btn"
                  onClick={() => setPlannerStep('ai-guide')}
                  className={`py-3 px-4 rounded-xl transition flex items-center justify-center gap-1.5 ml-2 ${
                    plannerStep === 'ai-guide'
                      ? 'bg-orange-600 text-white shadow-xs font-black'
                      : 'bg-orange-100 text-orange-950 hover:bg-orange-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>SafarMitra AI</span>
                </button>

              </div>
            </div>

            {/* PLANNER STEP CONTENTS */}
            <div className="pt-2">
              
              {/* STEP 1: TRANSPORT */}
              {plannerStep === 'transport' && (
                <div className="space-y-4">
                  <Step1Transport
                    transports={currentPackage.transports}
                    selectedTransport={selectedTransport}
                    onSelectTransport={(t) => {
                      setSelectedTransport(t);
                      setPlannerStep('stays');
                    }}
                    origin={origin}
                    destinationName={destinationName}
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => setPlannerStep('stays')}
                      className="px-6 py-3 bg-slate-900 hover:bg-orange-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition"
                    >
                      <span>Proceed to Stays</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: STAYS */}
              {plannerStep === 'stays' && (
                <div className="space-y-4">
                  <Step2Stays
                    stays={allAvailableStays}
                    selectedStay={selectedStay}
                    onSelectStay={(s) => {
                      setSelectedStay(s);
                      setPlannerStep('rental_vehicle');
                    }}
                    destinationName={destinationName}
                  />
                  <div className="flex justify-between">
                    <button
                      onClick={() => setPlannerStep('transport')}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
                    >
                      Back to Transport
                    </button>
                    <button
                      onClick={() => setPlannerStep('rental_vehicle')}
                      className="px-6 py-3 bg-slate-900 hover:bg-orange-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition"
                    >
                      <span>Proceed to Rental Vehicles</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: RENTAL VEHICLES (OPTIONAL) */}
              {plannerStep === 'rental_vehicle' && (
                <div className="space-y-4">
                  <RentalVehicleStep
                    vehicles={currentPackage.rentalVehicles || getRentalVehicles(destinationKey)}
                    tripDays={durationDays}
                    startDate={datesText.split(' - ')[0] || 'Day 1'}
                    endDate={datesText.split(' - ')[1] || 'End Day'}
                    destinationName={destinationName}
                    selectedRentalVehicle={selectedRentalVehicle}
                    onSelectRentalVehicle={(v) => setSelectedRentalVehicle(v)}
                  />
                  <div className="flex justify-between">
                    <button
                      onClick={() => setPlannerStep('stays')}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
                    >
                      Back to Stays
                    </button>
                    <button
                      onClick={() => setPlannerStep('driver')}
                      className="px-6 py-3 bg-slate-900 hover:bg-orange-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition"
                    >
                      <span>Proceed to Storyteller Driver</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: STORYTELLER DRIVER */}
              {plannerStep === 'driver' && (
                <div className="space-y-4">
                  <Step3Driver
                    drivers={currentPackage.storytellerDrivers}
                    selectedDriver={selectedDriver}
                    onSelectDriver={(d) => {
                      setSelectedDriver(d);
                      setPlannerStep('itinerary');
                    }}
                    localTransit={currentPackage.localTransit}
                  />
                  <div className="flex justify-between">
                    <button
                      onClick={() => setPlannerStep('rental_vehicle')}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
                    >
                      Back to Rentals
                    </button>
                    <button
                      onClick={() => setPlannerStep('itinerary')}
                      className="px-6 py-3 bg-slate-900 hover:bg-orange-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition"
                    >
                      <span>Proceed to Itinerary</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: ITINERARY (5D / 7D) */}
              {plannerStep === 'itinerary' && (
                <div className="space-y-4">
                  <Step4Itinerary
                    timeline={timeline}
                    durationDays={durationDays}
                    onChangeDuration={(d) => setDurationDays(d)}
                    tripId={`SS-${destinationKey.slice(0, 3).toUpperCase()}-2026-PLAN`}
                    onTriggerDisruption={handleTriggerDisruption}
                    activeDisruption={activeDisruption}
                    onResetDisruption={handleResetDisruption}
                    onPreviewWhatsApp={() => setWhatsAppModalOpen(true)}
                    onApplyReplan={() => {
                      setActiveDisruption(null);
                      setWhatsAppModalOpen(false);
                    }}
                    onProceedToReview={() => setPlannerStep('review')}
                  />
                </div>
              )}

              {/* STEP 5: REVIEW */}
              {plannerStep === 'review' && (
                <div className="space-y-4">
                  <Step5Review
                    origin={origin}
                    destinationName={destinationName}
                    datesText={datesText}
                    nights={calculatedNights}
                    guests={guestsCount}
                    transport={selectedTransport}
                    stay={selectedStay}
                    driver={selectedDriver}
                    rentalVehicle={selectedRentalVehicle}
                    paymentMethod={paymentMethod}
                    onPaymentMethodChange={(val) => setPaymentMethod(val)}
                    onConfirmBooking={handleConfirmBooking}
                    onGoToStep={(s) => setPlannerStep(s)}
                  />
                </div>
              )}

              {/* STEP 6: CONFIRMATION PASS */}
              {plannerStep === 'confirmation' && (
                <div className="space-y-4">
                  <Step6Pass
                    booking={activeBookingForPass}
                    onOpenMyTrips={() => setMyTripsOpen(true)}
                    onViewTimeline={() => setPlannerStep('itinerary')}
                    onOpenRentalModal={(b) => {
                      setRentalModalTargetBooking(b);
                      setRentalVehicleModalOpen(true);
                    }}
                  />
                </div>
              )}

              {/* SPECIAL TAB: SAFARMITRA AI */}
              {plannerStep === 'ai-guide' && (
                <div className="space-y-4">
                  <SafarMitraTab
                    destinationKey={destinationKey}
                    destinationName={destinationName}
                    gems={currentPackage.hiddenGems}
                    eats={currentPackage.iconicEats}
                    selectedLanguage={selectedLanguage}
                    currentTripState={{
                      origin,
                      destinationName,
                      dates: datesText,
                      nights: calculatedNights,
                      transport: selectedTransport?.title,
                      stay: selectedStay?.name,
                      driver: selectedDriver?.name
                    }}
                  />
                </div>
              )}

            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 3: HOST & OPERATOR ZERO COMMISSION PORTAL              */}
        {/* ============================================================ */}
        {currentView === 'operator' && (
          <HostPortal
            user={user}
            currentStays={currentPackage.stays}
            onBackToApp={() => setCurrentView('landing')}
          />
        )}

        {/* ============================================================ */}
        {/* VIEW 4: DRIVER & STORYTELLER PARTNER OPERATIONS PORTAL      */}
        {/* ============================================================ */}
        {currentView === 'partner' && (
          <PartnerPortal
            user={user}
            onExitPortal={() => setCurrentView('landing')}
          />
        )}

        {/* ============================================================ */}
        {/* VIEW 5: CENTRALIZED OPERATIONS & DISPATCH CONTROL DESK      */}
        {/* ============================================================ */}
        {currentView === 'admin_ops' && (
          <AdminOperationsPortal
            user={user}
            onExit={() => setCurrentView('landing')}
          />
        )}

        {/* ============================================================ */}
        {/* VIEW 6: TOUR OPERATOR ONBOARDING WORKSPACE                  */}
        {/* ============================================================ */}
        {currentView === 'tour_operator_onboarding' && user && (
          <TourOperatorOnboarding
            user={user}
            onComplete={(updatedSession) => {
              setUser(updatedSession);
              setCurrentView('partner');
            }}
            onCancel={() => setCurrentView('landing')}
          />
        )}

        {/* ============================================================ */}
        {/* VIEW 7: HOTEL PARTNER ONBOARDING WORKSPACE                  */}
        {/* ============================================================ */}
        {currentView === 'hotel_onboarding' && user && (
          <HotelPartnerOnboarding
            user={user}
            onComplete={(updatedSession, property) => {
              setUser(updatedSession);
              setUserHotelProperty(property);
              setCurrentView('hotel_partner_dashboard');
            }}
            onCancel={() => setCurrentView('landing')}
          />
        )}

        {/* ============================================================ */}
        {/* VIEW 8: HOTEL PARTNER DASHBOARD                             */}
        {/* ============================================================ */}
        {currentView === 'hotel_partner_dashboard' && user && (
          <HotelPartnerDashboard
            user={user}
            property={userHotelProperty}
            onNavigate={(v) => handleNavigate(v)}
            activeTab={hotelActiveTab}
            onSelectTab={(t) => setHotelActiveTab(t)}
          />
        )}

        {/* ============================================================ */}
        {/* VIEW 9: PLATFORM HOTEL ADMIN PORTAL                         */}
        {/* ============================================================ */}
        {currentView === 'hotel_admin_portal' && user && (
          <HotelAdminPortal
            user={user}
            onNavigate={(v) => handleNavigate(v)}
          />
        )}

        {/* ============================================================ */}
        {/* VIEW 10: TOUR OPERATOR PRODUCT & ITINERARY DASHBOARD        */}
        {/* ============================================================ */}
        {currentView === 'tour_operator_dashboard' && user && (
          <TourOperatorDashboard
            user={user}
            onNavigate={(v) => handleNavigate(v)}
          />
        )}

        {/* ============================================================ */}
        {/* VIEW 11: TRANSPORT ADMIN FLEET & DISPATCH PORTAL            */}
        {/* ============================================================ */}
        {currentView === 'transport_admin_portal' && user && (
          <TransportAdminPortal
            user={user}
            onNavigate={(v) => handleNavigate(v)}
          />
        )}

      </main>

      {/* Floating Tourist SOS Emergency Beacon */}
      <FloatingSOSBeacon onTriggerSOS={() => setSosModalOpen(true)} />

        {/* Global Footer */}
        <Footer
          onNavigate={(v) => {
            setCurrentView(v);
            scrollToTop();
          }}
          onOpenMyTrips={() => setMyTripsOpen(true)}
          onTriggerSOS={() => setSosModalOpen(true)}
          onToggleOffline={() => setIsOffline(!isOffline)}
          onScrollTo={scrollToSection}
        />
      </div>

      {/* ============================================================ */}
      {/* INTERACTIVE MODALS                                           */}
      {/* ============================================================ */}

      {/* 1. State Tourism Dossier Modal (5 Detailed Tabs) */}
      <StateModal
        stateData={stateModalData}
        onClose={() => setStateModalData(null)}
        onPlanTripAroundState={handlePlanTripAroundState}
      />

      {/* 2. My Trips & Saved Drafts Drawer Modal */}
      <MyTripsModal
        isOpen={myTripsOpen}
        onClose={() => setMyTripsOpen(false)}
        bookings={bookings}
        savedDrafts={savedDrafts}
        user={user}
        onOpenAuth={() => {
          setAuthRole('traveler');
          setAuthModalOpen(true);
        }}
        onCancelBooking={handleCancelBooking}
        onLoadDraft={handleLoadDraft}
        onLoadCustomJourney={(j) => {
          setEditingCustomJourney(j);
          setCurrentView('customize_journey');
        }}
        onSelectBookingForPass={(b) => {
          setActiveBookingForPass(b);
          setCurrentView('planner');
          setPlannerStep('confirmation');
        }}
        onOpenRentalModal={(b) => {
          setRentalModalTargetBooking(b);
          setRentalVehicleModalOpen(true);
        }}
      />

      {/* 2b. Rental Vehicle On-Demand Modal for Active Trips */}
      {rentalModalTargetBooking && (
        <RentalVehicleModal
          isOpen={rentalVehicleModalOpen}
          onClose={() => setRentalVehicleModalOpen(false)}
          booking={rentalModalTargetBooking}
          onAttachVehicle={handleAttachRentalVehicleToBooking}
        />
      )}

      {/* 3. WhatsApp Autonomous Replan Notification Modal */}
      <WhatsAppModal
        isOpen={whatsAppModalOpen}
        onClose={() => setWhatsAppModalOpen(false)}
        destinationName={destinationName}
        onConfirmReplan={() => setActiveDisruption(null)}
      />

      {/* 4. Tourist SOS Emergency Center Modal */}
      <SOSModal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
        destinationName={destinationName}
        emergencyPhone={currentPackage.safetyCorridors?.touristPoliceHelpline || "112 / +91 1800-425-4747"}
      />

      {/* 5. Authentication & Host Login Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={(session) => {
          const canonical = normalizeUserRole(session.role);
          const normalizedSession: UserSession = {
            ...session,
            role: canonical
          };
          setUser(normalizedSession);
          localStorage.setItem('safarsetu_user', JSON.stringify(normalizedSession));
          const targetView = getRoleDashboardView(canonical, normalizedSession.onboardingStatus);
          setCurrentView(targetView);
        }}
        initialRole={authRole}
      />

      {/* 6. Travel by Interest Theme Explorer Modal (Multiple Places) */}
      <ThemeDestinationsModal
        styleKey={selectedThemeStyle}
        onClose={() => setSelectedThemeStyle(null)}
        onOpenDossier={handleOpenDossier}
        onPlanTrip={handlePlanTripAroundState}
      />

      {/* 7. Change Password Modal (For Partners & Logged-in Users) */}
      {user && (
        <ChangePasswordModal
          isOpen={changePasswordModalOpen}
          onClose={() => setChangePasswordModalOpen(false)}
          user={user}
        />
      )}

    </div>
  );
}
