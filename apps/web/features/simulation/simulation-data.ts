import { calculateActorRadius, calculateCompositePower } from "@balancesphere/shared";

import type {
  ActorMetricsView,
  BriefingSource,
  SimulationActor,
  SimulationRelationship
} from "./simulation-types";

const earthRadius = 7.05;

const relationshipColors: Record<SimulationRelationship["relationshipType"], string> = {
  alliance: "#20d67b",
  hostility: "#ff5a5f",
  active_conflict: "#ff2d55",
  ceasefire: "#7ef5ff",
  mediation: "#ffd166",
  economic_dependency: "#1e88ff",
  military_support: "#ff9f1c",
  proxy_influence: "#bf5fff",
  sanctions: "#ff6b00",
  trade: "#00b4d8",
  humanitarian_aid: "#ffffff",
  territorial_control: "#b08968",
  diplomatic_pressure: "#ffd166",
  nuclear_pressure: "#00f5d4",
  shipping_security: "#48cae4",
  unknown: "#777777"
};

type SeedActor = Omit<SimulationActor, "position" | "metrics"> & {
  latitude: number;
  longitude: number;
  altitude?: number;
  metrics: Omit<ActorMetricsView, "compositePower">;
};

function makeMetrics(input: Omit<ActorMetricsView, "compositePower">): ActorMetricsView {
  return {
    ...input,
    compositePower: calculateCompositePower({
      politicalPower: input.political,
      economicPower: input.economic,
      militaryPower: input.military,
      diplomaticPower: input.diplomatic,
      softPower: input.soft
    })
  };
}

function makeSource(
  id: string,
  title: string,
  summary: string,
  sourceLabel: string,
  sourceUrl: string,
  publishedAt: string
): BriefingSource {
  return {
    id,
    title,
    summary,
    sourceLabel,
    sourceUrl,
    publishedAt
  };
}

function globePosition(
  latitude: number,
  longitude: number,
  altitude = 0.55
): [number, number, number] {
  const phi = ((90 - latitude) * Math.PI) / 180;
  const theta = ((longitude + 180) * Math.PI) / 180;
  const radius = earthRadius + altitude;

  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  ];
}

function makeActor({ latitude, longitude, altitude, metrics, ...actor }: SeedActor): SimulationActor {
  return {
    ...actor,
    position: globePosition(latitude, longitude, altitude),
    metrics: makeMetrics(metrics)
  };
}

