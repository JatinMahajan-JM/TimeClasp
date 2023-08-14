import AllTasksClient from "@/components/AllTasksClient";
import TasksMain from "@/components/TasksMain";
import { headers } from "next/headers";

const url = process.env.NEXTAUTH_URL;
async function getAllTasks() {
  const res = await fetch(`${url}/api/task`, {
    next: { revalidate: 300000 },
  });
  return await res.json();
}

async function getUpdatedData() {
  const res = await fetch(`${url}/api/task`, {
    cache: "no-store",
    headers: headers(),
  });
  // //
  if (res) return await res.json();
  else return [];
}

export default async function MyTasks() {
  3;
  let allTasks = await getAllTasks();
  let updatedData = await getUpdatedData();
  if (updatedData) allTasks = updatedData;
  return (
    <div className="w-full">
      {/* <h1>My Tasks</h1> */}
      {/* <Stopwatch data={allTasks} /> */}
      <TasksMain data={allTasks} />
    </div>
  );
}
