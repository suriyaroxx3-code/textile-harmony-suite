// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Section, Pill } from "@/components/PageHelpers";
import { api } from "@/lib/api";

export const Route = createFileRoute("/production/status")({
  head: () => ({ meta: [{ title: "Order Status — BrushPack" }] }),
  component: Page,
});

const stages = ["Receiving", "Sorting", "Packing", "Sealing", "QC", "Dispatch"];

function Page() {
  const [orders, setOrders] = useState([]);
  const [stageCounts, setStageCounts] = useState(stages.map(() => 0));

  useEffect(() => {
    api.get("/api/orders").then(setOrders).catch(console.error);
    api
      .get("/api/orders/stages")
      .then((rows) => setStageCounts(rows.map((r) => r.count)))
      .catch(console.error);
  }, []);

  return (
    <DashboardLayout title="Order Status" subtitle="Live progress of every packing order on the floor.">
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {orders.map((o, i) => (
          <div
            key={o.id}
            style={{ animationDelay: `${i * 70}ms` }}
            className="animate-fade-in rounded-2xl bg-card border border-border p-5 shadow-soft hover-lift"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-muted-foreground">{o.order_id}</div>
                <div className="font-display text-lg mt-0.5">{o.client}</div>
                <div className="text-sm text-muted-foreground">{o.product} · {o.qty.toLocaleString()} units</div>
              </div>
              <Pill tone={o.stage >= 4 ? "success" : "info"}>
                {stages[o.stage]}
              </Pill>
            </div>

            <div className="mt-5">
              <div className="flex items-center gap-1">
                {stages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      idx <= o.stage ? "bg-primary" : "bg-secondary"
                    }`}
                  />
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[11px] text-muted-foreground">
                {stages.map((s) => (
                  <span key={s} className="truncate">{s}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-6" />

      <Section title="Floor Summary">
        <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stages.map((s, i) => (
            <div key={s} className="rounded-xl bg-secondary/50 border border-border p-4 hover-lift">
              <div className="text-xs text-muted-foreground">{s}</div>
              <div className="font-display text-2xl mt-1">{stageCounts[i]}</div>
              <div className="text-[11px] text-muted-foreground">orders</div>
            </div>
          ))}
        </div>
      </Section>
    </DashboardLayout>
  );
}