"use client";

import { Menu } from "lucide-react";
import { SignInButton } from "./AuthButtons";
import SidePortal from "./SidePortal";
import { sidePortalConfig } from "@/config/portals";
import React from "react";

export default function MainNav() {
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    setShowMobileMenu((prev) => !prev);
  };
  return (
    <div className="flex items-center justify-between">
      <div className="md:hidden block">
        <aside
          className={`md:px-8 py-4 border-solid border-r-2 border-varPrimary lg:block absolute top-24 w-[91%] bg-primary transition-all z-50 ${
            showMobileMenu ? "translate-x-0" : "-translate-x-[40rem]"
          }`}
        >
          <div className="w-full">
            <SignInButton />
            <SidePortal sections={sidePortalConfig} />
          </div>
        </aside>
        <button onClick={handleClick}>
          <Menu />
        </button>
      </div>
      {/* <button className="bg-varPrimary p-2">Create +</button> */}
    </div>
  );
}
