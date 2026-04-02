import { Metadata } from "next";
import SuccessClient from "./SuccessClient";

export const metadata: Metadata = {
  title: "Order Confirmed | DIORA",
  description: "Thank you for your order. Your premium personal care products are being prepared.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SuccessPage() {
  return <SuccessClient />;
}
