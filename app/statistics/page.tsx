import BarChart from "@/components/BarChart";
// import SplineChart from "@/components/SplineChart";
import LoadingSpinner from "@/components/ui/loadingSpinner";
const SplineChart = dynamic(() => import("@/components/SplineChart"), {
  loading: () => <LoadingSpinner />,
});
import TimeStats from "@/components/TimeStats";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";

const url = process.env.REQ_URL;
async function getUpdatedData() {
  const session = await getServerSession(authOptions);
  // const res = await fetch(`${url}/api/time/getTime`, {
  //   next: { revalidate: 180 },
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   // headers: headers(),
  // });
  const res = await fetch(`${url}/api/time/${session?.user?.id}/stats`, {
    next: { revalidate: 180 },
  });
  const data = await res.json();
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
