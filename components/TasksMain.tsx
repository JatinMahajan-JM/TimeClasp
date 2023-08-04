"use client";
import { Dispatch, useContext, useReducer, useState } from "react";
import Timer from "./Timer";
import { createContext } from "react";

interface ActionType {
  type: string;
  payload?: any;
}

interface TimerProps {
  data: { [key: string]: any }[];
}

export type StateType = {
  value: number;
  seconds: number;
  isActive: boolean;
  selectedTask: any;
  dispatch: Dispatch<ActionType>;
  data: { [key: string]: any }[];
  //   selectedTask: { [key: string]: any };
};

const reducerFn = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case "value":
      return { ...state, value: action.payload.value };
    case "seconds":
      return { ...state, value: action.payload.seconds };
    case "isActive":
      return { ...state, isActive: action.payload.active };
    case "selectedTask":
      return { ...state, selectedTask: action.payload.selectedTask };
    case "dataState":
      return { ...state, data: action.payload.data };
    default:
      return state;
  }
};

export const Ctx = createContext<StateType>({
  value: 0,
  seconds: 0,
  isActive: false,
  selectedTask: {},
  dispatch: () => {},
  data: [],
});

export default function TasksMain({ data }: TimerProps) {
  const [stateMain, dispatchFn] = useReducer(reducerFn, {
    value: 0,
    seconds: 0,
    isActive: false,
    selectedTask: {},
    dispatch: () => {},
    data,
  });
  return (
    <>
      <Ctx.Provider value={stateMain}>
        <Timer />
      </Ctx.Provider>
    </>
  );
}
