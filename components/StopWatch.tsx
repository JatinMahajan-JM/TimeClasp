"use client";

import React, { useState, useEffect } from "react";

export default function StopWatch() {
  const endTime = "14:50";
  const [value, setValue] = useState(50);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const handleStartStop = () => {
    setIsActive((prevIsActive) => !prevIsActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  useEffect(() => {
    if (endTime) {
      const [hours, minutes] = endTime.split(":").map(Number);
      const currentDate = new Date(Date.now());
      currentDate.setHours(hours);
      currentDate.setMinutes(minutes);
      console.log(currentDate.getTime() - Date.now());
      setSeconds((currentDate.getTime() - Date.now()) / 1000);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive]);

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
      {/* <input type="date" /> */}
      <section>
        <form action="" className="flex flex-col w-1/4 gap-2">
          <div className="flex">
            <input type="text" placeholder="Task Name" />
            <button>+</button>
          </div>
          <div>
            <button>Flexible Hours</button>
            <button>Strict Hours</button>
          </div>
          <select name="Priority" id="">
            <option value="p1">1</option>
            <option value="p1">1</option>
            <option value="p1">1</option>
            <option value="p1">1</option>
          </select>
          <input type="date" />
          <select name="Repeat" id="">
            <option value="p1">1</option>
            <option value="p1">1</option>
            <option value="p1">1</option>
            <option value="p1">1</option>
          </select>
        </form>
      </section>
    </>
  );
}
