// Changes made by @MdFarhanAhmad
import React, { useState, useEffect } from 'react';
import {
  UserSession,
  TourPackageData,
  TourItineraryDayData,
  TourActivityData,
  TourGuideData,
  TourScheduleData,
  TourBookingItemData,
  TourAnalyticsData,
  TransportCredentialData,
  TransportChangeRequestData
} from '../../types';
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Star,
  Eye,
  KeyRound,
  DollarSign,
  Search,
  Filter,
  Layers,
  Award,
  ChevronRight,
  TrendingUp,
  Activity,
  Check,
  X,
  FileText,
  Car,
  Truck,
  Send,
  RefreshCw,
  Sliders,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { ChangePasswordModal } from '../modals/ChangePasswordModal';

interface TourOperatorDashboardProps {
  user: UserSession;
  onNavigate: (view: any) => void;
}

const SAMPLE_PACKAGES: TourPackageData[] = [
  {
    id: 'pkg-munnar-5d',
    operatorId: 'usr-touroperator-1',
    title: '5-Day Munnar Tea Trail & Mist Valley Odyssey',
    destinationKey: 'kerala',
    destinationName: 'Kerala (Munnar & Anamudi)',
    category: 'eco_adventure',
    durationDays: 5,
    durationNights: 4,
    basePriceINR: 18500,
    discountedPriceINR: 16999,
    maxCapacityPerBatch: 15,
    minCapacityPerBatch: 2,
    difficultyLevel: 'MODERATE',
    guideRequirement: 'LICENSED_STORYTELLER',
    inclusions: ['Colonial Estate Stay', 'All Vegetarian & Traditional Sadhya Meals', 'Private 4x4 Jeep Safari', 'Storyteller Naturalist Guide', 'Tea Tasting Workshop'],
    exclusions: ['Personal Laundry', 'Extra Alcoholic Beverages', 'Camera Charges at National Parks'],
    cancellationPolicy: 'Full refund up to 7 days before departure. 50% refund between 3 to 7 days.',
    status: 'PUBLISHED',
    rating: 4.94,
    totalBookings: 28,
    coverImageUrl: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80'
    ],
    itineraryDays: [
      {
        id: 'day-1',
        dayNumber: 1,
        title: 'Arrival in Kochi & High-Range Ascent to Munnar',
        description: 'Scenic drive through Cheeyappara & Valara Waterfalls with fresh coconut break and spice garden introductory walk.',
        mealsIncluded: ['Welcome Drink', 'Traditional Kerala Dinner'],
        overnightStay: 'Munnar Tea Hills Heritage Resort',
        activities: [
          {
            id: 'act-1',
            activityName: 'Cheeyappara Waterfall Refreshment Halt',
            activityType: 'HERITAGE_WALK',
            startTime: '11:00 AM',
            durationHours: 1.5,
            locationName: 'Cheeyappara Waterfalls, NH85'
          }
        ]
      },
      {
        id: 'day-2',
        dayNumber: 2,
        title: 'Kolukkumalai Sunrise & High-Altitude Tea Plucking',
        description: '4x4 expedition to the worlds highest organic tea plantation (7,900 ft). Hands-on tea leaf harvesting with local master pickers.',
        mealsIncluded: ['Highland Breakfast', 'Plantation Lunch', 'Dinner'],
        overnightStay: 'Munnar Tea Hills Heritage Resort',
        activities: [
          {
            id: 'act-2',
            activityName: 'Kolukkumalai 4x4 Sunrise Jeep Trek',
            activityType: 'TREK',
            startTime: '04:30 AM',
            durationHours: 3.5,
            locationName: 'Kolukkumalai Tea Estate'
          },
          {
            id: 'act-3',
            activityName: 'Artisanal Tea Tasting & Factory Masterclass',
            activityType: 'WORKSHOP',
            startTime: '10:30 AM',
            durationHours: 2.0,
            locationName: 'Lockhart Tea Factory (Est. 1879)'
          }
        ]
      }
    ],
    schedules: [
      {
        id: 'sch-101',
        startDate: '2026-10-15',
        endDate: '2026-10-19',
        batchCapacity: 15,
        bookedSeats: 4,
        status: 'OPEN',
        guideName: 'Harish Chandran'
      },
      {
        id: 'sch-102',
        startDate: '2026-10-22',
        endDate: '2026-10-26',
        batchCapacity: 15,
        bookedSeats: 15,
        status: 'SOLD_OUT',
        guideName: 'Anand Varma'
      }
    ]
  },
  {
    id: 'pkg-goa-heritage-4d',
    operatorId: 'usr-touroperator-1',
    title: '4-Day Latin Quarter & Heritage Spice Trail of Goa',
    destinationKey: 'goa',
    destinationName: 'Goa (Fontainhas & Divar Island)',
    category: 'heritage',
    durationDays: 4,
    durationNights: 3,
    basePriceINR: 14200,
    discountedPriceINR: 12999,
    maxCapacityPerBatch: 12,
    minCapacityPerBatch: 2,
    difficultyLevel: 'EASY',
    guideRequirement: 'HISTORIAN',
    inclusions: ['Heritage Portuguese Villa Stay', 'Traditional Goan Feni & Spice Luncheon', 'Divar Island Ferry & E-Bike Tour', 'Historian Walk Guide'],
    exclusions: ['Water Sports at Commercial Beaches', 'Personal Expenses'],
    status: 'PUBLISHED',
    rating: 4.88,
    totalBookings: 19,
    coverImageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80'],
    itineraryDays: [],
    schedules: [
      {
        id: 'sch-201',
        startDate: '2026-11-05',
        endDate: '2026-11-08',
        batchCapacity: 12,
        bookedSeats: 6,
        status: 'OPEN',
        guideName: 'Maria D Souza'
      }
    ]
  }
];

