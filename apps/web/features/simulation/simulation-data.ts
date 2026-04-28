import { calculateActorRadius, calculateCompositePower } from "@balancesphere/shared";

import type {
  ActorMetricsView,
  SimulationActor,
  SimulationRelationship
} from "./simulation-types";

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

export const simulationActors: SimulationActor[] = [
  {
    id: "israel",
    label: "Israel",
    actorType: "country",
    position: [-5.4, 1.4, -0.8],
    color: "#66d9ff",
    accent: "#9fdcff",
    region: "Eastern Mediterranean",
    summary:
      "High-readiness military actor with sustained pressure on Gaza and deterrence signaling across Lebanon and Iran-linked networks.",
    highlights: ["Air-defense posture elevated", "Multiple-front deterrence", "High diplomatic support from Washington"],
    metrics: makeMetrics({
      political: 76,
      economic: 71,
      military: 88,
      diplomatic: 67,
      soft: 46,
      instability: 58,
      confidence: 77
    }),
    briefingSources: [
      {
        id: "israel-1",
        title: "Cross-border strike exchanges continue to shape northern alert status",
        summary:
          "Regional reporting continues to emphasize how northern border exchanges are forcing high-readiness force posture and reserve planning.",
        sourceLabel: "Reuters Middle East",
        sourceUrl: "https://www.reuters.com/world/middle-east/",
        publishedAt: "2026-04-27T09:15:00Z"
      },
      {
        id: "israel-2",
        title: "US officials reiterate layered defense support and de-escalation messaging",
        summary:
          "Support remains strong, but public messaging continues to pair air-defense backing with pressure to contain escalation pathways.",
        sourceLabel: "US Department of State",
        sourceUrl: "https://www.state.gov/",
        publishedAt: "2026-04-26T18:40:00Z"
      }
    ]
  },
  {
    id: "iran",
    label: "Iran",
    actorType: "country",
    position: [5.2, 1.8, 0.9],
    color: "#ff9070",
    accent: "#ffc2a7",
    region: "Persian Gulf",
    summary:
      "Core regional power node projecting influence through direct state signaling, maritime pressure, and linked proxy networks.",
    highlights: ["Proxy leverage remains central", "Shipping route pressure", "Diplomatic friction with sanctions regimes"],
    metrics: makeMetrics({
      political: 73,
      economic: 54,
      military: 79,
      diplomatic: 63,
      soft: 44,
      instability: 49,
      confidence: 73
    }),
    briefingSources: [
      {
        id: "iran-1",
        title: "Hormuz signaling remains a core leverage channel in regional crisis framing",
        summary:
          "Energy and shipping commentary continues to track Tehran-linked deterrence messaging around maritime access and response thresholds.",
        sourceLabel: "International Maritime Security Construct",
        sourceUrl: "https://www.imscsentinel.com/",
        publishedAt: "2026-04-27T12:10:00Z"
      },
      {
        id: "iran-2",
        title: "European diplomatic channels pair sanctions enforcement with escalation warnings",
        summary:
          "European institutions continue to blend sanctions pressure with calls to prevent spillover into wider regional conflict lanes.",
        sourceLabel: "Council of the European Union",
        sourceUrl: "https://www.consilium.europa.eu/",
        publishedAt: "2026-04-25T14:25:00Z"
      }
    ]
  },
  {
    id: "hezbollah",
    label: "Hezbollah",
    actorType: "proxy_group",
    position: [-0.6, 3.2, 2.3],
    color: "#d57cff",
    accent: "#f0bcff",
    region: "Southern Lebanon",
    summary:
      "Non-state actor whose deterrence and cross-border firing patterns materially alter escalation risk on the northern front.",
    highlights: ["Proxy-linked escalation channel", "High volatility", "Dense border proximity risk"],
    metrics: makeMetrics({
      political: 45,
      economic: 23,
      military: 71,
      diplomatic: 29,
      soft: 18,
      instability: 81,
      confidence: 64
    }),
    briefingSources: [
      {
        id: "hezbollah-1",
        title: "Northern exchange cadence remains the strongest near-term escalation trigger",
        summary:
          "Even limited exchanges carry outsized volatility because of proximity, response speed, and ambiguity around broader sponsor intent.",
        sourceLabel: "Crisis Group",
        sourceUrl: "https://www.crisisgroup.org/middle-east-north-africa/east-mediterranean-mena/lebanon",
        publishedAt: "2026-04-27T07:20:00Z"
      },
      {
        id: "hezbollah-2",
        title: "UN monitoring reports keep attention on ceasefire fragility in southern sectors",
        summary:
          "Monitoring notes continue to stress how small tactical incidents can produce strategic-level signaling effects.",
        sourceLabel: "UNIFIL",
        sourceUrl: "https://unifil.unmissions.org/",
        publishedAt: "2026-04-24T13:30:00Z"
      }
    ]
  },
  {
    id: "hamas",
    label: "Hamas",
    actorType: "proxy_group",
    position: [-2.4, -1.2, 2.8],
    color: "#f95e9b",
    accent: "#ffb3cf",
    region: "Gaza Strip",
    summary:
      "Embedded conflict actor driving the most intense active-conflict edge in the current network view.",
    highlights: ["Primary conflict node", "Humanitarian pressure multiplier", "High information fog"],
    metrics: makeMetrics({
      political: 39,
      economic: 14,
      military: 61,
      diplomatic: 18,
      soft: 11,
      instability: 88,
      confidence: 58
    }),
    briefingSources: [
      {
        id: "hamas-1",
        title: "Conflict reporting remains centered on strikes, access constraints, and hostage diplomacy",
        summary:
          "Coverage continues to bundle battlefield activity with negotiation pressure around hostages, aid entry, and ceasefire sequencing.",
        sourceLabel: "Reuters Gaza Coverage",
        sourceUrl: "https://www.reuters.com/world/middle-east/",
        publishedAt: "2026-04-27T10:05:00Z"
      },
      {
        id: "hamas-2",
        title: "Humanitarian agencies emphasize civilian risk concentration in access corridors",
        summary:
          "Operational access remains the core data point shaping external diplomatic and aid discussions.",
        sourceLabel: "UN OCHA",
        sourceUrl: "https://www.ochaopt.org/",
        publishedAt: "2026-04-26T16:00:00Z"
      }
    ]
  },
  {
    id: "united-states",
    label: "United States",
    actorType: "country",
    position: [-8.2, 4.2, -3.1],
    color: "#8ad5ff",
    accent: "#d3f0ff",
    region: "Global",
    summary:
      "External balancing actor combining military support, maritime presence, and de-escalation diplomacy across multiple tracks.",
    highlights: ["Security guarantor", "Maritime stabilization role", "High diplomatic reach"],
    metrics: makeMetrics({
      political: 84,
      economic: 92,
      military: 94,
      diplomatic: 88,
      soft: 71,
      instability: 27,
      confidence: 83
    }),
    briefingSources: [
      {
        id: "us-1",
        title: "Carrier and air-defense posture still anchors regional deterrence umbrella",
        summary:
          "The US role remains visible in both military reassurance and shipping-lane stabilization narratives.",
        sourceLabel: "US Central Command",
        sourceUrl: "https://www.centcom.mil/",
        publishedAt: "2026-04-27T15:45:00Z"
      },
      {
        id: "us-2",
        title: "Diplomatic messaging continues to push dual-track support plus de-escalation",
        summary:
          "Official statements continue to pair alliance backing with efforts to keep secondary fronts from widening.",
        sourceLabel: "White House Briefing Room",
        sourceUrl: "https://www.whitehouse.gov/briefing-room/",
        publishedAt: "2026-04-25T20:10:00Z"
      }
    ]
  },
  {
    id: "qatar",
    label: "Qatar",
    actorType: "country",
    position: [0.9, -3.4, -2.2],
    color: "#4ce4d2",
    accent: "#b9fff5",
    region: "Gulf",
    summary:
      "Mediation-focused node with outsized relevance in hostage, ceasefire, and humanitarian-channel negotiations.",
    highlights: ["Mediation leverage", "Negotiation access", "Humanitarian channel role"],
    metrics: makeMetrics({
      political: 58,
      economic: 69,
      military: 28,
      diplomatic: 76,
      soft: 48,
      instability: 22,
      confidence: 72
    }),
    briefingSources: [
      {
        id: "qatar-1",
        title: "Mediation channel remains central to ceasefire and hostage sequencing efforts",
        summary:
          "Qatar continues to appear in reporting as a key bridge actor across negotiation stages.",
        sourceLabel: "Qatar Ministry of Foreign Affairs",
        sourceUrl: "https://www.mofa.gov.qa/en",
        publishedAt: "2026-04-27T11:20:00Z"
      },
      {
        id: "qatar-2",
        title: "Humanitarian access messaging remains tied to negotiation momentum",
        summary:
          "Aid-channel diplomacy continues to move in parallel with ceasefire bargaining.",
        sourceLabel: "Al Jazeera Middle East",
        sourceUrl: "https://www.aljazeera.com/where/middleeast/",
        publishedAt: "2026-04-26T08:55:00Z"
      }
    ]
  },
  {
    id: "egypt",
    label: "Egypt",
    actorType: "country",
    position: [-4.2, -4.2, -1.3],
    color: "#c4b26f",
    accent: "#ffecb4",
    region: "Sinai / Rafah",
    summary:
      "Border-control and mediation actor shaping access corridors, deconfliction, and regional diplomatic pacing.",
    highlights: ["Border gateway role", "Mediation support", "Humanitarian throughput sensitivity"],
    metrics: makeMetrics({
      political: 63,
      economic: 57,
      military: 64,
      diplomatic: 66,
      soft: 39,
      instability: 36,
      confidence: 74
    }),
    briefingSources: [
      {
        id: "egypt-1",
        title: "Rafah corridor management remains central to humanitarian and diplomatic planning",
        summary:
          "Border control decisions continue to directly shape the tempo of aid and evacuation discussions.",
        sourceLabel: "UN News",
        sourceUrl: "https://news.un.org/en/tags/gaza",
        publishedAt: "2026-04-27T06:45:00Z"
      },
      {
        id: "egypt-2",
        title: "Egyptian mediation remains linked to broader ceasefire architecture",
        summary:
          "Regional reporting still treats Cairo as a procedural anchor in multistage ceasefire work.",
        sourceLabel: "Arab News",
        sourceUrl: "https://www.arabnews.com/middle-east",
        publishedAt: "2026-04-25T17:05:00Z"
      }
    ]
  },
  {
    id: "un",
    label: "United Nations",
    actorType: "international_org",
    position: [2.4, 4.5, -3.5],
    color: "#ffffff",
    accent: "#b8d8ff",
    region: "International",
    summary:
      "Monitoring and humanitarian coordination node with high relevance to aid, civilian risk, and ceasefire legitimacy narratives.",
    highlights: ["Aid legitimacy", "Monitoring role", "Civilian impact reporting"],
    metrics: makeMetrics({
      political: 52,
      economic: 34,
      military: 8,
      diplomatic: 82,
      soft: 79,
      instability: 18,
      confidence: 80
    }),
    briefingSources: [
      {
        id: "un-1",
        title: "Aid and civilian-risk updates continue to drive international pressure",
        summary:
          "UN briefings remain a primary evidence base for humanitarian conditions and access constraints.",
        sourceLabel: "UN News",
        sourceUrl: "https://news.un.org/en/tags/middle-east",
        publishedAt: "2026-04-27T13:00:00Z"
      },
      {
        id: "un-2",
        title: "UNIFIL monitoring continues to frame fragility along the Lebanese front",
        summary:
          "Ceasefire-monitoring language remains important because it maps localized incidents to regional escalation risk.",
        sourceLabel: "UNIFIL",
        sourceUrl: "https://unifil.unmissions.org/",
        publishedAt: "2026-04-24T13:30:00Z"
      }
    ]
  }
];

