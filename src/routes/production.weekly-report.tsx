import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/production/weekly-report")({
  head: () => ({ meta: [{ title: "Weekly Report — Varnam" }] }),
  component: Page,
});

const data = [
  { d: "Mon", input: 1490, output: 1459 },
  { d: "Tue", input: 1620, output: 1580 },
  { d: "Wed", input: 1380, output: 1350 },
  { d: "Thu", input: 1740, output: 1700 },
  { d: "Fri", input: 1820, output: 1790 },
  { d: "Sat", input: 1510, output: 1470 },
  { d: "Sun", input: 1100, output: 1078 },
];
const efficiency = data.map((x) => ({ d: x.d, e: +(100 * x.output / x.input).toFixed(1) }));

function Page() {
  return (
    <DashboardLayout title="Weekly Report" subtitle="Production trends, efficiency and dispatch summary.">
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Stat label="Total Input" value="10,660 kg" hint="This week" />
        <Stat label="Total Output" value="10,427 kg" hint="97.8% yield" />
        <Stat label="Avg. Efficiency" value="97.8%" hint="+0.6% vs last week" />
      </div>

      <Section title="Input vs Output (kg)">
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid stroke="oklch(0.9 0.02 80)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="input" fill="oklch(0.32 0.09 265)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="output" fill="oklch(0.72 0.16 55)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Section>

      <div className="h-6" />

      <Section title="Daily Efficiency (%)">
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={efficiency}>
              <CartesianGrid stroke="oklch(0.9 0.02 80)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis domain={[95, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="e"
                stroke="oklch(0.32 0.09 265)"
                strokeWidth={3}
                dot={{ r: 5, fill: "oklch(0.72 0.16 55)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Section>
    </DashboardLayout>
  );
}
