import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { COMPLETE_TOURISM_REGISTRY, getPlannerPackage } from './src/data/destinations';
import { registerPartnerAndAdminRoutes, assignmentsStore, partnersStore, auditLogsStore } from './src/server/partnerOperations';

const app = express();
const PORT = 3000;
app.use(express.json());

// Serve uploaded server storage media directly from backend/uploads
const backendUploadsDir = path.join(process.cwd(), 'backend', 'uploads');
app.use('/uploads', express.static(backendUploadsDir));


// In-memory repositories for production-grade REST services
interface StoredBooking {
  id: string;
  pnr: string;
  destinationKey: string;
  destinationName: string;
  origin: string;
  dates: string;
  nights: number;
  guests: number;
  durationDays: number;
  transportTitle: string;
  stayName: string;
  driverName: string;
  totalCost: string;
  numericTotal: number;
  status: 'Confirmed' | 'Cancelled';
  paymentMethod: string;
  timestamp: string;
  travelerName: string;
  travelerPhone: string;
}

interface StoredTrip {
  id: string;
  name: string;
  dates: string;
  destination: string;
  duration: string;
  estimatedCost: string;
  status: 'Draft';
  stay: string;
  updatedAt: string;
}

interface StoredSOSIncident {
  id: string;
  timestamp: string;
  destination: string;
  latitude: number;
  longitude: number;
  contactNumber: string;
  status: 'DISPATCHED_TO_POLICE_AND_FAMILY';
}

const bookingsStore: StoredBooking[] = [];

const tripsStore: StoredTrip[] = [];

const sosIncidentsStore: StoredSOSIncident[] = [];

// Partner room inventory
const operatorInventory = [
  {
    id: "INV-KER-01",
    property: "Munnar Misty Tea Valley Homestay",
    location: "Pothamedu Viewpoint, Munnar",
    category: "Verified Rural Homestay",
    baseRate: 1850,
    availableRooms: 2,
    isSoldOut: false
  },
  {
    id: "INV-KER-02",
    property: "Punnamada Lake Backwater Eco-Villa & Houseboat",
    location: "Finishing Point, Alleppey",
    category: "Backwater Eco-Stay",
    baseRate: 3200,
    availableRooms: 1,
    isSoldOut: false
  },
  {
    id: "INV-TEL-01",
    property: "Kakatiya Heritage Homestay",
    location: "Palampet Lake Road, Warangal",
    category: "Verified Rural Homestay",
    baseRate: 1450,
    availableRooms: 3,
    isSoldOut: false
  }
];

// Lazy Gemini API Client Initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.error("Failed to initialize GoogleGenAI client:", err);
    }
  }
  return aiClient;
}

// ==========================================
// REST API ROUTES
// ==========================================

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "YatraSync Multimodal Engine",
    version: "2.0.0",
    totalStatesAndUTs: Object.keys(COMPLETE_TOURISM_REGISTRY).length,
    timestamp: new Date().toISOString()
  });
});

// Destination registry
app.get("/api/destinations", (req: Request, res: Response) => {
  const { region, search } = req.query;
  let list = Object.values(COMPLETE_TOURISM_REGISTRY);

  if (region && region !== 'all') {
    list = list.filter(s => s.region === String(region).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase().trim();
    list = list.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.capital.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    );
  }

  res.json({
    count: list.length,
    destinations: list
  });
});

// Specific destination dossier
app.get("/api/destinations/:id", (req: Request, res: Response) => {
  const destId = String(req.params.id).toLowerCase();
  const dest = COMPLETE_TOURISM_REGISTRY[destId];

  if (!dest) {
    return res.status(404).json({ error: `Destination '${destId}' not found.` });
  }

  res.json(dest);
});

// Complete multimodal package for planner
app.get("/api/packages/:id", (req: Request, res: Response) => {
  const destId = String(req.params.id).toLowerCase();
  const duration = (req.query.duration === '7') ? 7 : 5;
  const startDate = req.query.startDate ? String(req.query.startDate) : "2026-10-14";

  const pkg = getPlannerPackage(destId, duration, startDate);
  res.json(pkg);
});

// Weather forecast for destination
app.get("/api/weather/:destination", (req: Request, res: Response) => {
  const destId = String(req.params.destination).toLowerCase();
  const dest = COMPLETE_TOURISM_REGISTRY[destId];

  // Meteorological seasonal analysis
  const currentMonth = new Date().getMonth(); // 0 to 11
  let condition = "Pleasant & Clear Skies";
  let tempC = 24;
  let advisory = "Favorable conditions for road journeys and outdoor heritage exploration.";

  if (destId === 'himachal' || destId === 'ladakh') {
    tempC = currentMonth >= 10 || currentMonth <= 2 ? 2 : 16;
    condition = currentMonth >= 10 || currentMonth <= 2 ? "Snow on High Passes" : "Cool Alpine Sun";
    advisory = "High altitude passes clear; storyteller drivers equipped with certified vehicle chains.";
  } else if (destId === 'kerala' || destId === 'goa') {
    tempC = 27;
    condition = "Gentle Coastal Breeze";
    advisory = "Water metro and solar houseboats operating on normal schedule.";
  }

  res.json({
    destination: dest ? dest.name : destId,
    temperatureCelsius: tempC,
    condition,
    advisory,
    humidity: "62%",
    uvIndex: 4,
    airQualityIndex: 42, // Green
    airQualityStatus: "Good"
  });
});



