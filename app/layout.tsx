import SidePortal from "@/components/SidePortal";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { sidePortalConfig } from "../config/portals";
import AuthProvider from "@/components/AuthProvider";
import { SignInButton } from "@/components/AuthButtons";
import { getServerSession } from "next-auth/next";
import MainNav from "@/components/MainNav";

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
      <body
        className={
          inter.className +
          " grid lg:grid-cols-[300px_1fr] md:grid-cols-[240px_1fr]"
        }
      >
        <AuthProvider>
          <aside className="px-8 py-4 border-solid border-r-2 border-varPrimary hidden md:block">
            <div className="w-full">
              <SignInButton />
              <SidePortal sections={sidePortalConfig} />
            </div>
          </aside>
          <main className="p-3 md:pl-8 py-8">
            <nav className="add-border p-2 mb-2 lg:hidden block">
              <MainNav />
            </nav>
            {children}
          </main>
        </AuthProvider>
      </body>
    );
  } else {
    main = (
      <body
        className={
          inter.className +
          " grid lg:grid-cols-[300px_1fr] md:grid-cols-[240px_1fr]"
        }
      >
        <AuthProvider>
          <aside className="px-8 py-4 border-solid border-r-2 border-varPrimary hidden md:block">
            <div className="w-full">
              <SignInButton />
              <SidePortal sections={sidePortalConfig} />
            </div>
          </aside>
          <main className="md:pl-8 py-8 p-3">
            <nav className="add-border p-2 mb-2">
              <MainNav />
            </nav>
            {children}
          </main>
        </AuthProvider>
      </body>
    );
    // main = (
    //   <body>
    //     <AuthProvider>
    //       <h1>Sign in to access</h1>
    //       <SignInButton />
    //     </AuthProvider>
    //   </body>
    // );
  }
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
