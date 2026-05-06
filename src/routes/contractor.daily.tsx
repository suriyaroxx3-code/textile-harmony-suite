import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Section, Stat, Field, inputCls, Btn, Pill } from "@/components/PageHelpers";
import { UserPlus } from "lucide-react";

export const Route = createFileRoute("/contractor/daily")({
  head: () => ({ meta: [{ title: "Daily Workers Salary — Varnam" }] }),
  component: Page,
});

const workers = [
  { name: "Anil", role: "Helper", hours: 9, rate: 60, present: true },
  { name: "Bhavna", role: "Operator", hours: 8, rate: 90, present: true },
  { name: "Chandru", role: "Loader", hours: 0, rate: 70, present: false },
  { name: "Deepa", role: "QC", hours: 8, rate: 110, present: true },
  { name: "Ezhil", role: "Helper", hours: 7, rate: 60, present: true },
];

function Page() {
  return (
    <DashboardLayout title="Daily Workers Salary" subtitle="Track attendance and daily wages.">
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Stat label="Workers Present" value="4 / 5" hint="Today" />
        <Stat label="Total Wages" value="₹3,180" hint="Today" />
        <Stat label="This Week" value="₹19,420" hint="6 working days" />
      </div>

      <Section title="Quick Entry" action={<Btn variant="accent"><UserPlus className="h-4 w-4" /> Add Worker</Btn>}>
        <div className="grid md:grid-cols-4 gap-4">
          <Field label="Worker"><input className={inputCls} placeholder="Name" /></Field>
          <Field label="Role"><input className={inputCls} placeholder="Helper / Operator" /></Field>
          <Field label="Hours"><input type="number" className={inputCls} placeholder="8" /></Field>
          <Field label="Rate / hr (₹)"><input type="number" className={inputCls} placeholder="60" /></Field>
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
                <tr key={w.name} className="border-b border-border/60 last:border-0">
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
