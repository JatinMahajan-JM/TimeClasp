"use client";

interface updateDataType {
  timeWorked: number;
  timerStartTime: Number;
  timerEnded?: boolean;
}

interface timerProps {
  seconds: number;
}

import { useContext } from "react";
import { Ctx } from "./TasksMain";
import { updateTaskData } from "@/api/tasksApi";

export default function Timer({ seconds }: timerProps) {
  const { value, isActive, selectedTask, dispatch, data } = useContext(Ctx);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

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

  const handleStartStop = async () => {
    if (seconds !== 0 && selectedTask) {
      let updateData: updateDataType = {
        timeWorked: seconds,
        timerStartTime: Date.now(),
      };
      if (!isActive) updateData.timerEnded = false;
      else updateData.timerEnded = true;
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
      updateTaskData({ _id: selectedTask?._id, data: updateData });

      // const updatedRes = await fetch("/api/task");
      // const updatedData = await updatedRes.json();
      // setDataState(updatedData);
      // change here -> Don't retreive the data just update in the state.
      // dispatch({ type: "dataState", payload: { data: updatedData } });
      dispatch({
        type: "dataState",
        payload: { data: dataModification(updateData) },
      });
    }
    // setIsActive((prevIsActive) => !prevIsActive);
    dispatch({ type: "isActive", payload: { active: !isActive } });
  };

  const handleDone = async () => {
    dispatch({ type: "isActive", payload: { active: false } });
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
    updateTaskData({ _id: selectedTask?._id, data: updateData });
    // const dataModification = () => {
    //   const modifiedIndex = data.findIndex(
    //     (item) => item._id === selectedTask?._id
    //   );
    //   const newDataState = [...data]; // Create a copy of the state array
    //   newDataState[modifiedIndex] = {
    //     ...newDataState[modifiedIndex],
    //     isCompleted: true,
    //   };
    //   return newDataState;
    // };
    dispatch({
      type: "dataState",
      payload: { data: dataModification(updateData) },
    });
  };
  return (
    <>
      <div className="relative grid justify-center content-center h-64 ">
        <div
          // #d5b7fc #62ecff
          className={`pie abs-center absolute shadow-[0_0px_18px_0px_#d5b7fc] ${
            isActive ? "animate-pulse" : ""
          }`}
          style={{
            backgroundImage: `conic-gradient(#d5b7fc ${value / 4}%, #a267ed ${
              value / 2
            }%, #b983fb ${
              value / 4 + value / 2
            }%, #d5b7fc ${value}%, #2d3035 0)`,
          }}
        ></div>
        <div
          className="pie2 abs-center absolute grid items-center justify-center bg-[#1d1f25] cursor-pointer"
          onClick={handleStartStop}
        >
          {formatTime(seconds)}
        </div>
      </div>
      <div className="text-center flex items-center justify-center gap-6 w-full pb-8 pt-4">
        <button className="p-2 px-6 border border-secondary border-solid text-secondary rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </button>
        <button
          onClick={handleDone}
          className="p-2 px-6 border border-secondary border-solid text-secondary rounded-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
