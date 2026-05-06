import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Section, Btn } from "@/components/PageHelpers";
import { AlertTriangle, ShoppingCart } from "lucide-react";

export const Route = createFileRoute("/inventory/alerts")({
  head: () => ({ meta: [{ title: "Low Stock Alerts — Varnam" }] }),
  component: Page,
});

const alerts = [
  { name: "Reactive Blue 21", qty: 12, unit: "kg", min: 25, supplier: "Atul Dyes Pvt. Ltd.", eta: "2 days" },
  { name: "Hydrogen Peroxide 50%", qty: 80, unit: "L", min: 100, supplier: "Sigma Chem", eta: "1 day" },
  { name: "Acetic Acid", qty: 18, unit: "L", min: 30, supplier: "Pearl Chemicals", eta: "3 days" },
];

function Page() {
  return (
    <DashboardLayout title="Low Stock Alerts" subtitle="Items below minimum threshold — reorder soon.">
      <div className="rounded-2xl bg-warm/15 border border-accent/30 p-5 mb-6 flex gap-4">
        <div className="h-10 w-10 rounded-full bg-accent grid place-items-center text-accent-foreground shrink-0">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <div className="font-medium text-foreground">3 items need attention</div>
          <p className="text-sm text-muted-foreground">
            Reorder these to avoid production halts. Estimated lead times shown below.
          </p>
        </div>
        <Link to="/inventory/stock" className="ml-auto self-center text-sm text-primary hover:underline">
          View all stock →
        </Link>
      </div>

      <Section title="Items below minimum">
        <ul className="divide-y divide-border">
          {alerts.map((a) => {
            const deficit = a.min - a.qty;
            return (
              <li key={a.name} className="py-4 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="font-medium">{a.name}</div>
                  <div className="text-xs text-muted-foreground">Supplier: {a.supplier} · ETA {a.eta}</div>
                </div>
                <div className="text-sm">
                  <span className="text-destructive font-medium">{a.qty} {a.unit}</span>
                  <span className="text-muted-foreground"> / {a.min} {a.unit} min</span>
                </div>
                <div className="text-xs text-muted-foreground">Short by {deficit} {a.unit}</div>
                <Btn variant="accent"><ShoppingCart className="h-4 w-4" /> Reorder</Btn>
              </li>
            );
          })}
        </ul>
      </Section>
    </DashboardLayout>
  );
}
