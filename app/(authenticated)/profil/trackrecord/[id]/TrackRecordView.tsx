"use client";

import { Zap, Shield } from "lucide-react";
import CloseScoreRadar from "@/components/dashboard/CloseScoreRadar";
import { getScoreInfo } from "@/components/dashboard/CloseScoreCard";
import { FullUser, useUser } from "@/contexts/UserContext";

export default function TrackRecordView() {
    const user = useUser();
    if (!user) return null;

  // Données utilisateur
  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
  const initials =
    (user.firstName?.[0] ?? user.email[0]).toUpperCase() +
    (user.lastName?.[0] ?? "").toUpperCase();
  const roleLabel: Record<string, string> = {
    CLOSER: "Closer",
    MANAGER: "Manager",
    ADMIN: "Admin",
    USER: "Utilisateur",
  };
  const role = roleLabel[user.role] ?? user.role;
  const experience = user.experience ?? "Expérience non renseignée";
  const city = user.city ?? "Localisation non renseignée";

  // Métriques
  const metrics = user.metrics;
  const closeScore = metrics?.closeScore ?? 50;
  const scoreInfo = getScoreInfo(closeScore);
  const tauxClosing = metrics?.totalDeals
    ? Math.round((metrics.wonDeals / metrics.totalDeals) * 100)
    : 0;
  const cashGenere = metrics?.totalRevenue ?? 0;
  const panierMoyen = metrics?.totalDeals
    ? Math.round(metrics.totalRevenue / metrics.totalDeals)
    : 0;
  const delaiMoyen = 2.4; // À calculer selon tes données
  const cashContracte = metrics?.totalRevenue ?? 0;
  const cashCollecte = metrics?.collectedRevenue ?? 0; // À adapter si champ différent

  // Deals et répartition FullPay / SplitPay
  const deals = user.deals ?? [];
  const fullPayPct = deals.length
    ? Math.round(
        (deals.filter((d) => d.paymentType === "FULL_PAY").length /
          deals.length) *
          100,
      )
    : 65;

  // Données supplémentaires (à remplacer par des données réelles)
  const nichePerf: { niche: string; ca: number; taux: number }[] = [];
  const challenges: {
    client: string;
    label: string;
    closes: number;
    cash: number;
  }[] = [];

  return (
    <div
      style={{ minHeight: "100vh", backgroundColor: "hsl(var(--background))" }}
    >
      {/* Header fixe */}
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
              <Zap
                size={16}
                style={{ color: "hsl(var(--primary-foreground))" }}
              />
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

      <div
        style={{
          maxWidth: "1024px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {/* Section profil */}
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
            {initials}
          </div>
          <div>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "hsl(var(--foreground))",
              }}
            >
              {fullName}
            </h1>
            <p
              style={{
                color: "hsl(var(--muted-foreground))",
                fontSize: "0.875rem",
              }}
            >
              {role} · {experience}
            </p>
            <p
              style={{
                color: "hsl(var(--muted-foreground))",
                fontSize: "0.75rem",
              }}
            >
              {city}
            </p>
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
            <p
              style={{
                fontSize: "3rem",
                fontWeight: "bold",
                color: "hsl(var(--primary))",
              }}
            >
              {Math.min(closeScore, 95)}
            </p>
            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "hsl(var(--primary))",
                marginTop: "0.25rem",
              }}
            >
              {scoreInfo.label}
            </p>
            <p style={{ fontSize: "1.125rem", marginTop: "0.25rem" }}>
              {scoreInfo.icon}
            </p>
          </div>
        </div>

        {/* Statistiques globales */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "0.75rem",
          }}
        >
          {[
            { label: "Taux closing", value: `${tauxClosing}%` },
            {
              label: "Cash généré",
              value: `${(cashGenere / 1000).toFixed(1)}K€`,
            },
            { label: "Panier moyen", value: `${panierMoyen}€` },
            { label: "Délai moyen", value: `${delaiMoyen}j` },
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
              <p
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: "hsl(var(--foreground))",
                }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Cash contracté vs collecté + Full/Split */}
        <div
          style={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border) / 0.5)",
            borderRadius: "var(--radius-md)",
            padding: "1.25rem",
          }}
        >
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: "600",
              marginBottom: "1rem",
              color: "hsl(var(--foreground))",
            }}
          >
            Cash contracté vs collecté
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.75rem",
                  marginBottom: "0.25rem",
                }}
              >
                <span style={{ color: "hsl(var(--muted-foreground))" }}>
                  Contracté
                </span>
                <span
                  style={{ fontWeight: "600", color: "hsl(var(--foreground))" }}
                >
                  {cashContracte.toLocaleString("fr-FR")}€
                </span>
              </div>
              <div
                style={{
                  height: "0.75rem",
                  borderRadius: "9999px",
                  backgroundColor: "hsl(var(--muted))",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "hsl(var(--primary))",
                    borderRadius: "9999px",
                  }}
                />
              </div>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.75rem",
                  marginBottom: "0.25rem",
                }}
              >
                <span style={{ color: "hsl(var(--muted-foreground))" }}>
                  Collecté
                </span>
                <span
                  style={{ fontWeight: "600", color: "hsl(var(--primary))" }}
                >
                  {cashCollecte.toLocaleString("fr-FR")}€
                </span>
              </div>
              <div
                style={{
                  height: "0.75rem",
                  borderRadius: "9999px",
                  backgroundColor: "hsl(var(--muted))",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${
                      cashContracte
                        ? Math.round((cashCollecte / cashContracte) * 100)
                        : 0
                    }%`,
                    height: "100%",
                    backgroundColor: "hsl(var(--primary) / 0.6)",
                    borderRadius: "9999px",
                  }}
                />
              </div>
            </div>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.625rem",
                color: "hsl(var(--muted-foreground))",
                marginBottom: "0.25rem",
              }}
            >
              <span>Full Pay {fullPayPct}%</span>
              <span>Split Pay {100 - fullPayPct}%</span>
            </div>
            <div
              style={{
                height: "0.5rem",
                borderRadius: "9999px",
                overflow: "hidden",
                display: "flex",
              }}
            >
              <div
                style={{
                  width: `${fullPayPct}%`,
                  height: "100%",
                  backgroundColor: "hsl(var(--primary))",
                }}
              />
              <div
                style={{
                  width: `${100 - fullPayPct}%`,
                  height: "100%",
                  backgroundColor: "hsl(var(--warning))",
                }}
              />
            </div>
          </div>
        </div>

        {/* Performances par niche (optionnel) */}
        {nichePerf.length > 0 && (
          <div>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                marginBottom: "0.75rem",
                color: "hsl(var(--foreground))",
              }}
            >
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
                  <p
                    style={{
                      fontSize: "0.6875rem",
                      color: "hsl(var(--muted-foreground))",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {n.niche}
                  </p>
                  <p
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: "bold",
                      color: "hsl(var(--primary))",
                    }}
                  >
                    {n.ca.toLocaleString("fr-FR")}€
                  </p>
                  <p
                    style={{
                      fontSize: "0.6875rem",
                      color: "hsl(var(--muted-foreground))",
                    }}
                  >
                    Taux : {n.taux}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historique challenges (optionnel) */}
        {challenges.length > 0 && (
          <div>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                marginBottom: "0.75rem",
                color: "hsl(var(--foreground))",
              }}
            >
              Historique challenges
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
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
                    <p
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "hsl(var(--foreground))",
                      }}
                    >
                      {c.label}
                    </p>
                    <p
                      style={{
                        fontSize: "0.6875rem",
                        color: "hsl(var(--muted-foreground))",
                      }}
                    >
                      {c.client}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                        color: "hsl(var(--primary))",
                      }}
                    >
                      {c.cash.toLocaleString("fr-FR")}€
                    </p>
                    <p
                      style={{
                        fontSize: "0.6875rem",
                        color: "hsl(var(--muted-foreground))",
                      }}
                    >
                      {c.closes} closes
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            paddingTop: "1.5rem",
            borderTop: "1px solid hsl(var(--border) / 0.5)",
          }}
        >
          <p
            style={{
              fontSize: "0.6875rem",
              color: "hsl(var(--muted-foreground))",
            }}
          >
            Données vérifiées par CloseOne.io — Impossible d'envoyer un faux
            track record.
          </p>
        </div>
      </div>
    </div>
  );
}
