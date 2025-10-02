"use client";
import { useEffect, useState } from "react";

export default function CustomerDetail({ params }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "/fin-customer";
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/customers/${params.id}`)
      .then((res) => res.json())
      .then(setCustomer);
  }, [params.id]);

  if (!customer) return <p className="p-6">Loading...</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">{customer.name}</h1>
      <p><b>Member #:</b> {customer.memberNumber}</p>
      <p><b>Date of Birth:</b> {new Date(customer.dateOfBirth).toLocaleDateString()}</p>
      <p><b>Interests:</b> {customer.interests}</p>
    </main>
  );
}
