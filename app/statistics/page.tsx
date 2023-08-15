import BarChart from "@/components/BarChart";
import SplineChart from "@/components/SplineChart";
import TimeStats from "@/components/TimeStats";
import { headers } from "next/headers";

const url = process.env.REQ_URL;
async function getUpdatedData() {
  const res = await fetch(`${url}/api/time/getTime`, {
    next: { revalidate: 180 },
    method: "POST",
    // headers: { "Content-Type": "application/json" },
    // headers: headers(),
  });
  const data = await res.json();
  //
  if (data.allTasks) return data.allTasks;
  else return [];
}

export default async function Statistics() {
  const data = await getUpdatedData();
  return (
    <>
      <div className="grid lg:grid-cols-[1fr_350px] mt-4">
        <div className="flex flex-col gap-10">
          <TimeStats data={data} />
          <BarChart dataDB={data} />
          <SplineChart dataDB={data} />
        </div>
        <div></div>
      </div>
    </>
  );
}
