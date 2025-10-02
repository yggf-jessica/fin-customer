import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Customer from "@/models/Customer";

// GET /api/customers/:id
export async function GET(_, { params }) {
  await dbConnect();
  const customer = await Customer.findById(params.id);
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(customer);
}

// PUT /api/customers/:id
export async function PUT(req, { params }) {
  await dbConnect();
  const body = await req.json();
  const updated = await Customer.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(updated);
}

// DELETE /api/customers/:id
export async function DELETE(_, { params }) {
  await dbConnect();
  await Customer.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}