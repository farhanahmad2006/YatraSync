// Changes made by @MdFarhanAhmad
import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import {
  PartnerAssignment,
  PartnerProfileData,
  PartnerRole,
  AssignmentStatus,
  PartnerDocument,
  PartnerPayoutRecord,
  PartnerSupportTicket,
  AuditLogEvent,
  PartnerChatMessage,
  HotelPropertyData,
  RoomTypeData
} from '../types';

export const hotelPropertiesStore: HotelPropertyData[] = [
  {
    id: 'prop-101',
    propertyName: 'Munnar Tea Hills Heritage Resort',
    propertyType: 'resort',
    ownerName: 'Mathew Joseph',
    contactPhone: '+91 94471 88990',
    contactEmail: 'mathew@munnarteahills.in',
    address: {
      line: 'Pothamedu Viewpoint Road, Silent Valley',
      city: 'Munnar',
      state: 'Kerala',
      pincode: '685612',
      landmark: 'Near Tata Tea Museum'
    },
    details: {
      roomCount: 12,
      baseTariffINR: 2800,
      description: 'Luxury organic tea mountain resort with 360-degree plantation views, Ayurvedic spa, and traditional Kerala cuisine.',
      amenities: ['Wi-Fi', 'Valley View Balcony', 'Ayurvedic Spa', 'Free Breakfast', '24x7 Power Backup', 'Parking'],
      photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80']
    },
    verification: {
      panNumber: 'ABCDE1234F',
      gstin: '32ABCDE1234F1Z5',
      digiLockerVerified: true,
      documentUrls: ['https://yatrasync.gov.in/docs/ktdc-cert-101.pdf']
    },
    approvalStatus: 'APPROVED',
    rating: 4.85,
    totalBookings: 42,
    createdAt: new Date().toISOString()
  }
];

export const roomTypesStore: RoomTypeData[] = [
  {
    id: 'rt-101-1',
    hotelId: 'prop-101',
    name: 'Heritage Plantation Deluxe Room',
    description: 'Spacious colonial suite with teakwood furniture, garden balcony, panoramic plantation views, and artisanal herbal breakfast included.',
    bedConfig: 'King Bed',
    roomSizeSqft: 380,
    inventoryCount: 8,
    maxOccupancy: 3,
    adultCapacity: 2,
    childCapacity: 1,
    basePrice: 2800,
    extraAdultPrice: 750,
    extraChildPrice: 350,
    amenities: ['Wi-Fi', 'King Bed', 'Private Balcony', 'Mountain View', 'Ayurvedic Spa Access', 'Farm Breakfast', 'Tea/Coffee Maker', 'Attached Bath'],
    status: 'ACTIVE',
    photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'rt-101-2',
    hotelId: 'prop-101',
    name: 'Cloud Mist Presidential Cottage',
    description: 'Exclusive private villa nestled over misty cliffs with personal plunge pool, open fireplace, and 24/7 personalized concierge.',
    bedConfig: 'King Bed + Daybed',
    roomSizeSqft: 560,
    inventoryCount: 4,
    maxOccupancy: 4,
    adultCapacity: 3,
    childCapacity: 2,
    basePrice: 4800,
    extraAdultPrice: 1000,
    extraChildPrice: 500,
    amenities: ['Wi-Fi', 'Private Plunge Pool', 'Fireplace', 'Butler Service', 'Valley View Balcony', 'Ayurvedic Spa Access', 'Organic Breakfast', 'Bathtub'],
    status: 'ACTIVE',
    photos: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80'],
    createdAt: new Date().toISOString()
  }
];

// ==========================================================
// 1. IN-MEMORY OPERATIONAL DATA STORES (AUTHORITATIVE BACKEND)
// ==========================================================

export const partnersStore: PartnerProfileData[] = [
  {
    id: 'ptr-1',
    fullName: 'Suresh Kurup',
    phone: '+91 98470 11223',
    email: 'suresh.kurup@yatrasync-partners.in',
    role: 'DRIVER_STORYTELLER',
    capability: 'DRIVER_AND_STORYTELLER',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    rating: 4.96,
    ratingsBreakdown: {
      professionalism: 5.0,
      punctuality: 4.9,
      cleanliness: 5.0,
      localKnowledge: 5.0,
      communication: 4.9
    },
    totalTrips: 218,
    completedTrips: 214,
    cancellationRate: '0.8%',
    onTimeRate: '98.5%',
    verificationStatus: 'VERIFIED',
    languages: ['Malayalam', 'English', 'Hindi', 'Tamil'],
    yearsExperience: 14,
    serviceAreas: ['Kochi Airport (COK)', 'Munnar', 'Alleppey', 'Kumarakom', 'Thekkady'],
    specialties: ['Western Ghats Biodiversity', 'Spices & Plantations History', 'Backwaters Folklore', 'Kathakali Art Lore', 'Coastal Cuisine'],
    bio: 'Government-certified tourist chauffeur & Kerala folklore storyteller. Passionate about sustainable EV journeys, indigenous spice trails, and temple architecture.',
    vehicle: {
      type: 'Electric SUV',
      model: 'Tata Nexon EV Max (Empowered)',
      registrationNumber: 'KL-07-CS-4412',
      capacity: 4,
      isAC: true,
      luggageBagsCapacity: 3,
      permitType: 'All-India Commercial Tourist Permit (Valid)',
      insuranceValid: true
    },
    emergencyContact: {
      name: 'Devaki Kurup',
      relationship: 'Spouse',
      phone: '+91 94471 22334'
    },
    bankAccount: {
      bankName: 'Federal Bank Ltd (Kochi Aluva Branch)',
      maskedAccountNumber: '•••• •••• •••• 8841',
      ifscCode: 'FDRL0001234',
      upiId: 'suresh.kurup@okaxis'
    },
    availabilityStatus: 'AVAILABLE'
  },
  {
    id: 'ptr-2',
    fullName: 'Ahmed Khan',
    phone: '+91 98490 22334',
    email: 'ahmed.khan@yatrasync-partners.in',
    role: 'DRIVER_STORYTELLER',
    capability: 'DRIVER_AND_STORYTELLER',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    rating: 4.92,
    ratingsBreakdown: {
      professionalism: 4.9,
      punctuality: 4.9,
      cleanliness: 4.9,
      localKnowledge: 5.0,
      communication: 4.8
    },
    totalTrips: 154,
    completedTrips: 151,
    cancellationRate: '1.2%',
    onTimeRate: '97.4%',
    verificationStatus: 'VERIFIED',
    languages: ['Urdu', 'Hindi', 'English', 'Telugu'],
    yearsExperience: 11,
    serviceAreas: ['Hyderabad Airport (RGIA)', 'Golconda', 'Charminar Heritage Walk', 'Warangal Kakatiya Route'],
    specialties: ['Qutb Shahi & Nizami Dynasties', 'Bidri Handicrafts', 'Acoustic Architecture', 'Hyderabadi Dum Biryani Trail'],
    bio: 'Heritage enthusiast and certified tourist chauffeur. Specialized in Deccan sultanates, architectural secrets of Golconda, and pearl craft trails.',
    vehicle: {
      type: 'Premium MUV',
      model: 'Toyota Innova Crysta (2.4 VX)',
      registrationNumber: 'TS-09-UB-8890',
      capacity: 6,
      isAC: true,
      luggageBagsCapacity: 5,
      permitType: 'National Tourism Commercial Permit',
      insuranceValid: true
    },
    emergencyContact: {
      name: 'Farzana Khan',
      relationship: 'Sister',
      phone: '+91 98492 88776'
    },
    bankAccount: {
      bankName: 'HDFC Bank (Banjara Hills)',
      maskedAccountNumber: '•••• •••• •••• 3120',
      ifscCode: 'HDFC0000456',
      upiId: 'ahmedkhan@okhdfcbank'
    },
    availabilityStatus: 'AVAILABLE'
  },
  {
    id: 'ptr-3',
    fullName: 'Tashi Dorje',
    phone: '+91 94191 33445',
    email: 'tashi.dorje@yatrasync-partners.in',
    role: 'LOCAL_STORYTELLER',
    capability: 'STORYTELLER_ONLY',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    rating: 4.98,
    ratingsBreakdown: {
      professionalism: 5.0,
      punctuality: 5.0,
      cleanliness: 4.9,
      localKnowledge: 5.0,
      communication: 5.0
    },
    totalTrips: 98,
    completedTrips: 97,
    cancellationRate: '0.0%',
    onTimeRate: '99.0%',
    verificationStatus: 'VERIFIED',
    languages: ['Ladakhi', 'Tibetan', 'Hindi', 'English'],
    yearsExperience: 9,
    serviceAreas: ['Leh Old Town', 'Nubra Valley', 'Pangong Tso', 'Hemis & Thiksey Monasteries'],
    specialties: ['Himalayan Buddhism', 'Ancient Silk Route Lore', 'High Altitude Acclimatization', 'Pashmina & Yak Wool Craft'],
    bio: 'Native Ladakhi cultural custodian and mountain walking guide. Accompanies traveler-provided vehicles, state tourist buses, and walking heritage tours.',
    emergencyContact: {
      name: 'Sonam Dorje',
      relationship: 'Brother',
      phone: '+91 94192 44556'
    },
    bankAccount: {
      bankName: 'State Bank of India (Leh Branch)',
      maskedAccountNumber: '•••• •••• •••• 9012',
      ifscCode: 'SBIN0000876',
      upiId: 'tashi.dorje@oksbi'
    },
    availabilityStatus: 'AVAILABLE'
  },
  {
    id: 'ptr-4',
    fullName: 'Sunita Rathore',
    phone: '+91 98290 44556',
    email: 'sunita.rathore@yatrasync-partners.in',
    role: 'DRIVER_STORYTELLER',
    capability: 'DRIVER_AND_STORYTELLER',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    rating: 4.95,
    ratingsBreakdown: {
      professionalism: 5.0,
      punctuality: 4.9,
      cleanliness: 5.0,
      localKnowledge: 4.9,
      communication: 4.9
    },
    totalTrips: 162,
    completedTrips: 160,
    cancellationRate: '0.6%',
    onTimeRate: '98.8%',
    verificationStatus: 'VERIFIED',
    languages: ['Hindi', 'Rajasthani', 'English'],
    yearsExperience: 8,
    serviceAreas: ['Jaipur Airport', 'Amer Fort Heritage Corridor', 'Jodhpur', 'Udaipur'],
    specialties: ['Rajput Architecture', 'Block Printing & Blue Pottery', 'Safe Corridors for Solo Women Travelers', 'Royal Cuisine'],
    bio: 'Pioneer woman storyteller-chauffeur certified by Rajasthan Tourism. Specializes in royal history, safe women travel corridors, and artisanal craft studios.',
    vehicle: {
      type: 'SUV',
      model: 'Mahindra Scorpio-N (Z8 Luxury)',
      registrationNumber: 'RJ-14-TA-3321',
      capacity: 6,
      isAC: true,
      luggageBagsCapacity: 4,
      permitType: 'All-Rajasthan Commercial Tourist Permit',
      insuranceValid: true
    },
    emergencyContact: {
      name: 'Vikram Rathore',
      relationship: 'Father',
      phone: '+91 98291 99887'
    },
    bankAccount: {
      bankName: 'ICICI Bank (Jaipur C-Scheme)',
      maskedAccountNumber: '•••• •••• •••• 5567',
      ifscCode: 'ICIC0000123',
      upiId: 'sunita.rathore@okicici'
    },
    availabilityStatus: 'AVAILABLE'
  }
];

