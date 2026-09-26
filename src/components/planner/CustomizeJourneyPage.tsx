// Changes made by @MdFarhanAhmad
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Plus, 
  Compass, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  Car, 
  Hotel as HotelIcon, 
  Activity, 
  Bookmark, 
  ChevronRight, 
  Search, 
  IndianRupee, 
  X, 
  Layers, 
  Info,
  Check,
  Plane,
  Edit3
} from 'lucide-react';
import { 
  DestinationSuggestion, 
  DestinationCatalogItem, 
  DestinationActivityItem,
  CustomJourneyRecord, 
  CustomItineraryDay,
  UserSession,
  BookingRecord
} from '../../types';
import { DestinationSuggestionPanel } from './DestinationSuggestionPanel';
import { DayWiseItineraryBuilder } from './DayWiseItineraryBuilder';
import { ActivitySelectionModal } from './ActivitySelectionModal';

interface CustomizeJourneyPageProps {
  user: UserSession | null;
  onOpenAuth: () => void;
  onBackToHome: () => void;
  onProceedToBooking: (journey: CustomJourneyRecord) => void;
  initialJourney?: CustomJourneyRecord | null;
  onSaveFeedback?: (msg: string) => void;
}

interface SegmentTransit {
  origin: string;
  destination: string;
  distanceKm: number;
  estimatedTravelHours: number;
  mode: string;
}

const PREFERENCE_OPTIONS = [
  'Nature',
  'Adventure',
  'Culture',
  'Heritage',
  'Beach',
  'Wildlife',
  'Food',
  'Relaxation',
  'Spiritual',
  'Shopping'
];

