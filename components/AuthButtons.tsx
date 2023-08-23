"use client";

import { LogIn } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

export function SignInButton() {
  const { data: session, status } = useSession();
  if (status === "authenticated")
    return <h1 className="font-bold text-lg add-border p-4">Timeclasp</h1>;
  // return <button onClick={() => signOut()}>Sign out</button>;
  return (
    // <button
    //   className="add-border p-4 font-bold text-base hover:border-c3 hover:text-c3 transition-all duration-700"
    //   onClick={() => signIn()}
    // >
    //   Sign In
    // </button>
    <button
      className="add-border p-2 font-bold text-base hover:bg-varPrimary transition-all duration-300 flex items-center justify-center gap-2"
      onClick={() => signIn("google")}
    >
      <LogIn className="w-4 h-4" />
      Google
    </button>
  );
}

export function SignOutButton() {
  return <button onClick={() => signOut()}>Sign out</button>;
}
