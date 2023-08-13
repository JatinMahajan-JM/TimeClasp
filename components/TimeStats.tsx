import { BarChart3 } from "lucide-react";

interface Task {
  _id: number;
  taskName: string;
  subTasks: { id: number; task: string }[];
  category: string;
  taskType: number;
  priority: string;
  dueDate: string;
  repeat: string;
  startTime: string;
  endTime: string;
  timeWorked: number;
  timeAllocated: string;
  timerStartTime: number;
  timerEnded: boolean;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: Date;
}

function calculateTotalTimeWorked(
  data: [{ [key: string]: any }],
  today: string,
  nDays: number
) {
  const oneHourInSeconds = 3600;
  const endDate = new Date(today);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - nDays);

  let totalTimeInSeconds = 0;

  for (const entry of data) {
    const entryDate = new Date(entry.date);
    if (entryDate >= startDate && entryDate <= endDate) {
      totalTimeInSeconds += entry.totalTimeWorked;
    }
  }

  const totalHours = Math.floor(totalTimeInSeconds / oneHourInSeconds);
  const totalMinutes = Math.floor((totalTimeInSeconds % oneHourInSeconds) / 60);
  const totalSeconds = Math.floor(totalTimeInSeconds % 60);

  const formattedHours = totalHours.toString().padStart(2, "0");
  const formattedMinutes = totalMinutes.toString().padStart(2, "0");
  const formattedSeconds = totalSeconds.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

function calculateTotalTimeWorkedThisWeek(data: Task[]): string {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)

  // Calculate the date of the previous Sunday
  const previousSunday = new Date(today);
  previousSunday.setDate(today.getDate() - dayOfWeek);

  // Convert previousSunday to string in YYYY-MM-DD format
  const previousSundayString = previousSunday.toISOString().slice(0, 10);

  // Calculate total time worked in the week (Sunday to Saturday)
  let totalSeconds = 0;

  data.forEach((task) => {
    // if (task.isCompleted && task.timeWorked > 0) {
    if (task.timeWorked > 0) {
      const createdAtDate = task.createdAt.slice(0, 10); // Extract date part from createdAt
      if (createdAtDate >= previousSundayString) {
        totalSeconds += task.timeWorked;
      }
    }
  });

  // Convert total time to hours, minutes, seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  // Format the time
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return formattedTime;
}

function calculateTotalTimeWorkedToday(data: Task[]): string {
  const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

  // Calculate total time worked today
  let totalSeconds = 0;

  data.forEach((task) => {
    // if (task.isCompleted && task.timeWorked > 0) {
    if (task.timeWorked > 0) {
      const createdAtDate = task.createdAt.slice(0, 10);
      if (createdAtDate === today) {
        totalSeconds += task.timeWorked;
      }
    }
  });

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  // Format the time
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return formattedTime;
}

export default function TimeStats({ data }: { data: any }) {
  const totalTimeWorkedToday = calculateTotalTimeWorked(
    data,
    new Date().toISOString().slice(0, 10),
    0
  );
  const totalTimeWorkedThisWeek = calculateTotalTimeWorked(
    data,
    new Date().toISOString().slice(0, 10),
    6
  );
  console.log(totalTimeWorkedThisWeek); // Example output: "15:30:00"
  return (
    <div className="grid grid-cols-2 gap-4">
      <StatsCard name="Today" classCus="bg-c3" time={totalTimeWorkedToday} />
      <StatsCard
        name="This Week"
        classCus="bg-c4"
        time={totalTimeWorkedThisWeek}
      />
    </div>
  );
}

function StatsCard({
  name,
  time,
  classCus,
}: {
  name: string;
  time?: string;
  classCus: string;
}) {
  return (
    <div
      className={`flex rounded-md items-center gap-6 text-black p-4 ${classCus}`}
    >
      <div>
        <BarChart3 strokeWidth={1} width={60} height={60} />
      </div>
      <div>
        <h5>{name}</h5>
        <h3 className="font-bolder text-3xl font-extrabold tracking-wider">
          {time}
        </h3>
      </div>
    </div>
  );
}
