"use client";

import React, { useState } from "react";

export default function StopWatch() {
  const [value, setValue] = useState(0);
  return (
    <div className="relative grid justify-center content-center">
      <div
        className="pie absolute"
        style={{
          backgroundImage: `conic-gradient(#eca1a6 ${20}%, #000000 0)`,
        }}
      ></div>
      <div
        className="pie2 absolute grid items-center justify-center bg-black"
        // style={{
        //   backgroundImage: `conic-gradient(#eca1a6 ${0}%, #000000 0)`,
        // }}
      >
        Hey what?
      </div>
    </div>
  );
}

// const Stopwatch: React.FC = () => {
//   const [isRunning, setIsRunning] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(0);

//   useEffect(() => {
//     let intervalId: NodeJS.Timeout;

//     if (isRunning) {
//       intervalId = setInterval(() => {
//         setTimeLeft((prevTime) => prevTime - 1);
//       }, 1000);
//     }

//     return () => clearInterval(intervalId);
//   }, [isRunning]);

//   const startStopwatch = () => {
//     setIsRunning(!isRunning);
//   };

//   const resetStopwatch = () => {
//     setIsRunning(false);
//     setTimeLeft(0);
//   };

//   const formatTime = (time: number) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = time % 60;
//     return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
//       2,
//       "0"
//     )}`;
//   };

//   const startStopButtonClasses = isRunning
//     ? "bg-red-500 hover:bg-red-600"
//     : "bg-green-500 hover:bg-green-600";

//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <div
//         className={`relative border-4 border-gray-400 rounded-full p-6 cursor-pointer ${startStopButtonClasses}`}
//         onClick={startStopwatch}
//       >
//         <div className="animate-timer-circle absolute top-0 left-0 w-full h-full border-4 border-transparent rounded-full"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-white">
//           {formatTime(timeLeft)}
//         </div>
//       </div>
//       <button
//         className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
//         onClick={resetStopwatch}
//       >
//         Reset
//       </button>
//     </div>
//   );
// };

// export default Stopwatch;

// const Stopwatch: React.FC = () => {
//   const [time, setTime] = useState<number>(0);
//   const [running, setRunning] = useState<boolean>(false);

//   useEffect(() => {
//     let interval: NodeJS.Timeout;

//     if (running) {
//       interval = setInterval(() => {
//         setTime((prevTime) => prevTime + 10);
//       }, 10);
//     }

//     return () => {
//       clearInterval(interval);
//     };
//   }, [running]);

//   const handleStartStop = () => {
//     setRunning((prevState) => !prevState);
//   };

//   const handleReset = () => {
//     setTime(0);
//     setRunning(false);
//   };

//   const formatTime = (time: number) => {
//     const minutes = Math.floor(time / 60000);
//     const seconds = ((time % 60000) / 1000).toFixed(2);
//     return `${minutes.toString().padStart(2, "0")}:${seconds
//       .toString()
//       .padStart(5, "0")}`;
//   };

//   return (
//     <div className="flex flex-col items-center justify-center space-y-4">
//       <div className="text-4xl font-bold">{formatTime(time)}</div>
//       <div className="space-x-4">
//         <button
//           className={`px-4 py-2 rounded-lg ${
//             running
//               ? "bg-red-600 hover:bg-red-700"
//               : "bg-green-600 hover:bg-green-700"
//           } text-white font-semibold transition-colors`}
//           onClick={handleStartStop}
//         >
//           {running ? "Stop" : "Start"}
//         </button>
//         <button
//           className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
//           onClick={handleReset}
//         >
//           Reset
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Stopwatch;
