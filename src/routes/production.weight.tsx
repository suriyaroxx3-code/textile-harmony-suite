import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Section, Stat, Field, inputCls, Btn, Pill } from "@/components/PageHelpers";
import { Plus, Scale } from "lucide-react";

export const Route = createFileRoute("/production/weight")({
  head: () => ({ meta: [{ title: "Weight Management — Varnam" }] }),
  component: Page,
});

const rows = [
  { batch: "A-2381", fabric: "Cotton Poplin", in: 540, out: 528 },
  { batch: "A-2380", fabric: "Viscose", in: 320, out: 312 },
  { batch: "A-2379", fabric: "Polyester Blend", in: 410, out: 405 },
  { batch: "A-2378", fabric: "Linen", in: 220, out: 214 },
];

function Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const inN = parseFloat(input) || 0;
  const outN = parseFloat(output) || 0;
  const remaining = Math.max(0, inN - outN);

  return (
    <DashboardLayout title="Weight Management" subtitle="Track input, output and remaining weight per batch.">
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Stat label="Input today" value="1,490 kg" hint="6 batches" />
        <Stat label="Output today" value="1,459 kg" hint="Dispatched + ready" />
        <Stat label="Remaining" value="31 kg" hint="Pending across batches" />
      </div>

      <Section
        title="Add Batch Weight"
        action={<Btn variant="accent"><Plus className="h-4 w-4" /> New Entry</Btn>}
      >
        <div className="grid md:grid-cols-4 gap-4">
          <Field label="Batch No."><input className={inputCls} placeholder="A-2382" /></Field>
          <Field label="Fabric Type"><input className={inputCls} placeholder="Cotton Poplin" /></Field>
          <Field label="Input Weight (kg)">
            <input
              type="number"
              className={inputCls}
              placeholder="0.00"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </Field>
          <Field label="Output Weight (kg)">
            <input
              type="number"
              className={inputCls}
              placeholder="0.00"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
            />
          </Field>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
          <div className="rounded-lg bg-secondary/60 border border-border px-4 py-2.5 text-sm">
            <span className="text-muted-foreground">Remaining: </span>
            <span className="font-display text-base">{remaining.toFixed(2)} kg</span>
          </div>
          <div className="flex gap-2">
            <Btn variant="ghost" onClick={() => { setInput(""); setOutput(""); }}>Reset</Btn>
            <Btn><Scale className="h-4 w-4" /> Save Entry</Btn>
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
                <th className="px-6 py-3">Fabric</th>
                <th className="px-6 py-3">Input</th>
                <th className="px-6 py-3">Output</th>
                <th className="px-6 py-3">Remaining</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const rem = r.in - r.out;
                return (
                  <tr key={r.batch} className="border-b border-border/60 last:border-0">
                    <td className="px-6 py-3 font-medium">{r.batch}</td>
                    <td className="px-6 py-3 text-muted-foreground">{r.fabric}</td>
                    <td className="px-6 py-3">{r.in} kg</td>
                    <td className="px-6 py-3">{r.out} kg</td>
                    <td className="px-6 py-3">{rem} kg</td>
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
