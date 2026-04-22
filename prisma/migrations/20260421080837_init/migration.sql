-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'CLOSER', 'MANAGER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ExperienceClosing" AS ENUM ('MOINS_1_AN', 'UN_AN', 'DEUX_ANS', 'TROIS_ANS_PLUS');

-- CreateEnum
CREATE TYPE "SaleType" AS ENUM ('FULL_PAY', 'SPLIT_PAY');

-- CreateEnum
CREATE TYPE "CloseRound" AS ENUM ('R1', 'R2');

-- CreateEnum
CREATE TYPE "NbMensualites" AS ENUM ('X2', 'X3', 'X4', 'X6', 'X8', 'X10');

-- CreateEnum
CREATE TYPE "ChallengeStatus" AS ENUM ('A_VENIR', 'EN_COURS', 'TERMINE');

-- CreateEnum
CREATE TYPE "DaySentiment" AS ENUM ('HAPPY', 'NEUTRAL', 'FRUSTRATED', 'ON_FIRE', 'TIRED');

-- CreateEnum
CREATE TYPE "ObjectiveType" AS ENUM ('CASH_CONTRACTE', 'TAUX_CLOSING', 'NB_CLOSES', 'TAUX_COLLECTE', 'NB_R1', 'LIBRE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "avatarUrl" TEXT,
    "telephone" TEXT,
    "localisation" TEXT,
    "experience" "ExperienceClosing",
    "role" "Role" NOT NULL DEFAULT 'CLOSER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "publicSlug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Niche" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "createdByUserId" TEXT,

    CONSTRAINT "Niche_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Infopreneur" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "nicheId" TEXT NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Infopreneur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "nomPackage" TEXT NOT NULL,
    "valeur" DOUBLE PRECISION NOT NULL,
    "infopreneurId" TEXT NOT NULL,
    "financementDisponible" BOOLEAN NOT NULL DEFAULT false,
    "optionsFinancement" "NbMensualites"[],
    "fraisFinancement" BOOLEAN NOT NULL DEFAULT false,
    "tauxFrais" DOUBLE PRECISION,
    "montantFraisFixe" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "infopreneurId" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "label" TEXT,
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),
    "statut" "ChallengeStatus" NOT NULL DEFAULT 'A_VENIR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyEntry" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "r1Planifie" INTEGER NOT NULL DEFAULT 0,
    "r1Effectue" INTEGER NOT NULL DEFAULT 0,
    "r2Planifie" INTEGER NOT NULL DEFAULT 0,
    "r2Effectue" INTEGER NOT NULL DEFAULT 0,
    "nbCloses" INTEGER NOT NULL DEFAULT 0,
    "sentiment" "DaySentiment",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT,
    "packageId" TEXT,
    "prenomClient" TEXT,
    "montantContracte" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "montantCollecte" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "typeVente" "SaleType",
    "nbMensualites" "NbMensualites",
    "dateR1" TIMESTAMP(3),
    "dateClose" TIMESTAMP(3),
    "closeEn" "CloseRound",
    "delaiConversion" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Objective" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mois" TEXT,
    "intitule" TEXT,
    "valeurCible" DOUBLE PRECISION,
    "typeObjectif" "ObjectiveType",
    "atteint" BOOLEAN NOT NULL DEFAULT false,
    "dateValidation" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Objective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyScore" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mois" TEXT NOT NULL,
    "scoreC1" DOUBLE PRECISION NOT NULL,
    "scoreC2" DOUBLE PRECISION NOT NULL,
    "scoreC3" DOUBLE PRECISION NOT NULL,
    "scoreC4" DOUBLE PRECISION NOT NULL,
    "scoreC5" DOUBLE PRECISION NOT NULL,
    "scoreBrut" DOUBLE PRECISION NOT NULL,
    "scoreFinal" DOUBLE PRECISION NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MonthlyScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMetrics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "monthlyRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "winRate" DOUBLE PRECISION,
    "totalDeals" INTEGER NOT NULL DEFAULT 0,
    "wonDeals" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_publicSlug_key" ON "User"("publicSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Niche_nom_key" ON "Niche"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Challenge_userId_infopreneurId_numero_key" ON "Challenge"("userId", "infopreneurId", "numero");

-- CreateIndex
CREATE UNIQUE INDEX "DailyEntry_challengeId_date_key" ON "DailyEntry"("challengeId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyScore_userId_mois_key" ON "MonthlyScore"("userId", "mois");

-- CreateIndex
CREATE UNIQUE INDEX "UserMetrics_userId_key" ON "UserMetrics"("userId");

-- AddForeignKey
ALTER TABLE "Niche" ADD CONSTRAINT "Niche_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Infopreneur" ADD CONSTRAINT "Infopreneur_nicheId_fkey" FOREIGN KEY ("nicheId") REFERENCES "Niche"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_infopreneurId_fkey" FOREIGN KEY ("infopreneurId") REFERENCES "Infopreneur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_infopreneurId_fkey" FOREIGN KEY ("infopreneurId") REFERENCES "Infopreneur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyEntry" ADD CONSTRAINT "DailyEntry_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Objective" ADD CONSTRAINT "Objective_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyScore" ADD CONSTRAINT "MonthlyScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMetrics" ADD CONSTRAINT "UserMetrics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
