import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";

export async function GET() {
  await dbConnect();
  const items = await Category.find().sort({ order: 1 });
  return NextResponse.json(items);
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const created = await Category.create(body);
  return NextResponse.json(created, { status: 201 });
}

export async function PUT(req) {
  await dbConnect();
  const payload = await req.json();
  // expects payload with _id; adjust to your spec
  const updated = await Category.findByIdAndUpdate(payload._id, payload, { new: true });
  return NextResponse.json(updated);
}