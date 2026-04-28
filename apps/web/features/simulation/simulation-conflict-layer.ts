import type {
  ConflictTier,
  SimulationRelationship
} from "./simulation-types";

type ConflictDefinition = {
  id: string;
  label: string;
  tier: ConflictTier;
  countryCodes: string[];
};

type ConflictActorReference = {
  id: string;
  label: string;
  countryCode?: string;
};

export type CountryConflictSummary = {
  burden: number;
  normalizedBurden: number;
  conflictCount: number;
  highestTier: ConflictTier | null;
  peaceIndex: number;
};

const conflictTierWeights: Record<ConflictTier, number> = {
  major: 1,
  minor: 0.72,
  conflict: 0.46,
  skirmish: 0.24
};

const conflictTierRank: Record<ConflictTier, number> = {
  major: 4,
  minor: 3,
  conflict: 2,
  skirmish: 1
};

const highConflictColor = "#ff1f4d";
const lowConflictColor = "#14e49d";
const highConflictAccent = "#ffc7d2";
const lowConflictAccent = "#93ffe1";

const emptyConflictSummary: CountryConflictSummary = {
  burden: 0,
  normalizedBurden: 0,
  conflictCount: 0,
  highestTier: null,
  peaceIndex: 1
};

const conflictDefinitions: ConflictDefinition[] = [
  {
    id: "arab-israeli-iran-israel-conflicts",
    label: "Middle East escalation complex",
    tier: "major",
    countryCodes: ["IL", "PS", "LB", "SY", "IR", "JO", "IQ", "SA", "KW", "BH", "QA", "AE", "OM", "YE", "TR", "AZ"]
  },
  {
    id: "myanmar-civil-war",
    label: "Myanmar civil war",
    tier: "major",
    countryCodes: ["MM", "IN", "BD", "TH", "CN"]
  },
  {
    id: "sudanese-civil-wars",
    label: "Sudanese civil wars",
    tier: "major",
    countryCodes: ["SD", "SS", "TD", "CF", "EG", "ET", "LY"]
  },
  {
    id: "congolese-conflicts",
    label: "Congolese conflicts",
    tier: "major",
    countryCodes: ["CD", "CF", "SS", "RW", "BI", "UG"]
  },
  {
    id: "somali-civil-war",
    label: "Somali civil war",
    tier: "major",
    countryCodes: ["SO", "KE"]
  },
  {
    id: "maghreb-sahel-insurgencies",
    label: "Maghreb and Sahel insurgencies",
    tier: "major",
    countryCodes: ["DZ", "BJ", "BF", "CM", "TD", "CI", "LY", "ML", "MR", "MA", "NE", "NG", "TG", "TN"]
  },
  {
    id: "mexican-drug-war",
    label: "Mexican drug war",
    tier: "major",
    countryCodes: ["MX", "BZ", "SV", "HN", "GT", "NI", "US"]
  },
  {
    id: "russo-ukrainian-war",
    label: "Russo-Ukrainian war",
    tier: "major",
    countryCodes: ["UA", "RU", "BY"]
  },
  {
    id: "iran-insurgencies",
    label: "Insurgencies in Iran",
    tier: "minor",
    countryCodes: ["IR", "IQ", "TR"]
  },
  {
    id: "colombian-conflict",
    label: "Colombian conflict",
    tier: "minor",
    countryCodes: ["CO", "VE", "EC"]
  },
  {
    id: "afghan-conflict",
    label: "Afghan conflict",
    tier: "minor",
    countryCodes: ["AF", "PK", "TJ"]
  },
  {
    id: "ecuador-insurgency",
    label: "Insurgency in Ecuador",
    tier: "minor",
    countryCodes: ["EC", "CO"]
  },
  {
    id: "nigeria-civil-conflicts",
    label: "Civil conflicts in Nigeria",
    tier: "minor",
    countryCodes: ["NG", "NE", "CM", "TD"]
  },
  {
    id: "venezuela-conflict",
    label: "Venezuelan conflict",
    tier: "minor",
    countryCodes: ["VE", "CO"]
  },
  {
    id: "yemen-civil-war",
    label: "Yemeni civil war",
    tier: "minor",
    countryCodes: ["YE", "SA", "AE", "IL"]
  },
  {
    id: "syria-conflict",
    label: "Syrian conflict spillovers",
    tier: "minor",
    countryCodes: ["SY", "IL", "LB", "IQ", "TR"]
  },
  {
    id: "cameroon-conflicts",
    label: "Cameroonian conflicts",
    tier: "minor",
    countryCodes: ["CM", "NG", "NE", "TD"]
  },
  {
    id: "car-civil-war",
    label: "Central African Republic civil war",
    tier: "minor",
    countryCodes: ["CF", "CM", "CD", "SS"]
  },
  {
    id: "ethiopia-civil-conflict",
    label: "Ethiopian civil conflict",
    tier: "minor",
    countryCodes: ["ET"]
  },
  {
    id: "haiti-crisis",
    label: "Haitian crisis",
    tier: "minor",
    countryCodes: ["HT"]
  },
  {
    id: "kurdish-nationalist-conflicts",
    label: "Kurdish nationalist conflicts",
    tier: "conflict",
    countryCodes: ["IR", "IQ", "SY", "TR"]
  },
  {
    id: "turkey-insurgencies",
    label: "Insurgencies in Turkey",
    tier: "conflict",
    countryCodes: ["TR", "SY", "IQ"]
  },
  {
    id: "jamaica-political-conflict",
    label: "Jamaican political conflict",
    tier: "conflict",
    countryCodes: ["JM"]
  },
  {
    id: "kashmir-conflict",
    label: "Kashmir conflict",
    tier: "conflict",
    countryCodes: ["IN", "PK", "CN"]
  },
  {
    id: "pakistan-insurgencies",
    label: "Insurgencies in Pakistan",
    tier: "conflict",
    countryCodes: ["PK", "AF", "IN", "IR"]
  },
  {
    id: "india-insurgencies",
    label: "Insurgencies in India",
    tier: "conflict",
    countryCodes: ["IN", "MM", "BT"]
  },
  {
    id: "papua-conflict",
    label: "Papua conflict",
    tier: "conflict",
    countryCodes: ["ID"]
  },
  {
    id: "philippines-conflict",
    label: "Philippine civil conflict",
    tier: "conflict",
    countryCodes: ["PH"]
  },
  {
    id: "cabinda-war",
    label: "Cabinda war",
    tier: "conflict",
    countryCodes: ["AO"]
  },
  {
    id: "png-ethnic-violence",
    label: "Papua New Guinea ethnic violence",
    tier: "conflict",
    countryCodes: ["PG"]
  },
  {
    id: "brazil-drug-war",
    label: "Brazilian drug war",
    tier: "conflict",
    countryCodes: ["BR", "AR", "BO", "CO", "FR", "PE", "PY", "VE"]
  },
  {
    id: "bangladesh-insurgencies",
    label: "Insurgencies in Bangladesh",
    tier: "conflict",
    countryCodes: ["BD", "MM", "IN"]
  },
  {
    id: "iraq-conflict",
    label: "Iraqi conflict",
    tier: "conflict",
    countryCodes: ["IQ"]
  },
  {
    id: "libya-crisis",
    label: "Libyan crisis",
    tier: "conflict",
    countryCodes: ["LY"]
  },
  {
    id: "mozambique-insurgency",
    label: "Insurgency in Cabo Delgado",
    tier: "conflict",
    countryCodes: ["MZ", "TZ"]
  },
  {
    id: "honduras-gang-crackdown",
    label: "Honduran gang crackdown",
    tier: "conflict",
    countryCodes: ["HN"]
  },
  {
    id: "sabah-cross-border",
    label: "Sabah cross-border attacks",
    tier: "skirmish",
    countryCodes: ["MY", "PH"]
  },
  {
    id: "western-sahara-conflict",
    label: "Western Sahara conflict",
    tier: "skirmish",
    countryCodes: ["MA"]
  },
  {
    id: "laos-insurgency",
    label: "Insurgency in Laos",
    tier: "skirmish",
    countryCodes: ["LA"]
  },
  {
    id: "peru-conflict",
    label: "Peruvian conflict",
    tier: "skirmish",
    countryCodes: ["PE"]
  },
  {
    id: "egypt-islamist-insurgency",
    label: "Islamist insurgency in Egypt",
    tier: "skirmish",
    countryCodes: ["EG"]
  },
  {
    id: "casamance-conflict",
    label: "Casamance conflict",
    tier: "skirmish",
    countryCodes: ["SN", "GM"]
  },
  {
    id: "nagorno-karabakh-conflict",
    label: "Nagorno-Karabakh conflict",
    tier: "skirmish",
    countryCodes: ["AM", "AZ"]
  },
  {
    id: "north-caucasus-conflict",
    label: "North Caucasus conflict",
    tier: "skirmish",
    countryCodes: ["RU", "AZ", "GE"]
  },
  {
    id: "thailand-south-insurgency",
    label: "South Thailand insurgency",
    tier: "skirmish",
    countryCodes: ["TH"]
  },
  {
    id: "paraguay-insurgency",
    label: "Insurgency in Paraguay",
    tier: "skirmish",
    countryCodes: ["PY"]
  },
  {
    id: "el-salvador-gang-crackdown",
    label: "Salvadoran gang crackdown",
    tier: "skirmish",
    countryCodes: ["SV"]
  }
];

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function buildPairKey(sourceId: string, targetId: string) {
  return [sourceId, targetId].sort().join(":");
}

