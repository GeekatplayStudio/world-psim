import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

const draftClaims = [
  {
    title: "Iran support signal",
    status: "Draft",
    confidence: "62",
    note: "Awaiting actor resolution and reviewer approval workflow."
  },
  {
    title: "Ceasefire mediation note",
    status: "Needs review",
    confidence: "54",
    note: "UI placeholder for evidence preview and edit actions."
  }
];

export default function ClaimsPage() {
  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem] p-8">
        <CardHeader>
          <CardTitle className="font-[var(--font-heading)] text-4xl">
            Claim Review Queue
          </CardTitle>
          <CardDescription className="max-w-2xl text-base">
            Draft claims will stay isolated from the official graph until a human reviewer approves them.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {draftClaims.map((claim) => (
          <Card key={claim.title}>
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>{claim.title}</CardTitle>
                <CardDescription>{claim.note}</CardDescription>
              </div>
              <div className="flex gap-3 text-xs uppercase tracking-[0.28em] text-slate-300">
                <span>{claim.status}</span>
                <span>Confidence {claim.confidence}</span>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              Approval, rejection, and edits are intentionally deferred until the ingestion and claim workflow phases.
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}