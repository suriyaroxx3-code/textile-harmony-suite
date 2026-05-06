import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Varnam Textile Manager" },
      { name: "description", content: "Manager login for Varnam textile production management." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("manager");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate({ to: "/" }), 600);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left visual */}
      <div className="relative hidden lg:flex bg-hero overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,255,255,.08) 0 1px, transparent 1px 14px), repeating-linear-gradient(-45deg, rgba(255,255,255,.06) 0 1px, transparent 1px 14px)",
          }}
        />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/40 blur-3xl" />
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary-foreground/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary-foreground/15 backdrop-blur grid place-items-center font-display text-2xl">
              V
            </div>
            <div>
              <div className="font-display text-xl">Varnam</div>
              <div className="text-xs opacity-80">Textile Operations Suite</div>
            </div>
          </div>

          <div className="space-y-6 max-w-md">
            <h1 className="font-display text-5xl leading-tight">
              Weave precision into every meter of fabric.
            </h1>
            <p className="text-base opacity-85">
              From dye-house to dispatch — manage production, labour, billing and
              chemical stock from one calm, clear workspace.
            </p>
            <div className="flex gap-6 pt-4">
              {[
                ["12k+", "Bales tracked"],
                ["340", "Active workers"],
                ["99.2%", "On-time dispatch"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-2xl">{n}</div>
                  <div className="text-xs opacity-80">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs opacity-70">© {new Date().getFullYear()} Varnam Textiles</div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-soft">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-hero grid place-items-center text-primary-foreground font-display">V</div>
            <div className="font-display text-lg">Varnam</div>
          </div>

          <h2 className="font-display text-3xl text-foreground">Welcome back, Manager</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Sign in to view today's production, workers and stock.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition"
                placeholder="manager"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Password</label>
                <button type="button" className="text-xs text-primary hover:underline">
                  Forgot?
                </button>
              </div>
              <div className="relative mt-2">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-input bg-card px-4 py-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="rounded border-input" defaultChecked />
              Keep me signed in on this device
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary text-primary-foreground py-3 text-sm font-medium hover:opacity-95 transition shadow-soft flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Signing in…" : "Sign in"}
            </button>

            <p className="text-xs text-center text-muted-foreground">
              Demo build — any username and password will sign you in.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
