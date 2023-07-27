import { SidePortalConfig } from "@/types";
import Link from "next/link";

export interface SidePortalProps {
  sections: SidePortalConfig;
}

export default function SidePortal({ sections }: SidePortalProps) {
  return sections.map((section) => (
    <article key={section.id}>
      <h4>{section.header}</h4>
      {section.items.map((child) => (
        <Link href={`${child?.href}`} className="flex items-center gap-2">
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
          <p>{child.title}</p>
        </Link>
      ))}
    </article>
  ));
}
