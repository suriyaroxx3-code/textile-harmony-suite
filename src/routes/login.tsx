import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2, Package } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — BrushPack" },
      { name: "description", content: "Manager login for BrushPack packaging operations." },
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

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate({ to: "/" }), 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-soft">
      <div className="pointer-events-none absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-accent/30 blur-3xl animate-blob [animation-delay:3s]" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-chart-3/20 blur-3xl animate-blob [animation-delay:6s]" />

      <div className="relative w-full max-w-md animate-scale-in">
        <div className="rounded-3xl bg-card/80 backdrop-blur-xl border border-border shadow-elegant p-8 sm:p-10">
          <div className="flex flex-col items-center text-center">
            <div className="relative h-16 w-16 rounded-2xl bg-hero grid place-items-center text-primary-foreground shadow-soft animate-float">
              <Package className="h-8 w-8" strokeWidth={2.2} />
              <span className="absolute -inset-1 rounded-2xl bg-primary/30 blur-lg -z-10" />
            </div>
            <h1 className="mt-5 font-display text-3xl tracking-tight">BrushPack</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to continue</p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-2 w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative mt-2">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-input bg-background/60 px-4 py-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-hero text-primary-foreground py-3 text-sm font-medium hover:opacity-95 transition shadow-soft hover:shadow-elegant flex items-center justify-center gap-2 disabled:opacity-70 hover-scale"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
