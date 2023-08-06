"use client";

import { addNewTask } from "@/api/tasksApi";
import React, { MouseEvent, useRef, useState } from "react";

interface Subtask {
  id: number;
  task: string;
}

export function NewTaskForm() {
  const taskNameRef = useRef<HTMLInputElement>(null);
  const subTasksRef = useRef<HTMLInputElement>(null);
  const dueDateRef = useRef<HTMLInputElement>(null);
  const priorityRef = useRef<HTMLSelectElement>(null);
  const repeatRef = useRef<HTMLSelectElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);
  const timeAllocatedRef = useRef<HTMLInputElement>(null);
  const [taskType, setTaskType] = useState(false);
  const [subTaskToggle, setSubTaskToggle] = useState(false);
  const [subTasks, setSubTasks] = useState<Subtask[]>([]);

  const newTaskHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let timeAllocated = timeAllocatedRef.current?.value;
    if (
      taskType === false &&
      startTimeRef.current?.value &&
      endTimeRef.current?.value
    ) {
      const [hours1, minutes1] = startTimeRef.current.value
        .split(":")
        .map(Number);
      const [hours2, minutes2] = endTimeRef.current.value
        .split(":")
        .map(Number);

      // Create Date objects with the current date and provided hours and minutes
      const date1 = new Date();
      date1.setHours(hours1, minutes1, 0, 0);

      const date2 = new Date();
      date2.setHours(hours2, minutes2, 0, 0);

      // Calculate the time difference in milliseconds
      const timeDiffMilliseconds = Math.abs(date2.getTime() - date1.getTime());

      // Convert the time difference back to "hh:mm" format
      const hoursDiff = Math.floor(timeDiffMilliseconds / (60 * 60 * 1000));
      const minutesDiff = Math.floor(
        (timeDiffMilliseconds % (60 * 60 * 1000)) / (60 * 1000)
      );

      // Format the result to "hh:mm" format
      const result = `${hoursDiff.toString().padStart(2, "0")}:${minutesDiff
        .toString()
        .padStart(2, "0")}`;

      timeAllocated = result;
      // console.log(timeAllocated);
    }

    // console.log(subTasksRef.current?.value);
    addNewTask({
      taskName: taskNameRef.current?.value,
      subTasks: subTasks,
      taskType,
      priority: priorityRef.current?.value,
      dueDate: dueDateRef.current?.value,
      repeat: repeatRef.current?.value,
      startTime: startTimeRef.current?.value,
      endTime: endTimeRef.current?.value,
      timeAllocated,
    });
  };

  const handleSubTask = () => {
    const newId = subTasks.length + 1;
    const newSubtaskObj: Subtask = {
      id: newId,
      task: subTasksRef.current?.value!,
    };
    setSubTasks((prev) => [...prev, newSubtaskObj]);
  };

  const taskTypeHandler = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.target instanceof HTMLElement) {
      if (event.target.classList.contains("flexible-hours")) setTaskType(true);
      else setTaskType(false);
    }
  };

  // console.log("Form re-rendered");
  return (
    <>
      <section>
        <form onSubmit={newTaskHandler} className="flex flex-col w-1/4 gap-2">
          <div className="flex">
            <input type="text" placeholder="Task Name" ref={taskNameRef} />
            <button
              type="button"
              onClick={() => setSubTaskToggle((prev) => !prev)}
            >
              +
            </button>
            {subTasks.map((item) => (
              <input type="text" defaultValue={item.task} key={item.id} />
            ))}
            {subTaskToggle ? (
              <>
                <input type="text" ref={subTasksRef} />
                <button type="button" onClick={handleSubTask}>
                  Add subtask
                </button>
              </>
            ) : (
              ""
            )}
          </div>
          <div onClick={taskTypeHandler}>
            <button type="button" className="flexible-hours">
              Flexible Hours
            </button>
            <button type="button" className="strict-hours">
              Strict Hours
            </button>
          </div>
          <select name="Priority" id="" ref={priorityRef}>
            <option value="p1">1</option>
            <option value="p1">1</option>
            <option value="p1">1</option>
            <option value="p1">1</option>
          </select>
          <input type="date" ref={dueDateRef} />
          <select name="Repeat" id="" ref={repeatRef}>
            <option value="p1">1</option>
            <option value="p1">1</option>
            <option value="p1">1</option>
            <option value="p1">1</option>
          </select>
          {taskType === false ? (
            <>
              <input type="time" ref={startTimeRef} />
              <input type="time" ref={endTimeRef} />
            </>
          ) : (
            ""
          )}
          {taskType === true ? (
            <input type="time" min="00:00" max="12:00" ref={timeAllocatedRef} />
          ) : (
            ""
          )}
          <button type="submit">ADD</button>
        </form>
      </section>
    </>
  );
}

export default React.memo(NewTaskForm);
