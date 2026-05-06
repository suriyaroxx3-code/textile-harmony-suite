import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Section, Stat, Pill, Btn } from "@/components/PageHelpers";
import { Download } from "lucide-react";

export const Route = createFileRoute("/contractor/salary")({
  head: () => ({ meta: [{ title: "Contractor Salary — Varnam" }] }),
  component: Page,
});

const rows = [
  { name: "Ramesh Kumar", area: "Dyeing", workers: 24, amount: 84000, status: "Paid" },
  { name: "Suresh Pillai", area: "Finishing", workers: 18, amount: 62500, status: "Pending" },
  { name: "Mahesh Naidu", area: "QC & Packing", workers: 12, amount: 41200, status: "Paid" },
  { name: "Lakshmi Reddy", area: "Pre-treatment", workers: 16, amount: 56800, status: "Pending" },
];

function Page() {
  return (
    <DashboardLayout title="Contractor Salary" subtitle="Monthly payouts to area contractors.">
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Stat label="Total Payable" value="₹2,44,500" hint="May 2026" />
        <Stat label="Paid" value="₹1,25,200" hint="2 contractors" />
        <Stat label="Pending" value="₹1,19,300" hint="2 contractors" />
      </div>

      <Section
        title="Contractors"
        action={<Btn variant="ghost"><Download className="h-4 w-4" /> Export</Btn>}
      >
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-6 py-3">Contractor</th>
                <th className="px-6 py-3">Area</th>
                <th className="px-6 py-3">Workers</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name} className="border-b border-border/60 last:border-0">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-warm grid place-items-center text-accent-foreground text-xs font-medium">
                        {r.name[0]}
                      </div>
                      <span className="font-medium">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">{r.area}</td>
                  <td className="px-6 py-3">{r.workers}</td>
                  <td className="px-6 py-3 font-medium">₹{r.amount.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-3">
                    <Pill tone={r.status === "Paid" ? "success" : "warn"}>{r.status}</Pill>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Btn variant={r.status === "Paid" ? "ghost" : "primary"}>
                      {r.status === "Paid" ? "Receipt" : "Pay now"}
                    </Btn>
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
