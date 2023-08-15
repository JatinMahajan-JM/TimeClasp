"use client";

import { SessionProvider } from "next-auth/react";

const AuthProvider = ({
  children,
  session,
}: //   session,
{
  children: React.ReactNode;
  session: any;
}) => <SessionProvider session={session}>{children}</SessionProvider>;

export default AuthProvider;
