import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Section, Stat, Field, inputCls, Btn, Pill } from "@/components/PageHelpers";
import { Plus, Scale } from "lucide-react";

export const Route = createFileRoute("/production/weight")({
  head: () => ({ meta: [{ title: "Weight Management — Varnam" }] }),
  component: Page,
});

const rows = [
  { batch: "A-2381", fabric: "Cotton Poplin", in: 540, out: 528, loss: 2.2 },
  { batch: "A-2380", fabric: "Viscose", in: 320, out: 312, loss: 2.5 },
  { batch: "A-2379", fabric: "Polyester Blend", in: 410, out: 405, loss: 1.2 },
  { batch: "A-2378", fabric: "Linen", in: 220, out: 214, loss: 2.7 },
];

function Page() {
  return (
    <DashboardLayout title="Weight Management" subtitle="Track input, output and process loss per batch.">
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Stat label="Input today" value="1,490 kg" hint="6 batches" />
        <Stat label="Output today" value="1,459 kg" hint="Dispatched + ready" />
        <Stat label="Avg. loss" value="2.1%" hint="Within target (≤3%)" />
      </div>

      <Section
        title="Add Batch Weight"
        action={<Btn variant="accent"><Plus className="h-4 w-4" /> New Entry</Btn>}
      >
        <div className="grid md:grid-cols-4 gap-4">
          <Field label="Batch No."><input className={inputCls} placeholder="A-2382" /></Field>
          <Field label="Fabric Type"><input className={inputCls} placeholder="Cotton Poplin" /></Field>
          <Field label="Input Weight (kg)"><input type="number" className={inputCls} placeholder="0.00" /></Field>
          <Field label="Output Weight (kg)"><input type="number" className={inputCls} placeholder="0.00" /></Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Btn variant="ghost">Reset</Btn>
          <Btn><Scale className="h-4 w-4" /> Save Entry</Btn>
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
                <th className="px-6 py-3">Loss</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.batch} className="border-b border-border/60 last:border-0">
                  <td className="px-6 py-3 font-medium">{r.batch}</td>
                  <td className="px-6 py-3 text-muted-foreground">{r.fabric}</td>
                  <td className="px-6 py-3">{r.in} kg</td>
                  <td className="px-6 py-3">{r.out} kg</td>
                  <td className="px-6 py-3">{r.loss}%</td>
                  <td className="px-6 py-3">
                    <Pill tone={r.loss > 2.5 ? "warn" : "success"}>
                      {r.loss > 2.5 ? "Review" : "Within target"}
                    </Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </DashboardLayout>
  );
}
