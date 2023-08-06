"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import Timer from "./Timer";
import { createContext } from "react";
import NewTaskForm from "./NewTaskForm";
import { updateTaskData } from "@/api/tasksApi";
import AllTasks from "./AllTasks";
import { ActionType, StateType, StateTypeReducer } from "@/types";

interface TimerProps {
  data: { [key: string]: any }[];
}

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
  // seconds: 0,
  isActive: false,
  selectedTask: {},
  dispatch: () => {},
  data: [],
  setSeconds: () => {},
});

export default function TasksMain({ data }: TimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [stateMain, dispatchFn] = useReducer(reducerFn, {
    value: 0,
    // seconds: 0,
    isActive: false,
    selectedTask: null,
    dispatch: () => {},
    sendAndSet: null,
    data,
  });

  const { selectedTask, isActive, sendAndSet } = stateMain;
  // let secondsRef: MutableRefObject<any> = useRef(selectedTask?.timeWorked);

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

  // Get a request from the child to update the task data, if the user click on other task
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

  // Side effect to handle if the user has not turned off the timer.
  // The time is set to the time, it should be on refresh.
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
        // dispatchFn({ type: "seconds", payload: { seconds: timeCalculated } });
        setSeconds(timeCalculated);
        dispatchFn({ type: "isActive", payload: { active: true } });
        // secondsRef.current = timeCalculated;
      }
      // else secondsRef.current = selectedTask.timeWorked;
    }
  }, [selectedTask]);

  // useEffect to set the task to completed, when timeTillCompletion reaches zero.
  // Runs when user start the timer or when the timer is not turned off and the browser is refreshed.
  useEffect(() => {
    let timeTillCompletion;
    let timeout: NodeJS.Timeout;

    if (selectedTask && isActive) {
      let allocatedTime = selectedTask?.timeAllocated;
      const [hours, minutes] = allocatedTime.split(":").map(Number);
      // The seconds are needed instead of timeWorked in case the timer has not been turned off.
      // The seconds !== timeWorked
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
        // let secondsHold = secondsRef.current + 1;
        // dispatchFn({
        //   type: "seconds",
        //   payload: { seconds: secondsHold },
        // });
        setSeconds((prev) => prev + 1);
        // secondsRef.current = secondsHold;
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive]);

  const ctxValue = useMemo(
    () => ({
      ...stateMain,
      dispatch: dispatchFn,
      setSeconds,
    }),
    [stateMain, setSeconds]
  );

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-8">
      <Ctx.Provider value={ctxValue}>
        <div>
          <Timer seconds={seconds} />
          <AllTasks />
        </div>
        <div className="hidden lg:block border-secondary border-l border-solid">
          <NewTaskForm />
        </div>
      </Ctx.Provider>
    </div>
  );
}
