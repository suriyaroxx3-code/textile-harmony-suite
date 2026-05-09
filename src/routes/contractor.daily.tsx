// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Section, Stat, Field, inputCls, Btn, Pill } from "@/components/PageHelpers";
import { UserPlus, Download, Trash2, Search } from "lucide-react";

export const Route = createFileRoute("/contractor/daily")({
  head: () => ({ meta: [{ title: "Daily Workers Salary — BrushPack" }] }),
  component: Page,
});

function Page() {
  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState("");
  
  // Quick Entry State
  const [quickEntry, setQuickEntry] = useState({ 
    id: "", 
    emp_id: "", 
    name: "", 
    role: "", 
    hours: 8, 
    rate: 0 
  });

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = () => {
    fetch("http://localhost:8000/api/workers")
      .then(res => res.json())
      .then(data => setWorkers(data));
  };

  // Logic to auto-fill details when Employee ID is selected
  const handleEmployeeSelect = (selectedEmpId) => {
    const worker = workers.find(w => w.emp_id === selectedEmpId);
    if (worker) {
      setQuickEntry({
        id: worker.id,
        emp_id: worker.emp_id,
        name: worker.name,
        role: worker.role,
        hours: 8, // Default hours for a new day
        rate: worker.rate,
      });
    } else {
      // Reset if "Select ID" is chosen
      setQuickEntry({ id: "", emp_id: "", name: "", role: "", hours: 8, rate: 0 });
    }
  };

  // Logic to save attendance to the backend
  const handleMarkAttendance = async () => {
    if (!quickEntry.id) {
      alert("Please select an Employee ID first.");
      return;
    }

    const payload = {
      emp_id: quickEntry.emp_id,
      name: quickEntry.name,
      role: quickEntry.role,
      hours: Number(quickEntry.hours),
      rate: Number(quickEntry.rate),
      present: true // Mark as present
    };

    try {
      await fetch(`http://localhost:8000/api/workers/${quickEntry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      // Refresh the table data
      fetchWorkers();
      
      // Clear the quick entry form for the next person
      setQuickEntry({ id: "", emp_id: "", name: "", role: "", hours: 8, rate: 0 });
      alert(`${payload.name} marked as Present!`);
    } catch (error) {
      console.error("Failed to mark attendance", error);
      alert("Error marking attendance.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this record?")) {
      await fetch(`http://localhost:8000/api/workers/${id}`, { method: "DELETE" });
      setWorkers(workers.filter(w => w.id !== id));
    }
  };

  const handleExport = () => {
    alert("Exporting to Excel..."); 
  };

  const filteredWorkers = workers.filter(w => 
    w.name.toLowerCase().includes(search.toLowerCase()) || 
    w.emp_id.toLowerCase().includes(search.toLowerCase())
  );

  const present = workers.filter(w => w.present).length;
  const dayWages = workers.filter(w => w.present).reduce((s, w) => s + w.hours * w.rate, 0);

  return (
    <DashboardLayout title="Daily Workers Salary" subtitle="Track attendance and daily wages across the packing floor.">
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Stat label="Workers Present" value={`${present} / ${workers.length}`} hint="Today" />
        <Stat label="Total Wages Today" value={`₹${dayWages.toLocaleString("en-IN")}`} hint="6 working hrs avg" />
        <Stat label="This Week" value="₹38,420" hint="6 working days" />
      </div>

      <Section 
        title="Quick Entry" 
        action={<Link to="/contractor/workers/add"><Btn variant="accent"><UserPlus className="h-4 w-4" /> Add Worker</Btn></Link>}
      >
        <div className="grid md:grid-cols-5 gap-4">
          
          <Field label="Employee ID">
            <select 
              className={inputCls} 
              value={quickEntry.emp_id} 
              onChange={(e) => handleEmployeeSelect(e.target.value)}
            >
              <option value="">Select ID...</option>
              {workers.map(w => (
                <option key={w.id} value={w.emp_id}>{w.emp_id} ({w.name})</option>
              ))}
            </select>
          </Field>

          <Field label="Name">
            <input 
              className={`${inputCls} bg-secondary/20 cursor-not-allowed text-muted-foreground`} 
              placeholder="Auto-filled" 
              value={quickEntry.name} 
              readOnly 
            />
          </Field>

          <Field label="Role">
            {/* Made ReadOnly to automatically fill based on the Employee ID */}
            <input 
              className={`${inputCls} bg-secondary/20 cursor-not-allowed text-muted-foreground`} 
              placeholder="Auto-filled" 
              value={quickEntry.role} 
              readOnly 
            />
          </Field>

          <Field label="Hours">
            <input 
              type="number" 
              className={inputCls} 
              value={quickEntry.hours} 
              onChange={e => setQuickEntry({...quickEntry, hours: Number(e.target.value)})} 
            />
          </Field>

          <Field label="Rate / hr (₹)">
            <input 
              type="number" 
              className={inputCls} 
              value={quickEntry.rate} 
              onChange={e => setQuickEntry({...quickEntry, rate: Number(e.target.value)})} 
            />
          </Field>

        </div>
        <div className="mt-5 flex justify-end">
          <Btn onClick={handleMarkAttendance} disabled={!quickEntry.emp_id}>
            Mark Attendance
          </Btn>
        </div>
      </Section>

      <div className="h-6" />

      <Section 
        title="Today's Attendance"
        action={<Btn variant="ghost" onClick={handleExport}><Download className="h-4 w-4" /> Export Excel</Btn>}
      >
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by name or ID..." 
            className={`${inputCls} pl-9 max-w-sm`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-6 py-3">Emp ID</th>
                <th className="px-6 py-3">Name</th> {/* Changed from Worker to Name */}
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Hours</th>
                <th className="px-6 py-3">Wage</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.map((w) => (
                <tr key={w.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/30 transition">
                  <td className="px-6 py-3">{w.emp_id}</td>
                  <td className="px-6 py-3 font-medium">{w.name}</td>
                  <td className="px-6 py-3 text-muted-foreground">{w.role}</td>
                  <td className="px-6 py-3">{w.hours}</td>
                  <td className="px-6 py-3 font-medium">₹{w.hours * w.rate}</td>
                  <td className="px-6 py-3">
                    <Pill tone={w.present ? "success" : "danger"}>{w.present ? "Present" : "Absent"}</Pill>
                  </td>
                  <td className="px-6 py-3">
                    <button onClick={() => handleDelete(w.id)} className="text-red-500 hover:text-red-700 transition" title="Delete Worker">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredWorkers.length === 0 && (
                <tr>
                   <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">No workers found. Add a worker to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>
    </DashboardLayout>
  );
}