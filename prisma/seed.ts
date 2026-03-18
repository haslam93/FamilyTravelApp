// ─── Seed Script ─────────────────────────────────────────────────────────────
// Seeds the database with both family trips and all related data.
// Run: npx ts-node --compiler-options '{"module":"commonjs"}' prisma/seed.ts
// Or:  npx prisma db seed

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // ─── Clear existing data ──────────────────────────────────────────────────
  await prisma.calendarSync.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.document.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.stay.deleteMany();
  await prisma.place.deleteMany();
  await prisma.flight.deleteMany();
  await prisma.tripDay.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.settings.deleteMany();

  console.log("  ✓ Cleared existing data");

  // ─── Settings ─────────────────────────────────────────────────────────────
  await prisma.settings.create({
    data: {
      id: "app-settings",
      defaultTimezone: "Asia/Dubai",
    },
  });
  console.log("  ✓ Created settings");

  // ═══════════════════════════════════════════════════════════════════════════
  // TRIP 1: India Solo Adventure — April 10–20, 2026
  // ═══════════════════════════════════════════════════════════════════════════

  const indiaTrip = await prisma.trip.create({
    data: {
      id: "india-solo-2026",
      name: "Trip to Hyderabad",
      type: "SOLO",
      status: "PLANNING",
      startDate: new Date("2026-04-28"),
      endDate: new Date("2026-05-11"),
      cities: ["Hyderabad", "Delhi"],
      countries: ["India"],
      coverImage:
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80",
      description:
        "Hyderabad-first solo trip with a Delhi stop on the way back, based on the booked Etihad, IndiGo, and Emirates segments.",
      travelers: 1,
    },
  });
  console.log(`  ✓ Created trip: ${indiaTrip.name}`);

  // ─── India Trip Days ──────────────────────────────────────────────────────
  const indiaDays = [];
  // Days 1-9: Hyderabad (Apr 28–May 6)
  for (let i = 0; i < 9; i++) {
    indiaDays.push({
      date: new Date(`2026-${i < 3 ? "04" : "05"}-${String(i < 3 ? 28 + i : i - 2).padStart(2, "0")}`),
      dayNum: i + 1,
      city: "Hyderabad",
      country: "India",
      tripId: indiaTrip.id,
    });
  }
  // Days 10-14: Delhi (May 7–11)
  for (let i = 0; i < 5; i++) {
    indiaDays.push({
      date: new Date(`2026-05-${String(7 + i).padStart(2, "0")}`),
      dayNum: 10 + i,
      city: "Delhi",
      country: "India",
      tripId: indiaTrip.id,
    });
  }
  const createdIndiaDays = await Promise.all(
    indiaDays.map((d) => prisma.tripDay.create({ data: d }))
  );
  console.log(`  ✓ Created ${createdIndiaDays.length} trip days for India`);

  // ─── India Flights ────────────────────────────────────────────────────────
  const indiaFlights = await Promise.all([
    prisma.flight.create({
      data: {
        flightNumber: "EY22",
        confirmationCode: "STTKL",
        airline: "Etihad Airways",
        airlineCode: "EY",
        departureAirport: "YYZ",
        departureCity: "Toronto",
        arrivalAirport: "AUH",
        arrivalCity: "Abu Dhabi",
        scheduledDeparture: new Date("2026-04-28T15:10:00-04:00"),
        scheduledArrival: new Date("2026-04-29T12:30:00+04:00"),
        status: "SCHEDULED",
        terminal: "1",
        tripId: indiaTrip.id,
      },
    }),
    prisma.flight.create({
      data: {
        flightNumber: "EY358",
        confirmationCode: "STTKL",
        airline: "Etihad Airways",
        airlineCode: "EY",
        departureAirport: "AUH",
        departureCity: "Abu Dhabi",
        arrivalAirport: "HYD",
        arrivalCity: "Hyderabad",
        scheduledDeparture: new Date("2026-04-29T14:30:00+04:00"),
        scheduledArrival: new Date("2026-04-29T19:45:00+05:30"),
        status: "SCHEDULED",
        terminal: "A",
        tripId: indiaTrip.id,
      },
    }),
    prisma.flight.create({
      data: {
        flightNumber: "6E6202",
        confirmationCode: "CCGM9X",
        airline: "IndiGo",
        airlineCode: "6E",
        departureAirport: "HYD",
        departureCity: "Hyderabad",
        arrivalAirport: "DEL",
        arrivalCity: "Delhi",
        scheduledDeparture: new Date("2026-05-07T10:35:00+05:30"),
        scheduledArrival: new Date("2026-05-07T13:10:00+05:30"),
        status: "SCHEDULED",
        terminal: "1",
        tripId: indiaTrip.id,
      },
    }),
    prisma.flight.create({
      data: {
        flightNumber: "EK513",
        confirmationCode: "JMH5CJ",
        airline: "Emirates",
        airlineCode: "EK",
        departureAirport: "DEL",
        departureCity: "Delhi",
        arrivalAirport: "DXB",
        arrivalCity: "Dubai",
        scheduledDeparture: new Date("2026-05-10T04:25:00+05:30"),
        scheduledArrival: new Date("2026-05-10T06:25:00+04:00"),
        status: "SCHEDULED",
        terminal: "3",
        tripId: indiaTrip.id,
      },
    }),
    prisma.flight.create({
      data: {
        flightNumber: "EK241",
        confirmationCode: "JMH5CJ",
        airline: "Emirates",
        airlineCode: "EK",
        departureAirport: "DXB",
        departureCity: "Dubai",
        arrivalAirport: "YYZ",
        arrivalCity: "Toronto",
        scheduledDeparture: new Date("2026-05-11T03:30:00+04:00"),
        scheduledArrival: new Date("2026-05-11T09:30:00-04:00"),
        status: "SCHEDULED",
        terminal: "3",
        tripId: indiaTrip.id,
      },
    }),
  ]);
  console.log(`  ✓ Created ${indiaFlights.length} flights for India`);

  // ─── India Activities ─────────────────────────────────────────────────────
  // Day 1 (Apr 10) — Arrive in Hyderabad
  await prisma.activity.createMany({
    data: [
      {
        name: "Flight DXB → HYD",
        type: "FLIGHT",
        startTime: new Date("2026-04-10T03:30:00Z"),
        endTime: new Date("2026-04-10T08:45:00Z"),
        sortOrder: 1,
        tripDayId: createdIndiaDays[0].id,
        flightId: indiaFlights[0].id,
      },
      {
        name: "Hotel Check-in — Taj Falaknuma Palace",
        type: "HOTEL_CHECKIN",
        startTime: new Date("2026-04-10T14:00:00Z"),
        sortOrder: 2,
        tripDayId: createdIndiaDays[0].id,
      },
      {
        name: "Lunch at Paradise Biryani",
        type: "MEAL",
        startTime: new Date("2026-04-10T12:30:00Z"),
        endTime: new Date("2026-04-10T13:30:00Z"),
        notes: "Famous Hyderabadi biryani!",
        sortOrder: 3,
        tripDayId: createdIndiaDays[0].id,
      },
      {
        name: "Evening walk at Hussain Sagar Lake",
        type: "SIGHTSEEING",
        startTime: new Date("2026-04-10T17:00:00Z"),
        endTime: new Date("2026-04-10T19:00:00Z"),
        sortOrder: 4,
        tripDayId: createdIndiaDays[0].id,
      },
    ],
  });

  // Day 2 (Apr 11) — Charminar & Old City
  await prisma.activity.createMany({
    data: [
      {
        name: "Visit Charminar",
        type: "SIGHTSEEING",
        startTime: new Date("2026-04-11T09:00:00Z"),
        endTime: new Date("2026-04-11T11:00:00Z"),
        notes: "Iconic monument of Hyderabad, explore Laad Bazaar nearby",
        sortOrder: 1,
        tripDayId: createdIndiaDays[1].id,
      },
      {
        name: "Mecca Masjid visit",
        type: "PRAYER",
        startTime: new Date("2026-04-11T12:30:00Z"),
        endTime: new Date("2026-04-11T13:30:00Z"),
        notes: "One of the oldest and largest mosques in India",
        sortOrder: 2,
        tripDayId: createdIndiaDays[1].id,
      },
      {
        name: "Lunch at Shah Ghouse",
        type: "MEAL",
        startTime: new Date("2026-04-11T14:00:00Z"),
        sortOrder: 3,
        tripDayId: createdIndiaDays[1].id,
      },
      {
        name: "Shopping at Laad Bazaar",
        type: "SHOPPING",
        startTime: new Date("2026-04-11T15:30:00Z"),
        endTime: new Date("2026-04-11T17:30:00Z"),
        notes: "Famous for bangles and pearls",
        sortOrder: 4,
        tripDayId: createdIndiaDays[1].id,
      },
    ],
  });

  // Day 3 (Apr 12) — Golconda Fort & Qutb Shahi Tombs
  await prisma.activity.createMany({
    data: [
      {
        name: "Golconda Fort",
        type: "SIGHTSEEING",
        startTime: new Date("2026-04-12T08:00:00Z"),
        endTime: new Date("2026-04-12T12:00:00Z"),
        notes: "Explore the fort and the famous acoustic engineering",
        sortOrder: 1,
        tripDayId: createdIndiaDays[2].id,
      },
      {
        name: "Qutb Shahi Tombs",
        type: "SIGHTSEEING",
        startTime: new Date("2026-04-12T13:00:00Z"),
        endTime: new Date("2026-04-12T15:00:00Z"),
        sortOrder: 2,
        tripDayId: createdIndiaDays[2].id,
      },
      {
        name: "Dinner at Pista House",
        type: "MEAL",
        startTime: new Date("2026-04-12T19:00:00Z"),
        notes: "Try the famous haleem!",
        sortOrder: 3,
        tripDayId: createdIndiaDays[2].id,
      },
    ],
  });

  // Day 7 (Apr 16) — Travel to Delhi
  const dayIndex6 = 6; // Day 7 (index 6)
  await prisma.activity.createMany({
    data: [
      {
        name: "Hotel Check-out",
        type: "HOTEL_CHECKOUT",
        startTime: new Date("2026-04-16T04:00:00Z"),
        sortOrder: 1,
        tripDayId: createdIndiaDays[dayIndex6].id,
      },
      {
        name: "Flight HYD → DEL",
        type: "FLIGHT",
        startTime: new Date("2026-04-16T06:00:00Z"),
        endTime: new Date("2026-04-16T08:20:00Z"),
        sortOrder: 2,
        tripDayId: createdIndiaDays[dayIndex6].id,
        flightId: indiaFlights[1].id,
      },
      {
        name: "Hotel Check-in — The Imperial, New Delhi",
        type: "HOTEL_CHECKIN",
        startTime: new Date("2026-04-16T10:00:00Z"),
        sortOrder: 3,
        tripDayId: createdIndiaDays[dayIndex6].id,
      },
      {
        name: "India Gate & Rajpath walk",
        type: "SIGHTSEEING",
        startTime: new Date("2026-04-16T16:00:00Z"),
        endTime: new Date("2026-04-16T18:00:00Z"),
        sortOrder: 4,
        tripDayId: createdIndiaDays[dayIndex6].id,
      },
    ],
  });

  // Day 8 (Apr 17) — Old Delhi
  await prisma.activity.createMany({
    data: [
      {
        name: "Red Fort",
        type: "SIGHTSEEING",
        startTime: new Date("2026-04-17T09:00:00Z"),
        endTime: new Date("2026-04-17T11:30:00Z"),
        sortOrder: 1,
        tripDayId: createdIndiaDays[7].id,
      },
      {
        name: "Jama Masjid",
        type: "PRAYER",
        startTime: new Date("2026-04-17T12:00:00Z"),
        endTime: new Date("2026-04-17T13:00:00Z"),
        notes: "Largest mosque in India, beautiful Mughal architecture",
        sortOrder: 2,
        tripDayId: createdIndiaDays[7].id,
      },
      {
        name: "Chandni Chowk street food tour",
        type: "MEAL",
        startTime: new Date("2026-04-17T14:00:00Z"),
        endTime: new Date("2026-04-17T16:00:00Z"),
        notes: "Try paranthas, jalebi, and chaat!",
        sortOrder: 3,
        tripDayId: createdIndiaDays[7].id,
      },
    ],
  });

  // Day 11 (Apr 20) — Departure
  await prisma.activity.createMany({
    data: [
      {
        name: "Last-minute shopping at Dilli Haat",
        type: "SHOPPING",
        startTime: new Date("2026-04-20T10:00:00Z"),
        endTime: new Date("2026-04-20T13:00:00Z"),
        sortOrder: 1,
        tripDayId: createdIndiaDays[10].id,
      },
      {
        name: "Hotel Check-out",
        type: "HOTEL_CHECKOUT",
        startTime: new Date("2026-04-20T18:00:00Z"),
        sortOrder: 2,
        tripDayId: createdIndiaDays[10].id,
      },
      {
        name: "Flight DEL → DXB",
        type: "FLIGHT",
        startTime: new Date("2026-04-20T22:00:00Z"),
        endTime: new Date("2026-04-21T00:30:00Z"),
        sortOrder: 3,
        tripDayId: createdIndiaDays[10].id,
        flightId: indiaFlights[2].id,
      },
    ],
  });

  console.log("  ✓ Created activities for India trip");

  // ─── India Places ─────────────────────────────────────────────────────────
  await prisma.place.createMany({
    data: [
      {
        name: "Charminar",
        category: "LANDMARK",
        city: "Hyderabad",
        country: "India",
        latitude: 17.3616,
        longitude: 78.4747,
        rating: 4.5,
        kidFriendly: true,
        notes: "Iconic 16th-century monument",
        tripDayId: createdIndiaDays[1].id,
      },
      {
        name: "Golconda Fort",
        category: "LANDMARK",
        city: "Hyderabad",
        country: "India",
        latitude: 17.3833,
        longitude: 78.4011,
        rating: 4.6,
        kidFriendly: true,
        tripDayId: createdIndiaDays[2].id,
      },
      {
        name: "Paradise Biryani",
        category: "EAT",
        city: "Hyderabad",
        country: "India",
        latitude: 17.4401,
        longitude: 78.4489,
        rating: 4.3,
        priceLevel: 2,
        kidFriendly: true,
        tripDayId: createdIndiaDays[0].id,
      },
      {
        name: "Mecca Masjid",
        category: "PRAY",
        city: "Hyderabad",
        country: "India",
        latitude: 17.3604,
        longitude: 78.4736,
        rating: 4.7,
        tripDayId: createdIndiaDays[1].id,
      },
      {
        name: "Red Fort",
        category: "LANDMARK",
        city: "Delhi",
        country: "India",
        latitude: 28.6562,
        longitude: 77.241,
        rating: 4.5,
        kidFriendly: true,
        tripDayId: createdIndiaDays[7].id,
      },
      {
        name: "Jama Masjid",
        category: "PRAY",
        city: "Delhi",
        country: "India",
        latitude: 28.6507,
        longitude: 77.2334,
        rating: 4.6,
        tripDayId: createdIndiaDays[7].id,
      },
      {
        name: "India Gate",
        category: "LANDMARK",
        city: "Delhi",
        country: "India",
        latitude: 28.6129,
        longitude: 77.2295,
        rating: 4.7,
        kidFriendly: true,
        tripDayId: createdIndiaDays[6].id,
      },
      {
        name: "Chandni Chowk",
        category: "EAT",
        city: "Delhi",
        country: "India",
        latitude: 28.6506,
        longitude: 77.2301,
        rating: 4.4,
        priceLevel: 1,
        kidFriendly: true,
        notes: "Famous street food market",
        tripDayId: createdIndiaDays[7].id,
      },
    ],
  });
  console.log("  ✓ Created places for India trip");

  // ═══════════════════════════════════════════════════════════════════════════
  // TRIP 2: Egypt & Umrah Family Trip — December 5–22, 2026
  // ═══════════════════════════════════════════════════════════════════════════

  const familyTrip = await prisma.trip.create({
    data: {
      id: "family-egypt-saudi-2026",
      name: "Trip to Cairo and Umrah",
      type: "FAMILY",
      status: "PLANNING",
      startDate: new Date("2026-12-05"),
      endDate: new Date("2026-12-24"),
      cities: ["Cairo", "Sharm El Sheikh", "Madinah", "Makkah"],
      countries: ["Egypt", "Saudi Arabia"],
      coverImage:
        "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=1200&q=80",
      description:
        "Family trip covering Cairo, Sharm El Sheikh, and the Umrah leg in Madinah and Makkah, seeded from the booked flights and hotel confirmations.",
      travelers: 5,
    },
  });
  console.log(`  ✓ Created trip: ${familyTrip.name}`);

  // ─── Family Trip Days ─────────────────────────────────────────────────────
  const familyDays = [];
  // Days 1-4: Cairo (Dec 5–8)
  for (let i = 0; i < 4; i++) {
    familyDays.push({
      date: new Date(`2026-12-0${5 + i}`),
      dayNum: i + 1,
      city: "Cairo",
      country: "Egypt",
      tripId: familyTrip.id,
    });
  }
  // Days 5-7: Sharm El Sheikh (Dec 9–11)
  for (let i = 0; i < 3; i++) {
    familyDays.push({
      date: new Date(`2026-12-${String(9 + i).padStart(2, "0")}`),
      dayNum: 5 + i,
      city: "Sharm El Sheikh",
      country: "Egypt",
      tripId: familyTrip.id,
    });
  }
  // Days 8-10: Cairo (Dec 12–14)
  for (let i = 0; i < 3; i++) {
    familyDays.push({
      date: new Date(`2026-12-${12 + i}`),
      dayNum: 8 + i,
      city: "Cairo",
      country: "Egypt",
      tripId: familyTrip.id,
    });
  }
  // Days 11-14: Madinah (Dec 15–18)
  for (let i = 0; i < 4; i++) {
    familyDays.push({
      date: new Date(`2026-12-${15 + i}`),
      dayNum: 11 + i,
      city: "Madinah",
      country: "Saudi Arabia",
      tripId: familyTrip.id,
    });
  }
  // Days 15-19: Makkah (Dec 19–23)
  for (let i = 0; i < 5; i++) {
    familyDays.push({
      date: new Date(`2026-12-${19 + i}`),
      dayNum: 15 + i,
      city: "Makkah",
      country: "Saudi Arabia",
      tripId: familyTrip.id,
    });
  }
  // Day 20: Cairo return (Dec 24)
  familyDays.push({
    date: new Date("2026-12-24"),
    dayNum: 20,
    city: "Cairo",
    country: "Egypt",
    tripId: familyTrip.id,
  });
  const createdFamilyDays = await Promise.all(
    familyDays.map((d) => prisma.tripDay.create({ data: d }))
  );
  console.log(`  ✓ Created ${createdFamilyDays.length} trip days for family trip`);

  // ─── Family Flights ───────────────────────────────────────────────────────
  const familyFlights = await Promise.all([
    prisma.flight.create({
      data: {
        flightNumber: "MS996",
        airline: "EgyptAir",
        airlineCode: "MS",
        departureAirport: "YYZ",
        departureCity: "Toronto",
        arrivalAirport: "CAI",
        arrivalCity: "Cairo",
        scheduledDeparture: new Date("2026-12-05T12:00:00-05:00"),
        scheduledArrival: new Date("2026-12-06T05:25:00+02:00"),
        status: "SCHEDULED",
        terminal: "1",
        tripId: familyTrip.id,
      },
    }),
    prisma.flight.create({
      data: {
        flightNumber: "MS762",
        airline: "EgyptAir",
        airlineCode: "MS",
        departureAirport: "CAI",
        departureCity: "Cairo",
        arrivalAirport: "SSH",
        arrivalCity: "Sharm El Sheikh",
        scheduledDeparture: new Date("2026-12-09T14:00:00+02:00"),
        scheduledArrival: new Date("2026-12-09T15:05:00+02:00"),
        status: "SCHEDULED",
        terminal: "1",
        confirmationCode: "CAISHARM",
        tripId: familyTrip.id,
      },
    }),
    prisma.flight.create({
      data: {
        flightNumber: "SV1277",
        airline: "Saudia",
        airlineCode: "SV",
        departureAirport: "CAI",
        departureCity: "Cairo",
        arrivalAirport: "MED",
        arrivalCity: "Madinah",
        scheduledDeparture: new Date("2026-12-15T16:45:00+02:00"),
        scheduledArrival: new Date("2026-12-15T19:35:00+03:00"),
        status: "SCHEDULED",
        terminal: "5",
        tripId: familyTrip.id,
      },
    }),
    prisma.flight.create({
      data: {
        flightNumber: "MS664",
        airline: "EgyptAir",
        airlineCode: "MS",
        departureAirport: "JED",
        departureCity: "Jeddah",
        arrivalAirport: "CAI",
        arrivalCity: "Cairo",
        scheduledDeparture: new Date("2026-12-24T12:00:00+03:00"),
        scheduledArrival: new Date("2026-12-24T13:20:00+02:00"),
        status: "SCHEDULED",
        terminal: "1",
        tripId: familyTrip.id,
      },
    }),
  ]);
  console.log(`  ✓ Created ${familyFlights.length} flights for family trip`);

  await prisma.stay.createMany({
    data: [
      {
        hotelName: "Cairo Marriott Hotel",
        address: "16 Saray El Gezira Street, Zamalek, Cairo 11211, Egypt",
        city: "Cairo",
        country: "Egypt",
        checkIn: new Date("2026-12-05T14:00:00+02:00"),
        checkOut: new Date("2026-12-09T12:00:00+02:00"),
        checkInLabel: "2:00 PM GMT+2",
        checkOutLabel: "12:00 PM GMT+2",
        guests: 5,
        tripId: familyTrip.id,
      },
      {
        hotelName: "Sunstaro Royal Beach Resort",
        address: "Ras Nosrani Bay, 46619 Sharm El Sheikh, Egypt",
        city: "Sharm El Sheikh",
        country: "Egypt",
        checkIn: new Date("2026-12-09T14:00:00+02:00"),
        checkOut: new Date("2026-12-12T12:00:00+02:00"),
        checkInLabel: "2:00 PM GMT+2",
        checkOutLabel: "12:00 PM GMT+2",
        guests: 5,
        tripId: familyTrip.id,
      },
      {
        hotelName: "Hilton Cairo Heliopolis",
        address: "El-Orouba, Qism El Nozha, Cairo Governorate 2466, Cairo, Egypt",
        city: "Cairo",
        country: "Egypt",
        checkIn: new Date("2026-12-12T14:00:00+02:00"),
        checkOut: new Date("2026-12-15T12:00:00+02:00"),
        checkInLabel: "2:00 PM GMT+2",
        checkOutLabel: "12:00 PM GMT+2",
        guests: 5,
        tripId: familyTrip.id,
      },
      {
        hotelName: "Madinah Hilton",
        address: "Opposite Prophet Mosque, King Fahad St, Madinah 41419, Saudi Arabia",
        city: "Madinah",
        country: "Saudi Arabia",
        checkIn: new Date("2026-12-15T22:00:00+03:00"),
        checkOut: new Date("2026-12-19T12:00:00+03:00"),
        checkInLabel: "10:00 PM GMT+3",
        checkOutLabel: "12:00 PM GMT+3",
        guests: 5,
        tripId: familyTrip.id,
      },
      {
        hotelName: "Hilton Suites Jabal Omar Makkah",
        address: "Jabal Omar, Ibrahim Al Khalil, Makkah 24231, Saudi Arabia",
        city: "Makkah",
        country: "Saudi Arabia",
        checkIn: new Date("2026-12-19T16:00:00+03:00"),
        checkOut: new Date("2026-12-22T12:00:00+03:00"),
        checkInLabel: "4:00 PM GMT+3",
        checkOutLabel: "12:00 PM GMT+3",
        guests: 5,
        tripId: familyTrip.id,
      },
    ],
  });
  console.log("  ✓ Created stays for family trip");

  // ─── Family Activities ────────────────────────────────────────────────────
  // Day 1 (Dec 5) — Arrive Cairo
  await prisma.activity.createMany({
    data: [
      {
        name: "Flight DXB → CAI",
        type: "FLIGHT",
        startTime: new Date("2026-12-05T08:00:00Z"),
        endTime: new Date("2026-12-05T10:10:00Z"),
        sortOrder: 1,
        tripDayId: createdFamilyDays[0].id,
        flightId: familyFlights[0].id,
      },
      {
        name: "Hotel Check-in — Marriott Mena House",
        type: "HOTEL_CHECKIN",
        startTime: new Date("2026-12-05T12:00:00Z"),
        notes: "Pyramids-view rooms confirmed!",
        sortOrder: 2,
        tripDayId: createdFamilyDays[0].id,
      },
      {
        name: "Lunch at Koshary Abou Tarek",
        type: "MEAL",
        startTime: new Date("2026-12-05T13:30:00Z"),
        notes: "Best koshary in Cairo — the kids will love it!",
        sortOrder: 3,
        tripDayId: createdFamilyDays[0].id,
      },
      {
        name: "Rest & settle in",
        type: "REST",
        startTime: new Date("2026-12-05T15:00:00Z"),
        endTime: new Date("2026-12-05T17:00:00Z"),
        notes: "Let kids nap after the flight",
        sortOrder: 4,
        tripDayId: createdFamilyDays[0].id,
      },
    ],
  });

  // Day 2 (Dec 6) — Pyramids Day!
  await prisma.activity.createMany({
    data: [
      {
        name: "Pyramids of Giza 🏛️",
        type: "SIGHTSEEING",
        startTime: new Date("2026-12-06T08:00:00Z"),
        endTime: new Date("2026-12-06T12:00:00Z"),
        notes: "Camel rides available for kids! Get there early to avoid crowds.",
        sortOrder: 1,
        tripDayId: createdFamilyDays[1].id,
      },
      {
        name: "Great Sphinx",
        type: "SIGHTSEEING",
        startTime: new Date("2026-12-06T12:30:00Z"),
        endTime: new Date("2026-12-06T13:30:00Z"),
        sortOrder: 2,
        tripDayId: createdFamilyDays[1].id,
      },
      {
        name: "Lunch at 9 Pyramids Lounge",
        type: "MEAL",
        startTime: new Date("2026-12-06T14:00:00Z"),
        notes: "Beautiful view of the pyramids while eating!",
        sortOrder: 3,
        tripDayId: createdFamilyDays[1].id,
      },
      {
        name: "Sound & Light Show at Pyramids",
        type: "SIGHTSEEING",
        startTime: new Date("2026-12-06T18:30:00Z"),
        endTime: new Date("2026-12-06T20:00:00Z"),
        notes: "Kids love this! Dress warmly for the evening.",
        sortOrder: 4,
        tripDayId: createdFamilyDays[1].id,
      },
    ],
  });

  // Day 3 (Dec 7) — Egyptian Museum & Khan El Khalili
  await prisma.activity.createMany({
    data: [
      {
        name: "Grand Egyptian Museum",
        type: "SIGHTSEEING",
        startTime: new Date("2026-12-07T09:00:00Z"),
        endTime: new Date("2026-12-07T12:00:00Z"),
        notes: "Tutankhamun gallery is a must! Baby carrier recommended.",
        sortOrder: 1,
        tripDayId: createdFamilyDays[2].id,
      },
      {
        name: "Khan El Khalili Bazaar",
        type: "SHOPPING",
        startTime: new Date("2026-12-07T14:00:00Z"),
        endTime: new Date("2026-12-07T17:00:00Z"),
        notes: "Spices, souvenirs, and Egyptian crafts. Watch kids around the narrow alleys!",
        sortOrder: 2,
        tripDayId: createdFamilyDays[2].id,
      },
    ],
  });

  // Day 5 (Dec 9) — Travel to Sharm
  await prisma.activity.createMany({
    data: [
      {
        name: "Hotel Check-out — Marriott Mena House",
        type: "HOTEL_CHECKOUT",
        startTime: new Date("2026-12-09T05:00:00Z"),
        sortOrder: 1,
        tripDayId: createdFamilyDays[4].id,
      },
      {
        name: "Flight CAI → SSH",
        type: "FLIGHT",
        startTime: new Date("2026-12-09T07:00:00Z"),
        endTime: new Date("2026-12-09T08:00:00Z"),
        sortOrder: 2,
        tripDayId: createdFamilyDays[4].id,
        flightId: familyFlights[1].id,
      },
      {
        name: "Hotel Check-in — Rixos Sharm El Sheikh",
        type: "HOTEL_CHECKIN",
        startTime: new Date("2026-12-09T10:00:00Z"),
        notes: "All-inclusive resort with kids' club!",
        sortOrder: 3,
        tripDayId: createdFamilyDays[4].id,
      },
      {
        name: "Beach & Pool Day 🏖️",
        type: "REST",
        startTime: new Date("2026-12-09T11:00:00Z"),
        endTime: new Date("2026-12-09T17:00:00Z"),
        notes: "Relax at the resort. Kids pool has slides!",
        sortOrder: 4,
        tripDayId: createdFamilyDays[4].id,
      },
    ],
  });

  // Day 9 (Dec 13) — Travel to Makkah
  await prisma.activity.createMany({
    data: [
      {
        name: "Hotel Check-out — Rixos",
        type: "HOTEL_CHECKOUT",
        startTime: new Date("2026-12-13T07:00:00Z"),
        sortOrder: 1,
        tripDayId: createdFamilyDays[8].id,
      },
      {
        name: "Flight SSH → JED",
        type: "FLIGHT",
        startTime: new Date("2026-12-13T10:00:00Z"),
        endTime: new Date("2026-12-13T12:30:00Z"),
        sortOrder: 2,
        tripDayId: createdFamilyDays[8].id,
        flightId: familyFlights[2].id,
      },
      {
        name: "Drive Jeddah → Makkah",
        type: "TRANSPORT",
        startTime: new Date("2026-12-13T14:00:00Z"),
        endTime: new Date("2026-12-13T15:00:00Z"),
        notes: "Pre-booked private car with car seats for kids",
        sortOrder: 3,
        tripDayId: createdFamilyDays[8].id,
      },
      {
        name: "Hotel Check-in — Makkah Clock Tower",
        type: "HOTEL_CHECKIN",
        startTime: new Date("2026-12-13T15:30:00Z"),
        notes: "Walking distance to Masjid al-Haram",
        sortOrder: 4,
        tripDayId: createdFamilyDays[8].id,
      },
      {
        name: "Enter Ihram & Perform Umrah",
        type: "UMRAH",
        startTime: new Date("2026-12-13T18:00:00Z"),
        notes: "Tawaf after Isha — less crowded. Bring stroller for kids.",
        sortOrder: 5,
        tripDayId: createdFamilyDays[8].id,
      },
    ],
  });

  // Day 10 (Dec 14) — Makkah worship
  await prisma.activity.createMany({
    data: [
      {
        name: "Fajr prayer at Masjid al-Haram",
        type: "PRAYER",
        startTime: new Date("2026-12-14T05:00:00Z"),
        sortOrder: 1,
        tripDayId: createdFamilyDays[9].id,
      },
      {
        name: "Rest & Kids time",
        type: "REST",
        startTime: new Date("2026-12-14T07:00:00Z"),
        endTime: new Date("2026-12-14T10:00:00Z"),
        notes: "Let kids play in hotel, have breakfast",
        sortOrder: 2,
        tripDayId: createdFamilyDays[9].id,
      },
      {
        name: "Dhuhr prayer & Tawaf",
        type: "PRAYER",
        startTime: new Date("2026-12-14T12:00:00Z"),
        endTime: new Date("2026-12-14T14:00:00Z"),
        sortOrder: 3,
        tripDayId: createdFamilyDays[9].id,
      },
      {
        name: "Zamzam water & du'a",
        type: "UMRAH",
        startTime: new Date("2026-12-14T15:00:00Z"),
        notes: "Fill Zamzam bottles to take home!",
        sortOrder: 4,
        tripDayId: createdFamilyDays[9].id,
      },
    ],
  });

  // Day 14 (Dec 18) — Travel to Madinah
  await prisma.activity.createMany({
    data: [
      {
        name: "Hotel Check-out — Makkah",
        type: "HOTEL_CHECKOUT",
        startTime: new Date("2026-12-18T06:00:00Z"),
        sortOrder: 1,
        tripDayId: createdFamilyDays[13].id,
      },
      {
        name: "Drive Makkah → Madinah (Haramain Express or car)",
        type: "TRANSPORT",
        startTime: new Date("2026-12-18T08:00:00Z"),
        endTime: new Date("2026-12-18T12:00:00Z"),
        notes: "Haramain High-Speed Railway — kids love trains!",
        sortOrder: 2,
        tripDayId: createdFamilyDays[13].id,
      },
      {
        name: "Hotel Check-in — Madinah Hilton",
        type: "HOTEL_CHECKIN",
        startTime: new Date("2026-12-18T13:00:00Z"),
        sortOrder: 3,
        tripDayId: createdFamilyDays[13].id,
      },
      {
        name: "Asr & Maghrib at Masjid an-Nabawi",
        type: "PRAYER",
        startTime: new Date("2026-12-18T15:00:00Z"),
        endTime: new Date("2026-12-18T18:00:00Z"),
        notes: "Try to visit the Rawdah (green carpet area). Amazing experience!",
        sortOrder: 4,
        tripDayId: createdFamilyDays[13].id,
      },
    ],
  });

  // Day 18 (Dec 22) — Departure
  await prisma.activity.createMany({
    data: [
      {
        name: "Fajr prayer at Masjid an-Nabawi",
        type: "PRAYER",
        startTime: new Date("2026-12-22T05:00:00Z"),
        sortOrder: 1,
        tripDayId: createdFamilyDays[17].id,
      },
      {
        name: "Hotel Check-out",
        type: "HOTEL_CHECKOUT",
        startTime: new Date("2026-12-22T12:00:00Z"),
        sortOrder: 2,
        tripDayId: createdFamilyDays[17].id,
      },
      {
        name: "Flight MED → DXB",
        type: "FLIGHT",
        startTime: new Date("2026-12-22T18:00:00Z"),
        endTime: new Date("2026-12-22T21:30:00Z"),
        sortOrder: 3,
        tripDayId: createdFamilyDays[17].id,
        flightId: familyFlights[3].id,
      },
    ],
  });

  console.log("  ✓ Created activities for family trip");

  // ─── Family Places ────────────────────────────────────────────────────────
  await prisma.place.createMany({
    data: [
      // Cairo
      {
        name: "Pyramids of Giza",
        category: "LANDMARK",
        city: "Cairo",
        country: "Egypt",
        latitude: 29.9792,
        longitude: 31.1342,
        rating: 4.8,
        kidFriendly: true,
        notes: "Camel rides, photo spots. Go early morning!",
        tripDayId: createdFamilyDays[1].id,
      },
      {
        name: "Great Sphinx",
        category: "LANDMARK",
        city: "Cairo",
        country: "Egypt",
        latitude: 29.9753,
        longitude: 31.1376,
        rating: 4.7,
        kidFriendly: true,
        tripDayId: createdFamilyDays[1].id,
      },
      {
        name: "Grand Egyptian Museum",
        category: "MUSEUM",
        city: "Cairo",
        country: "Egypt",
        latitude: 29.9949,
        longitude: 31.1171,
        rating: 4.7,
        kidFriendly: true,
        notes: "Book tickets online in advance",
        tripDayId: createdFamilyDays[2].id,
      },
      {
        name: "Khan El Khalili",
        category: "SHOP",
        city: "Cairo",
        country: "Egypt",
        latitude: 30.0477,
        longitude: 31.2627,
        rating: 4.4,
        kidFriendly: false,
        notes: "Narrow alleys — stroller difficult. Bring baby carrier.",
        tripDayId: createdFamilyDays[2].id,
      },
      {
        name: "Koshary Abou Tarek",
        category: "EAT",
        city: "Cairo",
        country: "Egypt",
        latitude: 30.0517,
        longitude: 31.2464,
        rating: 4.5,
        priceLevel: 1,
        kidFriendly: true,
        tripDayId: createdFamilyDays[0].id,
      },
      // Sharm El Sheikh
      {
        name: "Ras Mohammed National Park",
        category: "PARK",
        city: "Sharm El Sheikh",
        country: "Egypt",
        latitude: 27.7313,
        longitude: 34.2539,
        rating: 4.7,
        kidFriendly: true,
        notes: "Snorkeling and glass-bottom boats for kids",
        tripDayId: createdFamilyDays[5].id,
      },
      {
        name: "Naama Bay Beach",
        category: "BEACH",
        city: "Sharm El Sheikh",
        country: "Egypt",
        latitude: 27.9076,
        longitude: 34.3293,
        rating: 4.5,
        kidFriendly: true,
        tripDayId: createdFamilyDays[4].id,
      },
      // Makkah
      {
        name: "Masjid al-Haram",
        category: "PRAY",
        city: "Makkah",
        country: "Saudi Arabia",
        latitude: 21.4225,
        longitude: 39.8262,
        rating: 5.0,
        kidFriendly: true,
        notes: "Wheelchair & stroller access available. Use rooftop during crowded times.",
        tripDayId: createdFamilyDays[8].id,
      },
      {
        name: "Abraj Al-Bait (Clock Tower Mall)",
        category: "SHOP",
        city: "Makkah",
        country: "Saudi Arabia",
        latitude: 21.4186,
        longitude: 39.8264,
        rating: 4.5,
        kidFriendly: true,
        notes: "Great food court & shopping. Connected to hotel.",
        tripDayId: createdFamilyDays[9].id,
      },
      // Madinah
      {
        name: "Masjid an-Nabawi",
        category: "PRAY",
        city: "Madinah",
        country: "Saudi Arabia",
        latitude: 24.4672,
        longitude: 39.6112,
        rating: 5.0,
        kidFriendly: true,
        notes: "Rawdah visits require separate scheduling. Beautiful umbrella plaza for kids!",
        tripDayId: createdFamilyDays[13].id,
      },
      {
        name: "Masjid Quba",
        category: "PRAY",
        city: "Madinah",
        country: "Saudi Arabia",
        latitude: 24.4398,
        longitude: 39.6167,
        rating: 4.8,
        kidFriendly: true,
        notes: "Praying 2 rak'ahs here = reward of Umrah",
        tripDayId: createdFamilyDays[14].id,
      },
      {
        name: "Dates market (Souq al-Tamoor)",
        category: "SHOP",
        city: "Madinah",
        country: "Saudi Arabia",
        latitude: 24.4707,
        longitude: 39.6138,
        rating: 4.3,
        priceLevel: 2,
        kidFriendly: true,
        notes: "Buy Ajwa & Safawi dates. Kids love sampling!",
        tripDayId: createdFamilyDays[14].id,
      },
    ],
  });
  console.log("  ✓ Created places for family trip");

  // ─── Documents ────────────────────────────────────────────────────────────
  await prisma.document.createMany({
    data: [
      {
        name: "Hammad Passport",
        type: "PASSPORT",
        fileUrl: "https://placeholder.blob.core.windows.net/docs/passport-hammad.pdf",
        fileName: "passport-hammad.pdf",
        fileSize: 1024000,
        mimeType: "application/pdf",
        tripId: familyTrip.id,
      },
      {
        name: "Egypt Visa — Family",
        type: "VISA",
        fileUrl: "https://placeholder.blob.core.windows.net/docs/egypt-visa.pdf",
        fileName: "egypt-visa-family.pdf",
        fileSize: 512000,
        mimeType: "application/pdf",
        tripId: familyTrip.id,
      },
      {
        name: "Emirates DXB→CAI Booking",
        type: "FLIGHT_BOOKING",
        fileUrl: "https://placeholder.blob.core.windows.net/docs/ek927-booking.pdf",
        fileName: "ek927-booking.pdf",
        fileSize: 256000,
        mimeType: "application/pdf",
        tripId: familyTrip.id,
      },
      {
        name: "Marriott Mena House Confirmation",
        type: "HOTEL_BOOKING",
        fileUrl: "https://placeholder.blob.core.windows.net/docs/marriott-cairo.pdf",
        fileName: "marriott-mena-house.pdf",
        fileSize: 384000,
        mimeType: "application/pdf",
        tripId: familyTrip.id,
      },
      {
        name: "Travel Insurance — Family",
        type: "INSURANCE",
        fileUrl: "https://placeholder.blob.core.windows.net/docs/insurance.pdf",
        fileName: "travel-insurance-family.pdf",
        fileSize: 768000,
        mimeType: "application/pdf",
        tripId: familyTrip.id,
      },
      {
        name: "Umrah E-Permit",
        type: "UMRAH_PERMIT",
        fileUrl: "https://placeholder.blob.core.windows.net/docs/umrah-permit.pdf",
        fileName: "umrah-permit-2026.pdf",
        fileSize: 192000,
        mimeType: "application/pdf",
        tripId: familyTrip.id,
      },
      {
        name: "India Visa — Hammad",
        type: "VISA",
        fileUrl: "https://placeholder.blob.core.windows.net/docs/india-visa.pdf",
        fileName: "india-visa-hammad.pdf",
        fileSize: 256000,
        mimeType: "application/pdf",
        tripId: indiaTrip.id,
      },
      {
        name: "Emirates DXB→HYD Booking",
        type: "FLIGHT_BOOKING",
        fileUrl: "https://placeholder.blob.core.windows.net/docs/ek504-booking.pdf",
        fileName: "ek504-booking.pdf",
        fileSize: 256000,
        mimeType: "application/pdf",
        tripId: indiaTrip.id,
      },
    ],
  });
  console.log("  ✓ Created documents for both trips");

  console.log("\n✅ Database seeded successfully!");
  console.log(`   • ${2} trips`);
  console.log(`   • ${createdIndiaDays.length + createdFamilyDays.length} trip days`);
  console.log(`   • ${indiaFlights.length + familyFlights.length} flights`);
  console.log(`   • Places & activities populated`);
  console.log(`   • Documents & settings created`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
