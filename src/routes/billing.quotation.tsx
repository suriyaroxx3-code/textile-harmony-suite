import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Section, Pill, Btn } from "@/components/PageHelpers";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/billing/quotation")({
  head: () => ({ meta: [{ title: "Quotation — Varnam" }] }),
  component: Page,
});

const quotes = [
  { id: "Q-0104", client: "Mira Exports", date: "04 May 2026", value: 184500, status: "Sent" },
  { id: "Q-0103", client: "Anjali Mills", date: "01 May 2026", value: 92800, status: "Accepted" },
  { id: "Q-0102", client: "Vanya Textiles", date: "28 Apr 2026", value: 47200, status: "Draft" },
  { id: "Q-0101", client: "Kirti Fashions", date: "22 Apr 2026", value: 256000, status: "Expired" },
];

const tone = (s: string) =>
  s === "Accepted" ? "success" : s === "Sent" ? "info" : s === "Expired" ? "danger" : "warn";

function Page() {
  return (
    <DashboardLayout title="Quotation" subtitle="Send and track price quotes to clients.">
      <Section
        title="All Quotations"
        action={<Btn variant="accent"><Plus className="h-4 w-4" /> New Quotation</Btn>}
      >
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-6 py-3">Quote #</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Value</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id} className="border-b border-border/60 last:border-0">
                  <td className="px-6 py-3 font-medium">{q.id}</td>
                  <td className="px-6 py-3">{q.client}</td>
                  <td className="px-6 py-3 text-muted-foreground">{q.date}</td>
                  <td className="px-6 py-3 font-medium">₹{q.value.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-3"><Pill tone={tone(q.status) as any}>{q.status}</Pill></td>
                  <td className="px-6 py-3 text-right">
                    <Btn variant="ghost">Open</Btn>
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
