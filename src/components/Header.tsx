// Changes made by @MdFarhanAhmad
import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  Wifi, 
  WifiOff, 
  Store, 
  ArrowRight, 
  Menu, 
  X, 
  ShieldAlert, 
  LogOut, 
  User, 
  Car, 
  Activity,
  LayoutGrid,
  ChevronDown,
  Globe,
  Building2,
  FileCheck2,
  CalendarCheck,
  Bed,
  CheckCircle2,
  Lock,
  KeyRound,
  Eye,
  Clock,
  Users,
  Truck
} from 'lucide-react';
import { UserSession, normalizeUserRole } from '../types';

export type AppView = 
  | 'landing' 
  | 'planner' 
  | 'customize_journey'
  | 'operator' 
  | 'partner' 
  | 'admin_ops' 
  | 'hotel_partner_dashboard' 
  | 'hotel_admin_portal'
  | 'tour_operator_dashboard'
  | 'transport_admin_portal'
  | 'tour_operator_onboarding' 
  | 'hotel_onboarding';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onOpenMyTrips: () => void;
  onOpenSafarMitra: () => void;
  onScrollTo: (id: string) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  onOpenAuth: () => void;
  onOpenHostAuth: () => void;
  user: UserSession | null;
  onLogout: () => void;
  savedTripsCount: number;
  onTriggerSOS: () => void;
  selectedLanguage: string;
  onChangeLanguage: (lang: string) => void;
  hotelActiveTab?: string;
  onSelectHotelTab?: (tab: 'overview' | 'rooms' | 'bookings' | 'verification') => void;
  onOpenChangePassword?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenMyTrips,
  onOpenSafarMitra,
  onScrollTo,
  isOffline,
  onToggleOffline,
  onOpenAuth,
  onOpenHostAuth,
  user,
  onLogout,
  savedTripsCount,
  onTriggerSOS,
  selectedLanguage,
  onChangeLanguage,
  hotelActiveTab,
  onSelectHotelTab,
  onOpenChangePassword
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalsOpen, setPortalsOpen] = useState(false);
  const portalsRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (portalsRef.current && !portalsRef.current.contains(e.target as Node)) {
        setPortalsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const canonicalRole = normalizeUserRole(user?.role);
  const isHotelOwner = canonicalRole === 'HOTEL_OWNER';
  const isHotelAdmin = canonicalRole === 'HOTEL_ADMIN';
  const isTourOperator = canonicalRole === 'TOUR_OPERATOR';
  const isTransportPartner = canonicalRole === 'TRANSPORT_ADMIN';
  const isSuperAdmin = canonicalRole === 'SUPER_ADMIN';
  const isTraveler = !user || canonicalRole === 'CUSTOMER';

  return (
    <>
      <header id="global-header" className="shrink-0 sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-all duration-300">
        <div className="max-w-[1600px] w-full mx-auto px-3 sm:px-4 lg:px-6 h-16 sm:h-18 flex items-center justify-between gap-2 lg:gap-4">
          
          {/* ============================================================ */}
          {/* ZONE 1 (LEFT): Brand Logo + Role-Adaptive Navigation         */}
          {/* ============================================================ */}
          <div className="flex items-center gap-2 lg:gap-3 xl:gap-5 min-w-0">
            
            {/* Main Brand Logo */}
            <button
              id="brand-logo-btn"
              onClick={() => {
                if (isHotelOwner) onNavigate('hotel_partner_dashboard');
                else if (isHotelAdmin) onNavigate('hotel_admin_portal');
                else if (isTourOperator) onNavigate('tour_operator_dashboard');
                else if (isTransportPartner) onNavigate('transport_admin_portal');
                else if (isSuperAdmin) onNavigate('admin_ops');
                else onNavigate('landing');
              }}
              className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition ${
                isHotelOwner ? 'bg-blue-900' : isHotelAdmin ? 'bg-indigo-900' : isTourOperator ? 'bg-emerald-900' : isTransportPartner ? 'bg-blue-950' : isSuperAdmin ? 'bg-purple-950' : 'bg-slate-900'
              }`}>
                {isHotelOwner ? (
                  <Building2 className="w-4 h-4 text-blue-400" />
                ) : isHotelAdmin ? (
                  <Store className="w-4 h-4 text-indigo-400" />
                ) : isTourOperator ? (
                  <Compass className="w-4 h-4 text-emerald-400" />
                ) : isTransportPartner ? (
                  <Car className="w-4 h-4 text-blue-400" />
                ) : isSuperAdmin ? (
                  <Activity className="w-4 h-4 text-purple-400" />
                ) : (
                  <Compass className="w-4 h-4 text-orange-500" />
                )}
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-bold text-xl tracking-tight text-slate-950">
                    Yatra<span className="text-orange-600 font-sans font-black">Sync</span>
                  </span>
                  
                  {/* Dynamic Role Workspace Badge */}
                  {isHotelOwner ? (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1">
                      <span>🏨 Hotel Owner</span>
                    </span>
                  ) : isHotelAdmin ? (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-900 border border-indigo-300 flex items-center gap-1">
                      <span>🛠️ Platform Hotel Admin</span>
                    </span>
                  ) : isTourOperator ? (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                      <span>🧭 Tour Operator</span>
                    </span>
                  ) : isTransportPartner ? (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1">
                      <span>🚗 Fleet Admin</span>
                    </span>
                  ) : isSuperAdmin ? (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1">
                      <span>⚡ Super Admin</span>
                    </span>
                  ) : (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300/80">
                      Official
                    </span>
                  )}
                </div>
                <p className="text-[9px] tracking-wider uppercase font-semibold text-slate-500 hidden 2xl:block whitespace-nowrap -mt-0.5">
                  {isHotelOwner ? "0% Commission Property Asset Management" : isHotelAdmin ? "Platform Hotel Approvals & Directory" : isTourOperator ? "Tour Package & Itinerary Creator Desk" : isTransportPartner ? "Multimodal Fleet & Telemetry Desk" : isSuperAdmin ? "Master Control & Incident Telemetry" : "Multimodal Travel Pass"}
                </p>
              </div>
            </button>

            {/* -------------------------------------------------------- */}
            {/* ROLE SPECIFIC DESKTOP NAVIGATION TABS                    */}
            {/* -------------------------------------------------------- */}

            {/* CASE 1A: HOTEL OWNER NAVIGATION */}
            {isHotelOwner && (
              <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold text-slate-700">
                <button
                  id="owner-nav-overview-btn"
                  onClick={() => {
                    onNavigate('hotel_partner_dashboard');
                    if (onSelectHotelTab) onSelectHotelTab('overview');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                    currentView === 'hotel_partner_dashboard' && (!hotelActiveTab || hotelActiveTab === 'overview')
                      ? 'bg-blue-100 text-blue-950 font-bold border border-blue-200'
                      : 'hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Profile</span>
                </button>

                <button
                  id="owner-nav-rooms-btn"
                  onClick={() => {
                    onNavigate('hotel_partner_dashboard');
                    if (onSelectHotelTab) onSelectHotelTab('rooms');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                    currentView === 'hotel_partner_dashboard' && hotelActiveTab === 'rooms'
                      ? 'bg-blue-100 text-blue-950 font-bold border border-blue-200'
                      : 'hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <Bed className="w-3.5 h-3.5 text-blue-600" />
                  <span>Rooms & Tariffs</span>
                </button>

                <button
                  id="owner-nav-bookings-btn"
                  onClick={() => {
                    onNavigate('hotel_partner_dashboard');
                    if (onSelectHotelTab) onSelectHotelTab('bookings');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                    currentView === 'hotel_partner_dashboard' && hotelActiveTab === 'bookings'
                      ? 'bg-blue-100 text-blue-950 font-bold border border-blue-200'
                      : 'hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Bookings</span>
                </button>

                <button
                  id="owner-nav-verification-btn"
                  onClick={() => {
                    onNavigate('hotel_partner_dashboard');
                    if (onSelectHotelTab) onSelectHotelTab('verification');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                    currentView === 'hotel_partner_dashboard' && hotelActiveTab === 'verification'
                      ? 'bg-blue-100 text-blue-950 font-bold border border-blue-200'
                      : 'hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>KYC & GSTIN</span>
                </button>
              </nav>
            )}

            {/* CASE 1B: HOTEL ADMIN PLATFORM NAVIGATION */}
            {isHotelAdmin && (
              <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold text-slate-700">
                <button
                  id="admin-hotel-nav-pending-btn"
                  onClick={() => onNavigate('hotel_admin_portal')}
                  className={`px-2.5 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                    currentView === 'hotel_admin_portal'
                      ? 'bg-indigo-100 text-indigo-950 font-bold border border-indigo-200'
                      : 'hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Pending</span>
                </button>

                <button
                  id="admin-hotel-nav-all-btn"
                  onClick={() => onNavigate('hotel_admin_portal')}
                  className="px-2.5 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 hover:text-slate-950 hover:bg-slate-100"
                >
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>All Hotels</span>
                </button>

                <button
                  id="admin-hotel-nav-owners-btn"
                  onClick={() => onNavigate('hotel_admin_portal')}
                  className="px-2.5 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 hover:text-slate-950 hover:bg-slate-100"
                >
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Owners</span>
                </button>

                <button
                  id="admin-hotel-nav-analytics-btn"
                  onClick={() => onNavigate('hotel_admin_portal')}
                  className="px-2.5 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 hover:text-slate-950 hover:bg-slate-100"
                >
                  <Activity className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Analytics</span>
                </button>
              </nav>
            )}

            {/* CASE 1C: TOUR OPERATOR NAVIGATION */}
            {isTourOperator && (
              <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs font-semibold text-slate-700">
                <button
                  id="tour-op-nav-packages-btn"
                  onClick={() => onNavigate('tour_operator_dashboard')}
                  className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                    currentView === 'tour_operator_dashboard'
                      ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-200'
                      : 'hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tour Packages & Itineraries</span>
                </button>
              </nav>
            )}

            {/* CASE 2: TRANSPORT PARTNER NAVIGATION */}
            {isTransportPartner && (
              <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs font-semibold text-slate-700">
                <button
                  id="transport-nav-active-btn"
                  onClick={() => onNavigate('transport_admin_portal')}
                  className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                    currentView === 'transport_admin_portal' || currentView === 'partner'
                      ? 'bg-blue-100 text-blue-950 font-bold border border-blue-200'
                      : 'hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Fleet & Dispatch Desk</span>
                </button>
              </nav>
            )}

            {/* CASE 3: SUPER ADMIN NAVIGATION */}
            {isSuperAdmin && (
              <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs font-semibold text-slate-700">
                <button
                  id="admin-nav-ops-btn"
                  onClick={() => onNavigate('admin_ops')}
                  className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                    currentView === 'admin_ops'
                      ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-200'
                      : 'hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Master Ops Desk</span>
                </button>

                <button
                  id="admin-nav-hotel-inspect-btn"
                  onClick={() => onNavigate('hotel_partner_dashboard')}
                  className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                    currentView === 'hotel_partner_dashboard'
                      ? 'bg-blue-100 text-blue-950 font-bold border border-blue-200'
                      : 'hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Hotel Audits</span>
                </button>

                <button
                  id="admin-nav-partner-inspect-btn"
                  onClick={() => onNavigate('partner')}
                  className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                    currentView === 'partner'
                      ? 'bg-orange-100 text-orange-950 font-bold border border-orange-200'
                      : 'hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <Car className="w-3.5 h-3.5 text-orange-600" />
                  <span>Driver Audits</span>
                </button>
              </nav>
            )}

            {/* CASE 4: TRAVELER / PUBLIC GUEST NAVIGATION */}
            {isTraveler && (
              <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs font-medium text-slate-700">
                <button
                  id="nav-explore-btn"
                  onClick={() => {
                    if (currentView !== 'landing') onNavigate('landing');
                    setTimeout(() => onScrollTo('destination-discovery'), 100);
                  }}
                  className="hidden 2xl:inline-block px-2.5 py-1.5 rounded-lg hover:text-slate-950 hover:bg-slate-100 transition whitespace-nowrap"
                >
                  Explore India
                </button>
                
                <button
                  id="nav-interests-btn"
                  onClick={() => {
                    if (currentView !== 'landing') onNavigate('landing');
                    setTimeout(() => onScrollTo('travel-styles'), 100);
                  }}
                  className="hidden xl:inline-block px-2.5 py-1.5 rounded-lg hover:text-slate-950 hover:bg-slate-100 transition whitespace-nowrap"
                >
                  Travel by Interest
                </button>

                <button
                  id="nav-planner-btn"
                  onClick={() => onNavigate('planner')}
                  className={`px-2 xl:px-2.5 py-1.5 rounded-lg hover:text-slate-950 hover:bg-slate-100 transition flex items-center gap-1.5 whitespace-nowrap ${
                    currentView === 'planner' ? 'bg-orange-50 text-orange-950 font-bold border border-orange-200' : ''
                  }`}
                >
                  <span>Predefined Tours</span>
                </button>

                <button
                  id="nav-customize-journey-btn"
                  onClick={() => onNavigate('customize_journey')}
                  className={`px-2.5 xl:px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                    currentView === 'customize_journey'
                      ? 'bg-orange-600 text-white font-extrabold shadow-xs'
                      : 'bg-orange-50 text-orange-800 font-bold border border-orange-200 hover:bg-orange-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  <span>Customize My Journey</span>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
                    currentView === 'customize_journey' ? 'bg-white text-orange-700' : 'bg-orange-600 text-white'
                  }`}>
                    NEW
                  </span>
                </button>

                <button
                  id="nav-trips-btn"
                  onClick={onOpenMyTrips}
                  className="px-2 xl:px-2.5 py-1.5 rounded-lg hover:text-slate-950 hover:bg-slate-100 transition flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>My Trips</span>
                  <span id="nav-trip-count-badge" className="min-w-[18px] h-4 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold px-1">
                    {savedTripsCount}
                  </span>
                </button>

                <button
                  id="nav-safarmitra-btn"
                  onClick={onOpenSafarMitra}
                  className="px-2 xl:px-2.5 py-1.5 rounded-lg hover:text-slate-950 hover:bg-slate-100 transition flex items-center gap-1 text-slate-900 whitespace-nowrap font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  <span>SafarMitra AI</span>
                </button>
              </nav>
            )}

          </div>

          {/* ============================================================ */}
          {/* ZONE 2 (RIGHT): Role Controls + Auth + Profile               */}
          {/* ============================================================ */}
          <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-2.5 flex-shrink-0">
            
            {/* Language Selector */}
            <div className="relative hidden md:flex items-center">
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                id="lang-selector"
                value={selectedLanguage}
                onChange={(e) => onChangeLanguage(e.target.value)}
                className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200/90 rounded-xl pl-7 pr-2.5 py-1.5 hover:border-slate-300 focus:outline-none cursor-pointer shadow-2xs"
              >
                <option value="en">EN</option>
                <option value="hi">हिन्दी</option>
                <option value="ml">മലയാളം</option>
                <option value="te">తెలుగు</option>
                <option value="ta">தமிழ்</option>
                <option value="mr">मराठी</option>
                <option value="bn">বাংলা</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="gu">ગુજરાતી</option>
                <option value="pa">ਪੰਜਾਬੀ</option>
              </select>
            </div>

            {/* PORTALS DROPDOWN (Strictly Role Partitioned) */}
            <div className="relative hidden lg:block" ref={portalsRef}>
              <button
                id="header-portals-btn"
                onClick={() => setPortalsOpen(!portalsOpen)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition shadow-2xs ${
                  portalsOpen
                    ? 'bg-slate-900 text-white border-slate-900'
                    : isHotelOwner
                    ? 'bg-blue-50 border-blue-200 text-blue-950 font-bold hover:bg-blue-100'
                    : isHotelAdmin
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-950 font-bold hover:bg-indigo-100'
                    : isTransportPartner
                    ? 'bg-orange-50 border-orange-200 text-orange-950 font-bold hover:bg-orange-100'
                    : isSuperAdmin
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-bold hover:bg-emerald-100'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
                title="Access Portals & Control Desks"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>
                  {isHotelOwner ? 'Property Desk' : isHotelAdmin ? 'Hotel Operations Desk' : isTransportPartner ? 'Transport Desk' : isSuperAdmin ? 'Master Controls' : 'Partner Portals'}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform ${portalsOpen ? 'rotate-180' : ''}`} />
              </button>

              {portalsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left">
                  
                  {/* RBAC Header Label */}
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                    <span>
                      {isHotelOwner
                        ? '🏨 Hotel Owner Dashboard'
                        : isHotelAdmin
                        ? '🛠️ Hotel Administration Only'
                        : isTransportPartner
                        ? '🚗 Transport Chauffeur Only'
                        : isTourOperator
                        ? '🧭 Tour Operator Operations Only'
                        : 'YatraSync Ecosystem Portals'}
                    </span>
                  </div>
                  
                  {/* CASE 1A: HOTEL OWNER (FULL PROPERTY & COMMERCIAL MANAGEMENT) */}
                  {isHotelOwner && (
                    <div className="space-y-1 pt-1">
                      <button
                        onClick={() => {
                          setPortalsOpen(false);
                          onNavigate('hotel_partner_dashboard');
                          if (onSelectHotelTab) onSelectHotelTab('overview');
                        }}
                        className="w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 bg-blue-50/70 hover:bg-blue-100 text-blue-950 transition text-xs font-bold border border-blue-200"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-blue-950">Property Asset Dashboard</div>
                          <div className="text-[10px] text-blue-800 font-normal">Tariffs, Rooms, Verification & Analytics</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setPortalsOpen(false);
                          onNavigate('hotel_partner_dashboard');
                          if (onSelectHotelTab) onSelectHotelTab('verification');
                        }}
                        className="w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 hover:bg-slate-50 text-slate-700 transition text-xs"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <FileCheck2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">DigiLocker GSTIN & PAN</div>
                          <div className="text-[10px] text-emerald-700 font-semibold">Verified Govt Partner</div>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* CASE 1B: HOTEL ADMIN (PLATFORM HOTEL GOVERNANCE DESK) */}
                  {isHotelAdmin && (
                    <div className="space-y-1 pt-1">
                      <button
                        onClick={() => {
                          setPortalsOpen(false);
                          onNavigate('hotel_admin_portal');
                        }}
                        className="w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-950 transition text-xs font-bold border border-indigo-200"
                      >
                        <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-2xs">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-indigo-950">Hotel Administration Portal</div>
                          <div className="text-[10px] text-indigo-800 font-normal">Pending Approvals, Properties & Directory</div>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* CASE 1C: TOUR OPERATOR (TOUR OPERATOR OPERATIONS HUB) */}
                  {isTourOperator && (
                    <div className="space-y-1 pt-1">
                      <button
                        onClick={() => {
                          setPortalsOpen(false);
                          onNavigate('tour_operator_dashboard');
                        }}
                        className="w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-950 transition text-xs font-bold border border-emerald-200"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                          <Compass className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-emerald-950">Tour Operator Operations Hub</div>
                          <div className="text-[10px] text-emerald-800 font-normal">Packages, Itineraries, Roster & Fleet</div>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* CASE 2: TRANSPORT PARTNER (STRICTLY TRANSPORT OPERATIONS ONLY) */}
                  {isTransportPartner && (
                    <div className="space-y-1 pt-1">
                      <button
                        onClick={() => {
                          setPortalsOpen(false);
                          onNavigate('transport_admin_portal');
                        }}
                        className="w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 bg-blue-50/70 hover:bg-blue-100 text-blue-950 transition text-xs font-bold border border-blue-200"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-blue-950">Transport Infrastructure & Fleet Portal</div>
                          <div className="text-[10px] text-blue-800 font-normal">Fleet Registry, Chauffeurs, Credentials & Dispatch</div>
                        </div>
                      </button>

                      {/* Explicit RBAC Restriction notice */}
                      <div className="px-2 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-[10px] text-slate-600 flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>Hotel & Master desks restricted to authorized administrators.</span>
                      </div>
                    </div>
                  )}

                  {/* CASE 3: SUPER ADMIN (FULL ACCESS) */}
                  {isSuperAdmin && (
                    <div className="space-y-1 pt-1">
                      <button
                        onClick={() => {
                          setPortalsOpen(false);
                          onNavigate('admin_ops');
                        }}
                        className="w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 transition text-xs font-bold border border-emerald-200"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-emerald-950">Centralized Ops Desk</div>
                          <div className="text-[10px] text-emerald-800 font-normal">Master Fleet, Incidents & Telemetry</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setPortalsOpen(false);
                          onNavigate('hotel_partner_dashboard');
                        }}
                        className="w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 hover:bg-slate-50 text-slate-700 transition text-xs"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">Hotel Audit Mode</div>
                          <div className="text-[10px] text-slate-500">Inspect Property Verifications</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setPortalsOpen(false);
                          onNavigate('partner');
                        }}
                        className="w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 hover:bg-slate-50 text-slate-700 transition text-xs"
                      >
                        <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                          <Car className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">Driver Audit Mode</div>
                          <div className="text-[10px] text-slate-500">Inspect Fleet & Chauffeur View</div>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* CASE 4: TRAVELER / PUBLIC GUEST (REQUIRES LOGIN / ACCOUNT SWITCH) */}
                  {isTraveler && (
                    <div className="space-y-1 pt-1">
                      <button
                        onClick={() => {
                          setPortalsOpen(false);
                          onOpenHostAuth();
                        }}
                        className="w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 hover:bg-blue-50 text-slate-700 transition text-xs group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-100 group-hover:bg-blue-600 group-hover:text-white text-blue-700 flex items-center justify-center transition">
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{user ? 'Switch to Hotel Partner' : 'Hotel Partner Login'}</div>
                          <div className="text-[10px] text-slate-500">0% Commission Property Desk</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setPortalsOpen(false);
                          onOpenAuth();
                        }}
                        className="w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 hover:bg-orange-50 text-slate-700 transition text-xs group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-orange-100 group-hover:bg-orange-600 group-hover:text-white text-orange-600 flex items-center justify-center transition">
                          <Car className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{user ? 'Switch to Transport Desk' : 'Transport Partner Login'}</div>
                          <div className="text-[10px] text-slate-500">Driver & Storyteller Operations</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setPortalsOpen(false);
                          onOpenAuth();
                        }}
                        className="w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 hover:bg-emerald-50 text-slate-700 transition text-xs group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 group-hover:bg-emerald-600 group-hover:text-white text-emerald-700 flex items-center justify-center transition">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{user ? 'Switch to Super Admin' : 'Super Admin Desk'}</div>
                          <div className="text-[10px] text-slate-500">Restricted Centralized Control</div>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Offline Mode Switch */}
                  <div className="border-t border-slate-100 pt-1.5 mt-1.5">
                    <button
                      onClick={() => onToggleOffline()}
                      className="w-full text-left p-2 rounded-xl flex items-center justify-between text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-600" /> : <Wifi className="w-3.5 h-3.5 text-emerald-600" />}
                        <span>{isOffline ? 'Offline Mode Active' : 'Online Mode'}</span>
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isOffline ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'}`}>
                        {isOffline ? 'OFFLINE' : 'LIVE'}
                      </span>
                    </button>
                  </div>

                </div>
              )}
            </div>

            {/* Profile Chip with Role Badge & Logout */}
            <div>
              {!user ? (
                <button
                  id="header-login-btn"
                  onClick={onOpenAuth}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 transition border border-slate-200/90 shadow-2xs flex items-center gap-1"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Log in</span>
                </button>
              ) : (
                <div id="logged-in-profile" className={`flex items-center gap-2 py-1 px-2.5 rounded-xl shadow-2xs border ${
                  isHotelAdmin ? 'bg-indigo-50/80 border-indigo-200 text-indigo-950' : 
                  isHotelOwner ? 'bg-blue-50/80 border-blue-200 text-blue-950' : 
                  isTourOperator ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' :
                  isTransportPartner ? 'bg-blue-50/80 border-blue-200 text-blue-950' : 
                  isSuperAdmin ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' : 
                  'bg-slate-50 border-slate-200 text-slate-900'
                }`}>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] text-white ${
                    isHotelAdmin ? 'bg-indigo-700' : 
                    isHotelOwner ? 'bg-blue-700' : 
                    isTourOperator ? 'bg-emerald-700' :
                    isTransportPartner ? 'bg-blue-600' : 
                    isSuperAdmin ? 'bg-emerald-700' : 
                    'bg-slate-900'
                  }`}>
                    {user.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
                  </div>
                  
                  <div className="flex flex-col text-left leading-tight hidden sm:flex">
                    <span className="text-xs font-bold text-slate-900 max-w-[100px] truncate">{user.name}</span>
                    <span className={`text-[9px] font-extrabold uppercase tracking-wider ${
                      isHotelOwner ? 'text-blue-700' : 
                      isHotelAdmin ? 'text-indigo-700' : 
                      isTourOperator ? 'text-emerald-700' :
                      isTransportPartner ? 'text-blue-700' : 
                      isSuperAdmin ? 'text-emerald-700' : 
                      'text-slate-600'
                    }`}>
                      {isHotelOwner ? 'Hotel Owner' : isHotelAdmin ? 'Hotel Admin' : isTourOperator ? 'Tour Operator' : isTransportPartner ? 'Transport Desk' : isSuperAdmin ? 'Admin' : 'Traveler'}
                    </span>
                  </div>

                  {onOpenChangePassword && (
                    <button
                      id="header-change-password-btn"
                      onClick={onOpenChangePassword}
                      title="Change Password"
                      className="text-slate-400 hover:text-orange-600 text-xs p-1 rounded-lg transition cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    id="header-logout-btn"
                    onClick={onLogout}
                    title="Sign Out & Switch Account"
                    className="text-slate-400 hover:text-rose-600 text-xs p-1 ml-0.5 rounded-lg transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* ACTION CTA: Role-dependent button */}
            {isTourOperator ? (
              <button
                id="tour-op-header-cta-btn"
                onClick={() => {
                  if (currentView === 'landing') {
                    onNavigate('tour_operator_dashboard');
                  } else {
                    onNavigate('landing');
                  }
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 whitespace-nowrap ${
                  currentView === 'landing' 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                }`}
              >
                {currentView === 'landing' ? (
                  <>
                    <Compass className="w-3.5 h-3.5" />
                    <span>Return to Hub</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden sm:inline">Public Preview</span>
                  </>
                )}
              </button>
            ) : isHotelOwner ? (
              <button
                id="hotel-owner-header-cta-btn"
                onClick={() => {
                  if (currentView === 'landing') {
                    onNavigate('hotel_partner_dashboard');
                  } else {
                    onNavigate('landing');
                  }
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 whitespace-nowrap ${
                  currentView === 'landing' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                }`}
              >
                {currentView === 'landing' ? (
                  <>
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Return to Dashboard</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden sm:inline">Public Preview</span>
                  </>
                )}
              </button>
            ) : isHotelAdmin ? (
              <button
                id="hotel-header-cta-btn"
                onClick={() => {
                  if (currentView === 'landing') {
                    onNavigate('hotel_admin_portal');
                  } else {
                    onNavigate('landing');
                  }
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 whitespace-nowrap ${
                  currentView === 'landing' 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                }`}
              >
                {currentView === 'landing' ? (
                  <>
                    <Store className="w-3.5 h-3.5" />
                    <span>Return to Admin</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden sm:inline">Public Preview</span>
                  </>
                )}
              </button>
            ) : isTransportPartner ? (
              <button
                id="transport-header-cta-btn"
                onClick={() => {
                  if (currentView === 'landing') {
                    onNavigate('partner');
                  } else {
                    onNavigate('landing');
                  }
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 whitespace-nowrap ${
                  currentView === 'landing' 
                    ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                }`}
              >
                {currentView === 'landing' ? (
                  <>
                    <Car className="w-3.5 h-3.5" />
                    <span>Return to Transport</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden sm:inline">Public Preview</span>
                  </>
                )}
              </button>
            ) : isSuperAdmin ? (
              <button
                id="superadmin-header-cta-btn"
                onClick={() => {
                  if (currentView === 'landing') {
                    onNavigate('admin_ops');
                  } else {
                    onNavigate('landing');
                  }
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 whitespace-nowrap ${
                  currentView === 'landing' 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                }`}
              >
                {currentView === 'landing' ? (
                  <>
                    <Activity className="w-3.5 h-3.5" />
                    <span>Return to Ops</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden sm:inline">Public Preview</span>
                  </>
                )}
              </button>
            ) : (
              <button
                id="header-cta-plan-btn"
                onClick={() => onNavigate('planner')}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-all duration-200 active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>Plan My Trip</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Mobile Drawer Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </header>

      {/* ============================================================ */}
      {/* MOBILE DRAWER NAVIGATION (Below 1024px)                     */}
      {/* ============================================================ */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="lg:hidden fixed inset-x-0 top-16 z-30 bg-white border-b border-slate-200 shadow-xl px-4 py-5 space-y-4 text-left">
          
          {/* CASE 1A: HOTEL OWNER MOBILE MENU */}
          {isHotelOwner ? (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                🏨 Hotel Owner Asset Workspace
              </span>
              <div className="grid grid-cols-1 gap-2 text-xs font-semibold">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('hotel_partner_dashboard');
                    if (onSelectHotelTab) onSelectHotelTab('overview');
                  }}
                  className="p-2.5 text-left bg-blue-50 text-blue-950 font-bold rounded-xl hover:bg-blue-100 flex items-center gap-2 border border-blue-200"
                >
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Property Profile</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('hotel_partner_dashboard');
                    if (onSelectHotelTab) onSelectHotelTab('rooms');
                  }}
                  className="p-2.5 text-left bg-slate-50 text-slate-800 rounded-xl hover:bg-slate-100 flex items-center gap-2"
                >
                  <Bed className="w-4 h-4 text-blue-600" />
                  <span>Room Inventory & Tariffs</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('hotel_partner_dashboard');
                    if (onSelectHotelTab) onSelectHotelTab('bookings');
                  }}
                  className="p-2.5 text-left bg-slate-50 text-slate-800 rounded-xl hover:bg-slate-100 flex items-center gap-2"
                >
                  <CalendarCheck className="w-4 h-4 text-blue-600" />
                  <span>Property Bookings</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('hotel_partner_dashboard');
                    if (onSelectHotelTab) onSelectHotelTab('verification');
                  }}
                  className="p-2.5 text-left bg-slate-50 text-slate-800 rounded-xl hover:bg-slate-100 flex items-center gap-2"
                >
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>DigiLocker KYC & GSTIN</span>
                </button>
              </div>
            </div>
          ) : isHotelAdmin ? (
            /* CASE 1B: HOTEL ADMIN MOBILE MENU */
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 block">
                🛠️ Hotel Administration Portal
              </span>
              <div className="grid grid-cols-1 gap-2 text-xs font-semibold">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('hotel_admin_portal');
                  }}
                  className="p-2.5 text-left bg-indigo-50 text-indigo-950 font-bold rounded-xl hover:bg-indigo-100 flex items-center gap-2 border border-indigo-200"
                >
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Pending Registrations Queue</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('hotel_admin_portal');
                  }}
                  className="p-2.5 text-left bg-slate-50 text-slate-800 rounded-xl hover:bg-slate-100 flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>All Connected Platform Hotels</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('hotel_admin_portal');
                  }}
                  className="p-2.5 text-left bg-slate-50 text-slate-800 rounded-xl hover:bg-slate-100 flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Hotel Owners Directory</span>
                </button>
              </div>
            </div>
          ) : isTourOperator ? (
            /* CASE 1C: TOUR OPERATOR MOBILE MENU */
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                🧭 Tour Operator Operations Hub
              </span>
              <div className="grid grid-cols-1 gap-2 text-xs font-semibold">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('tour_operator_dashboard');
                  }}
                  className="p-2.5 text-left bg-emerald-50 text-emerald-950 font-bold rounded-xl hover:bg-emerald-100 flex items-center gap-2 border border-emerald-200"
                >
                  <Compass className="w-4 h-4 text-emerald-600" />
                  <span>Tour Packages & Itineraries</span>
                </button>
              </div>
            </div>
          ) : isTransportPartner ? (
            /* CASE 2: TRANSPORT PARTNER MOBILE MENU */
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 block">
                🚗 Transport Partner Workspace
              </span>
              <div className="grid grid-cols-1 gap-2 text-xs font-semibold">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('partner');
                  }}
                  className="p-2.5 text-left bg-orange-50 text-orange-950 font-bold rounded-xl hover:bg-orange-100 flex items-center gap-2 border border-orange-200"
                >
                  <Car className="w-4 h-4 text-orange-600" />
                  <span>Active Duty & Assignments</span>
                </button>
              </div>
            </div>
          ) : isSuperAdmin ? (
            /* CASE 3: SUPER ADMIN MOBILE MENU */
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                ⚡ Master Ops Control
              </span>
              <div className="grid grid-cols-1 gap-2 text-xs font-semibold">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('admin_ops');
                  }}
                  className="p-2.5 text-left bg-emerald-50 text-emerald-950 font-bold rounded-xl hover:bg-emerald-100 flex items-center gap-2 border border-emerald-200"
                >
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Centralized Ops Desk</span>
                </button>
              </div>
            </div>
          ) : (
            /* CASE 4: TRAVELER MOBILE MENU */
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('customize_journey');
                }}
                className="col-span-2 p-2.5 text-left bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-xs flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Customize My Journey</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-orange-700 font-extrabold">NEW</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (currentView !== 'landing') onNavigate('landing');
                  setTimeout(() => onScrollTo('destination-discovery'), 100);
                }}
                className="p-2.5 text-left bg-slate-50 rounded-xl hover:bg-slate-100 flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-orange-600" />
                <span>Explore India</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (currentView !== 'landing') onNavigate('landing');
                  setTimeout(() => onScrollTo('travel-styles'), 100);
                }}
                className="p-2.5 text-left bg-slate-50 rounded-xl hover:bg-slate-100 flex items-center gap-2"
              >
                <Store className="w-4 h-4 text-orange-600" />
                <span>Interests</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('planner');
                }}
                className="p-2.5 text-left bg-orange-50 text-orange-950 font-bold rounded-xl hover:bg-orange-100 flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4 text-orange-600" />
                <span>Predefined Tours</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenMyTrips();
                }}
                className="p-2.5 text-left bg-slate-50 rounded-xl hover:bg-slate-100 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-orange-600" />
                <span>My Trips ({savedTripsCount})</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSafarMitra();
                }}
                className="col-span-2 p-2.5 text-left bg-slate-50 rounded-xl hover:bg-slate-100 flex items-center gap-2 font-semibold text-slate-900"
              >
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span>SafarMitra AI Travel Assistant</span>
              </button>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={onToggleOffline}
              className="text-slate-600 font-semibold flex items-center gap-1.5"
            >
              {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-600" /> : <Wifi className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{isOffline ? 'Offline Mode' : 'Online Mode'}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onTriggerSOS();
              }}
              className="text-red-600 font-bold flex items-center gap-1"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Tourist SOS</span>
            </button>
          </div>

        </div>
      )}
    </>
  );
};
