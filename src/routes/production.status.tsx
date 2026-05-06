import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Section, Pill } from "@/components/PageHelpers";

export const Route = createFileRoute("/production/status")({
  head: () => ({ meta: [{ title: "Status Tracking — Varnam" }] }),
  component: Page,
});

const stages = ["Greige", "Pre-treatment", "Dyeing", "Finishing", "QC", "Dispatch"];
const orders = [
  { id: "ORD-1042", client: "Saraswati Apparels", fabric: "Cotton Poplin", qty: "540 kg", stage: 3 },
  { id: "ORD-1041", client: "Mira Exports", fabric: "Viscose", qty: "320 kg", stage: 2 },
  { id: "ORD-1040", client: "Anjali Mills", fabric: "Polyester Blend", qty: "410 kg", stage: 4 },
  { id: "ORD-1039", client: "Kirti Fashions", fabric: "Linen", qty: "220 kg", stage: 5 },
  { id: "ORD-1038", client: "Vanya Textiles", fabric: "Rayon", qty: "180 kg", stage: 1 },
];

function Page() {
  return (
    <DashboardLayout title="Status Tracking" subtitle="Live progress of every order through the floor.">
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {orders.map((o) => (
          <div key={o.id} className="rounded-2xl bg-card border border-border p-5 shadow-soft hover:shadow-elegant transition">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-muted-foreground">{o.id}</div>
                <div className="font-display text-lg mt-0.5">{o.client}</div>
                <div className="text-sm text-muted-foreground">{o.fabric} · {o.qty}</div>
              </div>
              <Pill tone={o.stage >= 4 ? "success" : "info"}>
                {stages[o.stage]}
              </Pill>
            </div>

            <div className="mt-5">
              <div className="flex items-center gap-1">
                {stages.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${
                      i <= o.stage ? "bg-primary" : "bg-secondary"
                    }`}
                  />
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[11px] text-muted-foreground">
                {stages.map((s) => (
                  <span key={s} className="truncate">{s}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-6" />

      <Section title="Floor Summary">
        <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stages.map((s, i) => (
            <div key={s} className="rounded-xl bg-secondary/50 border border-border p-4">
              <div className="text-xs text-muted-foreground">{s}</div>
              <div className="font-display text-2xl mt-1">{[3, 2, 4, 5, 2, 1][i]}</div>
              <div className="text-[11px] text-muted-foreground">orders</div>
            </div>
          ))}
        </div>
      </Section>
    </DashboardLayout>
  );
}
