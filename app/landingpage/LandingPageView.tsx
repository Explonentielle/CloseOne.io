"use client";

import { useState, useEffect, useRef } from "react";
import {
  Zap,
  ArrowRight,
  CheckCircle,
  BarChart2,
  DollarSign,
  Award,
  Globe,
  Star,
} from "lucide-react";

/* ─── tiny hook: detect if element is in viewport ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── animated counter ─── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const { ref, visible } = useInView();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = Math.ceil(to / 40);
    const t = setInterval(() => {
      start += step;
      if (start >= to) {
        setVal(to);
        clearInterval(t);
      } else setVal(start);
    }, 30);
    return () => clearInterval(t);
  }, [visible, to]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/* ─── features data ─── */
const features = [
  {
    icon: BarChart2,
    title: "Suivi des deals",
    desc: "Centralise tous tes deals en un seul endroit, peu importe l'écosystème avec lequel tu travailles.",
    color: "#0EFF9C",
  },
  {
    icon: DollarSign,
    title: "Commissions automatiques",
    desc: "Calcul instantané de tes commissions à chaque deal. Fini les tableurs manuels.",
    color: "#3B82F6",
  },
  {
    icon: Award,
    title: "Performance & badges",
    desc: "Suis tes objectifs et décroche des badges selon tes résultats mensuels. Sois reconnu.",
    color: "#FFD700",
  },
  {
    icon: Globe,
    title: "Écosystèmes & missions",
    desc: "Accède aux meilleurs écosystèmes et trouve de nouvelles missions de closing.",
    color: "#8B5CF6",
  },
];

/* ─── testimonials ─── */
const testimonials = [
  {
    name: "Maxime R.",
    role: "Senior Closer — Formation business",
    quote:
      "Avant CloseOne, je gérais mes deals dans 3 tableurs différents. Maintenant tout est au même endroit, je vois mes commissions en temps réel. Game changer.",
    avatar: "MR",
    color: "#0EFF9C",
  },
  {
    name: "Sarah L.",
    role: "Closer indépendante — High-ticket coaching",
    quote:
      "Le leaderboard m'a redonné cette compétitivité que j'avais perdue. Et la carte des closers m'a permis de trouver des partenaires dans ma région.",
    avatar: "SL",
    color: "#3B82F6",
  },
  {
    name: "Thomas K.",
    role: "Closer Manager — Écosystème e-commerce",
    quote:
      "Je gère une équipe de 8 closers. CloseOne me donne une vue en temps réel sur les perfs de chacun. Je passe moins de temps à relancer et plus à coacher.",
    avatar: "TK",
    color: "#8B5CF6",
  },
];

/* ─── dashboard preview cards ─── */
const previewStats = [
  { label: "CA ce mois", value: "€48 500", change: "+18%", color: "#0EFF9C" },
  { label: "Deals closés", value: "12", change: "+3", color: "#3B82F6" },
  { label: "Commissions", value: "€9 700", change: "+22%", color: "#FFD700" },
  { label: "Objectif", value: "78%", change: "↑", color: "#8B5CF6" },
];

