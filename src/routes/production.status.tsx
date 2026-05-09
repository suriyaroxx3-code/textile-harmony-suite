import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Section, Pill } from "@/components/PageHelpers";

export const Route = createFileRoute("/production/status")({
  head: () => ({ meta: [{ title: "Order Status — BrushPack" }] }),
  component: Page,
});

const stages = ["Receiving", "Sorting", "Packing", "Sealing", "QC", "Dispatch"];
const orders = [
  { id: "PK-2381", client: "BrightBrush Co.", product: "Round Tip 12mm", qty: "2,500", stage: 3 },
  { id: "PK-2380", client: "ArtPro Supplies", product: "Flat Tip 18mm", qty: "1,800", stage: 2 },
  { id: "PK-2379", client: "Studio Mart", product: "Angled Tip 10mm", qty: "3,200", stage: 4 },
  { id: "PK-2378", client: "ColorWorks", product: "Detail Tip 6mm", qty: "1,600", stage: 5 },
  { id: "PK-2377", client: "Maven Brushes", product: "Fan Tip 25mm", qty: "900", stage: 1 },
];

function Page() {
  return (
    <DashboardLayout title="Order Status" subtitle="Live progress of every packing order on the floor.">
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {orders.map((o, i) => (
          <div
            key={o.id}
            style={{ animationDelay: `${i * 70}ms` }}
            className="animate-fade-in rounded-2xl bg-card border border-border p-5 shadow-soft hover-lift"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-muted-foreground">{o.id}</div>
                <div className="font-display text-lg mt-0.5">{o.client}</div>
                <div className="text-sm text-muted-foreground">{o.product} · {o.qty} units</div>
              </div>
              <Pill tone={o.stage >= 4 ? "success" : "info"}>
                {stages[o.stage]}
              </Pill>
            </div>

            <div className="mt-5">
              <div className="flex items-center gap-1">
                {stages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      idx <= o.stage ? "bg-primary" : "bg-secondary"
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
            <div key={s} className="rounded-xl bg-secondary/50 border border-border p-4 hover-lift">
              <div className="text-xs text-muted-foreground">{s}</div>
              <div className="font-display text-2xl mt-1">{[2, 3, 5, 4, 2, 1][i]}</div>
              <div className="text-[11px] text-muted-foreground">orders</div>
            </div>
          ))}
        </div>
      </Section>
    </DashboardLayout>
  );
}
