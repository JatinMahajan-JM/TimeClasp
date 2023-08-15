import TasksMain from "@/components/TasksMain";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const url = process.env.REQ_URL;

async function getData(session: any) {
  const res = await fetch(`${url}/api/task/${session.user.id}`, {
    next: { revalidate: 120 },
  });
  const data = await res.json();
  // console.log(data);
  if (data.allTasks) return data.allTasks;
  else return [];
}

async function getUpdatedData(session: any) {
  const res = await fetch(`${url}/api/task/${session.user.id}`, {
    cache: "no-store",
  });
  const data = await res.json();
  // console.log(data);
  if (data.allTasks) return data.allTasks;
  else return [];
}

export default async function MyTasks() {
  const session = await getServerSession(authOptions);
  let allTasks = await getData(session);
  let updatedData = await getUpdatedData(session);
  if (updatedData.length > 0) allTasks = updatedData;
  return (
    <div className="w-full">
      <TasksMain data={allTasks} />
    </div>
  );
}
