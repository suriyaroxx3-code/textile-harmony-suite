// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Section, Pill, Btn, Stat, Field, inputCls } from "@/components/PageHelpers";
import { Plus, X, Check } from "lucide-react";

export const Route = createFileRoute("/billing/quotation")({
  head: () => ({ meta: [{ title: "Quotation & Orders — BrushPack" }] }),
  component: Page,
});

function Page() {
  const [activeTab, setActiveTab] = useState("all"); // "all" or "status"
  const [isAdding, setIsAdding] = useState(false);
  
  // Data merged with generated bills (INV-) as requested
  const [records, setRecords] = useState([
    { id: "INV-2026-0184", contractor: "BrightBrush Co. Pvt. Ltd.", date: "09 May 2026", value: 35400, status: "Pending", type: "bill" },
    { id: "Q-0104",         contractor: "BrightBrush Co.",        date: "07 May 2026", value: 184500, status: "Sent", type: "quote" },
    { id: "Q-0103",         contractor: "ArtPro Supplies",        date: "04 May 2026", value: 92800,  status: "Accepted", type: "quote" },
    { id: "INV-2026-0180", contractor: "Plastix Industries",      date: "28 Apr 2026", value: 12000,  status: "Received", type: "bill" },
  ]);

  const [newEntry, setNewEntry] = useState({ id: "", contractor: "", date: "", value: "", status: "Draft" });

  const handleAdd = () => {
    if (!newEntry.id || !newEntry.contractor) return;
    setRecords([{ ...newEntry, value: Number(newEntry.value), type: "quote" }, ...records]);
    setIsAdding(false);
    setNewEntry({ id: "", contractor: "", date: "", value: "", status: "Draft" });
  };

  const tone = (s) => {
    const map = { Accepted: "success", Received: "success", Sent: "info", Pending: "warn", Draft: "muted" };
    return map[s] || "muted";
  };

  const stats = [
    { label: "Accepted", value: records.filter(r => r.status === "Accepted").length },
    { label: "Sent", value: records.filter(r => r.status === "Sent").length },
    { label: "Pending", value: records.filter(r => r.status === "Pending").length },
  ];

  return (
    <DashboardLayout title="Quotation" subtitle="Manage quotes and track order statuses.">
      <Section title="Quotation Overview">
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((s) => <Stat key={s.label} label={s.label} value={s.value} />)}
          <button 
            onClick={() => setActiveTab(activeTab === "status" ? "all" : "status")}
            className={`flex flex-col items-start justify-between rounded-2xl border p-5 transition-all ${activeTab === "status" ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-secondary/50 border-border"}`}
          >
            <span className="text-sm font-medium opacity-80 uppercase tracking-wider">Order Tracking</span>
            <span className="mt-2 text-3xl font-display font-semibold">STATUS</span>
          </button>
        </div>
      </Section>

      <Section
        title={activeTab === "status" ? "ORDER TRACKING STATUS" : "ALL QUOTATIONS & BILLS"}
        action={
          <div className="flex gap-2">
            <Link to="/billing/create"><Btn variant="ghost">Create Billing</Btn></Link>
            <Btn variant="accent" onClick={() => setIsAdding(true)}><Plus className="h-4 w-4" /> New Quotation</Btn>
          </div>
        }
      >
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-6 py-3 text-primary">ORDER ID</th>
                <th className="px-6 py-3">CONTRACTOR</th>
                <th className="px-6 py-3">DATE</th>
                <th className="px-6 py-3">AMT VALUE</th>
                <th className="px-6 py-3">STATUS</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {/* Editable row for new entries */}
              {isAdding && (
                <tr className="bg-secondary/20">
                  <td className="px-6 py-2"><input className={inputCls} placeholder="e.g. Q-0105" onChange={e => setNewEntry({...newEntry, id: e.target.value})} /></td>
                  <td className="px-6 py-2"><input className={inputCls} placeholder="Contractor name" onChange={e => setNewEntry({...newEntry, contractor: e.target.value})} /></td>
                  <td className="px-6 py-2"><input type="date" className={inputCls} onChange={e => setNewEntry({...newEntry, date: e.target.value})} /></td>
                  <td className="px-6 py-2"><input type="number" className={inputCls} placeholder="Amount" onChange={e => setNewEntry({...newEntry, value: e.target.value})} /></td>
                  <td className="px-6 py-2">Draft</td>
                  <td className="px-6 py-2 text-right flex gap-1 justify-end">
                    <Btn onClick={handleAdd} size="sm"><Check className="h-4 w-4" /></Btn>
                    <Btn variant="ghost" onClick={() => setIsAdding(false)} size="sm"><X className="h-4 w-4" /></Btn>
                  </td>
                </tr>
              )}

              {/* Data rows filtered by tab */}
              {records
                .filter(r => activeTab === "status" ? (r.status === "Pending" || r.status === "Received") : true)
                .map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/30 transition">
                  <td className="px-6 py-3 font-medium">{r.id}</td>
                  <td className="px-6 py-3">{r.contractor}</td>
                  <td className="px-6 py-3 text-muted-foreground">{r.date}</td>
                  <td className="px-6 py-3 font-medium">₹{r.value.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-3"><Pill tone={tone(r.status)}>{r.status}</Pill></td>
                  <td className="px-6 py-3 text-right">
                    <Btn variant="ghost">Edit</Btn>
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