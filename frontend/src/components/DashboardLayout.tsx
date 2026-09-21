// @ts-nocheck
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  PackageCheck,
  Activity,
  LineChart,
  Users,
  UserCog,
  FileText,
  ReceiptText,
  Boxes,
  AlertTriangle,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  Package,
  AlertCircle,
} from "lucide-react";
import { api } from "@/lib/api";

const groups = [
  { title: "Overview", items: [{ to: "/", label: "Dashboard", icon: LayoutDashboard }] },
  {
    title: "Packing Production",
    items: [
      { to: "/production/weight", label: "Output Tracking", icon: PackageCheck },
      { to: "/production/status", label: "Order Status", icon: Activity },
      { to: "/production/weekly-report", label: "Weekly Report", icon: LineChart },
    ],
  },
  {
    title: "Workforce",
    items: [
      { to: "/contractor/salary", label: "Contractor Salary", icon: UserCog },
      { to: "/contractor/daily", label: "Daily Workers", icon: Users },
    ],
  },
  {
    title: "Billing & Accounts",
    items: [
      { to: "/billing/create", label: "Create Billing", icon: ReceiptText },
      { to: "/billing/quotation", label: "Quotation", icon: FileText },
    ],
  },
  {
    title: "Materials & Inventory",
    items: [
      { to: "/inventory/stock", label: "Stock", icon: Boxes },
      { to: "/inventory/alerts", label: "Low Stock Alerts", icon: AlertTriangle },
    ],
  },
];

export function DashboardLayout({ children, title, subtitle, lowStockItems = [] }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [openGroups, setOpenGroups] = useState(() => {
    const init = {};
    groups.forEach((g) => {
      init[g.title] = g.items.some((i) => i.to === location.pathname);
    });
    init["Overview"] = true;
    return init;
  });

  useEffect(() => {
    const stored = localStorage.getItem('lowStockNotifications');
    if (stored) {
      try {
        setNotifications(JSON.parse(stored));
      } catch (e) {
        setNotifications([]);
      }
    }
    // Refresh from the API so the bell is accurate on every page, not just Stock
    api
      .get("/api/stock/low")
      .then((items) => {
        const fresh = items.map((item) => ({
          id: item.name,
          name: item.name,
          qty: item.qty,
          min: item.min,
          unit: item.unit,
          timestamp: new Date().toLocaleTimeString(),
        }));
        setNotifications(fresh);
        localStorage.setItem('lowStockNotifications', JSON.stringify(fresh));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (lowStockItems && lowStockItems.length > 0) {
      const newNotifications = lowStockItems.map((item) => ({
        id: item.name,
        name: item.name,
        qty: item.qty,
        min: item.min,
        unit: item.unit,
        timestamp: new Date().toLocaleTimeString(),
      }));
      setNotifications(newNotifications);
      localStorage.setItem('lowStockNotifications', JSON.stringify(newNotifications));
    }
  }, [lowStockItems]);

  const toggleGroup = (title) =>
    setOpenGroups((s) => ({ ...s, [title]: !s[title] }));

  const clearNotification = (id) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('lowStockNotifications', JSON.stringify(updated));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('lowStockNotifications');
  };

  return (
    <div className="min-h-screen flex">
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-6 py-6 flex items-center gap-3 border-b border-sidebar-border">
          <div className="h-10 w-10 rounded-xl bg-hero shadow-soft grid place-items-center text-primary-foreground animate-float">
            <Package className="h-5 w-5" strokeWidth={2.4} />
          </div>
          <div>
            <div className="font-display text-lg leading-none text-sidebar-foreground">BrushPack</div>
            <div className="text-xs text-muted-foreground mt-1">Packaging Operations</div>
          </div>
          <button
            className="ml-auto lg:hidden text-muted-foreground"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-2">
          {groups.map((g) => {
            const isOverview = g.items.length === 1 && g.title === "Overview";
            const expanded = openGroups[g.title];
            if (isOverview) {
              const item = g.items[0];
              const Icon = item.icon;
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            }
            return (
              <div key={g.title}>
                <button
                  onClick={() => toggleGroup(g.title)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition"
                >
                  <span className="flex-1 text-left">{g.title}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                      expanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expanded && (
                  <div className="mt-1 ml-2 pl-2 border-l border-sidebar-border space-y-0.5">
                    {g.items.map((item, idx) => {
                      const Icon = item.icon;
                      const active = location.pathname === item.to;
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setOpen(false)}
                          style={{ animationDelay: `${idx * 40}ms` }}
                          className={`animate-slide-in-left flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                            active
                              ? "bg-primary text-primary-foreground shadow-soft"
                              : "text-sidebar-foreground hover:bg-sidebar-accent"
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={() => navigate({ to: "/login" })}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-foreground/30 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center gap-3 px-6 lg:px-10 py-4">
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-secondary"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-2xl text-foreground truncate">{title}</h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-0.5 truncate">{subtitle}</p>
              )}
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/60 border border-border w-72">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search orders, workers, materials…"
                className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2 rounded-lg hover:bg-secondary transition"
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 h-5 w-5 rounded-full bg-accent text-white text-xs grid place-items-center font-semibold">
                    {notifications.length}
                  </span>
                )}
              </button>
              {notificationOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50 animate-fade-in">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="font-semibold flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-accent" />
                      Low Stock Alerts
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">No low stock alerts</div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className="p-3 border-b border-border/50 last:border-0 hover:bg-secondary/30 transition">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{notif.name}</div>
                              <div className="text-xs text-destructive mt-1">
                                {notif.qty.toLocaleString()} {notif.unit} / {notif.min.toLocaleString()} min
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">{notif.timestamp}</div>
                            </div>
                            <button
                              onClick={() => clearNotification(notif.id)}
                              className="text-muted-foreground hover:text-foreground mt-1"
                              title="Dismiss"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-border bg-secondary/30">
                      <Link
                        to="/inventory/alerts"
                        onClick={() => setNotificationOpen(false)}
                        className="text-sm text-primary hover:underline font-medium"
                      >
                        View all alerts →
                      </Link>
                    </div>
                  )}
                </div>
              )}
              {notificationOpen && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setNotificationOpen(false)}
                />
              )}
            </div>
            <div className="h-9 w-9 rounded-full bg-warm grid place-items-center text-accent-foreground font-medium text-sm">
              M
            </div>
          </div>
        </header>

        <div key={location.pathname} className="p-6 lg:p-10 max-w-[1400px] mx-auto animate-fade-in">{children}</div>
      </main>
    </div>
  );
}