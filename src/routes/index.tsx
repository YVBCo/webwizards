import { createFileRoute, Link } from "@tanstack/react-router";
import { Scissors, Bath, Sparkles, HeartPulse, Star, ArrowRight, Clock, Shield, MapPin, Phone, Mail, Instagram, Quote, ChevronRight, Users, Award, Leaf } from "lucide-react";
import dog from "@/assets/hero-dog.png";
import { SiteNav } from "@/components/SiteNav";
import { Tilt } from "@/components/Tilt";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fur&Fern — Luxury Pet Grooming Spa" },
      { name: "description", content: "Bubble baths, breed-perfect cuts and spa days for your pets." },
      { property: "og:title", content: "Fur&Fern — Luxury Pet Grooming Spa" },
      { property: "og:description", content: "Bubble baths, breed-perfect cuts and spa days for your pets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Bath, t: "Bubble Spa", d: "Oatmeal foam baths at the perfect 37°C with aromatherapy oils.", color: "bg-card" },
  { icon: Scissors, t: "Breed Cuts", d: "Certified stylists for 120+ breeds with precision tools.", color: "bg-mint" },
  { icon: HeartPulse, t: "Health Scan", d: "Thorough skin, ear & nail check every single visit.", color: "bg-sun" },
  { icon: Sparkles, t: "Pawdicure", d: "Paw balm, nail art, cute little bows and fresh fragrance.", color: "bg-coral text-accent-foreground" },
];

const testimonials = [
  { name: "Priya M.", pet: "Biscuit's mom", text: "My golden retriever has never been this fluffy! The live grooming cam let me watch every step. Absolutely loved the aromatherapy add-on.", rating: 5, avatar: "🐶" },
  { name: "Arjun S.", pet: "Miso's dad", text: "Best grooming experience for my Persian cat. The stylists really understand breed-specific cuts. Miso purred the whole ride home!", rating: 5, avatar: "🐱" },
  { name: "Sana R.", pet: "Bruno's mom", text: "The Royal package photo shoot was beyond adorable. Bruno looked like an absolute king. 10/10 will come back every month.", rating: 5, avatar: "🐕" },
  { name: "Dev K.", pet: "Luna's dad", text: "Super gentle with my anxious puppy. The health scan caught an ear issue early — so grateful. The pawdicure was chef's kiss!", rating: 5, avatar: "🐩" },
];

const stats = [
  { value: "2,300+", label: "Happy Tails", icon: "🐾" },
  { value: "120+", label: "Breeds Served", icon: "✂️" },
  { value: "4.9★", label: "Average Rating", icon: "⭐" },
  { value: "15+", label: "Expert Groomers", icon: "👩‍🔬" },
];

const process_steps = [
  { step: "01", title: "Book Online", desc: "Pick your pet, package, add-ons and time slot in under 2 minutes.", icon: "📱" },
  { step: "02", title: "Drop Off", desc: "Bring your furry friend or use our doorstep pickup & drop service.", icon: "🚗" },
  { step: "03", title: "Watch Live", desc: "Track every grooming stage in real time from your pet dashboard.", icon: "📹" },
  { step: "04", title: "Happy Pickup", desc: "Take home a freshly groomed, photo-ready, tail-wagging companion!", icon: "🎀" },
];

function CountUp({ end, suffix = "" }: { end: string; suffix?: string }) {
  return <span>{end}{suffix}</span>;
}

