"use client";
import { Dispatch, useEffect, useReducer } from "react";
import Timer from "./Timer";
import { createContext } from "react";
import NewTaskForm from "./NewTaskForm";
import { updateTaskData } from "@/api/tasksApi";

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

  const { selectedTask, seconds, isActive } = stateMain;

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
          // const res = fetch("/api/task", {
          //   method: "PUT",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify({
          //     _id: selectedTask?._id,
          //     data: updateData,
          //   }),
          // });
          updateTaskData({
            _id: selectedTask?._id,
            data: updateData,
          });
        }
        // setSeconds(timeCalculated);
        // setIsActive(true);
        dispatchFn({ type: "seconds", payload: { seconds: timeCalculated } });
        dispatchFn({ type: "isActive", payload: { active: true } });
      }
    }
  }, [selectedTask]);

  useEffect(() => {
    let timeTillCompletion;
    let timeout: NodeJS.Timeout;

    if (selectedTask && isActive) {
      let allocatedTime = selectedTask.timeAllocated;
      const [hours, minutes] = allocatedTime.split(":").map(Number);
      console.log(hours, minutes);
      if (seconds !== 0) {
        //end - seconds
        const totalMilliseconds = hours * 60 * 60 * 1000 + minutes * 60 * 1000;
        timeTillCompletion = totalMilliseconds - seconds * 1000;
        console.log(timeTillCompletion);
      }
      timeout = setTimeout(async () => {
        let updateData = {
          timeWorked: seconds,
          timerStartTime: Date.now(),
          timerEnded: true,
          isCompleted: true,
        };
        // const res = await fetch("/api/task", {
        //   method: "PUT",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     _id: selectedTask?._id,
        //     data: updateData,
        //   }),
        // });
        updateTaskData(updateData);
        // setDataState((prev) => {
        //   const modifiedIndex = prev.findIndex(
        //     (item) => item._id === selectedTask?._id
        //   );
        //   const newDataState = [...dataState]; // Create a copy of the state array
        //   newDataState[modifiedIndex] = {
        //     ...newDataState[modifiedIndex],
        //     isCompleted: true,
        //   };
        //   return newDataState;
        // });

        dispatchFn({
          type: "dataState",
          payload: { data: dataModification(updateData) },
        });

        // console.log(dataState, "Modified");
      }, timeTillCompletion);
    }
    return () => clearTimeout(timeout);
  }, [isActive, selectedTask]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        dispatchFn({ type: "seconds", payload: { seconds: seconds + 1 } });
        // setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive]);

  return (
    <>
      <Ctx.Provider value={stateMain}>
        <Timer />
        <NewTaskForm />
      </Ctx.Provider>
    </>
  );
}
