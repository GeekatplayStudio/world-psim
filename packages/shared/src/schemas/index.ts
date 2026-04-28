import { z } from "zod";

export const actorTypeSchema = z.enum([
  "country",
  "government",
  "military",
  "proxy_group",
  "region",
  "international_org",
  "economic_bloc",
  "strategic_asset",
  "non_state_actor",
  "unknown"
]);

export const relationshipTypeSchema = z.enum([
  "alliance",
  "hostility",
  "active_conflict",
  "ceasefire",
  "mediation",
  "economic_dependency",
  "military_support",
  "proxy_influence",
  "sanctions",
  "trade",
  "humanitarian_aid",
  "territorial_control",
  "diplomatic_pressure",
  "nuclear_pressure",
  "shipping_security",
  "unknown"
]);

export const metricSnapshotSchema = z.object({
  actorId: z.string().min(1),
  snapshotDate: z.string().min(1),
  politicalPower: z.number().min(0).max(100),
  economicPower: z.number().min(0).max(100),
  militaryPower: z.number().min(0).max(100),
  diplomaticPower: z.number().min(0).max(100),
  softPower: z.number().min(0).max(100),
  instability: z.number().min(0).max(100),
  compositePower: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100),
  sourceCount: z.number().int().min(0)
});

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  service: z.string().min(1),
  time: z.string().datetime(),
  version: z.string().min(1)
});