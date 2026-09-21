// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Section, Stat } from "@/components/PageHelpers";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { api } from "@/lib/api";

export const Route = createFileRoute("/production/weekly-report")({
  head: () => ({ meta: [{ title: "Weekly Report — BrushPack" }] }),
  component: Page,
});

function Page() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/api/reports/weekly").then(setData).catch(console.error);
  }, []);

  const efficiency = data.map((x) => ({
    d: x.d,
    e: x.received ? +(100 * x.packed / x.received).toFixed(1) : 0,
  }));
  const totalReceived = data.reduce((s, x) => s + x.received, 0);
  const totalPacked = data.reduce((s, x) => s + x.packed, 0);
  const avgEff = totalReceived ? ((100 * totalPacked) / totalReceived).toFixed(1) : "0.0";

  return (
    <DashboardLayout title="Weekly Report" subtitle="Packing trends, line efficiency and dispatch summary.">
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Stat label="Tips Received" value={totalReceived.toLocaleString()} hint="This week" />
        <Stat label="Units Packed" value={totalPacked.toLocaleString()} hint={`${avgEff}% yield`} />
        <Stat label="Avg. Efficiency" value={`${avgEff}%`} hint="Packed ÷ received" />
      </div>

      <Section title="Received vs Packed (units)">
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid stroke="oklch(0.92 0.012 260)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="received" fill="oklch(0.38 0.15 270)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="packed" fill="oklch(0.74 0.16 65)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Section>

      <div className="h-6" />

      <Section title="Daily Efficiency (%)">
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={efficiency}>
              <CartesianGrid stroke="oklch(0.92 0.012 260)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis domain={[95, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="e"
                stroke="oklch(0.38 0.15 270)"
                strokeWidth={3}
                dot={{ r: 5, fill: "oklch(0.74 0.16 65)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Section>
    </DashboardLayout>
  );
}