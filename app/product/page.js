"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export default function Home() {
  // With basePath=/fin-customer, this becomes "/fin-customer" in prod and "" in local if you want.
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "/fin-customer";
  const { register, handleSubmit, reset } = useForm();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchProducts() {
    try {
      const res = await fetch(`${API_BASE}/api/product`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load products");
      const p = await res.json();
      setProducts(p);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchCategory() {
    try {
      const res = await fetch(`${API_BASE}/api/category`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load categories");
      const c = await res.json();
      setCategory(c);
    } catch (e) {
      console.error(e);
    }
  }

  const createProduct = async (form) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Create failed");
      reset();
      await fetchProducts();
    } catch (e) {
      alert(e.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteById = (id) => async () => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`${API_BASE}/api/product/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-row gap-4">
      <div className="flex-1 w-64">
        <form onSubmit={handleSubmit(createProduct)}>
          <div className="grid grid-cols-2 gap-4 m-4 w-1/2">
            <div>Code:</div>
            <div>
              <input
                type="text"
                {...register("code", { required: true })}
                className="border border-black w-full"
              />
            </div>

            <div>Name:</div>
            <div>
              <input
                type="text"
                {...register("name", { required: true })}
                className="border border-black w-full"
              />
            </div>

            <div>Description:</div>
            <div>
              <textarea
                {...register("description", { required: true })}
                className="border border-black w-full"
              />
            </div>

            <div>Price:</div>
            <div>
              <input
                type="number"
                step="0.01"
                {...register("price", { required: true, valueAsNumber: true })}
                className="border border-black w-full"
              />
            </div>

            <div>Category:</div>
            <div>
              <select
                {...register("category", { required: true })}
                className="border border-black w-full"
              >
                {category.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <input
                type="submit"
                value={loading ? "Adding..." : "Add"}
                disabled={loading}
                className="bg-blue-800 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-2 px-4 rounded-full"
              />
            </div>
          </div>
        </form>
      </div>

      <div className="border m-4 bg-slate-300 flex-1 w-64">
        <h1 className="text-2xl">Products ({products.length})</h1>
        <ul className="list-disc ml-8">
          {products.map((p) => (
            <li key={p._id}>
              <button
                className="border border-black px-1 mr-2"
                onClick={deleteById(p._id)}
                title="Delete"
              >
                ❌
              </button>
              {/* basePath-aware: /product/... becomes /fin-customer/product/... */}
              <Link href={`/product/${p._id}`} className="font-bold underline">
                {p.name}
              </Link>{" "}
              - {p.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}