const SAMPLE_GUIDES: TourGuideData[] = [
  {
    id: 'guide-101',
    fullName: 'Harish Chandran',
    phone: '+91 94470 98123',
    email: 'harish.guide@keraladiscovery.in',
    languages: ['English', 'Hindi', 'Malayalam', 'Tamil', 'French'],
    specialty: 'Western Ghats Botanist & Storyteller',
    badgeNumber: 'KTDC-GD-2024-918',
    rating: 4.98,
    status: 'ACTIVE'
  },
  {
    id: 'guide-102',
    fullName: 'Maria D Souza',
    phone: '+91 98221 44556',
    email: 'maria.goa@keraladiscovery.in',
    languages: ['English', 'Hindi', 'Konkani', 'Portuguese'],
    specialty: 'Portuguese Indo-Gothic Architecture Historian',
    badgeNumber: 'GTDC-EXP-1044',
    rating: 4.92,
    status: 'ACTIVE'
  }
];

const SAMPLE_BOOKINGS: TourBookingItemData[] = [
  {
    id: 'tbi-101',
    bookingId: 'SS-CONFIRM-94812',
    packageId: 'pkg-munnar-5d',
    packageTitle: '5-Day Munnar Tea Trail & Mist Valley Odyssey',
    scheduleId: 'sch-101',
    customerName: 'Priya Sundaram',
    customerPhone: '+91 98401 23456',
    customerEmail: 'priya@example.com',
    travelersCount: 2,
    totalPrice: 33998,
    specialRequests: 'Vegetarian Jain meal preferences on Day 2.',
    status: 'CONFIRMED',
    createdAt: '2026-09-14T10:30:00Z'
  },
  {
    id: 'tbi-102',
    bookingId: 'SS-CONFIRM-98211',
    packageId: 'pkg-munnar-5d',
    packageTitle: '5-Day Munnar Tea Trail & Mist Valley Odyssey',
    scheduleId: 'sch-101',
    customerName: 'Rahul Deshmukh',
    customerPhone: '+91 98200 88771',
    customerEmail: 'rahul.d@travel.in',
    travelersCount: 2,
    totalPrice: 33998,
    specialRequests: 'Need high-floor room with plantation sunrise view.',
    status: 'CONFIRMED',
    createdAt: '2026-09-15T14:10:00Z'
  }
];

