import { CITY_IMAGES, getGoogleMapsUrl } from "@/lib/constants";

type FallbackActivity = {
  id: string;
  name: string;
  type: string;
  status: string;
  startTime: string | null;
  endTime: string | null;
  notes: string | null;
  sortOrder: number;
};

type FallbackPlace = {
  id: string;
  name: string;
  category: string;
  address: string | null;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  googlePlaceId: string | null;
  googleMapsUrl: string;
  photoUrl: string | null;
  rating: number | null;
  priceLevel: number | null;
  phone: string | null;
  website: string | null;
  notes: string | null;
  kidFriendly: boolean;
  visited: boolean;
  visitedAt: string | null;
  tripDayId: string | null;
};

type FallbackTripDay = {
  id: string;
  date: string;
  dayNum: number;
  city: string;
  country: string;
  notes: string | null;
  activities: FallbackActivity[];
  places: FallbackPlace[];
};

type FallbackFlight = {
  id: string;
  tripId: string;
  flightNumber: string;
  confirmationCode: string | null;
  airline: string;
  airlineCode: string | null;
  airlineLogo: string | null;
  departureAirport: string;
  departureCity: string;
  arrivalAirport: string;
  arrivalCity: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  actualDeparture: string | null;
  actualArrival: string | null;
  status: string;
  terminal: string | null;
  gate: string | null;
  baggageBelt: string | null;
  aircraft: string | null;
  lastChecked: string | null;
};

type FallbackStay = {
  id: string;
  tripId: string;
  hotelName: string;
  address: string | null;
  city: string;
  country: string;
  checkIn: string;
  checkOut: string;
  checkInLabel: string | null;
  checkOutLabel: string | null;
  confirmationCode: string | null;
  bookingProvider: string | null;
  roomType: string | null;
  guests: number;
  notes: string | null;
  googlePlaceId: string | null;
  googleMapsUrl: string;
  photoUrl: string | null;
  rating: number | null;
  phone: string | null;
  website: string | null;
};

type FallbackDocument = {
  id: string;
  name: string;
  type: string;
};

export type FallbackTrip = {
  id: string;
  name: string;
  type: "SOLO" | "FAMILY";
  status: string;
  startDate: string;
  endDate: string;
  cities: string[];
  countries: string[];
  coverImage: string | null;
  description: string | null;
  travelers: number;
  days: FallbackTripDay[];
  flights: FallbackFlight[];
  stays: FallbackStay[];
  documents: FallbackDocument[];
};

function createPlace(input: Omit<FallbackPlace, "googleMapsUrl"> & { googleMapsUrl?: string }): FallbackPlace {
  return {
    ...input,
    googleMapsUrl:
      input.googleMapsUrl || getGoogleMapsUrl(input.googlePlaceId ?? undefined, `${input.name} ${input.city}`),
  };
}

