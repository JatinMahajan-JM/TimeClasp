import AllTasksClient from "@/components/AllTasksClient";
import Stopwatch from "@/components/StopWatch";

async function getAllTasks() {
  const res = await fetch("http://localhost:3000/api/task", {
    next: { revalidate: 300000 },
  });
  return await res.json();
}

async function getUpdatedData() {
  const res = await fetch("http://localhost:3000/api/task", {
    cache: "no-store",
  });
  console.log(res);
  return await res.json();
}

export default async function MyTasks() {
  3;
  let allTasks = await getAllTasks();
  let updatedData = await getUpdatedData();
  if (updatedData) allTasks = updatedData;
  return (
    <>
      <h1>My Tasks</h1>
      <Stopwatch data={allTasks} />
    </>
  );
}
