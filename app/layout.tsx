import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Helisol | Wholesale Vintage Denim & Apparel Factory",
  description: "Helisol is a professional OEM/ODM clothing manufacturer. We supply high-quality vintage indigo denim jackets, sweaters, and custom apparel for global brands.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}