"use client";

interface Task {
  [key: string]: any;
}

import React from "react";
import { Calendar as ReactCalendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface CalendarProps {
  tasks: Task[];
  onDateChange: (date: Date) => void;
}

export const CalendarChild: React.FC<CalendarProps> = ({
  tasks,
  onDateChange,
}) => {
  const tileContent = ({
    date,
    view,
  }: {
    date: Date | undefined;
    view: string;
  }) => {
    if (!date) return null;

    const formattedDate = date.toISOString().split("T")[0];
    const tasksForDate = tasks.filter(
      (task) => task.createdAt.toISOString().split("T")[0] === formattedDate
    );
    return tasksForDate.length > 0 ? <p>{tasksForDate.length} Tasks</p> : null;
  };

  return (
    <ReactCalendar
      onChange={(date) => onDateChange(date as Date)}
      tileContent={tileContent}
    />
  );
};
