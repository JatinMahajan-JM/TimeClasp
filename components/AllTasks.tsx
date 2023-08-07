"use client";

import React, { useContext } from "react";
import AllTasksClient from "./AllTasksClient";
import { Ctx } from "./TasksMain";
import { updateTaskData } from "@/api/tasksApi";

function AllTasks() {
  // console.log("Re-rendered All Tasks");
  // const { data, selectedTask, isActive, seconds, dispatch } = useContext(Ctx);
  const { data, selectedTask, isActive, dispatch, setSeconds } =
    useContext(Ctx);
  // console.log(stateRef);

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
      dispatch({
        type: "sendAndSet",
        payload: { data: "sendAndSet", lastTask: selectedTask },
      });
      // let updateData = {
      //   // timeWorked: seconds,
      //   timeWorked: stateRef,
      //   timerStartTime: Date.now(),
      //   timerEnded: true,
      // };
      // updateTaskData(updateData);
      // dispatch({
      //   type: "dataState",
      //   payload: { data: dataModification(updateData) },
      // });
    }
    const selectedItem = data.find((task) => task._id === id);
    dispatch({ type: "selectedTask", payload: { selectedTask: selectedItem } });
    // dispatch({
    //   type: "seconds",
    //   payload: { seconds: selectedItem?.timeWorked },
    // });
    // setSeconds(selectedItem?.timeWorked);
  };
  return <AllTasksClient data={data} handleClick={handleTaskClick} />;
}

export default React.memo(AllTasks);
