import AllTasks from "@/components/AllTasks";
import Stopwatch from "@/components/StopWatch";

export default function MyTasks() {
  return (
    <>
      <h1>My Tasks</h1>
      <Stopwatch>
        <AllTasks />
      </Stopwatch>
    </>
  );
}