export const CustomizeJourneyPage: React.FC<CustomizeJourneyPageProps> = ({
  user,
  onOpenAuth,
  onBackToHome,
  onProceedToBooking,
  initialJourney,
  onSaveFeedback
}) => {
  // 1. Catalog & Starting Hubs State
  const [startingLocations, setStartingLocations] = useState<{ name: string; state: string; code: string }[]>([
    { name: 'Hyderabad', state: 'Telangana', code: 'HYD' },
    { name: 'Kochi', state: 'Kerala', code: 'COK' },
    { name: 'Bengaluru', state: 'Karnataka', code: 'BLR' },
    { name: 'Delhi NCR', state: 'Delhi', code: 'DEL' },
    { name: 'Mumbai', state: 'Maharashtra', code: 'BOM' },
    { name: 'Chennai', state: 'Tamil Nadu', code: 'MAA' },
    { name: 'Jaipur', state: 'Rajasthan', code: 'JAI' },
    { name: 'Goa', state: 'Goa', code: 'GOI' }
  ]);

  const [destinationCatalog, setDestinationCatalog] = useState<DestinationCatalogItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [destinationSelectorOpen, setDestinationSelectorOpen] = useState(false);

  // 2. Journey Configuration State
  const [journeyId, setJourneyId] = useState<string | null>(initialJourney?.id || null);
  const [journeyTitle, setJourneyTitle] = useState(initialJourney?.title || 'My Custom Indian Journey');
  const [startingLocation, setStartingLocation] = useState(initialJourney?.startLocation || 'Hyderabad');
  const [startDate, setStartDate] = useState(initialJourney?.startDate || '2026-10-14');
  const [endDate, setEndDate] = useState(initialJourney?.endDate || '2026-10-19');
  const [adultsCount, setAdultsCount] = useState(initialJourney?.adultsCount || 2);
  const [childrenCount, setChildrenCount] = useState(initialJourney?.childrenCount || 0);
  const [budgetINR, setBudgetINR] = useState<number | ''>(initialJourney?.budgetINR || '');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(
    initialJourney?.preferences && initialJourney.preferences.length > 0 
      ? initialJourney.preferences 
      : ['Nature', 'Culture', 'Relaxation']
  );

  // 3. Multi-Destination Selected Stops
  const [selectedDestinations, setSelectedDestinations] = useState<{
    key: string;
    name: string;
    state: string;
    stayNights: number;
    image: string;
    selectedHotelId?: string;
    selectedHotelName?: string;
    selectedRoomPrice?: number;
    selectedActivities?: { id: string; name: string; cost: number; duration: string }[];
  }[]>(
    initialJourney?.destinations?.map(d => ({
      key: d.destinationKey,
      name: d.destinationName,
      state: 'India',
      stayNights: d.stayNights || 2,
      image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=600&auto=format&fit=crop&q=80',
      selectedHotelId: d.selectedHotelId || undefined,
      selectedHotelName: d.selectedHotelName || undefined,
      selectedActivities: d.selectedActivities || []
    })) || []
  );

  // 4. Recommendations State
  const [suggestions, setSuggestions] = useState<DestinationSuggestion[]>([]);
  const [recommendedHotels, setRecommendedHotels] = useState<Record<string, any[]>>({});
  const [recommendedActivities, setRecommendedActivities] = useState<Record<string, any[]>>({});
  const [transportSegments, setTransportSegments] = useState<any[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  // 5. Itinerary & Cost Breakdown State
  const [itineraryDays, setItineraryDays] = useState<CustomItineraryDay[]>(
    initialJourney?.itinerary || []
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'route' | 'hotels' | 'activities' | 'itinerary'>('route');

  // Synchronize state when initialJourney changes (e.g. switching between new and saved journey)
  useEffect(() => {
    if (initialJourney) {
      setJourneyId(initialJourney.id || null);
      setJourneyTitle(initialJourney.title || 'My Custom Indian Journey');
      setStartingLocation(initialJourney.startLocation || 'Hyderabad');
      setStartDate(initialJourney.startDate || '2026-10-14');
      setEndDate(initialJourney.endDate || '2026-10-18');
      setAdultsCount(initialJourney.adultsCount || 2);
      setChildrenCount(initialJourney.childrenCount || 0);
      setBudgetINR(initialJourney.budgetINR || '');
      setSelectedPreferences(initialJourney.preferences || ['Nature', 'Culture', 'Relaxation']);
      setSelectedDestinations(
        initialJourney.destinations?.map(d => ({
          key: d.destinationKey,
          name: d.destinationName,
          state: 'India',
          stayNights: d.stayNights || 2,
          image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=600&auto=format&fit=crop&q=80',
          selectedHotelId: d.selectedHotelId || undefined,
          selectedHotelName: d.selectedHotelName || undefined,
          selectedActivities: d.selectedActivities || []
        })) || []
      );
      if (initialJourney.itinerary && initialJourney.itinerary.length > 0) {
        setItineraryDays(initialJourney.itinerary);
      }
    } else {
      setJourneyId(null);
      setJourneyTitle('My Custom Indian Journey');
      setStartingLocation('Hyderabad');
      setStartDate('2026-10-14');
      setEndDate('2026-10-18');
      setAdultsCount(2);
      setChildrenCount(0);
      setBudgetINR('');
      setSelectedPreferences(['Nature', 'Culture', 'Relaxation']);
      setSelectedDestinations([]);
      setItineraryDays([]);
    }
  }, [initialJourney]);

  // Load destination catalog on mount
  useEffect(() => {
    fetch('/api/v1/custom-journeys/destinations')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          if (data.startingLocations) setStartingLocations(data.startingLocations);
          if (data.destinations) setDestinationCatalog(data.destinations);
        }
      })
      .catch(err => console.error('Failed to load destinations catalog:', err));
  }, []);

  // Fetch intelligent recommendations whenever destinations, preferences, or starting location change
  useEffect(() => {
    if (selectedDestinations.length === 0) {
      setSuggestions([]);
      return;
    }

    setIsLoadingRecommendations(true);
    const destKeys = selectedDestinations.map(d => d.key);

    fetch('/api/v1/custom-journeys/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        selected_destinations: destKeys,
        starting_location: startingLocation,
        user_preferences: selectedPreferences,
        budget_inr: budgetINR ? Number(budgetINR) : undefined,
        total_duration_days: calculateTotalNights() + 1
      })
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setSuggestions(data.recommendedDestinations || []);
          setRecommendedHotels(data.recommendedHotels || {});
          setRecommendedActivities(data.recommendedActivities || {});
          setTransportSegments(data.transportSegments || []);
        }
      })
      .catch(err => console.error('Failed to fetch recommendations:', err))
      .finally(() => setIsLoadingRecommendations(false));
  }, [selectedDestinations.map(d => d.key).join(','), selectedPreferences, startingLocation, budgetINR]);

  // Calculate total nights
  const calculateTotalNights = () => {
    return selectedDestinations.reduce((acc, d) => acc + (d.stayNights || 1), 0);
  };

  // Re-generate day-by-day custom itinerary when destinations or stays change while preserving user-assigned activities
  useEffect(() => {
    setItineraryDays(prevDays => {
      const newDays: CustomItineraryDay[] = [];
      let currentDayNum = 1;
      const baseDate = new Date(startDate || '2026-10-14');

      // Group previous activities by destinationKey
      const prevDaysByDestKey: Record<string, CustomItineraryDay[]> = {};
      prevDays.forEach(pd => {
        const key = (pd.destinationKey || pd.destinationName || '').toLowerCase();
        if (!prevDaysByDestKey[key]) prevDaysByDestKey[key] = [];
        prevDaysByDestKey[key].push(pd);
      });

      selectedDestinations.forEach((dest, dIdx) => {
        const stayNights = dest.stayNights || 1;
        const destKey = dest.key.toLowerCase();
        const existingForDest = prevDaysByDestKey[destKey] || [];

        for (let n = 0; n < stayNights; n++) {
          const d = new Date(baseDate);
          d.setDate(baseDate.getDate() + (currentDayNum - 1));
          const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

          // Preserve activities from existing day if available
          let dayActs: any[] = [];
          if (existingForDest[n] && existingForDest[n].activities && existingForDest[n].activities.length > 0) {
            dayActs = existingForDest[n].activities;
          } else if (dest.selectedActivities && dest.selectedActivities.length > 0) {
            dayActs = dest.selectedActivities.map((act, aIdx) => ({
              id: act.id,
              time: aIdx === 0 ? '09:30 AM' : '02:30 PM',
              timeOfDay: act.timeOfDay || (aIdx === 0 ? 'Morning' : 'Afternoon'),
              name: act.name,
              type: 'Curated Experience',
              category: act.category,
              cost: act.cost ?? act.approxCostInr ?? 0,
              approxCostInr: act.approxCostInr ?? act.cost ?? 0,
              duration: act.duration || `${act.durationHours || 2.0} hrs`,
              durationHours: act.durationHours || 2.0,
              locationName: act.locationName || dest.name,
              description: act.description
            }));
          } else {
            dayActs = [
              {
                id: `act-${dest.key}-default-${n}`,
                time: '10:00 AM',
                timeOfDay: 'Morning',
                name: `${dest.name} Highlights & Scenic Exploration`,
                type: 'Local Sightseeing',
                category: 'Heritage',
                cost: 0,
                approxCostInr: 0,
                duration: '2.5 hrs',
                durationHours: 2.5,
                locationName: dest.name,
                description: `Explore the top scenic sights and local landmarks in ${dest.name}.`
              }
            ];
          }

          newDays.push({
            dayNumber: currentDayNum,
            title: n === 0 && dIdx > 0 
              ? `Arrival in ${dest.name} & Check-in` 
              : `${dest.name} Discovery & Leisure`,
            destinationKey: dest.key,
            destinationName: dest.name,
            date: dateStr,
            activities: dayActs,
            overnightStay: dest.selectedHotelName || `${dest.name} Verified Homestay / Resort`,
            hotelCost: dest.selectedRoomPrice || 2400
          });

          currentDayNum++;
        }
      });

      return newDays;
    });
  }, [selectedDestinations.map(d => `${d.key}-${d.stayNights}-${d.selectedHotelName}`).join(','), startDate]);

  // Estimate costs dynamically based on real day activities & hotels
  const calculateCostEstimate = () => {
    const nights = calculateTotalNights();
    const hotelCost = selectedDestinations.reduce((sum, d) => sum + ((d.selectedRoomPrice || 2400) * (d.stayNights || 1)), 0);
    const transportCost = Math.max(3500, selectedDestinations.length * 2800);
    const activityCost = itineraryDays.reduce((sum, day) => {
      const dayActsTotal = (day.activities || []).reduce((aSum, a) => aSum + (a.cost || a.approxCostInr || 0), 0);
      return sum + dayActsTotal;
    }, 0);

    return {
      hotels: hotelCost,
      transport: transportCost,
      activities: activityCost,
      total: hotelCost + transportCost + activityCost
    };
  };

  // Day-wise Activity manipulation handlers
  const handleAddActivityToDay = (dayNumber: number, act: DestinationActivityItem) => {
    setItineraryDays(prev => prev.map(d => {
      if (d.dayNumber === dayNumber) {
        const existingActs = d.activities || [];
        const newAct = {
          id: act.id,
          time: act.timeOfDay || (existingActs.length === 0 ? '09:30 AM' : existingActs.length === 1 ? '02:30 PM' : '05:00 PM'),
          timeOfDay: act.timeOfDay || 'Morning',
          name: act.name,
          type: 'Curated Experience',
          category: act.category,
          cost: act.cost ?? act.approxCostInr ?? 0,
          approxCostInr: act.approxCostInr ?? act.cost ?? 0,
          duration: act.duration || `${act.durationHours || 2.0} hrs`,
          durationHours: act.durationHours || 2.0,
          locationName: act.locationName || d.destinationName,
          description: act.description
        };
        return {
          ...d,
          activities: [...existingActs, newAct]
        };
      }
      return d;
    }));
  };

  const handleRemoveActivityFromDay = (dayNumber: number, activityIndex: number) => {
    setItineraryDays(prev => prev.map(d => {
      if (d.dayNumber === dayNumber) {
        const updatedActs = (d.activities || []).filter((_, i) => i !== activityIndex);
        return { ...d, activities: updatedActs };
      }
      return d;
    }));
  };

  const handleReorderActivityInDay = (dayNumber: number, fromIndex: number, toIndex: number) => {
    setItineraryDays(prev => prev.map(d => {
      if (d.dayNumber === dayNumber) {
        const acts = [...(d.activities || [])];
        if (toIndex < 0 || toIndex >= acts.length) return d;
        const temp = acts[fromIndex];
        acts[fromIndex] = acts[toIndex];
        acts[toIndex] = temp;
        return { ...d, activities: acts };
      }
      return d;
    }));
  };

  const handleMoveActivityToDay = (fromDayNumber: number, toDayNumber: number, activityIndex: number) => {
    setItineraryDays(prev => {
      const fromDay = prev.find(d => d.dayNumber === fromDayNumber);
      if (!fromDay || !fromDay.activities || !fromDay.activities[activityIndex]) return prev;
      const movedActivity = fromDay.activities[activityIndex];

      return prev.map(d => {
        if (d.dayNumber === fromDayNumber) {
          return {
            ...d,
            activities: (d.activities || []).filter((_, i) => i !== activityIndex)
          };
        }
        if (d.dayNumber === toDayNumber) {
          return {
            ...d,
            activities: [...(d.activities || []), movedActivity]
          };
        }
        return d;
      });
    });
  };

  // Destination manipulation handlers
  const handleAddDestinationFromSuggestion = (sug: DestinationSuggestion) => {
    if (selectedDestinations.some(d => d.key === sug.key)) return;
    setSelectedDestinations(prev => [
      ...prev,
      {
        key: sug.key,
        name: sug.name,
        state: sug.state,
        stayNights: sug.recommendedStayNights || 2,
        image: sug.image,
        selectedActivities: sug.popularActivities?.slice(0, 1) || []
      }
    ]);
  };

  const handleAddDestinationFromCatalog = (catItem: DestinationCatalogItem) => {
    if (selectedDestinations.some(d => d.key === catItem.key)) return;
    setSelectedDestinations(prev => [
      ...prev,
      {
        key: catItem.key,
        name: catItem.name,
        state: catItem.state,
        stayNights: catItem.recommended_stay_nights || 2,
        image: catItem.image,
        selectedActivities: catItem.popular_activities?.slice(0, 1) || []
      }
    ]);
    setDestinationSelectorOpen(false);
  };

  const handleRemoveDestination = (index: number) => {
    setSelectedDestinations(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setSelectedDestinations(prev => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      return updated;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === selectedDestinations.length - 1) return;
    setSelectedDestinations(prev => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      return updated;
    });
  };

  const handleNightsChange = (index: number, delta: number) => {
    setSelectedDestinations(prev => {
      const updated = [...prev];
      const current = updated[index].stayNights || 1;
      const nextNights = Math.max(1, Math.min(7, current + delta));
      updated[index] = { ...updated[index], stayNights: nextNights };
      return updated;
    });
  };

  const handleTogglePreference = (pref: string) => {
    setSelectedPreferences(prev => 
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const handleSelectHotel = (destKey: string, hotel: any) => {
    setSelectedDestinations(prev => prev.map(d => {
      if (d.key === destKey) {
        return {
          ...d,
          selectedHotelId: hotel.id,
          selectedHotelName: hotel.propertyName,
          selectedRoomPrice: hotel.basePriceINR
        };
      }
      return d;
    }));
  };

  const handleToggleActivity = (destKey: string, activity: any) => {
    // Check if this activity is already on any day
    const isAlreadyAdded = itineraryDays.some(d => 
      (d.activities || []).some(a => a.id === activity.id || a.name === activity.name)
    );

    if (isAlreadyAdded) {
      // Remove from all days
      setItineraryDays(prev => prev.map(d => ({
        ...d,
        activities: (d.activities || []).filter(a => a.id !== activity.id && a.name !== activity.name)
      })));
    } else {
      // Find first day of this destination
      const targetDay = itineraryDays.find(
        d => (d.destinationKey || d.destinationName).toLowerCase() === destKey.toLowerCase()
      );
      const targetDayNum = targetDay ? targetDay.dayNumber : 1;

      handleAddActivityToDay(targetDayNum, {
        id: activity.id || `act-${Math.random().toString(36).substr(2, 9)}`,
        destinationKey: destKey,
        name: activity.name,
        category: activity.category || 'Culture',
        cost: activity.cost ?? activity.approxCostInr ?? 0,
        approxCostInr: activity.approxCostInr ?? activity.cost ?? 0,
        duration: activity.duration || `${activity.durationHours || 2.0} hrs`,
        durationHours: activity.durationHours || 2.0,
        timeOfDay: activity.timeOfDay || 'Morning',
        locationName: activity.locationName,
        description: activity.description
      });
    }
  };

  // Save Custom Journey to Database
  const handleSaveJourney = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }

    if (selectedDestinations.length === 0) {
      alert('Please add at least one destination to your custom journey before saving.');
      return;
    }

    setIsSaving(true);
    setSaveSuccessMsg(null);

    const costEst = calculateCostEstimate();
    const payload = {
      id: journeyId || undefined,
      title: journeyTitle,
      start_location: startingLocation,
      start_date: startDate,
      end_date: endDate,
      duration_days: calculateTotalNights() + 1,
      total_nights: calculateTotalNights(),
      adults_count: adultsCount,
      children_count: childrenCount,
      budget_inr: budgetINR ? Number(budgetINR) : null,
      preferences: selectedPreferences,
      status: 'PLANNING',
      destinations: selectedDestinations.map((d, idx) => {
        const destDays = itineraryDays.filter(day => (day.destinationKey || day.destinationName).toLowerCase() === d.key.toLowerCase());
        const allActsForDest = destDays.flatMap(day => day.activities || []);
        return {
          destination_key: d.key,
          destination_name: d.name,
          sequence_order: idx + 1,
          stay_nights: d.stayNights || 1,
          selected_hotel_id: d.selectedHotelId || null,
          selected_hotel_name: d.selectedHotelName || null,
          selected_activities: allActsForDest.map(a => ({
            id: a.id || `act-${Math.random().toString(36).substr(2, 9)}`,
            name: a.name,
            category: a.category || a.type || 'Culture',
            cost: a.cost || a.approxCostInr || 0,
            approxCostInr: a.approxCostInr || a.cost || 0,
            duration: a.duration || `${a.durationHours || 2.0} hrs`,
            durationHours: a.durationHours || 2.0,
            timeOfDay: a.timeOfDay || a.time || 'Morning',
            locationName: a.locationName || d.name,
            description: a.description
          })),
          transport_mode: 'Car / Tourist Vehicle'
        };
      }),
      itinerary: itineraryDays,
      cost_estimate: costEst
    };

    try {
      const endpoint = journeyId ? `/api/v1/custom-journeys/${journeyId}` : '/api/v1/custom-journeys';
      const method = journeyId ? 'PUT' : 'POST';

      const token = localStorage.getItem('safarsetu_jwt_token') || '';
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(endpoint, {
        method,
        headers,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const saved = data.journey;
        if (saved?.id) setJourneyId(saved.id);
        setSaveSuccessMsg('Custom Journey saved to your account successfully!');
        if (onSaveFeedback) onSaveFeedback('Journey saved successfully!');
        setTimeout(() => setSaveSuccessMsg(null), 4000);
      } else {
        const err = await res.json();
        alert(`Error saving journey: ${err.detail || 'Could not save journey.'}`);
      }
    } catch (e) {
      console.error('Save error:', e);
      alert('Network error while saving custom journey.');
    } finally {
      setIsSaving(false);
    }
  };

  // Proceed to booking
  const handleProceedBooking = () => {
    if (selectedDestinations.length === 0) {
      alert('Please add at least one destination to your custom journey before proceeding to book.');
      return;
    }

    const costEst = calculateCostEstimate();
    const journeyRecord: CustomJourneyRecord = {
      id: journeyId || `CJ-${Date.now().toString().slice(-6)}`,
      customerId: user?.id || null,
      title: journeyTitle,
      startLocation: startingLocation,
      startDate: startDate,
      endDate: endDate,
      durationDays: calculateTotalNights() + 1,
      totalNights: calculateTotalNights(),
      adultsCount: adultsCount,
      childrenCount: childrenCount,
      budgetINR: budgetINR ? Number(budgetINR) : null,
      preferences: selectedPreferences,
      status: 'BOOKING_IN_PROGRESS',
      destinations: selectedDestinations.map((d, idx) => {
        const destDays = itineraryDays.filter(day => (day.destinationKey || day.destinationName).toLowerCase() === d.key.toLowerCase());
        const allActsForDest = destDays.flatMap(day => day.activities || []);
        return {
          destinationKey: d.key,
          destinationName: d.name,
          sequenceOrder: idx + 1,
          stayNights: d.stayNights || 1,
          selectedHotelId: d.selectedHotelId || null,
          selectedHotelName: d.selectedHotelName || null,
          selectedActivities: allActsForDest.map(a => ({
            id: a.id || `act-${Math.random().toString(36).substr(2, 9)}`,
            name: a.name,
            category: a.category || a.type || 'Culture',
            cost: a.cost || a.approxCostInr || 0,
            approxCostInr: a.approxCostInr || a.cost || 0,
            duration: a.duration || `${a.durationHours || 2.0} hrs`,
            durationHours: a.durationHours || 2.0,
            timeOfDay: a.timeOfDay || a.time || 'Morning',
            locationName: a.locationName || d.name,
            description: a.description
          })),
          transportMode: 'Car / Tourist Vehicle'
        };
      }),
      itinerary: itineraryDays,
      costEstimate: costEst
    };

    onProceedToBooking(journeyRecord);
  };

  const costs = calculateCostEstimate();
  const lastDest = selectedDestinations[selectedDestinations.length - 1];

  return (
    <div id="customize-journey-page" className="min-h-screen bg-[#faf8f5] text-slate-900 pb-24">
      {/* Top Navigation Bar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={onBackToHome}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition whitespace-nowrap shrink-0"
            >
              ← Back to Catalog
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-700 whitespace-nowrap">
                  Custom Journey Builder
                </span>
              </div>
              <div className="relative flex items-center group max-w-lg">
                <input
                  type="text"
                  value={journeyTitle}
                  onChange={e => setJourneyTitle(e.target.value)}
                  className="font-serif font-bold text-base sm:text-lg text-slate-950 bg-transparent border-b border-dashed border-slate-300 hover:border-orange-500 focus:outline-none focus:border-orange-600 px-1 py-0.5 w-full min-w-[260px] sm:min-w-[340px] transition"
                  placeholder="Give your journey a name..."
                  title="Click to rename journey"
                />
                <Edit3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-600 pointer-events-none -ml-5 shrink-0 transition" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {saveSuccessMsg && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-xl flex items-center gap-1 animate-fade-in">
                <CheckCircle className="w-3.5 h-3.5" />
                {saveSuccessMsg}
              </span>
            )}

            <button
              onClick={handleSaveJourney}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <Bookmark className="w-3.5 h-3.5 text-orange-400" />
              <span>{isSaving ? 'Saving...' : 'Save Journey'}</span>
            </button>

            <button
              onClick={handleProceedBooking}
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer active:scale-98"
            >
              <span>Review & Book</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-3xl space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Multimodal Personalization Engine</span>
            </div>
            <h1 className="font-serif font-bold text-2xl sm:text-4xl text-white tracking-tight">
              Design Your Custom Indian Journey
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Assemble stops, receive proximity-aware suggestions with travel times, select verified zero-commission homestays, and build your personalized itinerary.
            </p>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Selected Stops</span>
              <span className="font-bold text-base text-white">{selectedDestinations.length} Destinations</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Total Nights</span>
              <span className="font-bold text-base text-white">{calculateTotalNights()} Nights / {calculateTotalNights() + 1} Days</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Travelers</span>
              <span className="font-bold text-base text-white">{adultsCount} Adults, {childrenCount} Children</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Estimated Cost</span>
              <span className="font-bold text-base text-orange-400 font-mono">₹{costs.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Builder Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Configuration Controls (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: Starting Hub & Preferences Box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-subtle-card space-y-6 text-left">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 font-extrabold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-serif font-bold text-lg text-slate-950">Starting Point & Preferences</h3>
                </div>
                <span className="text-xs text-slate-400">Step 1 of 4</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Starting Hub */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Where are you starting from?</label>
                  <select
                    value={startingLocation}
                    onChange={e => setStartingLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-orange-600 bg-white"
                  >
                    {startingLocations.map(loc => (
                      <option key={loc.name} value={loc.name}>{loc.name} ({loc.state})</option>
                    ))}
                  </select>
                </div>

                {/* Dates Range */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Departure Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-orange-600"
                  />
                </div>

                {/* Travelers */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Travelers (Adults & Children)</label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-300 rounded-xl px-2 py-1.5 bg-white">
                      <button 
                        onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                        className="px-2 font-bold text-slate-600 hover:text-orange-600"
                      >-</button>
                      <span className="px-2 text-xs font-bold">{adultsCount} Adults</span>
                      <button 
                        onClick={() => setAdultsCount(adultsCount + 1)}
                        className="px-2 font-bold text-slate-600 hover:text-orange-600"
                      >+</button>
                    </div>

                    <div className="flex items-center border border-slate-300 rounded-xl px-2 py-1.5 bg-white">
                      <button 
                        onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                        className="px-2 font-bold text-slate-600 hover:text-orange-600"
                      >-</button>
                      <span className="px-2 text-xs font-bold">{childrenCount} Kids</span>
                      <button 
                        onClick={() => setChildrenCount(childrenCount + 1)}
                        className="px-2 font-bold text-slate-600 hover:text-orange-600"
                      >+</button>
                    </div>
                  </div>
                </div>

                {/* Optional Budget */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Approx. Budget (Optional)</span>
                    <span className="text-[10px] text-slate-400 font-normal">in INR</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      placeholder="e.g. 35000"
                      value={budgetINR}
                      onChange={e => setBudgetINR(e.target.value ? Number(e.target.value) : '')}
                      className="w-full pl-7 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-orange-600"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences Multi-Select */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">Travel Style & Interests (Select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {PREFERENCE_OPTIONS.map(pref => {
                    const isSelected = selectedPreferences.includes(pref);
                    return (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => handleTogglePreference(pref)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-orange-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{pref}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Step 2: Multi-Destination Sequence Manager */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-subtle-card space-y-6 text-left">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 font-extrabold text-xs flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-slate-950">Journey Route & Destination Order</h3>
                    <p className="text-xs text-slate-500">Reorder stops with Move Up/Down, adjust nights, and add destinations.</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setDestinationSelectorOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-orange-50 border border-orange-300 text-orange-700 font-bold text-xs hover:bg-orange-100 transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Destination</span>
                </button>
              </div>

              {/* Route Timeline Chain */}
              <div className="space-y-3">
                {/* Starting Hub node */}
                <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                      <Plane className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Departure Gateway</span>
                      <h4 className="font-serif font-bold text-sm text-slate-950">{startingLocation}</h4>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    Day 1 Departure
                  </span>
                </div>

                {/* Destinations Ordered Sequence */}
                {selectedDestinations.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-amber-50/40 border-2 border-dashed border-amber-300/80 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-slate-900">No destinations added yet</h4>
                      <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                        Select your preferred travel stops across India to build your personalized multi-destination route and day-by-day activity plan.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDestinationSelectorOpen(true)}
                      className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-xs transition inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add First Destination</span>
                    </button>
                  </div>
                ) : (
                  selectedDestinations.map((dest, idx) => {
                    return (
                      <React.Fragment key={`${dest.key}-${idx}`}>
                        {/* Segment Transit Indicator */}
                        <div className="pl-6 border-l-2 border-dashed border-orange-300 py-1.5 my-1 ml-4 text-[11px] text-slate-600 flex items-center gap-3">
                          <span className="font-semibold text-orange-700 flex items-center gap-1">
                            <Car className="w-3.5 h-3.5 text-orange-600" />
                            <span>Segment {idx + 1}:</span>
                          </span>
                          <span>{idx === 0 ? startingLocation : selectedDestinations[idx - 1].name} → {dest.name}</span>
                          <span className="text-slate-400">• Approx. 3-4h Scenic Transit</span>
                        </div>

                        {/* Destination Card */}
                        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-orange-300 transition">
                          
                          <div className="flex items-center gap-3.5">
                            <img
                              src={dest.image}
                              alt={dest.name}
                              className="w-14 h-14 rounded-xl object-cover shadow-xs shrink-0"
                            />
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-md bg-slate-900 text-white font-extrabold text-[10px] flex items-center justify-center">
                                  {idx + 1}
                                </span>
                                <h4 className="font-serif font-bold text-base text-slate-950">{dest.name}</h4>
                              </div>
                              <span className="text-[11px] text-slate-500 block">
                                {dest.selectedHotelName ? `Stay: ${dest.selectedHotelName}` : 'Homestay / Heritage Resort'}
                              </span>
                            </div>
                          </div>

                          {/* Controls: Nights, Order Buttons, Delete */}
                          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            
                            {/* Stay Duration Stepper */}
                            <div className="flex items-center border border-slate-200 rounded-xl px-2 py-1 bg-slate-50">
                              <button
                                onClick={() => handleNightsChange(idx, -1)}
                                className="px-1.5 font-bold text-slate-600 hover:text-orange-600"
                                title="Decrease nights"
                              >-</button>
                              <span className="px-2 text-xs font-extrabold text-slate-900">
                                {dest.stayNights} {dest.stayNights === 1 ? 'Night' : 'Nights'}
                              </span>
                              <button
                                onClick={() => handleNightsChange(idx, 1)}
                                className="px-1.5 font-bold text-slate-600 hover:text-orange-600"
                                title="Increase nights"
                              >+</button>
                            </div>

                            {/* Order Buttons */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleMoveUp(idx)}
                                disabled={idx === 0}
                                title="Move Destination Up"
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMoveDown(idx)}
                                disabled={idx === selectedDestinations.length - 1}
                                title="Move Destination Down"
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveDestination(idx)}
                              title="Remove Destination"
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>

                        </div>
                      </React.Fragment>
                    );
                  })
                )}
              </div>

            </div>

            {/* Step 3: Destination Suggestions Panel */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-subtle-card space-y-4 text-left">
              <DestinationSuggestionPanel
                suggestions={suggestions}
                onAddDestination={handleAddDestinationFromSuggestion}
                selectedKeys={selectedDestinations.map(d => d.key)}
                lastSelectedName={lastDest?.name}
                isLoading={isLoadingRecommendations}
              />
            </div>

            {/* Step 4: Tabs for Stays, Activities, and Day-by-Day Itinerary */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-subtle-card space-y-6 text-left">
              
              {/* Tab Navigation */}
              <div className="flex border-b border-slate-200 text-xs font-bold gap-2">
                <button
                  onClick={() => setActiveTab('route')}
                  className={`py-2.5 px-4 border-b-2 transition flex items-center gap-1.5 ${
                    activeTab === 'route' ? 'border-orange-600 text-orange-700' : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Day-by-Day Itinerary</span>
                </button>
                <button
                  onClick={() => setActiveTab('hotels')}
                  className={`py-2.5 px-4 border-b-2 transition flex items-center gap-1.5 ${
                    activeTab === 'hotels' ? 'border-orange-600 text-orange-700' : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <HotelIcon className="w-3.5 h-3.5" />
                  <span>Recommended Stays ({Object.keys(recommendedHotels).length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('activities')}
                  className={`py-2.5 px-4 border-b-2 transition flex items-center gap-1.5 ${
                    activeTab === 'activities' ? 'border-orange-600 text-orange-700' : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Destination Activities</span>
                </button>
              </div>

              {/* Tab 1: Day-by-Day Itinerary */}
              {activeTab === 'route' && (
                <DayWiseItineraryBuilder
                  days={itineraryDays}
                  userPreferences={selectedPreferences}
                  onAddActivityToDay={handleAddActivityToDay}
                  onRemoveActivityFromDay={handleRemoveActivityFromDay}
                  onReorderActivityInDay={handleReorderActivityInDay}
                  onMoveActivityToDay={handleMoveActivityToDay}
                />
              )}

              {/* Tab 2: Recommended Hotels */}
              {activeTab === 'hotels' && (
                <div className="space-y-6">
                  {selectedDestinations.map(dest => {
                    const hotels = recommendedHotels[dest.key] || [];
                    return (
                      <div key={dest.key} className="space-y-3">
                        <h4 className="font-serif font-bold text-base text-slate-950 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-orange-600" />
                          <span>Verified Stays in {dest.name}</span>
                        </h4>

                        {hotels.length === 0 ? (
                          <p className="text-xs text-slate-400">Loading verified properties for {dest.name}...</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {hotels.map(h => {
                              const isSelected = dest.selectedHotelId === h.id;
                              return (
                                <div
                                  key={h.id}
                                  className={`p-3.5 rounded-2xl border transition flex flex-col justify-between ${
                                    isSelected
                                      ? 'bg-orange-50/70 border-orange-500 shadow-xs'
                                      : 'bg-white border-slate-200 hover:border-slate-300'
                                  }`}
                                >
                                  <div className="space-y-2">
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <h5 className="font-bold text-sm text-slate-950">{h.propertyName}</h5>
                                        <span className="text-[10px] text-slate-500">{h.propertyType} • {h.city}</span>
                                      </div>
                                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                        ★ {h.rating}
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-600 line-clamp-2">{h.description}</p>
                                  </div>

                                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
                                    <div>
                                      <span className="text-sm font-black text-slate-950 font-mono">
                                        ₹{h.basePriceINR.toLocaleString('en-IN')}
                                      </span>
                                      <span className="text-[10px] text-slate-400 block">per night</span>
                                    </div>
                                    <button
                                      onClick={() => handleSelectHotel(dest.key, h)}
                                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                                        isSelected
                                          ? 'bg-emerald-600 text-white'
                                          : 'bg-slate-900 text-white hover:bg-orange-600'
                                      }`}
                                    >
                                      {isSelected ? 'Selected ✓' : 'Select Stay'}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 3: Destination Activities */}
              {activeTab === 'activities' && (
                <div className="space-y-6">
                  {selectedDestinations.map(dest => {
                    const acts = recommendedActivities[dest.key] || [];
                    const destDays = itineraryDays.filter(
                      d => (d.destinationKey || d.destinationName).toLowerCase() === dest.key.toLowerCase()
                    );

                    return (
                      <div key={dest.key} className="space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h4 className="font-serif font-bold text-base text-slate-950 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-orange-600" />
                            <span>Verified Activities in {dest.name}</span>
                          </h4>
                          <span className="text-xs font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-lg">
                            {destDays.map(d => `Day ${d.dayNumber}`).join(', ') || 'Assigned'}
                          </span>
                        </div>

                        {acts.length === 0 ? (
                          <p className="text-xs text-slate-400">Loading verified activities for {dest.name} from database...</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {acts.map((act: any) => {
                              const assignedDay = itineraryDays.find(d => 
                                (d.activities || []).some(a => a.id === act.id || a.name === act.name)
                              );
                              const isAdded = !!assignedDay;

                              return (
                                <div
                                  key={act.id}
                                  className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                                    isAdded
                                      ? 'bg-emerald-50/80 border-emerald-300 shadow-2xs'
                                      : 'bg-white border-slate-200 hover:border-orange-300'
                                  }`}
                                >
                                  <div className="space-y-1 min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-[10px] font-bold text-orange-800 bg-orange-100/70 px-2 py-0.5 rounded">
                                        {act.category} • {act.duration || (act.durationHours ? `${act.durationHours} hrs` : '2 hrs')}
                                      </span>
                                      {isAdded && (
                                        <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                                          Day {assignedDay.dayNumber}
                                        </span>
                                      )}
                                    </div>
                                    <h5 className="font-bold text-xs text-slate-950 truncate">{act.name}</h5>
                                    <span className="font-mono text-xs font-extrabold text-slate-800 block">
                                      {(act.cost || act.approxCostInr || 0) > 0 
                                        ? `₹${(act.cost || act.approxCostInr).toLocaleString('en-IN')}` 
                                        : 'Free / Included'}
                                    </span>
                                  </div>

                                  <button
                                    onClick={() => handleToggleActivity(dest.key, act)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                                      isAdded
                                        ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                        : 'bg-slate-900 text-white hover:bg-orange-600 shadow-xs'
                                    }`}
                                  >
                                    {isAdded ? 'Remove' : '+ Add'}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>

          {/* Right Column: Sticky Summary & Estimated Cost Breakdown (4 cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-subtle-card space-y-6 text-left">
              
              <div className="space-y-1 border-b border-slate-100 pb-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-700">
                  Journey Summary
                </span>
                <h3 className="font-serif font-bold text-xl text-slate-950">{journeyTitle}</h3>
                <p className="text-xs text-slate-500">
                  {selectedDestinations.length > 0
                    ? `${startingLocation} → ${selectedDestinations.map(d => d.name).join(' → ')}`
                    : 'No destinations selected yet'}
                </p>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Verified Stays ({calculateTotalNights()} Nights)</span>
                  <span className="font-mono font-bold text-slate-950">₹{costs.hotels.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Transport & Tourist Chauffeur</span>
                  <span className="font-mono font-bold text-slate-950">₹{costs.transport.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Curated Activities ({itineraryDays.reduce((s, d) => s + (d.activities?.length || 0), 0)})</span>
                  <span className="font-mono font-bold text-slate-950">₹{costs.activities.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Estimated Total</span>
                    <span className="text-[10px] text-slate-400">Zero commission guarantee</span>
                  </div>
                  <span className="font-mono font-black text-2xl text-slate-950">
                    ₹{costs.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900 space-y-1">
                <div className="flex items-center gap-1 font-bold text-amber-950">
                  <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Live Estimation Notice</span>
                </div>
                <p>This is an estimate based on real database rates. Final pricing is locked upon room & transport confirmation.</p>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleProceedBooking}
                  className="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs transition shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Confirm & Book Custom Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleSaveJourney}
                  disabled={isSaving}
                  className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5 text-slate-600" />
                  <span>{isSaving ? 'Saving...' : 'Save Draft to Account'}</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Destination Selector Modal */}
      {destinationSelectorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] text-left border border-slate-200">
            
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#faf8f5]">
              <div>
                <h3 className="font-serif font-bold text-xl text-slate-950">Add a Destination</h3>
                <p className="text-xs text-slate-500">Search from verified Indian travel circuits</p>
              </div>
              <button
                onClick={() => setDestinationSelectorOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search destinations by name or state (e.g., Thekkady, Jaipur, Manali)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-orange-600"
                />
              </div>
            </div>

            <div className="flex-1 p-5 overflow-y-auto space-y-3">
              {destinationCatalog
                .filter(d => 
                  d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  d.state.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(cat => {
                  const isSelected = selectedDestinations.some(d => d.key === cat.key);
                  return (
                    <div
                      key={cat.key}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-orange-400 transition flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif font-bold text-sm text-slate-950">{cat.name}</h4>
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              {cat.state}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{cat.description}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddDestinationFromCatalog(cat)}
                        disabled={isSelected}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                          isSelected
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-orange-600 text-white hover:bg-orange-500 shadow-xs'
                        }`}
                      >
                        {isSelected ? 'Added ✓' : '+ Add'}
                      </button>
                    </div>
                  );
                })}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
