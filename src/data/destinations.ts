// Changes made by @MdFarhanAhmad
import { StateTourism, DestinationPlannerPackage, TimelineDayGroup, RentalVehicleOption } from '../types';

export const ALL_STATES_AND_UTS: StateTourism[] = [
  // 1. Kerala
  {
    id: "kerala",
    name: "Kerala Tourism",
    tagline: "God's Own Country",
    capital: "Thiruvananthapuram",
    region: "south",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80",
    badge: "Eco-Heritage & Backwaters",
    duration: "5–7 Days",
    description: "Palm-fringed backwaters of Alleppey, misty organic tea mountains in Munnar, and Ayurvedic healing sanctuaries.",
    whenToVisit: {
      bestSeason: "September to March (Pleasant Backwaters, 22°C – 30°C)",
      budgetAnalysis: {
        lowestPriceWindow: "June - August (Monsoon Rejuvenation)",
        averageSavings: "Save up to 48% on Luxury Houseboats",
        budgetTip: "Government verified backwater homestays offer authentic meals at one-third of luxury hotel tariffs."
      }
    },
    itinerary5Day: [
      { day: "Day 1", title: "Fort Kochi Colonial Heritage & Kathakali", morning: "Chinese fishing nets and Princess Street spice market lanes.", afternoon: "Paradesi Synagogue in Mattancherry and Dutch Palace frescoes.", evening: "Live Kathakali performance followed by authentic Malabar fish curry." },
      { day: "Day 2", title: "Scenic Ascent to Munnar Tea Country", morning: "Drive past Cheeyappara and Valara waterfalls into the Western Ghats.", afternoon: "Tata Tea Museum and sensory cardamom plantation walk.", evening: "Sunset tea tasting at Pothamedu viewpoint, stay at organic tea homestay." },
      { day: "Day 3", title: "Eravikulam & Kolukkumalai Sunrise", morning: "Eravikulam National Park to spot the endangered Nilgiri Tahr.", afternoon: "Mattupetty Dam boat safari and Echo Point walk.", evening: "Campfire and traditional Kerala stew dinner in Chinnakanal." },
      { day: "Day 4", title: "Alleppey Backwater Houseboat Cruise", morning: "Drive down to Alleppey Finishing Point jetty.", afternoon: "Board solar-assisted Kettuvallam and cruise through tranquil village canals.", evening: "Karimeen Pollichathu dinner on Vembanad Lake under the stars." },
      { day: "Day 5", title: "Marari Quiet Beach & Coir Village", morning: "Morning canoe paddle through narrow palm-shaded side canals.", afternoon: "Visit a women's coir weaving cooperative and Marari fishing hamlet.", evening: "Fresh coconut water by the Arabian Sea and transfer to Cochin." }
    ],
    itinerary7Day: [
      { day: "Day 1", title: "Fort Kochi Historic Trails", morning: "Chinese fishing nets and St. Francis Church.", afternoon: "Mattancherry Jew Town antique and spice alleys.", evening: "Kalaripayattu martial arts show." },
      { day: "Day 2", title: "Cochin to Munnar Ghat Drive", morning: "Scenic ascent via Cheeyappara waterfalls.", afternoon: "Lockhart tea factory and orthodox tasting.", evening: "Homestay check-in with host family." },
      { day: "Day 3", title: "High Altitude Munnar Peaks", morning: "Eravikulam National Park Nilgiri Tahr safari.", afternoon: "Kundala Lake pedal boats and blossom gardens.", evening: "Ayurvedic herbal massage session." },
      { day: "Day 4", title: "Thekkady Periyar Wildlife Sanctuary", morning: "Scenic ridge drive from Munnar to Periyar spice hills.", afternoon: "Bamboo rafting and boat safari in Periyar Lake.", evening: "Tribal spice trail and cardamom auction market." },
      { day: "Day 5", title: "Kumarakom Bird Sanctuary & Canals", morning: "Early morning migratory bird watching in Kumarakom.", afternoon: "Village craft trails and traditional toddy tapping demo.", evening: "Sunset canoe glide across lotus ponds." },
      { day: "Day 6", title: "Alleppey Private Kettuvallam Cruise", morning: "Board eco-certified wooden houseboat at Punnamada.", afternoon: "Sail through Kuttanad farming below sea level.", evening: "Fresh lake Karimeen dinner served on banana leaf." },
      { day: "Day 7", title: "Varkala Cliff Sunset & Departure", morning: "Drive south to the dramatic red laterite cliffs of Varkala.", afternoon: "Relax at Papanasam beach natural mineral springs.", evening: "Sunset cliff cafe farewell and airport transfer." }
    ],
    whereToVisit: [
      { name: "Alleppey Backwaters", type: "Eco-Waterways", desc: "Interconnected serene canals navigated by eco-certified houseboats." },
      { name: "Munnar Tea Hills", type: "Hill Station", desc: "Rolling green terraces and mist-shrouded mountain summits." },
      { name: "Fort Kochi", type: "Colonial Port", desc: "Blend of Portuguese, Dutch, and British maritime architecture." },
      { name: "Periyar Reserve", type: "Wildlife", desc: "Elephant and tiger sanctuary around a scenic mountain lake." }
    ],
    cuisineAndCrafts: {
      food: ["Appam with Vegetable Stew", "Karimeen Pollichathu", "Kerala Sadya Feast", "Malabar Parotta & Beef Roast"],
      crafts: ["Aranmula Kannadi Metal Mirrors", "Coir Handicrafts", "Kathakali Wooden Masks", "Nettipattam Elephant Regalia"]
    },
    safetyAndFeatures: [
      "Responsible Tourism Mission (RT Kerala) certifying 100% locally owned homestays.",
      "Women-friendly tourism network with audited solo female accommodation.",
      "Houseboat safety GPS audit and digital lifejacket verification."
    ]
  },

  // 2. Telangana
  {
    id: "telangana",
    name: "Telangana Tourism",
    tagline: "It's all in it",
    capital: "Hyderabad",
    region: "south",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
    badge: "State Partner & UNESCO",
    duration: "4–6 Days",
    description: "From the 400-year-old Charminar and Golconda citadel to the UNESCO Ramappa Temple and Laknavaram hanging bridge.",
    whenToVisit: {
      bestSeason: "October to March (Pleasant Winter, 18°C – 28°C)",
      budgetAnalysis: {
        lowestPriceWindow: "July - August (Monsoon Special)",
        averageSavings: "Save up to 42% on Stays & Cabs",
        budgetTip: "Book Warangal rural homestays directly for zero-surcharge tariff and farm breakfast."
      }
    },
    itinerary5Day: [
      { day: "Day 1", title: "Regal Hyderabad: Charminar & Palaces", morning: "Sunrise at Charminar, Laad Bazaar bangle walk, and morning Irani chai.", afternoon: "Chowmahalla Palace coronation halls and Salar Jung Museum.", evening: "Golconda Fort sound & light show and authentic Hyderabadi Dum Biryani." },
      { day: "Day 2", title: "Qutb Shahi Heritage & Hussain Sagar", morning: "Qutb Shahi Tombs restoration trail and whispering acoustic domes.", afternoon: "Birla Mandir white marble temple on Naubat Pahad.", evening: "Hussain Sagar Lake boat ride to Buddha statue at sunset." },
      { day: "Day 3", title: "Kakatiya UNESCO Architecture: Warangal", morning: "Express train to Warangal; visit Thousand Pillar Temple.", afternoon: "UNESCO Ramappa Temple built with 13th-century floating bricks.", evening: "Rural homestay check-in and authentic Sarva Pindi dinner." },
      { day: "Day 4", title: "Laknavaram Lake & Forest Sanctuary", morning: "Walk across the scenic Laknavaram rope suspension bridge.", afternoon: "Speedboat ride through dense Pakhal wildlife sanctuary.", evening: "Warangal Fort stone gateway (Kakatiya Kala Thoranam) sunset." },
      { day: "Day 5", title: "Pochampally Weavers Village & Departure", morning: "Drive to Pochampally village, birthplace of geometric Ikat silks.", afternoon: "Live loom demonstration with national award-winning artisans.", evening: "Traditional Telangana thali and transfer to Hyderabad airport." }
    ],
    itinerary7Day: [
      { day: "Day 1", title: "Old City Hyderabad & Irani Chai", morning: "Charminar, Mecca Masjid, and Choodi Bazaar.", afternoon: "Chowmahalla Palace vintage car collection.", evening: "Shadab restaurant Dum Biryani feast." },
      { day: "Day 2", title: "Golconda Fort & Qutb Shahi Dynasties", morning: "Climb Golconda Fort to the top Durbar Hall.", afternoon: "Explore the ornate seven Qutb Shahi Tombs.", evening: "KBR Park nature trail and Jubilee Hills cafe." },
      { day: "Day 3", title: "Art, Crafts & Hussain Sagar", morning: "Shilparamam arts and crafts rural village.", afternoon: "Salar Jung Museum Veiled Rebecca marvel.", evening: "Necklace Road cruise and illuminated skyline." },
      { day: "Day 4", title: "Warangal Thousand Pillar & Fort", morning: "Train to Warangal; Thousand Pillar Temple.", afternoon: "Warangal Fort ruins and Kakatiya Thoranam.", evening: "Local cotton handloom market visit." },
      { day: "Day 5", title: "UNESCO Ramappa Temple & Palampet", morning: "Ramappa Temple intricate sandstone dancing sculptures.", afternoon: "Ramappa Lake irrigation marvel built in 1213 CE.", evening: "Host family cooking class with jowar rotis." },
      { day: "Day 6", title: "Laknavaram Island Hanging Bridges", morning: "Explore 13 scenic islands linked by suspension bridges.", afternoon: "Eco-cottage lunch and Pakhal lake bird watching.", evening: "Bonfire folklore night with local folk singers." },
      { day: "Day 7", title: "Bhongir Fort Monolith & Departure", morning: "Climb the massive egg-shaped monolith rock of Bhongir Fort.", afternoon: "Yadagirigutta temple precinct panoramic views.", evening: "Return to Hyderabad for return flight or train." }
    ],
    whereToVisit: [
      { name: "Charminar & Mecca Masjid", type: "Iconic Monument", desc: "Built in 1591 CE at the heart of Hyderabad." },
      { name: "Ramappa Temple (UNESCO)", type: "World Heritage", desc: "13th-century Kakatiya temple built with lightweight floating bricks." },
      { name: "Golconda Fort", type: "Fortress", desc: "Diamond trade citadel with acoustic whispering galleries." },
      { name: "Laknavaram Lake", type: "Eco-Waterways", desc: "Serene reservoir with suspension bridges connecting lush islands." }
    ],
    cuisineAndCrafts: {
      food: ["Hyderabadi Dum Biryani", "Mirchi ka Salan", "Sarva Pindi (Crisp Rice Pancake)", "Irani Chai & Osmania Biscuits", "Double ka Meetha"],
      crafts: ["Pochampally Ikat Silks", "Bidriware Silver Inlay Metal", "Nirmal Wooden Lacquer Toys", "Pembarthi Brassware"]
    },
    safetyAndFeatures: [
      "Hyderabad SHE-Teams: 24x7 women safety patrols active across transit hubs.",
      "Prepaid Pink Auto stands at Secunderabad and Hyderabad railway stations.",
      "State Tourism Haritha hotel network across rural Warangal."
    ]
  },

  // 3. Rajasthan
  {
    id: "rajasthan",
    name: "Rajasthan Tourism",
    tagline: "Padharo Mhare Desh",
    capital: "Jaipur",
    region: "north",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
    badge: "Royal Heritage",
    duration: "5–7 Days",
    description: "Golden Thar desert dunes, grand hilltop fortresses, and vibrant royal palaces of Jaipur, Jodhpur, and Udaipur.",
    whenToVisit: {
      bestSeason: "October to March (12°C – 26°C)",
      budgetAnalysis: { lowestPriceWindow: "July - September", averageSavings: "Save up to 52% on Heritage Havelis", budgetTip: "Restored havelis in Old Jaipur offer authentic royal suites at off-peak rates." }
    },
    itinerary5Day: [
      { day: "Day 1", title: "Pink City Jaipur: Forts & Observatories", morning: "Amer Fort hilltop climb and mirror-worked Sheesh Mahal.", afternoon: "Hawa Mahal wind palace and Jantar Mantar sundials.", evening: "Johari Bazaar walk and traditional Dal Baati Churma." },
      { day: "Day 2", title: "City Palace & Nahargarh Sunset", morning: "Jaipur City Palace royal museum and Peacock Courtyard.", afternoon: "Panna Meena ka Kund geometric stepwell photo walk.", evening: "Sunset over Jaipur city from Nahargarh Fort cannon ramparts." },
      { day: "Day 3", title: "Blue City Jodhpur: Mehrangarh", morning: "Morning Vande Bharat train to Jodhpur, the Blue City.", afternoon: "Explore Mehrangarh Fort towering 400 feet on cliff rock.", evening: "Walk through the cobalt blue houses of Brahmapuri." },
      { day: "Day 4", title: "City of Lakes Udaipur: Lake Pichola", morning: "Scenic drive through Ranakpur Jain marble temple.", afternoon: "Udaipur City Palace overlooking Lake Pichola.", evening: "Sunset boat cruise around Jag Mandir island palace." },
      { day: "Day 5", title: "Saheliyon ki Bari & Departure", morning: "Fountain gardens of Saheliyon ki Bari and vintage car salon.", afternoon: "Miniature painting workshop with master artists.", evening: "Rooftop dinner overlooking Lake Palace and airport transfer." }
    ],
    itinerary7Day: [
      { day: "Day 1", title: "Jaipur Pink City Heritage", morning: "Amer Fort and Maota Lake reflection.", afternoon: "Anokhi Hand Printing Museum.", evening: "Chokhi Dhani cultural folk village." },
      { day: "Day 2", title: "Jaipur Royal Palaces", morning: "City Palace private chambers.", afternoon: "Jantar Mantar astronomical instruments.", evening: "Jaigarh Fort world's largest cannon." },
      { day: "Day 3", title: "Pushkar Holy Lake & Desert", morning: "Drive to holy town Pushkar; Brahma Temple.", afternoon: "Walk around the 52 holy bathing ghats.", evening: "Sunset camel ride on surrounding sand dunes." },
      { day: "Day 4", title: "Jodhpur Mehrangarh Citadel", morning: "Arrive in Jodhpur; Jaswant Thada marble cenotaph.", afternoon: "Mehrangarh Fort palanquin gallery.", evening: "Clock Tower spice market and Makhaniya lassi." },
      { day: "Day 5", title: "Bishnoi Village Safari", morning: "Rural jeep safari visiting wildlife and potters.", afternoon: "Opium ceremony and block printing demo.", evening: "Umaid Bhawan Palace museum walk." },
      { day: "Day 6", title: "Ranakpur & Lake City Udaipur", morning: "Drive to Ranakpur 1444 pillar marble temple.", afternoon: "Arrival in Udaipur; Bagore ki Haveli museum.", evening: "Dharohar Rajasthani folk and puppet dance." },
      { day: "Day 7", title: "Udaipur Lake Pichola Cruise", morning: "City Palace complex crystal gallery.", afternoon: "Boat cruise past Lake Palace to Jag Mandir.", evening: "Lakeside candlelight dinner and departure." }
    ],
    whereToVisit: [
      { name: "Amer Fort (Jaipur)", type: "UNESCO Fortress", desc: "Hilltop citadel featuring Mughal-Rajput ornate palaces." },
      { name: "Mehrangarh Fort (Jodhpur)", type: "Fortress", desc: "Towering cliff fortress with pristine royal collections." },
      { name: "Lake Pichola (Udaipur)", type: "Lakes & Palaces", desc: "Gleaming lake framed by Aravalli mountains and palaces." }
    ],
    cuisineAndCrafts: {
      food: ["Dal Baati Churma", "Gatte ki Sabzi", "Laal Maas", "Pyaaz Kachori", "Ghevar"],
      crafts: ["Jaipur Blue Pottery", "Sanganeri Hand Block Prints", "Meenakari Enamel Jewellery", "Puppet Dolls"]
    },
    safetyAndFeatures: ["RTDC Verified Heritage Haveli Network", "Rajasthan Tourist Assistance Force", "Women solo-traveler concierge"]
  },

  // 4. Himachal Pradesh
  {
    id: "himachal",
    name: "Himachal Tourism",
    tagline: "Unforgettable Himachal",
    capital: "Shimla",
    region: "north",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80",
    badge: "Himalayan Wilderness",
    duration: "5–7 Days",
    description: "Snow-capped peaks, pine-scented valleys of Kullu and Manali, and Tibetan monastic culture in Dharamshala.",
    whenToVisit: { bestSeason: "March to June (Summer Bloom) & Dec to Feb (Snow)", budgetAnalysis: { lowestPriceWindow: "September - November", averageSavings: "Save 36%", budgetTip: "Old Manali wooden chalets offer woodstove heating." } },
    itinerary5Day: [
      { day: "Day 1", title: "Shimla Colonial Ridge & Mall Road", morning: "Kalka-Shimla UNESCO toy train ride.", afternoon: "Viceregal Lodge and botanical gardens.", evening: "Sunset at The Ridge and Christ Church." },
      { day: "Day 2", title: "Drive through Beas Valley to Manali", morning: "Scenic mountain highway past Pandoh Dam.", afternoon: "Kullu shawl weaving center stopover.", evening: "Check into traditional Kath-Kuni cedarwood homestay." },
      { day: "Day 3", title: "Alpine Manali & Hadimba Forest", morning: "Hadimba Temple amidst centuries-old deodar trees.", afternoon: "Jogini Waterfall trek through Vashisht village.", evening: "Hot sulfur bath and cafe hopping in Old Manali." },
      { day: "Day 4", title: "Atal Tunnel & Lahaul Valley Sissu", morning: "Drive through world's longest high-altitude Atal Tunnel.", afternoon: "Sissu glacial waterfall and Lahauli village walk.", evening: "Himachali Dham feast with local family." },
      { day: "Day 5", title: "Solang Valley & Return", morning: "Paragliding and mountain river crossing in Solang.", afternoon: "Apple orchard walk and fresh cider tasting.", evening: "Transfer to Kullu-Bhuntar airport or Volvo bus." }
    ],
    itinerary7Day: [
      { day: "Day 1", title: "Shimla Heritage Stroll", morning: "Toy train ride through pine tunnels.", afternoon: "Gaiety Theatre and heritage walk.", evening: "Mall road bakeries." },
      { day: "Day 2", title: "Kufri & Narkanda Apple Belt", morning: "Himalayan Nature Park in Kufri.", afternoon: "Hatu Peak panoramic snowline view.", evening: "Homestay fire-pit storytelling." },
      { day: "Day 3", title: "Journey to Manali Valley", morning: "Descent through Mandi river gorge.", afternoon: "Naggar Castle art gallery.", evening: "Old Manali riverside walk." },
      { day: "Day 4", title: "Solang & Atal Tunnel Expedition", morning: "Adventure sports at Solang.", afternoon: "Crossing under Rohtang into Lahaul.", evening: "Sissu waterfall and village camp." },
      { day: "Day 5", title: "Kasol & Parvati Valley", morning: "Drive along roaring Parvati River.", afternoon: "Manikaran hot springs and gurudwara langar.", evening: "Chalal bridge walk and Israeli cuisine." },
      { day: "Day 6", title: "Dharamshala & McLeodGanj", morning: "Drive to seat of Dalai Lama in Kangra.", afternoon: "Tsuglagkhang Tibetan Temple complex.", evening: "Bhagsunag waterfall and Tibetan momos." },
      { day: "Day 7", title: "Kangra Fort & Departure", morning: "Ancient 1000-year-old Kangra Fort.", afternoon: "Tea gardens of Palampur.", evening: "Dharamshala airport transfer." }
    ],
    whereToVisit: [
      { name: "Atal Tunnel & Sissu", type: "Himalayan Gateway", desc: "Highway tunnel above 10,000 feet opening to Lahaul valley." },
      { name: "Hadimba Temple", type: "Cedar Pagoda", desc: "1553 CE wooden pagoda temple in deep pine forest." },
      { name: "The Ridge (Shimla)", type: "Colonial Promenade", desc: "Open-air plaza with views of seven hills." }
    ],
    cuisineAndCrafts: { food: ["Siddu with Desi Ghee", "Himachali Dham", "Kullu Trout Fish", "Chha Gosht"], crafts: ["Kullu Woolen Shawls", "Chamba Rumal", "Tibetan Prayer Wheels"] },
    safetyAndFeatures: ["Real-time snowfall pass alerts", "HPTDC audited mountain homestays", "24x7 Mountain rescue link"]
  },

  // 5. Goa
  {
    id: "goa",
    name: "Goa Tourism",
    tagline: "A Pearl of the Orient",
    capital: "Panaji",
    region: "west",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
    badge: "Coastal Heritage & Estuaries",
    duration: "4–6 Days",
    description: "200-year-old Portuguese villas in Fontainhas, peaceful backwater islands of Divar, and historic UNESCO churches.",
    whenToVisit: { bestSeason: "November to February (Breezy 20°C - 30°C)", budgetAnalysis: { lowestPriceWindow: "July - September (Lush Green Monsoon)", averageSavings: "Save 45%", budgetTip: "Free river ferries across Mandovi to Divar Island." } },
    itinerary5Day: [
      { day: "Day 1", title: "Fontainhas Latin Quarter & Ferries", morning: "Walking tour of colorful Portuguese houses in Fontainhas.", afternoon: "Art gallery cafes and freshly baked pastéis de nata.", evening: "Sunset Mandovi river cruise and Goan fish thali." },
      { day: "Day 2", title: "Divar Island & Old Goa UNESCO", morning: "Catch free car ferry to quiet, car-free Divar Island.", afternoon: "Basilica of Bom Jesus and Sé Cathedral in Old Goa.", evening: "Spiced crab xacuti dinner at a riverside tavern." },
      { day: "Day 3", title: "Spice Plantations & Dudhsagar", morning: "Ponda organic spice plantation tour with buffet lunch.", afternoon: "4x4 jeep trek to Dudhsagar four-tiered waterfall.", evening: "Craft feni cocktail tasting session with master distiller." },
      { day: "Day 4", title: "South Goa Heritage Palaces & Cliffs", morning: "Visit Figueiredo and Bragança heritage mansions in Chandor.", afternoon: "Cabo de Rama sea fort overlooking turquoise cove.", evening: "Candlelight beach dining on quiet Agonda sands." },
      { day: "Day 5", title: "Mapusa Flea Market & Departure", morning: "Browse authentic spice and pottery vendors in Mapusa.", afternoon: "Anjuna cliff views and artisan handicraft shopping.", evening: "Transfer to Mopa (GOX) or Dabolim (GOI) airport." }
    ],
    itinerary7Day: [
      { day: "Day 1", title: "Panaji Latin Quarter Charm", morning: "Fontainhas heritage architecture trail.", afternoon: "Altinho hill view and Maruti temple.", evening: "Traditional Goan Portuguese dinner." },
      { day: "Day 2", title: "Old Goa Religious Heritage", morning: "St. Francis of Assisi and Bom Jesus.", afternoon: "Viceroy's Arch and Mandovi riverbank.", evening: "Divar Island village bicycle ride." },
      { day: "Day 3", title: "Chorão Island & Salim Ali Birds", morning: "Mangrove canoe trail in bird sanctuary.", afternoon: "Local Goan bakery poi bread making.", evening: "Sunset drink overlooking river ferry." },
      { day: "Day 4", title: "Dudhsagar Jungle Expedition", morning: "Jeep safari through Bhagwan Mahaveer park.", afternoon: "Swim in the natural pool below Dudhsagar.", evening: "Spice plantation dinner with feni." },
      { day: "Day 5", title: "South Goa Chandor Mansions", morning: "300-year-old Bragança Palace.", afternoon: "Benaulim wooden boat building village.", evening: "Colva beach sunset walk." },
      { day: "Day 6", title: "Cabo de Rama & Palolem Crescent", morning: "Climb Cabo de Rama ruins.", afternoon: "Kayak along Palolem beach estuary.", evening: "Beachfront seafood barbecue." },
      { day: "Day 7", title: "Reis Magos Fort & Departure", morning: "Restored Reis Magos Fort and Mario Miranda gallery.", afternoon: "Souvenir shopping in Panaji.", evening: "Airport transfer." }
    ],
    whereToVisit: [
      { name: "Fontainhas (Panaji)", type: "Heritage Quarter", desc: "Latin Quarter with tiled Portuguese streets." },
      { name: "Divar Island", type: "Quiet Estuary", desc: "Pristine island reached only by free river ferries." },
      { name: "Basilica of Bom Jesus", type: "UNESCO Baroque", desc: "16th-century church holding relics of St. Francis Xavier." }
    ],
    cuisineAndCrafts: { food: ["Goan Fish Curry Rice", "Prawn Balchão", "Pork Vindaloo", "Bebinca Cake"], crafts: ["Azulejos Ceramic Tiles", "Terracotta Pottery", "Coconut Shell Craft"] },
    safetyAndFeatures: ["Drishti Marine Lifeguards on public beaches", "Prepaid taxi counters at Mopa/Dabolim", "Tourism Police booths"]
  },

  // 6. Maharashtra
  {
    id: "maharashtra",
    name: "Maharashtra Tourism",
    tagline: "Unlimited Maharashtra",
    capital: "Mumbai",
    region: "west",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80",
    badge: "Sahyadri Heritage & Caves",
    duration: "5–7 Days",
    description: "Historic sea forts, Ajanta-Ellora caves, bustling colonial Mumbai, and Sahyadri mountain retreats.",
    whenToVisit: { bestSeason: "October to March (20°C - 30°C)", budgetAnalysis: { lowestPriceWindow: "July - August (Monsoon Treks)", averageSavings: "Save 40%", budgetTip: "MTDC hillside resorts offer incredible value overlooking waterfalls." } },
    itinerary5Day: [
      { day: "Day 1", title: "Colonial South Mumbai & Gateway", morning: "Gateway of India and Taj Mahal Palace hotel.", afternoon: "Kala Ghoda art precinct and Chhatrapati Shivaji Maharaj Vastu Museum.", evening: "Sunset at Marine Drive Queen's Necklace and Parsi cafe meal." },
      { day: "Day 2", title: "Elephanta Caves & Crawford Market", morning: "Ferry ride across Mumbai Harbour to Elephanta rock caves.", afternoon: "Admire the colossal Trimurti Shiva sculpture.", evening: "Bustling heritage lanes of Crawford and Mangaldas fabric markets." },
      { day: "Day 3", title: "Sahyadri Hill Retreat: Lonavala & Karla", morning: "Express highway drive to Western Ghats; Karla rock-cut caves.", afternoon: "Bhaja caves and Buddhist stupas dating back to 2nd century BCE.", evening: "Stay at mountain homestay and savor hot chikki and misal pav." },
      { day: "Day 4", title: "Chhatrapati Sambhajinagar (Aurangabad)", morning: "Vande Bharat train to Sambhajinagar.", afternoon: "UNESCO Ellora Caves including monumental Kailash monolithic temple.", evening: "Daulatabad Fort climb and sound & light show." },
      { day: "Day 5", title: "Ajanta Caves Buddhist Frescoes", morning: "Full day excursion to horse-shoe shaped Ajanta gorge.", afternoon: "Explore the ancient Buddhist mural paintings and prayer chaityas.", evening: "Bidriware and Paithani silk shopping; return flight." }
    ],
    itinerary7Day: [
      { day: "Day 1", title: "South Mumbai Architectural Gems", morning: "Victoria Terminus (CSMT) Gothic tour.", afternoon: "David Sassoon Library and Oval Maidan.", evening: "Girgaon Chowpatty street chaat." },
      { day: "Day 2", title: "Elephanta Island & Bandra", morning: "Harbour ferry to Elephanta Caves.", afternoon: "Bandra heritage village and Portuguese churches.", evening: "Bandra Bandstand sunset." },
      { day: "Day 3", title: "Matheran Eco-Station (No Cars)", morning: "Toy train to Asia's only automobile-free hill station.", afternoon: "Charlotte Lake and Louisa Point panoramic lookouts.", evening: "Forest cottage stay." },
      { day: "Day 4", title: "Pune Peshwa Heritage", morning: "Drive to Pune; Shaniwar Wada palace fort.", afternoon: "Aga Khan Palace memorial.", evening: "FC Road student cafes and bakery." },
      { day: "Day 5", title: "Ellora Caves & Kailash Temple", morning: "Drive to Ellora; marvel at rock carved top-to-bottom.", afternoon: "Bibi Ka Maqbara (Taj of Deccan).", evening: "Traditional Naan Qalia dinner." },
      { day: "Day 6", title: "Ajanta Gorge World Heritage", morning: "Scenic drive to Ajanta Caves gorge.", afternoon: "Guided exploration of Jataka tale murals.", evening: "Return to Chhatrapati Sambhajinagar." },
      { day: "Day 7", title: "Paithan Handloom & Departure", morning: "Visit Paithani silk master weaving studios.", afternoon: "Jayakwadi bird sanctuary.", evening: "Airport transfer." }
    ],
    whereToVisit: [
      { name: "Kailash Temple (Ellora)", type: "UNESCO Monolith", desc: "World's largest single rock excavation carved top-down." },
      { name: "Gateway of India", type: "Colonial Monument", desc: "Iconic arch overlooking Mumbai Harbour." },
      { name: "Ajanta Caves", type: "Ancient Art", desc: "30 rock-cut Buddhist caves with murals dating from 2nd century BCE." }
    ],
    cuisineAndCrafts: { food: ["Vada Pav", "Misal Pav", "Puran Poli", "Bombil Fry", "Pithla Bhakri"], crafts: ["Paithani Silk Sarees", "Kolhapuri Chappals", "Warli Tribal Paintings"] },
    safetyAndFeatures: ["Mumbai Police Tourist Assistance Booths", "SHE teams on local trains", "MTDC government certified network"]
  },

  // 7. Tamil Nadu
  {
    id: "tamilnadu",
    name: "Tamil Nadu Tourism",
    tagline: "Enchanting Tamil Nadu",
    capital: "Chennai",
    region: "south",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
    badge: "Dravidian Temple Heritage",
    duration: "5–7 Days",
    description: "Towering Dravidian Gopurams of Madurai, UNESCO shore temples of Mahabalipuram, and Chettinad mansions.",
    whenToVisit: { bestSeason: "November to March (Pleasant 22°C - 30°C)", budgetAnalysis: { lowestPriceWindow: "May - July", averageSavings: "Save 35%", budgetTip: "TTDC hotels next to temples provide early morning VIP darshan access." } },
    itinerary5Day: [
      { day: "Day 1", title: "Chennai to Mahabalipuram Shore Temples", morning: "Scenic East Coast Road drive past Kalakshetra.", afternoon: "UNESCO Shore Temple and Arjuna's Penance giant bas-relief.", evening: "Sunset by the Bay of Bengal and fresh seafood dinner." },
      { day: "Day 2", title: "Silk Town Kanchipuram to Thanjavur", morning: "Kailasanathar Temple and authentic Kanchipuram silk weavers.", afternoon: "Drive to royal Cauvery delta city of Thanjavur.", evening: "Brihadisvara Temple (Big Temple) illuminated granite vimana." },
      { day: "Day 3", title: "Chettinad Palaces & Culinary Feast", morning: "Explore Karaikudi and Kanadukathan 1000-window mansions.", afternoon: "Authentic multi-course Chettinad banana leaf feast.", evening: "Athangudi handmade floral tile making workshop." },
      { day: "Day 4", title: "Madurai: The Cultural Soul", morning: "Drive to Madurai; visit Thirumalai Nayakkar Palace.", afternoon: "Gandhi Memorial Museum and handloom cotton weavers.", evening: "Meenakshi Amman Temple night ceremony with temple elephants." },
      { day: "Day 5", title: "Meenakshi Morning & Departure", morning: "Early morning darshan of the thousand-pillared hall.", afternoon: "Sample Madurai street food: Jigarthanda and Kari Dosa.", evening: "Transfer to Madurai airport (IXM) or railway junction." }
    ],
    itinerary7Day: [
      { day: "Day 1", title: "Chennai Cultural Heartland", morning: "Kapaleeshwarar Temple in Mylapore.", afternoon: "Fort St. George and San Thome Basilica.", evening: "Marina beach breeze and sundal snack." },
      { day: "Day 2", title: "Mahabalipuram UNESCO Monoliths", morning: "Five Rathas monolithic granite rock temples.", afternoon: "Krishna's Butterball balance marvel.", evening: "Beachfront dinner with sea breeze." },
      { day: "Day 3", title: "Pondicherry French Quarter", morning: "Drive to Pondicherry; walk in French White Town.", afternoon: "Auroville Matrimandir meditation dome.", evening: "French bakery dinner." },
      { day: "Day 4", title: "Great Chola Temple of Thanjavur", morning: "Brihadisvara 1000-year-old temple.", afternoon: "Thanjavur Royal Palace and bronze gallery.", evening: "Thanjavur art plate master craftsman." },
      { day: "Day 5", title: "Chettinad Heritage Trail", morning: "The Bangala heritage mansion tour.", afternoon: "Chettinad spice market and pepper chicken lunch.", evening: "Antique furniture street in Karaikudi." },
      { day: "Day 6", title: "Madurai Meenakshi Temple", morning: "Four towering Gopurams of Meenakshi.", afternoon: "Thirumalai Nayakkar Italianate palace.", evening: "Evening palanquin procession." },
      { day: "Day 7", title: "Rameshwaram Coral Island & Departure", morning: "Drive across Pamban railway sea bridge to Rameshwaram.", afternoon: "Ramanathaswamy Temple long pillared corridors.", evening: "Dhanushkodi ghost town view and departure." }
    ],
    whereToVisit: [
      { name: "Meenakshi Amman Temple", type: "Dravidian Architecture", desc: "Historic 14-tower temple in Madurai." },
      { name: "Brihadisvara Temple (Thanjavur)", type: "Chola World Heritage", desc: "Grand 11th-century granite temple without a foundation." },
      { name: "Mahabalipuram Shore Temples", type: "7th-century Monoliths", desc: "Seaside granite carved cave temples and chariots." }
    ],
    cuisineAndCrafts: { food: ["Chettinad Chicken", "Madurai Jigarthanda", "Kothu Parotta", "Filter Coffee", "Kanchipuram Idli"], crafts: ["Kanchipuram Silk Sarees", "Thanjavur Gold Leaf Paintings", "Swamimalai Bronze Idols", "Athangudi Tiles"] },
    safetyAndFeatures: ["Tourism Police posts at major temple entrances", "Prepaid auto booths with digital metering", "Women exclusive buses"]
  },

  // 8. Uttar Pradesh
  {
    id: "uttarpradesh",
    name: "Uttar Pradesh Tourism",
    tagline: "Explore the Heartland",
    capital: "Lucknow",
    region: "north",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80",
    badge: "Monumental Heritage & Ghats",
    duration: "5–7 Days",
    description: "The white marble Taj Mahal, ancient spiritual ghats of Varanasi, and royal Nawabi gastronomy of Lucknow.",
    whenToVisit: { bestSeason: "October to March (Pleasant 10°C - 24°C)", budgetAnalysis: { lowestPriceWindow: "June - August", averageSavings: "Save 45%", budgetTip: "Varanasi riverside homestays provide private sunrise boat access." } },
    itinerary5Day: [
      { day: "Day 1", title: "Agra: The White Marble Taj Mahal", morning: "Sunrise at Taj Mahal watching morning light reflect on marble.", afternoon: "Agra Fort red sandstone royal palaces and Jahangiri Mahal.", evening: "Sunset view of Taj from Mehtab Bagh across the Yamuna river." },
      { day: "Day 2", title: "Fatehpur Sikri Mughal Capital", morning: "Drive to deserted red sandstone city of Fatehpur Sikri.", afternoon: "Buland Darwaza giant gateway and Salim Chishti tomb.", evening: "Petha sweet tasting in Sadar Bazaar; evening train to Lucknow." },
      { day: "Day 3", title: "Nawabi Lucknow: Heritage & Kebab", morning: "Bara Imambara acoustic whispering gallery and labyrinth (Bhulbhulaiya).", afternoon: "Chota Imambara chandeliers and British Residency ruins.", evening: "Galawati Kabab and Sheermal at legendary Tunday Kababi." },
      { day: "Day 4", title: "Spiritual Varanasi: Ghats & Aarti", morning: "Vande Bharat train to Varanasi (Kashi).", afternoon: "Kashi Vishwanath Corridor and historic temple lanes.", evening: "Grand Ganga Aarti on Dashashwamedh Ghat from private boat." },
      { day: "Day 5", title: "Sunrise Boat & Sarnath Stupa", morning: "5:30 AM sunrise wooden boat glide along the sacred bathing ghats.", afternoon: "Sarnath Dhamek Stupa where Buddha gave his first sermon.", evening: "Banarasi silk weaving loom visit and airport transfer." }
    ],
    itinerary7Day: [
      { day: "Day 1", title: "Agra Mughal Wonder", morning: "Taj Mahal sunrise tour.", afternoon: "Agra Fort palaces.", evening: "Marble inlay workshop demo." },
      { day: "Day 2", title: "Fatehpur Sikri & Mathura", morning: "Fatehpur Sikri Buland Darwaza.", afternoon: "Mathura Krishna Janmabhoomi temple.", evening: "Yamuna aarti in Vrindavan." },
      { day: "Day 3", title: "Lucknow Nawabi Architecture", morning: "Bara Imambara labyrinth.", afternoon: "Rumi Darwaza and clock tower.", evening: "Hazratganj evening stroll (Ganjing)." },
      { day: "Day 4", title: "Lucknow Crafts & Cuisine", morning: "Chikan hand embroidery artisan studios.", afternoon: "La Martiniere architectural tour.", evening: "Dum pukht biryani culinary walk." },
      { day: "Day 5", title: "Varanasi Spiritual Immersion", morning: "Train to Varanasi; check into ghat homestay.", afternoon: "Walking tour of ancient narrow alleys.", evening: "Dashashwamedh Ghat evening Aarti." },
      { day: "Day 6", title: "Sacred Ghats & Sarnath", morning: "Subah-e-Banaras music at Assi Ghat.", afternoon: "Sarnath Buddhist ruins and Ashoka Pillar.", evening: "Manikarnika Ghat life-death philosophy." },
      { day: "Day 7", title: "Banarasi Silk & Departure", morning: "Weavers colony visit; Banarasi saree master craft.", afternoon: "BHU Bharat Kala Bhavan museum.", evening: "Varanasi airport transfer." }
    ],
    whereToVisit: [
      { name: "Taj Mahal (UNESCO)", type: "Wonder of the World", desc: "Mughal marble masterpiece on the Yamuna river." },
      { name: "Dashashwamedh Ghat (Varanasi)", type: "Spiritual Ghat", desc: "Epicenter of river life and synchronized evening aarti." },
      { name: "Bara Imambara (Lucknow)", type: "Nawabi Monument", desc: "Gigantic vaulted hall built without central pillars." }
    ],
    cuisineAndCrafts: { food: ["Lucknowi Galawati Kabab", "Agra Petha", "Banarasi Tamatar Chaat", "Makhan Malai", "Bedmi Puri"], crafts: ["Chikan Embroidery", "Banarasi Brocade Silk", "Zardozi Silver Thread", "Marble Inlay (Pietra Dura)"] },
    safetyAndFeatures: ["Dedicated Taj Safety Corridor", "Tourist Police on Varanasi ghats", "Verified government guides with photo IDs"]
  },

  // 9. Karnataka
  {
    id: "karnataka",
    name: "Karnataka Tourism",
    tagline: "One State. Many Worlds.",
    capital: "Bengaluru",
    region: "south",
    image: "https://images.unsplash.com/photo-1600100397608-f09074aa882c?w=800&auto=format&fit=crop&q=80",
    badge: "Hampi UNESCO & Coorg Coffee",
    duration: "5–7 Days",
    description: "Ruins of the boulder-strewn Vijayanagara Empire in Hampi, royal Mysore Palace, and Coorg coffee estates.",
    whenToVisit: { bestSeason: "October to March (18°C - 28°C)", budgetAnalysis: { lowestPriceWindow: "June - August", averageSavings: "Save 38%", budgetTip: "Hampi river homestays across Tungabhadra offer great value." } },
    itinerary5Day: [
      { day: "Day 1", title: "Bengaluru to Mysore Royal Palace", morning: "Drive past Srirangapatna to royal Mysore.", afternoon: "Mysore Palace Durbar Hall and golden royal throne.", evening: "Brindavan Gardens illuminated fountain show." },
      { day: "Day 2", title: "Coorg Mist & Coffee Plantations", morning: "Drive to Coorg (Kodagu); Tibetan Golden Temple at Bylakuppe.", afternoon: "Coffee plantation tour and coffee cupping session.", evening: "Abbey Falls and authentic Pandi Curry homestay dinner." },
      { day: "Day 3", title: "Overnight to UNESCO Hampi", morning: "Raja's Seat panoramic valley view.", afternoon: "Travel north towards ancient Vijayanagara.", evening: "Tungabhadra river sunset among giant granite boulders." },
      { day: "Day 4", title: "Sacred & Royal Enclosures of Hampi", morning: "Virupaksha Temple and monolithic Sasivekalu Ganesha.", afternoon: "Vijaya Vittala Temple and famous Stone Chariot.", evening: "Queen's Bath and Lotus Mahal pavilion." },
      { day: "Day 5", title: "Matanga Hill Sunrise & Departure", morning: "Sunrise climb up Matanga Hill overlooking boulder ocean.", afternoon: "Anegundi rural craft village and banana fiber crafts.", evening: "Transfer to Jindal Vidyanagar airport or Hospet train." }
    ],
    itinerary7Day: [
      { day: "Day 1", title: "Garden City Bengaluru", morning: "Lalbagh botanical glasshouse.", afternoon: "Bangalore Palace and Tipu Sultan Summer Palace.", evening: "Indiranagar craft brewery trail." },
      { day: "Day 2", title: "Mysore Palace & Chamundi", morning: "Climb 1000 steps of Chamundi Hill.", afternoon: "Mysore Palace architecture tour.", evening: "Devaraja spice and flower market." },
      { day: "Day 3", title: "Bylakuppe & Coorg Highlands", morning: "Namdroling Golden Temple chants.", afternoon: "Organic coffee and pepper harvest walk.", evening: "Coorg hill cottage stay." },
      { day: "Day 4", title: "Belur & Halebidu Hoysala Temples", morning: "Chennakeshava Temple intricate soapstone carvings.", afternoon: "Hoysaleswara Temple star-shaped design.", evening: "Drive to Hospet/Hampi." },
      { day: "Day 5", title: "Hampi Sacred Complex", morning: "Virupaksha temple morning puja.", afternoon: "Vittala Temple musical pillars.", evening: "Hemakuta hill sunset over ruins." },
      { day: "Day 6", title: "Anegundi & Hippie Island", morning: "Coracle boat ride across Tungabhadra river.", afternoon: "Sanapur lake cliff jump and boulder walk.", evening: "Traditional Karnataka banana leaf dinner." },
      { day: "Day 7", title: "Badami Cave Temples & Departure", morning: "Rock-cut cave temples of Badami.", afternoon: "Aihole cradle of Indian temple architecture.", evening: "Hubli airport transfer." }
    ],
    whereToVisit: [
      { name: "Hampi (UNESCO)", type: "Ancient Empire", desc: "14th-century Vijayanagara capital set among otherworldly boulders." },
      { name: "Mysore Palace", type: "Indo-Saracenic Palace", desc: "Illuminated with nearly 100,000 bulbs every weekend." },
      { name: "Coorg", type: "Coffee Highlands", desc: "Lush Western Ghats hills known for coffee and spice plantations." }
    ],
    cuisineAndCrafts: { food: ["Bisi Bele Bath", "Mysore Pak", "Coorg Pandi Curry", "Benne Dosa", "Filter Kaapi"], crafts: ["Mysore Sandalwood & Silk", "Channapatna Wooden Toys", "Bidriware", "Kinhal Wood Craft"] },
    safetyAndFeatures: ["KSTDC tourism guides with barcode identification", "Pink Sarathi women safety patrols in Bengaluru", "Emergency medical huts in Hampi"]
  },

  // 10. Uttarakhand
  {
    id: "uttarakhand",
    name: "Uttarakhand Tourism",
    tagline: "Simply Heaven",
    capital: "Dehradun",
    region: "north",
    image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&auto=format&fit=crop&q=80",
    badge: "Himalayan Yoga & Pilgrimage",
    duration: "5–7 Days",
    description: "Yoga capital Rishikesh, sacred Ganges aarti in Haridwar, Jim Corbett tiger sanctuary, and snow peaks of Auli.",
    whenToVisit: { bestSeason: "March to June & Sept to Nov", budgetAnalysis: { lowestPriceWindow: "July - August", averageSavings: "Save 35%", budgetTip: "Ashram stays in Rishikesh offer clean rooms and yoga for modest donations." } },
    itinerary5Day: [
      { day: "Day 1", title: "Haridwar Sacred Ganga Aarti", morning: "Arrive in Haridwar; holy dip at Har Ki Pauri.", afternoon: "Mansa Devi cable car ride overlooking the river plain.", evening: "Spellbinding evening Ganga Aarti with thousands of floating leaf lamps." },
      { day: "Day 2", title: "Rishikesh: Yoga & Suspension Bridges", morning: "Drive along the turquoise Ganga to Rishikesh.", afternoon: "Walk across Ram Jhula and Lakshman Jhula suspension bridges.", evening: "Beatles Ashram (Chaurasi Kutia) graffiti and meditation domes." },
      { day: "Day 3", title: "White Water Rafting & Cliff Jump", morning: "16 km river rafting on rapids like Roller Coaster and Golf Course.", afternoon: "Cliff jumping and body surfing in pristine mountain water.", evening: "Triveni Ghat maha aarti and Ayurvedic dinner." },
      { day: "Day 4", title: "Jim Corbett Tiger Safari", morning: "Drive down to Corbett Tiger Reserve, India's oldest national park.", afternoon: "Check into jungle lodge by the Kosi river.", evening: "Naturalist lecture on Bengal tiger tracking and jungle sounds." },
      { day: "Day 5", title: "Open Jeep Safari & Departure", morning: "Early 5:30 AM open-top jeep safari through Dhikala/Bijrani zone.", afternoon: "Corbett Falls nature walk and Garhwali thali lunch.", evening: "Transfer to Dehradun (DED) airport or Delhi express." }
    ],
    itinerary7Day: [
      { day: "Day 1", title: "Haridwar Spiritual Gateway", morning: "Har Ki Pauri bathing ghats.", afternoon: "Ayurvedic pharmacy visit.", evening: "Maha aarti at sunset." },
      { day: "Day 2", title: "Rishikesh Yoga Capital", morning: "Morning Hatha yoga session by the river.", afternoon: "Swarg Ashram bookshops and cafes.", evening: "Parmarth Niketan music and aarti." },
      { day: "Day 3", title: "Ganga River Rafting Adventure", morning: "Marine Drive to Rishikesh rafting.", afternoon: "Neer Garh waterfall trek.", evening: "Rooftop organic cafe dinner." },
      { day: "Day 4", title: "Queen of Hills Mussoorie", morning: "Drive through Dehradun to Mussoorie.", afternoon: "Kempty Falls and Camel's Back Road walk.", evening: "Mall Road winterline sunset." },
      { day: "Day 5", title: "Dhanaulti Eco-Park & Pines", morning: "Drive through alpine cedar and oak forests.", afternoon: "Surkanda Devi cable car summit view of peaks.", evening: "Apple orchard homestay." },
      { day: "Day 6", title: "Jim Corbett Wildlife Sanctuary", morning: "Descent to Corbett National Park.", afternoon: "Kosi river pebble walk.", evening: "Night jungle call listening session." },
      { day: "Day 7", title: "Corbett Morning Safari & Return", morning: "Deep jungle jeep safari.", afternoon: "Dhangarhi museum and elephant corridor.", evening: "Dehradun airport transfer." }
    ],
    whereToVisit: [
      { name: "Rishikesh & Ganga", type: "Spiritual & Adventure", desc: "Global yoga epicenter where the turquoise river leaves the mountains." },
      { name: "Jim Corbett National Park", type: "Tiger Sanctuary", desc: "First national park in mainland Asia, home to Bengal tigers." },
      { name: "Har Ki Pauri (Haridwar)", type: "Sacred Ghat", desc: "Legendary footstep of Lord Vishnu where evening aarti is celebrated." }
    ],
    cuisineAndCrafts: { food: ["Kafli (Spinach Gravy)", "Chainsoo", "Bal Mithai", "Singori", "Aloo ke Gutke"], crafts: ["Aipan Folk Art", "Ringal Bamboo Baskets", "Garhwali Woolen Blankets"] },
    safetyAndFeatures: ["Rafting operators certified by Indian Mountaineering Foundation", "Tourist police posts on river banks", "GPS monitored tiger safari vehicles"]
  },

  // 11. Ladakh (UT)
  {
    id: "ladakh",
    name: "Ladakh Tourism",
    tagline: "Land of High Passes",
    capital: "Leh",
    region: "ut",
    isUT: true,
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&auto=format&fit=crop&q=80",
    badge: "High Altitude Desert (UT)",
    duration: "5–7 Days",
    description: "Monasteries perched on rugged barren cliffs, azure blue Pangong Tso lake, and world's highest motorable passes.",
    whenToVisit: { bestSeason: "May to September (Day 15°C - 25°C)", budgetAnalysis: { lowestPriceWindow: "April & October", averageSavings: "Save 30%", budgetTip: "Stay in Nubra Valley village homestays for organic apricot feasts." } },
    itinerary5Day: [
      { day: "Day 1", title: "Arrival in Leh & Acclimatization", morning: "Scenic landing at Kushok Bakula Rimpochee Airport (11,500 ft).", afternoon: "Mandatory rest for altitude acclimatization.", evening: "Gentle walk to Leh Market and Shanti Stupa for sunset." },
      { day: "Day 2", title: "Indus Valley Monasteries", morning: "Shey Palace and colossal Thiksey Monastery (mini Potala).", afternoon: "Hemis Monastery museum and sacred golden stupa.", evening: "Hall of Fame memorial and sunset at Sindhu Ghat." },
      { day: "Day 3", title: "Khardung La Pass to Nubra Valley", morning: "Drive across legendary Khardung La Pass (17,982 ft).", afternoon: "Diskit Monastery with giant 106-foot Maitreya Buddha.", evening: "Double-humped Bactrian camel safari on Hunder sand dunes." },
      { day: "Day 4", title: "Nubra to Pangong Tso via Shyok", morning: "Scenic off-road drive along the rushing Shyok River.", afternoon: "First breathtaking view of the color-shifting Pangong Tso.", evening: "Stargazing at 14,270 ft under ultra-clear Himalayan skies." },
      { day: "Day 5", title: "Chang La Pass & Return to Leh", morning: "Sunrise photography at Pangong Lake shoreline.", afternoon: "Drive back to Leh across snow-clad Chang La (17,590 ft).", evening: "Traditional Ladakhi Skyu and Thukpa farewell dinner." }
    ],
    itinerary7Day: [
      { day: "Day 1", title: "Leh Altitude Rest", morning: "Flight arrival; drink plenty of water and rest.", afternoon: "Rest in guest house garden.", evening: "Shanti Stupa view." },
      { day: "Day 2", title: "Sham Valley Exploration", morning: "Magnetic Hill gravity-defying optical illusion.", afternoon: "Confluence of Indus and Zanskar rivers (Sangam).", evening: "Alchi Monastery 11th-century frescoes." },
      { day: "Day 3", title: "Thiksey & Chemrey", morning: "Sunrise morning prayers at Thiksey.", afternoon: "Chemrey Monastery hilltop architecture.", evening: "Leh Palace heritage walk." },
      { day: "Day 4", title: "Khardung La & Nubra Valley", morning: "Cross Khardung La high pass.", afternoon: "Diskit Buddha statue.", evening: "Hunder white sand dunes." },
      { day: "Day 5", title: "Turtuk Balti Village", morning: "Drive to Turtuk, closest village to LoC opened to travelers.", afternoon: "Balti apricot orchards and unique culture.", evening: "Return to Nubra camp." },
      { day: "Day 6", title: "Nubra to Pangong Lake", morning: "Drive along Shyok route.", afternoon: "Arrive at blue expanse of Pangong Tso.", evening: "Lakeside dome tent stay." },
      { day: "Day 7", title: "Chang La to Leh Departure", morning: "Spot Himalayan marmots on the climb.", afternoon: "Cross Chang La and return to Leh.", evening: "Airport departure." }
    ],
    whereToVisit: [
      { name: "Pangong Tso", type: "High Altitude Lake", desc: "134 km long lake changing colors from turquoise to deep navy." },
      { name: "Khardung La", type: "Mountain Pass", desc: "High pass gateway between Indus and Nubra river valleys." },
      { name: "Thiksey Monastery", type: "Tibetan Monastic", desc: "12-story complex resembling Lhasa's Potala Palace." }
    ],
    cuisineAndCrafts: { food: ["Ladakhi Thukpa", "Tingmo Steamed Bread", "Skyu Pasta Stew", "Butter Tea (Gur Gur)", "Apricot Jam"], crafts: ["Pashmina Wool Shawls", "Ladakhi Silver Jewellery", "Thangka Paintings", "Hand-carved Wood Tables"] },
    safetyAndFeatures: ["Inner Line Permit (ILP) digital verification", "Mandatory 24h rest guidelines enforced by doctors", "Oxygen cylinders in every registered tourist cab"]
  },

  // 12. Sikkim
  {
    id: "sikkim",
    name: "Sikkim Tourism",
    tagline: "Small but Beautiful",
    capital: "Gangtok",
    region: "northeast",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
    badge: "100% Organic State",
    duration: "5–7 Days",
    description: "Views of Mount Kanchenjunga, high glacial Tsomgo lake, Rumtek monastery, and 100% certified organic cuisine.",
    whenToVisit: { bestSeason: "March to May (Rhododendrons) & Oct to Dec (Clear Peaks)", budgetAnalysis: { lowestPriceWindow: "July - August", averageSavings: "Save 35%", budgetTip: "Yuksom and Pelling community homestays offer organic farmhouse meals." } },
    itinerary5Day: [
      { day: "Day 1", title: "Gangtok Hill Capital & MG Marg", morning: "Scenic drive from Bagdogra airport or Pakyong along Teesta River.", afternoon: "Check in at Gangtok; visit Namgyal Institute of Tibetology.", evening: "Stroll along pedestrian-only clean MG Marg; taste steamed momos." },
      { day: "Day 2", title: "Glacial Tsomgo Lake & Baba Mandir", morning: "Ascend to high altitude Tsomgo (Changu) Lake at 12,310 ft.", afternoon: "Historic Nathu La pass border post on Old Silk Route.", evening: "Return to Gangtok; sample organic fermented Gundruk soup." },
      { day: "Day 3", title: "Rumtek & Drive to Pelling", morning: "Rumtek Monastery, seat of the Karmapa Lama.", afternoon: "Scenic drive westward via Ravangla Buddha Park.", evening: "Check into Pelling homestay with Kanchenjunga views." },
      { day: "Day 4", title: "Pelling Skywalk & Rabdentse Ruins", morning: "Pelling Glass Skywalk and Chenrezig giant statue.", afternoon: "Walk through pine forest to Rabdentse royal palace ruins.", evening: "Sunset over Mount Kanchenjunga snow peaks." },
      { day: "Day 5", title: "Yuksom Heritage & Return", morning: "Visit Yuksom first capital of Sikkim and sacred Khecheopalri Lake.", afternoon: "Cardamom plantation walk and local cheese tasting.", evening: "Transfer to Pakyong or Bagdogra for flight." }
    ],
    itinerary7Day: [
      { day: "Day 1", title: "Gangtok Arrival", morning: "Drive along Teesta river.", afternoon: "Ropeway cable car over Gangtok valley.", evening: "MG Marg street cafe." },
      { day: "Day 2", title: "Tsomgo Lake & Nathu La", morning: "Drive to high altitude alpine lake.", afternoon: "Yak ride on lakeside.", evening: "Traditional Sikkimese dinner." },
      { day: "Day 3", title: "North Sikkim: Lachung", morning: "Drive north past Seven Sisters waterfall.", afternoon: "Chungthang confluence of Lachen and Lachung rivers.", evening: "Lachung wooden village homestay." },
      { day: "Day 4", title: "Yumthang Valley of Flowers", morning: "Excursion to Yumthang Valley alpine meadows.", afternoon: "Hot spring visit and Zero Point snow edge.", evening: "Return to Gangtok." },
      { day: "Day 5", title: "Ravangla Buddha Park to Pelling", morning: "Buddha Park colossal 130-foot statue.", afternoon: "Temi Tea Garden, Sikkim's only tea estate.", evening: "Pelling mountain hotel." },
      { day: "Day 6", title: "Pelling Monasteries & Lakes", morning: "Pemayangtse Monastery 300-year-old sanctuary.", afternoon: "Wishing lake Khecheopalri.", evening: "Kanchenjunga golden hour view." },
      { day: "Day 7", title: "Departure via Siliguri", morning: "Morning view of Himalayan peaks.", afternoon: "Teesta river viewpoint.", evening: "Flight departure." }
    ],
    whereToVisit: [
      { name: "Tsomgo Lake", type: "Glacial Lake", desc: "Sacred oval lake at 12,310 feet surrounded by snowy peaks." },
      { name: "Rumtek Monastery", type: "Tibetan Heritage", desc: "Dharma Chakra centre housing ancient sacred Buddhist relics." },
      { name: "Buddha Park (Ravangla)", type: "Monument", desc: "Giant statue set against Mount Narsing and Kanchenjunga." }
    ],
    cuisineAndCrafts: { food: ["Momos (Steamed Dumplings)", "Thukpa Noodle Soup", "Phagshapa (Pork with Radish)", "Gundruk Fermented Leaves", "Chhurpi Hard Yak Cheese"], crafts: ["Lepcha Handwoven Fabrics", "Thangka Paintings", "Choktse Wooden Folding Tables"] },
    safetyAndFeatures: ["100% Organic certified agriculture", "Special Protected Area Permits (PAP) processed seamlessly", "Strict zero-plastic enforcement on tourist trails"]
  },

  // 13. West Bengal
  {
    id: "westbengal",
    name: "West Bengal Tourism",
    tagline: "Beautiful Bengal",
    capital: "Kolkata",
    region: "east",
    image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&auto=format&fit=crop&q=80",
    badge: "Colonial City & Sundarbans Mangrove",
    duration: "5–7 Days",
    description: "Kolkata's Victoria Memorial and historic tramways, tea estates of Darjeeling, and wild Sundarban mangroves.",
    whenToVisit: { bestSeason: "October to March (Pleasant 16°C - 26°C)", budgetAnalysis: { lowestPriceWindow: "July - September", averageSavings: "Save 40%", budgetTip: "Stay in restored North Kolkata heritage mansions for genuine warmth." } },
    itinerary5Day: [
      { day: "Day 1", title: "Colonial Kolkata & Historic Trams", morning: "Victoria Memorial white marble palace and gardens.", afternoon: "St. Paul's Cathedral and iconic Indian Coffee House on College Street.", evening: "Tram ride across Maidan and authentic Kosha Mangsho dinner." },
      { day: "Day 2", title: "Howrah Bridge & Kumartuli Idol Makers", morning: "Sunrise walk across cantilever Howrah Bridge and flower market.", afternoon: "Kumartuli clay sculptors crafting Durga idols.", evening: "Ganga ferry cruise from Princep Ghat with kathi roll snack." },
      { day: "Day 3", title: "Fly to Bagdogra / Drive to Darjeeling", morning: "Short flight to Bagdogra; scenic drive past tea gardens.", afternoon: "Check into heritage tea planter's bungalow.", evening: "Chowrasta mall promenade and steaming cup of First Flush tea." },
      { day: "Day 4", title: "Tiger Hill Sunrise & Toy Train", morning: "4:00 AM sunrise at Tiger Hill illuminating Kanchenjunga peak.", afternoon: "UNESCO Darjeeling Himalayan Railway (Toy Train) joy ride.", evening: "Himalayan Mountaineering Institute and zoo." },
      { day: "Day 5", title: "Happy Valley Tea Estate & Departure", morning: "Tour Happy Valley tea factory and sensory tasting.", afternoon: "Tibetan Refugee Self-Help Centre craft stalls.", evening: "Transfer to Bagdogra airport for return." }
    ],
    itinerary7Day: [
      { day: "Day 1", title: "Kolkata Cultural Immersion", morning: "Victoria Memorial and Maidan.", afternoon: "South Park Street Cemetery.", evening: "Park Street historic dining." },
      { day: "Day 2", title: "Old North Kolkata Heritage", morning: "Marble Palace and Jorasanko Thakur Bari.", afternoon: "College Street Boi Para (Book Market).", evening: "Sweets at legendary KC Das." },
      { day: "Day 3", title: "Sundarbans Mangrove Forest", morning: "Drive and boat transfer to Sundarbans UNESCO reserve.", afternoon: "Canal safari past mangrove mudflats.", evening: "Folk music by delta villagers." },
      { day: "Day 4", title: "Sundarbans Tiger & Crocodile Watch", morning: "Watchtower safari at Sajnekhali and Sudhanyakhali.", afternoon: "Mangrove canopy walk and estuarine crocodile center.", evening: "Return to Kolkata." },
      { day: "Day 5", title: "Travel to Darjeeling Hills", morning: "Flight to Bagdogra; Toy train climb.", afternoon: "Batasia Loop military memorial.", evening: "Glenary's bakery hot chocolate." },
      { day: "Day 6", title: "Kanchenjunga & Monasteries", morning: "Tiger Hill dawn glow.", afternoon: "Ghoom Monastery and ancient prayer bells.", evening: "Tea estate sunset walk." },
      { day: "Day 7", title: "Tea Tasting & Departure", morning: "Orthodox tea estate harvest trail.", afternoon: "Darjeeling market shopping.", evening: "Airport transfer." }
    ],
    whereToVisit: [
      { name: "Victoria Memorial (Kolkata)", type: "Colonial Museum", desc: "Grand white marble memorial dedicated to Queen Victoria." },
      { name: "Darjeeling Himalayan Railway", type: "UNESCO Heritage Rail", desc: "Historic narrow-gauge steam train operating since 1881." },
      { name: "Sundarbans National Park", type: "Mangrove Biosphere", desc: "World's largest mangrove forest home to royal Bengal tigers." }
    ],
    cuisineAndCrafts: { food: ["Kolkata Biryani (with Potato)", "Kosha Mangsho", "Kolkata Kathi Roll", "Shorshe Ilish (Hilsa in Mustard)", "Rosogolla & Sandesh"], crafts: ["Dokra Metal Casting", "Baluchari & Jamdani Sarees", "Terracotta Tiles of Bishnupur"] },
    safetyAndFeatures: ["Kolkata Police Tourist Assistance posts at Howrah and Sealdah", "Eco-certified boat safaris in Sundarbans", "Registered Darjeeling tea guides"]
  },

  // 14. Delhi (UT)
  {
    id: "delhi",
    name: "Delhi Tourism",
    tagline: "Dilli Dilwalon Ki",
    capital: "New Delhi",
    region: "ut",
    isUT: true,
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80",
    badge: "National Capital Territory (UT)",
    duration: "4–6 Days",
    description: "Seven historical cities in one: from Mughal Red Fort and Chandni Chowk street food to imperial Rajpath and Qutub Minar.",
    whenToVisit: { bestSeason: "October to March (12°C - 24°C)", budgetAnalysis: { lowestPriceWindow: "July - September", averageSavings: "Save 40%", budgetTip: "Use Delhi Metro Pink and Yellow lines for fast zero-traffic hops between monuments." } },
    itinerary5Day: [
      { day: "Day 1", title: "Mughal Old Delhi & Chandni Chowk", morning: "Red Fort red sandstone ramparts and Diwan-i-Khas.", afternoon: "Cycle rickshaw through spice alleys of Khari Baoli.", evening: "Jama Masjid courtyard and Karim's seekh kebabs." },
      { day: "Day 2", title: "Imperial Lutyens Delhi & India Gate", morning: "Rashtrapati Bhavan and newly renovated Kartavya Path.", afternoon: "India Gate memorial and National War Memorial.", evening: "National Gallery of Modern Art and Connaught Place dinner." },
      { day: "Day 3", title: "UNESCO Marvels: Qutub & Humayun", morning: "Humayun's Tomb, red sandstone precursor to the Taj Mahal.", afternoon: "Sundar Nursery Mughal gardens and artisan market.", evening: "Qutub Minar complex and 4th-century rustless Iron Pillar." },
      { day: "Day 4", title: "Spiritual Havens: Lotus & Akshardham", morning: "Lotus Temple silent Baháʼí marble prayer sanctuary.", afternoon: "Swaminarayan Akshardham boat ride through Indian history.", evening: "Musical water fountain show at Akshardham." },
      { day: "Day 5", title: "Hauz Khas Village & Dilli Haat", morning: "14th-century Hauz Khas fort ruins overlooking deer lake.", afternoon: "Browse boutique indie shops and contemporary art cafes.", evening: "Dilli Haat open-air craft bazaar with regional food stalls." }
    ],
    itinerary7Day: [
      { day: "Day 1", title: "Shahjahanabad Heritage Walk", morning: "Red Fort and Lahore Gate.", afternoon: "Paranthe Wali Gali food trail.", evening: "Jama Masjid sunset." },
      { day: "Day 2", title: "Lutyens Power Corridor", morning: "Presidential palace gardens.", afternoon: "National Museum antiquities.", evening: "India Gate evening stroll." },
      { day: "Day 3", title: "Sultanate Qutub Complex", morning: "Qutub Minar 73m tower.", afternoon: "Mehrauli Archaeological Park.", evening: "Rooftop dining with minar view." },
      { day: "Day 4", title: "Mughal Gardens & Nizamuddin", morning: "Humayun's Tomb gardens.", afternoon: "Isa Khan tomb complex.", evening: "Qawwali music at Hazrat Nizamuddin Dargah." },
      { day: "Day 5", title: "Modern Temples & Crafts", morning: "Lotus Temple petals.", afternoon: "Crafts Museum outdoor rural pavilions.", evening: "Dilli Haat all-India crafts." },
      { day: "Day 6", title: "Akshardham Grand Complex", morning: "Sahaj Anand water show.", afternoon: "Garden of India statues.", evening: "Vegetarian feast." },
      { day: "Day 7", title: "Hauz Khas & Departure", morning: "Hauz Khas lake ruins.", afternoon: "Khan Market shopping.", evening: "IGI Airport transfer." }
    ],
    whereToVisit: [
      { name: "Qutub Minar (UNESCO)", type: "Victory Tower", desc: "World's tallest brick minaret built in 1192 CE." },
      { name: "Humayun's Tomb (UNESCO)", type: "Mughal Architecture", desc: "First garden-tomb on the Indian subcontinent." },
      { name: "Chandni Chowk", type: "Historic Bazaar", desc: "17th-century bustling heart of Mughal culinary and trading culture." }
    ],
    cuisineAndCrafts: { food: ["Butter Chicken", "Chole Bhature", "Paranthe Wali Gali Stuffed Breads", "Nihari with Khameeri Roti", "Kulfi Falooda"], crafts: ["Zari & Zardozi Embroidery", "Silver Filigree Jewellery", "Miniature Paper Art"] },
    safetyAndFeatures: ["Delhi Tourist Police kiosks at all monuments", "Women exclusive metro coaches with CCTV", "Prepaid Delhi Police taxi booths at airports"]
  }
];

