"use client";

import { Zap, Shield } from "lucide-react";
import CloseScoreRadar from "@/components/dashboard/CloseScoreRadar";
import { getScoreInfo } from "@/components/dashboard/CloseScoreCard";
import { UserWithRelations } from "../ProfilView";

const profile = {
  name: "Julien De Bonnières",
  initials: "JDB",
  role: "Senior Closer",
  experience: "3 ans de closing",
  city: "Paris, France",
  closeScore: 82,
  tauxClosing: 33,
  cashGenere: 68500,
  panierMoyen: 2450,
  delaiMoyen: 2.4,
  cashContracte: 68500,
  cashCollecte: 52100,
  fullPayPct: 65,
};

const scoreInfo = getScoreInfo(profile.closeScore);

const nichePerf = [
  { niche: "Business & Scaling", ca: 42000, taux: 35 },
  { niche: "Développement personnel", ca: 18000, taux: 30 },
  { niche: "Fitness & Santé", ca: 8500, taux: 28 },
];

const challenges = [
  { client: "Alex Hormozi FR", label: "Challenge Mars", closes: 6, cash: 7400 },
  { client: "Alex Hormozi FR", label: "Challenge Janvier", closes: 4, cash: 5200 },
  { client: "Marie Coaching", label: "Challenge Février", closes: 3, cash: 3800 },
];

