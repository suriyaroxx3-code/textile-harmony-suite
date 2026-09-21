// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Section, Pill, Btn } from "@/components/PageHelpers";
import { PackagePlus, FileText } from "lucide-react";

export const Route = createFileRoute("/ststus")({
  head: () => ({ meta: [{ title: "Stock Status — BrushPack" }] }),
  component: Page,
});

// Mock data representing requested stocks and bills from contractors
const stockRequests = [
  { id: "REQ-2055", contractor: "Prime Manufacturing Ltd.", date: "08 May 2026", items: "Round Tip 12mm (5,000 units)", bill: "BILL-882", status: "Pending" },
  { id: "REQ-2054", contractor: "Plastix Industries",       date: "05 May 2026", items: "Plastic Sleeves (10,000 units)", bill: "BILL-879", status: "Received" },
  { id: "REQ-2053", contractor: "TimberWorks Co.",          date: "02 May 2026", items: "Wooden Handles (2,500 units)",   bill: "BILL-870", status: "Pending" },
  { id: "REQ-2052", contractor: "Prime Manufacturing Ltd.", date: "28 Apr 2026", items: "Flat Tip 18mm (3,000 units)",    bill: "BILL-865", status: "Received" },
];

// Helper to assign the correct pill color based on status
const tone = (s) => (s === "Received" ? "success" : "warn");

function Page() {
  return (
    <DashboardLayout title="Stock Status" subtitle="Track requested stocks and contractor bills.">
      <Section
        title="Contractor Orders"
        action={<Btn variant="accent"><PackagePlus className="h-4 w-4 mr-2" /> Request Stock</Btn>}
      >
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-6 py-3">Req #</th>
                <th className="px-6 py-3">Contractor</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Requested Stocks</th>
                <th className="px-6 py-3">Requested Bill</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {stockRequests.map((req) => (
                <tr key={req.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/30 transition">
                  <td className="px-6 py-3 font-medium">{req.id}</td>
                  <td className="px-6 py-3">{req.contractor}</td>
                  <td className="px-6 py-3 text-muted-foreground">{req.date}</td>
                  <td className="px-6 py-3">{req.items}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span className="text-foreground">{req.bill}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3"><Pill tone={tone(req.status)}>{req.status}</Pill></td>
                  <td className="px-6 py-3 text-right">
                    <Btn variant="ghost">Details</Btn>
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