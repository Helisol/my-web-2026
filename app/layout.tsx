import type { Metadata } from "next";
import "./globals.css";
import { WhatsAppButton } from "@/components/WhatsAppButton";

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
      <body className="min-h-full flex flex-col">
        {children}
        {/* 这是悬浮的 WhatsApp 按钮 */}
        <WhatsAppButton />
      </body>
    </html>
  );
}
