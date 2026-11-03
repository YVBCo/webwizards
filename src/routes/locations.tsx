import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  MapPin,
  Search,
  Star,
  Clock,
  Phone,
  ShieldCheck,
  Check,
  Navigation,
  Sparkles,
  ArrowRight,
  Filter,
  Eye,
  Camera,
  Heart,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { Tilt } from "@/components/Tilt";
import { useStore, GroomingCenter, INITIAL_CENTERS } from "@/lib/store";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      { title: "Find Grooming Centers & Spas Near You — Fur&Fern" },
      { name: "description", content: "Explore verified pet grooming salons, view live map locations, and book nearest center." },
      { property: "og:title", content: "Find Grooming Centers & Spas Near You — Fur&Fern" },
      { property: "og:description", content: "Explore verified pet grooming salons, view live map locations, and book nearest center." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LocationsPage,
});

function LocationsPage() {
  const s = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedCenterId, setSelectedCenterId] = useState<string>(s.centers[0]?.id || "gc-1");

  const centers = s.centers;

  // Filter centers
  const filteredCenters = centers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArea = selectedArea === "all" || c.area.toLowerCase() === selectedArea.toLowerCase();
    return matchesSearch && matchesArea;
  });

  const activeCenter = centers.find((c) => c.id === selectedCenterId) ?? centers[0] ?? INITIAL_CENTERS[0]!;

  const areas = ["all", ...Array.from(new Set(centers.map((c) => c.area)))];

  return (
    <div className="min-h-screen bg-hero">
      <SiteNav />

      <main className="mx-auto max-w-7xl px-6 pt-32 pb-24">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-card/80 backdrop-blur px-4 py-1.5 text-xs font-bold shadow-sm border border-border/50">
            <MapPin className="h-3.5 w-3.5 text-accent" /> Verified Salon Network
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-black">Find a Spa Near You</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Explore fear-free certified grooming sanctuaries across the city. Tap any map pin to inspect amenities and book instantly.
          </p>
        </div>

        {/* Search & Area Filter Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-card p-4 shadow-3d border border-border">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by neighborhood, street, or salon name..."
              className="w-full rounded-2xl border bg-background pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto text-xs font-bold">
            <span className="text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Area:
            </span>
            {areas.map((area) => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`rounded-full px-3.5 py-1.5 capitalize transition-all duration-200 ${
                  selectedArea === area
                    ? "bg-primary text-primary-foreground shadow-sm scale-105"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Map & Salon Directory Grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* INTERACTIVE CITY MAP (7 COLUMNS) */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-3xl bg-secondary/80 shadow-3d border-2 border-primary/20 p-4 flex flex-col justify-between">
              {/* Map SVG Canvas Background */}
              <svg className="absolute inset-0 h-full w-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground/30" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {/* Simulated Rivers & Green Belts */}
                <path d="M 0,180 Q 250,150 400,280 T 800,240" fill="none" stroke="oklch(0.82 0.09 165)" strokeWidth="18" strokeLinecap="round" />
                <path d="M 120,0 Q 200,300 180,600" fill="none" stroke="oklch(0.88 0.03 85)" strokeWidth="12" />
                <path d="M 0,380 Q 400,350 800,420" fill="none" stroke="oklch(0.88 0.03 85)" strokeWidth="10" />
                <path d="M 450,0 Q 460,400 600,600" fill="none" stroke="oklch(0.88 0.03 85)" strokeWidth="10" />
              </svg>

              {/* Map Top Header Overlay */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="rounded-2xl bg-card/90 backdrop-blur px-3.5 py-1.5 text-xs font-bold shadow-sm border border-border flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span>Bengaluru City Spa Grid · {filteredCenters.length} Salons Online</span>
                </div>
                <span className="text-[11px] font-mono bg-card/80 backdrop-blur px-2.5 py-1 rounded-xl text-muted-foreground border">
                  LIVE GPS VIEW
                </span>
              </div>

              {/* Interactive Center Pins on Map */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                {filteredCenters.map((center) => {
                  const isSelected = selectedCenterId === center.id;
                  return (
                    <div
                      key={center.id}
                      style={{
                        left: `${center.xPercent}%`,
                        top: `${center.yPercent}%`,
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                      onClick={() => setSelectedCenterId(center.id)}
                    >
                      {/* Pulse Ring */}
                      {isSelected && (
                        <div className="absolute -inset-3 rounded-full bg-accent/30 animate-ping pointer-events-none" />
                      )}

                      {/* Map Pin Marker */}
                      <div
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-3d transition-all duration-300 ${
                          isSelected
                            ? "bg-accent text-accent-foreground scale-110 ring-4 ring-background"
                            : "bg-card text-foreground hover:scale-105 border border-border"
                        }`}
                      >
                        <MapPin className="h-4 w-4 shrink-0 text-current" />
                        <span className="text-xs font-bold max-w-[110px] truncate">{center.area}</span>
                        <span className="text-[10px] bg-background/30 px-1.5 rounded font-black">
                          {center.rating}★
                        </span>
                      </div>

                      {/* Hover Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 rounded-xl bg-card p-2 text-center text-xs shadow-3d border z-30 pointer-events-none animate-in fade-in">
                        <p className="font-bold text-foreground truncate">{center.name}</p>
                        <p className="text-[10px] text-muted-foreground">{center.distance}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Map Bottom Hint */}
              <div className="relative z-10 flex items-center justify-between text-xs text-muted-foreground bg-card/75 backdrop-blur px-3 py-1.5 rounded-xl border">
                <span>📍 Tap any pin to view salon amenities & book</span>
                <span className="font-bold text-foreground">Active: {activeCenter.area}</span>
              </div>
            </div>
          </div>

          {/* ACTIVE CENTER SHOWCASE (5 COLUMNS) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <Tilt max={6}>
              <div className="rounded-3xl bg-card p-7 shadow-3d border-2 border-border/70 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-mint px-3 py-1 text-xs font-bold text-primary mb-2">
                        <ShieldCheck className="h-3.5 w-3.5" /> Certified Partner Salon
                      </span>
                      <h2 className="text-2xl font-black">{activeCenter.name}</h2>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-accent" /> {activeCenter.address} ({activeCenter.area})
                      </p>
                    </div>
                    <span className="rounded-2xl bg-sun px-3 py-1.5 font-display text-lg font-black shrink-0">
                      {activeCenter.rating} ★
                    </span>
                  </div>

                  {/* Distance & Hours Pills */}
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-secondary px-3 py-1 font-semibold text-muted-foreground">
                      🚗 {activeCenter.distance}
                    </span>
                    <span className="rounded-full bg-secondary px-3 py-1 font-semibold text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {activeCenter.openHours}
                    </span>
                    <span className="rounded-full bg-sun/60 px-3 py-1 font-bold text-foreground">
                      {activeCenter.slotsAvailable} slots today
                    </span>
                  </div>

                  <hr className="my-5 border-border/60" />

                  {/* Amenities List */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Verified Spa Amenities
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {activeCenter.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center gap-1.5 text-foreground font-medium">
                          <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phone and Lead Stylist */}
                  <div className="mt-5 rounded-2xl bg-secondary/70 p-3.5 text-xs space-y-1">
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Lead Stylist:</span>
                      <span className="font-bold">{activeCenter.ownerName}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Direct Desk:</span>
                      <span className="font-bold">{activeCenter.phone}</span>
                    </p>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="mt-6 flex flex-col gap-2">
                  <Link
                    to="/book"
                    search={{ plan: "Spa" }}
                    className="flex items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-center font-bold text-accent-foreground shadow-3d hover:scale-[1.02] active:scale-95 transition"
                  >
                    Book at this Center <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => toast.success(`Routing directions to ${activeCenter.name}... 🗺️`)}
                    className="flex items-center justify-center gap-1.5 rounded-full border-2 border-primary py-2.5 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition"
                  >
                    <Navigation className="h-3.5 w-3.5" /> Open in Google Maps Directions
                  </button>
                </div>
              </div>
            </Tilt>
          </div>
        </div>

        {/* Directory Cards Below Map */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">All Grooming Sanctuaries ({filteredCenters.length})</h3>
            <Link
              to="/auth"
              className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
            >
              Are you a grooming center owner? Register your shop →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredCenters.map((center) => (
              <div
                key={center.id}
                onClick={() => setSelectedCenterId(center.id)}
                className={`rounded-3xl p-6 shadow-sm border-2 transition-all duration-300 cursor-pointer ${
                  selectedCenterId === center.id
                    ? "border-accent bg-card shadow-3d -translate-y-1"
                    : "border-border/60 bg-card hover:bg-secondary/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">💈</span>
                  <span className="rounded-full bg-sun px-2.5 py-0.5 text-xs font-bold">
                    {center.rating} ★
                  </span>
                </div>
                <h4 className="mt-3 font-bold text-base line-clamp-1">{center.name}</h4>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-accent shrink-0" /> {center.area} · {center.distance}
                </p>
                <div className="mt-4 flex flex-wrap gap-1 text-[10px]">
                  {center.amenities.slice(0, 2).map((a) => (
                    <span key={a} className="rounded-md bg-secondary px-2 py-0.5 font-medium">
                      {a}
                    </span>
                  ))}
                </div>
                <Link
                  to="/book"
                  search={{ plan: "Spa" }}
                  className="mt-5 block w-full rounded-full bg-primary/10 py-2 text-center text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition"
                >
                  Book Session →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
