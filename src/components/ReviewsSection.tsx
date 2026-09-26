// Changes made by @MdFarhanAhmad
import React, { useState } from 'react';
import { Star, ShieldCheck, Quote, Plus, X, ThumbsUp, CheckCircle2, MessageSquare, Send } from 'lucide-react';

export interface TravelerFeedbackPost {
  id: string;
  name: string;
  location: string;
  trip: string;
  rating: number;
  date: string;
  review: string;
  avatar: string;
  category: 'Heritage & Culture' | 'Homestays & Hosts' | 'Storyteller Drivers' | 'Solo & Women Safety';
  helpfulCount: number;
  verified: boolean;
}

export const INITIAL_FEEDBACK_POSTS: TravelerFeedbackPost[] = [
  {
    id: 'rev-1',
    name: 'Aditya & Ananya Sharma',
    location: 'Bengaluru, Karnataka',
    trip: 'Kerala 5-Day Backwaters Circuit',
    rating: 4.9,
    date: 'Aug 2026',
    review: 'YatraSync made our anniversary trip effortless. The Vande Bharat train connection, Kumarakom heritage homestay, and driver Suresh were synchronized seamlessly. Scanning QR passes at turnstiles saved us over an hour in queues!',
    avatar: 'AS',
    category: 'Storyteller Drivers',
    helpfulCount: 42,
    verified: true
  },
  {
    id: 'rev-2',
    name: 'Rajesh & Sunita Varma',
    location: 'Hyderabad, Telangana',
    trip: 'Golden Triangle Express Circuit',
    rating: 4.8,
    date: 'Jul 2026',
    review: 'The trip savings calculator was 100% accurate! We saved ₹8,300 compared to buying standalone monument tickets. Plus, driver Jagdish gave us amazing insight into Jaipur’s hidden stepwells.',
    avatar: 'RV',
    category: 'Heritage & Culture',
    helpfulCount: 38,
    verified: true
  },
  {
    id: 'rev-3',
    name: 'Dr. Meera Nambiar',
    location: 'Kochi, Kerala',
    trip: 'Telangana Kakatiya & Nizam Heritage',
    rating: 4.9,
    date: 'Sep 2026',
    review: 'As a solo woman traveler, safety and isolation of verified local partners was crucial. The SOS beacon and verified homestays gave me complete peace of mind. Highly recommended!',
    avatar: 'MN',
    category: 'Solo & Women Safety',
    helpfulCount: 56,
    verified: true
  },
  {
    id: 'rev-4',
    name: 'Rohan & Priya Sen',
    location: 'Kolkata, West Bengal',
    trip: 'Meghalaya Living Root Bridges & Dawki Circuit',
    rating: 4.7,
    date: 'Aug 2026',
    review: 'Exploring Dawki river and Cherrapunji with local storyteller driver Bah Wanbok was the highlight of our year! The digital pass covered entry to all root bridges without queuing at local counters.',
    avatar: 'RS',
    category: 'Storyteller Drivers',
    helpfulCount: 29,
    verified: true
  },
  {
    id: 'rev-5',
    name: 'Vikramaditya & Gayatri Rao',
    location: 'Mumbai, Maharashtra',
    trip: 'Ladakh High-Altitude Himalayan Circuit',
    rating: 4.9,
    date: 'Jun 2026',
    review: 'Traveling through Khardung La pass at 17,580 ft was intimidating, but our verified partner driver Stanzin had oxygen cylinders and live telemetry active. Instant SOS fallback gave our family absolute reassurance.',
    avatar: 'VR',
    category: 'Solo & Women Safety',
    helpfulCount: 47,
    verified: true
  },
  {
    id: 'rev-6',
    name: 'Kavita & Arvind Deshmukh',
    location: 'Pune, Maharashtra',
    trip: 'Goa Coastal & Spice Plantation Heritage',
    rating: 4.6,
    date: 'Aug 2026',
    review: 'We booked a 0%-commission heritage Portuguese homestay in Fontainhas through YatraSync. Meeting host Dona Maria and tasting authentic Goan fish curry made it feel like home!',
    avatar: 'KD',
    category: 'Homestays & Hosts',
    helpfulCount: 31,
    verified: true
  },
  {
    id: 'rev-7',
    name: 'Siddharth & Sneha Bannerjee',
    location: 'Delhi NCR',
    trip: 'Himachal Snow & Valley Explorer',
    rating: 4.2,
    date: 'May 2026',
    review: 'Vande Bharat to Una followed by our storyteller driver Devender ji up to Solang Valley was so seamless. The QR code passes for Rohtang permit saved us hours of red tape.',
    avatar: 'SB',
    category: 'Storyteller Drivers',
    helpfulCount: 22,
    verified: true
  },
  {
    id: 'rev-8',
    name: 'T. S. Ramanathan & Family',
    location: 'Chennai, Tamil Nadu',
    trip: 'Varanasi & Sarnath Temple Trail',
    rating: 3.9,
    date: 'Apr 2026',
    review: 'The morning Ganga boat ride in Varanasi organized by our storyteller partner was deeply moving. Instant mobile pass delivery worked offline even near the crowded ghats!',
    avatar: 'TR',
    category: 'Heritage & Culture',
    helpfulCount: 19,
    verified: true
  }
];

