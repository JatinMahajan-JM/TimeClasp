"use client";

interface updateDataType {
  timeWorked: number;
  timerStartTime: Number;
  timerEnded?: boolean;
}

import { useContext } from "react";
import { Ctx } from "./TasksMain";
import { updateTaskData } from "@/api/tasksApi";

export default function Timer() {
  const { value, seconds, isActive, selectedTask, dispatch, data } =
    useContext(Ctx);

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
      <div className="relative grid justify-center content-center h-64">
        <div
          className={`pie absolute shadow-[0_0px_18px_0px_#d5b7fc] ${
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
          className="pie2 absolute grid items-center justify-center bg-[#1d1f25] cursor-pointer"
          onClick={handleStartStop}
        >
          {formatTime(seconds)}
        </div>
      </div>
      <button>Reset</button>
      <button onClick={handleDone}>Done</button>
    </>
  );
}
