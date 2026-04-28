import type {
  CompositePowerInput,
  NonStateCompositePowerInput
} from "../types/domain";

const clamp = (value: number) => Math.max(0, Math.min(100, value));

const roundScore = (value: number) => Number(value.toFixed(2));

export function calculateCompositePower(input: CompositePowerInput): number {
  const weightedScore =
    input.politicalPower * 0.2 +
    input.economicPower * 0.25 +
    input.militaryPower * 0.3 +
    input.diplomaticPower * 0.15 +
    input.softPower * 0.1;

  return roundScore(clamp(weightedScore));
}

export function calculateNonStateCompositePower(
  input: NonStateCompositePowerInput
): number {
  const weightedScore =
    input.politicalPower * 0.2 +
    input.economicPower * 0.1 +
    input.militaryPower * 0.35 +
    input.diplomaticPower * 0.1 +
    input.territorialInfluence * 0.15 +
    input.externalSupport * 0.1;

  return roundScore(clamp(weightedScore));
}

export function calculateActorRadius(
  compositePower: number,
  baseRadius = 0.6,
  radiusMultiplier = 0.18
): number {
  const normalizedPower = Math.max(compositePower, 0);

  return roundScore(
    baseRadius + Math.sqrt(normalizedPower) * radiusMultiplier
  );
}