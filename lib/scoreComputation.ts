"use server";

import { prisma } from "@/lib/prisma";

// Barème C1 - Taux de closing
function getScoreC1(tauxClosing: number): number {
  if (tauxClosing >= 45) return 30;
  if (tauxClosing >= 35) return 27;
  if (tauxClosing >= 30) return 24;
  if (tauxClosing >= 25) return 19;
  if (tauxClosing >= 20) return 15;
  if (tauxClosing >= 15) return 12;
  if (tauxClosing >= 10) return 9;
  return 6;
}

// Barème C2 - Taux de cash collecté
function getScoreC2(tauxCollecte: number): number {
  if (tauxCollecte >= 85) return 25;
  if (tauxCollecte >= 80) return 23;
  if (tauxCollecte >= 75) return 21;
  if (tauxCollecte >= 70) return 19;
  if (tauxCollecte >= 65) return 18;
  if (tauxCollecte >= 60) return 17;
  if (tauxCollecte >= 55) return 16;
  if (tauxCollecte >= 50) return 14;
  if (tauxCollecte >= 45) return 12;
  if (tauxCollecte >= 40) return 11;
  if (tauxCollecte >= 35) return 10;
  if (tauxCollecte >= 30) return 8;
  if (tauxCollecte >= 25) return 7;
  if (tauxCollecte >= 20) return 6;
  return 5;
}

// Barème C3 - Régularité/Progression
function getScoreC3(evolution: number): number {
  if (evolution >= 5) return 20;
  if (evolution >= -4 && evolution <= 4) return 15;
  if (evolution >= -10 && evolution <= -5) return 10;
  if (evolution >= -20 && evolution <= -11) return 7;
  return 4;
}

// Barème C4 - Temps de signature (moyenne en jours)
function getScoreC4(delaiMoyen: number): number {
  if (delaiMoyen === 0) return 15;
  if (delaiMoyen <= 2) return 12;
  if (delaiMoyen <= 5) return 9;
  if (delaiMoyen <= 10) return 6;
  if (delaiMoyen <= 20) return 4;
  return 3;
}

// Barème C5 - Objectifs mensuels
function getScoreC5(nbObjectifs: number, nbAtteints: number): number {
  if (nbObjectifs === 0) return 0;
  const ratio = nbAtteints / nbObjectifs;
  if (ratio === 1) return 10;
  if (ratio >= 0.5) return 6;
  if (ratio >= 0.25) return 3;
  return 0;
}

export async function computeMonthlyScore(userId: string, mois: string) {
  
  // Récupérer tous les challenges du user
  const challenges = await prisma.challenge.findMany({
    where: { userId },
    include: {
      dailyEntries: true,
      deals: {
        include: { payments: true },
      },
    },
  });

  // === C1: Taux de closing ===
  let totalR1Effectue = 0;
  let totalCloses = 0;
  
  for (const challenge of challenges) {
    for (const entry of challenge.dailyEntries) {
      // Filtrer par mois si besoin
      totalR1Effectue += entry.r1Effectue;
      totalCloses += entry.nbCloses;
    }
  }
  
  const tauxClosing = totalR1Effectue > 0 ? (totalCloses / totalR1Effectue) * 100 : 0;
  const scoreC1 = getScoreC1(tauxClosing);

  // === C2: Taux de cash collecté ===
  let totalContracte = 0;
  let totalCollecte = 0;
  
  for (const challenge of challenges) {
    for (const deal of challenge.deals) {
      totalContracte += deal.montantContracte;
      totalCollecte += deal.montantCollecte;
    }
  }
  
  const tauxCollecte = totalContracte > 0 ? (totalCollecte / totalContracte) * 100 : 0;
  const scoreC2 = getScoreC2(tauxCollecte);

  // === C3: Régularité/Progression ===
  const previousScores = await prisma.monthlyScore.findMany({
    where: { userId },
    orderBy: { mois: 'desc' },
    take: 4,
  });
  
  let scoreC3 = 10; // Valeur par défaut (moins de 3 mois de données)
  if (previousScores.length >= 3) {
    const currentScore = previousScores[0].scoreBrut;
    const avgPrevious = (previousScores[1].scoreBrut + previousScores[2].scoreBrut + previousScores[3].scoreBrut) / 3;
    const evolution = currentScore - avgPrevious;
    scoreC3 = getScoreC3(evolution);
  }

  // === C4: Temps de signature ===
  let totalDelai = 0;
  let nbDealsAvecDelai = 0;
  
  for (const challenge of challenges) {
    for (const deal of challenge.deals) {
      if (deal.dateR1 && deal.dateClose) {
        const delai = Math.ceil((deal.dateClose.getTime() - deal.dateR1.getTime()) / (1000 * 60 * 60 * 24));
        totalDelai += delai;
        nbDealsAvecDelai++;
      }
    }
  }
  
  const delaiMoyen = nbDealsAvecDelai > 0 ? totalDelai / nbDealsAvecDelai : 0;
  const scoreC4 = getScoreC4(delaiMoyen);

  // === C5: Objectifs mensuels ===
  const objectives = await prisma.objective.findMany({
    where: { userId, mois },
  });
  
  const nbObjectifs = objectives.length;
  const nbAtteints = objectives.filter(o => o.atteint).length;
  const scoreC5 = getScoreC5(nbObjectifs, nbAtteints);

  // Calcul du score brut et final
  const scoreBrut = scoreC1 + scoreC2 + scoreC3 + scoreC4 + scoreC5;
  const scoreFinal = Math.min(scoreBrut * 0.95, 95);
  
  // Minimum garanti de 18
  const finalScore = Math.max(scoreFinal, 18);

  // Sauvegarde du MonthlyScore
  await prisma.monthlyScore.upsert({
    where: {
      userId_mois: {
        userId,
        mois,
      },
    },
    update: {
      scoreC1,
      scoreC2,
      scoreC3,
      scoreC4,
      scoreC5,
      scoreBrut,
      scoreFinal: finalScore,
      calculatedAt: new Date(),
    },
    create: {
      userId,
      mois,
      scoreC1,
      scoreC2,
      scoreC3,
      scoreC4,
      scoreC5,
      scoreBrut,
      scoreFinal: finalScore,
    },
  });

  // Mise à jour des UserMetrics
  await updateUserMetrics(userId);

  return { scoreC1, scoreC2, scoreC3, scoreC4, scoreC5, scoreBrut, scoreFinal: finalScore };
}

// Mise à jour des métriques agrégées de l'utilisateur
async function updateUserMetrics(userId: string) {
  const challenges = await prisma.challenge.findMany({
    where: { userId },
    include: {
      deals: true,
    },
  });

  let totalRevenue = 0;
  let totalDeals = 0;
  let wonDeals = 0;

  for (const challenge of challenges) {
    for (const deal of challenge.deals) {
      totalRevenue += deal.montantCollecte;
      totalDeals++;
      if (deal.montantCollecte > 0) wonDeals++;
    }
  }

  await prisma.userMetrics.upsert({
    where: { userId },
    update: {
      totalRevenue,
      totalDeals,
      wonDeals,
      winRate: totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0,
      monthlyRevenue: totalRevenue, // À affiner par mois
    },
    create: {
      userId,
      totalRevenue,
      totalDeals,
      wonDeals,
      winRate: totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0,
      monthlyRevenue: totalRevenue,
    },
  });
}