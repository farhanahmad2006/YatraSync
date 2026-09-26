// Changes made by @MdFarhanAhmad
import React, { useState, useEffect } from 'react';
import { UserSession, HotelPropertyData, RoomTypeData, normalizeUserRole } from '../../types';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Bed,
  DollarSign,
  Calendar,
  MapPin,
  Plus,
  User,
  Phone,
  Mail,
  Award,
  ShieldAlert,
  ArrowLeft,
  Eye,
  Lock,
  Edit2,
  Trash2,
  X,
  Sparkles,
  Check,
  Users,
  Search,
  Filter,
  Layers,
  Image as ImageIcon,
  Ban,
  KeyRound,
  Upload,
  Loader2
} from 'lucide-react';
import { ChangePasswordModal } from '../modals/ChangePasswordModal';

interface HotelPartnerDashboardProps {
  user: UserSession;
  property?: HotelPropertyData | null;
  onNavigate: (view: any) => void;
  activeTab?: 'overview' | 'rooms' | 'bookings' | 'verification';
  onSelectTab?: (tab: 'overview' | 'rooms' | 'bookings' | 'verification') => void;
}

const AVAILABLE_AMENITIES = [
  'Wi-Fi',
  'Air Conditioning',
  'Private Balcony',
  'Mountain View',
  'Valley View Balcony',
  'Ayurvedic Spa Access',
  'Farm Breakfast',
  'Tea/Coffee Maker',
  'Attached Bath',
  'Private Plunge Pool',
  'Fireplace',
  'Butler Service',
  'Smart TV',
  'Room Heater',
  'Mini Bar',
  'Work Desk',
  '24x7 Hot Water',
  'King Bed',
  'Bathtub'
];

const SAMPLE_ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=80'
];

const DEFAULT_ROOM_TYPES: RoomTypeData[] = [
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
    amenities: ['Wi-Fi', 'Private Plunge Pool', 'Fireplace', 'Butler Service', 'Valley View Balcony', 'Ayurvedic Spa Access', 'Farm Breakfast', 'Bathtub'],
    status: 'ACTIVE',
    photos: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80'],
    createdAt: new Date().toISOString()
  }
];

