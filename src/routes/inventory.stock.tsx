// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Section, Stat, Btn, Pill } from "@/components/PageHelpers";
import { Plus, Search } from "lucide-react";

export const Route = createFileRoute("/inventory/stock")({
  head: () => ({ meta: [{ title: "Stock — BrushPack" }] }),
  component: Page,
});

const stock = [
  { name: "Cardboard Sheets — A4",       cat: "Cardboard", qty: 4200, unit: "sheets", min: 2000 },
  { name: "Cardboard Boxes — Small",     cat: "Cardboard", qty: 1100, unit: "pcs",    min: 1500 },
  { name: "Plastic Sleeves — Clear 12mm", cat: "Plastic",   qty: 8400, unit: "pcs",    min: 3000 },
  { name: "Blister Cards — 18mm",         cat: "Plastic",   qty: 920,  unit: "pcs",    min: 1500 },
  { name: "Printed Labels (Roll)",        cat: "Supplies",  qty: 32,   unit: "rolls",  min: 20   },
  { name: "Sealing Tape — 48mm",          cat: "Supplies",  qty: 14,   unit: "rolls",  min: 30   },
  { name: "Hot Glue Sticks",              cat: "Supplies",  qty: 540,  unit: "pcs",    min: 200  },
];

function Page() {
  const low = stock.filter(s => s.qty < s.min).length;
  return (
    <DashboardLayout title="Stock" subtitle="Live inventory of cardboard, plastic packaging and supplies.">
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Stat label="Total SKUs" value={String(stock.length)} />
        <Stat label="Stock Value" value="₹4.8L" hint="At current rates" />
        <Stat label="Below Minimum" value={String(low)} hint="Action needed" />
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
                const isLow = s.qty < s.min;
                return (
                  <tr key={s.name} className="border-b border-border/60 last:border-0 hover:bg-secondary/30 transition">
                    <td className="px-6 py-3 font-medium">{s.name}</td>
                    <td className="px-6 py-3 text-muted-foreground">{s.cat}</td>
                    <td className="px-6 py-3">{s.qty.toLocaleString()} {s.unit}</td>
                    <td className="px-6 py-3 text-muted-foreground">{s.min.toLocaleString()} {s.unit}</td>
                    <td className="px-6 py-3 w-72">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                          <div
                            className={`h-full transition-all ${isLow ? "bg-destructive" : "bg-primary"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <Pill tone={isLow ? "danger" : "success"}>{isLow ? "Low" : "OK"}</Pill>
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