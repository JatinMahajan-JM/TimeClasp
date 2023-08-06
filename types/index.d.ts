import type { Icon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

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

export type ActionType = {
    type: string;
    payload?: any;
}

export type StateType = {
    value: number;
    // seconds: number;
    isActive: boolean;
    selectedTask: any;
    dispatch: Dispatch<ActionType>;
    data: { [key: string]: any }[];
    setSeconds: Dispatch<SetStateAction<number>>;
};

export type StateTypeReducer = {
    value: number;
    // seconds: number;
    isActive: boolean;
    selectedTask: any;
    dispatch: Dispatch<ActionType>;
    data: { [key: string]: any }[];
    sendAndSet: any;
};