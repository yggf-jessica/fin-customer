"use client";

import * as React from "react";
import Link from "next/link";
import Box from "@mui/material/Box";

export default function BoxBasic() {
  return (
    <main>
      <Box
        component="section"
        className="border border-gray-800 m-5 text-center p-6 space-y-6"
      >
        <h1 className="text-3xl text-violet-950">Stock Management v1.0</h1>

        <ul className="space-y-3">
          <li>
            <Link href="/product" className="underline hover:no-underline">
              Products
            </Link>
          </li>
          <li>
            <Link href="/category" className="underline hover:no-underline">
              Category
            </Link>
          </li>
          <li>
            <Link href="/customers" className="underline hover:no-underline">
              Customers
            </Link>
          </li>
        </ul>
      </Box>
    </main>
  );
}