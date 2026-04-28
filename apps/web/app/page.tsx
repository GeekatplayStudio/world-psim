import Link from "next/link";

import { calculateActorRadius, calculateCompositePower } from "@balancesphere/shared";

import { ScenePreview } from "@/components/scene-preview";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

const placeholderPower = calculateCompositePower({
  politicalPower: 78,
  economicPower: 64,
  militaryPower: 83,
  diplomaticPower: 70,
  softPower: 58
});

const previewRadius = calculateActorRadius(placeholderPower);

const launchCards = [
  {
    title: "3D graph staging",
    description: "The App Router shell is ready for React Three Fiber work in Phase 2."
  },
  {
    title: "Admin workflows",
    description: "Placeholder routes exist for claims, sources, and scenarios so UX slices can land incrementally."
  },
  {
    title: "Shared scoring",
    description: "Pure scoring helpers already live in the shared package with unit coverage."
  }
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="flex flex-col justify-between gap-8 rounded-[2rem] p-8">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-cyan-100">
              Phase 0 scaffold
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl font-[var(--font-heading)] text-5xl leading-tight text-white sm:text-6xl">
                A cinematic shell for geopolitical balance modeling.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                BalanceSphere now has its monorepo, API skeleton, worker placeholder,
                shared domain package, Prisma schema foundation, and the first route
                surfaces for graph, admin, sources, and scenarios.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Open Admin Shell
            </Link>
            <Link
              href="/sources"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30"
            >
              Review Source Intake
            </Link>
          </div>
        </Card>

        <ScenePreview />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Composite power demo</CardTitle>
            <CardDescription>
              Shared scoring is already wired into the frontend placeholder.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-200">
            <p>Calculated power: {placeholderPower}</p>
            <p>Softened radius: {previewRadius}</p>
          </CardContent>
        </Card>

        {launchCards.map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </div>
  );
}