import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PawPrint, Scissors, Mail, Lock, User, Phone, MapPin, Building, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, KeyRound } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { setState, uid, useStore, UserRole, GroomingCenter } from "@/lib/store";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In or Register — Fur&Fern Pet Spa" },
      { name: "description", content: "Access your pet parent portal or grooming salon center dashboard." },
      { property: "og:title", content: "Sign In or Register — Fur&Fern Pet Spa" },
      { property: "og:description", content: "Access your pet parent portal or grooming salon center dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const s = useStore();
  const nav = useNavigate();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<UserRole>("parent");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  
  // Groomer-specific signup fields
  const [shopName, setShopName] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [shopArea, setShopArea] = useState("HSR Layout");

  // Auto-fill credential presets
  const fillCredentials = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setTab("login");
    if (selectedRole === "parent") {
      setLoginEmail("parent@furfern.in");
      setLoginPassword("parent123");
      toast.info("Filled Pet Parent demo credentials 🐶");
    } else {
      setLoginEmail("groomer@furfern.in");
      setLoginPassword("groomer123");
      toast.info("Filled Grooming Shop demo credentials 💈");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      toast.error("Please enter your email");
      return;
    }

    const isGroomer = role === "groomer" || loginEmail.includes("groomer") || loginEmail.includes("salon");

    const newUser = {
      id: uid(),
      email: loginEmail,
      name: isGroomer ? "Sarah M. (Master Groomer)" : (loginEmail.split("@")[0] || "Pet Parent"),
      role: isGroomer ? ("groomer" as UserRole) : ("parent" as UserRole),
      phone: "+91 98765 00000",
      shopName: isGroomer ? "Fur&Fern Flagship Spa & Sanctuary" : undefined,
      shopArea: isGroomer ? "HSR Layout" : undefined,
    };

    setState((st) => ({ ...st, currentUser: newUser }));
    toast.success(`Welcome back, ${newUser.name}! 👋`);
    
    if (newUser.role === "groomer") {
      nav({ to: "/groomer" });
    } else {
      nav({ to: "/dashboard" });
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in your name and email");
      return;
    }

    if (role === "groomer" && !shopName.trim()) {
      toast.error("Please provide your Grooming Salon Name");
      return;
    }

    if (role === "groomer" && !shopAddress.trim()) {
      toast.error("Please provide your salon address so pet parents can find you on the map");
      return;
    }

    const newUser = {
      id: uid(),
      name: name.trim(),
      email: email.trim(),
      role: role,
      phone: phone.trim() || "+91 98000 11223",
      shopName: role === "groomer" ? shopName.trim() : undefined,
      shopAddress: role === "groomer" ? shopAddress.trim() : undefined,
      shopArea: role === "groomer" ? shopArea : undefined,
    };

    if (role === "groomer") {
      const newCenter: GroomingCenter = {
        id: `gc-${uid()}`,
        name: shopName.trim(),
        ownerName: name.trim(),
        address: shopAddress.trim(),
        area: shopArea,
        city: "Bengaluru",
        distance: "1.0 km away",
        rating: 5.0,
        reviews: 1,
        lat: 12.9121 + (Math.random() - 0.5) * 0.05,
        lng: 77.6446 + (Math.random() - 0.5) * 0.05,
        xPercent: 30 + Math.floor(Math.random() * 50),
        yPercent: 30 + Math.floor(Math.random() * 50),
        phone: phone.trim() || "+91 98000 11223",
        openHours: "09:00 AM – 08:00 PM",
        slotsAvailable: 6,
        amenities: ["Breed styling", "Organic bubble bath", "Live HD Cam", "Fear-Free certified"],
        verified: true,
      };

      setState((st) => ({
        ...st,
        currentUser: newUser,
        centers: [newCenter, ...st.centers],
      }));
      toast.success(`🎉 Grooming salon "${shopName}" registered & pinned on the pet map!`);
      nav({ to: "/groomer" });
    } else {
      setState((st) => ({
        ...st,
        currentUser: newUser,
      }));
      toast.success(`🎉 Welcome to Fur&Fern, ${name}!`);
      nav({ to: "/dashboard" });
    }
  };

  return (
    <div className="min-h-screen bg-hero">
      <SiteNav />

      <main className="mx-auto max-w-5xl px-6 pt-32 pb-20">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-card/80 backdrop-blur px-4 py-1.5 text-xs font-bold shadow-sm border border-border/50">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> Two-Way Portal Sync
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-black">Pet Parent & Groomer Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in below to test live camera streaming, stage updates, and real-time synchronization between both sides.
          </p>
        </div>

        {/* DEMO CREDENTIALS BOX (EXPLICIT USER PASSWORDS) */}
        <div className="mb-8 rounded-3xl bg-card p-6 shadow-3d border-2 border-primary/20 backdrop-blur">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="h-5 w-5 text-accent" />
            <h2 className="text-base font-black">Test Login Credentials (Click to Auto-fill)</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Parent Box */}
            <div className="rounded-2xl bg-secondary/80 p-4 border border-border">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm flex items-center gap-1.5">
                  🐶 Pet Parent Account
                </span>
                <span className="text-[10px] bg-accent/20 text-accent font-bold px-2 py-0.5 rounded-full">
                  Parent Side
                </span>
              </div>
              <div className="mt-3 space-y-1 text-xs font-mono bg-background/60 p-2.5 rounded-xl border">
                <p>Email: <strong className="text-foreground">parent@furfern.in</strong></p>
                <p>Password: <strong className="text-foreground">parent123</strong></p>
              </div>
              <button
                type="button"
                onClick={() => fillCredentials("parent")}
                className="mt-3 w-full rounded-full bg-accent py-2 text-xs font-bold text-accent-foreground shadow-sm hover:scale-[1.02] transition"
              >
                Auto-fill Pet Parent Login →
              </button>
            </div>

            {/* Groomer Box */}
            <div className="rounded-2xl bg-secondary/80 p-4 border border-border">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm flex items-center gap-1.5">
                  💈 Grooming Center Account
                </span>
                <span className="text-[10px] bg-primary/20 text-primary font-bold px-2 py-0.5 rounded-full">
                  Salon Side
                </span>
              </div>
              <div className="mt-3 space-y-1 text-xs font-mono bg-background/60 p-2.5 rounded-xl border">
                <p>Email: <strong className="text-foreground">groomer@furfern.in</strong></p>
                <p>Password: <strong className="text-foreground">groomer123</strong></p>
              </div>
              <button
                type="button"
                onClick={() => fillCredentials("groomer")}
                className="mt-3 w-full rounded-full bg-primary py-2 text-xs font-bold text-primary-foreground shadow-sm hover:scale-[1.02] transition"
              >
                Auto-fill Groomer Salon Login →
              </button>
            </div>
          </div>
        </div>

        {/* Main Auth Form Box */}
        <div className="mx-auto max-w-xl rounded-3xl bg-card/95 p-8 shadow-3d backdrop-blur border border-border/60">
          {/* Login vs Signup Tabs */}
          <div className="flex rounded-full bg-muted p-1 text-sm font-bold">
            <button
              onClick={() => setTab("login")}
              className={`flex-1 rounded-full py-2.5 transition-all duration-200 ${
                tab === "login" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab("signup")}
              className={`flex-1 rounded-full py-2.5 transition-all duration-200 ${
                tab === "signup" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Register New Account
            </button>
          </div>

          {/* Role Selector */}
          <div className="mt-6">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
              Select Login Role:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("parent")}
                className={`flex items-center justify-center gap-2 rounded-2xl p-3 font-bold text-sm border-2 transition-all duration-200 ${
                  role === "parent"
                    ? "border-accent bg-accent/15 text-accent shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:bg-secondary"
                }`}
              >
                <PawPrint className="h-4 w-4" /> Pet Parent
              </button>
              <button
                type="button"
                onClick={() => setRole("groomer")}
                className={`flex items-center justify-center gap-2 rounded-2xl p-3 font-bold text-sm border-2 transition-all duration-200 ${
                  role === "groomer"
                    ? "border-primary bg-primary/15 text-primary shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:bg-secondary"
                }`}
              >
                <Scissors className="h-4 w-4" /> Grooming Salon
              </button>
            </div>
          </div>

          {/* LOGIN FORM */}
          {tab === "login" ? (
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder={role === "parent" ? "parent@furfern.in" : "groomer@furfern.in"}
                    className="w-full rounded-2xl border bg-background pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-2xl border bg-background pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full rounded-full py-3.5 text-sm font-bold shadow-3d transition hover:scale-[1.02] active:scale-95 ${
                  role === "groomer"
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-accent-foreground"
                }`}
              >
                Sign In to {role === "groomer" ? "Groomer Salon Portal" : "Pet Parent Dashboard"} →
              </button>
            </form>
          ) : (
            /* SIGNUP FORM */
            <form onSubmit={handleSignup} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Your Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full rounded-2xl border bg-background pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              {role === "groomer" && (
                <>
                  <div>
                    <label className="text-xs font-bold text-primary mb-1 block">Grooming Salon Business Name</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-3.5 h-4 w-4 text-primary" />
                      <input
                        type="text"
                        required
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        placeholder="e.g. Pampered Paws Boutique"
                        className="w-full rounded-2xl border bg-background pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground mb-1 block">Salon Neighborhood / Area</label>
                      <select
                        value={shopArea}
                        onChange={(e) => setShopArea(e.target.value)}
                        className="w-full rounded-2xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="HSR Layout">HSR Layout</option>
                        <option value="Koramangala">Koramangala</option>
                        <option value="Indiranagar">Indiranagar</option>
                        <option value="Whitefield">Whitefield</option>
                        <option value="Jayanagar">Jayanagar</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-muted-foreground mb-1 block">Shop Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          required
                          value={shopAddress}
                          onChange={(e) => setShopAddress(e.target.value)}
                          placeholder="Street & Building No."
                          className="w-full rounded-2xl border bg-background pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full rounded-2xl border bg-background pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1 block">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98000 00000"
                      className="w-full rounded-2xl border bg-background pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password"
                    className="w-full rounded-2xl border bg-background pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              {role === "groomer" && (
                <div className="rounded-2xl bg-primary/10 p-3 text-xs text-primary flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Your salon location will be automatically registered and visible on the pet parents map!</span>
                </div>
              )}

              <button
                type="submit"
                className={`w-full rounded-full py-3.5 text-sm font-bold shadow-3d transition hover:scale-[1.02] active:scale-95 ${
                  role === "groomer"
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-accent-foreground"
                }`}
              >
                Register {role === "groomer" ? "Salon Partner" : "Pet Parent"} →
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
