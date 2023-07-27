import type { Icon } from "lucide-react";

export type SidePortalSingleItem = {
    id: string,
    title: string
    // icon?: keyof typeof Icons,
    icon?: React.ReactNode
    href?: string
}

export type SidePortalConfig = {
    id: string, header: string, items: SidePortalSingleItem[]
}[]