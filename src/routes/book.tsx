import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Sparkles,
  Plus,
  ShieldCheck,
  Heart,
  ArrowRight,
  Lock,
  Mail,
  User as UserIcon,
  Video,
  FileText,
  Gift,
  AlertCircle,
  Tag,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { Tilt } from "@/components/Tilt";
import { GeminiAssistant } from "@/components/GeminiAssistant";
import { ADDONS, PLANS, SLOTS, priceFor, setState, uid, useStore, UserRole } from "@/lib/store";

export const Route = createFileRoute("/book")({
  validateSearch: (s: Record<string, unknown>) => ({ plan: typeof s["plan"] === "string" ? s["plan"] : "Spa" }),
  head: () => ({
    meta: [
      { title: "Book a Grooming Session — Fur&Fern" },
      { name: "description", content: "Pick your pet, package, add-ons and time slot in four easy steps." },
      { property: "og:title", content: "Book a Grooming Session — Fur&Fern" },
      { property: "og:description", content: "Pick your pet, package, add-ons and time slot in four easy steps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Book,
});

const days = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i + 1);
  return d;
});

const EMOJI = ["🐶", "🐱", "🐕", "🐩", "🐈", "🐰"];

function Book() {
  const { plan: initPlan } = Route.useSearch();
  const s = useStore();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [petId, setPetId] = useState(s.pets[0]?.id ?? "");
  const [plan, setPlan] = useState(initPlan);
  const [addons, setAddons] = useState<string[]>([]);
  const [date, setDate] = useState(days[0]!.toDateString());
  const [time, setTime] = useState("");
  const [usePoints, setUsePoints] = useState(false);
  const [addingPet, setAddingPet] = useState(false);
  const [newPetName, setNewPetName] = useState("");
  const [newPetBreed, setNewPetBreed] = useState("");
  const [newPetEmoji, setNewPetEmoji] = useState("🐶");

  // Inline auth state for unauthenticated guests
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authTab, setAuthTab] = useState<"login" | "quick-register">("login");
  const [regName, setRegName] = useState("");
  const [regPetName, setRegPetName] = useState("");
  const [regPetBreed, setRegPetBreed] = useState("");

  const [selectedCenterId, setSelectedCenterId] = useState(s.centers[0]?.id || "gc-1");
  const [promoCode, setPromoCode] = useState("FIRST20");
  const isFirst20Applied = promoCode.trim().toUpperCase() === "FIRST20";
  const taken = s.bookings.filter((b) => b.date === date && b.status === "upcoming").map((b) => b.time);
  const price = priceFor(plan, addons, s.points, usePoints);
  const rawSubtotal = Math.max(0, price.base + price.add - (usePoints ? price.discount : 0));
  const promoDiscountAmount = isFirst20Applied ? Math.round(rawSubtotal * 0.20) : 0;
  const finalTotal = Math.max(0, rawSubtotal - promoDiscountAmount);
  const canNext = [!!petId, !!plan, true, !!time][step];

  const selectedCenter = s.centers.find((c) => c.id === selectedCenterId) || s.centers[0];

  const handleQuickAddPet = () => {
    if (!newPetName.trim()) {
      toast.error("Please provide your pet's name");
      return;
    }
    const id = uid();
    setState((st) => ({
      ...st,
      pets: [
        ...st.pets,
        { id, name: newPetName.trim(), breed: newPetBreed.trim() || "Good pet", e: newPetEmoji, coat: 80, mood: 95 },
      ],
    }));
    setPetId(id);
    setAddingPet(false);
    setNewPetName("");
    setNewPetBreed("");
    toast.success(`${newPetName} added to your pack! 🐾`);
  };

  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) {
      toast.error("Please enter your email");
      return;
    }
    const newUser = {
      id: uid(),
      name: authEmail.split("@")[0] || "Pet Parent",
      email: authEmail,
      role: "parent" as UserRole,
      phone: "+91 98765 12345",
    };
    setState((st) => ({ ...st, currentUser: newUser }));
    toast.success(`Welcome, ${newUser.name}! Your pet profile has been loaded.`);
  };

  const handleDemoParentLogin = () => {
    setState((st) => ({
      ...st,
      currentUser: {
        id: "u-parent-demo",
        name: "Alex Morgan",
        email: "parent@furfern.in",
        role: "parent",
        phone: "+91 98765 12345",
      },
    }));
    toast.success("Signed in as Alex Morgan! Loaded Biscuit 🐶 and Miso 🐱.");
  };

  const handleInlineRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !authEmail.trim()) {
      toast.error("Please provide your name and email");
      return;
    }
    const newPetId = uid();
    const newUser = {
      id: uid(),
      name: regName.trim(),
      email: authEmail.trim(),
      role: "parent" as UserRole,
      phone: "+91 98000 11223",
    };
    const newPet = {
      id: newPetId,
      name: regPetName.trim() || "My Pet",
      breed: regPetBreed.trim() || "Golden Retriever",
      e: "🐶",
      coat: 85,
      mood: 95,
    };
    setState((st) => ({
      ...st,
      currentUser: newUser,
      pets: [newPet, ...st.pets],
    }));
    setPetId(newPetId);
    toast.success(`Account created for ${regName} with pet ${newPet.name}! Ready to book.`);
  };

  const confirm = () => {
    const curPet = s.pets.find((p) => p.id === petId);
    setState((st) => ({
      ...st,
      points: st.points - price.discount + Math.round(finalTotal / 10),
      bookings: [
        ...st.bookings,
        {
          id: `b-${uid()}`,
          petId,
          petName: curPet?.name || "Pet",
          petBreed: curPet?.breed || "Breed",
          petEmoji: curPet?.e || "🐶",
          customerName: s.currentUser?.name || "Pet Parent",
          customerPhone: s.currentUser?.phone || "+91 98765 12345",
          centerId: selectedCenter?.id,
          centerName: selectedCenter?.name,
          plan,
          addons,
          date,
          time,
          total: finalTotal,
          status: "upcoming",
          currentStep: 0,
        },
      ],
    }));
    toast.success("Booking confirmed with 20% discount! 🎉", {
      description: `${selectedCenter?.name} · ${date.slice(0, 10)} at ${time} · ₹${finalTotal}`,
    });
    nav({ to: "/dashboard" });
  };

  const card = (on: boolean) =>
    `rounded-2xl border-2 p-5 text-left transition-all duration-200 hover:-translate-y-1 ${
      on ? "border-accent bg-accent/10 shadow-3d scale-[1.02]" : "border-border bg-card hover:bg-secondary/60"
    }`;

  const currentPet = s.pets.find((p) => p.id === petId);

  // ================= 1. GUARD: IF SIGNED IN AS GROOMER SALON =================
  if (s.currentUser?.role === "groomer") {
    return (
      <div className="min-h-screen bg-hero">
        <SiteNav />
        <main className="mx-auto max-w-2xl px-6 pt-36 pb-20 text-center">
          <div className="rounded-3xl bg-card p-10 shadow-3d border-2 border-primary/30">
            <div className="text-6xl mb-4">💈</div>
            <h1 className="text-3xl font-black">Grooming Salon Account Detected</h1>
            <p className="mt-3 text-muted-foreground text-sm">
              You are signed in as <strong>{s.currentUser.name}</strong> (Grooming Salon Manager).
              Grooming salons manage the incoming appointments queue and live camera streams.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              To book a personal spa session for your own pet, please sign in with a Pet Parent account.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/groomer"
                className="rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-md hover:scale-105 transition"
              >
                Go to Salon Appointments Portal →
              </Link>
              <Link
                to="/auth"
                className="rounded-full border-2 border-primary px-6 py-3 font-bold text-primary hover:bg-secondary transition"
              >
                Switch to Pet Parent Account
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ================= 2. REALISTIC INTRO: IF NOT SIGNED IN =================
  if (!s.currentUser || s.currentUser.role !== "parent") {
    return (
      <div className="min-h-screen bg-hero">
        <SiteNav />
        <main className="mx-auto max-w-4xl px-6 pt-32 pb-20">
          {/* Intro Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-card/85 backdrop-blur px-4 py-1.5 text-xs font-bold shadow-sm border border-border">
              <Lock className="h-3.5 w-3.5 text-accent" /> Secure Pet Parent Authentication Required
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-black">Sign In to Book Your Pet's Spa Day</h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              In our verified luxury spa network, an active Pet Parent account is required before booking so our master groomers can fetch your pet's breed history, medical sensitivities, and stream live camera feeds directly to your dashboard.
            </p>
          </div>

          {/* 3 Why Sign In Benefits */}
          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            <Tilt>
              <div className="h-full rounded-3xl bg-card p-6 shadow-3d border border-border flex flex-col justify-between">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sun text-foreground mb-3 font-bold">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-base">Medical & Coat Profile</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Auto-fetches skin allergies, vaccination history, and custom clipper preferences.
                  </p>
                </div>
                <span className="mt-4 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full w-fit">
                  Customized Styling
                </span>
              </div>
            </Tilt>

            <Tilt>
              <div className="h-full rounded-3xl bg-mint p-6 shadow-3d border border-border flex flex-col justify-between">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-3 font-bold">
                    <Video className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-base">Live HD Grooming Cam</h3>
                  <p className="text-xs text-primary/80 mt-1">
                    Watch your fur baby live from the tub station and receive real-time stage updates.
                  </p>
                </div>
                <span className="mt-4 text-[10px] font-bold text-primary bg-background/50 px-2 py-0.5 rounded-full w-fit">
                  Live Station Sync
                </span>
              </div>
            </Tilt>

            <Tilt>
              <div className="h-full rounded-3xl bg-coral p-6 text-accent-foreground shadow-3d border border-border flex flex-col justify-between">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-foreground text-accent mb-3 font-bold">
                    <Gift className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-base">Paw Points Rewards</h3>
                  <p className="text-xs opacity-90 mt-1">
                    Earn 10% back in points on every treatment for free gourmet treat boxes and discounts.
                  </p>
                </div>
                <span className="mt-4 text-[10px] font-bold text-accent bg-accent-foreground px-2 py-0.5 rounded-full w-fit">
                  Instant Cashback
                </span>
              </div>
            </Tilt>
          </div>

          {/* Quick Sign-In / Fast Demo Entry Box */}
          <div className="mx-auto max-w-xl rounded-3xl bg-card/95 p-8 shadow-3d backdrop-blur border-2 border-primary/20">
            {/* 1-Click Demo Parent Button */}
            <div className="mb-6 rounded-2xl bg-sun/40 p-4 border border-sun text-center">
              <p className="text-xs font-black uppercase tracking-wider text-foreground mb-2">
                ⚡ Instant Demo Access (No Typing Needed)
              </p>
              <button
                type="button"
                onClick={handleDemoParentLogin}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-accent py-3 text-xs font-bold text-accent-foreground shadow-md transition hover:scale-[1.02] active:scale-95"
              >
                <span>Continue as Alex Morgan & Biscuit 🐶 (Demo Parent)</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="relative my-6 text-center text-xs text-muted-foreground">
              <span className="bg-card px-3 relative z-10 font-bold uppercase tracking-wider">or sign in with credentials</span>
              <div className="absolute inset-x-0 top-1/2 border-t border-border -z-0" />
            </div>

            {/* Toggle Login vs Quick Register */}
            <div className="flex rounded-full bg-muted p-1 text-xs font-bold mb-5">
              <button
                type="button"
                onClick={() => setAuthTab("login")}
                className={`flex-1 rounded-full py-2 transition ${authTab === "login" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthTab("quick-register")}
                className={`flex-1 rounded-full py-2 transition ${authTab === "quick-register" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
              >
                Quick Register New Pet
              </button>
            </div>

            {authTab === "login" ? (
              <form onSubmit={handleInlineLogin} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="parent@furfern.in"
                      className="w-full rounded-2xl border bg-background pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="parent123"
                      className="w-full rounded-2xl border bg-background pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-primary py-3 text-xs font-bold text-primary-foreground shadow-md transition hover:scale-[1.02] active:scale-95"
                >
                  Sign In & Unlock Booking Wizard →
                </button>
              </form>
            ) : (
              <form onSubmit={handleInlineRegister} className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-1 block">Your Name</label>
                    <input
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Maria"
                      className="w-full rounded-2xl border bg-background px-3.5 py-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-1 block">Email</label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="maria@example.com"
                      className="w-full rounded-2xl border bg-background px-3.5 py-2.5 text-xs"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-1 block">Pet's Name</label>
                    <input
                      required
                      value={regPetName}
                      onChange={(e) => setRegPetName(e.target.value)}
                      placeholder="e.g. Charlie"
                      className="w-full rounded-2xl border bg-background px-3.5 py-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-1 block">Pet's Breed</label>
                    <input
                      value={regPetBreed}
                      onChange={(e) => setRegPetBreed(e.target.value)}
                      placeholder="e.g. Poodle"
                      className="w-full rounded-2xl border bg-background px-3.5 py-2.5 text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-accent py-3 text-xs font-bold text-accent-foreground shadow-md transition hover:scale-[1.02] active:scale-95"
                >
                  Create Account & Start Booking →
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ================= 3. AUTHENTICATED PET PARENT BOOKING WIZARD =================
  return (
    <div className="min-h-screen bg-hero">
      <SiteNav />
      <main className="mx-auto grid max-w-6xl gap-8 px-6 pt-32 pb-20 lg:grid-cols-3">
        {/* Main Wizard Card */}
        <div className="lg:col-span-2 rounded-3xl bg-card/95 p-8 shadow-3d backdrop-blur border border-border/50">
          {/* Welcome User Banner */}
          <div className="mb-6 flex items-center justify-between border-b pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-accent">Authenticated Pet Parent</p>
              <h2 className="text-xl font-black">Booking for {s.currentUser.name}'s Pack</h2>
            </div>
            <span className="text-xs rounded-full bg-mint px-3 py-1 font-bold text-primary">
              🐾 {s.pets.length} Pets Registered
            </span>
          </div>

          {/* Header Step Pills */}
          <div className="flex gap-2">
            {[
              { l: "Pet", n: 1 },
              { l: "Package", n: 2 },
              { l: "Extras", n: 3 },
              { l: "Date & Time", n: 4 },
            ].map((item, i) => (
              <button
                key={item.l}
                onClick={() => i < step && setStep(i)}
                className={`flex-1 rounded-full py-2.5 text-xs font-bold transition-all duration-300 ${
                  i === step
                    ? "bg-accent text-accent-foreground shadow-md scale-[1.02]"
                    : i < step
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? "✓ " : `${item.n}. `}
                {item.l}
              </button>
            ))}
          </div>

          {/* Wizard Content Panels */}
          <div key={step} className="mt-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* STEP 1: PET SELECTION */}
            {step === 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-black">Who is getting pampered?</h2>
                    <p className="text-xs text-muted-foreground">Select a pet from your pack or add a new one.</p>
                  </div>
                  <button
                    onClick={() => setAddingPet(!addingPet)}
                    className="inline-flex items-center gap-1 text-xs font-bold rounded-full bg-secondary px-3 py-1.5 hover:bg-primary hover:text-primary-foreground transition"
                  >
                    <Plus className="h-3.5 w-3.5" /> New Pet
                  </button>
                </div>

                {addingPet && (
                  <div className="mb-6 rounded-2xl bg-secondary/80 p-4 border border-border animate-in fade-in">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Quick Add Pet</p>
                    <div className="flex gap-2 mb-3">
                      {EMOJI.map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => setNewPetEmoji(em)}
                          className={`text-xl p-1.5 rounded-lg ${newPetEmoji === em ? "bg-sun shadow-sm" : ""}`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        value={newPetName}
                        onChange={(e) => setNewPetName(e.target.value)}
                        placeholder="Pet name (e.g. Luna)"
                        className="rounded-xl border bg-background px-3 py-2 text-sm"
                      />
                      <input
                        value={newPetBreed}
                        onChange={(e) => setNewPetBreed(e.target.value)}
                        placeholder="Breed (e.g. Beagle)"
                        className="rounded-xl border bg-background px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <button onClick={() => setAddingPet(false)} className="px-3 py-1 text-xs text-muted-foreground">Cancel</button>
                      <button onClick={handleQuickAddPet} className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground">Save & Select</button>
                    </div>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  {s.pets.map((p) => (
                    <button key={p.id} onClick={() => setPetId(p.id)} className={card(petId === p.id)}>
                      <div className="flex items-center justify-between">
                        <span className="text-5xl">{p.e}</span>
                        {petId === p.id && <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">✓</span>}
                      </div>
                      <p className="mt-3 font-display text-2xl font-bold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.breed}</p>
                      <div className="mt-3 flex gap-2 text-[11px]">
                        <span className="rounded-md bg-secondary px-2 py-0.5 font-medium">Coat: {p.coat}%</span>
                        <span className="rounded-md bg-secondary px-2 py-0.5 font-medium">Mood: {p.mood}%</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: PACKAGE SELECTION */}
            {step === 1 && (
              <div>
                <div className="mb-4">
                  <h2 className="text-2xl font-black">Choose a Spa Experience</h2>
                  <p className="text-xs text-muted-foreground">All packages include warm organic botanical wash and blow dry.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {PLANS.map((p) => (
                    <button key={p.id} onClick={() => setPlan(p.id)} className={card(plan === p.id)}>
                      <div className="flex items-center justify-between">
                        <span className="text-4xl">{p.e}</span>
                        {p.id === "Spa" && <span className="rounded-full bg-sun px-2 py-0.5 text-[10px] font-bold text-foreground">Popular</span>}
                      </div>
                      <p className="mt-3 font-display text-xl font-bold">{p.id}</p>
                      <p className="font-display text-3xl font-black text-accent mt-1">₹{p.price}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" /> {p.mins} mins
                      </p>
                      <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                        {p.items.map((it) => (
                          <li key={it} className="flex items-center gap-1.5">
                            <Check className="h-3 w-3 text-primary shrink-0" /> {it}
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: EXTRAS / ADDONS */}
            {step === 2 && (
              <div>
                <div className="mb-4">
                  <h2 className="text-2xl font-black">Custom Add-on Delights</h2>
                  <p className="text-xs text-muted-foreground">Optional treatments to upgrade your fur baby's session.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {ADDONS.map((a) => {
                    const on = addons.includes(a.id);
                    return (
                      <button
                        key={a.id}
                        onClick={() =>
                          setAddons((x) => (on ? x.filter((y) => y !== a.id) : [...x, a.id]))
                        }
                        className={`${card(on)} flex items-center justify-between`}
                      >
                        <div>
                          <p className="font-bold text-base">{a.id}</p>
                          <p className="text-sm font-semibold text-accent mt-0.5">+₹{a.price}</p>
                          <p className="text-[11px] text-muted-foreground mt-1">Applied during bath station</p>
                        </div>
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                            on ? "border-accent bg-accent text-accent-foreground shadow-sm" : "border-border text-muted-foreground"
                          }`}
                        >
                          {on ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: DATE & TIME */}
            {step === 3 && (
              <div>
                <div className="mb-5">
                  <h2 className="text-2xl font-black">Select Salon Center & Time</h2>
                  <p className="text-xs text-muted-foreground">Pick your preferred salon location and appointment time slot.</p>
                </div>

                {/* Salon Center Selector */}
                <div className="mb-6 rounded-2xl bg-secondary/70 p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Grooming Salon Location:
                    </label>
                    <Link to="/locations" className="text-[11px] font-bold text-accent hover:underline">
                      View on Map →
                    </Link>
                  </div>
                  <select
                    value={selectedCenterId}
                    onChange={(e) => setSelectedCenterId(e.target.value)}
                    className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {s.centers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — {c.area} ({c.distance}) · {c.rating}★
                      </option>
                    ))}
                  </select>
                </div>

                {/* Days Carousel */}
                <div className="flex gap-2.5 overflow-x-auto pb-3">
                  {days.map((d) => {
                    const v = d.toDateString();
                    const isSel = date === v;
                    return (
                      <button
                        key={v}
                        onClick={() => {
                          setDate(v);
                          setTime("");
                        }}
                        className={`min-w-20 rounded-2xl p-3 text-center transition-all duration-200 ${
                          isSel
                            ? "bg-primary text-primary-foreground shadow-3d scale-105"
                            : "bg-secondary hover:bg-sun/60"
                        }`}
                      >
                        <p className="text-[11px] uppercase font-bold tracking-wider opacity-75">
                          {d.toLocaleDateString("en", { weekday: "short" })}
                        </p>
                        <p className="font-display text-2xl font-black">{d.getDate()}</p>
                        <p className="text-[10px] opacity-70">
                          {d.toLocaleDateString("en", { month: "short" })}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Slots Grid */}
                <div className="mt-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Available Slots</p>
                  <div className="grid grid-cols-3 gap-3">
                    {SLOTS.map((t) => {
                      const busy = taken.includes(t);
                      const isSelected = time === t;
                      return (
                        <button
                          key={t}
                          disabled={busy}
                          onClick={() => setTime(t)}
                          className={`rounded-xl py-3 font-semibold text-sm transition-all duration-200 ${
                            busy
                              ? "bg-muted text-muted-foreground line-through opacity-50 cursor-not-allowed"
                              : isSelected
                              ? "bg-accent text-accent-foreground shadow-3d scale-105"
                              : "bg-secondary hover:bg-sun"
                          }`}
                        >
                          {t}
                          {busy && <span className="block text-[10px] text-muted-foreground">Booked</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="mt-10 flex items-center justify-between border-t pt-6">
            <button
              disabled={step === 0}
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1 rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-secondary disabled:opacity-30 transition"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            {step < 3 ? (
              <button
                disabled={!canNext}
                onClick={() => setStep(step + 1)}
                className="inline-flex items-center gap-1 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:-translate-y-0.5 disabled:opacity-40"
              >
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                disabled={!canNext}
                onClick={confirm}
                className="rounded-full bg-accent px-8 py-3.5 font-bold text-accent-foreground shadow-3d transition hover:scale-105 active:scale-95 disabled:opacity-40"
              >
                Confirm & Book · ₹{finalTotal}
              </button>
            )}
          </div>
        </div>

        {/* Sticky Summary Card */}
        <aside className="h-fit rounded-3xl bg-primary p-8 text-primary-foreground shadow-3d lg:sticky lg:top-28">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">Booking Summary</h2>
            <ShieldCheck className="h-6 w-6 text-mint" />
          </div>

          <dl className="mt-6 space-y-3.5 text-sm">
            <div className="flex justify-between items-center">
              <dt className="opacity-80">Parent Account</dt>
              <dd className="font-bold text-xs truncate max-w-[140px] text-right">
                {s.currentUser.name}
              </dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="opacity-80">Selected Pet</dt>
              <dd className="font-bold flex items-center gap-1.5">
                <span>{currentPet?.e}</span>
                <span>{currentPet?.name ?? "Select pet"}</span>
              </dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="opacity-80">Grooming Center</dt>
              <dd className="font-bold text-xs truncate max-w-[160px] text-right" title={selectedCenter?.name}>
                {selectedCenter?.area}
              </dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="opacity-80">{plan} package</dt>
              <dd className="font-bold">₹{price.base}</dd>
            </div>
            {addons.map((a) => (
              <div key={a} className="flex justify-between items-center opacity-85 text-xs">
                <dt>+ {a}</dt>
                <dd>₹{ADDONS.find((x) => x.id === a)!.price}</dd>
              </div>
            ))}
            <div className="flex justify-between items-center border-t border-primary-foreground/20 pt-3">
              <dt className="opacity-80">Appointment Slot</dt>
              <dd className="font-semibold text-xs">
                {time ? `${date.slice(4, 10)}, ${time}` : "Pick a time slot"}
              </dd>
            </div>
          </dl>

          {/* ══════════ 20% DISCOUNT FOR FIRST-TIME CUSTOMERS (CODE: FIRST20) ══════════ */}
          <div className="mt-5 rounded-2xl bg-primary-foreground/15 p-4 border border-primary-foreground/20 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold flex items-center gap-1.5 text-sun">
                <Tag className="h-3.5 w-3.5" /> 20% First-Time Customer Discount
              </span>
              {isFirst20Applied && (
                <span className="bg-sun text-foreground font-black px-2 py-0.5 rounded text-[10px]">
                  APPLIED ✓
                </span>
              )}
            </div>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="FIRST20"
                className="flex-1 rounded-xl bg-background/90 text-foreground px-3 py-1.5 text-xs font-mono font-bold uppercase"
              />
              <button
                type="button"
                onClick={() => {
                  if (promoCode.trim().toUpperCase() === "FIRST20") {
                    toast.success("20% first-time customer discount applied! ✨");
                  } else {
                    toast.error("Invalid promo code. Use FIRST20 for 20% off.");
                  }
                }}
                className="rounded-xl bg-sun text-foreground font-bold px-3 py-1.5 text-xs hover:opacity-90 transition"
              >
                Apply
              </button>
            </div>
            {isFirst20Applied ? (
              <p className="mt-2 text-[11px] text-sun font-medium">
                🎉 Welcome discount active: <strong>20% OFF</strong> (You save ₹{promoDiscountAmount}!)
              </p>
            ) : (
              <p className="mt-1.5 text-[10px] opacity-75">
                Type <strong>FIRST20</strong> to get 20% discount on your first appointment.
              </p>
            )}
          </div>

          {/* Paw Points Redemption Toggle */}
          <label className="mt-3 flex cursor-pointer items-center justify-between rounded-2xl bg-primary-foreground/15 p-4 text-xs font-medium transition hover:bg-primary-foreground/25">
            <div>
              <p className="font-bold">Redeem Paw Points ({s.points} available)</p>
              <p className="text-[10px] opacity-80">Apply points balance to this booking</p>
            </div>
            <input
              type="checkbox"
              checked={usePoints}
              onChange={(e) => setUsePoints(e.target.checked)}
              className="h-5 w-5 rounded accent-accent"
            />
          </label>

          {price.discount > 0 && (
            <p className="mt-2.5 flex justify-between text-xs font-bold text-mint">
              <span>Paw Points Applied:</span>
              <span>−₹{price.discount}</span>
            </p>
          )}

          {isFirst20Applied && promoDiscountAmount > 0 && (
            <p className="mt-1 flex justify-between text-xs font-bold text-sun">
              <span>First-Timer 20% OFF:</span>
              <span>−₹{promoDiscountAmount}</span>
            </p>
          )}

          {/* Total Price */}
          <div className="mt-6 flex items-end justify-between border-t border-primary-foreground/20 pt-6">
            <div>
              <span className="text-xs uppercase tracking-wider opacity-80">Total Payable</span>
              <p className="text-xs opacity-70">Tax included</p>
            </div>
            <div className="text-right">
              {isFirst20Applied && promoDiscountAmount > 0 && (
                <span className="text-xs line-through opacity-70 block">
                  ₹{rawSubtotal}
                </span>
              )}
              <span className="font-display text-4xl font-black text-sun">
                ₹{finalTotal}
              </span>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-primary-foreground/10 p-3 text-center text-xs opacity-80">
            🐾 You will earn <span className="font-bold text-sun">+{Math.round(finalTotal / 10)} paw points</span> with this visit!
          </div>
        </aside>
      </main>

      {/* Floating Gemini AI Assistant with Voice */}
      <GeminiAssistant role="parent" />
    </div>
  );
}