export const partnerDocumentsStore: Record<string, PartnerDocument[]> = {
  'ptr-1': [
    {
      id: 'DOC-101',
      type: 'DRIVING_LICENSE',
      title: 'Commercial Heavy/Light Transport Driving License',
      documentNumber: 'KL-07-20120004921',
      validUntil: '14 May 2030',
      status: 'VERIFIED',
      issuer: 'Motor Vehicles Dept, Kerala (RTO Ernakulam)',
      uploadedAt: '2025-08-10'
    },
    {
      id: 'DOC-102',
      type: 'VEHICLE_RC',
      title: 'Commercial Tourist Vehicle Registration (EV)',
      documentNumber: 'KL-07-CS-4412',
      validUntil: '22 Oct 2032',
      status: 'VERIFIED',
      issuer: 'State Transport Authority Kerala',
      uploadedAt: '2025-08-10'
    },
    {
      id: 'DOC-103',
      type: 'COMMERCIAL_INSURANCE',
      title: 'Comprehensive Passenger Protection Insurance',
      documentNumber: 'NIC-KRL-COM-9921448',
      validUntil: '18 Nov 2026',
      status: 'EXPIRING_SOON',
      issuer: 'National Insurance Co. Ltd',
      uploadedAt: '2025-11-19'
    },
    {
      id: 'DOC-104',
      type: 'AADHAAR_DIGILOCKER',
      title: 'Aadhaar Verified Citizen Identity',
      documentNumber: '•••• •••• 8821',
      validUntil: 'Permanent',
      status: 'VERIFIED',
      issuer: 'UIDAI DigiLocker Sync',
      uploadedAt: '2025-08-01'
    },
    {
      id: 'DOC-105',
      type: 'POLICE_VERIFICATION',
      title: 'Kerala Police Tourist Escort Clearance Certificate',
      documentNumber: 'KRP-VER-2026-08119',
      validUntil: '30 June 2027',
      status: 'VERIFIED',
      issuer: 'District Police Chief, Ernakulam Rural',
      uploadedAt: '2026-01-05'
    },
    {
      id: 'DOC-106',
      type: 'TOURISM_PERMIT',
      title: 'Certified Storyteller Chauffeur Tourist Badge',
      documentNumber: 'KTD-STORY-2024-912',
      validUntil: '31 Dec 2028',
      status: 'VERIFIED',
      issuer: 'Kerala Department of Tourism (KTDC)',
      uploadedAt: '2025-08-15'
    }
  ]
};

