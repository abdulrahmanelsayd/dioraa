"use client";

import dynamic from "next/dynamic";

export const WishlistDrawer = dynamic(
  () => import("./WishlistDrawer").then((m) => m.WishlistDrawer),
  { ssr: false }
);
