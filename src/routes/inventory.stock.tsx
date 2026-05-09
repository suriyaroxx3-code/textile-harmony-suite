import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Section, Stat, Btn, Pill } from "@/components/PageHelpers";
import { ImageIcon, Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import cardboardSheetsImg from "@/assets/cardboard sheets-A4.avif?url";
import cardboardBoxesImg from "@/assets/cardboard boxes.avif?url";
import blisterCardImg from "@/assets/blister-card.webp?url";
import plasticSleevesImg from "@/assets/plastic-sleeves.webp?url";
import printedLabelsImg from "@/assets/Printed Labels-Roll.webp?url";
import hotGlueImg from "@/assets/hot glue sticks.jpg?url";
import sealingTapeImg from "@/assets/Sealing Tape.jpg?url";

type StockItem = {
  id: string;
  name: string;
  cat: string;
  qty: number;
  unit: string;
  min: number;
  image?: string;
};

type StockFormValues = {
  name: string;
  cat: string;
  qty: string;
  unit: string;
  min: string;
};

const imageByKind = {
  cardboardSheets: cardboardSheetsImg,
  cardboardBoxes: cardboardBoxesImg,
  plasticSleeves: plasticSleevesImg,
  blisterCards: blisterCardImg,
  printedLabels: printedLabelsImg,
  sealingTape: sealingTapeImg,
  hotGlue: hotGlueImg,
};

const startingStock: StockItem[] = [
  { id: "cardboard-sheets-a4", name: "Cardboard Sheets - A4", cat: "Cardboard", qty: 4200, unit: "sheets", min: 2000, image: imageByKind.cardboardSheets },
  { id: "cardboard-boxes-small", name: "Cardboard Boxes - Small", cat: "Cardboard", qty: 1100, unit: "pcs", min: 1500, image: imageByKind.cardboardBoxes },
  { id: "plastic-sleeves-clear-12mm", name: "Plastic Sleeves - Clear 12mm", cat: "Plastic", qty: 8400, unit: "pcs", min: 3000, image: imageByKind.plasticSleeves },
  { id: "blister-cards-18mm", name: "Blister Cards - 18mm", cat: "Plastic", qty: 920, unit: "pcs", min: 1500, image: imageByKind.blisterCards },
  { id: "printed-labels-roll", name: "Printed Labels (Roll)", cat: "Supplies", qty: 32, unit: "rolls", min: 20, image: imageByKind.printedLabels },
  { id: "sealing-tape-48mm", name: "Sealing Tape - 48mm", cat: "Supplies", qty: 14, unit: "rolls", min: 30, image: imageByKind.sealingTape },
  { id: "hot-glue-sticks", name: "Hot Glue Sticks", cat: "Supplies", qty: 540, unit: "pcs", min: 200, image: imageByKind.hotGlue },
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function getImageForItem(item: Pick<StockItem, "name" | "cat" | "image">) {
  if (item.image) return item.image;

  const text = `${item.name} ${item.cat}`.toLowerCase();
  if (text.includes("sheet")) return imageByKind.cardboardSheets;
  if (text.includes("box")) return imageByKind.cardboardBoxes;
  if (text.includes("sleeve")) return imageByKind.plasticSleeves;
  if (text.includes("blister")) return imageByKind.blisterCards;
  if (text.includes("label")) return imageByKind.printedLabels;
  if (text.includes("tape")) return imageByKind.sealingTape;
  if (text.includes("glue")) return imageByKind.hotGlue;

  return undefined;
}

export const Route = createFileRoute("/inventory/stock")({
  head: () => ({ meta: [{ title: "Stock - BrushPack" }] }),
  component: Page,
});

function Page() {
  const [stock, setStock] = useState<StockItem[]>(startingStock);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const form = useForm<StockFormValues>({
    defaultValues: {
      name: "",
      cat: "Cardboard",
      qty: "",
      unit: "pcs",
      min: "",
    },
  });

  const onSubmit = (data: StockFormValues) => {
    const newItem: StockItem = {
      id: `${slugify(data.name) || "stock-item"}-${Date.now()}`,
      name: data.name.trim(),
      cat: data.cat,
      qty: Number.parseInt(data.qty, 10),
      unit: data.unit,
      min: Number.parseInt(data.min, 10),
    };
    newItem.image = getImageForItem(newItem);

    const updatedStock = [...stock, newItem];
    setStock(updatedStock);

    const lowStockItems = updatedStock.filter((s) => s.qty < s.min);
    if (lowStockItems.length > 0) {
      localStorage.setItem(
        "lowStockNotifications",
        JSON.stringify(
          lowStockItems.map((item) => ({
            id: item.id,
            name: item.name,
            qty: item.qty,
            min: item.min,
            unit: item.unit,
            timestamp: new Date().toLocaleTimeString(),
          })),
        ),
      );
      window.dispatchEvent(new Event("stockUpdated"));
    }

    form.reset();
    setOpen(false);
  };

  const low = stock.filter((s) => s.qty < s.min).length;
  const lowStockItems = stock.filter((s) => s.qty < s.min);
  const filteredStock = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return stock;

    return stock.filter((item) =>
      [item.name, item.cat, item.unit].some((value) => value.toLowerCase().includes(term)),
    );
  }, [query, stock]);

  return (
    <DashboardLayout title="Stock" subtitle="Live inventory of cardboard, plastic packaging and supplies." lowStockItems={lowStockItems}>
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Stat label="Total SKUs" value={String(stock.length)} />
        <Stat label="Stock Value" value="Rs 4.8L" hint="At current rates" />
        <Stat label="Below Minimum" value={String(low)} hint="Action needed" />
      </div>

      <Section
        title="Inventory"
        action={
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/60 border border-border w-56">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search items..."
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
            <Btn variant="accent" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" /> Add Item
            </Btn>
          </div>
        }
      >
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-6 py-3 min-w-[20rem]">Item</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Available</th>
                <th className="px-6 py-3">Minimum</th>
                <th className="px-6 py-3">Level</th>
              </tr>
            </thead>
            <tbody>
              {filteredStock.map((s) => {
                const pct = Math.min(100, Math.round((s.qty / (s.min * 2)) * 100));
                const isLow = s.qty < s.min;
                const productImage = getImageForItem(s);

                return (
                  <tr key={s.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/30 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary shadow-sm">
                          <div className="absolute inset-0 grid place-items-center text-muted-foreground">
                            <ImageIcon className="h-6 w-6" />
                          </div>
                          {productImage && (
                            <img
                              src={productImage}
                              alt={s.name}
                              loading="lazy"
                              className="relative h-full w-full object-cover"
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-foreground">{s.name}</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {isLow ? "Needs reorder" : "Stock level healthy"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{s.cat}</td>
                    <td className="px-6 py-4">
                      {s.qty.toLocaleString()} {s.unit}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {s.min.toLocaleString()} {s.unit}
                    </td>
                    <td className="px-6 py-4 w-72">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                          <div
                            className={`h-full transition-all ${isLow ? "bg-destructive" : "bg-primary"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <Pill tone={isLow ? "danger" : "success"}>{isLow ? "Low" : "OK"}</Pill>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredStock.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground">
                    No stock items match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Item name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Cardboard Sheets - A4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Cardboard">Cardboard</SelectItem>
                        <SelectItem value="Plastic">Plastic</SelectItem>
                        <SelectItem value="Supplies">Supplies</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="qty"
                  rules={{ required: "Quantity is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Qty</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pcs">pcs</SelectItem>
                          <SelectItem value="sheets">sheets</SelectItem>
                          <SelectItem value="rolls">rolls</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="min"
                rules={{ required: "Minimum quantity is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Qty</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                <Btn variant="outline" type="button" onClick={() => setOpen(false)} className="flex-1">
                  Cancel
                </Btn>
                <Btn variant="accent" type="submit" className="flex-1">
                  Add Item
                </Btn>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