export const assignmentsStore: PartnerAssignment[] = [
  {
    id: 'ASG-KER-20491',
    tripId: 'TRIP-KER-01',
    bookingId: 'SS-CONFIRM-94812',
    pnr: '4582-KER-9012',
    partnerId: 'ptr-1',
    partnerName: 'Suresh Kurup',
    assignedRole: 'DRIVER_STORYTELLER',
    travelerName: 'Priya Sharma',
    travelerPhone: '+91 98765 43210',
    guestsCount: 2,
    luggageCount: '2 Large Trolleys + 1 Backpack',
    pickupDate: '12 Sep 2026',
    pickupTime: '09:30 AM',
    pickupLocation: 'Cochin International Airport (COK)',
    pickupGate: 'Terminal 3 International/Domestic Arrival Gate B (Outside Pillar 14)',
    pickupCoordinates: { lat: 10.1558, lng: 76.3860 },
    dropDate: '16 Sep 2026',
    dropTime: '06:00 PM',
    dropLocation: 'Munnar Misty Tea Valley Homestay, Pothamedu',
    dropCoordinates: { lat: 10.0889, lng: 77.0595 },
    destinationName: 'Kerala (Munnar & Alleppey)',
    destinationKey: 'kerala',
    serviceType: 'Full Day Chauffeur & Storyteller',
    status: 'EN_ROUTE',
    statusTimeline: [
      { status: 'OFFERED', timestamp: '12 Sep 2026, 07:15 AM', note: 'Admin automated match based on 4.96 rating & EV capability' },
      { status: 'ACCEPTED', timestamp: '12 Sep 2026, 07:22 AM', note: 'Accepted by Suresh Kurup within 7 minutes' },
      { status: 'READY', timestamp: '12 Sep 2026, 08:30 AM', note: 'Pre-trip safety checklist completed. Vehicle sanitized.' },
      { status: 'EN_ROUTE', timestamp: '12 Sep 2026, 08:45 AM', note: 'En route to Airport Terminal 3. Live GPS synced.' }
    ],
    estimatedDistanceKm: 124,
    estimatedDurationHours: 4.2,
    etaMinutes: 18,
    currentStopIndex: 0,
    stops: [
      {
        id: 'stp-1',
        stopNumber: 1,
        time: '09:30 AM',
        location: 'Cochin Airport Terminal 3 Arrival Gate B',
        coordinates: { lat: 10.1558, lng: 76.3860 },
        expectedDeparture: '10:00 AM',
        driverAction: 'Hold YatraSync name placard at Pillar 14. Assist with luggage loading.',
        storytellerAction: 'Warm traditional greeting. Brief travelers on road conditions and hydration.',
        travelerAction: 'Flight arrival, immigration/baggage claim, meet chauffeur.',
        specialInstruction: 'Travelers have had an early morning connection; keep chilled mineral water ready.',
        completed: false,
        storyNotes: {
          narrative: 'Welcome to the Queen of the Arabian Sea. Kochi port has traded black gold (pepper) and cardamom with Romans, Arabs, and Chinese since 3000 BCE.',
          culturalHighlights: ['Ancient Muziris spice port corridor', 'Vembanad estuary ecosystem', 'Malayalam traditional greeting: Namaskaram'],
          localEatsTip: 'Fresh tender coconut water right outside airport perimeter.',
          etiquette: 'Remove shoes before entering sanctum of traditional heritage homestays.'
        }
      },
      {
        id: 'stp-2',
        stopNumber: 2,
        time: '11:45 AM',
        location: 'Cheeyappara Waterfalls Viewpoint (NH-85)',
        coordinates: { lat: 10.0245, lng: 76.9011 },
        expectedDeparture: '12:15 PM',
        driverAction: 'Park in designated safe turnout on mountain road. Guide safely across road.',
        storytellerAction: 'Explain 7-tier cascading geological formation and medicinal plant diversity of Western Ghats.',
        travelerAction: 'Comfort rest break, scenic photography, taste roasted spiced groundnuts.',
        specialInstruction: 'Keep 15-minute buffer; road may have mist near hairpin bends.',
        completed: false,
        storyNotes: {
          narrative: 'Cheeyappara cascades down in seven distinct rock tiers. The Western Ghats are older than the Himalayas and recognized as an eight-hottest biodiversity hotspot on Earth.',
          culturalHighlights: ['Cardamom mountain air', 'Endemic Nilgiri flora', 'Monsoon stream dynamics'],
          localEatsTip: 'Crisp hot banana fritters (Pazham Pori) freshly fried in cold-pressed coconut oil.',
          etiquette: 'Do not feed monkeys along the mountain turnout.'
        }
      },
      {
        id: 'stp-3',
        stopNumber: 3,
        time: '01:15 PM',
        location: 'Clay Oven Heritage Spice Kitchen, Adimali',
        coordinates: { lat: 10.0412, lng: 76.9534 },
        expectedDeparture: '02:15 PM',
        driverAction: 'Assist with safe parking. Introduce hosts.',
        storytellerAction: 'Explain culinary philosophy of Malabar black pepper, star anise, and organic vanilla pods.',
        travelerAction: 'Authentic Kerala Sadya or Karimeen Pollichathu lunch.',
        specialInstruction: 'Traveler preference: 1 vegetarian, 1 seafood enthusiast. Verified hygiene certified.',
        completed: false,
        storyNotes: {
          narrative: 'Spices here are harvested from smallholder organic farms above 2,500 ft elevation, where night mist locks in the essential oils.',
          culturalHighlights: ['Kollam-Kochi spice trade lore', 'Traditional wood-fired clay cooking', 'Ayurvedic digestion principles'],
          localEatsTip: 'Kerala Red Matta Rice with aromatic ginger Pachadi.',
          etiquette: 'Food served on fresh banana leaf is eaten with right hand for full sensory experience.'
        }
      },
      {
        id: 'stp-4',
        stopNumber: 4,
        time: '03:45 PM',
        location: 'Pothamedu Viewpoint & Tea Plantations',
        coordinates: { lat: 10.0682, lng: 77.0512 },
        expectedDeparture: '04:30 PM',
        driverAction: 'Slow drive through scenic hairpin bend panorama. Safe photographic stops.',
        storytellerAction: 'Narrate history of John Daniel Munro, Duke of Wellington, and the Scottish planters of 1877.',
        travelerAction: 'Panoramic photography overlooking Muthirapuzha river gorge.',
        completed: false,
        storyNotes: {
          narrative: 'Scottish surveyors arrived in the late 19th century and found these cloud-clad ridges optimal for Camellia Sinensis tea bushes.',
          culturalHighlights: ['High-elevation orthodox tea picking', 'Tea worker self-governing cooperatives', 'Mountain mist acoustics'],
          localEatsTip: 'First-flush green tea brewed with spring water.',
          etiquette: 'Please do not walk inside the tea bush rows without plantation escort.'
        }
      },
      {
        id: 'stp-5',
        stopNumber: 5,
        time: '05:00 PM',
        location: 'Munnar Misty Tea Valley Homestay (Final Drop)',
        coordinates: { lat: 10.0889, lng: 77.0595 },
        expectedDeparture: '05:30 PM',
        driverAction: 'Safe baggage unload, verify room check-in with host Anand Menon, complete post-trip checklist.',
        storytellerAction: 'Introduce host Anand and discuss tomorrow morning birdsong plantation walk.',
        travelerAction: 'Welcome cardamom tea, room check-in, rest.',
        specialInstruction: 'Zero commission homestay. Direct host payment already confirmed on YatraSync platform.',
        completed: false
      }
    ],
    travelerPreferences: {
      travelStyle: 'Relaxed & Culturally Immersive',
      interests: ['Historical folklore', 'Biodiversity & nature', 'Authentic regional cuisine', 'Landscape photography'],
      languagePreference: 'English & conversational Hindi',
      specialRequirements: ['Senior-friendly comfortable driving (no sharp braking)', 'Hydration reminders'],
      dietary: '1 Pure Vegetarian, 1 Non-Vegetarian (Prefers local fish)'
    },
    safarSetuInstructions: {
      version: 'v2.1',
      updatedAt: '12 Sep 2026, 06:00 AM',
      acknowledgedByPartner: true,
      items: [
        '1. Arrive at pickup point minimum 15 minutes before scheduled flight touchdown.',
        '2. Prominently display the YatraSync official name placard outside Pillar 14.',
        '3. Verify traveler identity with greeting and match booking PNR before loading baggage.',
        '4. Zero-cash rule: Strictly zero offline payment requests. All fees covered under approved booking pass.',
        '5. Adhere strictly to the verified NH-85 corridor; do not divert onto unpaved estate shortcuts without traveler consent.',
        '6. Maintain smooth, passenger-first driving dynamics along Western Ghats hairpin sections.',
        '7. Immediately trigger "Report Delay" on your partner portal if road fog or slow trucks exceed 15-minute threshold.',
        '8. Ensure 24/7 GPS beacon remains active throughout the operational assignment.'
      ]
    },
    earnings: {
      baseFare: 2800,
      distanceComponent: 1860, // 124km * 15/km
      waitingAllowance: 300,
      storytellerFee: 1500,
      bonus: 300, // On-time & EV zero-emission green incentive
      totalPayable: 6760,
      payoutStatus: 'PENDING'
    },
    preTripChecklistCompleted: true,
    postTripChecklistCompleted: false,
    chatMessages: [
      {
        id: 'msg-1',
        senderRole: 'system',
        senderName: 'YatraSync Operations',
        text: 'Assignment confirmed. Inbound IndiGo 6E-6518 from Hyderabad is on schedule (Touchdown ETA: 09:22 AM).',
        timestamp: '07:25 AM',
        delivered: true,
        read: true
      },
      {
        id: 'msg-2',
        senderRole: 'driver',
        senderName: 'Suresh Kurup (Partner)',
        text: 'Namaskaram Priya ji! I am already en route in the white Tata Nexon EV (KL-07-CS-4412). I will be waiting right outside Pillar 14 at Arrival Gate B.',
        timestamp: '08:50 AM',
        delivered: true,
        read: true
      },
      {
        id: 'msg-3',
        senderRole: 'traveler',
        senderName: 'Priya Sharma (Traveler)',
        text: 'Thank you Suresh ji! We just touched down and are heading to luggage belt 4. See you in 15 mins.',
        timestamp: '09:12 AM',
        delivered: true,
        read: true
      }
    ]
  },
  {
    id: 'ASG-TEL-80123',
    tripId: 'TRIP-TEL-02',
    bookingId: 'SS-CONFIRM-77211',
    pnr: '8891-TEL-3319',
    partnerId: 'ptr-2',
    partnerName: 'Ahmed Khan',
    assignedRole: 'DRIVER_STORYTELLER',
    travelerName: 'Rajesh Kulkarni',
    travelerPhone: '+91 98200 11992',
    guestsCount: 4,
    luggageCount: '4 Trolleys',
    pickupDate: '13 Sep 2026',
    pickupTime: '10:00 AM',
    pickupLocation: 'Hyderabad Airport (RGIA) Terminal 1',
    pickupGate: 'Gate C, Ground Transport Level',
    pickupCoordinates: { lat: 17.2403, lng: 78.4294 },
    dropDate: '15 Sep 2026',
    dropTime: '07:00 PM',
    dropLocation: 'Kakatiya Heritage Homestay, Warangal',
    dropCoordinates: { lat: 17.9689, lng: 79.5941 },
    destinationName: 'Telangana Heritage Trail',
    destinationKey: 'telangana',
    serviceType: 'Full Day Chauffeur & Storyteller',
    status: 'READY',
    statusTimeline: [
      { status: 'OFFERED', timestamp: '11 Sep 2026, 04:00 PM' },
      { status: 'ACCEPTED', timestamp: '11 Sep 2026, 04:12 PM' },
      { status: 'READY', timestamp: '12 Sep 2026, 09:00 AM', note: 'Vehicle fueled and sanitized' }
    ],
    estimatedDistanceKm: 168,
    estimatedDurationHours: 4.5,
    etaMinutes: 45,
    currentStopIndex: 0,
    stops: [
      {
        id: 'stp-t1',
        stopNumber: 1,
        time: '10:00 AM',
        location: 'Hyderabad Airport RGIA Terminal 1',
        coordinates: { lat: 17.2403, lng: 78.4294 },
        expectedDeparture: '10:30 AM',
        driverAction: 'Airport pickup at Gate C pillar 8.',
        storytellerAction: 'Welcome guests and orient to Nizami history.',
        travelerAction: 'Arrival & boarding.',
        completed: false
      },
      {
        id: 'stp-t2',
        stopNumber: 2,
        time: '11:45 AM',
        location: 'Golconda Fort Outer Bailey',
        coordinates: { lat: 17.3833, lng: 78.4011 },
        expectedDeparture: '01:30 PM',
        driverAction: 'Comfort parking & escort.',
        storytellerAction: 'Acoustic clapping handclap demonstration at Fateh Darwaza.',
        travelerAction: 'Fort exploration.',
        completed: false
      },
      {
        id: 'stp-t3',
        stopNumber: 3,
        time: '04:30 PM',
        location: 'Warangal Ramappa Temple (UNESCO Heritage)',
        coordinates: { lat: 18.2612, lng: 79.9431 },
        expectedDeparture: '06:00 PM',
        driverAction: 'Scenic highway transit.',
        storytellerAction: 'Floating bricks technology and Kakatiya dancing sculptures narrative.',
        travelerAction: 'Heritage marvel photography.',
        completed: false
      }
    ],
    travelerPreferences: {
      travelStyle: 'Architectural & Historical',
      interests: ['UNESCO heritage', 'Local handicrafts', 'Telangana cuisine'],
      languagePreference: 'Hindi & English',
      specialRequirements: ['Family with 2 teenagers', 'Frequent photo stops'],
      dietary: 'Vegetarian'
    },
    safarSetuInstructions: {
      version: 'v2.1',
      updatedAt: '12 Sep 2026, 06:00 AM',
      acknowledgedByPartner: true,
      items: [
        '1. Ensure Innova Crysta AC is chilled before guest boarding.',
        '2. Explain Kakatiya dynasty history before reaching Ramappa Temple.',
        '3. Respect zero-commission policy at all highway artisan halts.'
      ]
    },
    earnings: {
      baseFare: 3400,
      distanceComponent: 2520,
      waitingAllowance: 400,
      storytellerFee: 1800,
      bonus: 250,
      totalPayable: 8370,
      payoutStatus: 'PENDING'
    },
    preTripChecklistCompleted: true,
    postTripChecklistCompleted: false,
    chatMessages: []
  },
  {
    id: 'ASG-UNASSIGNED-9912',
    tripId: 'TRIP-KER-03',
    bookingId: 'SS-CONFIRM-11092',
    pnr: '9923-KER-4481',
    partnerId: '',
    partnerName: 'Unassigned (Awaiting Smart Match)',
    assignedRole: 'DRIVER_STORYTELLER',
    travelerName: 'Elena Rostova',
    travelerPhone: '+91 91234 56789',
    guestsCount: 1,
    luggageCount: '1 Backpack + 1 Camera Kit',
    pickupDate: '14 Sep 2026',
    pickupTime: '11:00 AM',
    pickupLocation: 'Ernakulam Town South Railway Station (ERS)',
    pickupGate: 'Platform 1 Main Portico Taxi Bay',
    pickupCoordinates: { lat: 9.9698, lng: 76.2913 },
    dropDate: '17 Sep 2026',
    dropTime: '02:00 PM',
    dropLocation: 'Kumarakom Backwater Bird Sanctuary Homestay',
    dropCoordinates: { lat: 9.6175, lng: 76.4300 },
    destinationName: 'Kerala Backwaters & Birding Corridor',
    destinationKey: 'kerala',
    serviceType: 'Full Day Chauffeur & Storyteller',
    status: 'OFFERED',
    statusTimeline: [
      { status: 'OFFERED', timestamp: '12 Sep 2026, 08:00 AM', note: 'New direct booking received via YatraSync traveler engine' }
    ],
    estimatedDistanceKm: 78,
    estimatedDurationHours: 2.5,
    etaMinutes: 30,
    currentStopIndex: 0,
    stops: [
      {
        id: 'stp-u1',
        stopNumber: 1,
        time: '11:00 AM',
        location: 'Ernakulam Town Station Main Portico',
        coordinates: { lat: 9.9698, lng: 76.2913 },
        expectedDeparture: '11:30 AM',
        driverAction: 'Meet traveler off Vande Bharat express.',
        storytellerAction: 'Overview of Vembanad lake ecological heritage.',
        travelerAction: 'Deboard train, meet guide.',
        completed: false
      },
      {
        id: 'stp-u2',
        stopNumber: 2,
        time: '01:30 PM',
        location: 'Kumarakom Backwaters Eco-Lodge',
        coordinates: { lat: 9.6175, lng: 76.4300 },
        expectedDeparture: '02:00 PM',
        driverAction: 'Safe luggage delivery.',
        storytellerAction: 'Introduce native bird conservationist host.',
        travelerAction: 'Check-in.',
        completed: false
      }
    ],
    travelerPreferences: {
      travelStyle: 'Eco-conscious & Bird Watching',
      interests: ['Birding', 'Backwater canoes', 'Organic coconut cuisine'],
      languagePreference: 'English',
      specialRequirements: ['Solo female traveler; verified safety corridor chauffeur required'],
      dietary: 'Vegan'
    },
    safarSetuInstructions: {
      version: 'v2.1',
      updatedAt: '12 Sep 2026, 06:00 AM',
      acknowledgedByPartner: false,
      items: [
        '1. Vetted police verification mandatory for solo traveler assignment.',
        '2. Provide solar boat connection coordinates upon arrival.'
      ]
    },
    earnings: {
      baseFare: 2200,
      distanceComponent: 1170,
      waitingAllowance: 200,
      storytellerFee: 1200,
      bonus: 200,
      totalPayable: 4970,
      payoutStatus: 'PENDING'
    },
    preTripChecklistCompleted: false,
    postTripChecklistCompleted: false,
    chatMessages: []
  }
];