export const simulationActors: SimulationActor[] = [
  makeActor({
    id: "united-states",
    label: "United States",
    actorType: "country",
    zone: "North America",
    latitude: 38,
    longitude: -97,
    altitude: 0.85,
    color: "#83d8ff",
    accent: "#d6f4ff",
    region: "Washington / Atlantic and Pacific command",
    summary:
      "Global balancing power spanning NATO, the Indo-Pacific, and multiple Middle Eastern escalation lanes.",
    highlights: ["Alliance coordinator", "Maritime reach", "Sanctions leverage"],
    metrics: {
      political: 84,
      economic: 92,
      military: 95,
      diplomatic: 89,
      soft: 72,
      instability: 24,
      confidence: 84
    },
    briefingSources: [
      makeSource(
        "us-1",
        "Alliance signaling remains the backbone of simultaneous Europe and Indo-Pacific messaging",
        "Washington continues to sequence military posture, export controls, and diplomacy across several theaters at once.",
        "White House Briefing Room",
        "https://www.whitehouse.gov/briefing-room/",
        "2026-04-28T09:05:00Z"
      )
    ]
  }),
  makeActor({
    id: "brazil",
    label: "Brazil",
    actorType: "country",
    zone: "South America",
    latitude: -14,
    longitude: -51,
    altitude: 0.4,
    color: "#54d68f",
    accent: "#bbffd7",
    region: "Brasilia / South Atlantic",
    summary:
      "Large southern-hemisphere democracy increasingly relevant in commodity corridors, climate diplomacy, and BRICS alignment debates.",
    highlights: ["Commodity leverage", "BRICS voice", "Low direct conflict exposure"],
    metrics: {
      political: 61,
      economic: 72,
      military: 38,
      diplomatic: 67,
      soft: 60,
      instability: 29,
      confidence: 74
    },
    briefingSources: [
      makeSource(
        "brazil-1",
        "Brasilia remains active in food security and South Atlantic trade discussions",
        "Brazilian diplomacy stays focused on multipolar bargaining rather than direct military confrontation.",
        "Reuters Latin America",
        "https://www.reuters.com/world/americas/",
        "2026-04-27T14:20:00Z"
      )
    ]
  }),
  makeActor({
    id: "united-kingdom",
    label: "United Kingdom",
    actorType: "country",
    zone: "Europe",
    latitude: 55,
    longitude: -3,
    altitude: 0.65,
    color: "#9dc7ff",
    accent: "#eef6ff",
    region: "London / North Atlantic",
    summary:
      "Atlantic security actor combining intelligence reach, naval posture, and sanctions support within the wider Western coalition.",
    highlights: ["Intelligence reach", "NATO operations", "Sanctions coordination"],
    metrics: {
      political: 74,
      economic: 79,
      military: 69,
      diplomatic: 81,
      soft: 64,
      instability: 24,
      confidence: 80
    },
    briefingSources: [
      makeSource(
        "uk-1",
        "London continues to pair sanctions policy with expeditionary reassurance messaging",
        "British planning remains concentrated on support packages, alliance credibility, and maritime security.",
        "UK Foreign Office",
        "https://www.gov.uk/government/organisations/foreign-commonwealth-development-office",
        "2026-04-27T08:10:00Z"
      )
    ]
  }),
  makeActor({
    id: "european-union",
    label: "European Union",
    actorType: "economic_bloc",
    zone: "Europe",
    latitude: 50,
    longitude: 10,
    altitude: 0.95,
    color: "#7dd3fc",
    accent: "#d8f4ff",
    region: "Brussels / European Union",
    summary:
      "Regulatory and economic power center shaping sanctions, reconstruction funding, and political consensus across Europe.",
    highlights: ["Regulatory scale", "Sanctions engine", "Reconstruction funding"],
    metrics: {
      political: 78,
      economic: 88,
      military: 42,
      diplomatic: 86,
      soft: 76,
      instability: 28,
      confidence: 83
    },
    briefingSources: [
      makeSource(
        "eu-1",
        "EU institutions keep pairing deterrence spending with energy and industrial resilience",
        "The bloc remains most influential through funding, regulation, and sanctions packaging rather than unified military command.",
        "Council of the European Union",
        "https://www.consilium.europa.eu/",
        "2026-04-28T06:40:00Z"
      )
    ]
  }),
  makeActor({
    id: "ukraine",
    label: "Ukraine",
    actorType: "country",
    zone: "Eastern Europe",
    latitude: 49,
    longitude: 32,
    altitude: 0.5,
    color: "#ffd166",
    accent: "#fff0b6",
    region: "Kyiv / Eastern front",
    summary:
      "Frontline state whose resilience, air-defense needs, and mobilization tempo remain central to European security calculations.",
    highlights: ["Frontline defense", "Air-defense dependency", "High attrition environment"],
    metrics: {
      political: 68,
      economic: 41,
      military: 82,
      diplomatic: 73,
      soft: 49,
      instability: 76,
      confidence: 78
    },
    briefingSources: [
      makeSource(
        "ukraine-1",
        "Kyiv continues to prioritize ammunition, air defense, and infrastructure protection",
        "The operational picture remains dominated by force regeneration and the timing of external support flows.",
        "Reuters Europe",
        "https://www.reuters.com/world/europe/",
        "2026-04-28T07:50:00Z"
      )
    ]
  }),
  makeActor({
    id: "russia",
    label: "Russia",
    actorType: "country",
    zone: "Eurasia",
    latitude: 60,
    longitude: 90,
    altitude: 0.75,
    color: "#ff8b7c",
    accent: "#ffd0c8",
    region: "Moscow / Eurasian theater",
    summary:
      "Revisionist military power applying massed fires, energy leverage, and diplomatic spoiler tactics across the Euro-Atlantic system.",
    highlights: ["Sustained war economy", "Strategic coercion", "Energy leverage"],
    metrics: {
      political: 77,
      economic: 64,
      military: 87,
      diplomatic: 58,
      soft: 42,
      instability: 63,
      confidence: 77
    },
    briefingSources: [
      makeSource(
        "russia-1",
        "Moscow keeps military pressure and bargaining signals tightly linked",
        "State messaging continues to blur battlefield aims with wider deterrence narratives toward Europe and Washington.",
        "Reuters Europe",
        "https://www.reuters.com/world/europe/",
        "2026-04-27T19:35:00Z"
      )
    ]
  }),
  makeActor({
    id: "turkey",
    label: "Turkey",
    actorType: "country",
    zone: "West Asia",
    latitude: 39,
    longitude: 35,
    altitude: 0.55,
    color: "#ffb26b",
    accent: "#ffe0b5",
    region: "Ankara / Black Sea hinge",
    summary:
      "NATO member and regional broker balancing Black Sea access, drone production, and tactical dialogue with multiple rivals.",
    highlights: ["Black Sea hinge", "Broker role", "Defense industry growth"],
    metrics: {
      political: 69,
      economic: 67,
      military: 74,
      diplomatic: 72,
      soft: 48,
      instability: 42,
      confidence: 74
    },
    briefingSources: [
      makeSource(
        "turkey-1",
        "Ankara remains active wherever security bargaining meets shipping access",
        "Turkey keeps leveraging geography and defense exports to stay central in several adjacent theaters.",
        "Reuters World",
        "https://www.reuters.com/world/",
        "2026-04-27T12:55:00Z"
      )
    ]
  }),
  makeActor({
    id: "egypt",
    label: "Egypt",
    actorType: "country",
    zone: "North Africa",
    latitude: 26,
    longitude: 30,
    altitude: 0.45,
    color: "#d9c274",
    accent: "#fff1ba",
    region: "Cairo / Rafah corridor",
    summary:
      "Border-control and mediation actor shaping access corridors, deconfliction sequencing, and humanitarian throughput.",
    highlights: ["Border gateway", "Ceasefire broker", "Aid corridor control"],
    metrics: {
      political: 63,
      economic: 57,
      military: 64,
      diplomatic: 66,
      soft: 39,
      instability: 36,
      confidence: 74
    },
    briefingSources: [
      makeSource(
        "egypt-1",
        "Rafah access remains one of the most consequential chokepoints in the region",
        "Cairo continues to shape both negotiation pacing and humanitarian logistics.",
        "UN News",
        "https://news.un.org/en/tags/gaza",
        "2026-04-28T05:25:00Z"
      )
    ]
  }),
  makeActor({
    id: "qatar",
    label: "Qatar",
    actorType: "country",
    zone: "Gulf",
    latitude: 25,
    longitude: 51,
    altitude: 0.45,
    color: "#50e3d6",
    accent: "#c4fff7",
    region: "Doha / Gulf mediation channel",
    summary:
      "Negotiation-focused node with outsized relevance in hostage, ceasefire, and humanitarian-channel diplomacy.",
    highlights: ["Mediation leverage", "Hostage channel", "Back-channel access"],
    metrics: {
      political: 58,
      economic: 69,
      military: 28,
      diplomatic: 76,
      soft: 48,
      instability: 22,
      confidence: 72
    },
    briefingSources: [
      makeSource(
        "qatar-1",
        "Doha remains a preferred venue for indirect bargaining",
        "Qatari diplomacy still appears wherever ceasefire sequencing intersects with hostage talks and aid entry.",
        "Qatar Ministry of Foreign Affairs",
        "https://www.mofa.gov.qa/en",
        "2026-04-27T11:20:00Z"
      )
    ]
  }),
  makeActor({
    id: "saudi-arabia",
    label: "Saudi Arabia",
    actorType: "country",
    zone: "Gulf",
    latitude: 24,
    longitude: 45,
    altitude: 0.6,
    color: "#35d0a5",
    accent: "#c7fff0",
    region: "Riyadh / Energy and Gulf security",
    summary:
      "Energy heavyweight and regional balancer calibrating oil leverage, security alignment, and long-range industrial strategy.",
    highlights: ["Energy pricing power", "Regional balancing", "Capital deployment"],
    metrics: {
      political: 71,
      economic: 82,
      military: 74,
      diplomatic: 68,
      soft: 47,
      instability: 31,
      confidence: 75
    },
    briefingSources: [
      makeSource(
        "saudi-1",
        "Riyadh continues to balance energy diplomacy with strategic diversification",
        "Saudi positioning remains central to oil narratives, Gulf de-escalation, and long-horizon investment flows.",
        "Saudi Press Agency",
        "https://www.spa.gov.sa/en",
        "2026-04-27T15:10:00Z"
      )
    ]
  }),
  makeActor({
    id: "israel",
    label: "Israel",
    actorType: "country",
    zone: "Levant",
    latitude: 31,
    longitude: 35,
    altitude: 0.75,
    color: "#66d9ff",
    accent: "#bfeeff",
    region: "Eastern Mediterranean",
    summary:
      "High-readiness military actor managing the densest set of escalation pathways in the current Middle Eastern network.",
    highlights: ["Air-defense posture", "Multiple-front deterrence", "High operational tempo"],
    metrics: {
      political: 76,
      economic: 71,
      military: 88,
      diplomatic: 67,
      soft: 46,
      instability: 58,
      confidence: 77
    },
    briefingSources: [
      makeSource(
        "israel-1",
        "Northern exchanges and Gaza operations remain tightly coupled in Israeli planning",
        "The dominant question remains how long Israel can manage several pressure fronts without wider spillover.",
        "Reuters Middle East",
        "https://www.reuters.com/world/middle-east/",
        "2026-04-28T08:15:00Z"
      )
    ]
  }),
  makeActor({
    id: "hamas",
    label: "Hamas",
    actorType: "proxy_group",
    zone: "Levant",
    latitude: 31.4,
    longitude: 34.4,
    altitude: 0.2,
    color: "#f95e9b",
    accent: "#ffbfd7",
    region: "Gaza Strip",
    summary:
      "Embedded conflict actor at the center of the most intense active-conflict edge in the current network.",
    highlights: ["Primary conflict node", "High information fog", "Civilian-risk multiplier"],
    metrics: {
      political: 39,
      economic: 14,
      military: 61,
      diplomatic: 18,
      soft: 11,
      instability: 88,
      confidence: 58
    },
    briefingSources: [
      makeSource(
        "hamas-1",
        "Conflict reporting remains centered on access, strikes, and negotiation pressure",
        "Hostage diplomacy and aid entry still shape the informational picture as much as tactical events do.",
        "UN OCHA",
        "https://www.ochaopt.org/",
        "2026-04-27T16:00:00Z"
      )
    ]
  }),
  makeActor({
    id: "hezbollah",
    label: "Hezbollah",
    actorType: "proxy_group",
    zone: "Levant",
    latitude: 33.8,
    longitude: 35.5,
    altitude: 0.25,
    color: "#d57cff",
    accent: "#f0bcff",
    region: "Southern Lebanon",
    summary:
      "Non-state actor whose border-fire patterns can rapidly widen the regional escalation envelope.",
    highlights: ["Border volatility", "Proxy-linked deterrence", "Dense proximity risk"],
    metrics: {
      political: 45,
      economic: 23,
      military: 71,
      diplomatic: 29,
      soft: 18,
      instability: 81,
      confidence: 64
    },
    briefingSources: [
      makeSource(
        "hezbollah-1",
        "The Lebanese front remains one of the fastest routes from local exchange to regional escalation",
        "Analysts continue to watch the northern front because small incidents there can force strategic responses.",
        "Crisis Group",
        "https://www.crisisgroup.org/middle-east-north-africa/east-mediterranean-mena/lebanon",
        "2026-04-27T07:20:00Z"
      )
    ]
  }),
  makeActor({
    id: "iran",
    label: "Iran",
    actorType: "country",
    zone: "Gulf",
    latitude: 32,
    longitude: 53,
    altitude: 0.75,
    color: "#ff9070",
    accent: "#ffc9ba",
    region: "Persian Gulf",
    summary:
      "Regional power node projecting influence through state signaling, maritime pressure, and linked proxy networks.",
    highlights: ["Proxy leverage", "Maritime signaling", "Sanctions friction"],
    metrics: {
      political: 73,
      economic: 54,
      military: 79,
      diplomatic: 63,
      soft: 44,
      instability: 49,
      confidence: 73
    },
    briefingSources: [
      makeSource(
        "iran-1",
        "Tehran keeps combining regional network pressure with bargaining through deterrence language",
        "The posture remains hybrid: direct state signaling layered over indirect leverage channels.",
        "Reuters Middle East",
        "https://www.reuters.com/world/middle-east/",
        "2026-04-27T12:10:00Z"
      )
    ]
  }),
  makeActor({
    id: "houthis",
    label: "Houthis",
    actorType: "non_state_actor",
    zone: "Red Sea",
    latitude: 15.5,
    longitude: 44.2,
    altitude: 0.25,
    color: "#ff6b6b",
    accent: "#ffd1d1",
    region: "Yemen / Red Sea corridor",
    summary:
      "Non-state actor capable of turning shipping disruption into strategic-level pressure on a global trade artery.",
    highlights: ["Shipping disruption", "Missile risk", "Proxy alignment"],
    metrics: {
      political: 28,
      economic: 12,
      military: 49,
      diplomatic: 14,
      soft: 9,
      instability: 83,
      confidence: 52
    },
    briefingSources: [
      makeSource(
        "houthis-1",
        "Red Sea incidents continue to force disproportionate naval and insurance responses",
        "The actor matters because limited strikes can still distort commercial routing and threat perception.",
        "UK Maritime Trade Operations",
        "https://www.ukmto.org/",
        "2026-04-28T04:45:00Z"
      )
    ]
  }),
  makeActor({
    id: "india",
    label: "India",
    actorType: "country",
    zone: "South Asia",
    latitude: 21,
    longitude: 78,
    altitude: 0.7,
    color: "#ffb566",
    accent: "#ffe0b3",
    region: "New Delhi / Indian Ocean arc",
    summary:
      "Rising major power balancing continental risk, maritime expansion, and technology-driven state capacity.",
    highlights: ["Scale advantage", "Indian Ocean reach", "Strategic autonomy"],
    metrics: {
      political: 74,
      economic: 81,
      military: 72,
      diplomatic: 71,
      soft: 57,
      instability: 33,
      confidence: 76
    },
    briefingSources: [
      makeSource(
        "india-1",
        "New Delhi continues to blend industrial policy with regional hard-power signaling",
        "India is increasingly relevant because economic scale and security posture are rising together.",
        "Ministry of External Affairs, India",
        "https://www.mea.gov.in/",
        "2026-04-27T13:35:00Z"
      )
    ]
  }),
  makeActor({
    id: "china",
    label: "China",
    actorType: "country",
    zone: "East Asia",
    latitude: 35,
    longitude: 103,
    altitude: 0.85,
    color: "#f97373",
    accent: "#ffd7d7",
    region: "Beijing / Western Pacific",
    summary:
      "System-shaping peer power integrating industrial scale, military modernization, and coercive regional signaling.",
    highlights: ["Industrial depth", "Pacific pressure", "Technology leverage"],
    metrics: {
      political: 83,
      economic: 91,
      military: 82,
      diplomatic: 75,
      soft: 59,
      instability: 35,
      confidence: 78
    },
    briefingSources: [
      makeSource(
        "china-1",
        "Beijing keeps industrial, military, and diplomatic pressure tightly synchronized",
        "The China node matters because trade dependency and security competition are now inseparable in the wider system.",
        "Reuters Asia Pacific",
        "https://www.reuters.com/world/asia-pacific/",
        "2026-04-28T03:55:00Z"
      )
    ]
  }),
  makeActor({
    id: "taiwan",
    label: "Taiwan",
    actorType: "region",
    zone: "East Asia",
    latitude: 23.7,
    longitude: 121,
    altitude: 0.35,
    color: "#6ce5ff",
    accent: "#d7fbff",
    region: "Taipei / First island chain",
    summary:
      "Semiconductor-critical island under sustained coercive pressure and at the center of Indo-Pacific contingency planning.",
    highlights: ["Chip supply concentration", "Coercive pressure", "Maritime chokepoint relevance"],
    metrics: {
      political: 52,
      economic: 78,
      military: 38,
      diplomatic: 69,
      soft: 61,
      instability: 47,
      confidence: 72
    },
    briefingSources: [
      makeSource(
        "taiwan-1",
        "Taiwan remains central to deterrence calculations and technology supply-chain resilience",
        "The island sits at the junction of military signaling and economic vulnerability.",
        "Taiwan Ministry of Foreign Affairs",
        "https://en.mofa.gov.tw/",
        "2026-04-27T09:40:00Z"
      )
    ]
  }),
  makeActor({
    id: "japan",
    label: "Japan",
    actorType: "country",
    zone: "East Asia",
    latitude: 36,
    longitude: 138,
    altitude: 0.65,
    color: "#9ee7ff",
    accent: "#effcff",
    region: "Tokyo / Northwest Pacific",
    summary:
      "Maritime and industrial power accelerating defense normalization while preserving alliance-led deterrence architecture.",
    highlights: ["Maritime defense", "Technology capacity", "Alliance anchoring"],
    metrics: {
      political: 72,
      economic: 84,
      military: 54,
      diplomatic: 78,
      soft: 73,
      instability: 19,
      confidence: 82
    },
    briefingSources: [
      makeSource(
        "japan-1",
        "Tokyo continues to merge deterrence planning with supply-chain resilience",
        "Japanese policy remains geared toward hardening the alliance network without triggering uncontrolled escalation.",
        "Japan Ministry of Foreign Affairs",
        "https://www.mofa.go.jp/",
        "2026-04-27T10:35:00Z"
      )
    ]
  }),
  makeActor({
    id: "south-korea",
    label: "South Korea",
    actorType: "country",
    zone: "East Asia",
    latitude: 36,
    longitude: 128,
    altitude: 0.55,
    color: "#5cb8ff",
    accent: "#ccecff",
    region: "Seoul / Korean Peninsula",
    summary:
      "Advanced industrial and military actor whose deterrence posture is tightly coupled to alliance credibility and missile defense.",
    highlights: ["Missile defense", "Alliance dependence", "Industrial power"],
    metrics: {
      political: 68,
      economic: 82,
      military: 61,
      diplomatic: 74,
      soft: 65,
      instability: 21,
      confidence: 79
    },
    briefingSources: [
      makeSource(
        "rok-1",
        "Seoul continues to tie economic resilience to hard-power preparedness",
        "The peninsula remains one of the clearest examples of industrial depth under persistent military pressure.",
        "South Korea Ministry of Foreign Affairs",
        "https://www.mofa.go.kr/eng/index.do",
        "2026-04-27T06:10:00Z"
      )
    ]
  }),
  makeActor({
    id: "australia",
    label: "Australia",
    actorType: "country",
    zone: "Oceania",
    latitude: -25,
    longitude: 133,
    altitude: 0.55,
    color: "#7be0c3",
    accent: "#d6fff0",
    region: "Canberra / Indo-Pacific south",
    summary:
      "Alliance-aligned Indo-Pacific actor focused on maritime denial, technology sharing, and expeditionary integration.",
    highlights: ["AUKUS alignment", "Maritime posture", "Technology sharing"],
    metrics: {
      political: 63,
      economic: 79,
      military: 52,
      diplomatic: 72,
      soft: 68,
      instability: 17,
      confidence: 80
    },
    briefingSources: [
      makeSource(
        "australia-1",
        "Canberra keeps deepening alliance integration as Indo-Pacific risk rises",
        "Australian policy continues to emphasize deterrence through interoperability and industrial modernization.",
        "Australian Department of Foreign Affairs and Trade",
        "https://www.dfat.gov.au/",
        "2026-04-27T22:15:00Z"
      )
    ]
  }),
  makeActor({
    id: "south-africa",
    label: "South Africa",
    actorType: "country",
    zone: "Sub-Saharan Africa",
    latitude: -30,
    longitude: 24,
    altitude: 0.35,
    color: "#b7d36b",
    accent: "#eff8c7",
    region: "Pretoria / Southern Africa",
    summary:
      "Regional diplomatic actor whose value lies more in coalition politics, commodity lanes, and Global South positioning than hard power.",
    highlights: ["Global South voice", "Mineral relevance", "Coalition diplomacy"],
    metrics: {
      political: 55,
      economic: 58,
      military: 34,
      diplomatic: 61,
      soft: 49,
      instability: 37,
      confidence: 68
    },
    briefingSources: [
      makeSource(
        "south-africa-1",
        "Pretoria remains important where trade corridors meet coalition politics",
        "South Africa continues to matter as a diplomatic bridge between advanced and emerging power groupings.",
        "Reuters Africa",
        "https://www.reuters.com/world/africa/",
        "2026-04-27T12:05:00Z"
      )
    ]
  }),
  makeActor({
    id: "united-nations",
    label: "United Nations",
    actorType: "international_org",
    zone: "International",
    latitude: 40.7,
    longitude: -74,
    altitude: 1.05,
    color: "#ffffff",
    accent: "#c7e7ff",
    region: "New York / International system",
    summary:
      "Monitoring and humanitarian coordination node with strong influence over legitimacy, access, and civilian-risk narratives.",
    highlights: ["Aid legitimacy", "Monitoring role", "Civilian impact reporting"],
    metrics: {
      political: 52,
      economic: 34,
      military: 8,
      diplomatic: 82,
      soft: 79,
      instability: 18,
      confidence: 80
    },
    briefingSources: [
      makeSource(
        "un-1",
        "UN reporting remains a primary evidence layer for humanitarian and civilian-risk conditions",
        "Its influence is less coercive than legitimizing: the UN still shapes how the world names and tracks crisis severity.",
        "UN News",
        "https://news.un.org/en/",
        "2026-04-28T02:30:00Z"
      )
    ]
  })
];

