import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PawPrint, Scissors, Mail, Lock, User, Phone, MapPin, Building, ArrowRight, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { setState, uid, useStore, UserRole, GroomingCenter } from "@/lib/store";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In or Join — Fur&Fern Pet Spa" },
      { name: "description", content: "Access your pet parent portal or grooming salon center dashboard." },
      { property: "og:title", content: "Sign In or Join — Fur&Fern Pet Spa" },
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      toast.error("Please enter your email");
      return;
    }

    const newUser = {
      id: uid(),
      email: loginEmail,
      name: loginEmail.split("@")[0] || "Pet Parent",
      role: role,
      phone: "+91 98765 00000",
      shopName: role === "groomer" ? "Fur&Fern Studio & Spa" : undefined,
      shopArea: role === "groomer" ? "HSR Layout" : undefined,
    };

    setState((st) => ({ ...st, currentUser: newUser }));
    toast.success(`Welcome back, ${newUser.name}! 👋`);
    
    if (role === "groomer") {
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

    // If registering as a groomer, dynamically register the shop onto the Interactive Map!
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
      toast.success(`🎉 Grooming salon "${shopName}" created and added to the pet parent map!`);
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

  const quickDemoLogin = (selectedRole: UserRole) => {
    if (selectedRole === "parent") {
      setState((st) => ({
        ...st,
        currentUser: {
          id: "u-parent-demo",
          name: "Alex Morgan",
          email: "alex@furandfern.in",
          role: "parent",
          phone: "+91 98765 12345",
        },
      }));
      toast.success("Logged in as Pet Parent (Alex Morgan) 🐶");
      nav({ to: "/dashboard" });
    } else {
      setState((st) => ({
        ...st,
        currentUser: {
          id: "u-groomer-demo",
          name: "Sarah M.",
          email: "sarah@furandfern.in",
          role: "groomer",
          phone: "+91 98765 43210",
          shopName: "Fur&Fern Flagship Spa & Sanctuary",
          shopAddress: "24th Main, Sector 2, HSR Layout",
          shopArea: "HSR Layout",
        },
      }));
      toast.success("Logged in as Master Groomer (Sarah M.) 💈");
      nav({ to: "/groomer" });
    }
  };

  return (
    <div className="min-h-screen bg-hero">
      <SiteNav />

      <main className="mx-auto max-w-5xl px-6 pt-32 pb-20">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-card/80 backdrop-blur px-4 py-1.5 text-xs font-bold shadow-sm border border-border/50">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> One Unified Portal
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-black">Welcome to Fur&Fern</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in or create an account for pet parents and certified grooming salons.
          </p>
        </div>

        {/* Quick Demo Login Cards for Instant 1-Click Access */}
        <div className="mb-10 rounded-3xl bg-sun/40 p-6 shadow-3d border-2 border-sun backdrop-blur">
          <p className="text-xs font-black uppercase tracking-wider text-foreground mb-3 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-accent" /> Instant 1-Click Demo Login
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => quickDemoLogin("parent")}
              className="flex items-center gap-3 rounded-2xl bg-card p-4 text-left shadow-sm transition-all hover:scale-[1.02] hover:shadow-md border border-border/60"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground text-2xl">
                🐶
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">Enter as Pet Parent</p>
                <p className="text-xs text-muted-foreground">Alex Morgan · View pet health, tracker & bookings</p>
              </div>
              <ArrowRight className="h-4 w-4 text-accent" />
            </button>

            <button
              onClick={() => quickDemoLogin("groomer")}
              className="flex items-center gap-3 rounded-2xl bg-card p-4 text-left shadow-sm transition-all hover:scale-[1.02] hover:shadow-md border border-border/60"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl">
                💈
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">Enter as Grooming Salon</p>
                <p className="text-xs text-muted-foreground">Sarah M. · Manage queue, salon stations & live cam</p>
              </div>
              <ArrowRight className="h-4 w-4 text-primary" />
            </button>
          </div>
        </div>

        {/* Main Auth Box */}
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
              Create Account
            </button>
          </div>

          {/* Role Selector */}
          <div className="mt-6">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
              Select Your Account Type:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("parent")}
                className={`flex items-center justify-center gap-2 rounded-2xl p-3.5 font-bold text-sm border-2 transition-all duration-200 ${
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
                className={`flex items-center justify-center gap-2 rounded-2xl p-3.5 font-bold text-sm border-2 transition-all duration-200 ${
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
                    placeholder={role === "parent" ? "parent@example.com" : "salon@furandfern.in"}
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
                    placeholder="••••••••"
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
                Sign In as {role === "groomer" ? "Groomer / Salon" : "Pet Parent"} →
              </button>
            </form>
          ) : (
            /* SIGNUP FORM */
            <form onSubmit={handleSignup} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full rounded-2xl border bg-background pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Groomer-specific salon details */}
              {role === "groomer" && (
                <>
                  <div>
                    <label className="text-xs font-bold text-primary mb-1 block">Salon / Center Business Name</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-3.5 h-4 w-4 text-primary" />
                      <input
                        type="text"
                        required
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        placeholder="e.g. Fluffy Paws Spa & Lounge"
                        className="w-full rounded-2xl border bg-background pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground mb-1 block">Salon Area / Neighborhood</label>
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
                        <option value="JP Nagar">JP Nagar</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-muted-foreground mb-1 block">Street Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          required
                          value={shopAddress}
                          onChange={(e) => setShopAddress(e.target.value)}
                          placeholder="e.g. 15th Cross, 4th Block"
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
                      placeholder="you@email.com"
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
                    placeholder="Create a password"
                    className="w-full rounded-2xl border bg-background pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              {role === "groomer" && (
                <div className="rounded-2xl bg-primary/10 p-3 text-xs text-primary flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Your salon location will be automatically pinned on our interactive pet parent map!</span>
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
                Create {role === "groomer" ? "Salon Partner" : "Pet Parent"} Account →
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
