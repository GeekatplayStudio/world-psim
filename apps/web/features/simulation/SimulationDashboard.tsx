"use client";

import { Canvas } from "@react-three/fiber";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { actorIndex, simulationActors } from "./simulation-data";
import { SimulationScene } from "./SimulationScene";

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

export default function SimulationDashboard() {
  const [selectedActorId, setSelectedActorId] = useState(simulationActors[0]?.id ?? "");
  const selectedActor = actorIndex[selectedActorId] ?? simulationActors[0];

  if (!selectedActor) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.34em] text-cyan-100">Live 3D Conflict Graph</p>
          <h1 className="font-[var(--font-heading)] text-4xl text-white sm:text-5xl">
            Rotate the network, zoom into an orb, and let the details reveal themselves.
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            The main route now prioritizes the simulation itself: orbit, pan, and zoom the geopolitical graph, then click an actor to open a floating evidence panel with recent briefings and source links.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.28em] text-slate-300">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Drag to rotate</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Right-drag to pan</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Scroll to zoom detail</span>
        </div>
      </div>

      <div className="relative min-h-[calc(100vh-12rem)] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-panel">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,232,255,0.12),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(255,178,107,0.12),transparent_22%)]" />

        <Canvas
          camera={{ position: [0, 2.8, 14], fov: 42 }}
          shadows
          dpr={[1, 2]}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          <SimulationScene
            selectedActorId={selectedActorId}
            onSelectActor={setSelectedActorId}
          />
        </Canvas>

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-4 top-4 max-w-xs rounded-2xl border border-white/10 bg-slate-950/75 p-4 text-sm text-slate-200 shadow-panel backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-100">Detail Reveal</p>
            <p className="mt-2 leading-6 text-slate-300">
              Move closer to any orb to reveal local stats beside it. Selection locks the actor and expands the evidence feed on the right.
            </p>
          </div>

          <div className="absolute bottom-4 left-4 hidden max-w-sm rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-xs text-slate-300 shadow-panel backdrop-blur lg:block">
            <p className="uppercase tracking-[0.28em] text-slate-100">Legend</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-emerald-400/35 bg-emerald-400/10 px-3 py-1 text-emerald-200">Alliance</span>
              <span className="rounded-full border border-rose-400/35 bg-rose-400/10 px-3 py-1 text-rose-200">Conflict / Hostility</span>
              <span className="rounded-full border border-fuchsia-400/35 bg-fuchsia-400/10 px-3 py-1 text-fuchsia-200">Proxy Influence</span>
              <span className="rounded-full border border-amber-300/35 bg-amber-300/10 px-3 py-1 text-amber-100">Mediation</span>
            </div>
          </div>

          <aside className="pointer-events-auto absolute inset-x-4 bottom-4 max-h-[48vh] overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/82 shadow-panel backdrop-blur lg:inset-x-auto lg:bottom-4 lg:right-4 lg:top-4 lg:max-h-none lg:w-[25rem]">
            <div className="flex h-full flex-col">
              <div className="border-b border-white/10 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.32em] text-cyan-100">Selected Actor</p>
                <div className="mt-3 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-[var(--font-heading)] text-3xl text-white">
                      {selectedActor.label}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">{selectedActor.region}</p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-200">
                    {selectedActor.actorType.replaceAll("_", " ")}
                  </div>
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
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Active Signals</p>
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
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Latest Briefings</p>
                  <span className="text-xs text-slate-500">Seeded evidence feed</span>
                </div>
                <div className="space-y-3">
                  {selectedActor.briefingSources.map((briefing) => (
                    <article
                      key={briefing.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
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
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}