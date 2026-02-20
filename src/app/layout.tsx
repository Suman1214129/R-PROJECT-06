import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/layout/ClientLayout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const instrumentSerif = Instrument_Serif({ weight: ["400"], style: ["normal", "italic"], subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "CampusSwap — Buy & Sell on Campus",
  description: "The peer-to-peer campus marketplace powered by Algorand. Buy and sell textbooks, electronics, and more with crypto payments.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${instrumentSerif.variable} font-sans bg-background text-text-primary antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
