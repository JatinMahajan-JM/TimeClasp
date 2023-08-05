"use client";

import {
  Dispatch,
  MutableRefObject,
  useEffect,
  useReducer,
  useRef,
} from "react";
import Timer from "./Timer";
import { createContext } from "react";
import NewTaskForm from "./NewTaskForm";
import { updateTaskData } from "@/api/tasksApi";
import AllTasks from "./AllTasks";

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
  stateRef: number;
  //   selectedTask: { [key: string]: any };
};

export type StateTypeReducer = {
  value: number;
  seconds: number;
  isActive: boolean;
  selectedTask: any;
  dispatch: Dispatch<ActionType>;
  data: { [key: string]: any }[];
  sendAndSet: any;
  //   selectedTask: { [key: string]: any };
};

let dispatchDup;

const reducerFn = (state: StateTypeReducer, action: ActionType) => {
  switch (action.type) {
    case "value":
      return { ...state, value: action.payload.value };
    case "seconds":
      return { ...state, seconds: action.payload.seconds };
    case "isActive":
      return { ...state, isActive: action.payload.active };
    case "selectedTask":
      return { ...state, selectedTask: action.payload.selectedTask };
    case "dataState":
      return { ...state, data: action.payload.data };
    case "sendAndSet":
      return { ...state, sendAndSet: action.payload.data };
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
  stateRef: 0,
});

export default function TasksMain({ data }: TimerProps) {
  const [stateMain, dispatchFn] = useReducer(reducerFn, {
    value: 0,
    seconds: 0,
    isActive: false,
    selectedTask: null,
    dispatch: () => {},
    sendAndSet: null,
    data,
  });

  dispatchDup = dispatchFn;

  const { selectedTask, seconds, isActive, sendAndSet } = stateMain;
  let secondsRef: MutableRefObject<any> = useRef(selectedTask?.timeWorked);
  // let ctxValue = {
  //   ...stateMain,
  //   dispatch: dispatchFn,
  //   stateRef: secondsRef.current,
  // };

  const dataModification = (updateData: { [key: string]: any }) => {
    const modifiedIndex = data.findIndex(
      (item) => item._id === selectedTask?._id
    );
    const newDataState = [...data]; // Create a copy of the state array
    newDataState[modifiedIndex] = {
      ...newDataState[modifiedIndex],
      ...updateData,
    };
    return newDataState;
  };

  useEffect(() => {
    if (sendAndSet === "sendAndSet") {
      let updateData = {
        timeWorked: seconds,
        timerStartTime: Date.now(),
        timerEnded: true,
      };
      updateTaskData(updateData);
      dispatchFn({
        type: "dataState",
        payload: { data: dataModification(updateData) },
      });
      dispatchFn({ type: "sendAndSet", payload: { data: "sendAndSet" } });
    }
  }, [sendAndSet]);

  useEffect(() => {
    if (selectedTask) {
      if (!selectedTask.timerEnded) {
        const timeCalculated =
          (Date.now() - selectedTask.timerStartTime) / 1000 +
          selectedTask.timeWorked;

        if (timeCalculated > selectedTask.timeAllocated) {
          let updateData = {
            timeWorked: seconds,
            isCompleted: true,
          };
          updateTaskData({
            _id: selectedTask?._id,
            data: updateData,
          });
        }
        dispatchFn({ type: "seconds", payload: { seconds: timeCalculated } });
        dispatchFn({ type: "isActive", payload: { active: true } });
        secondsRef.current = timeCalculated;
      } else secondsRef.current = selectedTask.timeWorked;
    }
  }, [selectedTask]);

  let ctxValue = {
    ...stateMain,
    dispatch: dispatchFn,
    stateRef: secondsRef.current,
  };

  useEffect(() => {
    let timeTillCompletion;
    let timeout: NodeJS.Timeout;

    if (selectedTask && isActive) {
      let allocatedTime = selectedTask?.timeAllocated;
      const [hours, minutes] = allocatedTime.split(":").map(Number);
      if (seconds !== 0) {
        const totalMilliseconds = hours * 60 * 60 * 1000 + minutes * 60 * 1000;
        timeTillCompletion = totalMilliseconds - seconds * 1000;
      }
      timeout = setTimeout(async () => {
        let updateData = {
          timeWorked: seconds,
          timerStartTime: Date.now(),
          timerEnded: true,
          isCompleted: true,
        };
        updateTaskData(updateData);
        dispatchFn({
          type: "dataState",
          payload: { data: dataModification(updateData) },
        });
      }, timeTillCompletion);
    }
    return () => clearTimeout(timeout);
  }, [isActive, selectedTask]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        let secondsHold = secondsRef.current + 1;
        dispatchFn({
          type: "seconds",
          payload: { seconds: secondsHold },
        });
        secondsRef.current = secondsHold;
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive]);

  return (
    <>
      <Ctx.Provider value={ctxValue}>
        <Timer />
        <NewTaskForm />
        <AllTasks />
      </Ctx.Provider>
    </>
  );
}
