// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Section, Stat, Field, inputCls, Btn, Pill } from "@/components/PageHelpers";
import { UserPlus } from "lucide-react";

export const Route = createFileRoute("/contractor/daily")({
  head: () => ({ meta: [{ title: "Daily Workers Salary — BrushPack" }] }),
  component: Page,
});

const workers = [
  { name: "Anil",    role: "Sorter",       hours: 9, rate: 70,  present: true },
  { name: "Bhavna",  role: "Packer",       hours: 8, rate: 90,  present: true },
  { name: "Chandru", role: "Loader",       hours: 0, rate: 75,  present: false },
  { name: "Deepa",   role: "QC Inspector", hours: 8, rate: 110, present: true },
  { name: "Ezhil",   role: "Sealer",       hours: 7, rate: 80,  present: true },
  { name: "Farhan",  role: "Helper",       hours: 9, rate: 65,  present: true },
];

function Page() {
  const present = workers.filter(w => w.present).length;
  const dayWages = workers.reduce((s, w) => s + w.hours * w.rate, 0);

  return (
    <DashboardLayout title="Daily Workers Salary" subtitle="Track attendance and daily wages across the packing floor.">
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Stat label="Workers Present" value={`${present} / ${workers.length}`} hint="Today" />
        <Stat label="Total Wages Today" value={`₹${dayWages.toLocaleString("en-IN")}`} hint="6 working hrs avg" />
        <Stat label="This Week" value="₹38,420" hint="6 working days" />
      </div>

      <Section title="Quick Entry" action={<Btn variant="accent"><UserPlus className="h-4 w-4" /> Add Worker</Btn>}>
        <div className="grid md:grid-cols-4 gap-4">
          <Field label="Worker"><input className={inputCls} placeholder="Name" /></Field>
          <Field label="Role"><input className={inputCls} placeholder="Sorter / Packer / QC" /></Field>
          <Field label="Hours"><input type="number" className={inputCls} placeholder="8" /></Field>
          <Field label="Rate / hr (₹)"><input type="number" className={inputCls} placeholder="70" /></Field>
        </div>
        <div className="mt-5 flex justify-end"><Btn>Mark Attendance</Btn></div>
      </Section>

      <div className="h-6" />

      <Section title="Today's Attendance">
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-6 py-3">Worker</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Hours</th>
                <th className="px-6 py-3">Rate</th>
                <th className="px-6 py-3">Wage</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w) => (
                <tr key={w.name} className="border-b border-border/60 last:border-0 hover:bg-secondary/30 transition">
                  <td className="px-6 py-3 font-medium">{w.name}</td>
                  <td className="px-6 py-3 text-muted-foreground">{w.role}</td>
                  <td className="px-6 py-3">{w.hours}</td>
                  <td className="px-6 py-3">₹{w.rate}</td>
                  <td className="px-6 py-3 font-medium">₹{w.hours * w.rate}</td>
                  <td className="px-6 py-3">
                    <Pill tone={w.present ? "success" : "danger"}>
                      {w.present ? "Present" : "Absent"}
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