export const payoutsStore: PartnerPayoutRecord[] = [
  {
    id: 'PAY-2026-901',
    payoutDate: '10 Sep 2026',
    amount: 19450,
    referenceNumber: 'NEFT-FDRL-98124012',
    status: 'PAID',
    period: 'Week 1 (1 Sep - 7 Sep 2026)',
    tripIds: ['SS-CONFIRM-9102', 'SS-CONFIRM-9104', 'SS-CONFIRM-9109']
  },
  {
    id: 'PAY-2026-882',
    payoutDate: '03 Sep 2026',
    amount: 23800,
    referenceNumber: 'NEFT-FDRL-97741289',
    status: 'PAID',
    period: 'Last Week of August 2026',
    tripIds: ['SS-CONFIRM-8901', 'SS-CONFIRM-8902', 'SS-CONFIRM-8908']
  }
];

export const supportTicketsStore: PartnerSupportTicket[] = [
  {
    id: 'TCK-2026-104',
    partnerId: 'ptr-1',
    category: 'Trip Problem',
    priority: 'NORMAL',
    subject: 'Ghat road fog detour on NH-85 corridor',
    status: 'RESOLVED',
    createdAt: '11 Sep 2026, 05:20 PM',
    updatedAt: '11 Sep 2026, 05:35 PM',
    assignedAgent: 'Ramesh Nair (Operations Lead, Kochi Hub)',
    messages: [
      { sender: 'Suresh Kurup', text: 'Heavy mist near Neriamangalam bridge. Taking recommended scenic bypass via Poopara.', time: '05:20 PM' },
      { sender: 'Operations', text: 'Acknowledged Suresh ji. Autonomous WhatsApp alert pushed to traveler Priya Sharma. All on track.', time: '05:24 PM' }
    ]
  }
];

export const companyAnnouncements = [
  {
    id: 'ANN-01',
    date: '12 Sep 2026',
    category: 'Operational Excellence',
    title: 'Monsoon Clean Corridor Initiative: 100% On-Time Performance',
    body: 'Kudos to our Kerala & Telangana partners for achieving 98.4% on-time airport pickups despite heavy rains. Remember to check tire treads and wiper blades before mountain descents.',
    priority: 'NORMAL'
  },
  {
    id: 'ANN-02',
    date: '10 Sep 2026',
    category: 'Zero Commission Guarantee',
    title: 'Instant Weekly Direct Bank Payouts Every Monday',
    body: 'All trip earnings are transferred directly via NEFT/UPI with 0% platform deductions. Transparent earnings breakdown is visible in your portal within 10 minutes of trip completion.',
    priority: 'HIGH'
  }
];

