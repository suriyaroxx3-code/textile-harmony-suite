// @ts-nocheck
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Section, Field, inputCls, Btn } from "@/components/PageHelpers";
import { api } from "@/lib/api";

export const Route = createFileRoute("/contractor/add")({
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", area: "", workers: 0, amount: 0 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/contractors", { ...form, status: "Pending" });
      navigate({ to: "/contractor/salary" });
    } catch (err) {
      alert(`Could not save contractor: ${err.message}`);
    }
  };

  return (
    <DashboardLayout title="Add New Contractor" subtitle="Register a new contractor for the packing floor.">
      <Section title="Contractor Details">
        <form onSubmit={handleSubmit} className="max-w-md space-y-4">
          <Field label="Contractor Name">
            <input required className={inputCls} placeholder="e.g. Suresh Pillai" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </Field>
          <Field label="Line / Area">
            <input required className={inputCls} placeholder="e.g. Cardboard Packing" value={form.area} onChange={e => setForm({...form, area: e.target.value})} />
          </Field>
          <Field label="Total Workers Managed">
            <input required type="number" className={inputCls} value={form.workers} onChange={e => setForm({...form, workers: Number(e.target.value)})} />
          </Field>
          <Field label="Monthly Amount Payable (₹)">
            <input required type="number" className={inputCls} value={form.amount} onChange={e => setForm({...form, amount: Number(e.target.value)})} />
          </Field>
          <div className="pt-4 flex gap-3">
            <Btn type="button" variant="ghost" onClick={() => history.back()}>Cancel</Btn>
            <Btn type="submit" variant="primary">Save Contractor</Btn>
          </div>
        </form>
      </Section>
    </DashboardLayout>
  );
}