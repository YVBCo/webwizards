import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Sparkles, Clock, Shield, Star, HelpCircle, ArrowRight, Heart, Scissors, Bath, Award } from "lucide-react";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { Tilt } from "@/components/Tilt";
import { ADDONS } from "@/lib/store";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Grooming Packages & Spa Menu — Fur&Fern" },
      { name: "description", content: "Explore our premium pet grooming packages, custom treatments, and organic spa care." },
      { property: "og:title", content: "Grooming Packages & Spa Menu — Fur&Fern" },
      { property: "og:description", content: "Explore our premium pet grooming packages, custom treatments, and organic spa care." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Services,
});

const plans = [
  {
    n: "Splash",
    p: 799,
    e: "🛁",
    badge: "Quick Refresh",
    desc: "Essential bath and hygiene refresh for busy pets on the go.",
    mins: "45 mins",
    c: "bg-card border border-border/50",
    btnColor: "bg-accent text-accent-foreground",
    items: ["Warm oatmeal bubble bath", "Gentle blow dry & brush out", "Ear cleansing & nail clipping", "Natural spritz cologne"],
  },
  {
    n: "Spa",
    p: 1499,
    e: "✨",
    badge: "Most Popular",
    desc: "Complete head-to-tail styling, coat conditioning, and paw pampering.",
    mins: "90 mins",
    c: "bg-sun border-2 border-sun shadow-3d",
    btnColor: "bg-accent text-accent-foreground",
    items: [
      "Everything in Splash package",
      "Full breed-specific haircut & styling",
      "Organic pawdicure & conditioning balm",
      "Teeth sparkle & breath freshener",
      "Sanitary trim & paw pad shaving",
    ],
  },
  {
    n: "Royal",
    p: 2499,
    e: "👑",
    badge: "VIP Luxury",
    desc: "The ultimate red-carpet indulgence with wellness diagnostics and photo session.",
    mins: "150 mins",
    c: "bg-primary text-primary-foreground",
    btnColor: "bg-accent-foreground text-primary",
    items: [
      "Everything in Spa package",
      "12-point veterinary health scan",
      "Lavender & chamomile aromatherapy soak",
      "De-shedding deep mud mask treatment",
      "Professional 4K pet photo shoot & keepsake",
      "Gourmet treat box & souvenir bandana",
    ],
  },
];

const comparisonRows = [
  { feature: "Oatmeal Bubble Bath (37°C)", splash: true, spa: true, royal: true },
  { feature: "Warm Fluff Blowout", splash: true, spa: true, royal: true },
  { feature: "Ear Cleanse & Nail Trim", splash: true, spa: true, royal: true },
  { feature: "Breed-Specific Scissors Cut", splash: false, spa: true, royal: true },
  { feature: "Paw Balm & Nail Polishing", splash: false, spa: true, royal: true },
  { feature: "Teeth Sparkle & Mint Mist", splash: false, spa: true, royal: true },
  { feature: "12-Point Health & Coat Scan", splash: false, spa: false, royal: true },
  { feature: "Aromatherapy Stress Relief", splash: false, spa: false, royal: true },
  { feature: "Mini Photo Shoot Session", splash: false, spa: false, royal: true },
];

const faqs = [
  {
    q: "How do I know which package my pet needs?",
    a: "If your pet simply needs a bath and hygiene cleanup, the Splash is great. For pets that need hair trimming and styling, the Spa is our most popular choice. If your fur baby deserves extra pampering or shedding therapy, go with the Royal package!",
  },
  {
    q: "Are the shampoos and balms safe for sensitive skin?",
    a: "100% yes! We exclusively use hypoallergenic, tearless, organic botanicals with zero sulfates, parabens, or artificial dyes. We also stock special oatmeal and medicated formulas for sensitive skin.",
  },
  {
    q: "What if my pet gets nervous or anxious?",
    a: "Our groomers are Fear-Free certified. We take regular calming breaks, use lavender aromatherapy, provide gentle reassurance treats, and never use forceful restraints. You can also watch them live on your dashboard cam!",
  },
  {
    q: "Can I customize treatments with add-ons?",
    a: "Absolutely! You can mix and match add-ons like Flea Shield, De-shedding treatment, Nail Art, or Doorstep Pickup & Drop right from the booking page.",
  },
];