function buildHexChannel(start: string, end: string, mix: number) {
  const from = Number.parseInt(start, 16);
  const to = Number.parseInt(end, 16);

  return Math.round(from + (to - from) * mix)
    .toString(16)
    .padStart(2, "0");
}

function mixHex(start: string, end: string, mix: number) {
  const safeMix = clamp01(mix);
  const normalizedStart = start.replace("#", "");
  const normalizedEnd = end.replace("#", "");

  return `#${buildHexChannel(normalizedStart.slice(0, 2), normalizedEnd.slice(0, 2), safeMix)}${buildHexChannel(
    normalizedStart.slice(2, 4),
    normalizedEnd.slice(2, 4),
    safeMix
  )}${buildHexChannel(normalizedStart.slice(4, 6), normalizedEnd.slice(4, 6), safeMix)}`;
}

function getHigherTier(current: ConflictTier | null, next: ConflictTier) {
  if (!current) {
    return next;
  }

  return conflictTierRank[next] > conflictTierRank[current] ? next : current;
}

function buildCountryConflictSummaries() {
  const summaryByCode = new Map<string, { burden: number; conflictCount: number; highestTier: ConflictTier | null }>();

  for (const conflict of conflictDefinitions) {
    const uniqueCountryCodes = [...new Set(conflict.countryCodes)];

    for (const countryCode of uniqueCountryCodes) {
      const current = summaryByCode.get(countryCode) ?? {
        burden: 0,
        conflictCount: 0,
        highestTier: null
      };

      current.burden += conflictTierWeights[conflict.tier];
      current.conflictCount += 1;
      current.highestTier = getHigherTier(current.highestTier, conflict.tier);

      summaryByCode.set(countryCode, current);
    }
  }

  const maxBurden = Math.max(
    0,
    ...Array.from(summaryByCode.values(), (summary) => summary.burden)
  );
  const summaries: Record<string, CountryConflictSummary> = {};

  for (const [countryCode, summary] of summaryByCode.entries()) {
    const normalizedBurden = maxBurden === 0 ? 0 : summary.burden / maxBurden;
    const peaceIndex = clamp01(1 - normalizedBurden * 0.88 - Math.min(summary.conflictCount / 18, 0.12));

    summaries[countryCode] = {
      burden: Number(summary.burden.toFixed(2)),
      normalizedBurden: Number(normalizedBurden.toFixed(3)),
      conflictCount: summary.conflictCount,
      highestTier: summary.highestTier,
      peaceIndex: Number(peaceIndex.toFixed(3))
    };
  }

  return summaries;
}

