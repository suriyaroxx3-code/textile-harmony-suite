import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Section, Field, inputCls, Btn } from "@/components/PageHelpers";
import { Plus, Trash2, Send, Save } from "lucide-react";

export const Route = createFileRoute("/billing/create")({
  head: () => ({ meta: [{ title: "Create Billing — BrushPack" }] }),
  component: Page,
});

function Page() {
  const [items, setItems] = useState([
    { desc: "Round Tip 12mm — Cardboard Pack", qty: 2500, rate: 12 },
    { desc: "Flat Tip 18mm — Plastic Sleeve",  qty: 1800, rate: 9  },
  ]);
  const sub = items.reduce((s, i) => s + i.qty * i.rate, 0);
  const gst = sub * 0.18;
  const total = sub + gst;

  const update = (idx, k, v) => {
    const next = [...items];
    next[idx][k] = k === "desc" ? v : Number(v);
    setItems(next);
  };

  return (
    <DashboardLayout title="Create Billing" subtitle="Generate a tax invoice for your client.">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Section title="Invoice Details">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Invoice No."><input className={inputCls} defaultValue="INV-2026-0184" /></Field>
              <Field label="Date"><input type="date" className={inputCls} defaultValue="2026-05-09" /></Field>
              <Field label="Client Name"><input className={inputCls} placeholder="BrightBrush Co. Pvt. Ltd." /></Field>
              <Field label="GSTIN"><input className={inputCls} placeholder="27AAACS1234A1Z5" /></Field>
              <Field label="Address"><input className={inputCls} placeholder="Plot 14, MIDC, Bhiwandi" /></Field>
              <Field label="Place of Supply"><input className={inputCls} placeholder="Maharashtra" /></Field>
            </div>
          </Section>

          <Section
            title="Line Items"
            action={
              <Btn variant="ghost" onClick={() => setItems([...items, { desc: "", qty: 0, rate: 0 }])}>
                <Plus className="h-4 w-4" /> Add Item
              </Btn>
            }
          >
            <div className="space-y-3">
              {items.map((it, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-12 md:col-span-6">
                    <Field label={i === 0 ? "Description" : ""}>
                      <input className={inputCls} value={it.desc} onChange={(e) => update(i, "desc", e.target.value)} />
                    </Field>
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <Field label={i === 0 ? "Qty (units)" : ""}>
                      <input type="number" className={inputCls} value={it.qty} onChange={(e) => update(i, "qty", e.target.value)} />
                    </Field>
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <Field label={i === 0 ? "Rate (₹)" : ""}>
                      <input type="number" className={inputCls} value={it.rate} onChange={(e) => update(i, "rate", e.target.value)} />
                    </Field>
                  </div>
                  <div className="col-span-3 md:col-span-1 text-sm font-medium pb-2.5">
                    ₹{(it.qty * it.rate).toLocaleString("en-IN")}
                  </div>
                  <button
                    onClick={() => setItems(items.filter((_, j) => j !== i))}
                    className="col-span-1 pb-2.5 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Summary">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>₹{sub.toLocaleString("en-IN")}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">GST (18%)</dt>
                <dd>₹{gst.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</dd>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-display text-xl">
                <dt>Total</dt>
                <dd>₹{total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</dd>
              </div>
            </dl>
            <div className="mt-6 grid gap-2">
              <Btn><Send className="h-4 w-4" /> Send Invoice</Btn>
              <Btn variant="ghost"><Save className="h-4 w-4" /> Save Draft</Btn>
            </div>
          </Section>

          <Section title="Notes">
            <textarea
              className={`${inputCls} min-h-28`}
              placeholder="Payment terms, bank details, special instructions…"
              defaultValue="Payment due within 30 days. Bank: HDFC, A/c 0123456789, IFSC HDFC0000123."
            />
          </Section>
        </div>
      </div>
    </DashboardLayout>
  );
}