export const actorIndex = Object.fromEntries(
  simulationActors.map((actor) => [actor.id, actor])
) as Record<string, SimulationActor>;

export const simulationRelationships: SimulationRelationship[] = [
  {
    id: "rel-us-eu",
    sourceId: "united-states",
    targetId: "european-union",
    relationshipType: "alliance",
    strength: 86,
    sentiment: 72,
    note: "The Western coalition still relies on transatlantic economic and security synchronization."
  },
  {
    id: "rel-us-uk",
    sourceId: "united-states",
    targetId: "united-kingdom",
    relationshipType: "alliance",
    strength: 84,
    sentiment: 76,
    note: "Intelligence and defense integration remain among the densest links in the graph."
  },
  {
    id: "rel-us-israel",
    sourceId: "united-states",
    targetId: "israel",
    relationshipType: "alliance",
    strength: 88,
    sentiment: 79,
    note: "High-end defense support and diplomatic backing continue despite escalation-management friction."
  },
  {
    id: "rel-us-ukraine",
    sourceId: "united-states",
    targetId: "ukraine",
    relationshipType: "military_support",
    strength: 82,
    sentiment: 68,
    note: "US support remains decisive for air defense, fires, and operational sustainment."
  },
  {
    id: "rel-eu-ukraine",
    sourceId: "european-union",
    targetId: "ukraine",
    relationshipType: "military_support",
    strength: 74,
    sentiment: 61,
    note: "European funding and materiel remain critical to long-duration resilience."
  },
  {
    id: "rel-russia-ukraine",
    sourceId: "russia",
    targetId: "ukraine",
    relationshipType: "active_conflict",
    strength: 96,
    sentiment: -98,
    note: "The largest sustained interstate war in the current world graph."
  },
  {
    id: "rel-eu-russia",
    sourceId: "european-union",
    targetId: "russia",
    relationshipType: "sanctions",
    strength: 78,
    sentiment: -76,
    note: "Sanctions and energy decoupling continue to structure the Europe-Russia edge."
  },
  {
    id: "rel-us-russia",
    sourceId: "united-states",
    targetId: "russia",
    relationshipType: "hostility",
    strength: 76,
    sentiment: -82,
    note: "Strategic rivalry remains defined by deterrence, sanctions, and proxy pressure."
  },
  {
    id: "rel-turkey-russia",
    sourceId: "turkey",
    targetId: "russia",
    relationshipType: "mediation",
    strength: 54,
    sentiment: 8,
    note: "Ankara stays on the negotiation seam between confrontation and practical access management."
  },
  {
    id: "rel-israel-hamas",
    sourceId: "israel",
    targetId: "hamas",
    relationshipType: "active_conflict",
    strength: 95,
    sentiment: -97,
    note: "Primary active-conflict edge centered on Gaza operations, hostages, and humanitarian access."
  },
  {
    id: "rel-israel-hezbollah",
    sourceId: "israel",
    targetId: "hezbollah",
    relationshipType: "active_conflict",
    strength: 83,
    sentiment: -92,
    note: "Northern exchange fire remains one of the fastest routes to wider regional spillover."
  },
  {
    id: "rel-iran-hezbollah",
    sourceId: "iran",
    targetId: "hezbollah",
    relationshipType: "proxy_influence",
    strength: 82,
    sentiment: 45,
    note: "The networked deterrence relationship is central to Levant escalation math."
  },
  {
    id: "rel-iran-hamas",
    sourceId: "iran",
    targetId: "hamas",
    relationshipType: "military_support",
    strength: 63,
    sentiment: 28,
    note: "Indirect support narratives continue to shape external threat perception."
  },
  {
    id: "rel-israel-iran",
    sourceId: "israel",
    targetId: "iran",
    relationshipType: "hostility",
    strength: 81,
    sentiment: -78,
    note: "This is the spine of the broader regional escalation architecture."
  },
  {
    id: "rel-qatar-hamas",
    sourceId: "qatar",
    targetId: "hamas",
    relationshipType: "mediation",
    strength: 58,
    sentiment: 13,
    note: "Doha remains a key indirect bridge in ceasefire and hostage sequencing."
  },
  {
    id: "rel-egypt-hamas",
    sourceId: "egypt",
    targetId: "hamas",
    relationshipType: "mediation",
    strength: 56,
    sentiment: 8,
    note: "Border management and access decisions keep Cairo embedded in every negotiation round."
  },
  {
    id: "rel-saudi-iran",
    sourceId: "saudi-arabia",
    targetId: "iran",
    relationshipType: "diplomatic_pressure",
    strength: 49,
    sentiment: -11,
    note: "De-escalation efforts coexist with persistent rivalry across Gulf security questions."
  },
  {
    id: "rel-us-houthis",
    sourceId: "united-states",
    targetId: "houthis",
    relationshipType: "active_conflict",
    strength: 72,
    sentiment: -86,
    note: "Red Sea strikes and interception cycles turn a local actor into a global trade risk."
  },
  {
    id: "rel-un-hamas",
    sourceId: "united-nations",
    targetId: "hamas",
    relationshipType: "humanitarian_aid",
    strength: 46,
    sentiment: 18,
    note: "Aid logistics and civilian-risk reporting keep this edge active despite limited coercive power."
  },
  {
    id: "rel-un-israel",
    sourceId: "united-nations",
    targetId: "israel",
    relationshipType: "diplomatic_pressure",
    strength: 53,
    sentiment: -16,
    note: "Humanitarian reporting and legality debates continue to shape external pressure."
  },
  {
    id: "rel-china-taiwan",
    sourceId: "china",
    targetId: "taiwan",
    relationshipType: "diplomatic_pressure",
    strength: 79,
    sentiment: -74,
    note: "The Taiwan edge remains one of the clearest coercion-without-war lines in the graph."
  },
  {
    id: "rel-china-us",
    sourceId: "china",
    targetId: "united-states",
    relationshipType: "economic_dependency",
    strength: 77,
    sentiment: -12,
    note: "Strategic rivalry is constrained and complicated by deep trade and technology interdependence."
  },
  {
    id: "rel-china-russia",
    sourceId: "china",
    targetId: "russia",
    relationshipType: "trade",
    strength: 68,
    sentiment: 26,
    note: "Trade and diplomatic cover make this a stabilizing edge for Moscow's wider position."
  },
  {
    id: "rel-india-china",
    sourceId: "india",
    targetId: "china",
    relationshipType: "hostility",
    strength: 58,
    sentiment: -44,
    note: "Border friction and industrial competition keep the South Asia-East Asia seam tense."
  },
  {
    id: "rel-japan-us",
    sourceId: "japan",
    targetId: "united-states",
    relationshipType: "alliance",
    strength: 83,
    sentiment: 74,
    note: "Pacific deterrence still depends on this alliance anchor."
  },
  {
    id: "rel-rok-us",
    sourceId: "south-korea",
    targetId: "united-states",
    relationshipType: "alliance",
    strength: 81,
    sentiment: 73,
    note: "Missile defense, exercises, and technology security keep this edge dense."
  },
  {
    id: "rel-australia-us",
    sourceId: "australia",
    targetId: "united-states",
    relationshipType: "alliance",
    strength: 74,
    sentiment: 69,
    note: "Canberra is increasingly integrated into Indo-Pacific denial and technology planning."
  },
  {
    id: "rel-south-africa-china",
    sourceId: "south-africa",
    targetId: "china",
    relationshipType: "trade",
    strength: 51,
    sentiment: 29,
    note: "Commodity, infrastructure, and Global South diplomacy give this edge steady weight."
  },
  {
    id: "rel-brazil-china",
    sourceId: "brazil",
    targetId: "china",
    relationshipType: "trade",
    strength: 62,
    sentiment: 34,
    note: "Agriculture, minerals, and industrial demand make this one of the stronger South-South ties."
  },
  {
    id: "rel-saudi-china",
    sourceId: "saudi-arabia",
    targetId: "china",
    relationshipType: "trade",
    strength: 61,
    sentiment: 31,
    note: "Energy flows and capital alignment continue to deepen this Gulf-Asia connection."
  }
];

export const activeConflictRelationships = simulationRelationships.filter(
  (relationship) => relationship.relationshipType === "active_conflict"
);

export const simulationHomeCamera: [number, number, number] = [0, 4.6, 21.8];

export function getRelationshipColor(type: SimulationRelationship["relationshipType"]) {
  return relationshipColors[type];
}

export function getActorRadius(actor: SimulationActor) {
  return calculateActorRadius(actor.metrics.compositePower, 0.14, 0.045);
}
