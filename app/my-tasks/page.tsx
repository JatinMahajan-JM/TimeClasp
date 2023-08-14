import AllTasksClient from "@/components/AllTasksClient";
import TasksMain from "@/components/TasksMain";
import { headers } from "next/headers";

const url = process.env.REQ_URL;
async function getAllTasks() {
  const res = await fetch(`${url}/api/task`, {
    next: { revalidate: 300000 },
  });
  const data = await res.json();
  if (data.allTasks) return data.allTasks;
  else return [];
}

async function getUpdatedData() {
  const res = await fetch(`${url}/api/task`, {
    cache: "no-store",
    headers: headers(),
  });
  // //
  const data = await res.json();
  if (data.allTasks) return data.allTasks;
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
