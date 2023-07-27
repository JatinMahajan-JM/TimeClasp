import SidePortal from "@/components/SidePortal";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { sidePortalConfig } from "../config/portals";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TimeClasp - Time and Task Tracker",
  description: "Get the most out of your time and increase productivity",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " grid grid-cols-[300px_1fr]"}>
        <aside>
          <SidePortal sections={sidePortalConfig} />
        </aside>
        <main>{children}</main>
      </body>
    </html>
  );
}
