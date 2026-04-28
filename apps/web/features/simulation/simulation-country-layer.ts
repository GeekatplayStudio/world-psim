import countries, { type Country } from "world-countries";

import type { ActorMetricsView, SimulationActor } from "./simulation-types";

export type CountryLayerSeedActor = Omit<
  SimulationActor,
  | "position"
  | "metrics"
  | "conflictBurden"
  | "conflictNormalized"
  | "conflictCount"
  | "peaceIndex"
  | "highestConflictTier"
> & {
  latitude: number;
  longitude: number;
  altitude?: number;
  metrics: Omit<ActorMetricsView, "compositePower">;
};

const zonePaletteByName: Record<string, { color: string; accent: string }> = {
  "North America": { color: "#7dd3fc", accent: "#d8f4ff" },
  "South America": { color: "#56d893", accent: "#c8ffe0" },
  Europe: { color: "#93bfff", accent: "#eef5ff" },
  "Eastern Europe": { color: "#9ec5ff", accent: "#ebf4ff" },
  Eurasia: { color: "#f59b88", accent: "#ffd8d0" },
  "West Asia": { color: "#ffbc78", accent: "#ffe7c5" },
  Gulf: { color: "#45d1af", accent: "#cbfff1" },
  Levant: { color: "#6ccfff", accent: "#d3f4ff" },
  "North Africa": { color: "#d7c16d", accent: "#fff2be" },
  "Sub-Saharan Africa": { color: "#b6d56d", accent: "#eefac9" },
  "South Asia": { color: "#ffb36f", accent: "#ffe4c4" },
  "East Asia": { color: "#f07c7c", accent: "#ffd9d9" },
  Oceania: { color: "#7ee1c6", accent: "#d9fff1" }
};

const defaultZonePalette = { color: "#93bfff", accent: "#eef5ff" };

const strategicCountryBonuses: Record<string, number> = {
  AR: 8,
  CA: 14,
  CL: 7,
  DE: 18,
  ES: 12,
  FR: 18,
  ID: 14,
  IT: 12,
  KE: 8,
  MX: 12,
  NG: 14,
  NZ: 7,
  PK: 10,
  PL: 10,
  RO: 7,
  SG: 12,
  TH: 8,
  UA: 8,
  AE: 10,
  VN: 8
};

const baseInstabilityByZone: Record<string, number> = {
  "North America": 24,
  "South America": 34,
  Europe: 22,
  "Eastern Europe": 42,
  Eurasia: 36,
  "West Asia": 43,
  Gulf: 34,
  Levant: 55,
  "North Africa": 37,
  "Sub-Saharan Africa": 41,
  "South Asia": 39,
  "East Asia": 28,
  Oceania: 18
};

export const countryByCodeIndex = Object.fromEntries(
  countries.map((country) => [country.cca2, country])
) as Record<string, Country>;