export const auditLogsStore: AuditLogEvent[] = [
  {
    id: 'AUD-901',
    timestamp: '12 Sep 2026, 07:15 AM',
    action: 'ASSIGNMENT_CREATED',
    performedBy: 'YatraSync Engine (Smart Match)',
    role: 'SYSTEM',
    assignmentId: 'ASG-KER-20491',
    details: 'Matched partner Suresh Kurup (ptr-1) based on score 98/100 (Tata Nexon EV, 4.96 rating, COK airport vicinity).'
  },
  {
    id: 'AUD-902',
    timestamp: '12 Sep 2026, 07:22 AM',
    action: 'ASSIGNMENT_ACCEPTED',
    performedBy: 'Suresh Kurup',
    role: 'PARTNER',
    assignmentId: 'ASG-KER-20491',
    details: 'Partner accepted assignment. Notification sent to traveler Priya Sharma.'
  },
  {
    id: 'AUD-903',
    timestamp: '12 Sep 2026, 08:30 AM',
    action: 'PRE_TRIP_CHECKLIST_SUBMITTED',
    performedBy: 'Suresh Kurup',
    role: 'PARTNER',
    assignmentId: 'ASG-KER-20491',
    details: 'Vehicle sanitized, phone battery 100%, mineral water loaded, welcome placard checked.'
  },
  {
    id: 'AUD-904',
    timestamp: '12 Sep 2026, 08:45 AM',
    action: 'EN_ROUTE_TO_PICKUP',
    performedBy: 'Suresh Kurup',
    role: 'PARTNER',
    assignmentId: 'ASG-KER-20491',
    details: 'Driver dispatched to Cochin Airport Terminal 3. ETA 18 mins. GPS beacon verified.'
  }
];

