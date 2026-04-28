"use client";

import { Canvas } from "@react-three/fiber";
import { useDeferredValue, useEffect, useState, useTransition } from "react";

import { cn } from "@/lib/utils";

import {
  actorIndex,
  simulationActors,
  simulationHomeCamera,
  simulationRelationships
} from "./simulation-data";
import { SimulationScene } from "./SimulationScene";
import type { BriefingSource, SimulationRelationship } from "./simulation-types";

type ZoomStage = "world" | "regional" | "focus";

type BriefingFeedResponse = {
  items: BriefingSource[];
  mode: "live" | "seed";
};

function MetricBar({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-400">
        <span>{label}</span>
        <span className="text-slate-100">{formatMetricValue(value)}</span>
      </div>
      <div className="h-2 rounded-full bg-white/5">
        <div className={cn("h-full rounded-full", tone)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function getZoomStage(distance: number): ZoomStage {
  if (distance > 23.5) {
    return "world";
  }

  if (distance > 14.5) {
    return "regional";
  }

  return "focus";
}

function formatRelationshipLabel(value: string) {
  return value.replaceAll("_", " ");
}

function formatDistance(value: number) {
  return `${value.toFixed(1)}x`;
}

function formatSentiment(value: number) {
  return value >= 35 ? "supportive" : value >= 10 ? "stable" : value >= -10 ? "neutral" : "strained";
}

function formatMetricValue(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function SceneChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-white/10 bg-slate-950/92 px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-slate-200">
      <span className="text-slate-500">{label}</span>
      <span className="ml-2 text-cyan-100">{value}</span>
    </div>
  );
}

function getBriefingStatusLabel(mode: "idle" | "loading" | "live" | "seed") {
  switch (mode) {
    case "loading":
      return "Refreshing";
    case "live":
      return "Live feed";
    case "seed":
      return "Fallback";
    default:
      return "Standby";
  }
}

export default function SimulationDashboard() {
  const [selectedActorId, setSelectedActorId] = useState<string | null>(null);
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(false);
  const [relationshipRailMode, setRelationshipRailMode] = useState<"conflict" | "trade">("conflict");
  const [countrySearchValue, setCountrySearchValue] = useState("");
  const [cameraDistance, setCameraDistance] = useState(
    Math.hypot(...simulationHomeCamera)
  );
  const [briefingItems, setBriefingItems] = useState<BriefingSource[]>([]);
  const [briefingMode, setBriefingMode] = useState<"idle" | "loading" | "live" | "seed">("idle");
  const [, startTransition] = useTransition();
  const deferredCountrySearch = useDeferredValue(countrySearchValue.trim().toLowerCase());
  const selectedActor = selectedActorId ? actorIndex[selectedActorId] ?? null : null;
  const selectedRelationship = selectedRelationshipId
    ? simulationRelationships.find((relationship) => relationship.id === selectedRelationshipId) ?? null
    : null;
  const selectedRelationshipSource = selectedRelationship ? actorIndex[selectedRelationship.sourceId] ?? null : null;
  const selectedRelationshipTarget = selectedRelationship ? actorIndex[selectedRelationship.targetId] ?? null : null;
  const activeConflicts = simulationRelationships.filter(
    (relationship) => relationship.relationshipType === "active_conflict"
  );
  const featuredActiveConflicts = [...activeConflicts]
    .sort((left, right) => right.strength - left.strength)
    .slice(0, 5);
  const featuredTradeConnections = simulationRelationships
    .filter(
      (relationship) =>
        relationship.relationshipType === "trade" ||
        relationship.relationshipType === "economic_dependency"
    )
    .sort((left, right) => right.strength - left.strength)
    .slice(0, 5);
  const zoomStage = getZoomStage(cameraDistance);
  const showWorldRail = zoomStage === "world";
  const showInspector = Boolean(selectedActor) && zoomStage !== "world";
  const showRelationshipPopup = Boolean(selectedRelationship);
  const worldZones = new Set(simulationActors.map((actor) => actor.zone)).size;
  const featuredRelationshipItems =
    relationshipRailMode === "conflict" ? featuredActiveConflicts : featuredTradeConnections;
  const searchResults = deferredCountrySearch
    ? simulationActors
        .filter((actor) => actor.actorType === "country" && actor.countryCode)
        .filter(
          (actor) =>
            actor.label.toLowerCase().includes(deferredCountrySearch) ||
            actor.countryCode?.toLowerCase().includes(deferredCountrySearch)
        )
        .sort((left, right) => {
          const leftStartsWithQuery = left.label.toLowerCase().startsWith(deferredCountrySearch);
          const rightStartsWithQuery = right.label.toLowerCase().startsWith(deferredCountrySearch);

          if (leftStartsWithQuery !== rightStartsWithQuery) {
            return Number(rightStartsWithQuery) - Number(leftStartsWithQuery);
          }

          if ((left.detailTier === "core") !== (right.detailTier === "core")) {
            return left.detailTier === "core" ? -1 : 1;
          }

          return left.label.localeCompare(right.label);
        })
        .slice(0, 6)
    : [];

  useEffect(() => {
    if (!selectedActor) {
      setBriefingItems([]);
      setBriefingMode("idle");
      return;
    }

    const controller = new AbortController();

    setBriefingItems(selectedActor.briefingSources);
    setBriefingMode("loading");

    void fetch(`/api/briefings/${selectedActor.id}`, {
      signal: controller.signal,
      cache: "no-store"
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Briefing feed request failed with ${response.status}`);
        }

        return (await response.json()) as BriefingFeedResponse;
      })
      .then((payload) => {
        setBriefingItems(payload.items);
        setBriefingMode(payload.mode);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setBriefingItems(selectedActor.briefingSources);
        setBriefingMode("seed");
      });

    return () => {
      controller.abort();
    };
  }, [selectedActor]);

  const handleSelectActor = (actorId: string) => {
    startTransition(() => {
      setCountrySearchValue("");
      setSelectedRelationshipId(null);
      setSelectedActorId(actorId);
    });
  };

  const handleSelectRelationship = (relationshipId: string) => {
    startTransition(() => {
      setSelectedActorId(null);
      setSelectedRelationshipId(relationshipId);
    });
  };

  const handleClearSelection = () => {
    startTransition(() => {
      setSelectedActorId(null);
      setSelectedRelationshipId(null);
    });
  };

  const handleToggleLabels = () => {
    startTransition(() => {
      setShowLabels((current) => !current);
    });
  };

  const viewportHeight = "calc(100vh - 7.75rem)";

  return (
    <section>
      <div
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-panel"
        style={{ minHeight: viewportHeight, height: viewportHeight }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,232,255,0.12),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(255,178,107,0.12),transparent_22%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(3,8,17,0.15),transparent_56%),linear-gradient(180deg,rgba(2,6,14,0.18),rgba(2,6,14,0.5))]" />

        <Canvas
          camera={{ position: simulationHomeCamera, fov: 38 }}
          shadows
          dpr={[1, 2]}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          onCreated={({ camera }) => {
            camera.lookAt(0, -0.8, 0);
          }}
          onPointerMissed={handleClearSelection}
        >
          <SimulationScene
            selectedActorId={selectedActorId}
            selectedRelationshipId={selectedRelationshipId}
            showLabels={showLabels}
            onSelectActor={handleSelectActor}
            onSelectRelationship={handleSelectRelationship}
            onZoomDistanceChange={setCameraDistance}
          />
        </Canvas>

        <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
          <div
            className={cn(
              "absolute left-4 top-4 max-w-[15rem] rounded-[1.05rem] border border-white/10 bg-slate-950/94 p-2.5 shadow-panel transition-all duration-500 md:left-auto md:right-5 md:top-5",
              showWorldRail ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
            )}
            style={{ pointerEvents: "none" }}
          >
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">World view</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.28em]">
              <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-2.5 py-1 text-cyan-100">
                Conflict lattice
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
                {zoomStage}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              Drag to orbit. Scroll to zoom. Right-drag to pan.
            </p>
            <div className="mt-3 flex flex-wrap gap-2" style={{ pointerEvents: "auto" }}>
              <button
                type="button"
                onClick={handleToggleLabels}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] transition",
                  showLabels
                    ? "border-cyan-300/40 bg-cyan-300/12 text-cyan-50"
                    : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white"
                )}
                style={{ pointerEvents: "auto" }}
              >
                {showLabels ? "Labels on" : "Labels off"}
              </button>
            </div>
            <div className="mt-3" style={{ pointerEvents: "auto" }}>
              <label className="block text-[10px] uppercase tracking-[0.26em] text-slate-500" htmlFor="country-search">
                Find country
              </label>
              <input
                id="country-search"
                type="text"
                value={countrySearchValue}
                onChange={(event) => setCountrySearchValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && searchResults[0]) {
                    handleSelectActor(searchResults[0].id);
                  }

                  if (event.key === "Escape") {
                    setCountrySearchValue("");
                  }
                }}
                placeholder="Search Canada, Japan, Egypt..."
                className="mt-2 w-full rounded-[0.9rem] border border-white/10 bg-slate-900/90 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35 focus:bg-slate-900"
              />
              {deferredCountrySearch ? (
                <div className="mt-2 space-y-2">
                  {searchResults.length ? (
                    searchResults.map((actor) => (
                      <button
                        key={actor.id}
                        type="button"
                        onClick={() => handleSelectActor(actor.id)}
                        className="flex w-full items-center justify-between rounded-[0.85rem] border border-white/10 bg-white/[0.04] px-3 py-2 text-left transition hover:border-cyan-300/25 hover:bg-cyan-300/[0.08]"
                      >
                        <span>
                          <span className="block text-sm font-semibold text-white">{actor.label}</span>
                          <span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-slate-500">
                            {actor.zone}
                          </span>
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.22em] text-cyan-100">Jump</span>
                      </button>
                    ))
                  ) : (
                    <p className="rounded-[0.85rem] border border-dashed border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-400">
                      No countries matched that search.
                    </p>
                  )}
                </div>
              ) : null}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <SceneChip label="Zoom" value={formatDistance(cameraDistance)} />
              <SceneChip label="Nodes" value={String(simulationActors.length)} />
              <SceneChip label="Conflicts" value={String(activeConflicts.length)} />
              <SceneChip label="Coverage" value={String(worldZones)} />
            </div>
          </div>

          <div
            className={cn(
              "absolute inset-x-4 bottom-4 overflow-hidden rounded-[1rem] border border-white/10 bg-slate-950/92 p-2.5 shadow-panel transition-all duration-500 md:inset-x-auto md:bottom-5 md:left-5 md:right-auto md:w-[14rem]",
              showWorldRail ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            )}
            style={{ pointerEvents: "none" }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                  {relationshipRailMode === "conflict" ? "Active conflicts" : "Major trade links"}
                </p>
                <p className="mt-1 text-[11px] leading-5 text-slate-400">Select a connection to inspect details.</p>
              </div>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.24em]",
                  relationshipRailMode === "conflict"
                    ? "border border-rose-400/25 bg-rose-500/10 text-rose-200"
                    : "border border-emerald-300/25 bg-emerald-400/10 text-emerald-100"
                )}
              >
                {relationshipRailMode === "conflict" ? activeConflicts.length : featuredTradeConnections.length} shown
              </span>
            </div>

            <div className="mt-3 flex gap-2" style={{ pointerEvents: "auto" }}>
              <button
                type="button"
                onClick={() => setRelationshipRailMode("conflict")}
                className={cn(
                  "rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.22em] transition",
                  relationshipRailMode === "conflict"
                    ? "border-rose-300/30 bg-rose-500/12 text-rose-100"
                    : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                )}
              >
                Conflicts
              </button>
              <button
                type="button"
                onClick={() => setRelationshipRailMode("trade")}
                className={cn(
                  "rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.22em] transition",
                  relationshipRailMode === "trade"
                    ? "border-emerald-300/30 bg-emerald-400/12 text-emerald-100"
                    : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                )}
              >
                Trade
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {featuredRelationshipItems.map((relationship) => {
                const source = actorIndex[relationship.sourceId];
                const target = actorIndex[relationship.targetId];

                if (!source || !target) {
                  return null;
                }

                const isTradeRelationship =
                  relationship.relationshipType === "trade" ||
                  relationship.relationshipType === "economic_dependency";

                return (
                  <button
                    key={relationship.id}
                    type="button"
                    onClick={() => handleSelectRelationship(relationship.id)}
                    className={cn(
                      "pointer-events-auto flex items-center justify-between gap-3 rounded-[0.85rem] px-3 py-2 text-left transition",
                      isTradeRelationship
                        ? "border border-emerald-300/20 bg-emerald-400/[0.06] hover:border-emerald-200/35 hover:bg-emerald-400/[0.1]"
                        : "border border-rose-400/20 bg-rose-500/[0.07] hover:border-rose-300/35 hover:bg-rose-500/[0.11]"
                    )}
                    style={{ pointerEvents: "auto" }}
                  >
                    <div>
                      <p
                        className={cn(
                          "text-[10px] uppercase tracking-[0.26em]",
                          isTradeRelationship ? "text-emerald-100" : "text-rose-200"
                        )}
                      >
                        {formatRelationshipLabel(relationship.relationshipType)}
                      </p>
                      <p className="mt-1 text-[13px] font-semibold leading-5 text-white">
                        {source.label} <span className="text-slate-500">vs</span> {target.label}
                      </p>
                      {relationship.tradeCategories?.length ? (
                        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                          {relationship.tradeCategories.join(" · ")}
                        </p>
                      ) : null}
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-slate-400">details</span>
                  </button>
                );
              })}
            </div>
          </div>

          <aside
            className={cn(
              "pointer-events-auto absolute bottom-5 left-1/2 z-10 w-[min(30rem,calc(100%-2rem))] -translate-x-1/2 overflow-hidden rounded-[1.3rem] border border-white/10 bg-slate-950/92 shadow-panel backdrop-blur transition-all duration-500",
              showRelationshipPopup ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            )}
            style={{ pointerEvents: showRelationshipPopup ? "auto" : "none" }}
          >
            {selectedRelationship && selectedRelationshipSource && selectedRelationshipTarget ? (
              <div className="grid gap-3 p-4 md:grid-cols-[1.1fr_auto] md:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-cyan-100">
                      {formatRelationshipLabel(selectedRelationship.relationshipType)}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-slate-300">
                      Strength {selectedRelationship.strength}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-slate-300">
                      {formatSentiment(selectedRelationship.sentiment)}
                    </span>
                  </div>
                  <h3 className="mt-3 font-[var(--font-heading)] text-2xl text-white">
                    {selectedRelationshipSource.label} <span className="text-slate-500">to</span> {selectedRelationshipTarget.label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{selectedRelationship.note}</p>
                  {selectedRelationship.tradeCategories?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedRelationship.tradeCategories.map((category) => (
                        <span
                          key={category}
                          className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald-100"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRelationshipId(null)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-slate-300 transition hover:border-white/20 hover:text-white"
                >
                  Close
                </button>
              </div>
            ) : null}
          </aside>

          <aside
            className={cn(
              "pointer-events-auto absolute inset-x-4 bottom-4 top-auto max-h-[54vh] overflow-hidden rounded-[1.6rem] border border-white/10 bg-slate-950/86 shadow-panel backdrop-blur transition-all duration-500 md:inset-x-auto md:bottom-6 md:right-6 md:top-6 md:max-h-none md:w-[21rem]",
              showInspector ? "translate-x-0 opacity-100" : "translate-x-[110%] opacity-0"
            )}
            style={{ pointerEvents: showInspector ? "auto" : "none" }}
          >
            <div className="flex h-full flex-col">
              {selectedActor ? (
                <>
                  <div className="border-b border-white/10 px-5 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.32em] text-cyan-100">
                          Selected actor
                        </p>
                        <h2 className="mt-3 font-[var(--font-heading)] text-3xl text-white">
                          {selectedActor.label}
                        </h2>
                        <p className="mt-1 text-sm text-slate-400">
                          {selectedActor.zone} · {selectedActor.region}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearSelection}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-slate-300 transition hover:border-white/20 hover:text-white"
                      >
                        Close
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-slate-200">
                        {formatRelationshipLabel(selectedActor.actorType)}
                      </span>
                      <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-cyan-100">
                        Composite {formatMetricValue(selectedActor.metrics.compositePower)}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-slate-300">{selectedActor.summary}</p>
                  </div>

                  <div className="grid gap-3 border-b border-white/10 px-5 py-4">
                    <MetricBar label="Composite" value={selectedActor.metrics.compositePower} tone="bg-cyan-300" />
                    <MetricBar label="Military" value={selectedActor.metrics.military} tone="bg-rose-400" />
                    <MetricBar label="Diplomatic" value={selectedActor.metrics.diplomatic} tone="bg-amber-300" />
                    <MetricBar label="Confidence" value={selectedActor.metrics.confidence} tone="bg-emerald-400" />
                    <MetricBar label="Instability" value={selectedActor.metrics.instability} tone="bg-fuchsia-400" />
                  </div>

                  <div className="border-b border-white/10 px-5 py-4">
                    <p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">Signals</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedActor.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">Briefings</p>
                      <span className="text-xs text-slate-500">{getBriefingStatusLabel(briefingMode)}</span>
                    </div>
                    <div className="space-y-3">
                      {briefingItems.map((briefing) => (
                        <article
                          key={briefing.id}
                          className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-sm font-semibold leading-6 text-white">{briefing.title}</h3>
                            <span className="whitespace-nowrap text-[11px] uppercase tracking-[0.2em] text-slate-500">
                              {formatDate(briefing.publishedAt)}
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-300">{briefing.summary}</p>
                          <a
                            href={briefing.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100 transition hover:text-cyan-50"
                          >
                            {briefing.sourceLabel}
                            <span aria-hidden="true">↗</span>
                          </a>
                        </article>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}