"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

export default function CustomersPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "/fin-customer";
  const { register, handleSubmit, reset } = useForm();
  const [customers, setCustomers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Load customers
  async function fetchCustomers() {
    const res = await fetch(`${API_BASE}/api/customers`, { cache: "no-store" });
    setCustomers(await res.json());
  }

  // Add new
  async function createCustomer(data) {
    await fetch(`${API_BASE}/api/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    reset();
    fetchCustomers();
  }

  // Update existing
  async function updateCustomer(data) {
    await fetch(`${API_BASE}/api/customers/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    stopEditMode();
    fetchCustomers();
  }

  // Delete
  const deleteCustomer = (id) => async () => {
    if (!confirm("Delete this customer?")) return;
    await fetch(`${API_BASE}/api/customers/${id}`, { method: "DELETE" });
    fetchCustomers();
  };

  // Start editing
  function startEditMode(c) {
    reset({
      name: c.name,
      dateOfBirth: c.dateOfBirth?.slice(0, 10),
      memberNumber: c.memberNumber,
      interests: c.interests,
    });
    setEditMode(true);
    setEditingId(c._id);
  }

  function stopEditMode() {
    reset({ name: "", dateOfBirth: "", memberNumber: "", interests: "" });
    setEditMode(false);
    setEditingId(null);
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Customers ({customers.length})</h1>

      {/* Add / Edit form */}
      <form
        onSubmit={handleSubmit(editMode ? updateCustomer : createCustomer)}
        className="space-y-2 border p-4"
      >
        <input
          {...register("name", { required: true })}
          placeholder="Name"
          className="border p-2 w-full"
        />
        <input
          type="date"
          {...register("dateOfBirth", { required: true })}
          className="border p-2 w-full"
        />
        <input
          type="number"
          {...register("memberNumber", { required: true })}
          placeholder="Member Number"
          className="border p-2 w-full"
        />
        <input
          {...register("interests")}
          placeholder="Interests (movies, football, gym, gaming)"
          className="border p-2 w-full"
        />

        <div className="space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2">
            {editMode ? "Update" : "Add"}
          </button>
          {editMode && (
            <button
              type="button"
              onClick={stopEditMode}
              className="bg-gray-600 text-white px-4 py-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <ul className="space-y-2">
        {customers.map((c) => (
          <li
            key={c._id}
            className="border p-2 flex justify-between items-center"
          >
            <div>
              <Link href={`/customers/${c._id}`} className="underline font-semibold">
                {c.name}
              </Link>{" "}
              – {c.memberNumber}
            </div>
            <div className="space-x-3">
              <button onClick={() => startEditMode(c)} className="text-blue-600">
                ✏️ Edit
              </button>
              <button onClick={deleteCustomer(c._id)} className="text-red-600">
                🗑️ Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}