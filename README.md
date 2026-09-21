# BrushPack — Packaging Operations Suite

A full-stack demo app for a brush-tip packaging floor: production tracking, workforce,
billing and material inventory. React frontend + Python FastAPI backend with full CRUD.

```
textile-harmony-suite/
├── frontend/                 React 19 + TanStack Start + Vite + Tailwind
│   ├── src/
│   │   ├── routes/           one file per page (file-based routing)
│   │   ├── components/       DashboardLayout, PageHelpers, shadcn/ui
│   │   ├── lib/api.ts        fetch wrapper + row types shared with the backend
│   │   └── assets/           product images
│   └── package.json
│
└── backend/                  Python FastAPI + SQLAlchemy + SQLite
    ├── app/
    │   ├── main.py           app factory, CORS, router registration, startup seed
    │   ├── database.py       engine / session / get_db dependency
    │   ├── models.py         ORM tables
    │   ├── schemas.py        Pydantic request & response shapes
    │   ├── crud.py           shared create / update / delete / get_or_404 helpers
    │   ├── seed.py           demo rows inserted when tables are empty
    │   └── routers/          one file per resource (contractors, workers, batches, …)
    ├── tests/test_api.py     pytest smoke tests
    └── requirements.txt
```

## Run it

### 1. Backend (port 8000)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows   (macOS/Linux: source .venv/bin/activate)
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- Swagger UI: <http://localhost:8000/docs> — every endpoint can be tried from the browser.
- A `brushpack.db` SQLite file is created next to `app/` and seeded with demo data on first start.
- Delete `brushpack.db` to reset the demo.

### 2. Frontend (port 8080)

```bash
cd frontend
npm install
npm run dev
```

Open <http://localhost:8080>. Sign in with **manager / admin123**.

The frontend reads `VITE_API_URL` (see `frontend/.env.example`); it defaults to `http://localhost:8000`.

### 3. Tests

```bash
cd backend
pip install -r requirements-dev.txt
pytest -q
```

## API overview

Every resource follows the same REST pattern:

| Method | Path                     | Action          |
| ------ | ------------------------ | --------------- |
| GET    | `/api/<resource>`        | list            |
| POST   | `/api/<resource>`        | create (201)    |
| GET    | `/api/<resource>/{id}`   | read one        |
| PUT    | `/api/<resource>/{id}`   | partial update  |
| DELETE | `/api/<resource>/{id}`   | delete (204)    |

Resources: `contractors`, `workers`, `batches`, `orders`, `billing`, `stock`.

Extra read endpoints:

| Path                         | Used by                        |
| ---------------------------- | ------------------------------ |
| `POST /api/auth/login`       | Login page                     |
| `GET /api/stock/low`         | Low-stock alerts + bell badge  |
| `GET /api/orders/stages`     | Order Status floor summary     |
| `GET /api/reports/weekly`    | Weekly Report charts           |
| `GET /api/reports/dashboard` | Dashboard KPI cards + trend    |

## How a page talks to the API

```tsx
// frontend/src/routes/contractor.salary.tsx
import { api } from "@/lib/api";

const [rows, setRows] = useState([]);
useEffect(() => { api.get("/api/contractors").then(setRows); }, []);

await api.put(`/api/contractors/${id}`, { status: "Paid" });   // update
await api.delete(`/api/contractors/${id}`);                     // delete
```

```python
# backend/app/routers/contractors.py
@router.put("/{item_id}", response_model=schemas.ContractorOut)
def update_contractor(item_id: int, body: schemas.ContractorUpdate, db: Session = Depends(get_db)):
    obj = crud.get_or_404(db, models.Contractor, item_id)
    return crud.update(db, obj, body)
```
