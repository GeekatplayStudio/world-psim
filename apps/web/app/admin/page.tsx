import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

const adminCards = [
  {
    title: "Claim review queue",
    description: "Human approval stays mandatory before graph updates."
  },
  {
    title: "Source intake",
    description: "Manual and connector-driven imports will land here in later phases."
  },
  {
    title: "Scenario orchestration",
    description: "Scenario cloning and comparison start after the baseline graph is stable."
  }
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem] p-8">
        <CardHeader>
          <CardTitle className="font-[var(--font-heading)] text-4xl">
            Admin Command Deck
          </CardTitle>
          <CardDescription className="max-w-2xl text-base">
            Phase 0 establishes the route surface and layout shell. Editing, imports,
            and review flows land in later phases after the database and graph slices are active.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {adminCards.map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              Placeholder route confirmed.
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}