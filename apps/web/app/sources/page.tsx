import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

const sourceStates = [
  "Manual JSON and CSV import endpoints are planned first.",
  "RSS and official statement connectors follow after baseline CRUD.",
  "Scraping remains opt-in, rate-limited, and non-paywalled only."
];

export default function SourcesPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="rounded-[2rem] p-8">
        <CardHeader>
          <CardTitle className="font-[var(--font-heading)] text-4xl">
            Source Intake
          </CardTitle>
          <CardDescription className="max-w-2xl text-base">
            This route is the future home for connector status, source deduplication,
            import controls, and raw document inspection.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phase sequencing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          {sourceStates.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}