function Index() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="overflow-hidden">
      <SiteNav />

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative min-h-screen bg-hero flex items-center pt-28 pb-16">
        {/* Floating bubbles background */}
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="bubble"
            style={{
              left: `${(i * 5.7) % 100}%`,
              width: 16 + (i % 6) * 12,
              height: 16 + (i % 6) * 12,
              animationDuration: `${7 + (i % 7) * 2}s`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}

        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 items-center">
          <div className="animate-fade-up">
            {/* Trust badge */}
            <span className="inline-flex items-center gap-2 rounded-full bg-card/80 backdrop-blur px-5 py-2 text-sm shadow-sm border border-border/50">
              <span className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-sun text-sun" />
                ))}
              </span>
              <span className="font-medium">4.9 from 2,300+ happy tails</span>
            </span>

            {/* Main headline */}
            <h1 className="mt-8 text-6xl md:text-8xl font-black leading-[0.9] tracking-tight">
              Spa days{" "}
              <em className="text-accent not-italic relative">
                for
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path d="M0,8 Q50,0 100,8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </em>{" "}
              fluffballs.
            </h1>

            <p className="mt-8 max-w-md text-lg text-muted-foreground leading-relaxed">
              Gentle grooming, luxurious bubble baths and breed-perfect styling — tracked live from your personal pet dashboard.
            </p>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/book"
                search={{ plan: "Spa" }}
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-semibold text-accent-foreground shadow-3d transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_40px_80px_-20px_color-mix(in_oklab,var(--accent)_60%,transparent)] glow-cta"
              >
                Book a session
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/services"
                className="group rounded-full border-2 border-primary px-8 py-4 font-semibold transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:-translate-y-1"
              >
                View packages
              </Link>
            </div>

            {/* Quick trust stats */}
            <div className="mt-10 flex gap-6 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>Vet-approved</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span>Same-day booking</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Leaf className="h-4 w-4 text-primary" />
                <span>Organic products</span>
              </div>
            </div>
          </div>

          {/* Hero image with floating badges */}
          <Tilt className="relative" max={16}>
            <div className="absolute inset-8 rounded-full bg-primary/90" style={{ transform: "translateZ(-60px)" }} />
            <div className="absolute inset-12 rounded-full bg-primary/40 blur-2xl" style={{ transform: "translateZ(-80px)" }} />
            <img
              src={dog}
              alt="Freshly groomed doodle"
              width={1024}
              height={1024}
              className="relative animate-kenburns drop-shadow-2xl"
              style={{ transform: "translateZ(60px)" }}
            />
            {/* Floating badge: now grooming */}
            <div
              className="absolute top-8 -left-4 rounded-2xl bg-card/90 backdrop-blur p-4 shadow-3d border border-border/50 animate-wiggle"
              style={{ transform: "translateZ(100px)" }}
            >
              <p className="text-xs text-muted-foreground">Now grooming</p>
              <p className="font-display font-bold text-lg">Biscuit 🐾</p>
              <div className="mt-1 flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-muted-foreground">Live session</span>
              </div>
            </div>
            {/* Floating badge: fluffiness */}
            <div
              className="absolute bottom-14 -right-2 rounded-2xl bg-sun p-4 shadow-3d border border-border/30"
              style={{ transform: "translateZ(120px)" }}
            >
              <p className="font-display text-3xl font-black">98%</p>
              <p className="text-xs font-medium">fluffiness score</p>
            </div>
            {/* Floating badge: coat health */}
            <div
              className="absolute top-1/2 -right-6 rounded-xl bg-mint p-3 shadow-3d border border-border/30"
              style={{ transform: "translateZ(90px)" }}
            >
              <p className="text-xs font-bold">Coat Health</p>
              <p className="font-display text-xl font-black text-primary">A+</p>
            </div>
          </Tilt>
        </div>
      </section>

      {/* ═══════════════ SCROLLING MARQUEE ═══════════════ */}
      <div className="bg-primary py-5 text-primary-foreground overflow-hidden">
        <div className="flex w-max animate-marquee gap-12 font-display text-3xl italic">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["Bubble baths", "✦", "Blowouts", "✦", "Pawdicures", "✦", "Teeth sparkle", "✦", "De-shedding", "✦", "Health scan", "✦", "Aromatherapy", "✦", "Photo shoot", "✦"].map(
              (w, i) => <span key={`${k}${i}`} className="opacity-90">{w}</span>
            )
          )}
        </div>
      </div>

      {/* ═══════════════ STATS BAR ═══════════════ */}
      <section className="border-b bg-card/60 backdrop-blur">
        <div className="mx-auto grid max-w-5xl grid-cols-2 md:grid-cols-4 divide-x">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center py-10 px-4 group">
              <span className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-125">{stat.icon}</span>
              <p className="font-display text-4xl font-black tracking-tight">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ FEATURES / SERVICES ═══════════════ */}
      <section className="mx-auto max-w-6xl px-6 py-28">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-mint/60 px-4 py-1.5 text-sm font-semibold text-primary mb-4">
            <Sparkles className="h-3.5 w-3.5" /> Our Services
          </span>
          <h2 className="text-5xl md:text-6xl font-black">Not just a trim.</h2>
          <p className="mt-4 text-lg text-muted-foreground">Every session is a full wellness experience — from luxurious foam baths to breed-specific styling and complete health assessments.</p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Tilt key={f.t}>
              <div
                className={`group h-full rounded-3xl p-8 shadow-3d transition-all duration-300 hover:-translate-y-2 ${f.color}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style={{ transform: "translateZ(40px)" }}>
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-8 text-2xl font-bold">{f.t}</h3>
                <p className="mt-3 leading-relaxed opacity-80">{f.d}</p>
                <Link to="/services" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold opacity-70 transition-opacity hover:opacity-100">
                  Learn more <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </Tilt>
          ))}
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="bg-card/60 backdrop-blur py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full bg-sun/60 px-4 py-1.5 text-sm font-semibold text-foreground mb-4">
              <Clock className="h-3.5 w-3.5" /> How It Works
            </span>
            <h2 className="text-5xl md:text-6xl font-black">Pamper in 4 easy steps.</h2>
            <p className="mt-4 text-lg text-muted-foreground">From booking to pickup, we've made the entire experience effortless and delightful for both you and your pet.</p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {process_steps.map((s, i) => (
              <div key={s.step} className="group relative">
                {/* Connector line */}
                {i < process_steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-border z-0">
                    <div className="absolute inset-y-0 left-0 bg-accent transition-all duration-700 group-hover:w-full" style={{ width: "0%" }} />
                  </div>
                )}
                <div className="relative z-10 rounded-3xl bg-card p-7 shadow-sm border border-border/50 transition-all duration-300 hover:shadow-3d hover:-translate-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-5xl font-black text-muted/60">{s.step}</span>
                    <span className="text-3xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">{s.icon}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRICING PREVIEW ═══════════════ */}
      <section className="mx-auto max-w-6xl px-6 py-28">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-coral/20 px-4 py-1.5 text-sm font-semibold text-accent mb-4">
            <Award className="h-3.5 w-3.5" /> Pricing
          </span>
          <h2 className="text-5xl md:text-6xl font-black">Pick your pamper.</h2>
          <p className="mt-4 text-lg text-muted-foreground">From a quick splash to the full royal treatment — we have the perfect package for every pet.</p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {[
            { n: "Splash", p: "₹799", e: "🛁", c: "bg-card border border-border/50", tag: "", items: ["Bubble bath", "Blow dry", "Ear clean"], mins: "45 min" },
            { n: "Spa", p: "₹1,499", e: "✨", c: "bg-sun border-2 border-sun", tag: "Most Popular", items: ["Everything in Splash", "Breed haircut", "Pawdicure", "Teeth sparkle"], mins: "90 min" },
            { n: "Royal", p: "₹2,499", e: "👑", c: "bg-primary text-primary-foreground", tag: "Best Value", items: ["Everything in Spa", "Health scan", "Aromatherapy", "Photo shoot"], mins: "150 min" },
          ].map((plan, i) => (
            <Tilt key={plan.n}>
              <div className={`relative h-full rounded-3xl p-8 shadow-3d transition-all duration-300 hover:-translate-y-2 ${plan.c}`}>
                {plan.tag && (
                  <span className={`absolute -top-3 right-6 rounded-full px-4 py-1 text-xs font-bold shadow-sm ${i === 2 ? "bg-sun text-foreground" : "bg-accent text-accent-foreground"}`}>
                    {plan.tag}
                  </span>
                )}
                <div className="text-5xl" style={{ transform: "translateZ(50px)" }}>{plan.e}</div>
                <h3 className="mt-6 text-2xl font-black">{plan.n}</h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-black">{plan.p}</span>
                  <span className="text-sm opacity-70">/ session</span>
                </div>
                <p className="mt-1 text-sm opacity-70 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {plan.mins}
                </p>
                <ul className="mt-6 space-y-3">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/book"
                  search={{ plan: plan.n }}
                  className={`mt-8 block rounded-full py-3.5 text-center font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                    i === 2
                      ? "bg-accent-foreground text-primary shadow-md hover:shadow-lg"
                      : "bg-accent text-accent-foreground shadow-md hover:shadow-lg"
                  }`}
                >
                  Book {plan.n}
                </Link>
              </div>
            </Tilt>
          ))}
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="bg-hero py-28 overflow-hidden">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full bg-card/80 backdrop-blur px-4 py-1.5 text-sm font-semibold mb-4">
              <Users className="h-3.5 w-3.5" /> Happy Pet Parents
            </span>
            <h2 className="text-5xl md:text-6xl font-black">What they're saying.</h2>
            <p className="mt-4 text-lg text-muted-foreground">Don't just take our word for it — hear from our community of 2,300+ happy tails.</p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className={`group rounded-3xl bg-card/90 backdrop-blur p-7 shadow-sm border border-border/50 transition-all duration-500 hover:shadow-3d hover:-translate-y-2 ${
                  i === activeTestimonial ? "ring-2 ring-accent shadow-3d -translate-y-1" : ""
                }`}
              >
                <Quote className="h-8 w-8 text-accent/30 mb-4" />
                <p className="text-sm leading-relaxed text-foreground/80 italic">"{t.text}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-xl">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.pet}</p>
                  </div>
                </div>
                <div className="mt-3 flex">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-sun text-sun" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 3D CUBE + DASHBOARD CTA ═══════════════ */}
      <section className="mx-auto max-w-6xl px-6 py-28 grid md:grid-cols-2 gap-16 items-center">
        <div className="flex justify-center py-16" style={{ perspective: 1000 }}>
          <div className="relative h-48 w-48 animate-spin3d preserve-3d">
            {["🐶", "🐱", "🛁", "✂️", "🦴", "🐾"].map((e, i) => {
              const t = ["rotateY(0)", "rotateY(90deg)", "rotateY(180deg)", "rotateY(-90deg)", "rotateX(90deg)", "rotateX(-90deg)"][i];
              return (
                <div
                  key={i}
                  className="absolute inset-0 flex items-center justify-center rounded-3xl border-4 border-primary bg-card/90 backdrop-blur text-7xl shadow-lg"
                  style={{ transform: `${t} translateZ(96px)` }}
                >
                  {e}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-mint/60 px-4 py-1.5 text-sm font-semibold text-primary mb-4">
            <HeartPulse className="h-3.5 w-3.5" /> Pet Dashboard
          </span>
          <h2 className="text-5xl md:text-6xl font-black leading-tight">Your pet's life, in one dashboard.</h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Live grooming status, coat-health scores, upcoming bookings, health passport, daily wellness tracking and photo diaries — all in real time.
          </p>
          <ul className="mt-6 space-y-3">
            {["Live grooming cam with snapshot gallery", "Interactive health & vaccine passport", "Daily wellness, hydration & meal tracker", "Paw points rewards & treat redemption"].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint text-primary text-xs font-bold">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            to="/dashboard"
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground shadow-3d transition-all duration-300 hover:-translate-y-1.5"
          >
            Open dashboard
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* ═══════════════ CTA BANNER ═══════════════ */}
      <section className="mx-6 mb-16">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] bg-primary p-16 text-primary-foreground text-center shadow-3d relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary-foreground/5" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary-foreground/5" />

          <div className="relative z-10">
            <h2 className="text-5xl md:text-6xl font-black">Ready to pamper your pet?</h2>
            <p className="mt-4 text-lg opacity-80 max-w-lg mx-auto">
              Book your first session today and earn 100 bonus paw points. Your fur baby deserves the royal treatment.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/book"
                search={{ plan: "Spa" }}
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-semibold text-accent-foreground shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                Book now — it's quick
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/services"
                className="rounded-full border-2 border-primary-foreground/40 px-8 py-4 font-semibold transition-all duration-300 hover:bg-primary-foreground hover:text-primary hover:-translate-y-1"
              >
                Compare packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="border-t bg-card/60 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 font-display text-xl font-bold">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm">🐾</span>
                Fur&Fern
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Luxury pet grooming spa with certified groomers, organic products and a passion for every paw.
              </p>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/" className="text-foreground/70 hover:text-foreground transition">Home</Link></li>
                <li><Link to="/services" className="text-foreground/70 hover:text-foreground transition">Services & Pricing</Link></li>
                <li><Link to="/book" search={{ plan: "Spa" }} className="text-foreground/70 hover:text-foreground transition">Book a Session</Link></li>
                <li><Link to="/dashboard" className="text-foreground/70 hover:text-foreground transition">Pet Dashboard</Link></li>
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Contact</h4>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-center gap-2 text-foreground/70"><MapPin className="h-3.5 w-3.5" /> HSR Layout, Bengaluru</li>
                <li className="flex items-center gap-2 text-foreground/70"><Phone className="h-3.5 w-3.5" /> +91 98765 43210</li>
                <li className="flex items-center gap-2 text-foreground/70"><Mail className="h-3.5 w-3.5" /> hello@furandfern.in</li>
              </ul>
            </div>
            {/* Hours */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Hours</h4>
              <ul className="space-y-2.5 text-sm text-foreground/70">
                <li>Mon – Sat: 9:00 AM – 7:00 PM</li>
                <li>Sunday: 10:00 AM – 4:00 PM</li>
                <li className="flex items-center gap-2 mt-4">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-medium text-foreground">Open now</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-8 text-sm text-muted-foreground">
            <p>© 2026 Fur&Fern Grooming Spa. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-foreground transition">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition">Terms of Service</a>
              <a href="#" className="flex items-center gap-1 hover:text-foreground transition"><Instagram className="h-3.5 w-3.5" /> @furandfern</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
