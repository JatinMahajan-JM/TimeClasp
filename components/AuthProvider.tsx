"use client";

import { SessionProvider } from "next-auth/react";

const AuthProvider = ({
  children,
}: //   session,
{
  children: React.ReactNode;
  //   session: any;
}) => <SessionProvider>{children}</SessionProvider>;

export default AuthProvider;
