import { useSyncExternalStore } from "react";

export type UserRole = "parent" | "groomer";

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string | undefined;
  shopName?: string | undefined;
  shopAddress?: string | undefined;
  shopArea?: string | undefined;
};

export type Pet = {
  id: string;
  name: string;
  breed: string;
  e: string;
  coat: number;
  mood: number;
};

export type Booking = {
  id: string;
  petId: string;
  petName?: string | undefined;
  petBreed?: string | undefined;
  petEmoji?: string | undefined;
  customerName?: string | undefined;
  customerPhone?: string | undefined;
  centerId?: string | undefined;
  centerName?: string | undefined;
  plan: string;
  addons: string[];
  date: string;
  time: string;
  total: number;
  status: "upcoming" | "in-progress" | "done" | "cancelled";
  currentStep?: number | undefined;
  notes?: string | undefined;
};

export type LiveBroadcast = {
  isBroadcasting: boolean;
  activeCam: "Tub Cam 01" | "Styling Suite 02" | "Drying Bay 03";
  isRecording: boolean;
  recordingSeconds: number;
  lastSnapshotTime?: string | undefined;
  petInCam: string;
  groomerNotes: string;
  recordedClips: {
    id: string;
    title: string;
    duration: string;
    time: string;
    stage: string;
    thumbnailEmoji: string;
  }[];
  liveSnapshots: {
    id: string;
    title: string;
    time: string;
    emoji: string;
    stage: string;
  }[];
};

export type GroomingCenter = {
  id: string;
  name: string;
  ownerName: string;
  address: string;
  area: string;
  city: string;
  distance: string;
  rating: number;
  reviews: number;
  lat: number;
  lng: number;
  xPercent: number;
  yPercent: number;
  phone: string;
  openHours: string;
  slotsAvailable: number;
  amenities: string[];
  verified: boolean;
};

type State = {
  currentUser: User | null;
  pets: Pet[];
  bookings: Booking[];
  points: number;
  step: number;
  centers: GroomingCenter[];
  broadcast: LiveBroadcast;
};

export const PLANS = [
  { id: "Splash", price: 799, e: "🛁", mins: 45, items: ["Bubble bath", "Blow dry", "Ear clean"] },
  { id: "Spa", price: 1499, e: "✨", mins: 90, items: ["Everything in Splash", "Breed haircut", "Pawdicure", "Teeth sparkle"] },
  { id: "Royal", price: 2499, e: "👑", mins: 150, items: ["Everything in Spa", "Health scan", "Aromatherapy", "Photo shoot"] },
] as const;

export const ADDONS = [
  { id: "De-shedding", price: 299 },
  { id: "Flea shield", price: 349 },
  { id: "Nail art", price: 199 },
  { id: "Pickup & drop", price: 249 },
];

export const SLOTS = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

export const GROOMING_STEPS = ["Check-in", "Bubble bath", "Blow dry", "Haircut", "Pawdicure", "Ready!"];

export function priceFor(plan: string, addons: string[], points = 0, usePoints = false) {
  const base = PLANS.find((p) => p.id === plan)?.price ?? 0;
  const add = addons.reduce((s, a) => s + (ADDONS.find((x) => x.id === a)?.price ?? 0), 0);
  const discount = usePoints ? Math.min(points, base + add) : 0;
  return { base, add, discount, total: base + add - discount };
}

export const INITIAL_CENTERS: GroomingCenter[] = [
  {
    id: "gc-1",
    name: "Fur&Fern Flagship Spa & Sanctuary",
    ownerName: "Sarah M.",
    address: "24th Main, Sector 2, HSR Layout",
    area: "HSR Layout",
    city: "Bengaluru",
    distance: "0.8 km away",
    rating: 4.9,
    reviews: 428,
    lat: 12.9121,
    lng: 77.6446,
    xPercent: 55,
    yPercent: 65,
    phone: "+91 98765 43210",
    openHours: "09:00 AM – 08:00 PM",
    slotsAvailable: 6,
    amenities: ["Hydro-massage", "Organic aromatherapy", "Live HD Cam", "Cat-only quiet room"],
    verified: true,
  },
  {
    id: "gc-2",
    name: "Pawsh Canine & Feline Lounge",
    ownerName: "Vikram Das",
    address: "100ft Road, Near Sony Signal, Koramangala",
    area: "Koramangala",
    city: "Bengaluru",
    distance: "2.1 km away",
    rating: 4.8,
    reviews: 310,
    lat: 12.9352,
    lng: 77.6245,
    xPercent: 40,
    yPercent: 45,
    phone: "+91 98451 22334",
    openHours: "09:30 AM – 07:30 PM",
    slotsAvailable: 4,
    amenities: ["Breed styling", "Mud bath therapy", "Pickup & Drop", "Puppy nursery"],
    verified: true,
  },
  {
    id: "gc-3",
    name: "The Velvet Tail Grooming Studio",
    ownerName: "Ananya Roy",
    address: "12th Main, HAL 2nd Stage, Indiranagar",
    area: "Indiranagar",
    city: "Bengaluru",
    distance: "4.5 km away",
    rating: 4.9,
    reviews: 512,
    lat: 12.9784,
    lng: 77.6408,
    xPercent: 68,
    yPercent: 28,
    phone: "+91 97412 88990",
    openHours: "08:30 AM – 08:30 PM",
    slotsAvailable: 8,
    amenities: ["Ultrasonic teeth sparkle", "Fear-Free certified", "Outdoor play yard", "Live Cam"],
    verified: true,
  },
  {
    id: "gc-4",
    name: "Bubbles & Barks Wellness Hub",
    ownerName: "Karthik Nair",
    address: "ITPL Main Road, Prestige Shantiniketan, Whitefield",
    area: "Whitefield",
    city: "Bengaluru",
    distance: "7.8 km away",
    rating: 4.7,
    reviews: 198,
    lat: 12.9868,
    lng: 77.7378,
    xPercent: 88,
    yPercent: 35,
    phone: "+91 99001 77665",
    openHours: "10:00 AM – 07:00 PM",
    slotsAvailable: 5,
    amenities: ["Large breed specialists", "Flea dips", "Grooming photo studio"],
    verified: true,
  },
];

