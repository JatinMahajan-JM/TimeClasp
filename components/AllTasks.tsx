"use client";

import { useContext } from "react";
import AllTasksClient from "./AllTasksClient";
import { Ctx } from "./TasksMain";
import { updateTaskData } from "@/api/tasksApi";

export default function AllTasks() {
  const { data, selectedTask, isActive, seconds, dispatch } = useContext(Ctx);

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

  const handleTaskClick = (id: string) => {
    if (selectedTask?._id === id) return;
    if (isActive) {
      // setIsActive(false);
      dispatch({ type: "isActive", payload: { active: false } });
      let updateData = {
        timeWorked: seconds,
        timerStartTime: Date.now(),
        timerEnded: true,
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
      // console.log(await res.json());
      // const updatedRes = await fetch("/api/task");
      // const updatedData = await updatedRes.json();
      // setDataState(updatedData);
      dispatch({
        type: "dataState",
        payload: { data: dataModification(updateData) },
      });
    }
    const selectedItem = data.find((task) => task._id === id);
    // setSelectedTask(selectedItem);
    // setSeconds(selectedItem?.timeWorked);
    // console.log(selectedItem);
    dispatch({ type: "selectedTask", payload: { selectedTask: selectedItem } });
    dispatch({
      type: "seconds",
      payload: { seconds: selectedItem?.timeWorked },
    });
  };
  return <AllTasksClient data={data} handleClick={handleTaskClick} />;
}