function clamp(min: number, value: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeLongitude(longitude: number) {
  if (longitude > 180) {
    return longitude - 360;
  }

  if (longitude < -180) {
    return longitude + 360;
  }

  return longitude;
}

function getCountryZone(country: Country) {
  if (country.region === "Americas") {
    if (country.subregion === "South America") {
      return "South America";
    }

    return "North America";
  }

  if (country.region === "Europe") {
    return country.subregion === "Eastern Europe" ? "Eastern Europe" : "Europe";
  }

  if (country.region === "Africa") {
    return country.subregion === "Northern Africa" ? "North Africa" : "Sub-Saharan Africa";
  }

  if (country.region === "Asia") {
    if (country.subregion === "Western Asia") {
      return "West Asia";
    }

    if (country.subregion === "Southern Asia") {
      return "South Asia";
    }

    if (country.subregion === "Central Asia") {
      return "Eurasia";
    }

    return "East Asia";
  }

  if (country.region === "Oceania") {
    return "Oceania";
  }

  return country.region || "Europe";
}

function getCountryPalette(country: Country): { color: string; accent: string } {
  return zonePaletteByName[getCountryZone(country)] ?? defaultZonePalette;
}

function getCountryHighlights(country: Country) {
  const capital = country.capital?.[0];
  const capitalLabel = capital ? `Capital ${capital}` : "No listed capital";
  const accessLabel = country.landlocked ? "Landlocked" : "Maritime access";
  const bordersLabel =
    country.borders.length > 0
      ? `${country.borders.length} bordering states`
      : "Island or isolated state";

  return [capitalLabel, accessLabel, bordersLabel];
}

function buildContextMetrics(country: Country): Omit<ActorMetricsView, "compositePower"> {
  const zone = getCountryZone(country);
  const areaScore = clamp(8, Math.log10(Math.max(country.area, 1)) * 13.5, 76);
  const borderScore = clamp(0, country.borders.length * 3.8, 24);
  const strategicBonus = strategicCountryBonuses[country.cca2] ?? 0;
  const political = clamp(22, 24 + areaScore * 0.34 + strategicBonus * 0.9, 74);
  const economic = clamp(
    18,
    22 + areaScore * 0.38 + strategicBonus + (country.landlocked ? -4 : 5),
    78
  );
  const military = clamp(12, 16 + areaScore * 0.24 + borderScore + strategicBonus * 0.65, 72);
  const diplomatic = clamp(
    26,
    28 + (country.unMember ? 14 : 8) + borderScore * 0.6 + strategicBonus * 0.4,
    82
  );
  const soft = clamp(
    18,
    20 + Object.keys(country.languages ?? {}).length * 5 + (country.landlocked ? -2 : 4) + strategicBonus * 0.25,
    68
  );
  const instability = clamp(
    12,
    (baseInstabilityByZone[zone] ?? 30) + (country.landlocked ? 4 : 0) - Math.min(country.borders.length, 3),
    66
  );
  const confidence = clamp(48, 76 - instability * 0.26 + strategicBonus * 0.12, 80);

  return {
    political,
    economic,
    military,
    diplomatic,
    soft,
    instability,
    confidence
  };
}

function getCountryAltitude(country: Country) {
  const zone = getCountryZone(country);
  const maritimeBoost = country.landlocked ? 0 : 0.05;
  const denseZoneBoost =
    zone === "Europe" || zone === "Eastern Europe" || zone === "East Asia" || zone === "Gulf"
      ? 0.08
      : 0;

  return 0.82 + maritimeBoost + denseZoneBoost;
}

function buildCountrySummary(country: Country) {
  const politicalStatus = country.unMember
    ? "UN member state"
    : country.independent
      ? "sovereign state"
      : "territory";
  const geography = country.subregion || country.region || "the global system";

  return `${country.name.common} is a ${politicalStatus} in ${geography}, modeled here as a context node for global coverage.`;
}

function isSovereignCountry(country: Country) {
  return country.status === "officially-assigned" && (country.unMember || country.independent);
}

function buildCountryId(country: Country) {
  return `country-${country.cca3.toLowerCase()}`;
}

export function applyRegionalDeclutter<Actor extends {
  latitude: number;
  longitude: number;
  altitude?: number;
  zone: string;
  detailTier?: "core" | "context";
}>(actors: Actor[]) {
  const buckets = new Map<string, number[]>();

  actors.forEach((actor, index) => {
    const latitudeBucket = Math.round(actor.latitude / 8);
    const longitudeBucket = Math.round(actor.longitude / 10);
    const key = `${actor.zone}:${latitudeBucket}:${longitudeBucket}`;
    const current = buckets.get(key);

    if (current) {
      current.push(index);
      return;
    }

    buckets.set(key, [index]);
  });

  return actors.map((actor, index) => {
    const latitudeBucket = Math.round(actor.latitude / 8);
    const longitudeBucket = Math.round(actor.longitude / 10);
    const key = `${actor.zone}:${latitudeBucket}:${longitudeBucket}`;
    const siblings = buckets.get(key) ?? [index];

    if (siblings.length === 1) {
      return actor;
    }

    const order = siblings.indexOf(index);
    const ring = Math.floor(order / 6) + 1;
    const slot = order % 6;
    const angle = (slot / 6) * Math.PI * 2 + ring * 0.42;
    const spread = actor.detailTier === "context" ? 0.36 : 0.54;
    const latitudeOffset = Math.cos(angle) * ring * spread;
    const longitudeOffset =
      (Math.sin(angle) * ring * spread * 1.7) /
      Math.max(0.28, Math.cos((actor.latitude * Math.PI) / 180));

    return {
      ...actor,
      latitude: clamp(-82, actor.latitude + latitudeOffset, 82),
      longitude: normalizeLongitude(actor.longitude + longitudeOffset),
      altitude: (actor.altitude ?? 0.8) + ring * (actor.detailTier === "context" ? 0.045 : 0.06)
    };
  });
}

export function buildGeneratedCountryActors(existingCountryCodes: Set<string>) {
  const generatedSeeds: CountryLayerSeedActor[] = countries
    .filter(isSovereignCountry)
    .filter((country) => !existingCountryCodes.has(country.cca2))
    .map((country) => {
      const palette = getCountryPalette(country);
      const capital = country.capital?.[0] ?? country.name.common;
      const geography = country.subregion || country.region || "Global";

      return {
        id: buildCountryId(country),
        label: country.name.common,
        actorType: "country",
        countryCode: country.cca2,
        flagEmoji: country.flag,
        detailTier: "context",
        zone: getCountryZone(country),
        latitude: country.latlng[0],
        longitude: country.latlng[1],
        altitude: getCountryAltitude(country),
        color: palette.color,
        accent: palette.accent,
        region: `${capital} / ${geography}`,
        summary: buildCountrySummary(country),
        highlights: getCountryHighlights(country),
        metrics: buildContextMetrics(country),
        briefingSources: []
      };
    });

  return applyRegionalDeclutter(generatedSeeds);
}