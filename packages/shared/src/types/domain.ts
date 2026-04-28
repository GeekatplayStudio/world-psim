export type ActorType =
  | "country"
  | "government"
  | "military"
  | "proxy_group"
  | "region"
  | "international_org"
  | "economic_bloc"
  | "strategic_asset"
  | "non_state_actor"
  | "unknown";

export type RelationshipType =
  | "alliance"
  | "hostility"
  | "active_conflict"
  | "ceasefire"
  | "mediation"
  | "economic_dependency"
  | "military_support"
  | "proxy_influence"
  | "sanctions"
  | "trade"
  | "humanitarian_aid"
  | "territorial_control"
  | "diplomatic_pressure"
  | "nuclear_pressure"
  | "shipping_security"
  | "unknown";

export type RelationshipDirection = "directed" | "bidirectional";

export type MetricSnapshot = {
  actorId: string;
  snapshotDate: string;
  politicalPower: number;
  economicPower: number;
  militaryPower: number;
  diplomaticPower: number;
  softPower: number;
  instability: number;
  compositePower: number;
  confidence: number;
  sourceCount: number;
};

export type GraphNode = {
  id: string;
  label: string;
  actorType: ActorType;
  parentActorId?: string;
  radius: number;
  color: string;
  metrics: MetricSnapshot;
  position?: [number, number, number];
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  relationshipType: RelationshipType;
  direction: RelationshipDirection;
  color: string;
  thickness: number;
  strength: number;
  sentiment: number;
  confidence: number;
  volatility: number;
  isPrediction: boolean;
};

export type HealthResponse = {
  status: "ok";
  service: string;
  time: string;
  version: string;
};

export type CompositePowerInput = Pick<
  MetricSnapshot,
  | "politicalPower"
  | "economicPower"
  | "militaryPower"
  | "diplomaticPower"
  | "softPower"
>;

export type NonStateCompositePowerInput = Pick<
  CompositePowerInput,
  "politicalPower" | "economicPower" | "militaryPower" | "diplomaticPower"
> & {
  territorialInfluence: number;
  externalSupport: number;
};