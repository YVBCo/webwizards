import { Link } from "@tanstack/react-router";
import { PawPrint, Menu, X, MapPin, Scissors, User, LogOut, ArrowRightLeft } from "lucide-react";
import { useState } from "react";
import { useStore, setState } from "@/lib/store";
import { toast } from "sonner";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const s = useStore();
  const cls = "px-3.5 py-1.5 rounded-full text-xs font-semibold hover:bg-secondary transition-all duration-200";

  const handleLogout = () => {
    setState((st) => ({ ...st, currentUser: null }));
    toast.info("Logged out. Please sign in as Pet Parent or Groomer.");
  };

  const isParent = s.currentUser?.role === "parent";
  const isGroomer = s.currentUser?.role === "groomer";

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
      <nav className="flex items-center gap-1 rounded-full border bg-card/85 backdrop-blur-xl px-3 py-1.5 shadow-3d transition-all duration-300 hover:shadow-[0_35px_70px_-20px_color-mix(in_oklab,var(--primary)_50%,transparent),0_8px_0_0_color-mix(in_oklab,var(--primary)_90%,black)]">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 pr-3 font-display text-base font-bold group">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
            <PawPrint className="h-3.5 w-3.5" />
          </span>
          <span>Fur&Fern</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/" className={cls} activeOptions={{ exact: true }} activeProps={{ className: "bg-secondary font-bold" }}>
            Home
          </Link>
          <Link to="/services" className={cls} activeProps={{ className: "bg-secondary font-bold" }}>
            Services
          </Link>
          <Link to="/locations" className={`${cls} flex items-center gap-1`} activeProps={{ className: "bg-secondary font-bold" }}>
            <MapPin className="h-3 w-3 text-accent" /> Find Centers
          </Link>
          
          {/* ONLY show Book for pet parents or unauthenticated guests */}
          {!isGroomer && (
            <Link to="/book" search={{ plan: "Spa" }} className={cls} activeProps={{ className: "bg-secondary font-bold" }}>
              Book
            </Link>
          )}

          {/* ROLE SPECIFIC DASHBOARD LINK: Only show Parent Dashboard to parents */}
          {isParent && (
            <Link
              to="/dashboard"
              className={`${cls} bg-accent/15 text-accent hover:bg-accent/25`}
              activeProps={{ className: "bg-accent text-accent-foreground font-bold shadow-sm" }}
            >
              🐾 Parent Dashboard
            </Link>
          )}

          {/* ROLE SPECIFIC DASHBOARD LINK: Only show Groomer Portal to groomers */}
          {isGroomer && (
            <Link
              to="/groomer"
              className={`${cls} flex items-center gap-1 bg-primary/10 text-primary hover:bg-primary/20`}
              activeProps={{ className: "bg-primary text-primary-foreground font-bold shadow-sm" }}
            >
              <Scissors className="h-3 w-3" /> 💈 Salon Portal
            </Link>
          )}

          {/* If not logged in, show quick links to sign in */}
          {!s.currentUser ? (
            <div className="flex items-center gap-1 ml-2">
              <Link
                to="/auth"
                className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground shadow-sm transition hover:scale-105 active:scale-95"
              >
                Sign In / Join
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-1 ml-2">
              <Link
                to="/auth"
                className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-foreground border hover:bg-secondary/80"
                title="Switch Account"
              >
                <ArrowRightLeft className="h-3 w-3 text-accent" />
                <span className="max-w-[80px] truncate">{s.currentUser.name.split(" ")[0]}</span>
                <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.2 rounded font-bold uppercase">
                  {s.currentUser.role}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden ml-2 rounded-full p-1.5 hover:bg-secondary transition"
          aria-label="Toggle Navigation"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      {/* Mobile Drawer Dropdown */}
      {open && (
        <div className="absolute top-16 inset-x-4 md:hidden rounded-3xl border bg-card/95 backdrop-blur-2xl p-5 shadow-3d animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-2 text-sm font-semibold">
            <Link onClick={() => setOpen(false)} to="/" className="rounded-xl px-4 py-2.5 hover:bg-secondary transition">
              Home
            </Link>
            <Link onClick={() => setOpen(false)} to="/services" className="rounded-xl px-4 py-2.5 hover:bg-secondary transition">
              Services & Pricing
            </Link>
            <Link onClick={() => setOpen(false)} to="/locations" className="rounded-xl px-4 py-2.5 hover:bg-secondary transition flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" /> Find Centers Map
            </Link>

            {!isGroomer && (
              <Link onClick={() => setOpen(false)} to="/book" search={{ plan: "Spa" }} className="rounded-xl px-4 py-2.5 hover:bg-secondary transition">
                Book Appointment
              </Link>
            )}

            {isParent && (
              <Link onClick={() => setOpen(false)} to="/dashboard" className="rounded-xl bg-accent/15 px-4 py-2.5 text-accent font-bold">
                🐾 Pet Parent Dashboard
              </Link>
            )}

            {isGroomer && (
              <Link onClick={() => setOpen(false)} to="/groomer" className="rounded-xl bg-primary/10 px-4 py-2.5 text-primary font-bold flex items-center gap-2">
                <Scissors className="h-4 w-4" /> 💈 Groomer Salon Portal
              </Link>
            )}

            <Link onClick={() => setOpen(false)} to="/auth" className="mt-2 rounded-xl bg-primary px-4 py-3 text-center text-primary-foreground font-bold shadow-md">
              {s.currentUser ? `Switch Profile (${s.currentUser.role.toUpperCase()})` : "Sign In / Register"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
