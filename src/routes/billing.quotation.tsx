import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
  const [editingId, setEditingId] = useState(null);
  
  // Data merged with generated bills (INV-) as requested
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("billingRecords") || "[]");
    setRecords(stored);
  }, []);

  const [newEntry, setNewEntry] = useState({
    id: "",
    contractor: "",
    date: "",
    value: "",
    status: "Draft"
  });
  const [editEntry, setEditEntry] = useState({
    id: "",
    contractor: "",
    date: "",
    value: "",
    status: ""
  });

  const handleAdd = () => {
    if (!newEntry.id || !newEntry.contractor) return;
    const updated = [{ ...newEntry, value: Number(newEntry.value), type: "quote" }, ...records];
    setRecords(updated);
    localStorage.setItem("billingRecords", JSON.stringify(updated));
    setIsAdding(false);
    setNewEntry({ id: "", contractor: "", date: "", value: "", status: "Draft" });
  };

  const handleEdit = () => {
    if (!editEntry.id || !editEntry.contractor) return;
    const updated = records.map((r) =>
      r.id === editingId ? { ...editEntry, value: Number(editEntry.value) } : r
    );
    setRecords(updated);
    localStorage.setItem("billingRecords", JSON.stringify(updated));
    setEditingId(null);
    setEditEntry({ id: "", contractor: "", date: "", value: "", status: "" });
  };

  const tone = (s) => {
    const map = {
      Accepted: "success",
      Received: "success",
      Sent: "info",
      Pending: "warn",
      Draft: "muted"
    };
    return map[s] || "muted";
  };

  const stats = [
    { label: "Accepted", value: records.filter((r) => r.status === "Accepted").length },
    { label: "Sent", value: records.filter((r) => r.status === "Sent").length },
    { label: "Pending", value: records.filter((r) => r.status === "Pending").length },
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
                  editingId === r.id ? (
                    <tr key={r.id} className="bg-secondary/20">
                      <td className="px-6 py-2"><input className={inputCls} value={editEntry.id} onChange={e => setEditEntry({...editEntry, id: e.target.value})} /></td>
                      <td className="px-6 py-2"><input className={inputCls} value={editEntry.contractor} onChange={e => setEditEntry({...editEntry, contractor: e.target.value})} /></td>
                      <td className="px-6 py-2"><input type="date" className={inputCls} value={editEntry.date} onChange={e => setEditEntry({...editEntry, date: e.target.value})} /></td>
                      <td className="px-6 py-2"><input type="number" className={inputCls} value={editEntry.value} onChange={e => setEditEntry({...editEntry, value: e.target.value})} /></td>
                      <td className="px-6 py-2">
                        <select className={inputCls} value={editEntry.status} onChange={e => setEditEntry({...editEntry, status: e.target.value})}>
                          <option value="Draft">Draft</option>
                          <option value="Sent">Sent</option>
                          <option value="Pending">Pending</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Received">Received</option>
                        </select>
                      </td>
                      <td className="px-6 py-2 text-right flex gap-1 justify-end">
                        <Btn onClick={handleEdit} size="sm"><Check className="h-4 w-4" /></Btn>
                        <Btn variant="ghost" onClick={() => setEditingId(null)} size="sm"><X className="h-4 w-4" /></Btn>
                      </td>
                    </tr>
                  ) : (
                    <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/30 transition">
                      <td className="px-6 py-3 font-medium">{r.id}</td>
                      <td className="px-6 py-3">{r.contractor}</td>
                      <td className="px-6 py-3 text-muted-foreground">{r.date}</td>
                      <td className="px-6 py-3 font-medium">₹{r.value.toLocaleString("en-IN")}</td>
                      <td className="px-6 py-3"><Pill tone={tone(r.status)}>{r.status}</Pill></td>
                      <td className="px-6 py-3 text-right">
                        <Btn variant="ghost" onClick={() => { setEditingId(r.id); setEditEntry(r); }}>Edit</Btn>
                      </td>
                    </tr>
                  )
                ))}
            </tbody>
          </table>
        </div>
      </Section>
    </DashboardLayout>
  );
}