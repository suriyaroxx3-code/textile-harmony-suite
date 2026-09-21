// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Section, Stat, Field, inputCls, Btn, Pill } from "@/components/PageHelpers";
import { Plus, PackageCheck } from "lucide-react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/production/weight")({
  head: () => ({ meta: [{ title: "Output Tracking — BrushPack" }] }),
  component: Page,
});

function Page() {
  const [rows, setRows] = useState([]);
  const [batchNo, setBatchNo] = useState("");
  const [product, setProduct] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const inN = parseFloat(input) || 0;
  const outN = parseFloat(output) || 0;
  const remaining = Math.max(0, inN - outN);

  const fetchRows = () => {
    api.get("/api/batches").then(setRows).catch(console.error);
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const resetForm = () => {
    setBatchNo("");
    setProduct("");
    setInput("");
    setOutput("");
  };

  const handleSave = async () => {
    if (!batchNo.trim() || !product.trim()) {
      alert("Please enter a batch number and product.");
      return;
    }
    try {
      await api.post("/api/batches", {
        batch_no: batchNo.trim(),
        product: product.trim(),
        received: inN,
        packed: outN,
      });
      resetForm();
      fetchRows();
    } catch (err) {
      alert(`Could not save batch: ${err.message}`);
    }
  };

  // Today's totals for the stat cards
  const today = new Date().toISOString().slice(0, 10);
  const todayRows = rows.filter((r) => r.entry_date === today);
  const receivedToday = todayRows.reduce((s, r) => s + r.received, 0);
  const packedToday = todayRows.reduce((s, r) => s + r.packed, 0);

  return (
    <DashboardLayout title="Output Tracking" subtitle="Track received tips, packed units and remaining stock per batch.">
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Stat label="Tips Received Today" value={`${receivedToday.toLocaleString()} units`} hint={`${todayRows.length} batches`} />
        <Stat label="Packed Today" value={`${packedToday.toLocaleString()} units`} hint="Sealed & labelled" />
        <Stat label="Remaining" value={`${(receivedToday - packedToday).toLocaleString()} units`} hint="Pending across batches" />
      </div>

      <Section
        title="Add Batch Output"
        action={<Btn variant="accent"><Plus className="h-4 w-4" /> New Entry</Btn>}
      >
        <div className="grid md:grid-cols-4 gap-4">
          <Field label="Batch No."><input className={inputCls} placeholder="PK-2382" value={batchNo} onChange={(e) => setBatchNo(e.target.value)} /></Field>
          <Field label="Product / Pack Type"><input className={inputCls} placeholder="Round Tip 12mm — Cardboard" value={product} onChange={(e) => setProduct(e.target.value)} /></Field>
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
            <Btn variant="ghost" onClick={resetForm}>Reset</Btn>
            <Btn onClick={handleSave}><PackageCheck className="h-4 w-4" /> Save Entry</Btn>
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
                const rem = r.received - r.packed;
                return (
                  <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/30 transition">
                    <td className="px-6 py-3 font-medium">{r.batch_no}</td>
                    <td className="px-6 py-3 text-muted-foreground">{r.product}</td>
                    <td className="px-6 py-3">{r.received.toLocaleString()}</td>
                    <td className="px-6 py-3">{r.packed.toLocaleString()}</td>
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