export const countryConflictSummaries = buildCountryConflictSummaries();

export function getCountryConflictSummary(countryCode?: string) {
  return countryCode ? countryConflictSummaries[countryCode] ?? emptyConflictSummary : emptyConflictSummary;
}

export function getConflictTone(normalizedBurden: number, peaceIndex: number) {
  const peaceMix = clamp01(peaceIndex * 0.75 + (1 - normalizedBurden) * 0.25);

  return {
    color: mixHex(highConflictColor, lowConflictColor, peaceMix),
    accent: mixHex(highConflictAccent, lowConflictAccent, peaceMix)
  };
}

export function buildConflictRelationships(
  actors: ConflictActorReference[],
  existingRelationships: SimulationRelationship[]
): SimulationRelationship[] {
  const actorByCountryCode = Object.fromEntries(
    actors
      .filter((actor) => actor.countryCode)
      .map((actor) => [actor.countryCode, actor])
  ) as Record<string, ConflictActorReference>;
  const blockedPairs = new Set(
    existingRelationships.map((relationship) => buildPairKey(relationship.sourceId, relationship.targetId))
  );
  const drafts = new Map<
    string,
    {
      sourceId: string;
      targetId: string;
      strength: number;
      noteParts: string[];
      sentiment: number;
    }
  >();

  const registerPair = (
    sourceCountryCode: string,
    targetCountryCode: string,
    conflict: ConflictDefinition,
    participantCount: number
  ) => {
    if (sourceCountryCode === targetCountryCode) {
      return;
    }

    const sourceActor = actorByCountryCode[sourceCountryCode];
    const targetActor = actorByCountryCode[targetCountryCode];

    if (!sourceActor || !targetActor) {
      return;
    }

    const pairKey = buildPairKey(sourceActor.id, targetActor.id);

    if (blockedPairs.has(pairKey)) {
      return;
    }

    const sourceSummary = getCountryConflictSummary(sourceCountryCode);
    const targetSummary = getCountryConflictSummary(targetCountryCode);
    const nextStrength = Math.min(
      98,
      Math.round(
        58 +
          conflictTierWeights[conflict.tier] * 24 +
          Math.min(participantCount, 8) * 2 +
          (sourceSummary.normalizedBurden + targetSummary.normalizedBurden) * 8
      )
    );
    const existingDraft = drafts.get(pairKey);

    if (!existingDraft) {
      drafts.set(pairKey, {
        sourceId: sourceActor.id,
        targetId: targetActor.id,
        strength: nextStrength,
        noteParts: [conflict.label],
        sentiment: -Math.min(98, 74 + conflictTierRank[conflict.tier] * 5)
      });

      return;
    }

    existingDraft.strength = Math.max(existingDraft.strength, nextStrength);

    if (!existingDraft.noteParts.includes(conflict.label) && existingDraft.noteParts.length < 3) {
      existingDraft.noteParts.push(conflict.label);
    }
  };

  for (const conflict of conflictDefinitions) {
    const participantCodes = [...new Set(conflict.countryCodes)].filter(
      (countryCode) => Boolean(actorByCountryCode[countryCode])
    );

    if (participantCodes.length < 2) {
      continue;
    }

    const rankedParticipants = [...participantCodes].sort((left, right) => {
      const leftSummary = getCountryConflictSummary(left);
      const rightSummary = getCountryConflictSummary(right);

      return rightSummary.burden - leftSummary.burden;
    });
    const hubCount = conflict.tier === "major" && rankedParticipants.length > 4 ? 2 : 1;
    const hubs = rankedParticipants.slice(0, hubCount);

    const primaryHub = hubs[0];
    const secondaryHub = hubs[1];

    if (primaryHub && secondaryHub) {
      registerPair(primaryHub, secondaryHub, conflict, rankedParticipants.length);
    }

    for (const participantCountryCode of rankedParticipants) {
      if (hubs.includes(participantCountryCode)) {
        continue;
      }

      for (const hubCountryCode of hubs) {
        registerPair(hubCountryCode, participantCountryCode, conflict, rankedParticipants.length);
      }
    }

    const secondParticipant = rankedParticipants[1];

    if (primaryHub && secondParticipant && rankedParticipants.length === 2 && hubs.length === 1) {
      registerPair(primaryHub, secondParticipant, conflict, rankedParticipants.length);
    }
  }

  let relationshipIndex = 0;

  return Array.from(drafts.values(), (draft) => ({
    id: `rel-conflict-generated-${relationshipIndex++}`,
    sourceId: draft.sourceId,
    targetId: draft.targetId,
    relationshipType: "active_conflict" as const,
    strength: draft.strength,
    sentiment: draft.sentiment,
    note: `${draft.noteParts.join("; ")} currently drive the conflict link between ${draft.sourceId} and ${draft.targetId}.`
  }));
}