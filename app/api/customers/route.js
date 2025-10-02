import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Customer from "@/models/Customer";

// GET /api/customers
export async function GET() {
  await dbConnect();
  const customers = await Customer.find().sort({ memberNumber: 1 });
  return NextResponse.json(customers);
}

// POST /api/customers
export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const created = await Customer.create(body);
  return NextResponse.json(created, { status: 201 });
}