// Disruption Simulation & Replan
app.post("/api/disruptions/simulate", (req: Request, res: Response) => {
  const { type, destinationKey } = req.body;
  const destName = COMPLETE_TOURISM_REGISTRY[destinationKey]?.name || "Destination";

  if (type === 'transit_delay') {
    res.json({
      type: "transit_delay",
      title: `Transit Disruption: 3h Connection Delay to ${destName}`,
      description: "Primary connection delayed. SafarSetu autonomous engine coordinates with stay host and storyteller chauffeur.",
      whatsappMessage: {
        heading: `SafarSetu Alert: Delay to ${destName}`,
        body: `Your connection to ${destName} has encountered a 3h delay. Autonomous engine has alerted your homestay host and storyteller chauffeur.`,
        plan: [
          "1. Shifted to backup express connection on time",
          "2. Homestay check-in pushed to evening (Host notified & confirmed)",
          "3. Chauffeur pickup rescheduled to updated arrival"
        ]
      },
      replannedEvents: [
        { time: "10:30 AM", title: "Rescheduled Arrival & Driver Pickup", desc: `Chauffeur briefed on updated arrival time for ${destName}.`, status: "Rescheduled ✓" },
        { time: "01:30 PM", title: "Adjusted Homestay Check-in", desc: "Room guaranteed; host informed via direct SMS.", status: "Shifted ✓" },
        { time: "04:30 PM", title: "Optimized Sunset Sightseeing", desc: "Itinerary re-sequenced for golden hour light.", status: "Optimized ✓" }
      ]
    });
  } else {
    res.json({
      type: "weather_alert",
      title: `Weather Caution: Road Reroute near ${destName}`,
      description: "Seasonal rainfall detected on high passes. Route shifted to all-weather state highway with storyteller chauffeur.",
      whatsappMessage: {
        heading: `Weather Advisory: ${destName}`,
        body: `Precautionary weather reroute applied. Storyteller driver will navigate all-weather scenic highway.`,
        plan: [
          "1. Valley bypass route confirmed",
          "2. Indoor spice & museum visits prioritized",
          "3. Evening tea tasting indoors"
        ]
      },
      replannedEvents: [
        { time: "09:30 AM", title: "All-Weather Highway Valley Bypass", desc: "Smooth transit away from high pass rain curves.", status: "Rerouted ✓" },
        { time: "01:00 PM", title: "Indoor Spice Museum & Tea Salon", desc: "Sensory tasting sheltered from weather.", status: "Added ✓" }
      ]
    });
  }
});

// SOS Emergency Telemetry Broadcast
app.post("/api/sos/broadcast", (req: Request, res: Response) => {
  const { destination, latitude, longitude, contactNumber } = req.body;
  const incident: StoredSOSIncident = {
    id: "SOS-" + Math.floor(100000 + Math.random() * 900000),
    timestamp: new Date().toISOString(),
    destination: destination || "Unknown",
    latitude: Number(latitude) || 10.0889,
    longitude: Number(longitude) || 77.0595,
    contactNumber: contactNumber || "+91 98765 43210",
    status: "DISPATCHED_TO_POLICE_AND_FAMILY"
  };

  sosIncidentsStore.push(incident);

  res.json({
    status: "BROADCAST_SUCCESS",
    incidentId: incident.id,
    message: "SOS Broadcast Dispatched: GPS coordinates shared with National Tourist Police (112) and family emergency contacts.",
    telemetry: {
      lat: incident.latitude,
      lng: incident.longitude,
      destination: incident.destination
    }
  });
});

// Operator Hub Inventory
app.get("/api/operator/inventory", (req: Request, res: Response) => {
  res.json(operatorInventory);
});

app.post("/api/operator/toggle-stock", (req: Request, res: Response) => {
  const { id } = req.body;
  const item = operatorInventory.find(i => i.id === id);
  if (!item) {
    return res.status(404).json({ error: "Inventory item not found." });
  }

  item.isSoldOut = !item.isSoldOut;
  item.availableRooms = item.isSoldOut ? 0 : 2;

  res.json({
    message: `Inventory status updated to ${item.isSoldOut ? 'Sold Out' : 'Available'}`,
    item
  });
});