const indiaPlaces: FallbackPlace[] = [
  createPlace({
    id: "place-india-charminar",
    name: "Charminar",
    category: "LANDMARK",
    address: "Old City, Hyderabad",
    city: "Hyderabad",
    country: "India",
    latitude: 17.3616,
    longitude: 78.4747,
    googlePlaceId: null,
    photoUrl: CITY_IMAGES.hyderabad.thumb,
    rating: 4.5,
    priceLevel: null,
    phone: null,
    website: null,
    notes: "Iconic 16th-century monument in the old city.",
    kidFriendly: true,
    visited: false,
    visitedAt: null,
    tripDayId: "day-india-1",
  }),
  createPlace({
    id: "place-india-paradise",
    name: "Paradise Biryani",
    category: "EAT",
    address: "Secunderabad, Hyderabad",
    city: "Hyderabad",
    country: "India",
    latitude: 17.4401,
    longitude: 78.4489,
    googlePlaceId: null,
    photoUrl: CITY_IMAGES.hyderabad.thumb,
    rating: 4.3,
    priceLevel: 2,
    phone: null,
    website: null,
    notes: "Classic Hyderabadi biryani stop.",
    kidFriendly: true,
    visited: false,
    visitedAt: null,
    tripDayId: "day-india-1",
  }),
  createPlace({
    id: "place-india-golconda",
    name: "Golconda Fort",
    category: "LANDMARK",
    address: "Khair Complex, Hyderabad",
    city: "Hyderabad",
    country: "India",
    latitude: 17.3833,
    longitude: 78.4011,
    googlePlaceId: null,
    photoUrl: CITY_IMAGES.hyderabad.thumb,
    rating: 4.6,
    priceLevel: null,
    phone: null,
    website: null,
    notes: "Historic fort with panoramic views.",
    kidFriendly: true,
    visited: false,
    visitedAt: null,
    tripDayId: "day-india-2",
  }),
  createPlace({
    id: "place-india-mecca-masjid",
    name: "Mecca Masjid",
    category: "PRAY",
    address: "Charminar Rd, Hyderabad",
    city: "Hyderabad",
    country: "India",
    latitude: 17.3604,
    longitude: 78.4736,
    googlePlaceId: null,
    photoUrl: CITY_IMAGES.hyderabad.thumb,
    rating: 4.7,
    priceLevel: null,
    phone: null,
    website: null,
    notes: "Historic mosque near Charminar.",
    kidFriendly: true,
    visited: false,
    visitedAt: null,
    tripDayId: "day-india-1",
  }),
  createPlace({
    id: "place-india-india-gate",
    name: "India Gate",
    category: "LANDMARK",
    address: "Kartavya Path, New Delhi",
    city: "Delhi",
    country: "India",
    latitude: 28.6129,
    longitude: 77.2295,
    googlePlaceId: null,
    photoUrl: CITY_IMAGES.delhi.thumb,
    rating: 4.7,
    priceLevel: null,
    phone: null,
    website: null,
    notes: "Classic Delhi landmark and evening walk stop.",
    kidFriendly: true,
    visited: false,
    visitedAt: null,
    tripDayId: "day-india-3",
  }),
  createPlace({
    id: "place-india-red-fort",
    name: "Red Fort",
    category: "LANDMARK",
    address: "Netaji Subhash Marg, Delhi",
    city: "Delhi",
    country: "India",
    latitude: 28.6562,
    longitude: 77.241,
    googlePlaceId: null,
    photoUrl: CITY_IMAGES.delhi.thumb,
    rating: 4.5,
    priceLevel: null,
    phone: null,
    website: null,
    notes: "Mughal fort complex in Old Delhi.",
    kidFriendly: true,
    visited: false,
    visitedAt: null,
    tripDayId: "day-india-3",
  }),
];

