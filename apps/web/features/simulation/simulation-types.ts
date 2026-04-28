import type { ActorType, RelationshipType } from "@balancesphere/shared";

export type BriefingSource = {
  id: string;
  title: string;
  summary: string;
  sourceLabel: string;
  sourceUrl: string;
  publishedAt: string;
};

export type ActorMetricsView = {
  political: number;
  economic: number;
  military: number;
  diplomatic: number;
  soft: number;
  instability: number;
  confidence: number;
  compositePower: number;
};

export type SimulationActor = {
  id: string;
  label: string;
  actorType: ActorType;
  position: [number, number, number];
  zone: string;
  color: string;
  accent: string;
  summary: string;
  region: string;
  highlights: string[];
  metrics: ActorMetricsView;
  briefingSources: BriefingSource[];
};

export type SimulationRelationship = {
  id: string;
  sourceId: string;
  targetId: string;
  relationshipType: RelationshipType;
  strength: number;
  sentiment: number;
  note: string;
};