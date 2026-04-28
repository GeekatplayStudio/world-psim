"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState, useTransition } from "react";

import { cn } from "@/lib/utils";

import {
  actorIndex,
  simulationActors,
  simulationHomeCamera,
  simulationRelationships
} from "./simulation-data";
import { SimulationScene } from "./SimulationScene";
import type { BriefingSource } from "./simulation-types";

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
        <span className="text-slate-100">{value}</span>
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
  if (distance > 17.5) {
    return "world";
  }

  if (distance > 11.5) {
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
  const [cameraDistance, setCameraDistance] = useState(
    Math.hypot(...simulationHomeCamera)
  );
  const [briefingItems, setBriefingItems] = useState<BriefingSource[]>([]);
  const [briefingMode, setBriefingMode] = useState<"idle" | "loading" | "live" | "seed">("idle");
  const [, startTransition] = useTransition();
  const selectedActor = selectedActorId ? actorIndex[selectedActorId] ?? null : null;
  const activeConflicts = simulationRelationships.filter(
    (relationship) => relationship.relationshipType === "active_conflict"
  );
  const zoomStage = getZoomStage(cameraDistance);
  const showWorldRail = zoomStage === "world";
  const showInspector = Boolean(selectedActor) && zoomStage !== "world";
  const worldZones = new Set(simulationActors.map((actor) => actor.zone)).size;

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
      setSelectedActorId(actorId);
    });
  };

  const handleClearSelection = () => {
    startTransition(() => {
      setSelectedActorId(null);
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
            camera.lookAt(0, 0, 0);
          }}
          onPointerMissed={handleClearSelection}
        >
          <SimulationScene
            selectedActorId={selectedActorId}
            onSelectActor={handleSelectActor}
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
            <div className="mt-3 grid grid-cols-2 gap-2">
              <SceneChip label="Zoom" value={formatDistance(cameraDistance)} />
              <SceneChip label="Nodes" value={String(simulationActors.length)} />
              <SceneChip label="Conflicts" value={String(activeConflicts.length)} />
              <SceneChip label="Coverage" value={String(worldZones)} />
            </div>
          </div>

          <div
            className={cn(
              "absolute inset-x-4 bottom-4 overflow-hidden rounded-[1rem] border border-white/10 bg-slate-950/94 p-2.5 shadow-panel transition-all duration-500 md:inset-x-auto md:bottom-5 md:left-5 md:right-auto md:w-[15rem]",
              showWorldRail ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            )}
            style={{ pointerEvents: "none" }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Active conflicts</p>
                <p className="mt-1 text-[11px] leading-5 text-slate-400">Select a hotspot to inspect the actor.</p>
              </div>
              <span className="rounded-full border border-rose-400/25 bg-rose-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-rose-200">
                {activeConflicts.length} live edges
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {activeConflicts.map((relationship) => {
                const source = actorIndex[relationship.sourceId];
                const target = actorIndex[relationship.targetId];

                if (!source || !target) {
                  return null;
                }

                return (
                  <button
                    key={relationship.id}
                    type="button"
                    onClick={() => handleSelectActor(source.id)}
                    className="pointer-events-auto flex items-center justify-between gap-3 rounded-[0.85rem] border border-rose-400/20 bg-rose-500/[0.08] px-3 py-2 text-left transition hover:border-rose-300/35 hover:bg-rose-500/[0.12]"
                    style={{ pointerEvents: "auto" }}
                  >
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.26em] text-rose-200">
                        {formatRelationshipLabel(relationship.relationshipType)}
                      </p>
                      <p className="mt-1 text-[13px] font-semibold leading-5 text-white">
                        {source.label} <span className="text-slate-500">vs</span> {target.label}
                      </p>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-slate-400">inspect</span>
                  </button>
                );
              })}
            </div>
          </div>

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
                        Composite {selectedActor.metrics.compositePower}
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