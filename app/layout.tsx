import SidePortal from "@/components/SidePortal";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { sidePortalConfig } from "../config/portals";
import AuthProvider from "@/components/AuthProvider";
import { SignInButton } from "@/components/AuthButtons";
import { getServerSession } from "next-auth/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TimeClasp - Time and Task Tracker",
  description: "Get the most out of your time and increase productivity",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  let main;
  if (session) {
    main = (
      <body className={inter.className + " grid grid-cols-[300px_1fr]"}>
        <AuthProvider>
          <aside>
            <SignInButton />
            <SidePortal sections={sidePortalConfig} />
          </aside>
          <main>{children}</main>
        </AuthProvider>
      </body>
    );
  } else
    main = (
      <body>
        <AuthProvider>
          <h1>Sign in to access</h1>
          <SignInButton />
        </AuthProvider>
      </body>
    );
  return (
    <html lang="en">
      {/* <body className={inter.className + " grid grid-cols-[300px_1fr]"}>
        <AuthProvider>
          <aside>
            <SignInButton />
            <SidePortal sections={sidePortalConfig} />
          </aside>
          <main>{children}</main>
        </AuthProvider>
      </body> */}
      {main}
    </html>
  );
}