export default function LandingPageView() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const heroRef = useInView(0.1);
  const featRef = useInView(0.1);
  const prevRef = useInView(0.1);
  const testRef = useInView(0.1);
  const waitRef = useInView(0.1);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{
        background: "#0D1117",
        fontFamily: "'Syne', 'Inter', sans-serif",
      }}
    >
      {/* ── Google Font ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
 
        * { box-sizing: border-box; }
 
        body { font-family: 'DM Sans', sans-serif; }
 
        h1,h2,h3,h4,.font-display { font-family: 'Syne', sans-serif; }
 
        /* scanline grid background */
        .bg-grid {
          background-image:
            linear-gradient(rgba(14,255,156,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,255,156,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
        }
 
        /* glow blob */
        .glow-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
        }
 
        /* shimmer border */
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .shimmer-border {
          background: linear-gradient(90deg, #0EFF9C, #3B82F6, #8B5CF6, #0EFF9C);
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
 
        /* fade-up animation */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.2s; opacity: 0; }
        .delay-3 { animation-delay: 0.3s; opacity: 0; }
        .delay-4 { animation-delay: 0.4s; opacity: 0; }
        .delay-5 { animation-delay: 0.5s; opacity: 0; }
 
        /* pulse ring for CTA */
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0;   }
        }
        .pulse-ring::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 9999px;
          border: 2px solid #0EFF9C;
          animation: pulseRing 1.8s ease-out infinite;
        }
 
        /* card hover lift */
        .card-hover {
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
        }
 
        /* number ticker */
        @keyframes ticker {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
 
        /* progress bar */
        @keyframes fillBar {
          from { width: 0%; }
          to   { width: 80%; }
        }
        .fill-bar { animation: fillBar 1.4s ease forwards; }
      `}</style>

      {/* ══════════════════════════════════════
          NAV
      ══════════════════════════════════════ */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backdropFilter: navScrolled ? "blur(20px)" : "none",
          background: navScrolled ? "rgba(13,17,23,0.85)" : "transparent",
          borderBottom: navScrolled ? "1px solid rgba(42,47,53,0.8)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #0EFF9C, #00C27A)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={16} color="#0D1117" />
          </div>
          <span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18 }}>
            <span style={{ color: "#fff" }}>Close</span>
            <span style={{ color: "#0EFF9C" }}>One</span>
            <span style={{ color: "#A0A0A0" }}>.io</span>
          </span>
        </div>

        {/* CTA */}
        <a
          href="/dashboard"
          style={{
            background: "linear-gradient(135deg, #0EFF9C, #00C27A)",
            color: "#0D1117",
            fontWeight: 700,
            fontSize: 13,
            padding: "8px 20px",
            borderRadius: 8,
            textDecoration: "none",
            fontFamily: "Syne",
            letterSpacing: "0.02em",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Rejoindre la beta
        </a>
      </nav>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section
        ref={heroRef.ref}
        className="bg-grid"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 24px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow blobs */}
        <div
          className="glow-blob"
          style={{
            width: 600,
            height: 600,
            top: -100,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(14,255,156,0.07)",
          }}
        />
        <div
          className="glow-blob"
          style={{
            width: 400,
            height: 400,
            bottom: 0,
            right: "10%",
            background: "rgba(59,130,246,0.06)",
          }}
        />

        {/* Badge */}
        {heroRef.visible && (
          <div
            className="fade-up delay-1"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid rgba(14,255,156,0.3)",
              background: "rgba(14,255,156,0.06)",
              borderRadius: 999,
              padding: "6px 16px",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.12em",
              color: "#0EFF9C",
              marginBottom: 32,
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#0EFF9C",
                display: "inline-block",
                animation: "pulseRing 1.8s ease-out infinite",
              }}
            />
            Bêta privée — Places limitées
          </div>
        )}

        {/* H1 */}
        {heroRef.visible && (
          <h1
            className="fade-up delay-2 font-display"
            style={{
              fontSize: "clamp(40px, 7vw, 88px)",
              fontWeight: 800,
              lineHeight: 1.05,
              maxWidth: 860,
              marginBottom: 24,
              letterSpacing: "-0.03em",
            }}
          >
            Le cockpit de tout{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #0EFF9C 0%, #3B82F6 50%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              closer performant.
            </span>
          </h1>
        )}

        {/* Subtitle */}
        {heroRef.visible && (
          <p
            className="fade-up delay-3"
            style={{
              fontSize: "clamp(15px, 2vw, 18px)",
              color: "#A0A0A0",
              maxWidth: 520,
              lineHeight: 1.7,
              marginBottom: 48,
              fontFamily: "DM Sans",
              fontWeight: 400,
            }}
          >
            Suis tes deals, calcule tes commissions et booste tes performances —
            tout en un seul endroit.
          </p>
        )}

        {/* CTAs */}
        {heroRef.visible && (
          <div
            className="fade-up delay-4"
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: 64,
            }}
          >
            <a
              href="#waitlist"
              style={{
                position: "relative",
                background: "linear-gradient(135deg, #0EFF9C, #00C27A)",
                color: "#0D1117",
                fontFamily: "Syne",
                fontWeight: 700,
                fontSize: 15,
                padding: "14px 32px",
                borderRadius: 12,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "transform 0.2s, opacity 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 32px rgba(14,255,156,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              Rejoindre la liste d'attente
              <ArrowRight size={16} />
            </a>
            <a
              href="#apercu"
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
                fontFamily: "Syne",
                fontWeight: 600,
                fontSize: 15,
                padding: "14px 32px",
                borderRadius: 12,
                textDecoration: "none",
                background: "rgba(255,255,255,0.04)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(14,255,156,0.4)";
                e.currentTarget.style.background = "rgba(14,255,156,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
            >
              Voir l'aperçu
            </a>
          </div>
        )}

        {/* Stats row */}
        {heroRef.visible && (
          <div
            className="fade-up delay-5"
            style={{
              display: "flex",
              gap: 48,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {[
              { value: 100, suffix: "%", label: "Pensé pour les closers" },
              { value: 0, suffix: "€", label: "Pour commencer" },
              { value: 2, suffix: " min", label: "Pour démarrer" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontFamily: "Syne",
                    fontWeight: 800,
                    fontSize: "clamp(28px, 4vw, 42px)",
                    color: "#0EFF9C",
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "#A0A0A0",
                    letterSpacing: "0.05em",
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            opacity: 0.4,
          }}
        >
          <div
            style={{
              width: 20,
              height: 32,
              border: "1px solid #A0A0A0",
              borderRadius: 999,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: 4,
            }}
          >
            <div
              style={{
                width: 4,
                height: 8,
                borderRadius: 999,
                background: "#A0A0A0",
                animation: "fadeUp 1.2s ease infinite alternate",
              }}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES
      ══════════════════════════════════════ */}
      <section
        ref={featRef.ref}
        id="features"
        style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}
      >
        {featRef.visible && (
          <>
            <div
              className="fade-up delay-1"
              style={{ textAlign: "center", marginBottom: 64 }}
            >
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  color: "#0EFF9C",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Fonctionnalités
              </p>
              <h2
                className="font-display"
                style={{
                  fontSize: "clamp(28px, 4vw, 48px)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                Tout ce dont tu as besoin
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 20,
              }}
            >
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className={`card-hover fade-up delay-${i + 1}`}
                  style={{
                    background: "#1A1F24",
                    border: "1px solid #2A2F35",
                    borderRadius: 16,
                    padding: 28,
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      `${f.color}50`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "#2A2F35";
                  }}
                >
                  {/* accent glow corner */}
                  <div
                    style={{
                      position: "absolute",
                      top: -40,
                      right: -40,
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      background: `${f.color}10`,
                      filter: "blur(30px)",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: `${f.color}15`,
                      border: `1px solid ${f.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                    }}
                  >
                    <f.icon size={20} color={f.color} />
                  </div>
                  <h3
                    className="font-display"
                    style={{ fontWeight: 700, fontSize: 17, marginBottom: 10 }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#A0A0A0",
                      lineHeight: 1.65,
                      fontFamily: "DM Sans",
                    }}
                  >
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ══════════════════════════════════════
          DASHBOARD PREVIEW
      ══════════════════════════════════════ */}
      <section
        ref={prevRef.ref}
        id="apercu"
        style={{ padding: "100px 24px", background: "rgba(14,255,156,0.02)" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {prevRef.visible && (
            <>
              <div
                className="fade-up delay-1"
                style={{ textAlign: "center", marginBottom: 64 }}
              >
                <p
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.15em",
                    color: "#0EFF9C",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  Aperçu
                </p>
                <h2
                  className="font-display"
                  style={{
                    fontSize: "clamp(28px, 4vw, 48px)",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Ton dashboard, pensé pour performer
                </h2>
                <p
                  style={{
                    color: "#A0A0A0",
                    fontSize: 15,
                    marginTop: 16,
                    maxWidth: 480,
                    margin: "16px auto 0",
                    fontFamily: "DM Sans",
                    lineHeight: 1.7,
                  }}
                >
                  Une interface claire, rapide et motivante. Chaque chiffre au
                  bon endroit, chaque action à portée de clic.
                </p>
              </div>

              {/* Mock dashboard UI */}
              <div
                className="fade-up delay-2"
                style={{
                  background: "#1A1F24",
                  border: "1px solid #2A2F35",
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow:
                    "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(14,255,156,0.05)",
                }}
              >
                {/* Mock top bar */}
                <div
                  style={{
                    height: 48,
                    borderBottom: "1px solid #2A2F35",
                    background: "#0D1117",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 20px",
                  }}
                >
                  <div style={{ display: "flex", gap: 6 }}>
                    {["#EF4444", "#F59E0B", "#0EFF9C"].map((c) => (
                      <div
                        key={c}
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: c,
                          opacity: 0.7,
                        }}
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      height: 24,
                      width: 200,
                      borderRadius: 6,
                      background: "#1A1F24",
                      border: "1px solid #2A2F35",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        color: "#A0A0A0",
                        fontFamily: "DM Sans",
                      }}
                    >
                      closeone.io/dashboard
                    </span>
                  </div>
                  <div style={{ width: 60 }} />
                </div>

                <div style={{ display: "flex" }}>
                  {/* Mock sidebar */}
                  <div
                    style={{
                      width: 56,
                      background: "#0D1117",
                      borderRight: "1px solid #2A2F35",
                      padding: "20px 0",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 7,
                        background: "linear-gradient(135deg, #0EFF9C, #00C27A)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Zap size={13} color="#0D1117" />
                    </div>
                    {[BarChart2, DollarSign, Globe, Award].map((Icon, i) => (
                      <div
                        key={i}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background:
                            i === 0 ? "rgba(14,255,156,0.1)" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderLeft:
                            i === 0
                              ? "2px solid #0EFF9C"
                              : "2px solid transparent",
                        }}
                      >
                        <Icon
                          size={15}
                          color={i === 0 ? "#0EFF9C" : "#A0A0A0"}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Mock content */}
                  <div style={{ flex: 1, padding: 24 }}>
                    {/* Stat cards row */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: 12,
                        marginBottom: 20,
                      }}
                    >
                      {previewStats.map((s, i) => (
                        <div
                          key={s.label}
                          className={`fade-up delay-${i + 2}`}
                          style={{
                            background: "#0D1117",
                            border: "1px solid #2A2F35",
                            borderRadius: 12,
                            padding: 16,
                          }}
                        >
                          <p
                            style={{
                              fontSize: 10,
                              color: "#A0A0A0",
                              marginBottom: 8,
                              fontFamily: "DM Sans",
                            }}
                          >
                            {s.label}
                          </p>
                          <p
                            style={{
                              fontSize: 18,
                              fontWeight: 800,
                              color: s.color,
                              fontFamily: "Syne",
                              marginBottom: 4,
                            }}
                          >
                            {s.value}
                          </p>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              color: "#00C27A",
                              background: "rgba(0,194,122,0.1)",
                              padding: "2px 6px",
                              borderRadius: 999,
                            }}
                          >
                            {s.change}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Progress bar mock */}
                    <div
                      style={{
                        background: "#0D1117",
                        border: "1px solid #2A2F35",
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 12,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 10,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#fff",
                            fontFamily: "Syne",
                          }}
                        >
                          Objectif mensuel
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            color: "#0EFF9C",
                            fontWeight: 700,
                          }}
                        >
                          78%
                        </span>
                      </div>
                      <div
                        style={{
                          height: 6,
                          background: "#2A2F35",
                          borderRadius: 999,
                        }}
                      >
                        <div
                          style={{
                            width: "78%",
                            height: "100%",
                            background:
                              "linear-gradient(90deg, #0EFF9C, #00C27A)",
                            borderRadius: 999,
                          }}
                        />
                      </div>
                    </div>

                    {/* Mini deals table mock */}
                    <div
                      style={{
                        background: "#0D1117",
                        border: "1px solid #2A2F35",
                        borderRadius: 12,
                        padding: 16,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#fff",
                          fontFamily: "Syne",
                          marginBottom: 12,
                        }}
                      >
                        Deals récents
                      </p>
                      {[
                        {
                          name: "Contrat SaaS Premium",
                          client: "TechCorp",
                          amount: "€24 000",
                          status: "Gagné",
                          statusColor: "#00C27A",
                        },
                        {
                          name: "Licence Enterprise",
                          client: "DataFlow",
                          amount: "€18 500",
                          status: "En cours",
                          statusColor: "#3B82F6",
                        },
                        {
                          name: "Consulting Pack",
                          client: "StartupXYZ",
                          amount: "€8 000",
                          status: "En cours",
                          statusColor: "#3B82F6",
                        },
                      ].map((d, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "8px 0",
                            borderBottom: i < 2 ? "1px solid #2A2F35" : "none",
                          }}
                        >
                          <div>
                            <p
                              style={{
                                fontSize: 11,
                                color: "#fff",
                                fontFamily: "DM Sans",
                              }}
                            >
                              {d.name}
                            </p>
                            <p style={{ fontSize: 10, color: "#A0A0A0" }}>
                              {d.client}
                            </p>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#0EFF9C",
                                fontFamily: "Syne",
                              }}
                            >
                              {d.amount}
                            </span>
                            <span
                              style={{
                                fontSize: 9,
                                fontWeight: 600,
                                padding: "3px 8px",
                                borderRadius: 999,
                                background: `${d.statusColor}20`,
                                color: d.statusColor,
                              }}
                            >
                              {d.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section
        ref={testRef.ref}
        id="temoignages"
        style={{ padding: "100px 24px" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {testRef.visible && (
            <>
              <div
                className="fade-up delay-1"
                style={{ textAlign: "center", marginBottom: 64 }}
              >
                <p
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.15em",
                    color: "#0EFF9C",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  Ils nous font confiance
                </p>
                <h2
                  className="font-display"
                  style={{
                    fontSize: "clamp(28px, 4vw, 48px)",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Ce que disent les closers
                </h2>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 20,
                }}
              >
                {testimonials.map((t, i) => (
                  <div
                    key={t.name}
                    className={`card-hover fade-up delay-${i + 1}`}
                    style={{
                      background: "#1A1F24",
                      border: "1px solid #2A2F35",
                      borderRadius: 16,
                      padding: 28,
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        `${t.color}40`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "#2A2F35";
                    }}
                  >
                    {/* quote mark */}
                    <div
                      style={{
                        position: "absolute",
                        top: 20,
                        right: 24,
                        fontSize: 64,
                        lineHeight: 1,
                        color: `${t.color}10`,
                        fontFamily: "Syne",
                        fontWeight: 800,
                        pointerEvents: "none",
                      }}
                    >
                      "
                    </div>

                    {/* Stars */}
                    <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          size={13}
                          color={t.color}
                          fill={t.color}
                        />
                      ))}
                    </div>

                    <p
                      style={{
                        fontSize: 14,
                        color: "#D0D0D0",
                        lineHeight: 1.75,
                        fontFamily: "DM Sans",
                        marginBottom: 24,
                        fontStyle: "italic",
                      }}
                    >
                      "{t.quote}"
                    </p>

                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: `linear-gradient(135deg, ${t.color}30, ${t.color}10)`,
                          border: `2px solid ${t.color}40`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: 700,
                          color: t.color,
                          fontFamily: "Syne",
                        }}
                      >
                        {t.avatar}
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#fff",
                            fontFamily: "Syne",
                          }}
                        >
                          {t.name}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: "#A0A0A0",
                            fontFamily: "DM Sans",
                          }}
                        >
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          WAITLIST
      ══════════════════════════════════════ */}
      <section
        ref={waitRef.ref}
        id="waitlist"
        style={{ padding: "100px 24px", borderTop: "1px solid #2A2F35" }}
      >
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          {waitRef.visible && (
            <>
              <div className="fade-up delay-1">
                <p
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.15em",
                    color: "#0EFF9C",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  Liste d'attente
                </p>
                <h2
                  className="font-display"
                  style={{
                    fontSize: "clamp(26px, 4vw, 44px)",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    marginBottom: 16,
                  }}
                >
                  Rejoins la liste d'attente
                </h2>
                <p
                  style={{
                    color: "#A0A0A0",
                    fontSize: 15,
                    lineHeight: 1.7,
                    marginBottom: 40,
                    fontFamily: "DM Sans",
                  }}
                >
                  Accès beta en priorité. Gratuit. Sans engagement.
                </p>
              </div>

              {!submitted ? (
                <form
                  className="fade-up delay-2"
                  onSubmit={handleSubmit}
                  style={{
                    display: "flex",
                    gap: 10,
                    maxWidth: 440,
                    margin: "0 auto",
                    flexWrap: "wrap",
                  }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ton@email.com"
                    required
                    style={{
                      flex: 1,
                      minWidth: 200,
                      height: 50,
                      borderRadius: 12,
                      border: "1px solid #2A2F35",
                      background: "#1A1F24",
                      color: "#fff",
                      padding: "0 18px",
                      fontSize: 14,
                      fontFamily: "DM Sans",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#0EFF9C")}
                    onBlur={(e) => (e.target.style.borderColor = "#2A2F35")}
                  />
                  <button
                    type="submit"
                    style={{
                      height: 50,
                      padding: "0 28px",
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #0EFF9C, #00C27A)",
                      color: "#0D1117",
                      fontFamily: "Syne",
                      fontWeight: 700,
                      fontSize: 14,
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 24px rgba(14,255,156,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = "";
                    }}
                  >
                    Rejoindre
                  </button>
                </form>
              ) : (
                <div
                  className="fade-up"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 12,
                    background: "rgba(14,255,156,0.08)",
                    border: "1px solid rgba(14,255,156,0.25)",
                    borderRadius: 12,
                    padding: "16px 28px",
                  }}
                >
                  <CheckCircle size={20} color="#0EFF9C" />
                  <p
                    style={{
                      color: "#0EFF9C",
                      fontWeight: 600,
                      fontFamily: "Syne",
                    }}
                  >
                    Parfait — tu es sur la liste. On te contacte très vite.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer
        style={{
          borderTop: "1px solid #2A2F35",
          padding: "32px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "linear-gradient(135deg, #0EFF9C, #00C27A)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={13} color="#0D1117" />
          </div>
          <span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15 }}>
            <span style={{ color: "#fff" }}>Close</span>
            <span style={{ color: "#0EFF9C" }}>One</span>
            <span style={{ color: "#A0A0A0" }}>.io</span>
          </span>
        </div>
        <p style={{ fontSize: 13, color: "#A0A0A0", fontFamily: "DM Sans" }}>
          © 2025 Close.One — Growth Smarter.
        </p>
        <a
          href="mailto:contact@closeone.io"
          style={{
            fontSize: 13,
            color: "#A0A0A0",
            textDecoration: "none",
            fontFamily: "DM Sans",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#0EFF9C")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#A0A0A0")}
        >
          contact@closeone.io
        </a>
      </footer>
    </div>
  );
}
