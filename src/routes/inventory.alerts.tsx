// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Section, Btn } from "@/components/PageHelpers";
import { AlertTriangle, ShoppingCart } from "lucide-react";

export const Route = createFileRoute("/inventory/alerts")({
  head: () => ({ meta: [{ title: "Low Stock Alerts — BrushPack" }] }),
  component: Page,
});

// Default alerts for reference
const defaultAlerts = [
  { name: "Cardboard Boxes — Small", qty: 1100, unit: "pcs",   min: 1500, supplier: "PackKraft Industries", eta: "2 days" },
  { name: "Blister Cards — 18mm",    qty: 920,  unit: "pcs",   min: 1500, supplier: "ClearPlast Co.",       eta: "3 days" },
  { name: "Sealing Tape — 48mm",     qty: 14,   unit: "rolls", min: 30,   supplier: "AdhesivePro",          eta: "1 day"  },
];

function Page() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Try to get alerts from localStorage first
    const stored = localStorage.getItem('lowStockNotifications');
    if (stored) {
      try {
        const items = JSON.parse(stored);
        setAlerts(items.map(item => ({
          ...item,
          supplier: "TBD",
          eta: "Pending"
        })));
      } catch (e) {
        setAlerts(defaultAlerts);
      }
    } else {
      setAlerts(defaultAlerts);
    }
  }, []);
  return (
    <DashboardLayout title="Low Stock Alerts" subtitle="Packaging materials below minimum threshold — reorder soon." lowStockItems={alerts}>
      <div className="rounded-2xl bg-warm/15 border border-accent/30 p-5 mb-6 flex gap-4 hover-lift">
        <div className="h-10 w-10 rounded-full bg-accent grid place-items-center text-accent-foreground shrink-0 animate-float">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <div className="font-medium text-foreground">{alerts.length} items need attention</div>
          <p className="text-sm text-muted-foreground">
            Reorder these to avoid packing line halts. Estimated lead times shown below.
          </p>
        </div>
        <Link to="/inventory/stock" className="ml-auto self-center text-sm text-primary hover:underline">
          View all stock →
        </Link>
      </div>

      <Section title="Items below minimum">
        <ul className="divide-y divide-border">
          {alerts.map((a, i) => {
            const deficit = a.min - a.qty;
            return (
              <li
                key={a.name}
                style={{ animationDelay: `${i * 80}ms` }}
                className="animate-fade-in py-4 flex flex-wrap items-center gap-4"
              >
                <div className="flex-1 min-w-[200px]">
                  <div className="font-medium">{a.name}</div>
                  <div className="text-xs text-muted-foreground">Supplier: {a.supplier} · ETA {a.eta}</div>
                </div>
                <div className="text-sm">
                  <span className="text-destructive font-medium">{a.qty.toLocaleString()} {a.unit}</span>
                  <span className="text-muted-foreground"> / {a.min.toLocaleString()} {a.unit} min</span>
                </div>
                <div className="text-xs text-muted-foreground">Short by {deficit.toLocaleString()} {a.unit}</div>
                <Btn variant="accent"><ShoppingCart className="h-4 w-4" /> Reorder</Btn>
              </li>
            );
          })}
        </ul>
      </Section>
    </DashboardLayout>
  );
}