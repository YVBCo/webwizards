import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Scissors,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Camera,
  TrendingUp,
  Calendar,
  Plus,
  Check,
  X,
  Sparkles,
  Building,
  Radio,
  Video,
  VideoOff,
  Disc,
  Play,
  Eye,
  Film,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { Tilt } from "@/components/Tilt";
import { useStore, setState, GROOMING_STEPS, Booking, uid } from "@/lib/store";

export const Route = createFileRoute("/groomer")({
  head: () => ({
    meta: [
      { title: "Grooming Center Salon Portal — Fur&Fern" },
      { name: "description", content: "Manage live grooming stations, customer appointments, live webcam broadcast, and video recording." },
      { property: "og:title", content: "Grooming Center Salon Portal — Fur&Fern" },
      { property: "og:description", content: "Manage live grooming stations, customer appointments, live webcam broadcast, and video recording." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GroomerDashboard,
});

function GroomerDashboard() {
  const s = useStore();
  const [filterTab, setFilterTab] = useState<"all" | "in-progress" | "upcoming" | "done">("all");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>("b-101");
  const [showAddWalkin, setShowAddWalkin] = useState(false);
  const [walkinName, setWalkinName] = useState("");
  const [walkinPetName, setWalkinPetName] = useState("");
  const [walkinBreed, setWalkinBreed] = useState("");
  const [walkinPlan, setWalkinPlan] = useState("Splash");
  
  // Video Recording simulator state
  const [isRecordingNow, setIsRecordingNow] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);

  const shopName = s.currentUser?.shopName || "Fur&Fern Flagship Spa & Sanctuary";
  const shopArea = s.currentUser?.shopArea || "HSR Layout, Sector 2";

  const bookingsList = s.bookings.filter((b) => {
    if (filterTab === "all") return true;
    return b.status === filterTab;
  });

  const activeBooking = s.bookings.find((b) => b.id === selectedBookingId) || s.bookings[0];

  const totalEarnings = s.bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((acc, b) => acc + b.total, 0);

  // Advance grooming stage for a booking
  const advanceStep = (bookingId: string) => {
    const booking = s.bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const current = booking.currentStep ?? 0;
    const nextStep = (current + 1) % GROOMING_STEPS.length;
    const isReady = nextStep === GROOMING_STEPS.length - 1;

    setState((st) => ({
      ...st,
      step: nextStep, // sync with parent tracker
      bookings: st.bookings.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              currentStep: nextStep,
              status: isReady ? "done" : "in-progress",
            }
          : b
      ),
    }));

    if (isReady) {
      toast.success(`🎉 ${booking.petName || "Pet"} is marked READY for pickup! Parent's dashboard notified.`);
    } else {
      toast.success(`Advanced to stage: ${GROOMING_STEPS[nextStep]} 🫧 (Synced with Pet Parent)`);
    }
  };

  const setBookingStatus = (bookingId: string, status: "in-progress" | "done" | "cancelled") => {
    setState((st) => ({
      ...st,
      bookings: st.bookings.map((b) => (b.id === bookingId ? { ...b, status } : b)),
    }));
    toast.success(`Appointment status updated to ${status}`);
  };

  // Toggle Live Broadcast for Pet Parent
  const toggleBroadcast = () => {
    const nextState = !s.broadcast.isBroadcasting;
    setState((st) => ({
      ...st,
      broadcast: {
        ...st.broadcast,
        isBroadcasting: nextState,
        petInCam: activeBooking?.petName ? `${activeBooking.petName} ${activeBooking.petEmoji || "🐶"}` : "Biscuit 🐶",
      },
    }));
    if (nextState) {
      toast.success("🔴 Live broadcast turned ON! Pet parent can now watch stream in real time.");
    } else {
      toast.info("Broadcast paused. Stream standby screen shown to parent.");
    }
  };

  // Switch camera angle
  const switchCam = (cam: "Tub Cam 01" | "Styling Suite 02" | "Drying Bay 03") => {
    setState((st) => ({
      ...st,
      broadcast: {
        ...st.broadcast,
        activeCam: cam,
      },
    }));
    toast.success(`Switched live stream feed to ${cam}`);
  };

  // Record a Video Clip to send to Pet Parent
  const triggerRecordVideo = () => {
    if (!isRecordingNow) {
      setIsRecordingNow(true);
      setRecSeconds(1);
      const timer = setInterval(() => {
        setRecSeconds((prev) => {
          if (prev >= 5) {
            clearInterval(timer);
            setIsRecordingNow(false);
            // Save completed video clip
            const newClip = {
              id: `clip-${uid()}`,
              title: `${activeBooking?.petName || "Pet"} — ${GROOMING_STEPS[activeBooking?.currentStep ?? 0]} Clip`,
              duration: "0:45",
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              stage: GROOMING_STEPS[activeBooking?.currentStep ?? 0] ?? "Grooming",
              thumbnailEmoji: activeBooking?.petEmoji || "🐶",
            };
            setState((st) => ({
              ...st,
              broadcast: {
                ...st.broadcast,
                recordedClips: [newClip, ...st.broadcast.recordedClips],
              },
            }));
            toast.success(`🎬 Video clip recorded and pushed live to ${activeBooking?.customerName || "Pet Parent"}'s dashboard!`);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  // Snap photo to push to parent
  const sendLiveSnapshot = () => {
    const newSnap = {
      id: `snap-${uid()}`,
      title: `${activeBooking?.petName || "Pet"} Studio Snap`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      emoji: activeBooking?.petEmoji || "📸",
      stage: GROOMING_STEPS[activeBooking?.currentStep ?? 0] ?? "Grooming",
    };
    setState((st) => ({
      ...st,
      broadcast: {
        ...st.broadcast,
        liveSnapshots: [newSnap, ...st.broadcast.liveSnapshots],
      },
    }));
    toast.success(`📸 Live photo captured & synced to pet parent's album!`);
  };

  const handleAddWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinPetName.trim()) {
      toast.error("Please enter the pet's name");
      return;
    }

    const newId = `b-${uid()}`;
    const newBooking: Booking = {
      id: newId,
      petId: `p-${uid()}`,
      petName: walkinPetName.trim(),
      petBreed: walkinBreed.trim() || "Mixed breed",
      petEmoji: "🐕",
      customerName: walkinName.trim() || "Walk-in Guest",
      customerPhone: "+91 99999 00000",
      plan: walkinPlan,
      addons: ["Natural spritz"],
      date: new Date().toDateString(),
      time: "Now",
      total: walkinPlan === "Splash" ? 799 : walkinPlan === "Spa" ? 1499 : 2499,
      status: "in-progress",
      currentStep: 0,
      notes: "Walk-in client",
    };

    setState((st) => ({
      ...st,
      bookings: [newBooking, ...st.bookings],
    }));

    setSelectedBookingId(newId);
    setShowAddWalkin(false);
    setWalkinName("");
    setWalkinPetName("");
    setWalkinBreed("");
    toast.success(`🐾 Walk-in pet "${walkinPetName}" added to the active grooming queue!`);
  };

  // Role Guard: Pet Parents cannot access Groomer Salon portal
  if (s.currentUser?.role === "parent") {
    return (
      <div className="min-h-screen bg-hero">
        <SiteNav />
        <main className="mx-auto max-w-2xl px-6 pt-40 pb-20 text-center">
          <div className="rounded-3xl bg-card p-10 shadow-3d border-2 border-accent/30">
            <div className="text-6xl mb-4">🐾</div>
            <h1 className="text-3xl font-black">Pet Parent Account Detected</h1>
            <p className="mt-3 text-muted-foreground text-sm">
              You are currently signed in as <strong>{s.currentUser.name}</strong> (Pet Parent).
              The Grooming Salon Portal and station controls are reserved for verified grooming centers.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/dashboard"
                className="rounded-full bg-accent px-6 py-3 font-bold text-accent-foreground shadow-md hover:scale-105 transition"
              >
                Go to Pet Parent Dashboard →
              </Link>
              <Link
                to="/auth"
                className="rounded-full border-2 border-accent px-6 py-3 font-bold text-accent hover:bg-secondary transition"
              >
                Switch to Groomer Salon Login
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero">
      <SiteNav />

      <main className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        {/* Salon Header Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-primary p-8 text-primary-foreground shadow-3d">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/15 text-3xl">
              💈
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl md:text-4xl font-black">{shopName}</h1>
                <span className="rounded-full bg-mint px-3 py-0.5 text-xs font-bold text-primary">
                  Verified Salon ✓
                </span>
              </div>
              <p className="text-sm opacity-85 flex items-center gap-1.5 mt-1">
                <MapPin className="h-4 w-4" /> {shopArea} · Open 09:00 AM – 08:00 PM
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/locations"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-4 py-2.5 text-xs font-bold text-primary-foreground transition hover:bg-primary-foreground/25"
            >
              <Eye className="h-3.5 w-3.5" /> Check Map Pin
            </Link>
            <button
              onClick={() => setShowAddWalkin(!showAddWalkin)}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-xs font-bold text-accent-foreground shadow-md transition hover:scale-105 active:scale-95"
            >
              <Plus className="h-4 w-4" /> Add Walk-in Pet
            </button>
          </div>
        </div>

        {/* Walk-in Form Modal / Drawer */}
        {showAddWalkin && (
          <div className="mt-6 rounded-3xl bg-card p-6 shadow-3d border border-border animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Register Walk-in Pet for Immediate Grooming</h3>
              <button onClick={() => setShowAddWalkin(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddWalkin} className="grid gap-3 sm:grid-cols-4 items-end">
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Parent Name</label>
                <input
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  placeholder="e.g. Rahul"
                  className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Pet Name</label>
                <input
                  required
                  value={walkinPetName}
                  onChange={(e) => setWalkinPetName(e.target.value)}
                  placeholder="e.g. Simmba"
                  className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Breed</label>
                <input
                  value={walkinBreed}
                  onChange={(e) => setWalkinBreed(e.target.value)}
                  placeholder="e.g. Beagle"
                  className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Package</label>
                <select
                  value={walkinPlan}
                  onChange={(e) => setWalkinPlan(e.target.value)}
                  className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
                >
                  <option value="Splash">Splash (₹799)</option>
                  <option value="Spa">Spa (₹1,499)</option>
                  <option value="Royal">Royal (₹2,499)</option>
                </select>
              </div>
              <div className="sm:col-span-4 flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddWalkin(false)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-primary px-6 py-2 text-xs font-bold text-primary-foreground shadow-md hover:scale-105 transition"
                >
                  Admit to Bath Station →
                </button>
              </div>
            </form>
          </div>
        )}

        {/* KPI Metrics */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Tilt>
            <div className="rounded-3xl bg-sun p-6 shadow-3d h-full">
              <div className="flex items-center justify-between">
                <TrendingUp className="h-6 w-6 text-foreground" />
                <span className="text-xs font-bold bg-foreground/10 px-2 py-0.5 rounded-full">Today</span>
              </div>
              <p className="mt-4 font-display text-4xl font-black">₹{totalEarnings}</p>
              <p className="text-xs text-muted-foreground font-semibold mt-1">Salon Revenue</p>
            </div>
          </Tilt>

          <Tilt>
            <div className="rounded-3xl bg-mint p-6 shadow-3d h-full">
              <div className="flex items-center justify-between">
                <Radio className="h-6 w-6 text-primary animate-pulse" />
                <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">Active</span>
              </div>
              <p className="mt-4 font-display text-4xl font-black">
                {s.bookings.filter((b) => b.status === "in-progress").length} Pets
              </p>
              <p className="text-xs text-primary font-semibold mt-1">On Grooming Floor</p>
            </div>
          </Tilt>

          <Tilt>
            <div className="rounded-3xl bg-coral p-6 text-accent-foreground shadow-3d h-full">
              <div className="flex items-center justify-between">
                <Video className="h-6 w-6" />
                <span className="text-xs font-bold bg-accent-foreground/20 px-2 py-0.5 rounded-full">
                  {s.broadcast.isBroadcasting ? "ON AIR" : "OFFLINE"}
                </span>
              </div>
              <p className="mt-4 font-display text-4xl font-black">
                {s.broadcast.isBroadcasting ? "LIVE" : "PAUSED"}
              </p>
              <p className="text-xs opacity-90 font-semibold mt-1">
                Camera: {s.broadcast.activeCam}
              </p>
            </div>
          </Tilt>

          <Tilt>
            <div className="rounded-3xl bg-card p-6 shadow-3d border border-border h-full">
              <div className="flex items-center justify-between">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                <span className="text-xs font-bold bg-muted px-2 py-0.5 rounded-full">Total</span>
              </div>
              <p className="mt-4 font-display text-4xl font-black">{s.bookings.length}</p>
              <p className="text-xs text-muted-foreground font-semibold mt-1">Total Scheduled</p>
            </div>
          </Tilt>
        </div>

        {/* ================= SPECIAL FEATURE: GROOMER LIVE WEBCAM & VIDEO RECORDER ================= */}
        <div className="mt-8 rounded-3xl bg-card p-8 shadow-3d border-2 border-primary/20">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-5">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent mb-1">
                <Video className="h-3.5 w-3.5" /> Groomer Camera Studio & Broadcast
              </span>
              <h2 className="text-2xl font-black">Studio Cam Live Feed Control</h2>
              <p className="text-xs text-muted-foreground">
                Control the live stream broadcasted directly into the Pet Parent's dashboard.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Broadcast Toggle */}
              <button
                onClick={toggleBroadcast}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold shadow-md transition hover:scale-105 active:scale-95 ${
                  s.broadcast.isBroadcasting
                    ? "bg-destructive text-destructive-foreground animate-pulse"
                    : "bg-muted text-foreground hover:bg-secondary"
                }`}
              >
                {s.broadcast.isBroadcasting ? (
                  <>
                    <Radio className="h-4 w-4" /> Stop Live Broadcast
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" /> Start Live Broadcast 🔴
                  </>
                )}
              </button>

              {/* Record Video Button */}
              <button
                onClick={triggerRecordVideo}
                disabled={isRecordingNow}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold shadow-md transition hover:scale-105 active:scale-95 ${
                  isRecordingNow
                    ? "bg-red-600 text-white animate-pulse"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <Disc className="h-4 w-4" />
                {isRecordingNow ? `Recording REC (00:0${recSeconds})...` : "Record Video Clip 📹"}
              </button>

              {/* Snap Photo */}
              <button
                onClick={sendLiveSnapshot}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-xs font-bold text-accent-foreground shadow-md transition hover:scale-105 active:scale-95"
              >
                <Camera className="h-3.5 w-3.5" /> Send Snap to Parent 📸
              </button>
            </div>
          </div>

          {/* Camera View & Switcher */}
          <div className="mt-6 grid gap-6 md:grid-cols-12 items-center">
            {/* Simulated Groomer Camera View (8 Cols) */}
            <div className="md:col-span-8 relative aspect-video w-full rounded-2xl bg-neutral-950 overflow-hidden shadow-inner flex flex-col justify-between p-5 text-white">
              {/* Top Stream Status Bar */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono bg-black/60 px-2.5 py-1 rounded-lg flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${s.broadcast.isBroadcasting ? "bg-red-500 animate-pulse" : "bg-neutral-500"}`} />
                  {s.broadcast.isBroadcasting ? "ON AIR TO PARENT" : "STANDBY"} // {s.broadcast.activeCam}
                </span>
                <span className="font-mono bg-black/60 px-2.5 py-1 rounded-lg">1080p 60FPS</span>
              </div>

              {/* Center Feed Content */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="text-8xl animate-bounce">
                  {activeBooking?.petEmoji || "🐶"}
                </div>
                <div className="mt-3 bg-black/70 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold">
                  Subject: {activeBooking?.petName || "Pet"} ({activeBooking?.petBreed || "Breed"}) · Current Stage: {GROOMING_STEPS[activeBooking?.currentStep ?? 0]}
                </div>
              </div>

              {/* Bottom Stream Status */}
              <div className="flex items-center justify-between text-xs opacity-80">
                <span>Station Lead: {s.currentUser?.name || "Master Groomer"}</span>
                <span>Parent Viewing Status: Connected 📱</span>
              </div>
            </div>

            {/* Camera Controls & Switcher (4 Cols) */}
            <div className="md:col-span-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Active Camera Angle:</p>
              {(["Tub Cam 01", "Styling Suite 02", "Drying Bay 03"] as const).map((cam) => {
                const isActive = s.broadcast.activeCam === cam;
                return (
                  <button
                    key={cam}
                    onClick={() => switchCam(cam)}
                    className={`w-full rounded-2xl p-3.5 text-left text-xs font-bold border-2 transition-all flex items-center justify-between ${
                      isActive
                        ? "border-accent bg-accent/15 text-accent shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <span>📹 {cam}</span>
                    {isActive && <span className="text-[10px] bg-accent text-accent-foreground px-2 py-0.5 rounded-full">Active</span>}
                  </button>
                );
              })}

              <div className="rounded-2xl bg-secondary/80 p-3.5 text-xs text-muted-foreground border">
                <p className="font-bold text-foreground">💡 Two-Way Sync Active:</p>
                <p className="mt-1">
                  When you record clips or snap photos here, they are pushed immediately to the parent's gallery below.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Operational Split */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* LEFT 2 COLUMNS: Live Stage Controller & Appointments Queue */}
          <div className="space-y-8 lg:col-span-2">
            {/* Live Grooming Stage Controller */}
            {activeBooking && (
              <div className="rounded-3xl bg-card p-8 shadow-3d border border-border">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1">
                      <Radio className="h-3.5 w-3.5 text-accent animate-pulse" /> Live Station Controller
                    </span>
                    <h2 className="text-2xl font-black mt-1">
                      Now Grooming: {activeBooking.petName || "Pet"} ({activeBooking.petBreed})
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Customer: {activeBooking.customerName} · Package: {activeBooking.plan}
                    </p>
                  </div>

                  <button
                    onClick={() => advanceStep(activeBooking.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-bold text-accent-foreground shadow-md transition hover:scale-105 active:scale-95"
                  >
                    Advance to Next Stage →
                  </button>
                </div>

                {/* Visual Step Progress Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span>
                      Current Phase:{" "}
                      <span className="text-accent">
                        {GROOMING_STEPS[activeBooking.currentStep ?? 0]}
                      </span>
                    </span>
                    <span>
                      Step {(activeBooking.currentStep ?? 0) + 1} of {GROOMING_STEPS.length}
                    </span>
                  </div>
                  <div className="h-3.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-accent transition-all duration-500"
                      style={{
                        width: `${(((activeBooking.currentStep ?? 0) + 1) / GROOMING_STEPS.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Stage Steps Icons */}
                <div className="mt-6 grid grid-cols-6 gap-2 text-center text-xs">
                  {GROOMING_STEPS.map((st, i) => {
                    const isDone = i < (activeBooking.currentStep ?? 0);
                    const isCurrent = i === (activeBooking.currentStep ?? 0);
                    return (
                      <div key={st} className={isCurrent ? "font-bold text-foreground" : "text-muted-foreground"}>
                        <div
                          className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                            isCurrent
                              ? "bg-accent text-accent-foreground shadow-md scale-110"
                              : isDone
                              ? "bg-mint text-primary"
                              : "bg-muted"
                          }`}
                        >
                          {isDone ? <Check className="h-4 w-4" /> : i + 1}
                        </div>
                        <span className="text-[11px] leading-tight block">{st}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Groomer Notes & Live Photo Trigger */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-secondary p-4 text-xs">
                  <div>
                    <span className="font-bold block">Parent Special Request:</span>
                    <p className="text-muted-foreground mt-0.5">
                      {activeBooking.notes || "No special sensitivities noted."}
                    </p>
                  </div>
                  <button
                    onClick={() => toast.success(`📸 Cam snapshot sent to ${activeBooking.customerName}'s app!`)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-card px-4 py-2 font-bold shadow-sm hover:bg-background transition"
                  >
                    <Camera className="h-3.5 w-3.5 text-accent" /> Snap & Send Live Photo
                  </button>
                </div>
              </div>
            )}

            {/* Appointments Management Queue */}
            <div className="rounded-3xl bg-card p-8 shadow-3d border border-border">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h3 className="text-2xl font-bold">Appointments Queue</h3>
                {/* Filter Tabs */}
                <div className="flex gap-1 rounded-full bg-muted p-1 text-xs font-bold">
                  {(["all", "in-progress", "upcoming", "done"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setFilterTab(t)}
                      className={`rounded-full px-3.5 py-1.5 capitalize transition ${
                        filterTab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {bookingsList.map((b) => {
                  const isSel = selectedBookingId === b.id;
                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBookingId(b.id)}
                      className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl p-4 transition-all cursor-pointer border-2 ${
                        isSel
                          ? "border-accent bg-accent/10 shadow-sm"
                          : "border-border/60 bg-secondary/50 hover:bg-secondary"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{b.petEmoji || "🐶"}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-base">{b.petName || "Pet"}</p>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                b.status === "in-progress"
                                  ? "bg-mint text-primary"
                                  : b.status === "upcoming"
                                  ? "bg-sun text-foreground"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {b.status}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {b.petBreed} · Owner: {b.customerName} ({b.customerPhone})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <div className="text-right">
                          <p className="font-bold">{b.plan} · ₹{b.total}</p>
                          <p className="text-muted-foreground">{b.date.slice(4, 10)} @ {b.time}</p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5">
                          {b.status === "upcoming" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setBookingStatus(b.id, "in-progress");
                              }}
                              className="rounded-full bg-primary px-3 py-1.5 font-bold text-primary-foreground hover:scale-105 transition"
                            >
                              Start
                            </button>
                          )}

                          {b.status === "in-progress" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                advanceStep(b.id);
                              }}
                              className="rounded-full bg-accent px-3 py-1.5 font-bold text-accent-foreground hover:scale-105 transition"
                            >
                              + Step
                            </button>
                          )}

                          {b.status !== "done" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setBookingStatus(b.id, "done");
                              }}
                              className="rounded-full bg-mint p-2 text-primary hover:scale-110 transition"
                              title="Mark Finished"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {!bookingsList.length && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No appointments under "{filterTab}" category.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Recorded Clips by Salon & Storefront Info */}
          <div className="space-y-8">
            {/* Recorded Video Clips Library */}
            <div className="rounded-3xl bg-card p-6 shadow-3d border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Film className="h-5 w-5 text-accent" />
                  <h3 className="text-lg font-bold">Recorded Video Clips ({s.broadcast.recordedClips.length})</h3>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                These recorded highlights are pushed directly into the pet parent's mobile viewer.
              </p>

              <div className="space-y-3">
                {s.broadcast.recordedClips.map((clip) => (
                  <div key={clip.id} className="rounded-2xl bg-secondary/80 p-3.5 text-xs border border-border/50">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="text-lg">{clip.thumbnailEmoji}</span> {clip.title}
                      </span>
                      <span className="rounded-full bg-accent text-accent-foreground px-2 py-0.5 text-[10px]">
                        {clip.duration}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between text-muted-foreground text-[11px]">
                      <span>Stage: {clip.stage}</span>
                      <span>Recorded: {clip.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shop Profile & Map Verification */}
            <div className="rounded-3xl bg-sun/60 p-6 shadow-3d border border-sun">
              <div className="flex items-center gap-2 mb-3">
                <Building className="h-5 w-5 text-foreground" />
                <h3 className="text-xl font-bold">Your Storefront Info</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                This address and verified details are visible to pet parents on the nearby store map.
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-foreground/10">
                  <span className="font-semibold">Shop Name:</span>
                  <span>{shopName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-foreground/10">
                  <span className="font-semibold">Area / Zone:</span>
                  <span>{shopArea}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-foreground/10">
                  <span className="font-semibold">Map Pin Status:</span>
                  <span className="font-bold text-primary">Live on Pet Map ✅</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-semibold">Operating Hours:</span>
                  <span>09:00 AM – 08:00 PM</span>
                </div>
              </div>

              <Link
                to="/locations"
                className="mt-5 block w-full rounded-full bg-foreground py-2.5 text-center text-xs font-bold text-background shadow-md hover:opacity-90 transition"
              >
                Inspect Salon on Pet Parents Map →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
