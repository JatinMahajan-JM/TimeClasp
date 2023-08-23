import SidePortal from "@/components/SidePortal";
import "./globals.css";
import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
// import { Roboto } from "next/font/google";
import { sidePortalConfig } from "../config/portals";
import AuthProvider from "@/components/AuthProvider";
import { SignInButton } from "@/components/AuthButtons";
import { getServerSession } from "next-auth/next";
import MainNav from "@/components/MainNav";
import { Toaster } from "@/components/ui/toaster";
import { authOptions } from "@/lib/auth";
import { Session } from "next-auth";
import { Suspense } from "react";
import Loading from "./loading";
import LoadingII from "@/components/ui/LoadingII";
import AuthenticationPage from "./_authentication/SignInPage";

const inter = Josefin_Sans({ subsets: ["latin"], weight: ["500", "700"] });
// const inter = Roboto({ subsets: ["latin"], weight: "900" });

export const metadata: Metadata = {
  title: "TimeClasp - Time and Task Tracker",
  description: "Get the most out of your time and increase productivity",
};

async function getSession(cookie: string): Promise<Session> {
  const response = await fetch(
    `${process.env.LOCAL_AUTH_URL}/api/auth/session`,
    {
      headers: {
        cookie,
      },
    }
  );

  const session = await response.json();

  return Object.keys(session).length > 0 ? session : null;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  let main;
  if (session?.user?.id) {
    main = (
      <body
        className={
          inter.className +
          " grid lg:grid-cols-[300px_1fr] md:grid-cols-[240px_1fr] transition-all"
        }
      >
        <AuthProvider session={session}>
          <aside className="px-8 py-4 border-solid border-r-2 border-varPrimary hidden md:block">
            <div className="w-full">
              <SignInButton />
              <SidePortal sections={sidePortalConfig} />
            </div>
          </aside>
          <Suspense fallback={<Loading />}>
            <main className="p-3 md:pl-8 py-8">
              <nav className="add-border p-2 mb-2 h-[3.14rem] lg:h-auto lg:hidden block">
                <MainNav />
              </nav>
              {children}
            </main>
          </Suspense>
          <Toaster />
        </AuthProvider>
      </body>
    );
  } else {
    // main = (
    //   <body
    //     className={
    //       inter.className +
    //       " grid lg:grid-cols-[300px_1fr] md:grid-cols-[240px_1fr]"
    //     }
    //   >
    //     <AuthProvider>
    //       <aside className="px-8 py-4 border-solid border-r-2 border-varPrimary hidden md:block">
    //         <div className="w-full">
    //           <SignInButton />
    //           <SidePortal sections={sidePortalConfig} />
    //         </div>
    //       </aside>
    //       <main className="md:pl-8 py-8 p-3">
    //         <nav className="add-border p-2 mb-2">
    //           <MainNav />
    //         </nav>
    //         {children}
    //       </main>
    //     </AuthProvider>
    //   </body>
    // );
    main = (
      <body className="grid content-center justify-center gap-4 items-center w-screen h-screen">
        <AuthProvider session={session}>
          {/* <h1 className="font-bold text-lg ">SIGN IN TO ACCESS THE APP</h1>
          <SignInButton /> */}
          <AuthenticationPage />
        </AuthProvider>
      </body>
    );
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
