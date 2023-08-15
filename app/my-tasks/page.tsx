import TasksMain from "@/components/TasksMain";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const url = process.env.REQ_URL;

async function getUpdatedData(session: any) {
  const res = await fetch(`${url}/api/task/${session.user.id}`, {
    cache: "no-store",
  });
  const data = await res.json();
  if (data.allTasks) return data.allTasks;
  else return [];
}

export default async function MyTasks() {
  const session = await getServerSession(authOptions);
  let updatedData = await getUpdatedData(session);
  return (
    <div className="w-full">
      <TasksMain data={updatedData} />
    </div>
  );
}