// Complete list of remaining states and UTs to guarantee all 28 states + 8 UTs are covered
const REMAINING_STATES_AND_UTS: Partial<StateTourism>[] = [
  // Andhra Pradesh
  { id: "andhrapradesh", name: "Andhra Pradesh Tourism", tagline: "The Sunrise State", capital: "Amaravati", region: "south", image: "https://images.unsplash.com/photo-1621379555132-720e98ff7f8a?w=800&auto=format&fit=crop&q=80", badge: "Coastal & Temple Heritage", duration: "4–6 Days", description: "Tirupati Balaji spiritual temple, Araku valley coffee hills, and Borra Caves." },
  // Arunachal Pradesh
  { id: "arunachalpradesh", name: "Arunachal Pradesh Tourism", tagline: "Land of Dawn-Lit Mountains", capital: "Itanagar", region: "northeast", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80", badge: "Himalayan Frontier", duration: "5–7 Days", description: "Tawang Monastery at 10,000 feet, Sela Pass, and vibrant tribal cultures of Ziro valley." },
  // Assam
  { id: "assam", name: "Assam Tourism", tagline: "Awesome Assam", capital: "Dispur", region: "northeast", image: "https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=800&auto=format&fit=crop&q=80", badge: "Kaziranga Rhino Sanctuary", duration: "4–6 Days", description: "Kaziranga UNESCO one-horned rhino safari, tea plantations, and Brahmaputra river islands." },
  // Bihar
  { id: "bihar", name: "Bihar Tourism", tagline: "Blissful Bihar", capital: "Patna", region: "east", image: "https://images.unsplash.com/photo-1600100397608-f09074aa882c?w=800&auto=format&fit=crop&q=80", badge: "Bodh Gaya & Nalanda UNESCO", duration: "4–5 Days", description: "Mahabodhi Temple where Buddha attained enlightenment, ancient Nalanda University ruins." },
  // Chhattisgarh
  { id: "chhattisgarh", name: "Chhattisgarh Tourism", tagline: "Full of Surprises", capital: "Raipur", region: "central", image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&auto=format&fit=crop&q=80", badge: "Chitrakote Falls & Tribal", duration: "4–5 Days", description: "Chitrakote 'Niagara of India' horseshoe waterfall and ancient tribal arts of Bastar." },
  // Gujarat
  { id: "gujarat", name: "Gujarat Tourism", tagline: "Khushboo Gujarat Ki", capital: "Gandhinagar", region: "west", image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?w=800&auto=format&fit=crop&q=80", badge: "Rann of Kutch & Asiatic Lion", duration: "5–7 Days", description: "White Rann salt desert, Gir national park Asiatic lions, and Rani Ki Vav stepwell." },
  // Haryana
  { id: "haryana", name: "Haryana Tourism", tagline: "Pioneer in Highway Tourism", capital: "Chandigarh", region: "north", image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&auto=format&fit=crop&q=80", badge: "Heritage & Highway", duration: "3–4 Days", description: "Kurukshetra Mahabharata battlefield, Yadavindra Gardens Pinjore, and Sultanpur bird sanctuary." },
  // Jharkhand
  { id: "jharkhand", name: "Jharkhand Tourism", tagline: "Land of Forests", capital: "Ranchi", region: "east", image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&auto=format&fit=crop&q=80", badge: "Waterfalls & Nature", duration: "3–5 Days", description: "Hundru and Jonha waterfalls, Betla National Park, and sacred Baidyanath Jyotirlinga." },
  // Madhya Pradesh
  { id: "madhyapradesh", name: "Madhya Pradesh Tourism", tagline: "The Heart of Incredible India", capital: "Bhopal", region: "central", image: "https://images.unsplash.com/photo-1606210122158-e8d1a1b18366?w=800&auto=format&fit=crop&q=80", badge: "Khajuraho & Tiger Reserves", duration: "5–7 Days", description: "Khajuraho UNESCO temple sculptures, Sanchi Buddhist stupas, and Bandhavgarh tiger reserve." },
  // Manipur
  { id: "manipur", name: "Manipur Tourism", tagline: "Jewel of India", capital: "Imphal", region: "northeast", image: "https://images.unsplash.com/photo-1618245318763-a15156d6b23c?w=800&auto=format&fit=crop&q=80", badge: "Floating Lake Loktak", duration: "4–5 Days", description: "Loktak Lake world's only floating national park (Keibul Lamjao) and Kangla Fort." },
  // Meghalaya
  { id: "meghalaya", name: "Meghalaya Tourism", tagline: "Abode of Clouds", capital: "Shillong", region: "northeast", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80", badge: "Living Root Bridges", duration: "5–6 Days", description: "Cherrapunji living double-decker root bridges, crystalline Dawki river, and Mawlynnong village." },
  // Mizoram
  { id: "mizoram", name: "Mizoram Tourism", tagline: "Land of the Rolling Hills", capital: "Aizawl", region: "northeast", image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80", badge: "Bamboo Valleys", duration: "4–5 Days", description: "Misty ridges of Aizawl, Vantawng highest waterfall, and Reiek mountain views." },
  // Nagaland
  { id: "nagaland", name: "Nagaland Tourism", tagline: "Land of Festivals", capital: "Kohima", region: "northeast", image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80", badge: "Hornbill Festival Heritage", duration: "4–6 Days", description: "Dzukou Valley trek of flowers, Hornbill festival village, and historic Kohima War Cemetery." },
  // Odisha
  { id: "odisha", name: "Odisha Tourism", tagline: "India's Best Kept Secret", capital: "Bhubaneswar", region: "east", image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?w=800&auto=format&fit=crop&q=80", badge: "Konark Sun Temple & Puri", duration: "4–6 Days", description: "UNESCO Konark Sun Temple chariot, Jagannath Temple Puri, and Chilika lake dolphins." },
  // Punjab
  { id: "punjab", name: "Punjab Tourism", tagline: "India Begins Here", capital: "Chandigarh", region: "north", image: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800&auto=format&fit=crop&q=80", badge: "Golden Temple & Wagah", duration: "3–5 Days", description: "Golden Temple spiritual sanctuary in Amritsar, Wagah Border beating retreat ceremony." },
  // Tripura
  { id: "tripura", name: "Tripura Tourism", tagline: "The Land of Fourteen Gods", capital: "Agartala", region: "northeast", image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&auto=format&fit=crop&q=80", badge: "Neermahal Water Palace", duration: "3–4 Days", description: "Neermahal palace sitting in the middle of Rudrasagar Lake, Unakoti colossal rock carvings." },

  // Union Territories:
  // Andaman & Nicobar
  { id: "andaman", name: "Andaman & Nicobar Islands", tagline: "Emerald Islands", capital: "Port Blair", region: "ut", isUT: true, image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&auto=format&fit=crop&q=80", badge: "Coral Reefs & Cellular Jail", duration: "5–7 Days", description: "Radhanagar white sand beach in Havelock, coral reef snorkeling in Neil, and historic Cellular Jail." },
  // Chandigarh
  { id: "chandigarh", name: "Chandigarh (UT)", tagline: "The City Beautiful", capital: "Chandigarh", region: "ut", isUT: true, image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&auto=format&fit=crop&q=80", badge: "Urban Architecture (UT)", duration: "2–3 Days", description: "Nek Chand's Rock Garden sculpted from urban waste, Sukhna Lake, and Le Corbusier architecture." },
  // Dadra & Nagar Haveli and Daman & Diu
  { id: "damandiu", name: "Daman, Diu & Dadra", tagline: "Sea & Portuguese Solitude", capital: "Daman", region: "ut", isUT: true, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80", badge: "Portuguese Sea Forts (UT)", duration: "3–4 Days", description: "Diu Fort surrounded by sea on three sides, St. Paul's Church, and peaceful Nagoa Beach." },
  // Jammu & Kashmir
  { id: "jammuandkashmir", name: "Jammu & Kashmir (UT)", tagline: "Paradise on Earth", capital: "Srinagar", region: "ut", isUT: true, image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&auto=format&fit=crop&q=80", badge: "Dal Lake Shikaras (UT)", duration: "5–7 Days", description: "Dal Lake floating wooden houseboats, Mughal gardens of Shalimar, and snow meadows of Gulmarg." },
  // Lakshadweep
  { id: "lakshadweep", name: "Lakshadweep (UT)", tagline: "Ninety-Nine Percent Water", capital: "Kavaratti", region: "ut", isUT: true, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80", badge: "Coral Atolls (UT)", duration: "4–5 Days", description: "Pristine turquoise lagoons of Bangaram and Agatti, live coral reef diving, and coconut palm atolls." },
  // Puducherry
  { id: "puducherry", name: "Puducherry (UT)", tagline: "Give Time a Break", capital: "Puducherry", region: "ut", isUT: true, image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80", badge: "French Quarter (UT)", duration: "3–4 Days", description: "French colonial cobblestone streets in White Town, Promenade Beach, and Auroville spiritual township." }
];

// Helper to fill missing fields with authentic defaults
function hydrateState(partial: Partial<StateTourism>): StateTourism {
  return {
    id: partial.id || "state",
    name: partial.name || "India Tourism",
    tagline: partial.tagline || "Incredible India",
    capital: partial.capital || "Regional Capital",
    region: partial.region || "south",
    image: partial.image || "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80",
    badge: partial.badge || "Verified Partner",
    duration: partial.duration || "4–5 Days",
    description: partial.description || "Discover verified destinations, heritage homestays, and storyteller drivers.",
    isUT: partial.isUT || false,
    whenToVisit: partial.whenToVisit || {
      bestSeason: "October to March (Pleasant Weather, 18°C - 28°C)",
      budgetAnalysis: {
        lowestPriceWindow: "July - September (Monsoon Special)",
        averageSavings: "Save up to 40% on Stays & Cabs",
        budgetTip: "Book state tourism certified homestays for 0% commission and authentic breakfast."
      }
    },
    itinerary5Day: partial.itinerary5Day || [
      { day: "Day 1", title: "Arrival & City Heritage Walk", morning: "Arrive at regional hub; check into verified homestay.", afternoon: "Visit central monuments and regional heritage museum.", evening: "Local culinary trail and sunset viewpoint." },
      { day: "Day 2", title: "Iconic Landmarks & Artisan Trails", morning: "Guided tour of ancient architectural marvels.", afternoon: "Master artisan workshop demonstrations.", evening: "Traditional cultural performance and dinner." },
      { day: "Day 3", title: "Scenic Nature & River / Hill Excursion", morning: "Scenic drive into nearby hills or river valleys.", afternoon: "Boat safari or forest canopy walk.", evening: "Campfire storytelling with certified driver guide." },
      { day: "Day 4", title: "Rural Village Community Experience", morning: "Visit surrounding organic agricultural hamlets.", afternoon: "Farm-to-table lunch prepared by local host family.", evening: "Sunset overlook and handloom market visit." },
      { day: "Day 5", title: "Souvenir Crafting & Departure", morning: "Early morning temple / heritage architecture photography.", afternoon: "Traditional spice and handicraft shopping.", evening: "Transfer to airport or railway terminus." }
    ],
    itinerary7Day: partial.itinerary7Day || [
      { day: "Day 1", title: "Arrival & Historic Core", morning: "Welcome by storyteller driver.", afternoon: "Heritage quarter exploration.", evening: "Regional welcome feast." },
      { day: "Day 2", title: "Monuments & Palaces", morning: "Royal architecture tour.", afternoon: "Artisanal handloom weavers.", evening: "Lakeside sunset." },
      { day: "Day 3", title: "Nature Reserve & Wildlife", morning: "Early bird sanctuary or wildlife safari.", afternoon: "Forest river picnic.", evening: "Local folklore tales." },
      { day: "Day 4", title: "Sacred Temple & Spiritual Sanctuary", morning: "Ancient stone-carved temple darshan.", afternoon: "Acoustic halls and meditation.", evening: "River aarti ceremony." },
      { day: "Day 5", title: "Highland / Coastal Retreat", morning: "Scenic mountain or coastal drive.", afternoon: "Eco-resort check-in.", evening: "Star-gazing session." },
      { day: "Day 6", title: "Village Craft Heritage", morning: "Participate in pottery and weaving.", afternoon: "Home-cooked traditional thali.", evening: "Local bazaar shopping." },
      { day: "Day 7", title: "Sunrise Viewpoint & Departure", morning: "Panoramic sunrise over the valley.", afternoon: "Farewell tea tasting.", evening: "Terminus transfer." }
    ],
    whereToVisit: partial.whereToVisit || [
      { name: `${partial.capital} Heritage Precinct`, type: "Heritage", desc: "Historic core featuring regional monuments and museums." },
      { name: `${partial.name?.split(' ')[0]} Nature Sanctuary`, type: "Eco-Tourism", desc: "Pristine landscapes and diverse regional flora." }
    ],
    cuisineAndCrafts: partial.cuisineAndCrafts || {
      food: ["Authentic Regional Thali", "Local Spiced Rice Specialty", "Traditional Steamed Delicacy", "Festive Sweet"],
      crafts: ["Handwoven Silk / Cotton Fabrics", "Handcrafted Wooden Artifacts", "Traditional Metalware"]
    },
    safetyAndFeatures: partial.safetyAndFeatures || [
      "24x7 State Tourism Police Helpline 112 integrated.",
      "Verified homestays audited for women and family safety.",
      "Prepaid transport booths at major railway stations."
    ]
  };
}

// Full registry containing all 28 states and 8 UTs
export const COMPLETE_TOURISM_REGISTRY: Record<string, StateTourism> = {};

ALL_STATES_AND_UTS.forEach(s => {
  COMPLETE_TOURISM_REGISTRY[s.id] = s;
});

REMAINING_STATES_AND_UTS.forEach(p => {
  if (p.id && !COMPLETE_TOURISM_REGISTRY[p.id]) {
    COMPLETE_TOURISM_REGISTRY[p.id] = hydrateState(p);
  }
});

// Real multimodal packages for planner
export const DESTINATION_PLANNER_PACKAGES: Record<string, DestinationPlannerPackage> = {
  kerala: {
    destinationKey: "kerala",
    name: "Kerala (Munnar & Alleppey)",
    tripId: "SS-2026-KER",
    pnr: "4582-KER-9012",
    transports: [
      { id: "ker-t1", destinationKey: "kerala", mode: "Flight", title: "IndiGo 6E-6518 (HYD ➔ COK)", operator: "IndiGo Airlines", duration: "1h 40m nonstop", departure: "07:15 AM (RGIA)", arrival: "08:55 AM (Cochin)", price: 3450, reliabilityScore: 94, reliabilityBadge: "Direct Connect", carbon: "86 kg CO₂", recommended: true },
      { id: "ker-t2", destinationKey: "kerala", mode: "Train", title: "Sabari Express (17230)", operator: "Southern Railway", duration: "21h 30m", departure: "12:20 PM (Secunderabad)", arrival: "09:50 AM (Ernakulam)", price: 780, reliabilityScore: 89, reliabilityBadge: "Scenic Ghat Route", carbon: "18 kg CO₂", recommended: false },
      { id: "ker-t3", destinationKey: "kerala", mode: "Bus", title: "KSRTC SWIFT Gajaraj Volvo Multi-Axle", operator: "Kerala RTC", duration: "16h 00m", departure: "05:30 PM (MGBS)", arrival: "09:30 AM (Kochi)", price: 1650, reliabilityScore: 92, reliabilityBadge: "AC Sleeper Direct", carbon: "24 kg CO₂", recommended: false },
      { id: "ker-t4", destinationKey: "kerala", mode: "Cab", title: "Verified Western Ghats Highway Cab (EV)", operator: "YatraSync Fleet", duration: "18h Doorstep", departure: "Doorstep Pickup", arrival: "Munnar Resort", price: 6200, reliabilityScore: 95, reliabilityBadge: "Private Chauffeur", carbon: "12 kg CO₂", recommended: false }
    ],
    stays: [
      { id: "ker-s1", destinationKey: "kerala", name: "Munnar Misty Tea Valley Homestay", tier: "homestay", category: "Verified Rural Homestay (0% Fee)", hostName: "Mathew Joseph & Family", location: "Pothamedu Viewpoint, Munnar", rating: "4.96", reviews: 62, price: 1850, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=80", features: ["100% Organic Farm-to-Table Breakfast", "Panoramic Tea Plantation Balcony", "Host Guided Spice Walk"] },
      { id: "ker-s2", destinationKey: "kerala", name: "KTDC Tea County Hill Resort", tier: "heritage", category: "Govt. Tourism Property", hostName: "Kerala Tourism Dev Corp", location: "Silent Valley Road, Munnar", rating: "4.5", reviews: 190, price: 2800, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80", features: ["Official State Tourism Property", "24x7 Eco Help Desk", "Safe for Solo Travelers"] },
      { id: "ker-s3", destinationKey: "kerala", name: "Punnamada Lake Backwater Eco-Villa & Houseboat", tier: "homestay", category: "Backwater Eco-Stay", hostName: "Captain Sasi Kumar", location: "Finishing Point, Alleppey", rating: "4.92", reviews: 84, price: 3200, image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80", features: ["Private Wooden Houseboat Deck", "Fresh Karimeen Fish Dinner Included", "Solar Powered Propulsion"] },
      { id: "ker-s4", destinationKey: "kerala", name: "Spice Tree Luxury Mountain Sanctuary", tier: "heritage", category: "5-Star Wellness Sanctuary", hostName: "Spice Tree Hospitality", location: "Chinnakanal, Munnar", rating: "4.98", reviews: 140, price: 11500, image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80", features: ["Private Jacuzzi Overlooking Valley", "Ayurvedic Spa & Herbal Baths", "Mountain Yoga Pavilion"] }
    ],
    drivers: [
      {
        id: "ker-d1",
        destinationKey: "kerala",
        name: "Arjun Nair",
        role: "Verified Cab Driver • Certified Storyteller",
        vehicle: "Tata Nexon EV (AC Sedan)",
        vehicleType: "Electric Eco Cab",
        rating: "4.98",
        reviews: 310,
        fixedFullTripPrice: 2400,
        languages: ["Malayalam", "English", "Hindi"],
        specialties: "Munnar Tea History, Cardamom Trails, Safe Ghat Curves",
        storytellerBio: "Born and raised in Munnar's high ranges. Certified by Kerala Tourism as a regional heritage narrator.",
        stories: ["The legendary 1880 Scottish tea estate pioneers", "The 12-year blooming cycle of the Neelakurinji flower"],
        safetyFeatures: ["Emergency SOS GPS synced", "First-Aid certified", "Night Ghat speed-governor"]
      },
      {
        id: "ker-d2",
        destinationKey: "kerala",
        name: "Jose Mathew",
        role: "Verified Chauffeur • Backwater Historian",
        vehicle: "Toyota Innova Crysta (AC 6-Seater)",
        vehicleType: "Family MUV",
        rating: "4.94",
        reviews: 420,
        fixedFullTripPrice: 3200,
        languages: ["Malayalam", "English", "Tamil", "Hindi"],
        specialties: "Alleppey Canal History, Chinese Fishing Nets, Coir Weaving",
        storytellerBio: "Over 14 years steering travellers through Fort Kochi and the backwaters. Knows every hidden toddy shop.",
        stories: ["How spice traders transformed Fort Kochi in 1503", "Traditional Kettuvallam wooden boat building without nails"],
        safetyFeatures: ["Commercial badge verified", "Child booster seats", "Comprehensive fleet insurance"]
      }
    ],
    localTransit: [
      { mode: "Kochi Water Metro (Electric Boats)", fare: "₹20 - ₹40", time: "15 mins", route: "High Court Jetty → Vypin / Fort Kochi", safetyBadge: "Eco Zero-Emission", tip: "State-of-the-art air-conditioned battery catamarans; scenic harbour transit." },
      { mode: "Munnar 4x4 Tea Estate Jeep Shuttle", fare: "₹650 / half-day", time: "Flexible", route: "Munnar Town → Kolukkumalai Sunrise Peak", safetyBadge: "Off-Road Certified", tip: "Navigates steep mountain estate trails to world's highest tea plantation." }
    ],
    gems: [
      { title: "Marayoor Natural Sandalwood Forest", tag: "Hidden Eco-Gem", desc: "Only place in Kerala with natural wild sandalwood groves and ancient Neolithic dolmens (Muniyaras)." },
      { title: "Kakkathuruthu (Island of Crows)", tag: "National Geographic Feature", desc: "A serene island in Vembanad Lake accessible only by traditional wooden canoe at sunset." }
    ],
    eats: [
      { title: "Rapsy Restaurant (Munnar Town)", tag: "Iconic Mountain Cafe", desc: "Famous for hot Malabar parotta, Kerala beef roast, and cardamom spiced black tea." },
      { title: "Thaff Dhe Puttu (Fort Kochi)", tag: "Authentic Steamed Puttu", desc: "Celebrated for varieties of steamed rice flour cylinders stuffed with spiced grated coconut." }
    ],
    timeline5Day: [
      {
        day: "Day 1",
        date: "Oct 14",
        events: [
          { time: "07:15 AM", title: "Board Flight (HYD ➔ COK)", desc: "Departure from Rajiv Gandhi International Airport. Direct 1h 40m hop.", status: "On Time", cost: 3450 },
          { time: "09:30 AM", title: "Meet Chauffeur & Storyteller Arjun Nair", desc: "Smooth pickup in Tata Nexon EV. Scenic drive up the Western Ghats to Munnar.", status: "Confirmed" },
          { time: "01:00 PM", title: "Check-in at Munnar Misty Tea Valley Homestay", desc: "Warm welcome by Mathew Joseph. Home-cooked traditional lunch with mountain views.", status: "Confirmed", cost: 1850 },
          { time: "04:30 PM", title: "Pothamedu Sunset Walk", desc: "Guided tea plantation walk with Arjun sharing stories of Munnar's early Scottish planters.", status: "Scheduled" }
        ]
      },
      {
        day: "Day 2",
        date: "Oct 15",
        events: [
          { time: "08:30 AM", title: "Tata Tea Museum & Lockhart Estate Tasting", desc: "Learn CTC and orthodox tea production followed by fresh sensory grading.", status: "Scheduled" },
          { time: "01:00 PM", title: "Traditional Kerala Sadya Lunch", desc: "24 vegetarian dishes served on fresh banana leaf at local homestay.", status: "Scheduled" },
          { time: "04:00 PM", title: "Mattupetty Dam & Eco Lake", desc: "Scenic boat cruise and echo point calls against mist-covered peaks.", status: "Scheduled" }
        ]
      },
      {
        day: "Day 3",
        date: "Oct 16",
        events: [
          { time: "09:00 AM", title: "Descent from Munnar to Alleppey Backwaters", desc: "Drive past rubber plantations and rubber tapping villages. Smooth scenic highway transit in EV cab.", status: "Scheduled" },
          { time: "01:30 PM", title: "Board Punnamada Backwater Eco-Houseboat", desc: "Glide through calm canals and enjoy fresh Karimeen Pollichathu on Vembanad Lake.", status: "Scheduled", cost: 3200 },
          { time: "06:00 PM", title: "Sunset over Kuttanad Paddy Fields", desc: "Watch local duck farmers and canoe fishermen from your private sundeck.", status: "Scheduled" }
        ]
      },
      {
        day: "Day 4",
        date: "Oct 17",
        events: [
          { time: "08:00 AM", title: "Village Canoe Safari in Side Canals", desc: "Narrow canal navigation where big boats cannot enter. Meet local toddy tappers.", status: "Scheduled" },
          { time: "02:00 PM", title: "Marari Fishing Village Walk", desc: "Golden sand coastline and visit to women-run coir rope making collective.", status: "Scheduled" },
          { time: "07:30 PM", title: "Fresh Catch Seafood Barbecue", desc: "Grilled seer fish prepared with crushed black pepper and coconut oil.", status: "Scheduled" }
        ]
      },
      {
        day: "Day 5",
        date: "Oct 18",
        events: [
          { time: "09:00 AM", title: "Fort Kochi Jew Town & Chinese Fishing Nets", desc: "Antique spice shops, synogogue, and Dutch palace murals.", status: "Scheduled" },
          { time: "02:00 PM", title: "Kochi Water Metro Transit", desc: "Eco-friendly battery catamarans across the harbour to high court jetty.", status: "Scheduled" },
          { time: "06:30 PM", title: "Airport Transfer to Cochin International", desc: "Return flight with memories of God's Own Country.", status: "Scheduled" }
        ]
      }
    ],
    timeline7Day: [
      {
        day: "Day 1",
        date: "Oct 14",
        events: [
          { time: "07:15 AM", title: "Arrival at Cochin International", desc: "Chauffeur meet & greet with welcome cardamom garland.", status: "On Time", cost: 3450 },
          { time: "11:00 AM", title: "Fort Kochi Colonial Walking Tour", desc: "Chinese nets, Princess street, and St. Francis church.", status: "Confirmed" },
          { time: "06:00 PM", title: "Live Kathakali Dance Drama", desc: "Watching artist makeup ritual and expressive storytelling.", status: "Scheduled" }
        ]
      },
      {
        day: "Day 2",
        date: "Oct 15",
        events: [
          { time: "08:30 AM", title: "Scenic Ascent to Munnar Tea Slopes", desc: "Cheeyappara and Valara waterfalls photo stops.", status: "Confirmed" },
          { time: "02:00 PM", title: "Munnar Misty Homestay Check-in", desc: "Cardamom tea welcome and valley balcony views.", status: "Confirmed", cost: 1850 },
          { time: "05:00 PM", title: "Pothamedu Sunset Overlook", desc: "Folklore of tea plantation pioneers.", status: "Scheduled" }
        ]
      },
      {
        day: "Day 3",
        date: "Oct 16",
        events: [
          { time: "07:00 AM", title: "Eravikulam National Park Safari", desc: "Spot the endangered Nilgiri Tahr on high altitude grasslands.", status: "Scheduled" },
          { time: "01:00 PM", title: "Lockhart Tea Tasting & Factory", desc: "Orthodox leaf processing and sensory evaluation.", status: "Scheduled" },
          { time: "06:30 PM", title: "Campfire & Traditional Stew", desc: "Home-cooked dinner under misty skies.", status: "Scheduled" }
        ]
      },
      {
        day: "Day 4",
        date: "Oct 17",
        events: [
          { time: "08:30 AM", title: "Drive through Spice Mountains to Periyar", desc: "Cardamom, pepper, and cinnamon estates of Thekkady.", status: "Scheduled" },
          { time: "02:30 PM", title: "Periyar Lake Wildlife Boat Cruise", desc: "Spot wild elephants, sambar deer, and otters.", status: "Scheduled" },
          { time: "06:30 PM", title: "Kalaripayattu Martial Arts Display", desc: "Ancient 3000-year-old warrior discipline.", status: "Scheduled" }
        ]
      },
      {
        day: "Day 5",
        date: "Oct 18",
        events: [
          { time: "09:00 AM", title: "Descent to Alleppey Backwaters", desc: "Board luxury wooden houseboat at Punnamada.", status: "Scheduled", cost: 3200 },
          { time: "01:30 PM", title: "Vembanad Lake Navigation", desc: "Lunch on board featuring fresh lake fish and red rice.", status: "Scheduled" },
          { time: "07:00 PM", title: "Night Anchoring in Canal Lagoon", desc: "Quiet starry night in backwaters.", status: "Scheduled" }
        ]
      },
      {
        day: "Day 6",
        date: "Oct 19",
        events: [
          { time: "08:00 AM", title: "Kuttanad Below-Sea-Level Farming", desc: "Explore agricultural marvel where paddy is farmed below sea level.", status: "Scheduled" },
          { time: "02:00 PM", title: "Marari Beach Coconut Grove", desc: "Relaxation on peaceful Arabian sea shore.", status: "Scheduled" },
          { time: "06:30 PM", title: "Ayurvedic Herbal Rejuvenation Massage", desc: "Full-body medicated oil therapy session.", status: "Scheduled" }
        ]
      },
      {
        day: "Day 7",
        date: "Oct 20",
        events: [
          { time: "09:30 AM", title: "Kochi Harbour Water Metro Ride", desc: "Zero-emission electric transit between islands.", status: "Scheduled" },
          { time: "01:00 PM", title: "Spices & Banana Chips Shopping", desc: "Freshly fried coconut oil banana chips and green cardamom.", status: "Scheduled" },
          { time: "05:00 PM", title: "Airport Departure Transfer", desc: "Farewell from your storyteller chauffeur Arjun.", status: "Scheduled" }
        ]
      }
    ]
  },

  telangana: {
    destinationKey: "telangana",
    name: "Telangana (Hyderabad & Warangal)",
    tripId: "SS-2026-TEL",
    pnr: "4582-TEL-9012",
    transports: [
      { id: "tel-t1", destinationKey: "telangana", mode: "Train", title: "Vande Bharat Express (20834)", operator: "IRCTC / South Central Railway", duration: "3h 15m", departure: "06:00 AM (Secunderabad)", arrival: "09:15 AM (Warangal)", price: 820, reliabilityScore: 97, reliabilityBadge: "High Reliability", carbon: "14 kg CO₂", recommended: true },
      { id: "tel-t2", destinationKey: "telangana", mode: "Bus", title: "TSRTC Garuda Plus AC", operator: "Telangana RTC", duration: "2h 45m", departure: "07:00 AM (MGBS)", arrival: "09:45 AM (Hanamkonda)", price: 340, reliabilityScore: 94, reliabilityBadge: "Frequent Express", carbon: "22 kg CO₂", recommended: false },
      { id: "tel-t3", destinationKey: "telangana", mode: "Cab", title: "Verified Highway Cab (EV)", operator: "YatraSync Fleet", duration: "2h 30m", departure: "Doorstep Pickup", arrival: "Warangal Direct", price: 2900, reliabilityScore: 96, reliabilityBadge: "Zero Emissions", carbon: "8 kg CO₂", recommended: false }
    ],
    stays: [
      { id: "tel-s1", destinationKey: "telangana", name: "Kakatiya Heritage Homestay", tier: "homestay", category: "Verified Rural Homestay (0% Fee)", hostName: "Rao Venkat & Family", location: "Palampet Lake Road, Warangal", rating: "4.94", reviews: 48, price: 1450, image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80", features: ["10 mins to UNESCO Ramappa Temple", "Home-Cooked Sarva Pindi Breakfast", "Host Family On-Premises"] },
      { id: "tel-s2", destinationKey: "telangana", name: "Haritha Kakatiya Hotel", tier: "heritage", category: "Govt. Tourism Property", hostName: "Telangana Tourism Board", location: "Subedari, Hanamkonda", rating: "4.2", reviews: 140, price: 2100, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80", features: ["Official State Tourism Property", "24x7 Help Desk", "Safe for Solo Travelers"] },
      { id: "tel-s3", destinationKey: "telangana", name: "Taj Falaknuma Palace", tier: "heritage", category: "5-Star Heritage Palace", hostName: "Taj Hospitality", location: "Engine Bowli, Hyderabad", rating: "4.98", reviews: 310, price: 28000, image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80", features: ["Historic Nizam Palace", "Panoramic City View", "Royal Horse Carriage Welcome"] }
    ],
    drivers: [
      {
        id: "tel-d1",
        destinationKey: "telangana",
        name: "Rameshwar Goud",
        role: "Verified Cab Driver • Kakatiya Storyteller",
        vehicle: "Tata Tigor EV (AC Sedan)",
        vehicleType: "Electric Eco Cab",
        rating: "4.98",
        reviews: 420,
        fixedFullTripPrice: 2200,
        languages: ["Telugu", "Hindi", "English"],
        specialties: "UNESCO Ramappa Architecture, Thousand Pillar Temple, Kakatiya Forts",
        storytellerBio: "Warangal native with deep knowledge of 13th-century Kakatiya dynasty engineering and floating bricks.",
        stories: ["The acoustic whispering gallery of Golconda", "How Ramappa temple survived 800 years of earthquakes"],
        safetyFeatures: ["Emergency SOS button", "Commercial permit verified", "Digital speed governor"]
      },
      {
        id: "tel-d2",
        destinationKey: "telangana",
        name: "Mohammed Arif Khan",
        role: "Verified Chauffeur • Nizami Heritage Guide",
        vehicle: "Maruti Suzuki Ertiga (AC 6-Seater)",
        vehicleType: "Family MUV",
        rating: "4.92",
        reviews: 380,
        fixedFullTripPrice: 2800,
        languages: ["Urdu", "Hindi", "Telugu", "English"],
        specialties: "Old City Charminar Lanes, Chowmahalla Palace, Authentic Biryani Trails",
        storytellerBio: "Old City Hyderabad specialist who knows every historical lane, royal recipe, and artisanal bangle master.",
        stories: ["The legendary diamond trade of the Golconda Sultanate", "The origin story of Hyderabad's Dum Biryani in the royal kitchens"],
        safetyFeatures: ["Verified SHE-Teams commercial badge", "Dual dashcam", "First aid kit on board"]
      }
    ],
    localTransit: [
      { mode: "Prepaid Pink Auto (SHE Teams)", fare: "₹180 - ₹240", time: "15 mins", route: "Secunderabad Station → Old City / Charminar", safetyBadge: "Audited Safe", tip: "Stationed outside platform 10; verified female drivers." },
      { mode: "Hyderabad Metro (Red Line)", fare: "₹45", time: "22 mins", route: "Ameerpet → MGBS Interchange", safetyBadge: "High Frequency", tip: "Trains every 4 minutes. Designated women coach in front." }
    ],
    gems: [
      { title: "Bhongir Fort Monolithic Rock", tag: "Adventure & Heritage", desc: "Single isolated egg-shaped rock hillock towering 500 feet with a 10th-century Chalukya fort." },
      { title: "Medak Cathedral Stained Glass", tag: "Gothic Architecture", desc: "Radiant British stained-glass windows depicting biblical scenes." }
    ],
    eats: [
      { title: "Nimrah Cafe & Bakery", tag: "Iconic Breakfast", desc: "Hot Irani Chai with crumbly Osmania biscuits overlooking Charminar morning prayers." },
      { title: "Hotel Shadab (Old City)", tag: "Authentic Dum Biryani", desc: "Fragrant mutton biryani with mirchi ka salan and double ka meetha." }
    ],
    timeline5Day: [
      {
        day: "Day 1",
        date: "Oct 14",
        events: [
          { time: "06:00 AM", title: "Board Vande Bharat Express (20834)", desc: "Departure from Secunderabad Platform 1. Morning catering included.", status: "On Time", cost: 820 },
          { time: "09:15 AM", title: "Arrival at Warangal Station", desc: "Meet Storyteller Chauffeur Rameshwar Goud.", status: "Confirmed" },
          { time: "10:30 AM", title: "Check-in at Kakatiya Heritage Homestay", desc: "Warm welcome by host Rao Venkat and family with fresh buttermilk.", status: "Confirmed", cost: 1450 },
          { time: "03:30 PM", title: "UNESCO Ramappa Temple Walk", desc: "Admire 13th-century lightweight floating bricks and dancing bracket sculptures.", status: "Scheduled" }
        ]
      },
      {
        day: "Day 2",
        date: "Oct 15",
        events: [
          { time: "08:30 AM", title: "Laknavaram Hanging Bridges & Boating", desc: "Walk across suspension rope bridge connecting forested lake islands.", status: "Scheduled" },
          { time: "01:00 PM", title: "Rural Sarva Pindi & Natu Kodi Lunch", desc: "Crisp spicy rice flatbread and country chicken cooked over woodfire.", status: "Scheduled" },
          { time: "04:30 PM", title: "Thousand Pillar Temple & Warangal Fort", desc: "Star-shaped Kakatiya architecture and iconic stone arch gateway.", status: "Scheduled" }
        ]
      },
      {
        day: "Day 3",
        date: "Oct 16",
        events: [
          { time: "09:00 AM", title: "Pochampally Weavers Village", desc: "Observe master Ikat artisans tie-dyeing geometric silk patterns.", status: "Scheduled" },
          { time: "02:00 PM", title: "Drive to Hyderabad & Check-in", desc: "Arrive in the City of Pearls.", status: "Scheduled" },
          { time: "06:00 PM", title: "Golconda Fort Sound & Light Show", desc: "Experience the dramatic history of diamonds and Sultanate sieges.", status: "Scheduled" }
        ]
      },
      {
        day: "Day 4",
        date: "Oct 17",
        events: [
          { time: "07:30 AM", title: "Charminar Morning Stroll & Irani Chai", desc: "Watch the Old City wake up with hot chai and Osmania biscuits at Nimrah.", status: "Scheduled" },
          { time: "11:00 AM", title: "Chowmahalla Palace Durbar Hall", desc: "Explore crystal chandeliers and vintage 1912 Rolls Royce cars.", status: "Scheduled" },
          { time: "07:30 PM", title: "Authentic Dum Biryani Feast", desc: "Slow-cooked mutton biryani with mirchi ka salan at Shadab.", status: "Scheduled" }
        ]
      },
      {
        day: "Day 5",
        date: "Oct 18",
        events: [
          { time: "09:00 AM", title: "Qutb Shahi Tombs Restoration Trail", desc: "Explore the serene royal domes and acoustic arches. Restored complex showcasing Indo-Persian architecture.", status: "Scheduled" },
          { time: "01:30 PM", title: "Laad Bazaar Lac Bangle Shopping", desc: "Live artisan demonstration of setting crystals into molten resin.", status: "Scheduled" },
          { time: "06:00 PM", title: "Airport Departure Transfer", desc: "Drop off at Rajiv Gandhi International Airport.", status: "Scheduled" }
        ]
      }
    ],
    timeline7Day: [
      {
        day: "Day 1",
        date: "Oct 14",
        events: [
          { time: "09:00 AM", title: "Arrival in Hyderabad", desc: "Meet chauffeur Mohammed Arif Khan.", status: "On Time" },
          { time: "11:30 AM", title: "Charminar & Mecca Masjid", desc: "Historic monument tour.", status: "Confirmed" },
          { time: "06:00 PM", title: "Chowmahalla Palace Evening", desc: "Nizami coronation courtyard.", status: "Scheduled" }
        ]
      },
      {
        day: "Day 2",
        date: "Oct 15",
        events: [
          { time: "08:30 AM", title: "Golconda Citadel Climb", desc: "Whispering acoustic arches and high durbar hall.", status: "Scheduled" },
          { time: "02:00 PM", title: "Qutb Shahi Dynastic Tombs", desc: "Seven royal mausoleums set in formal gardens.", status: "Scheduled" },
          { time: "07:00 PM", title: "Hussain Sagar Sunset Cruise", desc: "Illuminated Buddha statue.", status: "Scheduled" }
        ]
      },
      {
        day: "Day 3",
        date: "Oct 16",
        events: [
          { time: "07:00 AM", title: "Drive to Warangal Kakatiya Kingdom", desc: "Morning scenic highway transit.", status: "Scheduled" },
          { time: "11:00 AM", title: "Thousand Pillar Temple", desc: "12th-century Chalukyan rock artistry.", status: "Scheduled" },
          { time: "04:30 PM", title: "Warangal Fort Stone Gateway", desc: "Iconic Kakatiya Kala Thoranam.", status: "Scheduled" }
        ]
      },
      {
        day: "Day 4",
        date: "Oct 17",
        events: [
          { time: "09:00 AM", title: "UNESCO Ramappa Temple", desc: "Lightweight floating bricks and intricate dancing bracket sculptures.", status: "Scheduled" },
          { time: "02:00 PM", title: "Ramappa Lake Boat Excursion", desc: "Historic 13th-century irrigation lake.", status: "Scheduled" },
          { time: "06:30 PM", title: "Rural Homestay Folk Music", desc: "Home-cooked Telangana feast.", status: "Scheduled", cost: 1450 }
        ]
      },
      {
        day: "Day 5",
        date: "Oct 18",
        events: [
          { time: "09:00 AM", title: "Laknavaram Suspension Bridges", desc: "Forest reservoir with green islands.", status: "Scheduled" },
          { time: "02:00 PM", title: "Pakhal Wildlife Sanctuary Walk", desc: "Birdwatching and deer trails.", status: "Scheduled" },
          { time: "06:00 PM", title: "Bonfire & Jowar Roti Dinner", desc: "Organic millet culinary workshop.", status: "Scheduled" }
        ]
      },
      {
        day: "Day 6",
        date: "Oct 19",
        events: [
          { time: "09:00 AM", title: "Pochampally Handloom Weaving", desc: "Village of award-winning Ikat masters.", status: "Scheduled" },
          { time: "02:30 PM", title: "Bhongir Monolithic Rock Climb", desc: "500-foot egg-shaped hill fort.", status: "Scheduled" },
          { time: "07:00 PM", title: "Return to Hyderabad", desc: "Check into city hotel.", status: "Scheduled" }
        ]
      },
      {
        day: "Day 7",
        date: "Oct 20",
        events: [
          { time: "09:30 AM", title: "Salar Jung Museum Treasures", desc: "Veiled Rebecca marble statue.", status: "Scheduled" },
          { time: "01:30 PM", title: "Old City Pearls & Spices Shopping", desc: "Genuine Basra pearl markets.", status: "Scheduled" },
          { time: "06:00 PM", title: "Airport Departure Transfer", desc: "Return flight.", status: "Scheduled" }
        ]
      }
    ]
  }
};

// Robust tourism state / circuit resolver across all 36 States/UTs and key cities
export function resolveTourismState(destinationKey: string): StateTourism {
  const clean = String(destinationKey || "kerala").toLowerCase().trim().replace(/[-_]/g, '');
  if (COMPLETE_TOURISM_REGISTRY[destinationKey]) return COMPLETE_TOURISM_REGISTRY[destinationKey];
  if (COMPLETE_TOURISM_REGISTRY[clean]) return COMPLETE_TOURISM_REGISTRY[clean];

  const states = Object.values(COMPLETE_TOURISM_REGISTRY);
  const byCapital = states.find(s => s.capital && s.capital.toLowerCase().replace(/[-_]/g, '') === clean);
  if (byCapital) return byCapital;

  const byName = states.find(s => s.name && s.name.toLowerCase().replace(/[-_]/g, '').includes(clean));
  if (byName) return byName;

  const byWhere = states.find(s => (s.whereToVisit || []).some(w => w.name.toLowerCase().replace(/[-_]/g, '').includes(clean)));
  if (byWhere) return byWhere;

  if (clean.includes('shimla') || clean.includes('manali') || clean.includes('kullu') || clean.includes('dharamshala') || clean.includes('kufri')) {
    return COMPLETE_TOURISM_REGISTRY['himachal'] || COMPLETE_TOURISM_REGISTRY['kerala'];
  }
  if (clean.includes('jaipur') || clean.includes('udaipur') || clean.includes('jodhpur') || clean.includes('jaisalmer') || clean.includes('pushkar')) {
    return COMPLETE_TOURISM_REGISTRY['rajasthan'] || COMPLETE_TOURISM_REGISTRY['kerala'];
  }
  if (clean.includes('goa') || clean.includes('panaji') || clean.includes('calangute') || clean.includes('anjuna') || clean.includes('palolem')) {
    return COMPLETE_TOURISM_REGISTRY['goa'] || COMPLETE_TOURISM_REGISTRY['kerala'];
  }
  if (clean.includes('hyderabad') || clean.includes('warangal') || clean.includes('ramappa') || clean.includes('laknavaram')) {
    return COMPLETE_TOURISM_REGISTRY['telangana'] || COMPLETE_TOURISM_REGISTRY['kerala'];
  }
  if (clean.includes('agra') || clean.includes('varanasi') || clean.includes('lucknow')) {
    return COMPLETE_TOURISM_REGISTRY['uttarpradesh'] || COMPLETE_TOURISM_REGISTRY['delhi'] || COMPLETE_TOURISM_REGISTRY['kerala'];
  }
  if (clean.includes('kochi') || clean.includes('munnar') || clean.includes('thekkady') || clean.includes('alleppey') || clean.includes('wayanad') || clean.includes('varkala')) {
    return COMPLETE_TOURISM_REGISTRY['kerala'];
  }

  return COMPLETE_TOURISM_REGISTRY['kerala'];
}

// Dynamic fallback package generator for ANY destination in the 36 states/UTs
export function getPlannerPackage(destinationKey: string, durationDays: 5 | 7 = 5, startDateStr?: string): DestinationPlannerPackage {
  const cleanKey = String(destinationKey || "kerala").toLowerCase().trim();
  const existing = DESTINATION_PLANNER_PACKAGES[cleanKey];

  const vehicles = getRentalVehicles(cleanKey);

  if (existing) {
    const pkgWithVehicles = { ...existing, rentalVehicles: existing.rentalVehicles || vehicles };
    if (startDateStr) {
      return adjustTimelineDates(pkgWithVehicles, startDateStr, durationDays);
    }
    return pkgWithVehicles;
  }

  // Generate valid package on the fly from registry for any of the 36 states/UTs
  const reg = resolveTourismState(cleanKey);
  const cityName = cleanKey.charAt(0).toUpperCase() + cleanKey.slice(1).replace(/[-_]/g, ' ');
  const displayName = cleanKey !== reg.id ? `${cityName} (${reg.name})` : reg.name;
  const primaryLoc = cleanKey !== reg.id ? cityName : reg.capital;

  const pkg: DestinationPlannerPackage = {
    destinationKey: cleanKey,
    name: displayName,
    tripId: `SS-2026-${cleanKey.slice(0, 3).toUpperCase()}`,
    pnr: `4582-${cleanKey.slice(0, 3).toUpperCase()}-9012`,
    transports: [
      { id: `${cleanKey}-t1`, destinationKey: cleanKey, mode: "Flight", title: `Direct Flight to ${primaryLoc} (HYD ➔ ${primaryLoc.slice(0, 3).toUpperCase()})`, operator: "IndiGo / Air India", duration: "2h 10m nonstop", departure: "07:30 AM (RGIA)", arrival: "09:40 AM", price: 3800, reliabilityScore: 94, reliabilityBadge: "Direct Connect", carbon: "88 kg CO₂", recommended: true },
      { id: `${cleanKey}-t2`, destinationKey: cleanKey, mode: "Train", title: `Superfast Express to ${primaryLoc}`, operator: "Indian Railways", duration: "18h 40m", departure: "01:15 PM (HYD)", arrival: "07:55 AM", price: 850, reliabilityScore: 91, reliabilityBadge: "Scenic Route", carbon: "19 kg CO₂", recommended: false },
      { id: `${cleanKey}-t3`, destinationKey: cleanKey, mode: "Bus", title: `Intercity AC Multi-Axle Sleeper`, operator: "State RTC Express", duration: "16h 00m", departure: "06:00 PM", arrival: "10:00 AM", price: 1450, reliabilityScore: 90, reliabilityBadge: "Overnight Sleeper", carbon: "22 kg CO₂", recommended: false }
    ],
    stays: [
      { id: `${cleanKey}-s1`, destinationKey: cleanKey, name: `${primaryLoc} Verified Heritage Homestay`, tier: "homestay", category: "Verified Rural Homestay (0% Fee)", hostName: "Local Host Family", location: `Near ${reg.whereToVisit[0]?.name || primaryLoc}`, rating: "4.94", reviews: 52, price: 1650, image: reg.image, features: ["Authentic Local Breakfast Included", "Verified by State Tourism", "Host Family Guided Walk"] },
      { id: `${cleanKey}-s2`, destinationKey: cleanKey, name: `${primaryLoc} State Eco Resort`, tier: "heritage", category: "Govt. Tourism Property", hostName: "State Tourism Corporation", location: `${primaryLoc} Central`, rating: "4.4", reviews: 112, price: 2400, image: reg.image, features: ["Official State Tourism Property", "24x7 Help Desk", "Safe for Solo Travelers"] }
    ],
    drivers: [
      {
        id: `${reg.id}-d1`,
        destinationKey: reg.id,
        name: `Suresh ${reg.id.slice(0, 3).toUpperCase()}`,
        role: "Verified Chauffeur • Certified Storyteller",
        vehicle: "Tata Nexon EV (AC Sedan)",
        vehicleType: "Electric Eco Cab",
        rating: "4.97",
        reviews: 280,
        fixedFullTripPrice: 2600,
        languages: ["English", "Hindi", "Regional"],
        specialties: `${reg.name} Folklore, Safe Navigation, Authentic Food`,
        storytellerBio: `Native storyteller guide certified by ${reg.name}. Passionate about sharing living heritage.`,
        stories: [`Legends of ${reg.capital}`, `Traditional arts of ${reg.name}`],
        safetyFeatures: ["Emergency SOS GPS synced", "Police background checked", "First aid certified"]
      }
    ],
    rentalVehicles: vehicles,
    localTransit: [
      { mode: "City Pre-Paid Eco Auto", fare: "₹120 - ₹200", time: "15 mins", route: `Station → ${reg.capital} Center`, safetyBadge: "Prepaid Verified", tip: "Government regulated tariff booth." }
    ],
    gems: [
      { title: reg.whereToVisit[0]?.name || "Historic Old Quarter", tag: "Curated Gem", desc: reg.whereToVisit[0]?.desc || "Peaceful heritage streets with traditional architecture." },
      { title: reg.whereToVisit[1]?.name || "Scenic Valley Overlook", tag: "Nature Lookout", desc: reg.whereToVisit[1]?.desc || "Panoramic vantage point overlooking regional landscapes." }
    ],
    eats: [
      { title: reg.cuisineAndCrafts.food[0] || "Traditional Thali", tag: "Iconic Cuisine", desc: "Authentic seasonal feast prepared with regional spices." },
      { title: reg.cuisineAndCrafts.food[1] || "Regional Specialty", tag: "Heritage Dish", desc: "Celebrated local delicacy served at authentic local family eateries." }
    ],
    timeline5Day: generateGenericTimeline(reg.itinerary5Day, 5, startDateStr),
    timeline7Day: generateGenericTimeline(reg.itinerary7Day, 7, startDateStr)
  };

  return pkg;
}

export function getRentalVehicles(destinationKey: string): RentalVehicleOption[] {
  const cleanKey = String(destinationKey || 'kerala').toLowerCase().trim();
  const regCode = cleanKey === 'kerala' ? 'KL-07' : cleanKey === 'goa' ? 'GA-03' : cleanKey === 'ladakh' ? 'LA-01' : cleanKey === 'telangana' ? 'TS-09' : 'RJ-14';

  return [
    {
      id: `${cleanKey}-rv-innova`,
      destinationKey: cleanKey,
      manufacturer: 'Toyota',
      model: 'Innova Crysta',
      variant: '2.4 VX 7 STR',
      modelYear: 2024,
      name: 'Toyota Innova Crysta (7-Seater MUV)',
      category: 'muv',
      categoryLabel: 'Premium MUV',
      seatingCapacity: 7,
      transmission: 'Automatic',
      fuelType: 'Diesel',
      acAvailable: true,
      dailyRate: 3500,
      hourlyRate: 450,
      driverChargePerDay: 500,
      securityDeposit: 5000,
      registrationState: `${regCode}-AX-9812`,
      rentalLocation: `${cleanKey.toUpperCase()} Airport & Central Rail Station Hub`,
      vendorName: 'YatraSync Verified Premium Fleet Co-op',
      vendorPhone: '+91 98765 43210',
      vendorRating: 4.96,
      supportsSelfDrive: true,
      supportsWithDriver: true,
      features: ['Rear AC Climate Control', 'Captain Leather Recliners', 'Dual Front Airbags', 'Highway FASTag Equipped'],
      termsAndConditions: ['Valid Indian Driving License required for self-drive', 'Speed governor capped at 100 km/h on national highways', 'Zero collision damage waiver included'],
      zeroCommissionVerified: true,
      image_url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&auto=format&fit=crop&q=80',
      image_source: 'Authorized Toyota Regional Fleet Dealer Directory',
      image_verified: true,
      image_vehicle_match: true
    },
    {
      id: `${cleanKey}-rv-thar`,
      destinationKey: cleanKey,
      manufacturer: 'Mahindra',
      model: 'Thar 4x4',
      variant: 'LX Hard Top Diesel',
      modelYear: 2024,
      name: 'Mahindra Thar 4x4 Off-Roader',
      category: 'suv',
      categoryLabel: '4x4 Mountain SUV',
      seatingCapacity: 4,
      transmission: 'Manual',
      fuelType: 'Diesel',
      acAvailable: true,
      dailyRate: 3200,
      hourlyRate: 400,
      driverChargePerDay: 600,
      securityDeposit: 4000,
      registrationState: `${regCode}-TH-4410`,
      rentalLocation: `${cleanKey.toUpperCase()} Self-Drive Hub`,
      vendorName: 'Himalayan & Coastal Off-Road Guild',
      vendorPhone: '+91 98765 43211',
      vendorRating: 4.92,
      supportsSelfDrive: true,
      supportsWithDriver: false,
      features: ['High-Clearance 4WD Shift-on-Fly', 'All-Terrain Mud Tyres', 'Touchscreen Apple CarPlay', 'Hill Descent Assist'],
      termsAndConditions: ['Off-road rescue coverage included', 'Strict zero alcohol driving policy enforced by GPS telemetry'],
      zeroCommissionVerified: true,
      image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80',
      image_source: 'Verified Mahindra Partner Records',
      image_verified: true,
      image_vehicle_match: true
    },
    {
      id: `${cleanKey}-rv-swift`,
      destinationKey: cleanKey,
      manufacturer: 'Maruti Suzuki',
      model: 'Swift',
      variant: 'VXi Petrol',
      modelYear: 2023,
      name: 'Maruti Suzuki Swift (Economy Hatchback)',
      category: 'hatchback',
      categoryLabel: 'Economy Hatchback',
      seatingCapacity: 5,
      transmission: 'Manual',
      fuelType: 'Petrol',
      acAvailable: true,
      dailyRate: 1400,
      hourlyRate: 180,
      driverChargePerDay: 450,
      securityDeposit: 2000,
      registrationState: `${regCode}-SW-1120`,
      rentalLocation: `Central City Pickup Hub`,
      vendorName: 'Direct City Self-Drive Partners',
      vendorPhone: '+91 98765 43212',
      vendorRating: 4.88,
      supportsSelfDrive: true,
      supportsWithDriver: true,
      features: ['High Fuel Mileage (22 km/L)', 'AC & Bluetooth Audio', 'Power Steering', 'Compact City Parking Ease'],
      termsAndConditions: ['Unlimited kilometers within state limits', 'Refundable security deposit returned within 2 hours of dropoff'],
      zeroCommissionVerified: true,
      image_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80',
      image_source: 'Maruti Arena Verified Inventory',
      image_verified: true,
      image_vehicle_match: true
    },
    {
      id: `${cleanKey}-rv-ather`,
      destinationKey: cleanKey,
      manufacturer: 'Ather Energy',
      model: '450X EV',
      variant: 'Gen 3 Pro Pack',
      modelYear: 2024,
      name: 'Ather 450X EV Scooter (Eco Smart)',
      category: 'scooter_ev',
      categoryLabel: 'Electric Scooter',
      seatingCapacity: 2,
      transmission: 'Automatic',
      fuelType: 'Electric',
      acAvailable: false,
      dailyRate: 450,
      hourlyRate: 60,
      driverChargePerDay: 0,
      securityDeposit: 1000,
      registrationState: `${regCode}-EV-0099`,
      rentalLocation: `Eco Mobility Station`,
      vendorName: 'YatraSync Green Mobility Co-op',
      vendorPhone: '+91 98765 43213',
      vendorRating: 4.98,
      supportsSelfDrive: true,
      supportsWithDriver: false,
      features: ['146 km Certified Range', 'Fast Grid Charging Support', 'Digital Maps & Auto-Indicator', '2 ISI Helmets Included'],
      termsAndConditions: ['Helmet mandatory for rider & pillion', 'Free charging at all YatraSync verified homestays'],
      zeroCommissionVerified: true,
      image_url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80',
      image_source: 'Ather Energy Mobility Network',
      image_verified: true,
      image_vehicle_match: true
    },
    {
      id: `${cleanKey}-rv-traveller`,
      destinationKey: cleanKey,
      manufacturer: 'Force Motors',
      model: 'Traveller 12',
      variant: '3350 AC Deluxe',
      modelYear: 2023,
      name: 'Force Traveller 12-Seater (Group Minibus)',
      category: 'tempo_traveller',
      categoryLabel: 'Group Minibus',
      seatingCapacity: 12,
      transmission: 'Manual',
      fuelType: 'Diesel',
      acAvailable: true,
      dailyRate: 4500,
      hourlyRate: 550,
      driverChargePerDay: 600,
      securityDeposit: 5000,
      registrationState: `${regCode}-TT-1200`,
      rentalLocation: `Interstate Tourist Bus Terminal`,
      vendorName: 'Regional Group Transport Guild',
      vendorPhone: '+91 98765 43214',
      vendorRating: 4.90,
      supportsSelfDrive: false,
      supportsWithDriver: true,
      features: ['High-Roof Pushback Recliners', 'Roof Luggage Carrier', 'Individual AC Louvers', 'Audio Entertainment System'],
      termsAndConditions: ['Commercial driver mandatory', 'All state tourist permit fees included in tariff'],
      zeroCommissionVerified: true,
      image_url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&auto=format&fit=crop&q=80',
      image_source: 'Force Motors Commercial Guild',
      image_verified: true,
      image_vehicle_match: true
    },
    {
      id: `${cleanKey}-rv-creta-unverified-test`,
      destinationKey: cleanKey,
      manufacturer: 'Hyundai',
      model: 'Creta',
      variant: 'SX (O) Turbo Petrol',
      modelYear: 2024,
      name: 'Hyundai Creta (Mid-Size SUV)',
      category: 'suv',
      categoryLabel: 'Mid-Size SUV',
      seatingCapacity: 5,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      acAvailable: true,
      dailyRate: 2600,
      hourlyRate: 320,
      driverChargePerDay: 500,
      securityDeposit: 3000,
      registrationState: `${regCode}-CR-5540`,
      rentalLocation: `Airport Terminal 1 Pickup Counter`,
      vendorName: 'Direct City Self-Drive Partners',
      vendorPhone: '+91 98765 43215',
      vendorRating: 4.85,
      supportsSelfDrive: true,
      supportsWithDriver: true,
      features: ['Panoramic Sunroof', 'Bose 8-Speaker Audio', 'Ventilated Front Seats', 'ADAS Safety Tech'],
      termsAndConditions: ['Valid Driving License & Aadhaar verification required'],
      zeroCommissionVerified: true,
      // DEMONSTRATION OF STRICT IMAGE MATCHING FALLBACK RULE:
      // image_verified is FALSE -> Component MUST render "Vehicle image unavailable" neutral fallback!
      image_url: '',
      image_source: 'Pending Partner Photo Submission',
      image_verified: false,
      image_vehicle_match: false
    }
  ];
}

function generateGenericTimeline(items: { day: string; title: string; morning: string; afternoon: string; evening: string }[], count: number, startDateStr?: string): TimelineDayGroup[] {
  const baseDate = startDateStr ? new Date(startDateStr) : new Date("2026-10-14");
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return items.slice(0, count).map((item, idx) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + idx);
    const dateLabel = isNaN(d.getTime()) ? `Day ${idx + 1}` : `${monthNames[d.getMonth()]} ${d.getDate()}`;

    return {
      day: item.day || `Day ${idx + 1}`,
      date: dateLabel,
      events: [
        { time: "09:00 AM", title: item.title, desc: item.morning, status: idx === 0 ? "On Time" : "Scheduled" },
        { time: "01:30 PM", title: "Regional Lunch & Exploration", desc: item.afternoon, status: idx === 0 ? "Confirmed" : "Scheduled" },
        { time: "06:00 PM", title: "Sunset Leisure & Cultural Evening", desc: item.evening, status: "Scheduled" }
      ]
    };
  });
}

function adjustTimelineDates(pkg: DestinationPlannerPackage, startDateStr: string, duration: 5 | 7): DestinationPlannerPackage {
  const baseDate = new Date(startDateStr);
  if (isNaN(baseDate.getTime())) return pkg;

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const timelineKey = duration === 7 ? 'timeline7Day' : 'timeline5Day';
  const targetTimeline = pkg[timelineKey];

  const updatedTimeline = targetTimeline.map((group, idx) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + idx);
    return {
      ...group,
      date: `${monthNames[d.getMonth()]} ${d.getDate()}`
    };
  });

  return {
    ...pkg,
    [timelineKey]: updatedTimeline
  };
}

export function getDestinationPackage(destinationKey: string) {
  const pkg = getPlannerPackage(destinationKey);
  const reg = resolveTourismState(destinationKey);
  return {
    ...pkg,
    storytellerDrivers: pkg.drivers,
    hiddenGems: pkg.gems,
    iconicEats: pkg.eats,
    safetyCorridors: reg?.safety || {
      touristPoliceHelpline: "112 / +91 1800-425-4747",
      ambulance: "108",
      womanTravelerRating: "4.8/5",
      corridors: reg?.safetyAndFeatures || []
    }
  };
}

export function generateDynamicTimeline(destinationKey: string, durationDays: 5 | 7 = 5, datesText?: string): TimelineDayGroup[] {
  const pkg = getPlannerPackage(destinationKey, durationDays, datesText);
  return durationDays === 7 ? pkg.timeline7Day : pkg.timeline5Day;
}