export const actorIndex = Object.fromEntries(
  simulationActors.map((actor) => [actor.id, actor])
) as Record<string, SimulationActor>;

export const simulationRelationships: SimulationRelationship[] = [
  {
    id: "rel-israel-hamas",
    sourceId: "israel",
    targetId: "hamas",
    relationshipType: "active_conflict",
    strength: 94,
    sentiment: -96,
    note: "Primary conflict edge in the current regional crisis view."
  },
  {
    id: "rel-israel-hezbollah",
    sourceId: "israel",
    targetId: "hezbollah",
    relationshipType: "hostility",
    strength: 86,
    sentiment: -88,
    note: "High-volatility northern deterrence edge."
  },
  {
    id: "rel-iran-hezbollah",
    sourceId: "iran",
    targetId: "hezbollah",
    relationshipType: "proxy_influence",
    strength: 82,
    sentiment: 46,
    note: "Influence and support channel shaping escalation thresholds."
  },
  {
    id: "rel-iran-hamas",
    sourceId: "iran",
    targetId: "hamas",
    relationshipType: "military_support",
    strength: 63,
    sentiment: 29,
    note: "Indirect support narrative with medium confidence."
  },
  {
    id: "rel-us-israel",
    sourceId: "united-states",
    targetId: "israel",
    relationshipType: "alliance",
    strength: 88,
    sentiment: 79,
    note: "Strong defense and diplomatic support edge."
  },
  {
    id: "rel-qatar-hamas",
    sourceId: "qatar",
    targetId: "hamas",
    relationshipType: "mediation",
    strength: 58,
    sentiment: 12,
    note: "Negotiation channel focused on ceasefire and hostage sequencing."
  },
  {
    id: "rel-egypt-hamas",
    sourceId: "egypt",
    targetId: "hamas",
    relationshipType: "mediation",
    strength: 55,
    sentiment: 7,
    note: "Border and access mediation link."
  },
  {
    id: "rel-un-hamas",
    sourceId: "un",
    targetId: "hamas",
    relationshipType: "humanitarian_aid",
    strength: 49,
    sentiment: 21,
    note: "Aid-linked humanitarian interface."
  },
  {
    id: "rel-un-israel",
    sourceId: "un",
    targetId: "israel",
    relationshipType: "diplomatic_pressure",
    strength: 52,
    sentiment: -14,
    note: "Civilian-risk and access pressure line."
  },
  {
    id: "rel-us-iran",
    sourceId: "united-states",
    targetId: "iran",
    relationshipType: "sanctions",
    strength: 74,
    sentiment: -61,
    note: "Sanctions and deterrence pressure edge."
  }
];

export const simulationHomeCamera: [number, number, number] = [0, 2.8, 14];

export function getRelationshipColor(type: SimulationRelationship["relationshipType"]) {
  return relationshipColors[type];
}

export function getActorRadius(actor: SimulationActor) {
  return calculateActorRadius(actor.metrics.compositePower, 0.42, 0.12);
}