import BarChart from "@/components/BarChart";
import TimeStats from "@/components/TimeStats";

async function getUpdatedData() {
  const res = await fetch("http://localhost:3000/api/task", {
    next: { revalidate: 10000 },
  });
  return await res.json();
}

export default async function Statistics() {
  const data = await getUpdatedData();
  return (
    <>
      <div className="grid grid-cols-[1fr_350px]">
        <div>
          <TimeStats data={data} />
          <BarChart />
        </div>
        <div></div>
      </div>
    </>
  );
}
