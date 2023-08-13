"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import Timer from "./Timer";
import { createContext } from "react";
import NewTaskForm from "./NewTaskForm";
import { updateTaskData } from "@/api/tasksApi";
import AllTasks from "./AllTasks";
import { ActionType, StateType, StateTypeReducer } from "@/types";
import { upsertData } from "@/api/timeApi";

interface TimerProps {
  data: { [key: string]: any }[];
}

function convertTimeStringToMilliseconds(timeString: string) {
  const [hoursStr, minutesStr] = timeString.split(":").map((str) => str.trim());

  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  const hoursInseconds = hours * 60 * 60;
  const minutesInseconds = minutes * 60;

  const totalseconds = hoursInseconds + minutesInseconds;

  return totalseconds;
}

let lastTask: any, lastSeconds: number;
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
    case "modifyData":
      switch (action.payload.modification) {
        case "POST":
          return { ...state, data: [...state.data, action.payload.task] };
        case "DELETE":
          const indexDel = state.data.findIndex(
            (task) => task._id === action.payload.task
          );
          return {
            ...state,
            data: [
              ...state.data.slice(0, indexDel),
              ...state.data.slice(indexDel + 1),
            ],
          };
        case "PUT":
          const index = state.data.findIndex(
            (task) => task._id === action.payload.task._id
          );
          return {
            ...state,
            data: [
              ...state.data.slice(0, index),
              action.payload.task,
              ...state.data.slice(index + 1),
            ],
          };
      }
    case "sendAndSet":
      lastTask = action.payload.lastTask;
      // console.log(action.payload.lastTask);
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
  const [modal, setModal] = useState(false);
  const [stateMain, dispatchFn] = useReducer(reducerFn, {
    value: 0,
    // seconds: 0,
    isActive: false,
    selectedTask: null,
    dispatch: () => {},
    sendAndSet: null,
    data,
  });

  const { selectedTask, isActive, sendAndSet, data: d } = stateMain;
  console.log(d);
  // let secondsRef: MutableRefObject<any> = useRef(selectedTask?.timeWorked);

  const dataModification = (updateData: { [key: string]: any }) => {
    let modifiedIndex;
    if (updateData.lastTask) {
      modifiedIndex = data.findIndex((item) => item._id === lastTask?._id);
    } else {
      modifiedIndex = data.findIndex((item) => item._id === selectedTask?._id);
    }
    lastTask === null;
    console.log(updateData.timeWorked, "data mod");
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
      // console.log(seconds, selectedTask, lastTask);
      let updateData = {
        // timeWorked: lastSeconds,
        timeWorked: seconds,
        timerStartTime: Date.now(),
        timerEnded: true,
        lastTask,
      };
      console.log(updateData);
      // updateTaskData(updateData);
      updateTaskData({ _id: lastTask?._id, data: updateData });
      upsertData({
        _id: lastTask?._id,
        date: new Date(),
        timeWorkedToday: seconds,
      });
      dispatchFn({
        type: "dataState",
        payload: { data: dataModification(updateData) },
      });
      dispatchFn({ type: "sendAndSet", payload: { data: "none" } });
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
        console.log(timeCalculated, "timeCalculated");

        if (timeCalculated > selectedTask.timeAllocated) {
          // update the timeWorkedToday for this task.
          // seconds - selectedTask.timeWorked
          let updateData = {
            timeWorked: seconds,
            isCompleted: true,
          };
          updateTaskData({
            _id: selectedTask?._id,
            data: updateData,
          });
          upsertData({
            _id: selectedTask?._id,
            date: new Date(),
            timeWorkedToday: seconds,
          });
        }
        // dispatchFn({ type: "seconds", payload: { seconds: timeCalculated } });
        setSeconds(timeCalculated);
        dispatchFn({ type: "isActive", payload: { active: true } });
        if (selectedTask.timeAllocated) {
          let value =
            (timeCalculated /
              convertTimeStringToMilliseconds(selectedTask.timeAllocated)) *
            100;
          dispatchFn({ type: "value", payload: { value } });
        }
        // secondsRef.current = timeCalculated;
      } else {
        // console.log(selectedTask, "In else");
        setSeconds(selectedTask?.timeWorked ?? 0);
        let value = 0;
        if (selectedTask.timeWorked && selectedTask.timeAllocated) {
          value =
            (selectedTask.timeWorked /
              convertTimeStringToMilliseconds(selectedTask.timeAllocated)) *
            100;
        }
        dispatchFn({ type: "value", payload: { value } });
      }
      // else secondsRef.current = selectedTask.timeWorked;
    }
  }, [selectedTask]);
  console.log(stateMain.value);
  // console.log(seconds);

  // useEffect to set the task to completed, when timeTillCompletion reaches zero.
  // Runs when user start the timer or when the timer is not turned off and the browser is refreshed.
  useEffect(() => {
    let timeTillCompletion;
    let timeout: NodeJS.Timeout;

    if (selectedTask && isActive) {
      let allocatedTime = selectedTask?.timeAllocated;
      if (allocatedTime) {
        const [hours, minutes] = allocatedTime.split(":").map(Number);
        // The seconds are needed instead of timeWorked in case the timer has not been turned off.
        // The seconds !== timeWorked
        const totalMilliseconds = hours * 60 * 60 * 1000 + minutes * 60 * 1000;
        if (seconds !== 0) {
          timeTillCompletion = totalMilliseconds - seconds * 1000;
        } else timeTillCompletion = totalMilliseconds;
        timeout = setTimeout(async () => {
          let updateData = {
            timeWorked: seconds,
            timerStartTime: Date.now(),
            timerEnded: true,
            isCompleted: true,
          };
          updateTaskData({
            _id: selectedTask?._id,
            data: updateData,
          });
          upsertData({
            _id: selectedTask?._id,
            date: new Date(),
            timeWorkedToday: seconds,
          });

          dispatchFn({
            type: "dataState",
            payload: { data: dataModification(updateData) },
          });
        }, timeTillCompletion);
      }
      return () => clearTimeout(timeout);
    }
  }, [isActive, selectedTask]);

  let secondsRef = useRef<number>();
  secondsRef.current = seconds;
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let interval2: NodeJS.Timeout;

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

      interval2 = setInterval(() => {
        let secondsHold = secondsRef.current! + 1;
        if (selectedTask.timeAllocated) {
          let value =
            (secondsHold /
              convertTimeStringToMilliseconds(selectedTask.timeAllocated)) *
            100;
          dispatchFn({ type: "value", payload: { value } });
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
      clearInterval(interval2);
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

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    setModal((prev) => !prev);
  };

  const handleNewTaskorUpdate = (task: any, modification: string) => {
    dispatchFn({
      type: "modifyData",
      payload: { modification, task },
    });
  };

  return (
    <div className="grid lg:grid-cols-[1fr_350px] gap-8">
      <Ctx.Provider value={ctxValue}>
        <div>
          <Timer seconds={seconds} />
          <AllTasks mod={handleNewTaskorUpdate} />
        </div>
        {/* <div className="absolute lg:static top-0 right-0"> */}
        <button
          className="absolute top-10 right-5 w-20 bg-varPrimary p-2"
          onClick={handleClick}
        >
          Create +
        </button>
        <div
          className={`absolute bg-primary right-5 w-11/12 lg:w-full p-2 md:p-8 lg:p-0 md:w-2/3 lg:static lg:block border-varPrimary border-l-2 border-solid transition-all ${
            modal ? "translate-x-0" : "translate-x-[-200%]"
          } lg:translate-x-0`}
        >
          <NewTaskForm edit={false} mod={handleNewTaskorUpdate} />
        </div>
        {/* </div> */}
      </Ctx.Provider>
    </div>
  );
}
