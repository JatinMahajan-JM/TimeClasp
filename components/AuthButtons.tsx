"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function SignInButton() {
  const { data: session, status } = useSession();
  if (status === "authenticated")
    return <h1 className="font-bold text-lg">Timeclasp</h1>;
  // return <button onClick={() => signOut()}>Sign out</button>;
  return <button onClick={() => signIn()}>Sign In</button>;
}

export function SignOutButton() {
  return <button onClick={() => signOut()}>Sign out</button>;
}
