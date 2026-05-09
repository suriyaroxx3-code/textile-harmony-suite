// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Section, Stat, Field, inputCls, Btn, Pill } from "@/components/PageHelpers";
import { Plus, PackageCheck } from "lucide-react";

export const Route = createFileRoute("/production/weight")({
  head: () => ({ meta: [{ title: "Output Tracking — BrushPack" }] }),
  component: Page,
});

const rows = [
  { batch: "PK-2381", product: "Round Tip 12mm — Cardboard", input: 2500, output: 2480 },
  { batch: "PK-2380", product: "Flat Tip 18mm — Plastic Sleeve", input: 1800, output: 1792 },
  { batch: "PK-2379", product: "Angled Tip 10mm — Blister Pack", input: 3200, output: 3168 },
  { batch: "PK-2378", product: "Detail Tip 6mm — Cardboard Box", input: 1600, output: 1590 },
];

function Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const inN = parseFloat(input) || 0;
  const outN = parseFloat(output) || 0;
  const remaining = Math.max(0, inN - outN);

  return (
    <DashboardLayout title="Output Tracking" subtitle="Track received tips, packed units and remaining stock per batch.">
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Stat label="Tips Received Today" value="9,100 units" hint="4 batches" />
        <Stat label="Packed Today" value="9,030 units" hint="Sealed & labelled" />
        <Stat label="Remaining" value="70 units" hint="Pending across batches" />
      </div>

      <Section
        title="Add Batch Output"
        action={<Btn variant="accent"><Plus className="h-4 w-4" /> New Entry</Btn>}
      >
        <div className="grid md:grid-cols-4 gap-4">
          <Field label="Batch No."><input className={inputCls} placeholder="PK-2382" /></Field>
          <Field label="Product / Pack Type"><input className={inputCls} placeholder="Round Tip 12mm — Cardboard" /></Field>
          <Field label="Tips Received (units)">
            <input
              type="number"
              className={inputCls}
              placeholder="0"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </Field>
          <Field label="Packed Units">
            <input
              type="number"
              className={inputCls}
              placeholder="0"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
            />
          </Field>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
          <div className="rounded-lg bg-secondary/60 border border-border px-4 py-2.5 text-sm">
            <span className="text-muted-foreground">Remaining: </span>
            <span className="font-display text-base">{remaining.toFixed(0)} units</span>
          </div>
          <div className="flex gap-2">
            <Btn variant="ghost" onClick={() => { setInput(""); setOutput(""); }}>Reset</Btn>
            <Btn><PackageCheck className="h-4 w-4" /> Save Entry</Btn>
          </div>
        </div>
      </Section>

      <div className="h-6" />

      <Section title="Recent Batches">
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-6 py-3">Batch</th>
                <th className="px-6 py-3">Product / Pack</th>
                <th className="px-6 py-3">Received</th>
                <th className="px-6 py-3">Packed</th>
                <th className="px-6 py-3">Remaining</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const rem = r.input - r.output;
                return (
                  <tr key={r.batch} className="border-b border-border/60 last:border-0 hover:bg-secondary/30 transition">
                    <td className="px-6 py-3 font-medium">{r.batch}</td>
                    <td className="px-6 py-3 text-muted-foreground">{r.product}</td>
                    <td className="px-6 py-3">{r.input.toLocaleString()}</td>
                    <td className="px-6 py-3">{r.output.toLocaleString()}</td>
                    <td className="px-6 py-3">{rem.toLocaleString()}</td>
                    <td className="px-6 py-3">
                      <Pill tone={rem === 0 ? "success" : "warn"}>
                        {rem === 0 ? "Completed" : "Pending"}
                      </Pill>
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