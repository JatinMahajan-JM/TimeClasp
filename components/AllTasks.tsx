import AllTasksClient from "./AllTasksClient";

async function getAllTasks() {
  const res = await fetch("http://localhost:3000/api/task");
  return await res.json();
}

export default async function AllTasks() {
  const allTasks = await getAllTasks();
  return <AllTasksClient data={allTasks} />;
}
