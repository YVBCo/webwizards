import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Calendar,
  Droplets,
  Heart,
  Plus,
  Check,
  X,
  Trash2,
  Gift,
  Camera,
  Sparkles,
  Footprints,
  ShieldCheck,
  Video,
  Award,
  Smile,
  Utensils,
  Bone,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { Tilt } from "@/components/Tilt";
import { setState, uid, useStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Pet Dashboard — Fur&Fern" },
      { name: "description", content: "Track grooming progress, bookings, paw points, live camera and pet health." },
      { property: "og:title", content: "Pet Dashboard — Fur&Fern" },
      { property: "og:description", content: "Track grooming progress, bookings, paw points, live camera and pet health." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const steps = ["Check-in", "Bubble bath", "Blow dry", "Haircut", "Pawdicure", "Ready!"];
const EMOJI = ["🐶", "🐱", "🐕", "🐩", "🐈", "🐰"];

function Ring({ v, label }: { v: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative h-24 w-24 rounded-full transition-all"
        style={{ background: `conic-gradient(var(--coral) ${v * 3.6}deg, var(--muted) 0)` }}
      >
        <div className="absolute inset-2 flex items-center justify-center rounded-full bg-card font-display text-2xl font-black">
          {v}%
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function Dashboard() {
  const s = useStore();
  const [selId, setSel] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", breed: "", e: "🐶" });
  const [tab, setTab] = useState<"upcoming" | "done" | "cancelled">("upcoming");
  
  // Extra features states
  const [waterCups, setWaterCups] = useState(3);
  const [meals, setMeals] = useState({ breakfast: true, lunch: true, dinner: false });
  const [walkKm, setWalkKm] = useState(2.4);
  const [camActive, setCamActive] = useState(true);
  const [snaps, setSnaps] = useState([
    { id: "1", title: "Bubble Soak Time", time: "10:15 AM", emoji: "🫧" },
    { id: "2", title: "Fluffy Blow Dry", time: "11:00 AM", emoji: "💨" },
    { id: "3", title: "Post-Groom Glow", time: "11:45 AM", emoji: "✨" },
  ]);
  const [vaccines, setVaccines] = useState([
    { id: "rabies", name: "Rabies Booster", date: "Expires Nov 2026", done: true },
    { id: "dhpp", name: "DHPP Core Vaccine", date: "Up to date", done: true },
    { id: "flea", name: "Flea & Tick Shield", date: "Applied this month", done: true },
    { id: "deworm", name: "Deworming Checkup", date: "Next in 45 days", done: false },
  ]);

  const pet = s.pets.find((p) => p.id === selId) ?? s.pets[0];
  const step = s.step;
  const list = s.bookings.filter((b) => b.status === tab);
  const spent = s.bookings.filter((b) => b.status !== "cancelled").reduce((a, b) => a + b.total, 0);
  const tier = s.points >= 1000 ? "Royal" : s.points >= 500 ? "Gold" : "Silver";
  const next = s.points >= 1000 ? 1000 : s.points >= 500 ? 1000 : 500;

  const addPet = () => {
    if (!form.name.trim()) {
      toast.error("Give your pet a name");
      return;
    }
    const id = uid();
    setState((st) => ({
      ...st,
      pets: [
        ...st.pets,
        { id, name: form.name.trim(), breed: form.breed.trim() || "Good boy", e: form.e, coat: 70, mood: 90 },
      ],
    }));
    setSel(id);
    setAdding(false);
    setForm({ name: "", breed: "", e: "🐶" });
    toast.success(`${form.name} joined the pack! 🐾`);
  };

  const setStatus = (id: string, status: "done" | "cancelled") => {
    setState((st) => ({ ...st, bookings: st.bookings.map((b) => (b.id === id ? { ...b, status } : b)) }));
    toast(status === "done" ? "Marked as completed ✅" : "Booking cancelled");
  };

  const advance = () => {
    const n = (step + 1) % steps.length;
    setState((st) => ({ ...st, step: n }));
    if (n === steps.length - 1) toast.success(`${pet?.name ?? "Your pet"} is ready for pickup! 🎀`);
  };

  const redeem = () => {
    if (s.points < 200) {
      toast.error("You need 200 points for a free treat box");
      return;
    }
    setState((st) => ({ ...st, points: st.points - 200 }));
    toast.success("Treat box added to your next visit 🦴");
  };

  // Interactive Care Actions
  const giveTreat = () => {
    if (!pet) return;
    setState((st) => ({
      ...st,
      points: st.points + 15,
      pets: st.pets.map((p) => (p.id === pet.id ? { ...p, mood: Math.min(100, p.mood + 5) } : p)),
    }));
    toast.success(`Yum! Gave ${pet.name} a crunchy treat (+15 pts, +5% mood) 🦴`);
  };

  const brushFur = () => {
    if (!pet) return;
    setState((st) => ({
      ...st,
      pets: st.pets.map((p) => (p.id === pet.id ? { ...p, coat: Math.min(100, p.coat + 6) } : p)),
    }));
    toast.success(`Silky shine! Brushed ${pet.name}'s coat (+6% coat health) ✨`);
  };

  const playFetch = () => {
    if (!pet) return;
    setState((st) => ({
      ...st,
      points: st.points + 10,
      pets: st.pets.map((p) => (p.id === pet.id ? { ...p, mood: Math.min(100, p.mood + 8) } : p)),
    }));
    toast.success(`${pet.name} had fun playing fetch! 🎾 (+10 pts)`);
  };

  const takeSnapshot = () => {
    const newSnap = {
      id: Date.now().toString(),
      title: `${pet?.name ?? "Pet"} Spa Cam Snapshot`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      emoji: pet?.e ?? "📸",
    };
    setSnaps([newSnap, ...snaps]);
    toast.success(`📸 Snapshot saved to ${pet?.name ?? "Pet"}'s Grooming Gallery!`);
  };

  const toggleVaccine = (id: string) => {
    setVaccines(vaccines.map((v) => (v.id === id ? { ...v, done: !v.done } : v)));
    toast.success("Health passport record updated!");
  };

  // Role Guard: Groomers cannot access Pet Parent dashboard
  if (s.currentUser?.role === "groomer") {
    return (
      <div className="min-h-screen bg-hero">
        <SiteNav />
        <main className="mx-auto max-w-2xl px-6 pt-40 pb-20 text-center">
          <div className="rounded-3xl bg-card p-10 shadow-3d border-2 border-primary/30">
            <div className="text-6xl mb-4">💈</div>
            <h1 className="text-3xl font-black">Grooming Salon Account Detected</h1>
            <p className="mt-3 text-muted-foreground text-sm">
              You are currently signed in as <strong>{s.currentUser.name}</strong> (Grooming Salon Manager).
              The Pet Parent dashboard is reserved for pet parents.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/groomer"
                className="rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-md hover:scale-105 transition"
              >
                Go to Groomer Salon Portal →
              </Link>
              <Link
                to="/auth"
                className="rounded-full border-2 border-primary px-6 py-3 font-bold text-primary hover:bg-secondary transition"
              >
                Switch to Pet Parent Login
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
      <main className="mx-auto max-w-7xl px-6 pt-32 pb-16">
        {/* Top Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-5xl font-black">Hello, pet parent 👋</h1>
            <p className="mt-2 text-muted-foreground">Manage your pack, track live spa sessions & monitor daily wellness.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/locations"
              className="rounded-full border-2 border-primary bg-card px-5 py-3 font-semibold text-primary shadow-sm transition hover:bg-primary hover:text-primary-foreground hover:-translate-y-1"
            >
              📍 Find Spas on Map
            </Link>
            <Link
              to="/book"
              search={{ plan: "Spa" }}
              className="rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground shadow-3d transition hover:-translate-y-1"
            >
              + New booking
            </Link>
          </div>
        </div>

        {/* Pet Switcher */}
        <div className="mt-6 flex flex-wrap gap-3">
          {s.pets.map((p) => (
            <button
              key={p.id}
              onClick={() => setSel(p.id)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 font-medium transition ${
                p.id === pet?.id
                  ? "bg-primary text-primary-foreground shadow-3d -translate-y-1"
                  : "bg-card hover:bg-secondary"
              }`}
            >
              <span className="text-xl">{p.e}</span>
              {p.name}
            </button>
          ))}
          <button
            onClick={() => setAdding(!adding)}
            className="flex items-center gap-1 rounded-full border-2 border-dashed border-primary px-5 py-2 font-medium hover:bg-card"
          >
            <Plus className="h-4 w-4" />
            Add pet
          </button>
        </div>

        {/* Add Pet Form */}
        {adding && (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-3xl bg-card p-5 shadow-3d animate-in fade-in slide-in-from-top-2">
            <div className="flex gap-1">
              {EMOJI.map((e) => (
                <button
                  key={e}
                  onClick={() => setForm({ ...form, e })}
                  className={`rounded-xl p-2 text-2xl ${form.e === e ? "bg-sun" : ""}`}
                >
                  {e}
                </button>
              ))}
            </div>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Name"
              className="rounded-full border bg-background px-4 py-2"
            />
            <input
              value={form.breed}
              onChange={(e) => setForm({ ...form, breed: e.target.value })}
              placeholder="Breed"
              className="rounded-full border bg-background px-4 py-2"
            />
            <button
              onClick={addPet}
              className="rounded-full bg-primary px-5 py-2 font-semibold text-primary-foreground shadow-md transition hover:scale-105"
            >
              Save Pet
            </button>
          </div>
        )}

        {/* Main Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Pet Profile Card */}
          {pet ? (
            <Tilt max={8}>
              <div className="relative rounded-3xl bg-primary p-8 text-primary-foreground shadow-3d">
                <button
                  aria-label="Remove pet"
                  onClick={() => {
                    setState((st) => ({ ...st, pets: st.pets.filter((p) => p.id !== pet.id) }));
                    setSel(null);
                    toast(`${pet.name} removed`);
                  }}
                  className="absolute right-5 top-5 rounded-full p-2 opacity-60 hover:bg-primary-foreground/15 hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="text-8xl animate-floaty" style={{ transform: "translateZ(70px)" }}>
                  {pet.e}
                </div>
                <h2 className="mt-4 text-4xl font-black">{pet.name}</h2>
                <p className="opacity-70">{pet.breed}</p>
                <div className="mt-6 flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full bg-primary-foreground/15 px-3 py-1 font-medium">Vaccinated ✅</span>
                  <span className="rounded-full bg-primary-foreground/15 px-3 py-1 font-medium">{tier} member</span>
                </div>

                {/* Pet Quick Actions */}
                <div className="mt-6 border-t border-primary-foreground/20 pt-4">
                  <p className="text-xs uppercase font-bold tracking-wider opacity-80 mb-3">Quick Interactions</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      onClick={giveTreat}
                      className="flex flex-col items-center justify-center rounded-2xl bg-primary-foreground/15 p-2 font-semibold transition hover:bg-primary-foreground/25 active:scale-95"
                    >
                      <Bone className="h-4 w-4 mb-1" />
                      Treat
                    </button>
                    <button
                      onClick={brushFur}
                      className="flex flex-col items-center justify-center rounded-2xl bg-primary-foreground/15 p-2 font-semibold transition hover:bg-primary-foreground/25 active:scale-95"
                    >
                      <Sparkles className="h-4 w-4 mb-1" />
                      Brush
                    </button>
                    <button
                      onClick={playFetch}
                      className="flex flex-col items-center justify-center rounded-2xl bg-primary-foreground/15 p-2 font-semibold transition hover:bg-primary-foreground/25 active:scale-95"
                    >
                      <Smile className="h-4 w-4 mb-1" />
                      Play
                    </button>
                  </div>
                </div>
              </div>
            </Tilt>
          ) : (
            <div className="rounded-3xl bg-card p-8 shadow-3d">Add your first pet to get started.</div>
          )}

          {/* Live Grooming Tracker Card */}
          <div className="rounded-3xl bg-card p-8 shadow-3d lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Live Grooming Tracker</h3>
                <p className="text-xs text-muted-foreground">Real-time status updates from our groomers</p>
              </div>
              <button
                onClick={advance}
                className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:scale-105 shadow-md"
              >
                {step === steps.length - 1 ? "Restart Cycle" : "Advance Stage →"}
              </button>
            </div>
            <div className="mt-8 h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-accent transition-all duration-700"
                style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
              />
            </div>
            <div className="mt-4 grid grid-cols-6 gap-2 text-center text-xs">
              {steps.map((st, i) => (
                <div key={st} className={i <= step ? "font-bold text-foreground" : "text-muted-foreground"}>
                  <div
                    className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                      i <= step ? "bg-accent text-accent-foreground shadow-sm scale-105" : "bg-muted"
                    }`}
                  >
                    {i < step ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  {st}
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-around">
              <Ring v={pet?.coat ?? 0} label="Coat Health" />
              <Ring v={pet?.mood ?? 0} label="Happiness" />
              <Ring v={Math.round((step / 5) * 100)} label="Step Progress" />
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { i: Calendar, v: s.bookings.filter((b) => b.status === "upcoming").length, l: "Upcoming", bg: "bg-sun" },
              { i: Check, v: s.bookings.filter((b) => b.status === "done").length, l: "Completed", bg: "bg-mint" },
              { i: Droplets, v: `₹${spent}`, l: "Total spent", bg: "bg-sun" },
              { i: Heart, v: s.pets.length, l: "Pets in pack", bg: "bg-mint" },
            ].map((x) => (
              <Tilt key={x.l}>
                <div className={`h-full rounded-3xl p-5 shadow-3d ${x.bg}`}>
                  <x.i className="h-6 w-6" />
                  <p className="mt-4 font-display text-3xl font-black">{x.v}</p>
                  <p className="text-sm font-medium">{x.l}</p>
                </div>
              </Tilt>
            ))}
          </div>

          {/* Paw Points Rewards */}
          <div className="rounded-3xl bg-coral p-8 text-accent-foreground shadow-3d">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Paw Points Club</h3>
              <Gift className="h-6 w-6" />
            </div>
            <p className="mt-4 font-display text-6xl font-black">{s.points}</p>
            <p className="text-sm opacity-90">
              {tier} tier · {Math.max(0, next - s.points)} pts to next tier
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-accent-foreground/25">
              <div
                className="h-full bg-accent-foreground transition-all"
                style={{ width: `${Math.min(100, (s.points / next) * 100)}%` }}
              />
            </div>
            <button
              onClick={redeem}
              className="mt-6 w-full rounded-full bg-accent-foreground py-3 font-semibold text-accent shadow-md transition hover:scale-[1.02] active:scale-95"
            >
              Redeem treat box · 200 pts
            </button>
          </div>

          {/* Bookings List */}
          <div className="rounded-3xl bg-card p-8 shadow-3d">
            <h3 className="text-2xl font-bold">Bookings</h3>
            <div className="mt-4 flex gap-1 rounded-full bg-muted p-1 text-sm">
              {(["upcoming", "done", "cancelled"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 rounded-full py-1.5 capitalize transition ${
                    tab === t ? "bg-card font-semibold shadow-sm" : ""
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto">
              {list.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center gap-3 rounded-2xl bg-secondary p-3 animate-in fade-in slide-in-from-bottom-2"
                >
                  <div className="rounded-xl bg-accent px-3 py-2 text-center text-xs font-bold text-accent-foreground">
                    {b.date.slice(4, 10)}
                    <br />
                    {b.time}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">
                      {b.plan} · ₹{b.total}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {s.pets.find((p) => p.id === b.petId)?.name ?? "Pet"}
                      {b.addons.length ? ` + ${b.addons.length} extras` : ""}
                    </p>
                  </div>
                  {tab === "upcoming" && (
                    <>
                      <button
                        aria-label="Complete"
                        onClick={() => setStatus(b.id, "done")}
                        className="rounded-full bg-mint p-2 transition hover:scale-110"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        aria-label="Cancel"
                        onClick={() => setStatus(b.id, "cancelled")}
                        className="rounded-full bg-card p-2 transition hover:scale-110"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </li>
              ))}
              {!list.length && (
                <li className="py-6 text-center text-sm text-muted-foreground">
                  Nothing here yet.{" "}
                  {tab === "upcoming" && (
                    <Link to="/book" search={{ plan: "Spa" }} className="font-semibold text-accent underline">
                      Book now
                    </Link>
                  )}
                </li>
              )}
            </ul>
          </div>

          {/* ================= EXTRA FEATURE 1: LIVE SPA CAM STREAM ================= */}
          <div className="rounded-3xl bg-card p-8 shadow-3d lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Live Grooming Cam 📹</h3>
                  <p className="text-xs text-muted-foreground">
                    Direct Stream from Groomer · {s.broadcast.activeCam}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                    s.broadcast.isBroadcasting
                      ? "bg-destructive/15 text-destructive animate-pulse"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      s.broadcast.isBroadcasting ? "bg-destructive animate-ping" : "bg-neutral-400"
                    }`}
                  />
                  {s.broadcast.isBroadcasting ? "LIVE HD ON AIR" : "STREAM STANDBY"}
                </span>
                <button
                  onClick={takeSnapshot}
                  className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-accent-foreground shadow-sm transition hover:scale-105 active:scale-95"
                >
                  <Camera className="h-3.5 w-3.5" /> Save Photo
                </button>
              </div>
            </div>

            {/* Video Canvas Simulation */}
            <div className="relative mt-5 aspect-video w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-inner flex flex-col justify-between p-4 text-white">
              <div className="flex items-center justify-between text-xs opacity-80">
                <span className="font-mono bg-black/50 px-2.5 py-1 rounded">
                  FEED: {s.broadcast.activeCam} // {pet?.name ?? "PET"}_SPA
                </span>
                <span className="font-mono bg-black/50 px-2.5 py-1 rounded">1080p 60FPS</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <div className="text-7xl animate-bounce">{pet?.e ?? "🐶"}</div>
                <div className="mt-2 text-sm font-semibold tracking-wide bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-sm">
                  {s.broadcast.isBroadcasting ? (
                    <>
                      {pet?.name ?? "Your Pet"} is currently at: <strong>{steps[step]}</strong>! 🫧
                    </>
                  ) : (
                    <span>Groomer standing by for next station transfer</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs opacity-75">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Live Feed Synced with Salon
                </span>
                <span>Groomer: Sarah M. (Certified Master)</span>
              </div>
            </div>

            {/* Video Recorded Highlights from Groomer */}
            <div className="mt-5 border-t pt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center justify-between">
                <span>📹 Recorded Video Clips from Groomer ({s.broadcast.recordedClips.length})</span>
                <span className="text-[10px] text-accent font-semibold">Saved to Pet Diary</span>
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {s.broadcast.recordedClips.map((clip) => (
                  <div
                    key={clip.id}
                    className="flex items-center justify-between rounded-2xl bg-secondary/80 p-3 text-xs border border-border/50"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{clip.thumbnailEmoji}</span>
                      <div>
                        <p className="font-bold text-foreground">{clip.title}</p>
                        <p className="text-[11px] text-muted-foreground">{clip.stage} · {clip.time}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-accent text-accent-foreground px-2 py-0.5 text-[10px] font-bold">
                      ▶ {clip.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Snapshots Sent by Groomer */}
            <div className="mt-4 border-t pt-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Live Snapshots Sent by Groomer ({s.broadcast.liveSnapshots.length})
              </p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {s.broadcast.liveSnapshots.map((sn) => (
                  <div
                    key={sn.id}
                    className="flex shrink-0 items-center gap-2 rounded-2xl bg-secondary px-3 py-2 text-xs font-medium animate-in fade-in"
                  >
                    <span className="text-lg">{sn.emoji}</span>
                    <div>
                      <p className="font-bold text-foreground">{sn.title}</p>
                      <p className="text-[10px] text-muted-foreground">{sn.stage} · {sn.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= EXTRA FEATURE 2: HEALTH & VACCINE PASSPORT ================= */}
          <div className="rounded-3xl bg-mint p-8 text-foreground shadow-3d">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Health Passport</h3>
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Veterinary records for {pet?.name ?? "your pet"}</p>
            <div className="mt-5 space-y-3">
              {vaccines.map((v) => (
                <div
                  key={v.id}
                  onClick={() => toggleVaccine(v.id)}
                  className="flex cursor-pointer items-center justify-between rounded-2xl bg-card p-3 shadow-sm transition hover:scale-[1.02] active:scale-95"
                >
                  <div className="flex items-center gap-2.5">
                    {v.done ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-bold">{v.name}</p>
                      <p className="text-[11px] text-muted-foreground">{v.date}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      v.done ? "bg-mint text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {v.done ? "Verified" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => toast.success("PDF Vet Certificate downloaded! 📄")}
              className="mt-6 w-full rounded-full bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-md transition hover:scale-105 active:scale-95"
            >
              Export Vet Records (PDF)
            </button>
          </div>

          {/* ================= EXTRA FEATURE 3: DAILY WELLNESS & HYDRATION TRACKER ================= */}
          <div className="rounded-3xl bg-sun p-8 text-foreground shadow-3d lg:col-span-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold">Daily Wellness & Routine 🐾</h3>
                <p className="text-xs text-muted-foreground">Keep your pet hydrated, active, and well-fed throughout the day</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-card px-4 py-1.5 text-xs font-bold shadow-sm">
                  Goal Status: 85% Completed
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {/* Hydration */}
              <div className="rounded-2xl bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-accent" />
                    <span className="font-bold text-sm">Water Intake</span>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">{waterCups}/5 Bowls</span>
                </div>
                <div className="mt-4 flex gap-2">
                  {[1, 2, 3, 4, 5].map((cup) => (
                    <button
                      key={cup}
                      onClick={() => {
                        setWaterCups(cup);
                        toast.success(`Logged ${cup} bowls of fresh water! 💧`);
                      }}
                      className={`flex-1 rounded-xl py-2 text-center text-sm font-bold transition ${
                        cup <= waterCups
                          ? "bg-accent text-accent-foreground shadow-sm scale-105"
                          : "bg-muted text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      💧
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-[11px] text-muted-foreground">Click a bowl to log water replenishment.</p>
              </div>

              {/* Meals */}
              <div className="rounded-2xl bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-primary" />
                    <span className="font-bold text-sm">Meal Tracker</span>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">
                    {Object.values(meals).filter(Boolean).length}/3 Served
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {(["breakfast", "lunch", "dinner"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setMeals({ ...meals, [m]: !meals[m] });
                        toast.success(`${m.charAt(0).toUpperCase() + m.slice(1)} marked ${!meals[m] ? "served 🍲" : "pending"}`);
                      }}
                      className={`rounded-xl py-2 capitalize text-xs font-bold transition ${
                        meals[m]
                          ? "bg-mint text-primary shadow-sm"
                          : "bg-muted text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {meals[m] ? "✓ " : ""}{m}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-[11px] text-muted-foreground">Tap a meal slot to toggle nutrition log.</p>
              </div>

              {/* Activity Walk */}
              <div className="rounded-2xl bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Footprints className="h-5 w-5 text-destructive" />
                    <span className="font-bold text-sm">Walking Exercise</span>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">{walkKm.toFixed(1)} / 3.0 km</span>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-destructive transition-all duration-500"
                    style={{ width: `${Math.min(100, (walkKm / 3.0) * 100)}%` }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-[11px] text-muted-foreground">Daily cardio fitness</p>
                  <button
                    onClick={() => {
                      setWalkKm((w) => +(w + 0.5).toFixed(1));
                      toast.success("Added +0.5 km walk! 🐕🐾");
                    }}
                    className="rounded-full bg-destructive/15 px-3 py-1 text-[11px] font-bold text-destructive transition hover:bg-destructive/25 active:scale-95"
                  >
                    + 0.5 km Log
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
