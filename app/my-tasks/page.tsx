import AllTasksClient from "@/components/AllTasksClient";
import Stopwatch from "@/components/StopWatch";

async function getAllTasks() {
  const res = await fetch("http://localhost:3000/api/task");
  return await res.json();
}

export default async function MyTasks() {
  const allTasks = await getAllTasks();
  return (
    <>
      <h1>My Tasks</h1>
      <Stopwatch data={allTasks} />
    </>
  );
}
