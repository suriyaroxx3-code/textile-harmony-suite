/**
 * Thin fetch wrapper for the BrushPack FastAPI backend.
 *
 * Base URL comes from VITE_API_URL (see frontend/.env.example) and falls back
 * to the local uvicorn default so `npm run dev` + `uvicorn` just work.
 */
export const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    ...init,
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      if (body?.detail) detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(res.status, detail);
  }

  // 204 No Content (DELETE) has no body
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T = void>(path: string) => request<T>(path, { method: "DELETE" }),
};

// ---- Shared row types (mirror backend/app/schemas.py) ----
export type Contractor = { id: number; name: string; area: string; workers: number; amount: number; status: string };
export type Worker = { id: number; emp_id: string; name: string; role: string; hours: number; rate: number; present: boolean };
export type Batch = { id: number; batch_no: string; product: string; received: number; packed: number; entry_date: string };
export type Order = { id: number; order_id: string; client: string; product: string; qty: number; stage: number };
export type BillingRecord = { id: number; ref: string; contractor: string; date: string; value: number; status: string; type: string };
export type StockItem = { id: number; name: string; cat: string; qty: number; unit: string; min: number };
export type WeeklyPoint = { d: string; received: number; packed: number };
export type DashboardSummary = {
  units_packed_today: number;
  workers_present: number;
  workers_total: number;
  pending_bills_value: number;
  pending_bills_count: number;
  low_stock_count: number;
  trend: WeeklyPoint[];
};
