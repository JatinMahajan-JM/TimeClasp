"use client";

import { useEffect, useReducer } from "react";

interface ActionType {
  type: string;
  payload?: any;
}

export type StateType = {
  value: number;
  seconds: number;
  isActive: boolean;
  selectedTask: any;
  //   dispatch: Dispatch<ActionType>;
  //   data: { [key: string]: any }[];
  //   selectedTask: { [key: string]: any };
};

const reducerFn = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case "value":
      return { ...state, value: action.payload.value };
    case "seconds":
      console.log("Inside reducer function", action.payload.seconds);
      return { ...state, seconds: action.payload.seconds };
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

export default function RedCheck() {
  const [stateMain, dispatchFn] = useReducer(reducerFn, {
    value: 0,
    seconds: 0,
    isActive: false,
    selectedTask: null,
    // dispatch: () => {},
    // data,
  });
  const handleClick = () => {
    dispatchFn({ type: "isActive", payload: { active: true } });
  };

  const { isActive, seconds } = stateMain;
  console.log("here", seconds);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        console.log("interval", seconds);
        let secondsHold = seconds + 1;
        dispatchFn({ type: "seconds", payload: { seconds: secondsHold } });
        // setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive]);
  return (
    <>
      <h1 onClick={handleClick}>Reducer Check</h1>
    </>
  );
}
