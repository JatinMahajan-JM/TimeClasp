import BarChart from "@/components/BarChart";
import SplineChart from "@/components/SplineChart";
import TimeStats from "@/components/TimeStats";
import { headers } from "next/headers";

async function getUpdatedData() {
  const res = await fetch("http://localhost:3000/api/time", {
    next: { revalidate: 60 },
    headers: headers(),
  });
  const data = await res.json();
  console.log(data, "the spline chart");
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
