
> @balancesphere/database@0.1.0 prisma /Users/vchopine/Downloads/weight-system/packages/database
> prisma "migrate" "diff" "--from-empty" "--to-schema-datamodel" "prisma/schema.prisma" "--script"

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ActorType" AS ENUM ('country', 'government', 'military', 'proxy_group', 'region', 'international_org', 'economic_bloc', 'strategic_asset', 'non_state_actor', 'unknown');

-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('alliance', 'hostility', 'active_conflict', 'ceasefire', 'mediation', 'economic_dependency', 'military_support', 'proxy_influence', 'sanctions', 'trade', 'humanitarian_aid', 'territorial_control', 'diplomatic_pressure', 'nuclear_pressure', 'shipping_security', 'unknown');

-- CreateEnum
CREATE TYPE "RelationshipDirection" AS ENUM ('directed', 'bidirectional');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('strike', 'ceasefire_violation', 'speech', 'sanction', 'aid_delivery', 'hostage_release', 'prisoner_release', 'diplomatic_meeting', 'missile_launch', 'border_clash', 'maritime_attack', 'election', 'treaty', 'withdrawal', 'mobilization', 'unknown');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('news_api', 'rss', 'official_statement', 'dataset', 'manual_note', 'scraped_page', 'pdf', 'unknown');

-- CreateEnum
CREATE TYPE "ClaimExtractor" AS ENUM ('human', 'llm', 'rule');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('draft', 'approved', 'rejected', 'needs_review');

-- CreateTable
CREATE TABLE "Actor" (
    "id" TEXT NOT NULL,
    "canonicalName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "actorType" "ActorType" NOT NULL,
    "parentActorId" TEXT,
    "countryCode" TEXT,
    "region" TEXT,
    "description" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Actor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActorAlias" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "language" TEXT,
    "source" TEXT,

    CONSTRAINT "ActorAlias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relationship" (
    "id" TEXT NOT NULL,
    "sourceActorId" TEXT NOT NULL,
    "targetActorId" TEXT NOT NULL,
    "relationshipType" "RelationshipType" NOT NULL,
    "direction" "RelationshipDirection" NOT NULL DEFAULT 'directed',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Relationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelationshipSnapshot" (
    "id" TEXT NOT NULL,
    "relationshipId" TEXT NOT NULL,
    "snapshotDate" TIMESTAMP(3) NOT NULL,
    "strength" INTEGER NOT NULL,
    "sentiment" INTEGER NOT NULL,
    "confidence" INTEGER NOT NULL,
    "volatility" INTEGER NOT NULL,
    "sourceCount" INTEGER NOT NULL DEFAULT 0,
    "visualColor" TEXT NOT NULL,
    "visualThickness" DOUBLE PRECISION NOT NULL,
    "isPrediction" BOOLEAN NOT NULL DEFAULT false,
    "modelRunId" TEXT,
    "notes" TEXT,

    CONSTRAINT "RelationshipSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetricSnapshot" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "snapshotDate" TIMESTAMP(3) NOT NULL,
    "politicalPower" INTEGER NOT NULL,
    "economicPower" INTEGER NOT NULL,
    "militaryPower" INTEGER NOT NULL,
    "diplomaticPower" INTEGER NOT NULL,
    "softPower" INTEGER NOT NULL,
    "instability" INTEGER NOT NULL,
    "compositePower" DOUBLE PRECISION NOT NULL,
    "confidence" INTEGER NOT NULL,
    "sourceCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MetricSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "eventType" "EventType" NOT NULL DEFAULT 'unknown',
    "summary" TEXT NOT NULL,
    "locationName" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "severity" INTEGER NOT NULL,
    "confidence" INTEGER NOT NULL,
    "sourceDocumentIds" TEXT[],
    "actorIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceDocument" (
    "id" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "sourceType" "SourceType" NOT NULL DEFAULT 'unknown',
    "url" TEXT,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "publishedAt" TIMESTAMP(3),
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "language" TEXT,
    "rawText" TEXT NOT NULL,
    "summary" TEXT,
    "reliabilityScore" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "SourceDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" TEXT NOT NULL,
    "sourceDocumentId" TEXT NOT NULL,
    "claimText" TEXT NOT NULL,
    "extractedBy" "ClaimExtractor" NOT NULL,
    "status" "ClaimStatus" NOT NULL DEFAULT 'draft',
    "actorIds" TEXT[],
    "relationshipId" TEXT,
    "eventId" TEXT,
    "proposedMetricChanges" JSONB,
    "confidence" INTEGER NOT NULL,
    "reviewerNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Actor_canonicalName_key" ON "Actor"("canonicalName");

-- CreateIndex
CREATE UNIQUE INDEX "ActorAlias_actorId_alias_key" ON "ActorAlias"("actorId", "alias");

-- CreateIndex
CREATE INDEX "RelationshipSnapshot_relationshipId_snapshotDate_idx" ON "RelationshipSnapshot"("relationshipId", "snapshotDate");

-- CreateIndex
CREATE INDEX "MetricSnapshot_actorId_snapshotDate_idx" ON "MetricSnapshot"("actorId", "snapshotDate");

-- CreateIndex
CREATE UNIQUE INDEX "SourceDocument_hash_key" ON "SourceDocument"("hash");

-- AddForeignKey
ALTER TABLE "Actor" ADD CONSTRAINT "Actor_parentActorId_fkey" FOREIGN KEY ("parentActorId") REFERENCES "Actor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActorAlias" ADD CONSTRAINT "ActorAlias_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_sourceActorId_fkey" FOREIGN KEY ("sourceActorId") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_targetActorId_fkey" FOREIGN KEY ("targetActorId") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationshipSnapshot" ADD CONSTRAINT "RelationshipSnapshot_relationshipId_fkey" FOREIGN KEY ("relationshipId") REFERENCES "Relationship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetricSnapshot" ADD CONSTRAINT "MetricSnapshot_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "SourceDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