function Services() {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const addonTotal = selectedAddons.reduce((sum, id) => {
    const item = ADDONS.find((a) => a.id === id);
    return sum + (item?.price ?? 0);
  }, 0);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-hero">
      <SiteNav />

      {/* Hero Header */}
      <div className="mx-auto max-w-6xl px-6 pt-36 pb-16 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-card/80 backdrop-blur px-5 py-2 text-sm font-semibold shadow-sm border border-border/50">
          <Sparkles className="h-4 w-4 text-accent" /> Tailored Spa Experiences
        </span>
        <h1 className="mt-6 text-6xl md:text-7xl font-black tracking-tight">Pick a pamper.</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Crafted with love, certified fear-free stylists, and 100% organic wellness formulas. Every package includes a gentle coat massage.
        </p>
      </div>

      {/* Main Packages */}
      <div className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((p) => (
            <Tilt key={p.n}>
              <div className={`relative h-full rounded-3xl p-8 shadow-3d flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 ${p.c}`}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-6xl" style={{ transform: "translateZ(60px)" }}>{p.e}</span>
                    <span className="rounded-full bg-background/30 backdrop-blur px-3 py-1 text-xs font-bold uppercase tracking-wider">
                      {p.badge}
                    </span>
                  </div>
                  <h2 className="mt-6 text-3xl font-black">{p.n}</h2>
                  <p className="mt-1 text-xs opacity-75">{p.desc}</p>

                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="font-display text-5xl font-black">₹{p.p}</span>
                    <span className="text-sm opacity-70">/ session</span>
                  </div>
                  <p className="mt-1 text-xs flex items-center gap-1 opacity-70">
                    <Clock className="h-3 w-3" /> Average duration: {p.mins}
                  </p>

                  <hr className="my-6 border-current opacity-20" />

                  <ul className="space-y-2.5 text-sm">
                    {p.items.map((i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/book"
                  search={{ plan: p.n }}
                  className={`mt-8 block rounded-full py-3.5 text-center font-semibold shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95 ${p.btnColor}`}
                >
                  Book {p.n} Package
                </Link>
              </div>
            </Tilt>
          ))}
        </div>
      </div>

      {/* Interactive Add-on Estimator */}
      <section className="bg-card/70 backdrop-blur border-y py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full bg-sun/60 px-4 py-1 text-xs font-bold mb-3">
              <Award className="h-3.5 w-3.5" /> Spa Add-ons
            </span>
            <h2 className="text-4xl md:text-5xl font-black">Customize your package.</h2>
            <p className="mt-3 text-muted-foreground text-sm">
              Tap any add-ons below to see how they pair with your pet's treatment:
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {ADDONS.map((a) => {
              const isSelected = selectedAddons.includes(a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => toggleAddon(a.id)}
                  className={`rounded-2xl p-5 text-left border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-accent bg-accent/15 shadow-3d -translate-y-1"
                      : "border-border bg-card hover:bg-secondary"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base">{a.id}</span>
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${isSelected ? "bg-accent text-accent-foreground font-bold" : "border"}`}>
                      {isSelected ? "✓" : "+"}
                    </span>
                  </div>
                  <p className="mt-3 font-display text-2xl font-black text-accent">+₹{a.price}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">Available for all packages</p>
                </button>
              );
            })}
          </div>

          {selectedAddons.length > 0 && (
            <div className="mt-8 rounded-2xl bg-secondary p-5 flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
              <div>
                <p className="font-bold text-sm">Selected {selectedAddons.length} extras: {selectedAddons.join(", ")}</p>
                <p className="text-xs text-muted-foreground">Add-on subtotal: +₹{addonTotal}</p>
              </div>
              <Link
                to="/book"
                search={{ plan: "Spa" }}
                className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground shadow-md hover:-translate-y-0.5 transition"
              >
                Proceed to Book with Extras →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Package Comparison Table */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-black">Compare all treatments.</h2>
          <p className="mt-3 text-muted-foreground text-sm">A full breakdown of what's included in each tier.</p>
        </div>

        <div className="overflow-x-auto rounded-3xl bg-card shadow-3d border border-border/50">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 font-display">
              <tr>
                <th className="p-5 font-bold">Treatment</th>
                <th className="p-5 text-center font-bold">Splash (₹799)</th>
                <th className="p-5 text-center font-bold text-accent">Spa (₹1,499)</th>
                <th className="p-5 text-center font-bold">Royal (₹2,499)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="hover:bg-muted/20 transition">
                  <td className="p-4 font-medium">{row.feature}</td>
                  <td className="p-4 text-center">
                    {row.splash ? <Check className="h-5 w-5 text-primary mx-auto" /> : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="p-4 text-center bg-accent/5">
                    {row.spa ? <Check className="h-5 w-5 text-accent mx-auto font-bold" /> : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="p-4 text-center">
                    {row.royal ? <Check className="h-5 w-5 text-primary mx-auto" /> : <span className="text-muted-foreground">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="bg-hero py-20 border-t">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-4 py-1 text-xs font-bold mb-3 shadow-sm">
              <HelpCircle className="h-3.5 w-3.5 text-accent" /> Got Questions?
            </span>
            <h2 className="text-4xl font-black">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl bg-card p-5 shadow-sm border border-border/50 transition cursor-pointer"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                >
                  <div className="flex items-center justify-between font-bold text-base">
                    <span>{faq.q}</span>
                    <span className="text-accent text-xl font-mono">{isOpen ? "−" : "+"}</span>
                  </div>
                  {isOpen && (
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed animate-in fade-in">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold">Ready to give your pet the best day ever?</h3>
            <Link
              to="/book"
              search={{ plan: "Spa" }}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 font-semibold text-accent-foreground shadow-3d hover:-translate-y-1 transition"
            >
              Book an Appointment Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground bg-card">
        © 2026 Fur&Fern Grooming Spa. All treatments performed with organic botanical formulas.
      </footer>
    </div>
  );
}