export default function TrackRecordView({ user }: { user: UserWithRelations }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "hsl(var(--background))" }}>
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid hsl(var(--border) / 0.5)",
          backgroundColor: "hsl(var(--card) / 0.6)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            maxWidth: "1024px",
            margin: "0 auto",
            padding: "1rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: "hsl(var(--primary))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Zap size={16} style={{ color: "hsl(var(--primary-foreground))" }} />
            </div>
            <span style={{ fontWeight: "bold" }}>
              <span style={{ color: "hsl(var(--foreground))" }}>Close</span>
              <span style={{ color: "hsl(var(--primary))" }}>One</span>
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              fontSize: "0.75rem",
              color: "hsl(var(--muted-foreground))",
            }}
          >
            <Shield size={14} style={{ color: "hsl(var(--primary))" }} />
            Track Record Vérifié
          </div>
        </div>
      </header>

      <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div
            style={{
              width: "5rem",
              height: "5rem",
              borderRadius: "9999px",
              backgroundColor: "hsl(var(--primary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "hsl(var(--primary-foreground))",
            }}
          >
            {profile.initials}
          </div>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "hsl(var(--foreground))" }}>
              {profile.name}
            </h1>
            <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.875rem" }}>
              {profile.role} · {profile.experience}
            </p>
            <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.75rem" }}>{profile.city}</p>
          </div>
        </div>

        {/* Close Score + Radar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border) / 0.5)",
              borderRadius: "var(--radius-md)",
              padding: "1.5rem",
            }}
          >
            <CloseScoreRadar />
          </div>
          <div
            style={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border) / 0.5)",
              borderRadius: "var(--radius-md)",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: "0.625rem",
                fontWeight: "500",
                letterSpacing: "0.1em",
                color: "hsl(var(--muted-foreground))",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              Close Score
            </span>
            <p style={{ fontSize: "3rem", fontWeight: "bold", color: "hsl(var(--primary))" }}>
              {Math.min(profile.closeScore, 95)}
            </p>
            <p style={{ fontSize: "0.875rem", fontWeight: "600", color: "hsl(var(--primary))", marginTop: "0.25rem" }}>
              {scoreInfo.label}
            </p>
            <p style={{ fontSize: "1.125rem", marginTop: "0.25rem" }}>{scoreInfo.icon}</p>
          </div>
        </div>

        {/* Global Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "0.75rem",
          }}
        >
          {[
            { label: "Taux closing", value: `${profile.tauxClosing}%` },
            { label: "Cash généré", value: `${(profile.cashGenere / 1000).toFixed(1)}K€` },
            { label: "Panier moyen", value: `${profile.panierMoyen}€` },
            { label: "Délai moyen", value: `${profile.delaiMoyen}j` },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border) / 0.5)",
                borderRadius: "var(--radius-sm)",
                padding: "1rem",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "0.625rem",
                  color: "hsl(var(--muted-foreground))",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "0.25rem",
                }}
              >
                {s.label}
              </p>
              <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "hsl(var(--foreground))" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Cash bars */}
        <div
          style={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border) / 0.5)",
            borderRadius: "var(--radius-md)",
            padding: "1.25rem",
          }}
        >
          <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", color: "hsl(var(--foreground))" }}>
            Cash contracté vs collecté
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "0.25rem" }}>
                <span style={{ color: "hsl(var(--muted-foreground))" }}>Contracté</span>
                <span style={{ fontWeight: "600", color: "hsl(var(--foreground))" }}>
                  {profile.cashContracte.toLocaleString("fr-FR")}€
                </span>
              </div>
              <div style={{ height: "0.75rem", borderRadius: "9999px", backgroundColor: "hsl(var(--muted))", overflow: "hidden" }}>
                <div style={{ width: "100%", height: "100%", backgroundColor: "hsl(var(--primary))", borderRadius: "9999px" }} />
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "0.25rem" }}>
                <span style={{ color: "hsl(var(--muted-foreground))" }}>Collecté</span>
                <span style={{ fontWeight: "600", color: "hsl(var(--primary))" }}>
                  {profile.cashCollecte.toLocaleString("fr-FR")}€
                </span>
              </div>
              <div style={{ height: "0.75rem", borderRadius: "9999px", backgroundColor: "hsl(var(--muted))", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${Math.round((profile.cashCollecte / profile.cashContracte) * 100)}%`,
                    height: "100%",
                    backgroundColor: "hsl(var(--primary) / 0.6)",
                    borderRadius: "9999px",
                  }}
                />
              </div>
            </div>
          </div>
          {/* Full / Split */}
          <div style={{ marginTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.625rem", color: "hsl(var(--muted-foreground))", marginBottom: "0.25rem" }}>
              <span>Full Pay {profile.fullPayPct}%</span>
              <span>Split Pay {100 - profile.fullPayPct}%</span>
            </div>
            <div style={{ height: "0.5rem", borderRadius: "9999px", overflow: "hidden", display: "flex" }}>
              <div style={{ width: `${profile.fullPayPct}%`, height: "100%", backgroundColor: "hsl(var(--primary))" }} />
              <div style={{ width: `${100 - profile.fullPayPct}%`, height: "100%", backgroundColor: "hsl(var(--warning))" }} />
            </div>
          </div>
        </div>

        {/* Niche */}
        <div>
          <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.75rem", color: "hsl(var(--foreground))" }}>
            Performances par niche
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {nichePerf.map((n) => (
              <div
                key={n.niche}
                style={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border) / 0.5)",
                  borderRadius: "var(--radius-sm)",
                  padding: "1rem",
                }}
              >
                <p style={{ fontSize: "0.6875rem", color: "hsl(var(--muted-foreground))", marginBottom: "0.5rem" }}>
                  {n.niche}
                </p>
                <p style={{ fontSize: "1.125rem", fontWeight: "bold", color: "hsl(var(--primary))" }}>
                  {n.ca.toLocaleString("fr-FR")}€
                </p>
                <p style={{ fontSize: "0.6875rem", color: "hsl(var(--muted-foreground))" }}>Taux : {n.taux}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Challenges */}
        <div>
          <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.75rem", color: "hsl(var(--foreground))" }}>
            Historique challenges
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {challenges.map((c, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border) / 0.5)",
                  borderRadius: "var(--radius-sm)",
                  padding: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p style={{ fontSize: "0.875rem", fontWeight: "500", color: "hsl(var(--foreground))" }}>{c.label}</p>
                  <p style={{ fontSize: "0.6875rem", color: "hsl(var(--muted-foreground))" }}>{c.client}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "0.875rem", fontWeight: "bold", color: "hsl(var(--primary))" }}>
                    {c.cash.toLocaleString("fr-FR")}€
                  </p>
                  <p style={{ fontSize: "0.6875rem", color: "hsl(var(--muted-foreground))" }}>{c.closes} closes</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", paddingTop: "1.5rem", borderTop: "1px solid hsl(var(--border) / 0.5)" }}>
          <p style={{ fontSize: "0.6875rem", color: "hsl(var(--muted-foreground))" }}>
            Données vérifiées par CloseOne.io — Impossible d'envoyer un faux track record.
          </p>
        </div>
      </div>
    </div>
  );
}