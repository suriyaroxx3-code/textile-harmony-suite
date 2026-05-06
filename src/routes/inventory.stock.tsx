import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Section, Stat, Btn, Pill } from "@/components/PageHelpers";
import { Plus, Search } from "lucide-react";

export const Route = createFileRoute("/inventory/stock")({
  head: () => ({ meta: [{ title: "Stock — Varnam" }] }),
  component: Page,
});

const stock = [
  { name: "Reactive Red 195", cat: "Dye", qty: 42, unit: "kg", min: 25 },
  { name: "Reactive Blue 21", cat: "Dye", qty: 12, unit: "kg", min: 25 },
  { name: "Caustic Soda Flakes", cat: "Chemical", qty: 320, unit: "kg", min: 100 },
  { name: "Hydrogen Peroxide 50%", cat: "Chemical", qty: 80, unit: "L", min: 100 },
  { name: "Soda Ash", cat: "Chemical", qty: 540, unit: "kg", min: 200 },
  { name: "Acetic Acid", cat: "Chemical", qty: 18, unit: "L", min: 30 },
];

function Page() {
  return (
    <DashboardLayout title="Stock" subtitle="Live inventory of dyes, chemicals and consumables.">
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Stat label="Total SKUs" value="38" />
        <Stat label="Stock Value" value="₹6.4L" hint="At current rates" />
        <Stat label="Below Minimum" value="3" hint="Action needed" />
      </div>

      <Section
        title="Inventory"
        action={
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/60 border border-border w-56">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input placeholder="Search items…" className="bg-transparent outline-none text-sm w-full" />
            </div>
            <Btn variant="accent"><Plus className="h-4 w-4" /> Add Item</Btn>
          </div>
        }
      >
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-6 py-3">Item</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Available</th>
                <th className="px-6 py-3">Minimum</th>
                <th className="px-6 py-3">Level</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((s) => {
                const pct = Math.min(100, Math.round((s.qty / (s.min * 2)) * 100));
                const low = s.qty < s.min;
                return (
                  <tr key={s.name} className="border-b border-border/60 last:border-0">
                    <td className="px-6 py-3 font-medium">{s.name}</td>
                    <td className="px-6 py-3 text-muted-foreground">{s.cat}</td>
                    <td className="px-6 py-3">{s.qty} {s.unit}</td>
                    <td className="px-6 py-3 text-muted-foreground">{s.min} {s.unit}</td>
                    <td className="px-6 py-3 w-72">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                          <div
                            className={`h-full ${low ? "bg-destructive" : "bg-primary"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <Pill tone={low ? "danger" : "success"}>{low ? "Low" : "OK"}</Pill>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>
    </DashboardLayout>
  );
}
