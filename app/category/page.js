"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DataGrid } from "@mui/x-data-grid";

export default function Home() {
  const columns = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "order", headerName: "Order", width: 150 },
    {
      field: "Action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div>
          <button onClick={() => startEditMode(params.row)}>📝</button>
          <button onClick={() => deleteCategory(params.row)}>🗑️</button>
        </div>
      ),
    },
  ];

  // ✅ Use NEXT_PUBLIC_API_BASE (not API_URL) and fallback to "/fin-customer"
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "/fin-customer";
  const [categoryList, setCategoryList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  async function fetchCategory() {
    try {
      const res = await fetch(`${API_BASE}/api/category`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch categories");
      const c = await res.json();
      const c2 = c.map((category) => ({
        ...category,
        id: category._id, // DataGrid requires an "id" field
      }));
      setCategoryList(c2);
    } catch (e) {
      console.error(e);
    }
  }

  function handleCategoryFormSubmit(data) {
    if (editMode) {
      // Updating a category
      fetch(`${API_BASE}/api/category`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(() => {
        stopEditMode();
        fetchCategory();
      });
      return;
    }

    // Creating a new category
    fetch(`${API_BASE}/api/category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(() => fetchCategory());
  }

  function startEditMode(category) {
    reset(category);
    setEditMode(true);
  }

  function stopEditMode() {
    reset({ name: "", order: "" });
    setEditMode(false);
  }

  async function deleteCategory(category) {
    if (!confirm(`Are you sure to delete [${category.name}]`)) return;
    const id = category._id;
    await fetch(`${API_BASE}/api/category/${id}`, { method: "DELETE" });
    fetchCategory();
  }

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <main>
      {/* Category form */}
      <form onSubmit={handleSubmit(handleCategoryFormSubmit)}>
        <div className="grid grid-cols-2 gap-4 w-fit m-4 border border-gray-800 p-2">
          <div>Category name:</div>
          <div>
            <input
              {...register("name", { required: true })}
              type="text"
              className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>

          <div>Order:</div>
          <div>
            <input
              {...register("order", { required: true })}
              type="number"
              className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>

          <div className="col-span-2 text-right">
            {editMode ? (
              <>
                <input
                  type="submit"
                  className="italic bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  value="Update"
                />
                {" "}
                <button
                  type="button"
                  onClick={stopEditMode}
                  className="italic bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                >
                  Cancel
                </button>
              </>
            ) : (
              <input
                type="submit"
                value="Add"
                className="w-20 italic bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
              />
            )}
          </div>
        </div>
      </form>

      {/* Data grid */}
      <div className="mx-4">
        <DataGrid
          rows={categoryList}
          columns={columns}
          autoHeight
          disableRowSelectionOnClick
        />
      </div>
    </main>
  );
}