"use client";

import React, { useState, useEffect } from "react";

export default function StopWatch() {
  const [value, setValue] = useState(50);

  // //clock logic
  // const [time, setTime] = useState(new Date());

  // useEffect(() => {
  //   // Update the time every second
  //   const interval = setInterval(() => {
  //     setTime(new Date());
  //   }, 1000);

  //   // Clean up the interval when the component unmounts
  //   return () => clearInterval(interval);
  // }, []);

  // // Format the time as HH:MM:SS
  // const formattedTime = time.toLocaleTimeString();

  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

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
    const remainingSeconds = seconds % 60;

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };
  return (
    <div className="relative grid justify-center content-center">
      <div
        className={`pie absolute shadow-[0_0px_18px_0px_#d5b7fc] ${
          isActive ? "animate-pulse" : ""
        }`}
        style={{
          backgroundImage: `conic-gradient(#d5b7fc ${value / 4}%, #a267ed ${
            value / 2
          }%, #b983fb ${value / 4 + value / 2}%, #d5b7fc ${value}%, #2d3035 0)`,
        }}
      ></div>
      <div
        className="pie2 absolute grid items-center justify-center bg-[#1d1f25] cursor-pointer"
        onClick={handleStartStop}
      >
        {formatTime(seconds)}
      </div>
    </div>
  );
}
