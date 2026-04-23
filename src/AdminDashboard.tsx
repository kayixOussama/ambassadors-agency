import { useEffect, useState } from "react";

const tokenStorageKey = "admin_token";

type Product = {
  id: string;
  name: string;
  badge: string;
  cat: string;
  desc: string;
  sizes: string[];
  prices: number[];
  step: number;
  min: number;
  unit: string;
  icon: string;
  image?: string;
};

function Input(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number";
}) {
  return (
    <div>
      <label className="block text-xs text-text-muted mb-1">{props.label}</label>
      <input
        type={props.type || "text"}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full rounded-lg bg-bg-dark border border-white/10 px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"basic" | "pricing" | "raw">("basic");
  const [jsonText, setJsonText] = useState("[]");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function getToken() {
    return localStorage.getItem(tokenStorageKey) || "";
  }

  function logout() {
    localStorage.removeItem(tokenStorageKey);
    window.location.href = "/admin/login";
  }

  async function authFetch(path: string, init?: RequestInit) {
    const token = getToken();
    const headers = new Headers(init?.headers || {});
    headers.set("Authorization", `Bearer ${token}`);
    return fetch(path, { ...init, headers });
  }

  async function loadProducts() {
    setLoading(true);
    setError("");

    try {
      const verifyRes = await authFetch("/api/admin/verify");
      if (!verifyRes.ok) {
        logout();
        return;
      }

      const res = await authFetch("/api/admin/products");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load products.");

      const loadedProducts = (Array.isArray(data) ? data : []) as Product[];
      setProducts(loadedProducts);
      setSelectedIndex(0);
      setJsonText(JSON.stringify(loadedProducts, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  function updateProducts(nextProducts: Product[]) {
    setProducts(nextProducts);
    setJsonText(JSON.stringify(nextProducts, null, 2));
  }

  function validateProducts(list: Product[]): string[] {
    const issues: string[] = [];

    list.forEach((p, i) => {
      const label = p.name || p.id || `Product ${i + 1}`;
      if (!p.id?.trim()) issues.push(`${label}: id is required`);
      if (!p.name?.trim()) issues.push(`${label}: name is required`);
      if (!Array.isArray(p.sizes) || !Array.isArray(p.prices)) {
        issues.push(`${label}: sizes and prices must be arrays`);
      } else if (p.sizes.length !== p.prices.length) {
        issues.push(`${label}: sizes/prices count mismatch`);
      }
      if (!Number.isFinite(Number(p.step)) || Number(p.step) <= 0) {
        issues.push(`${label}: step must be a positive number`);
      }
      if (!Number.isFinite(Number(p.min)) || Number(p.min) <= 0) {
        issues.push(`${label}: min must be a positive number`);
      }
    });

    return issues;
  }

  function updateProductField(field: keyof Product, value: string | number) {
    const next = [...products];
    const current = next[selectedIndex];
    if (!current) return;

    if (field === "step" || field === "min") {
      current[field] = Number(value || 0) as never;
    } else {
      current[field] = value as never;
    }

    updateProducts(next);
  }

  function updateSize(index: number, value: string) {
    const next = [...products];
    const current = next[selectedIndex];
    if (!current) return;
    current.sizes[index] = value;
    updateProducts(next);
  }

  function updatePrice(index: number, value: string) {
    const next = [...products];
    const current = next[selectedIndex];
    if (!current) return;
    current.prices[index] = Number(value || 0);
    updateProducts(next);
  }

  function addSizePrice() {
    const next = [...products];
    const current = next[selectedIndex];
    if (!current) return;
    current.sizes.push("New Size");
    current.prices.push(0);
    updateProducts(next);
  }

  function removeSizePrice(index: number) {
    const next = [...products];
    const current = next[selectedIndex];
    if (!current) return;
    if (current.sizes.length <= 1) return;
    current.sizes = current.sizes.filter((_, i) => i !== index);
    current.prices = current.prices.filter((_, i) => i !== index);
    updateProducts(next);
  }

  function addProduct() {
    const id = `product-${Date.now()}`;
    const newProduct: Product = {
      id,
      name: "New Product",
      badge: "new",
      cat: "other",
      desc: "",
      sizes: ["Default"],
      prices: [0],
      step: 1,
      min: 1,
      unit: "pcs",
      icon: "box",
      image: "",
    };

    const next = [...products, newProduct];
    updateProducts(next);
    setSelectedIndex(next.length - 1);
  }

  function deleteProduct() {
    if (!products[selectedIndex]) return;
    const ok = window.confirm(`Delete product "${products[selectedIndex].name}"?`);
    if (!ok) return;

    const next = products.filter((_, i) => i !== selectedIndex);
    updateProducts(next);
    setSelectedIndex((prev) => Math.max(0, prev - 1));
  }

  async function saveProducts() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const parsed = activeTab === "raw" ? JSON.parse(jsonText) : products;

      const issues = validateProducts(parsed as Product[]);
      if (issues.length) {
        throw new Error(`Fix validation issues before saving: ${issues[0]}`);
      }

      const res = await authFetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save products.");

      setMessage("Products saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save products.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (!getToken()) {
      window.location.href = "/admin/login";
      return;
    }
    void loadProducts();
  }, []);

  const selected = products[selectedIndex];
  const selectedIssues = selected
    ? validateProducts([selected]).map((i) => i.replace(`${selected.name || selected.id || "Product"}: `, ""))
    : [];

  return (
    <div className="min-h-screen bg-bg-dark text-white px-4 py-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-5">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <button
            onClick={logout}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-text-muted hover:text-white"
          >
            Logout
          </button>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <p className="text-text-muted text-sm mr-2">Manage all product data and save changes.</p>
          <button
            onClick={() => setActiveTab("basic")}
            className={`rounded-lg border px-3 py-1.5 text-xs ${
              activeTab === "basic"
                ? "border-primary text-white bg-primary/15"
                : "border-white/15 text-text-muted hover:text-white"
            }`}
          >
            Basic
          </button>
          <button
            onClick={() => setActiveTab("pricing")}
            className={`rounded-lg border px-3 py-1.5 text-xs ${
              activeTab === "pricing"
                ? "border-primary text-white bg-primary/15"
                : "border-white/15 text-text-muted hover:text-white"
            }`}
          >
            Pricing
          </button>
          <button
            onClick={() => setActiveTab("raw")}
            className={`rounded-lg border px-3 py-1.5 text-xs ${
              activeTab === "raw"
                ? "border-primary text-white bg-primary/15"
                : "border-white/15 text-text-muted hover:text-white"
            }`}
          >
            Raw JSON
          </button>
        </div>

        {loading ? (
          <div className="text-text-muted">Loading...</div>
        ) : (
          <>
            {activeTab === "raw" ? (
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="w-full min-h-[70vh] rounded-xl bg-bg-card border border-white/10 p-4 text-sm font-mono outline-none focus:border-primary"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4">
                <div className="rounded-xl bg-bg-card border border-white/10 p-3 max-h-[72vh] overflow-auto">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-medium">Products</h2>
                    <button
                      onClick={addProduct}
                      className="rounded-md bg-primary px-2.5 py-1 text-xs hover:bg-primary-light"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {products.map((p, i) => (
                      <button
                        key={p.id || i}
                        onClick={() => setSelectedIndex(i)}
                        className={`w-full text-left rounded-lg px-3 py-2 border transition-colors ${
                          i === selectedIndex
                            ? "border-primary bg-primary/10"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <p className="text-sm font-medium truncate">{p.name || "Untitled"}</p>
                        <p className="text-xs text-text-muted truncate">{p.id}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-bg-card border border-white/10 p-4">
                  {selected ? (
                    <div className="space-y-4 max-h-[72vh] overflow-auto pr-1">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="text-sm font-medium">Edit Product</h2>
                        <button
                          onClick={deleteProduct}
                          className="rounded-md border border-red-400/40 px-2.5 py-1 text-xs text-red-300 hover:text-red-200"
                        >
                          Delete Product
                        </button>
                      </div>

                      {activeTab === "basic" ? (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input label="ID" value={selected.id} onChange={(v) => updateProductField("id", v)} />
                            <Input label="Name" value={selected.name} onChange={(v) => updateProductField("name", v)} />
                            <Input label="Badge" value={selected.badge} onChange={(v) => updateProductField("badge", v)} />
                            <Input label="Category" value={selected.cat} onChange={(v) => updateProductField("cat", v)} />
                            <Input label="Unit" value={selected.unit} onChange={(v) => updateProductField("unit", v)} />
                            <Input label="Icon" value={selected.icon} onChange={(v) => updateProductField("icon", v)} />
                            <Input
                              label="Step"
                              type="number"
                              value={String(selected.step)}
                              onChange={(v) => updateProductField("step", Number(v || 0))}
                            />
                            <Input
                              label="Min"
                              type="number"
                              value={String(selected.min)}
                              onChange={(v) => updateProductField("min", Number(v || 0))}
                            />
                          </div>

                          <Input
                            label="Image"
                            value={selected.image || ""}
                            onChange={(v) => updateProductField("image", v)}
                          />

                          <div>
                            <label className="block text-xs text-text-muted mb-1">Description</label>
                            <textarea
                              value={selected.desc}
                              onChange={(e) => updateProductField("desc", e.target.value)}
                              className="w-full rounded-lg bg-bg-dark border border-white/10 px-3 py-2 text-sm outline-none focus:border-primary"
                              rows={3}
                            />
                          </div>
                        </>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs text-text-muted">Sizes and Prices</label>
                            <button
                              onClick={addSizePrice}
                              className="rounded-md border border-white/15 px-2.5 py-1 text-xs text-text-muted hover:text-white"
                            >
                              + Add Row
                            </button>
                          </div>

                          <div className="space-y-2">
                            {selected.sizes.map((sz, i) => (
                              <div key={`${selected.id}-row-${i}`} className="grid grid-cols-[1fr_120px_90px] gap-2">
                                <input
                                  value={sz}
                                  onChange={(e) => updateSize(i, e.target.value)}
                                  className="rounded-lg bg-bg-dark border border-white/10 px-3 py-2 text-sm outline-none focus:border-primary"
                                  placeholder="Size"
                                />
                                <input
                                  type="number"
                                  value={String(selected.prices[i] ?? 0)}
                                  onChange={(e) => updatePrice(i, e.target.value)}
                                  className="rounded-lg bg-bg-dark border border-white/10 px-3 py-2 text-sm outline-none focus:border-primary"
                                  placeholder="Price"
                                />
                                <button
                                  onClick={() => removeSizePrice(i)}
                                  className="rounded-lg border border-white/15 text-xs text-text-muted hover:text-white"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedIssues.length ? (
                        <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-3">
                          <p className="text-xs text-red-300 font-medium mb-1">Validation</p>
                          <ul className="text-xs text-red-200 space-y-1">
                            {selectedIssues.slice(0, 4).map((issue) => (
                              <li key={issue}>- {issue}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <p className="text-sm text-text-muted">No product selected.</p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={saveProducts}
                disabled={saving}
                className="rounded-lg bg-primary hover:bg-primary-light transition-colors px-4 py-2 text-sm font-medium disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Products"}
              </button>
              <button
                onClick={() => void loadProducts()}
                className="rounded-lg border border-white/15 px-4 py-2 text-sm text-text-muted hover:text-white"
              >
                Reload
              </button>
            </div>

            {message ? <p className="text-green-400 text-sm mt-3">{message}</p> : null}
            {error ? <p className="text-red-400 text-sm mt-3">{error}</p> : null}
          </>
        )}
      </div>
    </div>
  );
}
