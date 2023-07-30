import AllTasksClient from "@/components/AllTasksClient";
import Stopwatch from "@/components/StopWatch";

async function getAllTasks() {
  const res = await fetch("http://localhost:3000/api/task", {
    next: { revalidate: 5000 },
  });
  return await res.json();
}

export default async function MyTasks() {
  3;
  const allTasks = await getAllTasks();
  return (
    <>
      <h1>My Tasks</h1>
      <Stopwatch data={allTasks} />
    </>
  );
}