export const TourOperatorDashboard: React.FC<TourOperatorDashboardProps> = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'packages' | 'itinerary' | 'guides' | 'schedules' | 'bookings' | 'transport' | 'analytics'>('packages');
  const [packages, setPackages] = useState<TourPackageData[]>(SAMPLE_PACKAGES);
  const [guides, setGuides] = useState<TourGuideData[]>(SAMPLE_GUIDES);
  const [bookings, setBookings] = useState<TourBookingItemData[]>(SAMPLE_BOOKINGS);
  const [selectedPackage, setSelectedPackage] = useState<TourPackageData | null>(SAMPLE_PACKAGES[0]);
  const [credential, setCredential] = useState<TransportCredentialData | null>(null);
  const [changeRequests, setChangeRequests] = useState<TransportChangeRequestData[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isCreatePackageOpen, setIsCreatePackageOpen] = useState(false);
  const [isAddGuideOpen, setIsAddGuideOpen] = useState(false);
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
  const [isChangeRequestModalOpen, setIsChangeRequestModalOpen] = useState(false);

  // New package form state (with multi-destination support)
  const [newTitle, setNewTitle] = useState('');
  const [newDestination, setNewDestination] = useState('kerala');
  const [newDestName, setNewDestName] = useState('Kerala (Munnar & Thekkady)');
  const [newDestinationsInput, setNewDestinationsInput] = useState('kerala, munnar, thekkady');
  const [newCategory, setNewCategory] = useState('eco_adventure');
  const [newDays, setNewDays] = useState(5);
  const [newPrice, setNewPrice] = useState(17500);
  const [newCapacity, setNewCapacity] = useState(15);
  const [newGuideReq, setNewGuideReq] = useState('LICENSED_STORYTELLER');

  // Change request form state
  const [changeReqType, setChangeReqType] = useState<'VEHICLE_ADDITION' | 'VEHICLE_REPLACEMENT' | 'DRIVER_ADDITION' | 'DRIVER_REPLACEMENT' | 'CAPACITY_UPGRADE' | 'OTHER'>('VEHICLE_ADDITION');
  const [changeReqJustification, setChangeReqJustification] = useState('');
  const [changeReqDetails, setChangeReqDetails] = useState('');

  // New guide form state
  const [newGuideName, setNewGuideName] = useState('');
  const [newGuidePhone, setNewGuidePhone] = useState('');
  const [newGuideEmail, setNewGuideEmail] = useState('');
  const [newGuideSpecialty, setNewGuideSpecialty] = useState('High Altitude Naturalist & Storyteller');
  const [newGuideBadge, setNewGuideBadge] = useState('');

  // New schedule form state
  const [newSchedStart, setNewSchedStart] = useState('2026-11-10');
  const [newSchedEnd, setNewSchedEnd] = useState('2026-11-14');
  const [newSchedGuide, setNewSchedGuide] = useState(guides[0]?.fullName || '');

  const showNotification = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // Fetch real data from backend API with fallback to sample
  const fetchAllTourOperatorData = async () => {
    try {
      const token = localStorage.getItem('safarsetu_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const [pRes, cRes, crRes] = await Promise.all([
        fetch('/api/v1/tour-operator/packages', { credentials: 'include', headers }),
        fetch('/api/v1/tour-operator/credential', { credentials: 'include', headers }),
        fetch('/api/v1/tour-operator/change-requests', { credentials: 'include', headers })
      ]);

      if (pRes.ok) {
        const data = await pRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setPackages(data);
          if (!selectedPackage) setSelectedPackage(data[0]);
        }
      }
      if (cRes.ok) {
        const cData = await cRes.json();
        if (cData && cData.id) setCredential(cData);
      }
      if (crRes.ok) {
        const crData = await crRes.json();
        if (Array.isArray(crData)) setChangeRequests(crData);
      }
    } catch (e) {
      console.log('Using local tour operator data:', e);
    }
  };

  useEffect(() => {
    fetchAllTourOperatorData();
  }, []);

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    setLoading(true);
    try {
      const parsedDestinations = newDestinationsInput
        ? newDestinationsInput.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
        : [newDestination.toLowerCase()];

      const token = localStorage.getItem('safarsetu_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };

      const payload = {
        title: newTitle,
        destination_key: newDestination,
        destination_name: newDestName,
        destinations: parsedDestinations,
        category: newCategory,
        duration_days: Number(newDays),
        duration_nights: Math.max(1, Number(newDays) - 1),
        base_price_inr: Number(newPrice),
        discounted_price_inr: Math.round(Number(newPrice) * 0.92),
        max_capacity_per_batch: Number(newCapacity),
        min_capacity_per_batch: 2,
        difficulty_level: 'MODERATE',
        guide_requirement: newGuideReq,
        inclusions: ['Boutique Stay', 'All Meals & Tastings', 'Private Chauffeur & Storyteller Guide'],
        exclusions: ['Personal Shopping', 'Airfare'],
        status: 'PUBLISHED'
      };

      const res = await fetch('/api/v1/tour-operator/packages', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (res.ok) {
        const createdData = await res.json();
        showNotification('success', 'Tour Package published successfully to customer discovery catalog.');
        setPackages([createdData, ...packages]);
        setSelectedPackage(createdData);
        setIsCreatePackageOpen(false);
        setNewTitle('');
        await fetchAllTourOperatorData();
      } else {
        const err = await res.json().catch(() => ({}));
        showNotification('error', err.detail || 'Failed to create tour package');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Error creating tour package');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublishStatus = async (pkgId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'PUBLISHED' ? 'PAUSED' : 'PUBLISHED';
    try {
      const token = localStorage.getItem('safarsetu_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      const res = await fetch(`/api/v1/tour-operator/packages/${pkgId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: nextStatus }),
        credentials: 'include'
      });
      if (res.ok) {
        showNotification('success', `Tour package is now ${nextStatus}.`);
        await fetchAllTourOperatorData();
      } else {
        showNotification('error', 'Failed to update tour status');
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleQuickUpdatePriceAndCapacity = async (pkgId: string, price: number, capacity: number) => {
    try {
      const token = localStorage.getItem('safarsetu_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      const res = await fetch(`/api/v1/tour-operator/packages/${pkgId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          base_price_inr: price,
          discounted_price_inr: Math.round(price * 0.92),
          max_capacity_per_batch: capacity
        }),
        credentials: 'include'
      });
      if (res.ok) {
        showNotification('success', 'Price & capacity updated live.');
        await fetchAllTourOperatorData();
      } else {
        showNotification('error', 'Failed to update pricing');
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleSubmitChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credential) {
      showNotification('error', 'No active credential found to request changes for.');
      return;
    }
    if (!changeReqJustification) {
      showNotification('error', 'Please provide a justification for the change request.');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('safarsetu_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      const payload = {
        credential_id: credential.id,
        request_type: changeReqType,
        justification: changeReqJustification,
        requested_changes_json: {
          requestType: changeReqType,
          description: changeReqDetails,
          submittedTimestamp: new Date().toISOString()
        }
      };
      const res = await fetch('/api/v1/tour-operator/change-requests', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      if (res.ok) {
        showNotification('success', 'Change request submitted to Transport Authority for review.');
        setIsChangeRequestModalOpen(false);
        setChangeReqJustification('');
        setChangeReqDetails('');
        await fetchAllTourOperatorData();
      } else {
        const err = await res.json().catch(() => ({}));
        showNotification('error', err.detail || 'Failed to submit change request');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Error submitting request');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuideName) return;
    const g: TourGuideData = {
      id: `guide-${Date.now()}`,
      fullName: newGuideName,
      phone: newGuidePhone || '+91 98400 00000',
      email: newGuideEmail,
      languages: ['English', 'Hindi', 'Malayalam'],
      specialty: newGuideSpecialty,
      badgeNumber: newGuideBadge || 'KTDC-EXP-992',
      rating: 4.95,
      status: 'ACTIVE'
    };
    setGuides([...guides, g]);
    setIsAddGuideOpen(false);
    setNewGuideName('');
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;
    const sch: TourScheduleData = {
      id: `sch-${Date.now()}`,
      startDate: newSchedStart,
      endDate: newSchedEnd,
      batchCapacity: selectedPackage.maxCapacityPerBatch,
      bookedSeats: 0,
      status: 'OPEN',
      guideName: newSchedGuide
    };
    const updated = {
      ...selectedPackage,
      schedules: [...(selectedPackage.schedules || []), sch]
    };
    setSelectedPackage(updated);
    setPackages(packages.map(p => p.id === updated.id ? updated : p));
    setIsAddScheduleOpen(false);
  };

  const filteredPackages = packages.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.destinationName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const grossRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const totalTravelers = bookings.reduce((sum, b) => sum + b.travelersCount, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Top Banner & Partner Role Identification */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border-b border-emerald-800/30 px-6 py-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Tour Operator Operations Hub</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                  TOUR_OPERATOR
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-2">
                <span>{user.name || 'Kerala Discovery Tours'}</span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Govt Certified Tour Creator
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <KeyRound className="w-4 h-4 text-emerald-400" />
              Change Password
            </button>

            <button
              onClick={() => setIsCreatePackageOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              Create New Package
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {[
            { id: 'packages', label: 'Tour Packages', icon: Layers },
            { id: 'itinerary', label: 'Day-Wise Itineraries', icon: MapPin },
            { id: 'guides', label: 'Tour Guides Roster', icon: Award },
            { id: 'schedules', label: 'Departure Batches', icon: Calendar },
            { id: 'bookings', label: 'Bookings & Manifest', icon: Users },
            { id: 'transport', label: 'Transport & Fleet Credential', icon: ShieldCheck },
            { id: 'analytics', label: 'Revenue & Analytics', icon: TrendingUp }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: TOUR PACKAGES */}
        {activeTab === 'packages' && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tour packages by title, region..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">All Categories</option>
                  <option value="eco_adventure">Eco Adventure</option>
                  <option value="heritage">Heritage & Cultural</option>
                  <option value="romantic_getaway">Romantic Getaway</option>
                  <option value="wellness_ayurveda">Wellness & Ayurveda</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map(pkg => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`bg-slate-900/80 border rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col justify-between ${
                    selectedPackage?.id === pkg.id ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-800'
                  }`}
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                      <img
                        src={pkg.coverImageUrl || 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=600&auto=format&fit=crop&q=80'}
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all"
                      />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                        {pkg.category.replace('_', ' ')}
                      </div>
                      <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-950/80 text-white">
                        {pkg.durationDays}D / {pkg.durationNights}N
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <MapPin className="w-3.5 h-3.5" />
                        {pkg.destinationName}
                      </div>

                      <h3 className="text-base font-bold text-white mt-1 leading-snug">{pkg.title}</h3>

                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-300" /> Max {pkg.maxCapacityPerBatch} pax
                        </span>
                        <span className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {pkg.rating} ({pkg.totalBookings} booked)
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {pkg.inclusions.slice(0, 3).map((inc, i) => (
                          <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                            ✓ {inc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-800/80 flex items-center justify-between mt-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-500">From</span>
                      <div className="text-lg font-bold text-white">
                        ₹{pkg.basePriceINR.toLocaleString('en-IN')}
                        <span className="text-xs font-normal text-slate-400"> / pax</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPackage(pkg);
                        setActiveTab('itinerary');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold flex items-center gap-1"
                    >
                      View Itinerary <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: DAY-WISE ITINERARY BUILDER */}
        {activeTab === 'itinerary' && selectedPackage && (
          <div className="mt-6 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Itinerary Master Plan</span>
                <h2 className="text-xl font-bold text-white mt-1">{selectedPackage.title}</h2>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedPackage.durationDays} Days • {selectedPackage.durationNights} Nights • Guide: {selectedPackage.guideRequirement}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const newDay: TourItineraryDayData = {
                      id: `day-${Date.now()}`,
                      dayNumber: (selectedPackage.itineraryDays?.length || 0) + 1,
                      title: `Day ${(selectedPackage.itineraryDays?.length || 0) + 1}: Custom Experiential Trail`,
                      description: 'Guided cultural immersion, local craft engagement, and authentic regional gastronomy.',
                      mealsIncluded: ['Breakfast', 'Local Lunch'],
                      overnightStay: 'Heritage Tea Estate Cottage',
                      activities: [
                        {
                          activityName: 'Guided Nature Exploration',
                          activityType: 'TREK',
                          startTime: '09:00 AM',
                          durationHours: 2.5,
                          locationName: 'Plantation Ridge Trail'
                        }
                      ]
                    };
                    const updated = {
                      ...selectedPackage,
                      itineraryDays: [...(selectedPackage.itineraryDays || []), newDay]
                    };
                    setSelectedPackage(updated);
                    setPackages(packages.map(p => p.id === updated.id ? updated : p));
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Itinerary Day
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {selectedPackage.itineraryDays && selectedPackage.itineraryDays.length > 0 ? (
                selectedPackage.itineraryDays.map((day) => (
                  <div key={day.id || day.dayNumber} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-sm flex items-center justify-center border border-emerald-500/30">
                          D{day.dayNumber}
                        </span>
                        <div>
                          <h4 className="text-base font-bold text-white">{day.title}</h4>
                          <p className="text-xs text-slate-400 mt-1 max-w-2xl">{day.description}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Stay</span>
                        <span className="text-xs text-slate-300 font-medium">{day.overnightStay || 'Resort Stay'}</span>
                      </div>
                    </div>

                    {/* Activities List */}
                    <div className="mt-4 pl-12 border-l-2 border-emerald-800/40 space-y-3">
                      {day.activities && day.activities.map((act, ai) => (
                        <div key={ai} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                              {act.startTime} ({act.durationHours}h)
                            </span>
                            <div>
                              <span className="text-xs font-semibold text-white">{act.activityName}</span>
                              <span className="text-[11px] text-slate-400 block">{act.locationName} • {act.activityType}</span>
                            </div>
                          </div>

                          <span className="text-xs text-emerald-400 font-medium">Included</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center gap-2 pl-12">
                      <span className="text-[11px] text-slate-400 font-medium">Meals:</span>
                      {day.mealsIncluded.map((meal, mi) => (
                        <span key={mi} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                          🍴 {meal}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-12 text-center">
                  <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h4 className="text-base font-semibold text-slate-300">No Day-Wise Itinerary Created Yet</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Click "Add Itinerary Day" above to start structuring timed morning treks, cultural lunches, and storytelling walks.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: TOUR GUIDES ROSTER */}
        {activeTab === 'guides' && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Storyteller Guides & Naturalists</h2>
                <p className="text-xs text-slate-400">Govt-licensed guides assigned to leading high-touch group batches</p>
              </div>

              <button
                onClick={() => setIsAddGuideOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <Plus className="w-4 h-4" /> Onboard Storyteller Guide
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guides.map(guide => (
                <div key={guide.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-bold text-base">
                          {guide.fullName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white">{guide.fullName}</h4>
                          <span className="text-xs text-emerald-400 font-medium">{guide.specialty}</span>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {guide.status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-xs text-slate-300">
                      <div className="flex items-center justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-500">Govt Badge</span>
                        <span className="font-mono text-slate-200">{guide.badgeNumber || 'KTDC-EXP-001'}</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-500">Contact</span>
                        <span>{guide.phone}</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-slate-500">Languages</span>
                        <div className="flex flex-wrap gap-1">
                          {guide.languages.map((l, i) => (
                            <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                              {l}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {guide.rating} Rating
                    </div>
                    <button className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold">
                      Assign to Departures →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DEPARTURE BATCHES & SCHEDULES */}
        {activeTab === 'schedules' && selectedPackage && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Departure Batches & Calendar</h2>
                <p className="text-xs text-slate-400">Manage fixed departure dates and seat capacities for: <strong className="text-slate-200">{selectedPackage.title}</strong></p>
              </div>

              <button
                onClick={() => setIsAddScheduleOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Open New Departure Batch
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedPackage.schedules && selectedPackage.schedules.map(sch => {
                const occupancyPct = Math.round((sch.bookedSeats / sch.batchCapacity) * 100);
                return (
                  <div key={sch.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {sch.startDate} ➔ {sch.endDate}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sch.status === 'SOLD_OUT' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {sch.status}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
                        <span>Booked Seats</span>
                        <span>{sch.bookedSeats} / {sch.batchCapacity} ({occupancyPct}%)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${occupancyPct >= 100 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                          style={{ width: `${occupancyPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                      <span>Lead Guide:</span>
                      <span className="font-semibold text-slate-200">{sch.guideName || 'Unassigned'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: PASSENGER BOOKINGS & ROSTER */}
        {activeTab === 'bookings' && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Confirmed Passenger Roster</h2>
                <p className="text-xs text-slate-400">All registered travelers across tour package batches</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500">Gross Ticket Volume</span>
                <div className="text-lg font-bold text-emerald-400">₹{grossRevenue.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Booking Ref</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Tour Package</th>
                      <th className="px-6 py-4">Travelers</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Special Notes</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {bookings.map(b => (
                      <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4 font-mono text-emerald-400 font-semibold">{b.bookingId || b.id}</td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-white">{b.customerName}</div>
                          <div className="text-slate-400 text-[11px]">{b.customerPhone}</div>
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate text-slate-200">{b.packageTitle}</td>
                        <td className="px-6 py-4 font-semibold text-slate-100">{b.travelersCount} Pax</td>
                        <td className="px-6 py-4 font-bold text-white">₹{b.totalPrice.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 text-slate-400 max-w-xs truncate">{b.specialRequests || 'None'}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: TRANSPORT & FLEET CREDENTIAL (READ-ONLY ASSIGNMENTS + CHANGE REQUESTS) */}
        {activeTab === 'transport' && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Official Transport Credential & Linked Fleet
                </h2>
                <p className="text-xs text-slate-400">
                  Authorized by Transport Admin. Fleet vehicles and chauffeurs are read-only assignments. Submit change requests for upgrades.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchAllTourOperatorData}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
                <button
                  onClick={() => setIsChangeRequestModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <Send className="w-4 h-4" /> Submit Change Request
                </button>
              </div>
            </div>

            {/* Official Transport Credential Card */}
            {credential ? (
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-3xl p-6 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                        {credential.credentialNumber}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        credential.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {credential.status}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {credential.complianceStatus}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      Transport Operations Clearance
                    </h3>
                    <p className="text-xs text-slate-400">
                      Issued by <span className="text-emerald-400 font-semibold">{credential.issuedByName || 'Transport Authority'}</span> on{' '}
                      {credential.issuedAt ? new Date(credential.issuedAt).toLocaleDateString() : 'Active Session'}
                    </p>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-xs space-y-1">
                    <div className="text-slate-400">Authority Verification:</div>
                    <div className="font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      DIGILOCKER_AUTHENTICATED
                    </div>
                  </div>
                </div>

                {credential.notes && (
                  <div className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-300 italic">
                    “{credential.notes}”
                  </div>
                )}

                {/* Assigned Resources Roster */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  {/* Assigned Fleet Vehicles (Read Only) */}
                  <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800/80">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Car className="w-4 h-4 text-emerald-400" />
                        Assigned Fleet Vehicles (Read-Only)
                      </h4>
                      <span className="text-[10px] text-slate-400 font-semibold bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                        {(credential.assignedVehicles || []).filter(v => v.status === 'ACTIVE').length} Vehicles Assigned
                      </span>
                    </div>

                    {(credential.assignedVehicles || []).filter(v => v.status === 'ACTIVE').length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-4 text-center">
                        No fleet vehicles assigned yet. Submit a Change Request to request vehicles.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {(credential.assignedVehicles || []).filter(v => v.status === 'ACTIVE').map(av => (
                          <div key={av.id} className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl">
                            <div className="flex items-start justify-between">
                              <div>
                                <h5 className="text-sm font-bold text-white">{av.vehicle?.name || av.vehicleId}</h5>
                                <div className="font-mono text-xs text-emerald-400 mt-0.5">
                                  {av.vehicle?.registrationNumber || 'Fleet Unit'}
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                                {av.vehicle?.category || 'MUV'}
                              </span>
                            </div>

                            <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                              <div>
                                <span className="block text-slate-500 text-[9px] uppercase">Capacity</span>
                                <span className="font-semibold text-slate-200">{av.vehicle?.seatingCapacity || 7} Seats</span>
                              </div>
                              <div>
                                <span className="block text-slate-500 text-[9px] uppercase">Fuel & AC</span>
                                <span className="font-semibold text-slate-200">{av.vehicle?.fuelType || 'Diesel'} • AC</span>
                              </div>
                              <div>
                                <span className="block text-slate-500 text-[9px] uppercase">Daily Rate</span>
                                <span className="font-semibold text-emerald-400">₹{av.vehicle?.dailyRate || 4500}/day</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Assigned Chauffeurs (Read Only) */}
                  <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800/80">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-blue-400" />
                        Assigned Vetted Chauffeurs (Read-Only)
                      </h4>
                      <span className="text-[10px] text-slate-400 font-semibold bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                        {(credential.assignedDrivers || []).filter(d => d.status === 'ACTIVE').length} Drivers Assigned
                      </span>
                    </div>

                    {(credential.assignedDrivers || []).filter(d => d.status === 'ACTIVE').length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-4 text-center">
                        No chauffeurs assigned yet. Submit a Change Request to request driver allocations.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {(credential.assignedDrivers || []).filter(d => d.status === 'ACTIVE').map(ad => (
                          <div key={ad.id} className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center text-sm">
                                  {ad.driver?.fullName?.charAt(0) || 'D'}
                                </div>
                                <div>
                                  <h5 className="text-sm font-bold text-white">{ad.driver?.fullName || ad.driverId}</h5>
                                  <div className="text-xs text-slate-400">{ad.driver?.phone}</div>
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                {ad.driver?.policeVerificationStatus || 'VERIFIED'}
                              </span>
                            </div>

                            <div className="mt-3 text-[11px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
                              <span>DL: <strong className="font-mono text-slate-200">{ad.driver?.drivingLicense || 'Verified'}</strong></span>
                              <span className="text-slate-300 truncate max-w-xs">{ad.driver?.languages?.join(', ') || 'English, Hindi'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No Active Transport Credential</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  Your transport credential is being reviewed by Transport Admin. Once issued, your assigned fleet vehicles and chauffeurs will automatically appear here.
                </p>
              </div>
            )}

            {/* Change Requests History */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    Fleet Change Requests History
                  </h3>
                  <p className="text-xs text-slate-400">Formal requests sent to Transport Authority for review</p>
                </div>
                <button
                  onClick={() => setIsChangeRequestModalOpen(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> New Request
                </button>
              </div>

              {changeRequests.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4 text-center">No change requests submitted yet.</p>
              ) : (
                <div className="space-y-3">
                  {changeRequests.map(cr => (
                    <div key={cr.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {cr.requestType}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            cr.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            cr.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                            'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {cr.status}
                          </span>
                        </div>
                        <span className="text-slate-500 text-[11px]">
                          {cr.createdAt ? new Date(cr.createdAt).toLocaleString() : ''}
                        </span>
                      </div>

                      <div className="mt-2 text-slate-300">
                        <strong>Justification:</strong> {cr.justification}
                      </div>

                      {cr.reviewerNotes && (
                        <div className="mt-2 p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                          <strong className="text-emerald-400">Authority Feedback:</strong> {cr.reviewerNotes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Gross Tour Revenue</span>
                <div className="text-2xl font-bold text-white mt-1">₹{grossRevenue.toLocaleString('en-IN')}</div>
                <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" /> +24% vs last month
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Total Travelers</span>
                <div className="text-2xl font-bold text-white mt-1">{totalTravelers} Passengers</div>
                <div className="mt-2 text-xs text-slate-500">Across 2 Active Packages</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Certified Guides</span>
                <div className="text-2xl font-bold text-white mt-1">{guides.length} Naturalists</div>
                <div className="mt-2 text-xs text-emerald-400">100% Verified Credentials</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Average Rating</span>
                <div className="text-2xl font-bold text-amber-400 mt-1 flex items-center gap-1">
                  <Star className="w-6 h-6 fill-amber-400" /> 4.93 / 5.0
                </div>
                <div className="mt-2 text-xs text-slate-500">Based on 47 reviews</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-4">Tour Operator Compliance & Direct Payouts</h3>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h5 className="text-sm font-semibold text-white">Direct-to-Operator Settlement Account</h5>
                    <p className="text-xs text-slate-400">Zero platform commissions. 100% of tour revenue wired via automated RTGS/UPI payout.</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">SETTLED_DAILY</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CREATE PACKAGE MODAL */}
      {isCreatePackageOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Create New Tour Package</h3>
              <button onClick={() => setIsCreatePackageOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePackage} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Tour Package Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5-Day Wayanad Rainforest & Mist Trek"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Primary Destination Key</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. shimla, kerala, goa, ladakh"
                    value={newDestination}
                    onChange={e => {
                      const val = e.target.value;
                      setNewDestination(val);
                      if (!newDestName || newDestName.includes('Explorer')) {
                        setNewDestName(`${val.charAt(0).toUpperCase() + val.slice(1)} Guided Explorer`);
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="eco_adventure">Eco Adventure</option>
                    <option value="heritage">Heritage Walk</option>
                    <option value="wellness_ayurveda">Wellness & Ayurveda</option>
                    <option value="wildlife_safari">Wildlife Safari</option>
                    <option value="romantic_getaway">Romantic Getaway</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Multi-Destination Discovery Keys (Comma-Separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. shimla, kufri, chail, mashobra, himachal"
                  value={newDestinationsInput}
                  onChange={e => setNewDestinationsInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Customers searching any of these destination keywords will dynamically discover this tour in real-time.
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={newDays}
                    onChange={e => setNewDays(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    min="1000"
                    value={newPrice}
                    onChange={e => setNewPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Batch Capacity</label>
                  <input
                    type="number"
                    min="2"
                    max="30"
                    value={newCapacity}
                    onChange={e => setNewCapacity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreatePackageOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Publish Tour Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD GUIDE MODAL */}
      {isAddGuideOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Onboard Storyteller Guide</h3>
              <button onClick={() => setIsAddGuideOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGuide} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Varma"
                  value={newGuideName}
                  onChange={e => setNewGuideName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98470 00000"
                  value={newGuidePhone}
                  onChange={e => setNewGuidePhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Govt Tourism Badge Number</label>
                <input
                  type="text"
                  placeholder="e.g. KTDC-GD-2024-918"
                  value={newGuideBadge}
                  onChange={e => setNewGuideBadge(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddGuideOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Save Guide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD SCHEDULE MODAL */}
      {isAddScheduleOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Open Departure Batch</h3>
              <button onClick={() => setIsAddScheduleOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSchedule} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newSchedStart}
                    onChange={e => setNewSchedStart(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={newSchedEnd}
                    onChange={e => setNewSchedEnd(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Assign Lead Guide</label>
                <select
                  value={newSchedGuide}
                  onChange={e => setNewSchedGuide(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  {guides.map(g => (
                    <option key={g.id} value={g.fullName}>{g.fullName} ({g.specialty})</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddScheduleOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Open Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBMIT CHANGE REQUEST MODAL */}
      {isChangeRequestModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-400" />
                  Submit Transport Change Request
                </h3>
                <p className="text-xs text-slate-400">Request fleet vehicle / chauffeur additions or replacements</p>
              </div>
              <button onClick={() => setIsChangeRequestModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitChangeRequest} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Request Type *</label>
                <select
                  value={changeReqType}
                  onChange={(e: any) => setChangeReqType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="VEHICLE_ADDITION">Vehicle Addition (Need more fleet vehicles)</option>
                  <option value="VEHICLE_REPLACEMENT">Vehicle Replacement (Upgrade / Substitution)</option>
                  <option value="DRIVER_ADDITION">Chauffeur Addition (Need additional drivers)</option>
                  <option value="DRIVER_REPLACEMENT">Chauffeur Replacement (Substitution)</option>
                  <option value="CAPACITY_UPGRADE">Capacity Upgrade (Tempo Traveller / Bus)</option>
                  <option value="OTHER">Other Fleet Inquiries</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Detailed Operational Justification *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Scaling Shimla winter snow expeditions. High customer demand requires 2 additional 4x4 MUVs."
                  value={changeReqJustification}
                  onChange={e => setChangeReqJustification(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Specific Requirements / Target Specs (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 7-seater Toyota Innova Crysta or Force Traveller 12-seater"
                  value={changeReqDetails}
                  onChange={e => setChangeReqDetails(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsChangeRequestModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  {loading ? 'Submitting...' : 'Submit to Transport Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING STATUS TOAST */}
      {statusMsg && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border text-xs font-semibold shadow-2xl flex items-center gap-2 transition-all ${
          statusMsg.type === 'success'
            ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40 shadow-emerald-900/40'
            : 'bg-rose-950/90 text-rose-300 border-rose-500/40 shadow-rose-900/40'
        }`}>
          {statusMsg.type === 'success' ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
          {statusMsg.text}
        </div>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};