const KEY = "furfern-v3";

const initial: State = {
  currentUser: {
    id: "u-parent-demo",
    name: "Alex Morgan",
    email: "parent@furfern.in",
    role: "parent",
    phone: "+91 98765 12345",
  },
  pets: [
    { id: "p1", name: "Biscuit", breed: "Goldendoodle", e: "🐶", coat: 92, mood: 98 },
    { id: "p2", name: "Miso", breed: "Persian cat", e: "🐱", coat: 78, mood: 85 },
  ],
  bookings: [
    {
      id: "b-101",
      petId: "p1",
      petName: "Biscuit",
      petBreed: "Goldendoodle",
      petEmoji: "🐶",
      customerName: "Alex Morgan",
      customerPhone: "+91 98765 12345",
      centerId: "gc-1",
      centerName: "Fur&Fern Flagship Spa & Sanctuary",
      plan: "Spa",
      addons: ["Nail art", "Pickup & drop"],
      date: new Date().toDateString(),
      time: "10:30",
      total: 1947,
      status: "in-progress",
      currentStep: 2, // Blow dry
      notes: "Sensitive ears, prefers lavender shampoo",
    },
    {
      id: "b-102",
      petId: "p2",
      petName: "Miso",
      petBreed: "Persian cat",
      petEmoji: "🐱",
      customerName: "Alex Morgan",
      customerPhone: "+91 98765 12345",
      centerId: "gc-1",
      centerName: "Fur&Fern Flagship Spa & Sanctuary",
      plan: "Royal",
      addons: ["De-shedding"],
      date: new Date(Date.now() + 86400000).toDateString(),
      time: "14:00",
      total: 2798,
      status: "upcoming",
      currentStep: 0,
      notes: "First time at the studio, gentle handling requested",
    },
    {
      id: "b-103",
      petId: "p-ext-1",
      petName: "Bruno",
      petBreed: "German Shepherd",
      petEmoji: "🐕",
      customerName: "Priya Sharma",
      customerPhone: "+91 98221 44556",
      centerId: "gc-1",
      centerName: "Fur&Fern Flagship Spa & Sanctuary",
      plan: "Splash",
      addons: ["Flea shield"],
      date: new Date().toDateString(),
      time: "09:00",
      total: 1148,
      status: "done",
      currentStep: 5,
      notes: "Loves belly rubs during towel dry",
    },
  ],
  points: 450,
  step: 2,
  centers: INITIAL_CENTERS,
  broadcast: {
    isBroadcasting: true,
    activeCam: "Tub Cam 01",
    isRecording: false,
    recordingSeconds: 0,
    petInCam: "Biscuit 🐶",
    groomerNotes: "Blow dry in progress with warm lavender air",
    recordedClips: [
      {
        id: "clip-1",
        title: "Bubble Bath Warm Soak",
        duration: "0:45",
        time: "10:18 AM",
        stage: "Bubble bath",
        thumbnailEmoji: "🫧",
      },
      {
        id: "clip-2",
        title: "Gentle Fluff Blowout",
        duration: "1:12",
        time: "10:35 AM",
        stage: "Blow dry",
        thumbnailEmoji: "💨",
      },
    ],
    liveSnapshots: [
      { id: "snap-1", title: "Arrival Check-in Snack", time: "10:05 AM", emoji: "🦴", stage: "Check-in" },
      { id: "snap-2", title: "Oatmeal Bubble Foam Hat", time: "10:22 AM", emoji: "🫧", stage: "Bubble bath" },
      { id: "snap-3", title: "Fluffy Coat Drying Session", time: "10:40 AM", emoji: "💨", stage: "Blow dry" },
    ],
  },
};

let state: State = initial;
let loaded = false;
const subs = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const s = localStorage.getItem(KEY);
    if (s) {
      const parsed = JSON.parse(s);
      state = { ...initial, ...parsed };
      if (!state.centers || state.centers.length === 0) {
        state.centers = INITIAL_CENTERS;
      }
      if (!state.broadcast) {
        state.broadcast = initial.broadcast;
      }
    }
  } catch {}
}

export function setState(fn: (s: State) => State) {
  load();
  state = fn(state);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
  subs.forEach((f) => f());
}

export function useStore() {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      if (!loaded) {
        load();
        f();
      }
      return () => subs.delete(f);
    },
    () => state,
    () => initial,
  );
}

export const uid = () => Math.random().toString(36).slice(2, 9);