// Valid assignment state transitions
const ALLOWED_TRANSITIONS: Record<AssignmentStatus, AssignmentStatus[]> = {
  OFFERED: ['ACCEPTED', 'DECLINED', 'EXPIRED'],
  ACCEPTED: ['READY', 'CANCELLED'],
  READY: ['EN_ROUTE', 'CANCELLED'],
  EN_ROUTE: ['ARRIVED', 'INCIDENT'],
  ARRIVED: ['PICKED_UP', 'INCIDENT'],
  PICKED_UP: ['IN_PROGRESS', 'INCIDENT'],
  IN_PROGRESS: ['DROPPED_OFF', 'INCIDENT'],
  DROPPED_OFF: ['COMPLETED'],
  COMPLETED: [],
  DECLINED: [],
  EXPIRED: [],
  CANCELLED: [],
  INCIDENT: ['EN_ROUTE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
};

// ==========================================================
// 2. ROUTE REGISTRATION FUNCTION FOR SERVER.TS
// ==========================================================

export function registerPartnerAndAdminRoutes(
  app: any,
  getGeminiClient: () => GoogleGenAI | null,
  bookingsStore: any[]
) {

  // --- PARTNER AUTHENTICATION ---
  app.post('/api/partner/auth/request-otp', (req: Request, res: Response) => {
    const { phone } = req.body;
    if (!phone || String(phone).length < 8) {
      return res.status(400).json({ error: 'Please provide a valid Indian mobile number (+91).' });
    }

    const partner = partnersStore.find(p => p.phone.replace(/\s+/g, '') === String(phone).replace(/\s+/g, '')) || partnersStore[0];

    return res.json({
      message: `Verification code dispatched to ${phone}. (Sandbox Demo Code: 1234)`,
      expiresInSeconds: 300,
      partnerRole: partner.role,
      partnerName: partner.fullName
    });
  });

  app.post('/api/partner/auth/verify-otp', (req: Request, res: Response) => {
    const { phone, otp, selectedPartnerId } = req.body;
    
    // In sandbox, any 4-digit code works or '1234'
    if (!otp || String(otp).trim().length < 4) {
      return res.status(400).json({ error: 'Please enter a valid 4-digit OTP code.' });
    }

    let partner = partnersStore.find(p => p.id === selectedPartnerId);
    if (!partner) {
      partner = partnersStore.find(p => p.phone.replace(/\s+/g, '') === String(phone || '').replace(/\s+/g, '')) || partnersStore[0];
    }

    return res.json({
      token: `partner_token_${partner.id}_${Date.now()}`,
      partner,
      message: `Welcome back, ${partner.fullName}! YatraSync Partner Operations active.`
    });
  });

  // Current partner profile
  app.get('/api/partner/me', (req: Request, res: Response) => {
    const partnerId = String(req.headers['x-partner-id'] || 'ptr-1');
    const partner = partnersStore.find(p => p.id === partnerId) || partnersStore[0];
    res.json(partner);
  });

  // Partner Dashboard Summary
  app.get('/api/partner/dashboard', (req: Request, res: Response) => {
    const partnerId = String(req.headers['x-partner-id'] || 'ptr-1');
    const partner = partnersStore.find(p => p.id === partnerId) || partnersStore[0];

    const partnerAssignments = assignmentsStore.filter(a => a.partnerId === partner.id);
    const activeAssignment = partnerAssignments.find(a => ['ACCEPTED', 'READY', 'EN_ROUTE', 'ARRIVED', 'PICKED_UP', 'IN_PROGRESS'].includes(a.status));
    const pendingOffer = assignmentsStore.find(a => a.status === 'OFFERED' && (!a.partnerId || a.partnerId === partner.id));

    // Calculate earnings summary
    const completedAssignments = partnerAssignments.filter(a => a.status === 'COMPLETED');
    const totalEarned = completedAssignments.reduce((acc, a) => acc + a.earnings.totalPayable, 43250);

    res.json({
      partner,
      nextAssignment: activeAssignment || null,
      pendingOffer: pendingOffer || null,
      todayTripsCount: partnerAssignments.length,
      earningsSummary: {
        today: activeAssignment ? activeAssignment.earnings.totalPayable : 0,
        thisWeek: 19450,
        thisMonth: totalEarned,
        pendingPayout: 6760
      },
      announcements: companyAnnouncements,
      alerts: [
        { id: 'ALT-1', type: 'info', text: 'NH-85 mountain pass clear; scenic tea garden turnout open.' }
      ]
    });
  });

  // List Partner Assignments
  app.get('/api/partner/assignments', (req: Request, res: Response) => {
    const partnerId = String(req.headers['x-partner-id'] || 'ptr-1');
    const role = String(req.query.role || '');
    let list = assignmentsStore.filter(a => a.partnerId === partnerId || a.partnerId === '');

    if (role) {
      list = list.filter(a => a.assignedRole === role);
    }

    res.json({
      count: list.length,
      assignments: list
    });
  });

  // Single Assignment Details
  app.get('/api/partner/assignments/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const assignment = assignmentsStore.find(a => a.id === id);

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found.' });
    }

    res.json(assignment);
  });

  // Accept Assignment
  app.post('/api/partner/assignments/:id/accept', (req: Request, res: Response) => {
    const id = req.params.id;
    const partnerId = String(req.headers['x-partner-id'] || req.body.partnerId || 'ptr-1');
    const partner = partnersStore.find(p => p.id === partnerId) || partnersStore[0];

    const assignment = assignmentsStore.find(a => a.id === id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found.' });
    }

    if (assignment.status !== 'OFFERED') {
      return res.status(400).json({ error: `Cannot accept assignment in status '${assignment.status}'.` });
    }

    assignment.status = 'ACCEPTED';
    assignment.partnerId = partner.id;
    assignment.partnerName = partner.fullName;
    assignment.statusTimeline.push({
      status: 'ACCEPTED',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-IN'),
      note: `Accepted by ${partner.fullName}`
    });

    auditLogsStore.unshift({
      id: 'AUD-' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'ASSIGNMENT_ACCEPTED',
      performedBy: partner.fullName,
      role: 'PARTNER',
      assignmentId: assignment.id,
      details: `Partner ${partner.fullName} confirmed acceptance of trip #${assignment.pnr}.`
    });

    res.json({
      message: 'Assignment confirmed. Pickup instructions and company guidelines unlocked.',
      assignment
    });
  });

  // Decline Assignment
  app.post('/api/partner/assignments/:id/decline', (req: Request, res: Response) => {
    const id = req.params.id;
    const { reason } = req.body;
    const partnerId = String(req.headers['x-partner-id'] || 'ptr-1');
    const partner = partnersStore.find(p => p.id === partnerId) || partnersStore[0];

    const assignment = assignmentsStore.find(a => a.id === id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found.' });
    }

    assignment.status = 'DECLINED';
    assignment.statusTimeline.push({
      status: 'DECLINED',
      timestamp: new Date().toLocaleTimeString('en-IN'),
      note: `Declined by ${partner.fullName}: ${reason || 'Personal emergency'}`
    });

    auditLogsStore.unshift({
      id: 'AUD-' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'ASSIGNMENT_DECLINED',
      performedBy: partner.fullName,
      role: 'PARTNER',
      assignmentId: assignment.id,
      details: `Assignment returned to Operations queue. Reason: ${reason || 'Partner busy'}`
    });

    res.json({ message: 'Assignment declined. Operations notified for smart reassignment.', assignment });
  });

  // Update Trip Status (Strict State Machine)
  app.post('/api/partner/assignments/:id/status', (req: Request, res: Response) => {
    const id = req.params.id;
    const { nextStatus, coordinates, note } = req.body as {
      nextStatus: AssignmentStatus;
      coordinates?: { lat: number; lng: number };
      note?: string;
    };

    const assignment = assignmentsStore.find(a => a.id === id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found.' });
    }

    const currentStatus = assignment.status;
    const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];

    if (!allowed.includes(nextStatus)) {
      return res.status(400).json({
        error: `Invalid transition from '${currentStatus}' to '${nextStatus}'. Allowed next steps: ${allowed.join(', ') || 'None (Trip completed)'}`
      });
    }

    assignment.status = nextStatus;
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    assignment.statusTimeline.push({
      status: nextStatus,
      timestamp: `${timeStr}, ${new Date().toLocaleDateString('en-IN')}`,
      note: note || `Status updated to ${nextStatus}`
    });

    // Synchronize authoritative booking state
    const relatedBooking = bookingsStore.find(b => b.pnr === assignment.pnr || b.id === assignment.bookingId);
    if (relatedBooking) {
      if (nextStatus === 'COMPLETED') {
        relatedBooking.status = 'Confirmed';
      }
    }

    auditLogsStore.unshift({
      id: 'AUD-' + Date.now(),
      timestamp: new Date().toISOString(),
      action: `TRIP_STATUS_${nextStatus}`,
      performedBy: assignment.partnerName,
      role: 'PARTNER',
      assignmentId: assignment.id,
      details: `Driver marked '${nextStatus}'. Location: ${coordinates ? `${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}` : 'GPS Verified'}`
    });

    // Notify traveler through system chat message
    let notificationText = '';
    if (nextStatus === 'ARRIVED') {
      notificationText = `Your YatraSync partner ${assignment.partnerName} has arrived at ${assignment.pickupLocation}. Meeting at ${assignment.pickupGate}.`;
    } else if (nextStatus === 'PICKED_UP' || nextStatus === 'IN_PROGRESS') {
      notificationText = `Trip started at ${timeStr}. Your storyteller chauffeur ${assignment.partnerName} is now guiding you to ${assignment.destinationName}.`;
    } else if (nextStatus === 'COMPLETED') {
      notificationText = `Trip safely completed at ${timeStr}. All luggage handed over. Thank you for traveling with YatraSync!`;
    }

    if (notificationText) {
      assignment.chatMessages.push({
        id: 'msg-' + Date.now(),
        senderRole: 'system',
        senderName: 'YatraSync Operations',
        text: notificationText,
        timestamp: timeStr,
        delivered: true,
        read: true
      });
    }

    res.json({
      message: `Trip state successfully transitioned to '${nextStatus}'.`,
      assignment
    });
  });

  // Mark Operational Stop Complete
  app.post('/api/partner/assignments/:id/stop-complete', (req: Request, res: Response) => {
    const id = req.params.id;
    const { stopIndex } = req.body;

    const assignment = assignmentsStore.find(a => a.id === id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found.' });
    }

    const idx = Number(stopIndex ?? assignment.currentStopIndex);
    if (assignment.stops[idx]) {
      assignment.stops[idx].completed = true;
      assignment.stops[idx].completedAt = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      if (idx + 1 < assignment.stops.length) {
        assignment.currentStopIndex = idx + 1;
      }
    }

    res.json({
      message: `Stop #${idx + 1} marked completed. Next destination activated.`,
      currentStopIndex: assignment.currentStopIndex,
      assignment
    });
  });

  // Report Delay
  app.post('/api/partner/assignments/:id/delay', (req: Request, res: Response) => {
    const id = req.params.id;
    const { reason, delayMinutes, message } = req.body;

    const assignment = assignmentsStore.find(a => a.id === id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found.' });
    }

    const mins = Number(delayMinutes) || 15;
    assignment.delayReport = {
      reportedAt: new Date().toLocaleTimeString('en-IN'),
      reason: reason || 'Heavy Traffic',
      delayMinutes: mins,
      message: message || `Encountered ${mins}m delay due to road conditions.`,
      acknowledgedByOps: true
    };

    assignment.etaMinutes = (assignment.etaMinutes || 15) + mins;

    // Push alert to chat
    assignment.chatMessages.push({
      id: 'msg-' + Date.now(),
      senderRole: 'system',
      senderName: 'YatraSync Operations',
      text: `Notice: Chauffeur reported a ${mins}-minute delay due to ${reason || 'transit conditions'}. New estimated arrival: ${assignment.etaMinutes} mins.`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      delivered: true,
      read: true
    });

    auditLogsStore.unshift({
      id: 'AUD-' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'DELAY_REPORTED',
      performedBy: assignment.partnerName,
      role: 'PARTNER',
      assignmentId: assignment.id,
      details: `Delay of ${mins} mins reported (${reason}). Traveler and Operations alerted.`
    });

    res.json({
      message: 'Delay report logged. Traveler and Operations team notified with updated ETA.',
      assignment
    });
  });

  // Report Vehicle Breakdown / Emergency
  app.post('/api/partner/assignments/:id/emergency', (req: Request, res: Response) => {
    const id = req.params.id;
    const { type, description } = req.body;

    const assignment = assignmentsStore.find(a => a.id === id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found.' });
    }

    assignment.status = 'INCIDENT';
    assignment.emergencyReport = {
      reportedAt: new Date().toLocaleTimeString('en-IN'),
      type: type || 'Vehicle Mechanical Issue',
      description: description || 'Emergency breakdown protocol activated.',
      status: 'ACTIVE'
    };

    // Auto-create High Priority Support Ticket
    supportTicketsStore.unshift({
      id: 'TCK-' + Math.floor(1000 + Math.random() * 9000),
      partnerId: assignment.partnerId,
      category: 'Vehicle Problem',
      priority: 'EMERGENCY',
      subject: `Emergency Incident on Assignment #${assignment.id}: ${type}`,
      status: 'OPEN',
      createdAt: new Date().toLocaleTimeString('en-IN') + ', ' + new Date().toLocaleDateString('en-IN'),
      updatedAt: new Date().toLocaleTimeString('en-IN'),
      assignedAgent: 'Emergency Operations Desk (Tier 1 Priority)',
      messages: [
        { sender: assignment.partnerName, text: `Emergency Reported: ${type}. ${description}`, time: new Date().toLocaleTimeString('en-IN') },
        { sender: 'Emergency Desk', text: 'Backup commercial fleet vehicle & roadside assistance dispatched immediately. Traveler safe.', time: new Date().toLocaleTimeString('en-IN') }
      ]
    });

    auditLogsStore.unshift({
      id: 'AUD-' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'EMERGENCY_INCIDENT_REPORTED',
      performedBy: assignment.partnerName,
      role: 'PARTNER',
      assignmentId: assignment.id,
      details: `Emergency: ${type}. Operations roadside assistance triggered.`
    });

    res.json({
      message: 'Emergency protocol engaged. Operations center and replacement vehicle alerted.',
      emergencyContact: 'Tourist Police 112 / YatraSync 24/7 Operations Desk (+91 1800-425-SYNC)',
      assignment
    });
  });

  // Trip Chat - GET & POST
  app.get('/api/partner/assignments/:id/chat', (req: Request, res: Response) => {
    const assignment = assignmentsStore.find(a => a.id === req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found.' });
    res.json(assignment.chatMessages);
  });

  app.post('/api/partner/assignments/:id/chat', (req: Request, res: Response) => {
    const { text, senderRole, senderName } = req.body;
    const assignment = assignmentsStore.find(a => a.id === req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found.' });

    const newMsg: PartnerChatMessage = {
      id: 'msg-' + Date.now(),
      senderRole: senderRole || 'driver',
      senderName: senderName || assignment.partnerName,
      text: String(text).trim(),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      delivered: true,
      read: true
    };

    assignment.chatMessages.push(newMsg);
    res.json(newMsg);
  });

  // Pre/Post-Trip Checklist Submit
  app.post('/api/partner/checklist/submit', (req: Request, res: Response) => {
    const { assignmentId, type, items } = req.body;
    const assignment = assignmentsStore.find(a => a.id === assignmentId);
    if (assignment) {
      if (type === 'pre-trip') assignment.preTripChecklistCompleted = true;
      if (type === 'post-trip') assignment.postTripChecklistCompleted = true;
    }
    res.json({ success: true, message: `${type} checklist recorded successfully.` });
  });

  // Partner Availability
  app.get('/api/partner/availability', (req: Request, res: Response) => {
    const partnerId = String(req.headers['x-partner-id'] || 'ptr-1');
    const partner = partnersStore.find(p => p.id === partnerId) || partnersStore[0];
    res.json({
      partnerId: partner.id,
      availabilityStatus: partner.availabilityStatus,
      schedule: [
        { date: 'Today', status: partner.availabilityStatus },
        { date: 'Tomorrow', status: 'AVAILABLE' },
        { date: '14 Sep 2026', status: 'AVAILABLE' },
        { date: '15 Sep 2026', status: 'BUSY' }
      ]
    });
  });

  app.post('/api/partner/availability', (req: Request, res: Response) => {
    const partnerId = String(req.headers['x-partner-id'] || 'ptr-1');
    const { status } = req.body;
    const partner = partnersStore.find(p => p.id === partnerId) || partnersStore[0];

    partner.availabilityStatus = status || 'AVAILABLE';
    res.json({
      message: `Availability status updated to '${partner.availabilityStatus}'`,
      status: partner.availabilityStatus
    });
  });

  // Documents
  app.get('/api/partner/documents', (req: Request, res: Response) => {
    const partnerId = String(req.headers['x-partner-id'] || 'ptr-1');
    const docs = partnerDocumentsStore[partnerId] || partnerDocumentsStore['ptr-1'];
    res.json(docs);
  });

  // Earnings & Payouts
  app.get('/api/partner/earnings', (req: Request, res: Response) => {
    const partnerId = String(req.headers['x-partner-id'] || 'ptr-1');
    const partner = partnersStore.find(p => p.id === partnerId) || partnersStore[0];
    const completedAssignments = assignmentsStore.filter(a => a.partnerId === partner.id);

    res.json({
      totalEarnings: 62700,
      pendingPayout: 6760,
      thisWeek: 19450,
      lastPayout: payoutsStore[0],
      payoutRecords: payoutsStore,
      tripEarningsBreakdown: completedAssignments.map(a => ({
        assignmentId: a.id,
        destination: a.destinationName,
        traveler: a.travelerName,
        date: a.pickupDate,
        earnings: a.earnings,
        status: a.status
      }))
    });
  });

  // Support Tickets
  app.get('/api/partner/support/tickets', (req: Request, res: Response) => {
    res.json(supportTicketsStore);
  });

  app.post('/api/partner/support/tickets', (req: Request, res: Response) => {
    const { category, priority, subject, message } = req.body;
    const partnerId = String(req.headers['x-partner-id'] || 'ptr-1');
    const partner = partnersStore.find(p => p.id === partnerId) || partnersStore[0];

    const ticket: PartnerSupportTicket = {
      id: 'TCK-' + Math.floor(1000 + Math.random() * 9000),
      partnerId,
      category: category || 'Trip Problem',
      priority: priority || 'NORMAL',
      subject: subject || 'General Support Inquiry',
      status: 'OPEN',
      createdAt: new Date().toLocaleTimeString('en-IN') + ', ' + new Date().toLocaleDateString('en-IN'),
      updatedAt: new Date().toLocaleTimeString('en-IN'),
      assignedAgent: 'YatraSync Partner Desk',
      messages: [
        { sender: partner.fullName, text: message || subject, time: new Date().toLocaleTimeString('en-IN') }
      ]
    };

    supportTicketsStore.unshift(ticket);
    res.status(201).json(ticket);
  });

  // SafarMitra Storyteller AI Assistant (Grounded + Gemini)
  app.post('/api/partner/ai/story-guide', async (req: Request, res: Response) => {
    const { query, stopName, travelerContext, destinationKey } = req.body;
    const q = String(query || '').trim();

    const client = getGeminiClient();
    if (client && q) {
      try {
        const response = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [{ role: 'user', parts: [{ text: q }] }],
          config: {
            systemInstruction: `You are SafarMitra Storyteller Companion, an AI assistant dedicated to helping verified Indian tourist chauffeurs and local storytellers narrate authentic history and culture.
Destination context: ${destinationKey || 'India'}.
Stop: ${stopName || 'Heritage site'}.
Traveler Context: ${JSON.stringify(travelerContext || {})}.
Rules:
1. Provide a vivid, engaging 2-minute oral storytelling script.
2. Highlight cultural folklore, architecture secrets, and local culinary pairing.
3. Keep tone respectful, historically verified, and culturally accurate.
4. If family with children: include an engaging interactive curiosity hook.
5. Max 150 words in 3 concise bullet points.`,
            temperature: 0.7
          }
        });

        return res.json({
          guide: response.text?.trim(),
          source: 'gemini-3.8-flash'
        });
      } catch (err) {
        console.warn('Gemini storyteller assistant error:', err);
      }
    }

    // Fallback grounded narrative
    return res.json({
      guide: `**Storyteller Guide for ${stopName || 'Heritage Stop'}:**
• **Historical Narrative:** Introduce the centuries-old trade routes where Roman gold and spices exchanged hands. Explain how the architecture adapted to monsoon moisture and sea winds.
• **Local Secret:** Point out the hand-carved teak woodwork and natural lime plaster that keeps the interior 5 degrees cooler without electricity.
• **Culinary Pairing:** Recommend the hot banana fritters and freshly crushed cardamom tea from the cooperative stall across the street.`,
      source: 'grounded-story-engine'
    });
  });

  // ==========================================================
  // 3. ADMIN / OPERATIONS PLATFORM ROUTES
  // ==========================================================

  // Operations Dashboard Overview
  app.get('/api/admin/operations', (req: Request, res: Response) => {
    const totalAssignments = assignmentsStore.length;
    const active = assignmentsStore.filter(a => ['EN_ROUTE', 'ARRIVED', 'PICKED_UP', 'IN_PROGRESS'].includes(a.status));
    const unassigned = assignmentsStore.filter(a => a.status === 'OFFERED' && !a.partnerId);
    const delayed = assignmentsStore.filter(a => a.delayReport && a.status !== 'COMPLETED');
    const incidents = assignmentsStore.filter(a => a.status === 'INCIDENT');
    const completed = assignmentsStore.filter(a => a.status === 'COMPLETED');

    res.json({
      stats: {
        totalAssignments,
        activeTrips: active.length,
        unassignedTrips: unassigned.length,
        delayedTrips: delayed.length,
        activeIncidents: incidents.length,
        completedTrips: completed.length,
        onTimePerformance: '98.4%'
      },
      assignments: assignmentsStore,
      partners: partnersStore,
      incidents,
      auditLogs: auditLogsStore.slice(0, 15)
    });
  });

  // Smart Partner Matching Engine
  app.get('/api/admin/matching/:assignmentId', (req: Request, res: Response) => {
    const assignment = assignmentsStore.find(a => a.id === req.params.assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found.' });
    }

    // Calculate match score for each partner
    const scoredPartners = partnersStore.map(p => {
      let score = 50; // Base score
      const reasons: string[] = [];

      // Availability check (+25)
      if (p.availabilityStatus === 'AVAILABLE') {
        score += 25;
        reasons.push('Immediately Available');
      } else {
        score -= 20;
        reasons.push('Currently on trip / busy');
      }

      // Location match (+15)
      const matchesArea = p.serviceAreas.some(area =>
        assignment.pickupLocation.toLowerCase().includes(area.toLowerCase().split(' ')[0]) ||
        assignment.destinationName.toLowerCase().includes(p.serviceAreas[0].toLowerCase().split(' ')[0])
      );
      if (matchesArea) {
        score += 15;
        reasons.push(`Service area match (${p.serviceAreas[0]})`);
      }

      // Rating bonus (+10)
      if (p.rating >= 4.9) {
        score += 10;
        reasons.push(`Top-rated partner (${p.rating}★)`);
      }

      // Experience (+5)
      if (p.yearsExperience >= 10) {
        score += 5;
        reasons.push(`${p.yearsExperience} yrs verified experience`);
      }

      // Vehicle match (+5)
      if (p.vehicle && p.vehicle.capacity >= assignment.guestsCount) {
        score += 5;
        reasons.push(`Vehicle capacity verified (${p.vehicle.model})`);
      }

      return {
        partner: p,
        score: Math.min(100, Math.max(0, score)),
        reasons
      };
    }).sort((a, b) => b.score - a.score);

    res.json({
      assignmentId: assignment.id,
      travelerName: assignment.travelerName,
      pickup: assignment.pickupLocation,
      recommendedCandidates: scoredPartners
    });
  });

  // Admin Assign / Reassign Partner
  app.post('/api/admin/assign', (req: Request, res: Response) => {
    const { assignmentId, partnerId, reason } = req.body;
    const assignment = assignmentsStore.find(a => a.id === assignmentId);
    const partner = partnersStore.find(p => p.id === partnerId);

    if (!assignment || !partner) {
      return res.status(400).json({ error: 'Invalid assignment or partner ID.' });
    }

    const previousPartner = assignment.partnerName;
    assignment.partnerId = partner.id;
    assignment.partnerName = partner.fullName;
    assignment.assignedRole = partner.role;
    assignment.status = 'ACCEPTED';
    
    assignment.statusTimeline.push({
      status: 'ACCEPTED',
      timestamp: new Date().toLocaleTimeString('en-IN') + ', ' + new Date().toLocaleDateString('en-IN'),
      note: `Assigned by Operations (${reason || 'Smart matching'})`
    });

    auditLogsStore.unshift({
      id: 'AUD-' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'ADMIN_REASSIGNMENT',
      performedBy: 'Operations Dispatcher',
      role: 'ADMIN',
      assignmentId: assignment.id,
      details: `Reassigned from '${previousPartner}' to '${partner.fullName}'. Reason: ${reason || 'Operational optimization'}.`
    });

    res.json({
      message: `Assignment successfully linked to ${partner.fullName}. Partner notified via instant portal push.`,
      assignment
    });
  });

  // Admin Audit Log
  app.get('/api/admin/audit-log', (req: Request, res: Response) => {
    res.json(auditLogsStore);
  });

  // Tour Operator Onboarding API
  app.post('/api/partner/tour-operator/onboard', (req: Request, res: Response) => {
    const data = req.body;
    const partnerId = 'ptr-' + Date.now();
    const newPartner: PartnerProfileData = {
      id: partnerId,
      fullName: data.fullName || 'Verified Operator',
      phone: data.phone || '+91 98765 43210',
      email: data.email || 'operator@yatrasync.in',
      role: data.role === 'GUIDE' ? 'LOCAL_STORYTELLER' : (data.role === 'DRIVER' ? 'DRIVER' : 'DRIVER_STORYTELLER'),
      capability: data.role === 'GUIDE' ? 'STORYTELLER_ONLY' : (data.role === 'DRIVER' ? 'DRIVER_ONLY' : 'DRIVER_AND_STORYTELLER'),
      avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      rating: 5.0,
      ratingsBreakdown: { professionalism: 5.0, punctuality: 5.0, cleanliness: 5.0, localKnowledge: 5.0, communication: 5.0 },
      totalTrips: 0,
      completedTrips: 0,
      cancellationRate: '0.0%',
      onTimeRate: '100%',
      verificationStatus: 'VERIFIED',
      languages: data.languages || ['English', 'Hindi'],
      yearsExperience: data.yearsExperience || 3,
      serviceAreas: data.serviceAreas || ['Regional Circuit'],
      specialties: data.specialties || ['Regional Heritage'],
      bio: data.bio || 'Verified YatraSync field tour operator.',
      vehicle: data.vehicle || {
        type: 'Tourist Vehicle',
        model: data.vehicleModel || 'Tata Nexon EV',
        registrationNumber: data.registrationNumber || 'TS-09-EX-1001',
        capacity: data.capacity || 4,
        isAC: true,
        luggageBagsCapacity: 3,
        permitType: 'All India Commercial Permit',
        insuranceValid: true
      },
      emergencyContact: { name: 'Emergency Contact', relationship: 'Family', phone: data.phone },
      bankAccount: { bankName: 'HDFC Bank', maskedAccountNumber: '•••• 4321', ifscCode: 'HDFC0001234', upiId: 'operator@upi' },
      availabilityStatus: 'AVAILABLE'
    };

    partnersStore.push(newPartner);
    res.json({ message: 'Tour Operator registered successfully', partner: newPartner });
  });

  // Hotel Partner Onboarding API
  app.post('/api/partner/hotel/onboard', (req: Request, res: Response) => {
    const data = req.body;
    const propertyId = 'prop-' + Date.now();
    const newProperty: HotelPropertyData = {
      id: propertyId,
      propertyName: data.propertyName || 'YatraSync Partner Hotel',
      propertyType: data.propertyType || 'homestay',
      ownerName: data.ownerName || 'Property Owner',
      contactPhone: data.contactPhone || '+91 98765 43210',
      contactEmail: data.contactEmail || 'hotel@yatrasync.in',
      address: data.address || { line: 'Main Road', city: 'Kochi', state: 'Kerala', pincode: '682001' },
      details: data.details || {
        roomCount: data.roomCount || 5,
        baseTariffINR: data.baseTariffINR || 1800,
        description: data.description || 'Verified zero-surcharge homestay partner.',
        amenities: data.amenities || ['Wi-Fi', 'Free Breakfast', 'Parking'],
        photos: data.photos || ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80']
      },
      verification: data.verification || {
        panNumber: data.panNumber || 'ABCDE1234F',
        gstin: data.gstin || '32ABCDE1234F1Z5',
        digiLockerVerified: true,
        documentUrls: []
      },
      approvalStatus: 'UNDER_REVIEW',
      rating: 4.8,
      totalBookings: 0,
      createdAt: new Date().toISOString()
    };

    hotelPropertiesStore.push(newProperty);
    res.json({ message: 'Hotel property submitted for verification', property: newProperty });
  });

  // Get Hotel Property Details
  app.get('/api/partner/hotel/:id', (req: Request, res: Response) => {
    const property = hotelPropertiesStore.find(p => p.id === req.params.id) || hotelPropertiesStore[0];
    res.json(property);
  });

  // Admin Approve / Reject Hotel Property
  app.put('/api/partner/hotel/:id/status', (req: Request, res: Response) => {
    const { approvalStatus } = req.body;
    const property = hotelPropertiesStore.find(p => p.id === req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    property.approvalStatus = approvalStatus;
    res.json({ message: `Property status updated to ${approvalStatus}`, property });
  });

  // Get Room Types for a Property
  app.get('/api/partner/hotel/:id/rooms', (req: Request, res: Response) => {
    const hotelId = req.params.id;
    const rooms = roomTypesStore.filter(r => r.hotelId === hotelId || hotelId === 'prop-101');
    res.json(rooms);
  });

  // Add a new Room Type
  app.post('/api/partner/hotel/:id/rooms', (req: Request, res: Response) => {
    const hotelId = req.params.id;
    const data = req.body;
    const newRoom: RoomTypeData = {
      id: 'rt-' + Date.now(),
      hotelId: hotelId || 'prop-101',
      name: data.name || 'Deluxe Room',
      description: data.description || '',
      bedConfig: data.bedConfig || 'King Bed',
      roomSizeSqft: Number(data.roomSizeSqft) || 320,
      inventoryCount: Number(data.inventoryCount) || 1,
      maxOccupancy: Number(data.maxOccupancy) || 3,
      adultCapacity: Number(data.adultCapacity) || 2,
      childCapacity: Number(data.childCapacity) || 1,
      basePrice: Number(data.basePrice) || 2500,
      extraAdultPrice: Number(data.extraAdultPrice) || 500,
      extraChildPrice: Number(data.extraChildPrice) || 250,
      amenities: Array.isArray(data.amenities) ? data.amenities : ['Wi-Fi', 'Attached Bath'],
      status: data.status || 'ACTIVE',
      photos: data.photos && data.photos.length > 0 ? data.photos : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80'],
      createdAt: new Date().toISOString()
    };
    roomTypesStore.push(newRoom);
    res.status(201).json({ message: 'Room type added successfully', room: newRoom });
  });

  // Update a Room Type
  app.put('/api/partner/hotel/rooms/:roomId', (req: Request, res: Response) => {
    const { roomId } = req.params;
    const idx = roomTypesStore.findIndex(r => r.id === roomId);
    if (idx === -1) return res.status(404).json({ error: 'Room type not found' });

    const updated = {
      ...roomTypesStore[idx],
      ...req.body,
      id: roomId
    };
    roomTypesStore[idx] = updated;
    res.json({ message: 'Room type updated successfully', room: updated });
  });

  // Delete a Room Type
  app.delete('/api/partner/hotel/rooms/:roomId', (req: Request, res: Response) => {
    const { roomId } = req.params;
    const idx = roomTypesStore.findIndex(r => r.id === roomId);
    if (idx === -1) return res.status(404).json({ error: 'Room type not found' });
    const deleted = roomTypesStore.splice(idx, 1);
    res.json({ message: 'Room type deleted successfully', room: deleted[0] });
  });

  // ==========================================================
  // VEHICLE RENTAL PARTNER & AVAILABILITY API HANDLERS
  // ==========================================================
  const vehicleBookingsStore: { vehicleId: string; startDate: string; endDate: string }[] = [
    { vehicleId: 'kerala-rv-innova', startDate: '2026-09-01', endDate: '2026-09-05' }
  ];

  // Check vehicle availability (prevents double-booking overlap)
  app.post('/api/rental/check-availability', (req: Request, res: Response) => {
    const { vehicleId, startDate, endDate } = req.body;
    const isOverlap = vehicleBookingsStore.some(b => 
      b.vehicleId === vehicleId && 
      !(new Date(endDate) <= new Date(b.startDate) || new Date(startDate) >= new Date(b.endDate))
    );
    res.json({ available: !isOverlap, vehicleId, startDate, endDate });
  });

  // Image verification status endpoint for Vehicle Rental Partners / Admins
  app.post('/api/rental/image-verification', (req: Request, res: Response) => {
    const { vehicleId, verified, match } = req.body;
    res.json({
      message: 'Vehicle image verification updated',
      vehicleId,
      image_verified: Boolean(verified),
      image_vehicle_match: Boolean(match)
    });
  });

  // ==========================================================
  // PLATFORM HOTEL ADMIN API HANDLERS - Handled by Python FastAPI & MySQL backend
  // ==========================================================
}