const familyPlaces: FallbackPlace[] = [
  createPlace({
    id: "place-family-koshary",
    name: "Koshary Abou Tarek",
    category: "EAT",
    address: "Marouf, Qasr El Nil, Cairo",
    city: "Cairo",
    country: "Egypt",
    latitude: 30.0517,
    longitude: 31.2464,
    googlePlaceId: null,
    photoUrl: CITY_IMAGES.cairo.thumb,
    rating: 4.5,
    priceLevel: 1,
    phone: null,
    website: null,
    notes: "Popular koshary stop for the first Cairo day.",
    kidFriendly: true,
    visited: false,
    visitedAt: null,
    tripDayId: "day-family-1",
  }),
  createPlace({
    id: "place-family-pyramids",
    name: "Pyramids of Giza",
    category: "LANDMARK",
    address: "Al Haram, Nazlet El-Semman, Giza",
    city: "Cairo",
    country: "Egypt",
    latitude: 29.9792,
    longitude: 31.1342,
    googlePlaceId: null,
    photoUrl: CITY_IMAGES.cairo.thumb,
    rating: 4.8,
    priceLevel: null,
    phone: null,
    website: null,
    notes: "Camel rides and classic family photo stop.",
    kidFriendly: true,
    visited: false,
    visitedAt: null,
    tripDayId: "day-family-2",
  }),
  createPlace({
    id: "place-family-sphinx",
    name: "Great Sphinx",
    category: "LANDMARK",
    address: "Al Haram, Giza",
    city: "Cairo",
    country: "Egypt",
    latitude: 29.9753,
    longitude: 31.1376,
    googlePlaceId: null,
    photoUrl: CITY_IMAGES.cairo.thumb,
    rating: 4.7,
    priceLevel: null,
    phone: null,
    website: null,
    notes: "Pairs with the pyramids visit.",
    kidFriendly: true,
    visited: false,
    visitedAt: null,
    tripDayId: "day-family-2",
  }),
  createPlace({
    id: "place-family-gem",
    name: "Grand Egyptian Museum",
    category: "MUSEUM",
    address: "Kafr Nassar, Giza",
    city: "Cairo",
    country: "Egypt",
    latitude: 29.9949,
    longitude: 31.1171,
    googlePlaceId: null,
    photoUrl: CITY_IMAGES.cairo.thumb,
    rating: 4.7,
    priceLevel: null,
    phone: null,
    website: null,
    notes: "Book tickets ahead for the Tutankhamun galleries.",
    kidFriendly: true,
    visited: false,
    visitedAt: null,
    tripDayId: "day-family-3",
  }),
  createPlace({
    id: "place-family-khan",
    name: "Khan El Khalili",
    category: "SHOP",
    address: "El-Gamaleya, Cairo",
    city: "Cairo",
    country: "Egypt",
    latitude: 30.0477,
    longitude: 31.2627,
    googlePlaceId: null,
    photoUrl: CITY_IMAGES.cairo.thumb,
    rating: 4.4,
    priceLevel: null,
    phone: null,
    website: null,
    notes: "Busy bazaar, better with a baby carrier than a stroller.",
    kidFriendly: false,
    visited: false,
    visitedAt: null,
    tripDayId: "day-family-3",
  }),
  createPlace({
    id: "place-family-ras-mohammed",
    name: "Ras Mohammed National Park",
    category: "PARK",
    address: "Sinai Peninsula",
    city: "Sharm El Sheikh",
    country: "Egypt",
    latitude: 27.7313,
    longitude: 34.2539,
    googlePlaceId: null,
    photoUrl: CITY_IMAGES["sharm-el-sheikh"].thumb,
    rating: 4.7,
    priceLevel: null,
    phone: null,
    website: null,
    notes: "Snorkeling and easy family-friendly scenery.",
    kidFriendly: true,
    visited: false,
    visitedAt: null,
    tripDayId: null,
  }),
  createPlace({
    id: "place-family-haram",
    name: "Masjid al-Haram",
    category: "PRAY",
    address: "Al Haram, Makkah",
    city: "Makkah",
    country: "Saudi Arabia",
    latitude: 21.4225,
    longitude: 39.8262,
    googlePlaceId: null,
    photoUrl: CITY_IMAGES.makkah.thumb,
    rating: 5,
    priceLevel: null,
    phone: null,
    website: null,
    notes: "Main Umrah destination.",
    kidFriendly: true,
    visited: false,
    visitedAt: null,
    tripDayId: null,
  }),
  createPlace({
    id: "place-family-nabawi",
    name: "Masjid an-Nabawi",
    category: "PRAY",
    address: "Central Area, Madinah",
    city: "Madinah",
    country: "Saudi Arabia",
    latitude: 24.4672,
    longitude: 39.6111,
    googlePlaceId: null,
    photoUrl: CITY_IMAGES.madinah.thumb,
    rating: 5,
    priceLevel: null,
    phone: null,
    website: null,
    notes: "Prayer and Rawdah visit stop.",
    kidFriendly: true,
    visited: false,
    visitedAt: null,
    tripDayId: null,
  }),
];

