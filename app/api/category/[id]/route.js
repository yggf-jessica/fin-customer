import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";

export async function DELETE(_, { params }) {
  await dbConnect();
  await Category.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}