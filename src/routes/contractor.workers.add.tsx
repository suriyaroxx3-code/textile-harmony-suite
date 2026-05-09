// @ts-nocheck
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Section, Field, inputCls, Btn } from "@/components/PageHelpers";

export const Route = createFileRoute("/contractor/workers/add")({
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ emp_id: "", name: "", role: "Sorter", rate: 70 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:8000/api/workers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, hours: 0, present: false }),
    });
    navigate({ to: "/contractor/daily" });
  };

  return (
    <DashboardLayout title="Add New Worker" subtitle="Register a new daily wage worker.">
      <Section title="Worker Details">
        <form onSubmit={handleSubmit} className="max-w-md space-y-4">
          <Field label="Employee ID">
            <input required className={inputCls} placeholder="EMP001" value={form.emp_id} onChange={e => setForm({...form, emp_id: e.target.value})} />
          </Field>
          <Field label="Name">
            <input required className={inputCls} placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </Field>
          <Field label="Role">
            <select className={inputCls} value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
              <option>Sorter</option>
              <option>Packer</option>
              <option>QC Inspector</option>
              <option>Loader</option>
              <option>Helper</option>
            </select>
          </Field>
          <Field label="Default Rate / hr (₹)">
            <input required type="number" className={inputCls} value={form.rate} onChange={e => setForm({...form, rate: Number(e.target.value)})} />
          </Field>
          <div className="pt-4 flex gap-3">
            <Btn type="button" variant="ghost" onClick={() => history.back()}>Cancel</Btn>
            <Btn type="submit" variant="primary">Save Worker</Btn>
          </div>
        </form>
      </Section>
    </DashboardLayout>
  );
}