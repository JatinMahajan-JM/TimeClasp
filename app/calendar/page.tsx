"use client";

import { CalendarChild } from "@/components/Calendar";
import { useState } from "react";

interface Task {
  [key: string]: any;
}

export default function Calendar() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      _id: "64c8b3be2d4a564a28d0f532",
      taskName: "CHECK THIS OUT!",
      createdAt: new Date("2023-08-01T07:26:54.785Z"),
      updatedAt: new Date("2023-08-01T07:26:54.785Z"),
      dueDate: new Date("2023-08-01T00:00:00.000Z"),
      isCompleted: true,
      priority: "p1",
      repeat: "p1",
      subTasks: [],
      taskType: 1,
      timeAllocated: "01:59",
      timeWorked: 0,
      timerEnded: true,
    },
    {
      _id: "64c8b3be2d4a564a28d0f553",
      taskName: "CHECK THIS OUT TOO!",
      createdAt: new Date("2023-08-01T07:26:54.785Z"),
      updatedAt: new Date("2023-08-01T07:26:54.785Z"),
      dueDate: new Date("2023-08-01T00:00:00.000Z"),
      isCompleted: true,
      priority: "p1",
      repeat: "p1",
      subTasks: [],
      taskType: 1,
      timeAllocated: "01:59",
      timeWorked: 0,
      timerEnded: true,
    },
  ]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Function to add tasks, you can use your own logic here
  const addTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  // Function to handle calendar date change
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    // Handle any other logic you want when the date changes
    // console.log("Selected date:", date);
  };

  // Function to get the selected task for the selected date
  const getSelectedTask = (): React.ReactNode | undefined => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      console.log(
        formattedDate,
        tasks[0].createdAt.toISOString().split("T")[0],
        formattedDate === tasks[0].createdAt.toISOString().split("T")[0]
      );
      return tasks
        .filter(
          (task) => task.createdAt.toISOString().split("T")[0] == formattedDate
        )
        .map((item) => (
          <li key={item._id}>
            {item.taskName}
            <button>Edit</button>
          </li>
        ));
    }
    return undefined;
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <CalendarChild tasks={tasks} onDateChange={handleDateChange} />
      {/* Render your task list or task input form here */}
      <div>
        {selectedDate && (
          <div>
            <h2>Selected Date: {selectedDate.toISOString().split("T")[0]}</h2>
            {getSelectedTask() ? (
              <div>
                <h3>Selected Task:</h3>
                <p>{getSelectedTask()}</p>
                {/* Display other task details as needed */}
              </div>
            ) : (
              <p>No tasks for the selected date.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
