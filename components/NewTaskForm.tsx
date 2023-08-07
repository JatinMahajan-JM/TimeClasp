"use client";

import { addNewTask } from "@/api/tasksApi";
import React, { MouseEvent, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarDays } from "lucide-react";

interface Subtask {
  id: number;
  task: string;
}

export function NewTaskForm() {
  const taskNameRef = useRef<HTMLInputElement>(null);
  const subTasksRef = useRef<HTMLInputElement>(null);
  const dueDateRef = useRef<HTMLInputElement>(null);
  // const priorityRef = useRef<HTMLInputElement>(null);
  // const repeatRef = useRef<HTMLInputElement>(null);
  // const categoryRef = useRef<HTMLInputElement>(null);
  const [priorityRef, setPriorityRef] = useState("");
  const [repeatRef, setRepeat] = useState("");
  const [categoryRef, setCategory] = useState("");
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);
  const timeAllocatedRef = useRef<HTMLInputElement>(null);
  const [taskType, setTaskType] = useState(false);
  const [subTaskToggle, setSubTaskToggle] = useState(false);
  const [subTasks, setSubTasks] = useState<Subtask[]>([]);
  const [date, setDate] = React.useState<Date | undefined>(new Date());

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
      priority: priorityRef,
      dueDate: date,
      repeat: repeatRef,
      category: categoryRef,
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
  console.log(categoryRef);
  return (
    <>
      <section className="px-8 ">
        <h1>Create New Task</h1>
        <form
          onSubmit={newTaskHandler}
          className="flex flex-col w-full gap-4 rounde mt-4"
        >
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input type="text" placeholder="Task Name" ref={taskNameRef} />
              <button
                type="button"
                onClick={() => setSubTaskToggle((prev) => !prev)}
                className="add-border px-2 rounded-md border-spacing-1 bg-varPrimary"
              >
                +
              </button>
            </div>
            {subTasks.map((item, index) => (
              <div className="flex gap-2 items-center">
                <h6>{index + 1}.</h6>
                <input
                  type="text"
                  defaultValue={item.task}
                  key={item.id}
                  className="border-b-2 border-solid border-varPrimary bg-inherit p-0 rounded-none"
                />
              </div>
            ))}
            {subTaskToggle ? (
              <>
                <input
                  type="text"
                  ref={subTasksRef}
                  placeholder="Subtask Title"
                  className="border-b-2 border-solid border-varPrimary bg-inherit outline-none p-0 rounded-none"
                />
                <button
                  type="button"
                  onClick={handleSubTask}
                  className="add-border p-1 font-bold rounded-md hover:bg-varPrimary"
                >
                  Add subtask
                </button>
              </>
            ) : (
              ""
            )}
          </div>
          <div onClick={taskTypeHandler}>
            <h5 className="font-bold">Task Type</h5>
            <button
              type="button"
              className={`flexible-hours rounded-md p-1 px-2 mt-2 ${
                taskType ? "bg-secodaryBtn" : "add-border text-secondary"
              }`}
            >
              Flexible Hours
            </button>
            <button
              type="button"
              className={`strict-hours rounded-md p-1 px-2 ml-2 ${
                !taskType ? "bg-secodaryBtn" : "add-border text-secondary"
              }`}
            >
              Strict Hours
            </button>
          </div>
          <div>
            <h5 className="font-bold">Priority and Repeat</h5>
            <div className="flex mt-2">
              <Select onValueChange={(value) => setPriorityRef(value)}>
                <SelectTrigger className="w-[180px] add-border shadow-none">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="bg-varPrimary border-none">
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setRepeat(value)}>
                <SelectTrigger className="w-[180px] ml-2 add-border shadow-none">
                  <SelectValue placeholder="Repeat" />
                </SelectTrigger>
                <SelectContent className="bg-varPrimary border-none">
                  <SelectItem value="r1">Hourly</SelectItem>
                  <SelectItem value="r2">Weeky</SelectItem>
                  <SelectItem value="r3">Monthly</SelectItem>
                  <SelectItem value="r4">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* <input type="date" ref={dueDateRef} /> */}

          {/* <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          /> */}
          <div>
            <h5 className="font-bold mb-2">Category and Due Date</h5>
            <div className="flex gap-2">
              <Select onValueChange={(value) => setCategory(value)}>
                <SelectTrigger className="w-[180px] add-border shadow-none">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-varPrimary border-none">
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger className="flex gap-2 w-full justify-between p-2 add-border">
                  <h6 className="text-secondary">Due Date</h6>
                  <CalendarDays className="w-4 h-4" />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-primary" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {taskType === false ? (
            <div>
              <h5 className="font-bold mb-2">Start and End Time</h5>
              <input
                type="time"
                ref={startTimeRef}
                className="bg-transparent add-border p-1"
              />
              <input
                type="time"
                ref={endTimeRef}
                className="bg-transparent add-border p-1 ml-2"
              />
            </div>
          ) : (
            ""
          )}
          {taskType === true ? (
            <div>
              <h5 className="font-bold mb-2">Allocate Time</h5>
              <input
                type="time"
                min="00:00"
                max="12:00"
                ref={timeAllocatedRef}
                className="bg-transparent add-border p-1"
              />
            </div>
          ) : (
            ""
          )}
          <button
            type="submit"
            className="bg-c4 p-2 py-2 rounded-lg text-base font-bold"
          >
            Create Task
          </button>
        </form>
      </section>
    </>
  );
}

export default React.memo(NewTaskForm);