export const ReviewsSection: React.FC = () => {
  const [feedbackPosts, setFeedbackPosts] = useState<TravelerFeedbackPost[]>(INITIAL_FEEDBACK_POSTS);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [helpfulLikes, setHelpfulLikes] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmittedNotice, setFormSubmittedNotice] = useState(false);

  // New feedback post form state
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newTripCircuit, setNewTripCircuit] = useState('');
  const [newCategory, setNewCategory] = useState<TravelerFeedbackPost['category']>('Heritage & Culture');
  const [newRating, setNewRating] = useState<number>(4.8);
  const [newReviewText, setNewReviewText] = useState('');

  const filteredPosts = activeCategoryFilter === 'All'
    ? feedbackPosts
    : feedbackPosts.filter(p => p.category === activeCategoryFilter);

  const toggleHelpful = (id: string) => {
    setHelpfulLikes(prev => {
      const isLiked = prev[id];
      setFeedbackPosts(posts => posts.map(p => {
        if (p.id === id) {
          return { ...p, helpfulCount: isLiked ? p.helpfulCount - 1 : p.helpfulCount + 1 };
        }
        return p;
      }));
      return { ...prev, [id]: !isLiked };
    });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthorName.trim() || !newReviewText.trim()) return;

    const initials = newAuthorName
      .trim()
      .split(/\s+/)
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'TR';

    const newPost: TravelerFeedbackPost = {
      id: 'rev-' + Date.now(),
      name: newAuthorName.trim(),
      location: newLocation.trim() || 'India',
      trip: newTripCircuit.trim() || 'Verified YatraSync Multimodal Circuit',
      rating: newRating,
      date: 'Just Now',
      review: newReviewText.trim(),
      avatar: initials,
      category: newCategory,
      helpfulCount: 1,
      verified: true
    };

    setFeedbackPosts([newPost, ...feedbackPosts]);
    setNewAuthorName('');
    setNewLocation('');
    setNewTripCircuit('');
    setNewReviewText('');
    setIsModalOpen(false);
    setFormSubmittedNotice(true);
    setTimeout(() => setFormSubmittedNotice(false), 4000);
  };

  return (
    <section id="reviews-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-700">
              Verified Traveler Stories & Feedback
            </span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-slate-950">
            Loved by 50,000+ Indian Travelers
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            Real feedback posts from travelers who explored India using YatraSync multimodal passes, zero-commission homestays, and verified storyteller drivers.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-orange-400" />
          <span>Post Your Experience</span>
        </button>
      </div>

      {/* Submission Success Toast */}
      {formSubmittedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div className="text-xs sm:text-sm font-semibold">
            Thank you for posting your feedback! Your review has been added to YatraSync verified traveler feed.
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {['All', 'Heritage & Culture', 'Homestays & Hosts', 'Storyteller Drivers', 'Solo & Women Safety'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategoryFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeCategoryFilter === cat
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat === 'All' ? 'All Feedback Posts' : cat}
          </button>
        ))}
      </div>

      {/* Feedback Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((rev) => (
          <div
            key={rev.id}
            className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle-card hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    {[...Array(Math.floor(rev.rating))].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <span className="text-xs font-black text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-300/80">
                    {rev.rating.toFixed(1)} ★
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Pass
                </span>
              </div>

              <div className="flex items-center justify-between">
                <Quote className="w-6 h-6 text-orange-200" />
                <span className="text-[10px] font-semibold text-slate-400">{rev.date}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                "{rev.review}"
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs flex-shrink-0">
                  {rev.avatar}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-950 truncate">{rev.name}</h4>
                  <p className="text-[10px] text-slate-500 truncate">{rev.location} • {rev.trip}</p>
                </div>
              </div>

              <button
                onClick={() => toggleHelpful(rev.id)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer flex-shrink-0 ${
                  helpfulLikes[rev.id]
                    ? 'bg-orange-100 text-orange-800 border border-orange-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
                title="Mark as helpful feedback"
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${helpfulLikes[rev.id] ? 'fill-orange-600 text-orange-600' : ''}`} />
                <span>{rev.helpfulCount}</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Post Feedback Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 relative text-left animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-950">Share Your Traveler Feedback</h3>
                  <p className="text-[11px] text-slate-500">Help fellow Indian travelers with your journey story</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreatePost} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={newAuthorName}
                  onChange={(e) => setNewAuthorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Home Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Jaipur, Rajasthan"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Trip / Circuit Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Kerala Backwaters & Munnar"
                    value={newTripCircuit}
                    onChange={(e) => setNewTripCircuit(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="Heritage & Culture">Heritage & Culture</option>
                    <option value="Homestays & Hosts">Homestays & Hosts</option>
                    <option value="Storyteller Drivers">Storyteller Drivers</option>
                    <option value="Solo & Women Safety">Solo & Women Safety</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rating Score (3.9 to 5.0)</label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(parseFloat(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value={5.0}>5.0 ★ — Perfect Experience</option>
                    <option value={4.9}>4.9 ★ — Exceptional</option>
                    <option value={4.8}>4.8 ★ — Outstanding</option>
                    <option value={4.7}>4.7 ★ — Excellent</option>
                    <option value={4.5}>4.5 ★ — Very Good</option>
                    <option value={4.2}>4.2 ★ — Good</option>
                    <option value={3.9}>3.9 ★ — Decent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Feedback & Story *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details about your trip, QR pass scanning, storyteller driver, or homestay host experience..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Feedback Post</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </section>
  );
};
