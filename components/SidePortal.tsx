"use client";

import { SidePortalConfig } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MouseEventHandler } from "react";

export interface SidePortalProps {
  sections: SidePortalConfig;
  click?: MouseEventHandler<HTMLButtonElement>;
}

export default function SidePortal({ sections, click }: SidePortalProps) {
  const path = usePathname();
  //
  return sections.map((section) => (
    <article key={section.id} className="my-4 grid gap-2">
      <h4 className="text-secondary text-sm">{section.header}</h4>
      {section.items.map((child) => (
        <button onClick={click} key={child.id}>
          <Link
            // onClick={click}
            //   key={child.id}
            href={`${child?.href}`}
            className={`flex items-center gap-3 p-2 ${
              path === child?.href
                ? "bg-varPrimary border-solid border-l-2 border-lightBlue"
                : ""
            }`}
          >
            <p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4"
              >
                {child.icon}
              </svg>
            </p>
            <p className="text-base">{child.title}</p>
          </Link>
        </button>
      ))}
    </article>
  ));
}
