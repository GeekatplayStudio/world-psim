import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default function ScenariosPage() {
  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem] p-8">
        <CardHeader>
          <CardTitle className="font-[var(--font-heading)] text-4xl">
            Scenario Lab
          </CardTitle>
          <CardDescription className="max-w-2xl text-base">
            Scenario mode will clone a validated graph state, allow manual deltas,
            and compare baseline versus simulated outcomes without overwriting history.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Baseline snapshot</CardTitle>
            <CardDescription>Choose a historical state to branch from.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Adjustment controls</CardTitle>
            <CardDescription>Modify support, sanctions, and actor metrics.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Side-by-side compare</CardTitle>
            <CardDescription>Contrast baseline and scenario graphs before saving.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-300">
            Route placeholder confirmed for Phase 9.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}