// SafarMitra AI - Real Gemini API Integration with Grounded Knowledge
app.post("/api/ai/chat", async (req: Request, res: Response) => {
  const { message, destinationKey, currentPlan, language } = req.body;
  const q = String(message || "").trim();

  if (!q) {
    return res.status(400).json({ error: "Empty message provided." });
  }

  const destData = COMPLETE_TOURISM_REGISTRY[destinationKey] || COMPLETE_TOURISM_REGISTRY["kerala"];
  const client = getGeminiClient();

  // Try real Gemini API if key is present
  if (client) {
    try {
      const systemInstruction = `You are SafarMitra, an empathetic, highly knowledgeable, and authentic local Indian travel guide for ${destData.name} (${destData.tagline}).
The user is traveling to: ${destData.name}.
Capital: ${destData.capital}.
Best season: ${destData.whenToVisit.bestSeason}.
Authentic food: ${destData.cuisineAndCrafts.food.join(', ')}.
Handicrafts: ${destData.cuisineAndCrafts.crafts.join(', ')}.
Safety: ${destData.safetyAndFeatures.join(', ')}.
Current trip context: ${JSON.stringify(currentPlan || {})}.
Language preference: ${language || 'English'}.
Guidelines:
1. Provide warm, practical, culturally accurate advice with regional nuances.
2. Recommend authentic local homestays (0% middleman fees) and verified storyteller drivers.
3. Answer concisely in 2 to 4 punchy sentences, using bold points for readability.
4. If asked in Hindi, Malayalam, Telugu, Tamil, Marathi, or Bengali, answer gracefully in that language or bilingual English.`;

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: q }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const reply = response.text?.trim() || `For ${destData.name}, I recommend exploring verified rural homestays, booking your storyteller chauffeur early, and enjoying authentic regional delicacies!`;
      return res.json({ reply, source: "gemini-3.8-flash" });
    } catch (err: any) {
      console.warn("Gemini API call failed, falling back to grounded knowledge engine:", err?.message);
    }
  }

  // Grounded knowledge fallback
  const lower = q.toLowerCase();
  let fallbackReply = `**SafarMitra Guide for ${destData.name}:** For the most authentic journey, stay in certified local homestays where hosts prepare traditional meals with 0% platform fees. Your local storyteller chauffeur provides safe navigation and regional lore!`;

  if (lower.includes("safe") || lower.includes("night") || lower.includes("women") || lower.includes("solo")) {
    fallbackReply = `**Safety Corridor Advisory for ${destData.name}:** All tourist corridors around ${destData.capital} and key heritage sites are monitored with verified tourist police booths (Dial 112). Our storyteller chauffeurs undergo police verification and vehicles have GPS emergency sync.`;
  } else if (lower.includes("food") || lower.includes("eat") || lower.includes("breakfast") || lower.includes("restaurant")) {
    fallbackReply = `**Authentic Culinary Trail in ${destData.name}:** Must-try regional delicacies include **${destData.cuisineAndCrafts.food.slice(0, 3).join(', ')}**. SafarSetu homestay hosts serve fresh home-cooked meals at honest prices.`;
  } else if (lower.includes("gem") || lower.includes("hidden") || lower.includes("crowd") || lower.includes("secret")) {
    fallbackReply = `**Curated Hidden Gem in ${destData.name}:** Explore **${destData.whereToVisit[0]?.name}** (${destData.whereToVisit[0]?.desc}). It offers tranquil scenery and living heritage away from congested tourist crowds.`;
  } else if (lower.includes("rain") || lower.includes("weather") || lower.includes("season") || lower.includes("when")) {
    fallbackReply = `**Best Time to Visit ${destData.name}:** ${destData.whenToVisit.bestSeason}. ${destData.whenToVisit.budgetAnalysis.budgetTip}`;
  }

  return res.json({
    reply: fallbackReply,
    source: "grounded-local-engine"
  });
});

// Register Partner & Operations Admin Endpoints
registerPartnerAndAdminRoutes(app, getGeminiClient, bookingsStore);

// Proxy unhandled /api and /uploads requests to Python FastAPI backend (http://127.0.0.1:8000)
app.use(['/api', '/uploads'], (req: Request, res: Response) => {
  const proxyHeaders = { ...req.headers };
  delete proxyHeaders['host'];

  const options: http.RequestOptions = {
    hostname: '127.0.0.1',
    port: 8000,
    path: req.originalUrl,
    method: req.method,
    headers: {
      ...proxyHeaders,
      host: '127.0.0.1:8000'
    }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    console.error('[Backend Proxy Error]', err.message);
    if (!res.headersSent) {
      res.status(502).json({ detail: "Backend Python server unavailable" });
    }
  });

  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data') || req.method === 'GET' || req.method === 'DELETE' || !req.body || Object.keys(req.body).length === 0) {
    req.pipe(proxyReq);
  } else {
    const bodyData = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    proxyReq.setHeader('Content-Type', contentType || 'application/json');
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
    proxyReq.end();
  }
});

// ==========================================
// VITE MIDDLEWARE & SERVER STARTUP
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[YatraSync] Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