const allPlaces = [...indiaPlaces, ...familyPlaces];

const baseTrips: FallbackTrip[] = [
  {
    id: "india-solo-2026",
    name: "Trip to Hyderabad",
    type: "SOLO",
    status: "PLANNING",
    startDate: "2026-04-28T00:00:00.000Z",
    endDate: "2026-05-11T00:00:00.000Z",
    cities: ["Hyderabad", "Delhi"],
    countries: ["India"],
    coverImage: CITY_IMAGES.hyderabad.hero,
    description: "Booked Etihad, IndiGo, and Emirates segments for the Hyderabad and Delhi trip.",
    travelers: 1,
    days: [
      {
        id: "day-india-1",
        date: "2026-04-29T00:00:00.000Z",
        dayNum: 1,
        city: "Hyderabad",
        country: "India",
        notes: "Arrival day with old city sights.",
        activities: [
          { id: "act-india-1", name: "Flight AUH → HYD", type: "FLIGHT", status: "PLANNED", startTime: "2026-04-29T10:30:00.000Z", endTime: "2026-04-29T14:15:00.000Z", notes: "Etihad EY358", sortOrder: 1 },
          { id: "act-india-2", name: "Hotel Check-in", type: "HOTEL_CHECKIN", status: "PLANNED", startTime: "2026-04-29T16:00:00.000Z", endTime: null, notes: "Taj Falaknuma Palace", sortOrder: 2 },
          { id: "act-india-3", name: "Charminar Visit", type: "SIGHTSEEING", status: "PLANNED", startTime: "2026-04-29T18:00:00.000Z", endTime: "2026-04-29T20:00:00.000Z", notes: null, sortOrder: 3 },
        ],
        places: [],
      },
      {
        id: "day-india-2",
        date: "2026-04-30T00:00:00.000Z",
        dayNum: 2,
        city: "Hyderabad",
        country: "India",
        notes: "Fort and museum day.",
        activities: [
          { id: "act-india-4", name: "Golconda Fort", type: "SIGHTSEEING", status: "PLANNED", startTime: "2026-04-30T08:30:00.000Z", endTime: "2026-04-30T11:30:00.000Z", notes: null, sortOrder: 1 },
          { id: "act-india-5", name: "Lunch at Shadab", type: "MEAL", status: "PLANNED", startTime: "2026-04-30T13:00:00.000Z", endTime: null, notes: null, sortOrder: 2 },
        ],
        places: [],
      },
      {
        id: "day-india-3",
        date: "2026-05-07T00:00:00.000Z",
        dayNum: 10,
        city: "Delhi",
        country: "India",
        notes: "Delhi arrival and evening walk.",
        activities: [
          { id: "act-india-6", name: "Flight HYD → DEL", type: "FLIGHT", status: "PLANNED", startTime: "2026-05-07T05:05:00.000Z", endTime: "2026-05-07T07:40:00.000Z", notes: "IndiGo 6E6202", sortOrder: 1 },
          { id: "act-india-7", name: "India Gate & Rajpath walk", type: "SIGHTSEEING", status: "PLANNED", startTime: "2026-05-07T12:00:00.000Z", endTime: "2026-05-07T14:00:00.000Z", notes: null, sortOrder: 2 },
        ],
        places: [],
      },
    ],
    flights: [
      { id: "flight-india-1", tripId: "india-solo-2026", flightNumber: "EY22", confirmationCode: "STTKL", airline: "Etihad Airways", airlineCode: "EY", airlineLogo: null, departureAirport: "YYZ", departureCity: "Toronto", arrivalAirport: "AUH", arrivalCity: "Abu Dhabi", scheduledDeparture: "2026-04-28T19:10:00.000Z", scheduledArrival: "2026-04-29T08:30:00.000Z", actualDeparture: null, actualArrival: null, status: "SCHEDULED", terminal: "1", gate: null, baggageBelt: null, aircraft: null, lastChecked: null },
      { id: "flight-india-2", tripId: "india-solo-2026", flightNumber: "EY358", confirmationCode: "STTKL", airline: "Etihad Airways", airlineCode: "EY", airlineLogo: null, departureAirport: "AUH", departureCity: "Abu Dhabi", arrivalAirport: "HYD", arrivalCity: "Hyderabad", scheduledDeparture: "2026-04-29T10:30:00.000Z", scheduledArrival: "2026-04-29T14:15:00.000Z", actualDeparture: null, actualArrival: null, status: "SCHEDULED", terminal: "A", gate: null, baggageBelt: null, aircraft: null, lastChecked: null },
      { id: "flight-india-3", tripId: "india-solo-2026", flightNumber: "6E6202", confirmationCode: "CCGM9X", airline: "IndiGo", airlineCode: "6E", airlineLogo: null, departureAirport: "HYD", departureCity: "Hyderabad", arrivalAirport: "DEL", arrivalCity: "Delhi", scheduledDeparture: "2026-05-07T05:05:00.000Z", scheduledArrival: "2026-05-07T07:40:00.000Z", actualDeparture: null, actualArrival: null, status: "SCHEDULED", terminal: "1", gate: null, baggageBelt: null, aircraft: null, lastChecked: null },
      { id: "flight-india-4", tripId: "india-solo-2026", flightNumber: "EK513", confirmationCode: "JMH5CJ", airline: "Emirates", airlineCode: "EK", airlineLogo: null, departureAirport: "DEL", departureCity: "Delhi", arrivalAirport: "DXB", arrivalCity: "Dubai", scheduledDeparture: "2026-05-09T22:55:00.000Z", scheduledArrival: "2026-05-10T02:25:00.000Z", actualDeparture: null, actualArrival: null, status: "SCHEDULED", terminal: "3", gate: null, baggageBelt: null, aircraft: null, lastChecked: null },
      { id: "flight-india-5", tripId: "india-solo-2026", flightNumber: "EK241", confirmationCode: "JMH5CJ", airline: "Emirates", airlineCode: "EK", airlineLogo: null, departureAirport: "DXB", departureCity: "Dubai", arrivalAirport: "YYZ", arrivalCity: "Toronto", scheduledDeparture: "2026-05-10T23:30:00.000Z", scheduledArrival: "2026-05-11T13:30:00.000Z", actualDeparture: null, actualArrival: null, status: "SCHEDULED", terminal: "3", gate: null, baggageBelt: null, aircraft: null, lastChecked: null },
    ],
    stays: [],
    documents: [
      { id: "doc-india-1", name: "India Visa", type: "VISA" },
      { id: "doc-india-2", name: "Booked Flight Segments", type: "FLIGHT_BOOKING" },
    ],
  },
  {
    id: "family-egypt-saudi-2026",
    name: "Trip to Cairo and Umrah",
    type: "FAMILY",
    status: "PLANNING",
    startDate: "2026-12-05T00:00:00.000Z",
    endDate: "2026-12-24T00:00:00.000Z",
    cities: ["Cairo", "Sharm El Sheikh", "Madinah", "Makkah"],
    countries: ["Egypt", "Saudi Arabia"],
    coverImage: CITY_IMAGES.cairo.hero,
    description: "Family trip through Cairo, Sharm El Sheikh, Madinah, and Makkah based on booked flights and hotels.",
    travelers: 5,
    days: [
      {
        id: "day-family-1",
        date: "2026-12-05T00:00:00.000Z",
        dayNum: 1,
        city: "Cairo",
        country: "Egypt",
        notes: "Arrival and settling in.",
        activities: [
          { id: "act-family-1", name: "Flight to Cairo", type: "FLIGHT", status: "PLANNED", startTime: "2026-12-05T17:00:00.000Z", endTime: "2026-12-06T03:25:00.000Z", notes: "EgyptAir MS996", sortOrder: 1 },
          { id: "act-family-2", name: "Hotel Check-in", type: "HOTEL_CHECKIN", status: "PLANNED", startTime: "2026-12-06T10:00:00.000Z", endTime: null, notes: "Cairo Marriott Hotel", sortOrder: 2 },
        ],
        places: [],
      },
      {
        id: "day-family-2",
        date: "2026-12-06T00:00:00.000Z",
        dayNum: 2,
        city: "Cairo",
        country: "Egypt",
        notes: "Pyramids day.",
        activities: [
          { id: "act-family-3", name: "Pyramids of Giza", type: "SIGHTSEEING", status: "PLANNED", startTime: "2026-12-06T06:00:00.000Z", endTime: "2026-12-06T10:00:00.000Z", notes: null, sortOrder: 1 },
          { id: "act-family-4", name: "Great Sphinx", type: "SIGHTSEEING", status: "PLANNED", startTime: "2026-12-06T10:30:00.000Z", endTime: "2026-12-06T11:30:00.000Z", notes: null, sortOrder: 2 },
        ],
        places: [],
      },
      {
        id: "day-family-3",
        date: "2026-12-07T00:00:00.000Z",
        dayNum: 3,
        city: "Cairo",
        country: "Egypt",
        notes: "Museum and bazaar day.",
        activities: [
          { id: "act-family-5", name: "Grand Egyptian Museum", type: "MUSEUM", status: "PLANNED", startTime: "2026-12-07T07:00:00.000Z", endTime: "2026-12-07T10:00:00.000Z", notes: null, sortOrder: 1 },
          { id: "act-family-6", name: "Khan El Khalili Bazaar", type: "SHOPPING", status: "PLANNED", startTime: "2026-12-07T12:00:00.000Z", endTime: "2026-12-07T15:00:00.000Z", notes: null, sortOrder: 2 },
        ],
        places: [],
      },
    ],
    flights: [
      { id: "flight-family-1", tripId: "family-egypt-saudi-2026", flightNumber: "MS996", confirmationCode: null, airline: "EgyptAir", airlineCode: "MS", airlineLogo: null, departureAirport: "YYZ", departureCity: "Toronto", arrivalAirport: "CAI", arrivalCity: "Cairo", scheduledDeparture: "2026-12-05T17:00:00.000Z", scheduledArrival: "2026-12-06T03:25:00.000Z", actualDeparture: null, actualArrival: null, status: "SCHEDULED", terminal: "1", gate: null, baggageBelt: null, aircraft: null, lastChecked: null },
      { id: "flight-family-2", tripId: "family-egypt-saudi-2026", flightNumber: "MS762", confirmationCode: "CAISHARM", airline: "EgyptAir", airlineCode: "MS", airlineLogo: null, departureAirport: "CAI", departureCity: "Cairo", arrivalAirport: "SSH", arrivalCity: "Sharm El Sheikh", scheduledDeparture: "2026-12-09T12:00:00.000Z", scheduledArrival: "2026-12-09T13:05:00.000Z", actualDeparture: null, actualArrival: null, status: "SCHEDULED", terminal: "1", gate: null, baggageBelt: null, aircraft: null, lastChecked: null },
      { id: "flight-family-3", tripId: "family-egypt-saudi-2026", flightNumber: "SV1277", confirmationCode: null, airline: "Saudia", airlineCode: "SV", airlineLogo: null, departureAirport: "CAI", departureCity: "Cairo", arrivalAirport: "MED", arrivalCity: "Madinah", scheduledDeparture: "2026-12-15T14:45:00.000Z", scheduledArrival: "2026-12-15T16:35:00.000Z", actualDeparture: null, actualArrival: null, status: "SCHEDULED", terminal: "5", gate: null, baggageBelt: null, aircraft: null, lastChecked: null },
      { id: "flight-family-4", tripId: "family-egypt-saudi-2026", flightNumber: "MS664", confirmationCode: null, airline: "EgyptAir", airlineCode: "MS", airlineLogo: null, departureAirport: "JED", departureCity: "Jeddah", arrivalAirport: "CAI", arrivalCity: "Cairo", scheduledDeparture: "2026-12-24T09:00:00.000Z", scheduledArrival: "2026-12-24T11:20:00.000Z", actualDeparture: null, actualArrival: null, status: "SCHEDULED", terminal: "1", gate: null, baggageBelt: null, aircraft: null, lastChecked: null },
    ],
    stays: [
      { id: "stay-family-1", tripId: "family-egypt-saudi-2026", hotelName: "Cairo Marriott Hotel", address: "16 Saray El Gezira Street, Zamalek, Cairo 11211, Egypt", city: "Cairo", country: "Egypt", checkIn: "2026-12-05T12:00:00.000Z", checkOut: "2026-12-09T10:00:00.000Z", checkInLabel: "2:00 PM GMT+2", checkOutLabel: "12:00 PM GMT+2", confirmationCode: null, bookingProvider: null, roomType: null, guests: 5, notes: null, googlePlaceId: null, googleMapsUrl: getGoogleMapsUrl(undefined, "Cairo Marriott Hotel Cairo"), photoUrl: CITY_IMAGES.cairo.thumb, rating: 4.6, phone: null, website: null },
      { id: "stay-family-2", tripId: "family-egypt-saudi-2026", hotelName: "Sunstaro Royal Beach Resort", address: "Ras Nosrani Bay, Sharm El Sheikh, Egypt", city: "Sharm El Sheikh", country: "Egypt", checkIn: "2026-12-09T12:00:00.000Z", checkOut: "2026-12-12T10:00:00.000Z", checkInLabel: "2:00 PM GMT+2", checkOutLabel: "12:00 PM GMT+2", confirmationCode: null, bookingProvider: null, roomType: null, guests: 5, notes: null, googlePlaceId: null, googleMapsUrl: getGoogleMapsUrl(undefined, "Sunstaro Royal Beach Resort Sharm El Sheikh"), photoUrl: CITY_IMAGES["sharm-el-sheikh"].thumb, rating: 4.3, phone: null, website: null },
      { id: "stay-family-3", tripId: "family-egypt-saudi-2026", hotelName: "Hilton Cairo Heliopolis", address: "El-Orouba, Cairo, Egypt", city: "Cairo", country: "Egypt", checkIn: "2026-12-12T12:00:00.000Z", checkOut: "2026-12-15T10:00:00.000Z", checkInLabel: "2:00 PM GMT+2", checkOutLabel: "12:00 PM GMT+2", confirmationCode: null, bookingProvider: null, roomType: null, guests: 5, notes: null, googlePlaceId: null, googleMapsUrl: getGoogleMapsUrl(undefined, "Hilton Cairo Heliopolis Cairo"), photoUrl: CITY_IMAGES.cairo.thumb, rating: 4.5, phone: null, website: null },
      { id: "stay-family-4", tripId: "family-egypt-saudi-2026", hotelName: "Madinah Hilton", address: "King Fahad St, Madinah", city: "Madinah", country: "Saudi Arabia", checkIn: "2026-12-15T19:00:00.000Z", checkOut: "2026-12-19T09:00:00.000Z", checkInLabel: "10:00 PM GMT+3", checkOutLabel: "12:00 PM GMT+3", confirmationCode: null, bookingProvider: null, roomType: null, guests: 5, notes: null, googlePlaceId: null, googleMapsUrl: getGoogleMapsUrl(undefined, "Madinah Hilton Madinah"), photoUrl: CITY_IMAGES.madinah.thumb, rating: 4.4, phone: null, website: null },
      { id: "stay-family-5", tripId: "family-egypt-saudi-2026", hotelName: "Hilton Suites Jabal Omar Makkah", address: "Jabal Omar, Ibrahim Al Khalil, Makkah", city: "Makkah", country: "Saudi Arabia", checkIn: "2026-12-19T13:00:00.000Z", checkOut: "2026-12-22T09:00:00.000Z", checkInLabel: "4:00 PM GMT+3", checkOutLabel: "12:00 PM GMT+3", confirmationCode: null, bookingProvider: null, roomType: null, guests: 5, notes: null, googlePlaceId: null, googleMapsUrl: getGoogleMapsUrl(undefined, "Hilton Suites Jabal Omar Makkah"), photoUrl: CITY_IMAGES.makkah.thumb, rating: 4.6, phone: null, website: null },
    ],
    documents: [
      { id: "doc-family-1", name: "Passports", type: "PASSPORT" },
      { id: "doc-family-2", name: "Egypt Visa", type: "VISA" },
      { id: "doc-family-3", name: "Umrah Permit", type: "UMRAH_PERMIT" },
    ],
  },
];

