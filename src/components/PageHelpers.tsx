import { ReactNode } from "react";

export function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h3 className="font-display text-lg">{title}</h3>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-soft">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="font-display text-3xl mt-1">{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export const inputCls =
  "w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition";

export function Btn({
  children,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "accent" }) {
  const v =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:opacity-95 shadow-soft"
      : variant === "accent"
      ? "bg-accent text-accent-foreground hover:opacity-95 shadow-soft"
      : "bg-secondary text-secondary-foreground hover:bg-secondary/70";
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${v} ${
        props.className ?? ""
      }`}
    >
      {children}
    </button>
  );
}

export function Pill({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "success" | "warn" | "danger" | "info";
}) {
  const t =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : tone === "warn"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : tone === "danger"
      ? "bg-red-50 text-red-700 border-red-200"
      : tone === "info"
      ? "bg-secondary text-secondary-foreground border-border"
      : "bg-secondary text-secondary-foreground border-border";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${t}`}>
      {children}
    </span>
  );
}