export const HotelPartnerDashboard: React.FC<HotelPartnerDashboardProps> = ({
  user,
  property,
  onNavigate,
  activeTab: externalActiveTab,
  onSelectTab
}) => {
  const [localActiveTab, setLocalActiveTab] = useState<'overview' | 'rooms' | 'bookings' | 'verification'>('overview');
  const currentTab = externalActiveTab || localActiveTab;

  const handleTabChange = (tab: 'overview' | 'rooms' | 'bookings' | 'verification') => {
    setLocalActiveTab(tab);
    if (onSelectTab) onSelectTab(tab);
  };

  // IN-COMPONENT RBAC GUARD
  const canonicalRole = normalizeUserRole(user.role);
  const isAuthorized = canonicalRole === 'HOTEL_OWNER' || canonicalRole === 'HOTEL_ADMIN' || canonicalRole === 'SUPER_ADMIN';

  // Fetch authenticated property dynamically if not provided in props
  const [fetchedProperty, setFetchedProperty] = useState<HotelPropertyData | null>(null);
  const [assignedProperties, setAssignedProperties] = useState<HotelPropertyData[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('safarsetu_token') || localStorage.getItem('token');
    
    // Fetch assigned properties for multi-property owners
    fetch('/api/v1/hotels/assigned', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setAssignedProperties(data);
            if (!property && !fetchedProperty) {
              setFetchedProperty(data[0]);
            }
          }
        }
      })
      .catch(() => {});

    if (property) {
      setFetchedProperty(property);
      return;
    }
    const propId = user.hotelPropertyId;
    const endpoint = propId ? `/api/v1/hotels/${propId}` : '/api/v1/hotels';

    fetch(endpoint, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            if (data.length > 0) setFetchedProperty(data[0]);
          } else if (data && data.id) {
            setFetchedProperty(data);
          }
        }
      })
      .catch(() => {});
  }, [property, user.hotelPropertyId, user.id]);

  // Clean authentic property data matching logged-in user
  const displayProperty: HotelPropertyData = property || fetchedProperty || {
    id: user.hotelPropertyId || `prop-${user.id || 'new'}`,
    propertyName: user.name ? `${user.name}'s Homestay & Heritage Stay` : 'Zero-Commission Homestay',
    propertyType: 'homestay',
    ownerName: user.name || 'Property Owner',
    contactPhone: user.phone || '+91 98765 43210',
    contactEmail: user.email || `${(user.name || 'owner').toLowerCase().replace(/\s+/g, '')}@yatrasync.in`,
    address: {
      line: 'Scenic Plantation Viewpoint Road',
      city: 'Munnar',
      state: 'Kerala',
      pincode: '685612',
      landmark: 'Near Tea Gardens'
    },
    details: {
      roomCount: 4,
      baseTariffINR: 2400,
      description: 'Zero-commission verified property listed on YatraSync Indian travel network.',
      amenities: ['Wi-Fi', 'Valley View Balcony', 'Free Breakfast', '24x7 Power Backup', 'Parking'],
      photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80']
    },
    verification: {
      panNumber: 'ABCDE1234F',
      gstin: '32ABCDE1234F1Z5',
      digiLockerVerified: true,
      documentUrls: []
    },
    approvalStatus: user.verificationStatus === 'UNDER_REVIEW' ? 'UNDER_REVIEW' : 'APPROVED',
    rating: 4.9,
    totalBookings: 0,
    createdAt: new Date().toISOString()
  };

  const isUnderReview = displayProperty.approvalStatus === 'UNDER_REVIEW';
  const isBlocked = displayProperty.approvalStatus === 'BLOCKED' || displayProperty.approvalStatus === 'SUSPENDED';
  const activePropertyId = displayProperty.id || property?.id || fetchedProperty?.id || user.hotelPropertyId || 'prop-102';

  // Room Inventory State
  const [roomTypes, setRoomTypes] = useState<RoomTypeData[]>(() => {
    const propId = property?.id || user.hotelPropertyId || 'prop-102';
    const saved = localStorage.getItem(`hotel_rooms_${propId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved room types', e);
      }
    }
    return DEFAULT_ROOM_TYPES;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'SOLD_OUT'>('ALL');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [isHoldModalOpen, setIsHoldModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [holdForm, setHoldForm] = useState({
    roomTypeId: '',
    quantity: 1,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    reason: 'MAINTENANCE',
    note: ''
  });

  // Form State for Add / Edit Modal
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    bedConfig: 'King Bed',
    roomSizeSqft: 350,
    inventoryCount: 4,
    maxOccupancy: 3,
    adultCapacity: 2,
    childCapacity: 1,
    basePrice: 2800,
    extraAdultPrice: 600,
    extraChildPrice: 300,
    amenities: ['Wi-Fi', 'Attached Bath', 'Farm Breakfast'] as string[],
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'SOLD_OUT',
    photoUrl: SAMPLE_ROOM_IMAGES[0]
  });

  // Multiple Hotel Photos State
  const [hotelPhotos, setHotelPhotos] = useState<{ id: string; imageUrl: string; isVerified?: boolean }[]>([]);
  const [imagePreviews, setImagePreviews] = useState<{ id: string; file: File; url: string; name: string; size: string }[]>([]);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);

  // Load rooms from backend API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem('safarsetu_token') || localStorage.getItem('token');
        const res = await fetch(`/api/v1/hotels/${activePropertyId}/rooms`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setRoomTypes(data.map((r: any) => ({
              id: r.id,
              hotelId: r.hotelId || activePropertyId,
              name: r.name,
              description: r.description || '',
              bedConfig: r.bedConfig || 'King Bed',
              roomSizeSqft: r.roomSizeSqft || 320,
              inventoryCount: r.inventoryCount || 1,
              maxOccupancy: r.maxOccupancy || 3,
              adultCapacity: r.adultCapacity || 2,
              childCapacity: r.childCapacity || 1,
              basePrice: r.basePrice || 2500,
              extraAdultPrice: r.extraAdultPrice || 500,
              extraChildPrice: r.extraChildPrice || 250,
              amenities: r.amenities || ['Wi-Fi'],
              status: r.status || 'ACTIVE',
              photos: r.photos || [SAMPLE_ROOM_IMAGES[0]],
              createdAt: r.createdAt
            })));
          }
        }
      } catch {
        // Fall back to localStorage / defaults quietly
      }
    };
    fetchRooms();
  }, [activePropertyId]);

  // Fetch Hotel Photos from backend PostgreSQL database
  const fetchHotelPhotos = async () => {
    if (!activePropertyId) return;
    try {
      const token = localStorage.getItem('safarsetu_token') || localStorage.getItem('token');
      const res = await fetch(`/api/v1/hotels/${activePropertyId}/images`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setHotelPhotos(data);
          return;
        }
      }
      if (displayProperty.details?.photos && displayProperty.details.photos.length > 0) {
        setHotelPhotos(displayProperty.details.photos.map((url, i) => ({ id: `default-${i}`, imageUrl: url, isVerified: true })));
      }
    } catch {
      if (displayProperty.details?.photos && displayProperty.details.photos.length > 0) {
        setHotelPhotos(displayProperty.details.photos.map((url, i) => ({ id: `default-${i}`, imageUrl: url, isVerified: true })));
      }
    }
  };

  useEffect(() => {
    fetchHotelPhotos();
  }, [activePropertyId]);

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoUploadError(null);
    const files: File[] = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const newValidFiles: File[] = [];
    const newPreviews: { id: string; file: File; url: string; name: string; size: string }[] = [];

    for (const f of files) {
      if (!validTypes.includes(f.type.toLowerCase()) && !f.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
        setPhotoUploadError(`File "${f.name}" has an unsupported format. Allowed: JPG, PNG, WEBP.`);
        continue;
      }
      if (f.size > 10 * 1024 * 1024) {
        setPhotoUploadError(`File "${f.name}" exceeds maximum allowed size of 10 MB.`);
        continue;
      }
      newValidFiles.push(f);
      newPreviews.push({
        id: `${f.name}-${Date.now()}-${Math.random()}`,
        file: f,
        url: URL.createObjectURL(f),
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`
      });
    }

    setImagePreviews(prev => [...prev, ...newPreviews]);
    e.target.value = '';
  };

  const handleRemovePreview = (previewId: string) => {
    setImagePreviews(prev => {
      const target = prev.find(p => p.id === previewId);
      if (target) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter(p => p.id !== previewId);
    });
  };

  const handleCancelPreviews = () => {
    imagePreviews.forEach(p => URL.revokeObjectURL(p.url));
    setImagePreviews([]);
    setPhotoUploadError(null);
  };

  const handleUploadPhotos = async () => {
    const filesToUpload = imagePreviews.map(p => p.file).filter(Boolean);
    if (filesToUpload.length === 0) {
      setPhotoUploadError('Please select at least one photo to upload.');
      return;
    }
    if (isBlocked) {
      setPhotoUploadError('Property access is blocked. Cannot upload photos.');
      return;
    }

    setIsUploadingPhotos(true);
    setPhotoUploadError(null);

    try {
      const token = localStorage.getItem('safarsetu_token') || localStorage.getItem('token');
      const formData = new FormData();
      filesToUpload.forEach(file => {
        formData.append('files', file, file.name);
      });

      const res = await fetch(`/api/v1/hotels/${activePropertyId}/images`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        let errorMsg = 'Image upload failed. Please check file format and size.';
        if (typeof data.detail === 'string') {
          errorMsg = data.detail;
        } else if (Array.isArray(data.detail)) {
          errorMsg = data.detail.map((e: any) => e.msg || e.message || JSON.stringify(e)).join(', ');
        } else if (data.detail && typeof data.detail === 'object') {
          errorMsg = data.detail.message || JSON.stringify(data.detail);
        } else if (data.message) {
          errorMsg = data.message;
        }
        throw new Error(errorMsg);
      }

      showToast(data.message || `Successfully uploaded ${filesToUpload.length} photo(s).`);
      handleCancelPreviews();
      await fetchHotelPhotos();
    } catch (err: any) {
      setPhotoUploadError(err.message || 'Failed to upload hotel photos.');
    } finally {
      setIsUploadingPhotos(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (isBlocked) {
      showToast('Property access is blocked.', 'info');
      return;
    }
    if (photoId.startsWith('default-')) {
      setHotelPhotos(prev => prev.filter(p => p.id !== photoId));
      showToast('Photo removed.');
      return;
    }

    setDeletingPhotoId(photoId);
    try {
      const token = localStorage.getItem('safarsetu_token') || localStorage.getItem('token');
      const res = await fetch(`/api/v1/hotels/${activePropertyId}/images/${photoId}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Failed to delete photo.');
      }

      setHotelPhotos(prev => prev.filter(p => p.id !== photoId));
      showToast('Photo deleted successfully.');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete photo.', 'info');
    } finally {
      setDeletingPhotoId(null);
    }
  };

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const openAddModal = () => {
    setEditingRoomId(null);
    setFormData({
      name: '',
      description: '',
      bedConfig: 'King Bed',
      roomSizeSqft: 350,
      inventoryCount: 5,
      maxOccupancy: 3,
      adultCapacity: 2,
      childCapacity: 1,
      basePrice: 2800,
      extraAdultPrice: 600,
      extraChildPrice: 300,
      amenities: ['Wi-Fi', 'Attached Bath', 'Farm Breakfast', 'Private Balcony'],
      status: 'ACTIVE',
      photoUrl: SAMPLE_ROOM_IMAGES[Math.floor(Math.random() * SAMPLE_ROOM_IMAGES.length)]
    });
    setIsModalOpen(true);
  };

  const openEditModal = (room: RoomTypeData) => {
    setEditingRoomId(room.id);
    setFormData({
      name: room.name,
      description: room.description || '',
      bedConfig: room.bedConfig,
      roomSizeSqft: room.roomSizeSqft,
      inventoryCount: room.inventoryCount,
      maxOccupancy: room.maxOccupancy,
      adultCapacity: room.adultCapacity,
      childCapacity: room.childCapacity,
      basePrice: room.basePrice,
      extraAdultPrice: room.extraAdultPrice || 500,
      extraChildPrice: room.extraChildPrice || 250,
      amenities: room.amenities || [],
      status: room.status,
      photoUrl: room.photos && room.photos[0] ? room.photos[0] : SAMPLE_ROOM_IMAGES[0]
    });
    setIsModalOpen(true);
  };

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a room type name.');
      return;
    }

    if (editingRoomId) {
      // Update existing room type
      const updatedRooms = roomTypes.map(r => {
        if (r.id === editingRoomId) {
          return {
            ...r,
            name: formData.name.trim(),
            description: formData.description.trim(),
            bedConfig: formData.bedConfig,
            roomSizeSqft: Number(formData.roomSizeSqft) || 300,
            inventoryCount: Number(formData.inventoryCount) || 1,
            maxOccupancy: Number(formData.maxOccupancy) || 2,
            adultCapacity: Number(formData.adultCapacity) || 2,
            childCapacity: Number(formData.childCapacity) || 0,
            basePrice: Number(formData.basePrice) || 2000,
            extraAdultPrice: Number(formData.extraAdultPrice) || 0,
            extraChildPrice: Number(formData.extraChildPrice) || 0,
            amenities: formData.amenities,
            status: formData.status,
            photos: [formData.photoUrl]
          };
        }
        return r;
      });

      setRoomTypes(updatedRooms);
      showToast(`Updated "${formData.name.trim()}" successfully!`);

      // Try server sync
      try {
        const token = localStorage.getItem('safarsetu_token') || localStorage.getItem('token');
        await fetch(`/api/v1/hotels/rooms/${editingRoomId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            description: formData.description.trim(),
            bedConfig: formData.bedConfig,
            roomSizeSqft: Number(formData.roomSizeSqft) || 300,
            inventoryCount: Number(formData.inventoryCount) || 1,
            maxOccupancy: Number(formData.maxOccupancy) || 2,
            adultCapacity: Number(formData.adultCapacity) || 2,
            childCapacity: Number(formData.childCapacity) || 0,
            basePrice: Number(formData.basePrice) || 2000,
            extraAdultPrice: Number(formData.extraAdultPrice) || 0,
            extraChildPrice: Number(formData.extraChildPrice) || 0,
            amenities: formData.amenities,
            status: formData.status
          })
        });
      } catch {
        // Handled locally
      }
    } else {
      // Add new room type
      const newRoom: RoomTypeData = {
        id: 'rt-' + Date.now(),
        hotelId: activePropertyId,
        name: formData.name.trim(),
        description: formData.description.trim(),
        bedConfig: formData.bedConfig,
        roomSizeSqft: Number(formData.roomSizeSqft) || 300,
        inventoryCount: Number(formData.inventoryCount) || 1,
        maxOccupancy: Number(formData.maxOccupancy) || 2,
        adultCapacity: Number(formData.adultCapacity) || 2,
        childCapacity: Number(formData.childCapacity) || 0,
        basePrice: Number(formData.basePrice) || 2000,
        extraAdultPrice: Number(formData.extraAdultPrice) || 0,
        extraChildPrice: Number(formData.extraChildPrice) || 0,
        amenities: formData.amenities,
        status: formData.status,
        photos: [formData.photoUrl],
        createdAt: new Date().toISOString()
      };

      setRoomTypes(prev => [newRoom, ...prev]);
      showToast(`Added new room type "${newRoom.name}"!`);

      // Try server sync
      try {
        const token = localStorage.getItem('safarsetu_token') || localStorage.getItem('token');
        const res = await fetch(`/api/v1/hotels/${activePropertyId}/rooms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            name: newRoom.name,
            description: newRoom.description,
            bedConfig: newRoom.bedConfig,
            roomSizeSqft: newRoom.roomSizeSqft,
            inventoryCount: newRoom.inventoryCount,
            maxOccupancy: newRoom.maxOccupancy,
            adultCapacity: newRoom.adultCapacity,
            childCapacity: newRoom.childCapacity,
            basePrice: newRoom.basePrice,
            extraAdultPrice: newRoom.extraAdultPrice,
            extraChildPrice: newRoom.extraChildPrice,
            amenities: newRoom.amenities,
            status: newRoom.status
          })
        });
        if (res.ok) {
          const created = await res.json();
          if (created && created.id) {
            setRoomTypes(prev => prev.map(r => r.id === newRoom.id ? { ...r, id: created.id } : r));
          }
        }
      } catch {
        // Handled locally
      }
    }

    setIsModalOpen(false);
  };

  const handleDeleteRoom = async (id: string, name: string) => {
    setRoomTypes(prev => prev.filter(r => r.id !== id));
    setDeleteConfirmId(null);
    showToast(`Removed room type "${name}".`, 'info');

    try {
      const token = localStorage.getItem('safarsetu_token') || localStorage.getItem('token');
      await fetch(`/api/v1/hotels/rooms/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
    } catch {
      // Handled locally
    }
  };

  const handleToggleStatus = async (room: RoomTypeData) => {
    const nextStatus = room.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const updated = roomTypes.map(r => (r.id === room.id ? { ...r, status: nextStatus as any } : r));
    setRoomTypes(updated);
    showToast(`Room type status changed to ${nextStatus === 'ACTIVE' ? 'Active' : 'Paused'}`);

    try {
      const token = localStorage.getItem('safarsetu_token') || localStorage.getItem('token');
      await fetch(`/api/v1/hotels/rooms/${room.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status: nextStatus })
      });
    } catch {
      // Handled locally
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter(a => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-left">
        <div className="bg-white rounded-3xl p-8 border border-red-200 shadow-xl space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">Access Restricted — Hotel Administration Only</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your account <strong>{user.name || 'User'}</strong> is registered as <span className="font-semibold uppercase text-orange-600">{user.role}</span>. You do not have permission to view or manage Hotel Properties.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
            <button
              onClick={() => onNavigate(user.role === 'tour_operator' || user.role === 'partner' ? 'partner' : 'landing')}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go to Your Authorized Workspace</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dynamic calculations
  const totalConfiguredRooms = roomTypes.reduce((sum, r) => sum + r.inventoryCount, 0);
  const activeRooms = roomTypes.filter(r => r.status === 'ACTIVE');
  const minBasePrice = activeRooms.length > 0 ? Math.min(...activeRooms.map(r => r.basePrice)) : displayProperty.details.baseTariffINR;

  const filteredRoomTypes = roomTypes.filter(room => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.bedConfig.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.amenities.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'ALL' || room.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateHold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBlocked) {
      showToast('Property access is blocked. Cannot create inventory hold.', 'info');
      return;
    }
    try {
      const token = localStorage.getItem('safarsetu_token') || localStorage.getItem('token');
      const targetRoomId = holdForm.roomTypeId || (roomTypes[0] ? roomTypes[0].id : '');
      if (!targetRoomId) return;

      await fetch(`/api/v1/hotels/room-types/${targetRoomId}/blocks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          quantity: Number(holdForm.quantity) || 1,
          startDate: holdForm.startDate,
          endDate: holdForm.endDate,
          reason: holdForm.reason,
          note: holdForm.note
        })
      }).catch(() => null);

      showToast(`Placed availability hold of ${holdForm.quantity} room(s) from ${holdForm.startDate} to ${holdForm.endDate}.`);
      setIsHoldModalOpen(false);
    } catch {
      showToast('Availability hold recorded locally.');
      setIsHoldModalOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left space-y-6 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-600/30 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>YatraSync 0% Commission Hotel Network</span>
            </span>

            {/* Approval Status Badge */}
            {isBlocked ? (
              <span className="text-[10px] font-black uppercase tracking-widest bg-rose-950 text-rose-300 border border-rose-500 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg shadow-rose-950/40">
                <Ban className="w-3.5 h-3.5 text-rose-400" />
                <span>Access Status: BLOCKED / SUSPENDED</span>
              </span>
            ) : isUnderReview ? (
              <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-400/40 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Approval Status: Under Review</span>
              </span>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Status: Approved & Publicly Listed</span>
              </span>
            )}
          </div>

          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white">
            {displayProperty.propertyName}
          </h1>
          <p className="text-xs text-slate-300 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-orange-500" />
            <span>{displayProperty.address.line}, {displayProperty.address.city}, {displayProperty.address.state}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          {/* Multi-Property Switcher */}
          {assignedProperties.length > 1 && (
            <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-700 text-xs shadow-md">
              <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-slate-400 font-semibold hidden sm:inline">Property:</span>
              <select
                value={activePropertyId}
                onChange={(e) => {
                  const selected = assignedProperties.find(p => p.id === e.target.value);
                  if (selected) {
                    setFetchedProperty(selected);
                    showToast(`Switched view to "${selected.propertyName}".`);
                  }
                }}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer pr-2"
              >
                {assignedProperties.map(p => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                    {p.propertyName} ({p.approvalStatus})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => onNavigate('landing')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition border border-white/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-slate-300" />
            <span>Preview Public Listing</span>
          </button>
        </div>
      </div>

      {/* Property Access Blocked Alert Banner */}
      {isBlocked && (
        <div className="p-5 rounded-2xl bg-rose-950/90 border-2 border-rose-600 text-rose-100 flex items-center justify-between gap-4 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-800 text-white flex items-center justify-center shrink-0 shadow-md">
              <Ban className="w-5 h-5 text-rose-200" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>PROPERTY ACCESS BLOCKED BY PLATFORM ADMINISTRATOR</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-rose-900 border border-rose-400 font-black text-rose-200 uppercase">
                  {displayProperty.approvalStatus}
                </span>
              </h3>
              <p className="text-xs text-rose-200/90 mt-0.5">
                Modifications to room categories, inventory holds, and pricing have been disabled by the platform administrator. Contact platform governance to request review and unblock.
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-rose-300 shrink-0 bg-rose-900/60 px-3 py-1.5 rounded-lg border border-rose-700">
            <Lock className="w-3.5 h-3.5" />
            <span>Read-Only Mode</span>
          </div>
        </div>
      )}

      {/* Approval Status Alert Banner */}
      {!isBlocked && isUnderReview && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-sm text-amber-950 block">Property Review in Progress</span>
            <p className="text-amber-800 leading-relaxed">
              Your property details and DigiLocker GSTIN/PAN credentials have been submitted and are currently being reviewed by YatraSync quality officers. Approval usually completes within 2–4 hours. During review, you can configure room inventory and tariff rules.
            </p>
          </div>
        </div>
      )}

      {/* Key Property Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Rooms</span>
          <div className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bed className="w-5 h-5 text-blue-600" />
            <span>{totalConfiguredRooms || displayProperty.details.roomCount} Rooms</span>
          </div>
          <span className="text-[11px] text-slate-500 block">{roomTypes.length} Room Types Active</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Base Tariff</span>
          <div className="text-2xl font-bold text-slate-900 flex items-center gap-1">
            <DollarSign className="w-5 h-5 text-orange-600" />
            <span>₹{minBasePrice.toLocaleString()}</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block">0% Surcharge to Guest</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Bookings</span>
          <div className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span>{displayProperty.totalBookings || 42}</span>
          </div>
          <span className="text-[11px] text-slate-500 block">YatraSync PNR Guests</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">DigiLocker Sync</span>
          <div className="text-xl font-bold text-emerald-700 flex items-center gap-1.5 pt-1">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Verified</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Govt. Verified Property</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-4 text-xs font-bold">
        <button
          onClick={() => handleTabChange('overview')}
          className={`pb-3 border-b-2 transition cursor-pointer ${
            currentTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Property Profile
        </button>

        <button
          onClick={() => handleTabChange('rooms')}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
            currentTab === 'rooms' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Room Inventory & Tariffs</span>
          <span className="px-2 py-0.5 text-[10px] rounded-full bg-blue-100 text-blue-800 font-bold">
            {roomTypes.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('bookings')}
          className={`pb-3 border-b-2 transition cursor-pointer ${
            currentTab === 'bookings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Guest Bookings ({displayProperty.totalBookings || 42})
        </button>

        <button
          onClick={() => handleTabChange('verification')}
          className={`pb-3 border-b-2 transition cursor-pointer ${
            currentTab === 'verification' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Verification & GSTIN
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {currentTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-lg text-slate-900">Property Information</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {displayProperty.details.description}
            </p>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-800 block">Amenities Included</span>
              <div className="flex flex-wrap gap-2 text-xs">
                {displayProperty.details.amenities.map((item, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Property Photos & Media</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                      {hotelPhotos.length} {hotelPhotos.length === 1 ? 'photo' : 'photos'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Upload multiple high-resolution photos of your property. Supported formats: JPG, PNG, WEBP (Max 10MB each).
                  </p>
                </div>

                <div>
                  <input
                    id="hotel-photos-multi-input"
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleFileSelection}
                    className="hidden"
                    disabled={isBlocked || isUploadingPhotos}
                  />
                  <label
                    htmlFor="hotel-photos-multi-input"
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition ${
                      isBlocked || isUploadingPhotos
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 active:scale-98 text-white'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Add Hotel Photos</span>
                  </label>
                </div>
              </div>

              {/* Upload Error Banner */}
              {photoUploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{photoUploadError}</div>
                  <button
                    onClick={() => setPhotoUploadError(null)}
                    className="text-red-400 hover:text-red-600 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Pending Upload Previews Drawer */}
              {imagePreviews.length > 0 && (
                <div className="p-4 bg-slate-50 border border-blue-200 rounded-2xl space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold text-slate-800">
                        {imagePreviews.length} Photo{imagePreviews.length > 1 ? 's' : ''} Ready to Upload
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCancelPreviews}
                        disabled={isUploadingPhotos}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleUploadPhotos}
                        disabled={isUploadingPhotos}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer transition disabled:opacity-50"
                      >
                        {isUploadingPhotos ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Confirm & Upload ({imagePreviews.length})</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
                    {imagePreviews.map((prev) => (
                      <div key={prev.id} className="group relative rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs">
                        <div className="aspect-4/3 w-full bg-slate-100 overflow-hidden">
                          <img src={prev.url} alt={prev.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-1.5 bg-white border-t border-slate-100">
                          <p className="text-[10px] font-medium text-slate-700 truncate" title={prev.name}>
                            {prev.name}
                          </p>
                          <p className="text-[9px] text-slate-400">{prev.size}</p>
                        </div>
                        {!isUploadingPhotos && (
                          <button
                            type="button"
                            onClick={() => handleRemovePreview(prev.id)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/70 hover:bg-red-600 text-white transition cursor-pointer"
                            title="Remove from upload queue"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Photo Gallery Grid */}
              {hotelPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
                  {hotelPhotos.map((photo, idx) => (
                    <div
                      key={photo.id || idx}
                      className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs hover:shadow-md transition-all duration-200"
                    >
                      <div className="aspect-4/3 w-full overflow-hidden bg-slate-200">
                        <img
                          src={photo.imageUrl}
                          alt={`${displayProperty.propertyName} photo ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>

                      {/* Top Badges & Actions */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between pointer-events-none">
                        <div className="flex items-center justify-between pointer-events-auto">
                          {idx === 0 ? (
                            <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[9px] font-bold shadow-xs">
                              Cover Photo
                            </span>
                          ) : (
                            <span className="text-[9px] text-white/80 font-medium px-1.5 py-0.5 rounded bg-black/40">
                              #{idx + 1}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeletePhoto(photo.id)}
                            disabled={deletingPhotoId === photo.id || isBlocked}
                            className="p-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white transition active:scale-95 shadow-xs cursor-pointer disabled:opacity-50"
                            title="Delete Photo"
                          >
                            {deletingPhotoId === photo.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        <div className="text-[10px] text-white font-medium truncate drop-shadow-xs">
                          {photo.id.startsWith('default-') ? 'Preset Gallery Image' : 'Uploaded Property Photo'}
                        </div>
                      </div>

                      {/* Permanent Cover Badge when not hovering */}
                      {idx === 0 && (
                        <div className="group-hover:hidden absolute top-2 left-2 px-2 py-0.5 rounded-md bg-blue-600/90 text-white text-[9px] font-bold shadow-xs">
                          Cover
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2 bg-slate-50/50">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">No Property Photos Uploaded Yet</h4>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Enhance your listing and attract more guests by adding clear photos of rooms, surroundings, and amenities.
                  </p>
                  <div className="pt-2">
                    <label
                      htmlFor="hotel-photos-multi-input"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer transition"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Select Photos</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-lg text-slate-900">Host / Owner Details</h2>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-slate-400" />
                <span>Owner: <strong>{displayProperty.ownerName}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>Contact: <strong>{displayProperty.contactPhone}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>Email: <strong>{displayProperty.contactEmail}</strong></span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-800 block">Security & Credentials</span>
              <p className="text-[11px] text-slate-500">
                You can change your initial administrator-assigned password anytime.
              </p>
              <button
                id="dashboard-change-pwd-btn"
                onClick={() => setIsChangePasswordModalOpen(true)}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-orange-600" />
                <span>Change Password</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROOM INVENTORY & TARIFFS */}
      {currentTab === 'rooms' && (
        <div className="space-y-6">
          {/* Action Header */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif font-bold text-lg text-slate-900">Room Inventory & Tariffs</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure room categories, occupancy limits, amenities, and nightly tariffs with zero commission deduction.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (isBlocked) {
                    showToast('Property access is currently blocked by administrator. Action restricted.', 'info');
                    return;
                  }
                  setIsHoldModalOpen(true);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition cursor-pointer ${
                  isBlocked
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900 shadow-xs'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Hold / Block Availability</span>
              </button>

              <button
                onClick={() => {
                  if (isBlocked) {
                    showToast('Property access is currently blocked by administrator. Action restricted.', 'info');
                    return;
                  }
                  openAddModal();
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm ${
                  isBlocked
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md cursor-pointer active:scale-95'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Add Room Type</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search room by name, bedding, or amenity..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs">
              {(['ALL', 'ACTIVE', 'INACTIVE', 'SOLD_OUT'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                    filterStatus === status
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {status === 'ALL'
                    ? `All (${roomTypes.length})`
                    : status === 'ACTIVE'
                    ? `Active (${roomTypes.filter(r => r.status === 'ACTIVE').length})`
                    : status === 'INACTIVE'
                    ? `Paused (${roomTypes.filter(r => r.status === 'INACTIVE').length})`
                    : `Sold Out (${roomTypes.filter(r => r.status === 'SOLD_OUT').length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Room Type Cards Grid */}
          {filteredRoomTypes.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Bed className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="font-bold text-slate-900 text-base">No Room Types Found</h3>
                <p className="text-xs text-slate-500">
                  {searchTerm
                    ? `No room types match "${searchTerm}". Try a different keyword or clear filters.`
                    : 'Get started by creating your first room type to accept guest bookings on YatraSync.'}
                </p>
              </div>
              <button
                onClick={openAddModal}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First Room Type</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredRoomTypes.map(room => (
                <div
                  key={room.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Header & Badges */}
                    <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={room.photos && room.photos[0] ? room.photos[0] : SAMPLE_ROOM_IMAGES[0]}
                        alt={room.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                      {/* Status Tag */}
                      <div className="absolute top-3 left-3">
                        {room.status === 'ACTIVE' ? (
                          <span className="px-2.5 py-1 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            Active & Available
                          </span>
                        ) : room.status === 'SOLD_OUT' ? (
                          <span className="px-2.5 py-1 bg-red-500/90 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                            Sold Out
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-slate-700/90 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                            Paused
                          </span>
                        )}
                      </div>

                      {/* Units badge */}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-900 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-blue-600" />
                        <span>{room.inventoryCount} Units</span>
                      </div>

                      {/* Price Tag Overlay */}
                      <div className="absolute bottom-3 left-3 text-white">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold font-serif">₹{room.basePrice.toLocaleString()}</span>
                          <span className="text-xs text-white/80">/ night</span>
                        </div>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-serif font-bold text-base text-slate-900 leading-snug">
                          {room.name}
                        </h3>
                        {room.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {room.description}
                          </p>
                        )}
                      </div>

                      {/* Room Key Specs */}
                      <div className="flex flex-wrap gap-2 text-xs pt-1">
                        <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-lg flex items-center gap-1.5">
                          <Bed className="w-3.5 h-3.5 text-blue-600" />
                          <span>{room.bedConfig}</span>
                        </span>

                        <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-lg flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-orange-600" />
                          <span>Max {room.maxOccupancy} Guests ({room.adultCapacity}A + {room.childCapacity}C)</span>
                        </span>

                        <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-lg">
                          {room.roomSizeSqft} sq.ft
                        </span>
                      </div>

                      {/* Extra Charges Details */}
                      {(room.extraAdultPrice || room.extraChildPrice) ? (
                        <div className="text-[11px] text-slate-500 bg-slate-50/70 p-2 rounded-xl border border-slate-100 flex items-center justify-between">
                          <span>Extra Adult: <strong>₹{room.extraAdultPrice || 0}/night</strong></span>
                          <span>Extra Child: <strong>₹{room.extraChildPrice || 0}/night</strong></span>
                        </div>
                      ) : null}

                      {/* Amenities Pills */}
                      {room.amenities && room.amenities.length > 0 && (
                        <div className="pt-1">
                          <div className="flex flex-wrap gap-1.5">
                            {room.amenities.slice(0, 5).map((amenity, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-blue-50/80 text-blue-700 text-[10px] font-semibold border border-blue-100"
                              >
                                {amenity}
                              </span>
                            ))}
                            {room.amenities.length > 5 && (
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                                +{room.amenities.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleStatus(room)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                        room.status === 'ACTIVE'
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      }`}
                    >
                      {room.status === 'ACTIVE' ? 'Pause Room' : 'Activate Room'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(room)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Edit Room Type"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {deleteConfirmId === room.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDeleteRoom(room.id, room.name)}
                            className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[11px] font-bold transition cursor-pointer"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 text-xs"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(room.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                          title="Delete Room Type"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BOOKINGS */}
      {currentTab === 'bookings' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-lg text-slate-900">Guest Bookings</h2>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">PNR: 4582-KER-9012 — Priya Sharma</span>
              <span className="text-slate-500">Oct 14 – Oct 18, 2026 • 2 Guests • 4 Nights • Heritage Plantation Deluxe Room</span>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-bold rounded-full text-[10px]">
              CONFIRMED
            </span>
          </div>
        </div>
      )}

      {/* TAB 4: VERIFICATION */}
      {currentTab === 'verification' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-lg text-slate-900">Government Verification & GSTIN</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-slate-500 block">Owner PAN Number</span>
              <span className="font-mono font-bold text-slate-900 text-sm uppercase">{displayProperty.verification.panNumber}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-slate-500 block">Property GSTIN</span>
              <span className="font-mono font-bold text-slate-900 text-sm uppercase">{displayProperty.verification.gstin || 'NOT_REQUIRED'}</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ADD / EDIT ROOM TYPE MODAL */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Bed className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    {editingRoomId ? 'Edit Room Type' : 'Add New Room Type'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingRoomId ? 'Update room inventory, pricing, and amenities' : 'Define category specifications and nightly tariff'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveRoom} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-800">
              
              {/* Basic Information */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">1. Room Identification</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="font-semibold block mb-1 text-slate-700">Room Category Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Heritage Plantation Deluxe Suite"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-slate-700">Bed Configuration</label>
                    <select
                      value={formData.bedConfig}
                      onChange={e => setFormData({ ...formData, bedConfig: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                    >
                      <option value="King Bed">King Bed (Double)</option>
                      <option value="Queen Bed">Queen Bed</option>
                      <option value="Twin Beds">Twin Beds (2 Single)</option>
                      <option value="King Bed + Daybed">King Bed + Daybed (Family)</option>
                      <option value="2 Queen Beds">2 Queen Beds (Suite)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-slate-700">Room Size (sq.ft)</label>
                    <input
                      type="number"
                      min="100"
                      max="3000"
                      value={formData.roomSizeSqft}
                      onChange={e => setFormData({ ...formData, roomSizeSqft: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Inventory & Capacity */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">2. Capacity & Inventory Units</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-slate-700">Total Rooms</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.inventoryCount}
                      onChange={e => setFormData({ ...formData, inventoryCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-slate-700">Max Guests</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.maxOccupancy}
                      onChange={e => setFormData({ ...formData, maxOccupancy: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-slate-700">Adult Capacity</label>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={formData.adultCapacity}
                      onChange={e => setFormData({ ...formData, adultCapacity: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-slate-700">Child Capacity</label>
                    <input
                      type="number"
                      min="0"
                      max="6"
                      value={formData.childCapacity}
                      onChange={e => setFormData({ ...formData, childCapacity: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Tariffs */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">3. Tariffs & Pricing (INR)</h4>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    0% Commission Deducted
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-slate-700">Base Tariff / Night (₹) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        required
                        min="500"
                        step="50"
                        value={formData.basePrice}
                        onChange={e => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                        className="w-full pl-7 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-slate-700">Extra Adult Charge (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={formData.extraAdultPrice}
                        onChange={e => setFormData({ ...formData, extraAdultPrice: Number(e.target.value) })}
                        className="w-full pl-7 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-slate-700">Extra Child Charge (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={formData.extraChildPrice}
                        onChange={e => setFormData({ ...formData, extraChildPrice: Number(e.target.value) })}
                        className="w-full pl-7 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities Selector */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="font-semibold block text-slate-700">Room Amenities Included</label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
                  {AVAILABLE_AMENITIES.map(amenity => {
                    const isSelected = formData.amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-3 py-1.5 rounded-xl font-medium transition flex items-center gap-1.5 cursor-pointer text-xs ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{amenity}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Room Description & Highlights */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="font-semibold block text-slate-700">Room Description & Highlights</label>
                <textarea
                  rows={3}
                  placeholder="Describe balcony views, bed details, complimentary treats, bathroom setup..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                />
              </div>

              {/* Photo Image Selector */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="font-semibold block text-slate-700">Room Photo Preview</label>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src={formData.photoUrl}
                      alt="Room Preview"
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.target as any).src = SAMPLE_ROOM_IMAGES[0];
                      }}
                    />
                  </div>
                  <input
                    type="url"
                    placeholder="Image URL (Unsplash or direct image URL)"
                    value={formData.photoUrl}
                    onChange={e => setFormData({ ...formData, photoUrl: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                  />
                </div>
                {/* Sample Photo Presets */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-slate-400">Quick Presets:</span>
                  {SAMPLE_ROOM_IMAGES.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, photoUrl: imgUrl })}
                      className="w-7 h-7 rounded-lg overflow-hidden border border-slate-200 hover:ring-2 hover:ring-blue-500 transition cursor-pointer"
                    >
                      <img src={imgUrl} alt={`Sample ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Selector */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="font-semibold block text-slate-700">Availability Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 'ACTIVE', label: 'Active & Available', color: 'emerald' },
                    { val: 'INACTIVE', label: 'Paused / Draft', color: 'slate' },
                    { val: 'SOLD_OUT', label: 'Sold Out', color: 'red' }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: opt.val as any })}
                      className={`py-2 px-3 rounded-xl font-bold border transition text-center cursor-pointer ${
                        formData.status === opt.val
                          ? opt.val === 'ACTIVE'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500'
                            : opt.val === 'SOLD_OUT'
                            ? 'bg-red-50 border-red-500 text-red-800 ring-1 ring-red-500'
                            : 'bg-slate-100 border-slate-500 text-slate-800 ring-1 ring-slate-500'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer active:scale-95"
                >
                  {editingRoomId ? 'Save Changes' : 'Create Room Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: AVAILABILITY HOLD / INVENTORY BLOCK MODAL             */}
      {/* ============================================================ */}
      {isHoldModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-base text-slate-900">Hold / Block Room Inventory</h2>
                  <p className="text-xs text-slate-500">Temporarily withhold rooms for maintenance or private reservations</p>
                </div>
              </div>
              <button
                onClick={() => setIsHoldModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHold} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-slate-700">Select Room Category *</label>
                <select
                  value={holdForm.roomTypeId}
                  onChange={(e) => setHoldForm({ ...holdForm, roomTypeId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {roomTypes.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} (Total: {r.inventoryCount} units)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-slate-700">Rooms to Block *</label>
                  <input
                    type="number"
                    min="1"
                    max={roomTypes.find(r => r.id === holdForm.roomTypeId)?.inventoryCount || 10}
                    value={holdForm.quantity}
                    onChange={(e) => setHoldForm({ ...holdForm, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-slate-700">Hold Reason *</label>
                  <select
                    value={holdForm.reason}
                    onChange={(e) => setHoldForm({ ...holdForm, reason: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="MAINTENANCE">Maintenance / Repairs</option>
                    <option value="RENOVATION">Room Upgrades / Renovation</option>
                    <option value="PRIVATE_HOLD">Direct / Walk-in Hold</option>
                    <option value="SEASONAL_CLOSURE">Monsoon / Off-Season Hold</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-slate-700">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={holdForm.startDate}
                    onChange={(e) => setHoldForm({ ...holdForm, startDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-slate-700">End Date *</label>
                  <input
                    type="date"
                    required
                    value={holdForm.endDate}
                    onChange={(e) => setHoldForm({ ...holdForm, endDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700">Optional Operational Note</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Annual teak polish and AC servicing."
                  value={holdForm.note}
                  onChange={(e) => setHoldForm({ ...holdForm, note: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsHoldModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Apply Availability Hold</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <ChangePasswordModal
          isOpen={isChangePasswordModalOpen}
          onClose={() => setIsChangePasswordModalOpen(false)}
          user={user}
        />
      )}

    </div>
  );
};