function attachPlacesToTrips(trips: FallbackTrip[], places: FallbackPlace[]): FallbackTrip[] {
  return trips.map((trip) => ({
    ...trip,
    days: trip.days.map((day) => ({
      ...day,
      places: places
        .filter((place) => place.tripDayId === day.id)
        .map((place) => ({ ...place })),
      activities: day.activities.map((activity) => ({ ...activity })),
    })),
    flights: trip.flights.map((flight) => ({ ...flight })),
    stays: trip.stays.map((stay) => ({ ...stay })),
    documents: trip.documents.map((document) => ({ ...document })),
  }));
}

export const FALLBACK_PLACES: FallbackPlace[] = allPlaces.map((place) => ({ ...place }));
export const FALLBACK_TRIPS: FallbackTrip[] = attachPlacesToTrips(baseTrips, FALLBACK_PLACES);
export const FALLBACK_TRIPS_BY_ID: Record<string, FallbackTrip> = Object.fromEntries(
  FALLBACK_TRIPS.map((trip) => [trip.id, trip])
);
export const FALLBACK_FLIGHTS: FallbackFlight[] = FALLBACK_TRIPS.flatMap((trip) => trip.flights.map((flight) => ({ ...flight })));
export const FALLBACK_STAYS: FallbackStay[] = FALLBACK_TRIPS.flatMap((trip) => trip.stays.map((stay) => ({ ...stay })));

