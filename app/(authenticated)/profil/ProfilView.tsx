'use client';

import { Mail, Phone, MapPin, Calendar, Trophy, Target, TrendingUp, Users } from 'lucide-react';
import CloseScoreRadar from '@/components/dashboard/CloseScoreRadar';
import { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';
import EditProfilModal from '@/components/EditProfileModal';

const getScoreInfo = (score: number) => {
  if (score >= 90) return { icon: '🏆', label: 'Master de la vente' };
  if (score >= 80) return { icon: '🥇', label: 'Excellent profil' };
  if (score >= 60) return { icon: '🥈', label: 'Bon profil' };
  if (score >= 40) return { icon: '🥉', label: 'Profil moyen' };
  return { icon: '⚠️', label: 'Profil insuffisant' };
};

const experienceLabel: Record<string, string> = {
  MOINS_1_AN:     "Moins d'1 an",
  UN_AN:          '1 an',
  DEUX_ANS:       '2 ans',
  TROIS_ANS_PLUS: '3 ans et plus',
};

const roleLabel: Record<string, string> = {
  CLOSER:  'Closer',
  MANAGER: 'Manager',
  ADMIN:   'Admin',
  USER:    'Utilisateur',
};

export default function ProfilView() {
  const user = useUser();
  const [showEditModal, setShowEditModal] = useState(false);
  const [trackGenerated, setTrackGenerated] = useState(false);

  if (!user) return null;

  const trackUrl = `https://closeone.io/track/${user.publicSlug ?? user.id}`;

  const metrics     = user.metrics;
  const caMensuel   = metrics?.monthlyRevenue ?? 0;
  const caTotal     = metrics?.totalRevenue   ?? 0;
  const dealsTotal  = metrics?.totalDeals     ?? 0;
  const tauxClosing = metrics?.totalDeals
    ? Math.round((metrics.wonDeals / metrics.totalDeals) * 100)
    : 0;

  const lastScore  = user.monthlyScores?.[0];
  const closeScore = lastScore?.scoreFinal ?? 0;
  const scoreInfo  = getScoreInfo(closeScore);

  const allDeals   = user.challenges.flatMap(c => c.deals);
  const fullPayPct = allDeals.length
    ? Math.round((allDeals.filter(d => d.typeVente === 'FULL_PAY').length / allDeals.length) * 100)
    : 0;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;
  const initials =
    (user.firstName?.[0] ?? user.email[0]).toUpperCase() +
    (user.lastName?.[0] ?? '').toUpperCase();

  const memberSince = new Date(user.createdAt).toLocaleDateString('fr-FR', {
    month: 'long', year: 'numeric',
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>Profil</h2>
        <p className="text-sm mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>Votre espace personnel</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[35%_1fr] gap-6">

        {/* ── LEFT CARD ───────────────────────────────────── */}
        <div
          className="p-6 flex flex-col items-center text-center space-y-5"
          style={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border) / 0.5)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={fullName} className="w-[100px] h-[100px] rounded-full object-cover" />
          ) : (
            <div
              className="w-[100px] h-[100px] rounded-full flex items-center justify-center text-[28px] font-bold"
              style={{ background: 'var(--gradient-primary)', color: 'hsl(var(--primary-foreground))' }}
            >
              {initials}
            </div>
          )}

          <div>
            <h3 className="font-bold text-xl" style={{ color: 'hsl(var(--foreground))' }}>{fullName}</h3>
            <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>{roleLabel[user.role] ?? user.role}</p>
            <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
              {user.experience ? experienceLabel[user.experience] : 'Expérience non renseignée'}
            </p>
          </div>

          {/* Close Score */}
          <div
            className="w-full rounded-[10px] p-4"
            style={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border) / 0.5)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-medium tracking-wider uppercase" style={{ color: 'hsl(var(--muted-foreground))' }}>
                Close Score
              </span>
              <span className="text-lg">{scoreInfo.icon}</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: 'hsl(var(--primary))' }}>
              {closeScore > 0 ? Math.min(Math.round(closeScore), 95) : '—'}
            </p>
            <p className="text-[11px] font-semibold mt-1" style={{ color: 'hsl(var(--primary))' }}>
              {closeScore > 0 ? scoreInfo.label : 'Aucune donnée'}
            </p>
            {allDeals.length > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-[10px] mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  <span>Full Pay {fullPayPct}%</span>
                  <span>Split Pay {100 - fullPayPct}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden flex">
                  <div className="h-full transition-all" style={{ width: `${fullPayPct}%`, backgroundColor: 'hsl(var(--primary))' }} />
                  <div className="h-full transition-all" style={{ width: `${100 - fullPayPct}%`, backgroundColor: 'hsl(var(--warning))' }} />
                </div>
              </div>
            )}
          </div>

          {/* Contact */}
          <div className="space-y-2 text-sm w-full text-left" style={{ color: 'hsl(var(--muted-foreground))' }}>
            <div className="flex items-center gap-3"><Mail size={14} /> {user.email}</div>
            <div className="flex items-center gap-3"><Phone size={14} /> {user.telephone ?? 'Non renseigné'}</div>
            <div className="flex items-center gap-3"><MapPin size={14} /> {user.localisation ?? 'Non renseigné'}</div>
            <div className="flex items-center gap-3"><Calendar size={14} /> Membre depuis {memberSince}</div>
          </div>

          <button
            onClick={() => setShowEditModal(true)}
            className="w-full h-10 rounded-lg border text-sm font-medium transition-colors hover:bg-primary/10"
            style={{ borderColor: 'hsl(var(--primary))', color: 'hsl(var(--primary))' }}
          >
            Modifier mon profil
          </button>
        </div>

        {/* ── RIGHT COLUMN ──*/}
        <div className="space-y-6">
          <div className="p-6" style={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border) / 0.5)', borderRadius: 'var(--radius-lg)' }}>
            <h3 className="font-semibold text-[22px] mb-2" style={{ color: 'hsl(var(--foreground))' }}>Close Score — Détail</h3>
            <p className="text-[11px] mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>Score calculé sur 5 critères vérifiés par CloseOne</p>
            <CloseScoreRadar scores={lastScore ?? null} />
          </div>

          <div className="p-6" style={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border) / 0.5)', borderRadius: 'var(--radius-lg)' }}>
            <h3 className="font-semibold text-[22px] mb-4" style={{ color: 'hsl(var(--foreground))' }}>Performance</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Trophy,     label: 'CA Mensuel',   value: `${caMensuel.toLocaleString('fr-FR')}€` },
                { icon: Target,     label: 'CA Total',     value: `${caTotal.toLocaleString('fr-FR')}€` },
                { icon: TrendingUp, label: 'Deals Total',  value: String(dealsTotal) },
                { icon: Users,      label: 'Taux closing', value: `${tauxClosing}%` },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <s.icon size={20} className="mx-auto mb-2" style={{ color: 'hsl(var(--muted-foreground))' }} />
                  <p className="text-xs mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>{s.label}</p>
                  <p className="text-2xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6" style={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border) / 0.5)', borderRadius: 'var(--radius-lg)' }}>
            <h3 className="font-semibold text-[22px] mb-2" style={{ color: 'hsl(var(--foreground))' }}>Track Record Public</h3>
            <p className="text-[11px] mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>Partagez vos performances vérifiées avec vos futurs clients</p>
            {trackGenerated ? (
              <div className="space-y-3">
                <div className="rounded-[10px] p-3 flex items-center justify-between" style={{ backgroundColor: 'hsl(var(--background))' }}>
                  <span className="text-xs truncate mr-2" style={{ color: 'hsl(var(--muted-foreground))' }}>{trackUrl}</span>
                  <button onClick={() => navigator.clipboard.writeText(trackUrl)} className="text-xs hover:underline shrink-0" style={{ color: 'hsl(var(--primary))' }}>
                    Copier
                  </button>
                </div>
                <Link href={`/profil/trackrecord/${user.publicSlug ?? user.id}`} className="text-xs hover:underline" style={{ color: 'hsl(var(--primary))' }}>
                  Voir l'aperçu →
                </Link>
              </div>
            ) : (
              <button
                onClick={() => setTrackGenerated(true)}
                className="px-5 py-2.5 rounded-[10px] text-sm font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
              >
                Générer mon track record
              </button>
            )}
          </div>
        </div>
      </div>

      <EditProfilModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        defaultValues={{
          firstName:    user.firstName    ?? '',
          lastName:     user.lastName     ?? '',
          telephone:    user.telephone    ?? '',
          localisation: user.localisation ?? '',
          experience:   user.experience   ?? null,
        }}
      />
    </div>
  );
}