export function getFallbackTrip(id: string): FallbackTrip | null {
  return FALLBACK_TRIPS_BY_ID[id] ? { ...FALLBACK_TRIPS_BY_ID[id] } : null;
}

export function getFallbackFlights(tripId?: string | null): FallbackFlight[] {
  return FALLBACK_FLIGHTS.filter((flight) => !tripId || flight.tripId === tripId).map((flight) => ({ ...flight }));
}

export function getFallbackStays(tripId?: string | null): FallbackStay[] {
  return FALLBACK_STAYS.filter((stay) => !tripId || stay.tripId === tripId).map((stay) => ({ ...stay }));
}

export function getFallbackPlaces(filters: {
  city?: string | null;
  category?: string | null;
  visited?: string | null;
  tripDayId?: string | null;
  q?: string | null;
}): FallbackPlace[] {
  return FALLBACK_PLACES.filter((place) => {
    if (filters.city && place.city !== filters.city) {
      return false;
    }

    if (filters.category && place.category !== filters.category) {
      return false;
    }

    if (filters.visited !== null && filters.visited !== undefined && filters.visited !== "") {
      if (place.visited !== (filters.visited === "true")) {
        return false;
      }
    }

    if (filters.tripDayId && place.tripDayId !== filters.tripDayId) {
      return false;
    }

    if (filters.q && !place.name.toLowerCase().includes(filters.q.toLowerCase())) {
      return false;
    }

    return true;
  }).map((place) => ({ ...place }));
}