"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const dummyData = [
  {
    _id: 132,
    taskName: "Finish report",
    subTasks: [
      { id: 1, task: "Gather data" },
      { id: 2, task: "Write introduction" },
      { id: 3, task: "Create graphs" },
    ],
    category: "Work",
    taskType: 1,
    priority: "High",
    dueDate: "2023-08-15",
    repeat: "None",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    timeWorked: 0,
    timeAllocated: "8 hours",
    timerStartTime: 0,
    timerEnded: true,
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 4232,
    taskName: "Exercise",
    subTasks: [
      { id: 1, task: "Cardio" },
      { id: 2, task: "Strength training" },
    ],
    category: "Health",
    taskType: 2,
    priority: "Medium",
    dueDate: "2023-08-07",
    repeat: "Daily",
    startTime: "07:30 AM",
    endTime: "08:30 AM",
    timeWorked: 0,
    timeAllocated: "1 hour",
    timerStartTime: 0,
    timerEnded: true,
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 23442,
    taskName: "Grocery shopping",
    subTasks: [],
    category: "Personal",
    taskType: 3,
    priority: "Low",
    dueDate: "2023-08-10",
    repeat: "Weekly",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    timeWorked: 0,
    timeAllocated: "1 hour",
    timerStartTime: 0,
    timerEnded: true,
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 343453,
    taskName: "Study for exam",
    subTasks: [
      { id: 1, task: "Review notes" },
      { id: 2, task: "Practice problems" },
    ],
    category: "Education",
    taskType: 2,
    priority: "High",
    dueDate: "2023-08-20",
    repeat: "None",
    startTime: "02:00 PM",
    endTime: "06:00 PM",
    timeWorked: 0,
    timeAllocated: "4 hours",
    timerStartTime: 0,
    timerEnded: true,
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface AllTaskProps {
  // data: [{ [key: string]: any }];
  data: { [key: string]: any }[];
  handleClick: (id: string) => void;
}

interface SubTask {
  id: number;
  task: string;
}

function returnColor(category: string) {
  switch (category) {
    case "Work":
      return "bg-c1";
    case "Personal":
      return "bg-c2";
    case "Health":
      return "bg-c3";
    case "Education":
      return "bg-c4";
    default:
      return "bg-c5";
  }
}

export default function AllTasksClient({ data, handleClick }: AllTaskProps) {
  // data = dummyData;
  // Filter pending tasks
  const pendingTasks = data.filter((task) => !task.isCompleted);

  // Filter completed tasks for today
  const today = new Date().toDateString();
  // const completedTasksToday = data.filter(
  //   (task) => task.isCompleted && task.createdAt?.toDateString() === today
  // );
  const completedTasksToday = data.filter(
    (task) =>
      task.isCompleted && new Date(task.createdAt).toDateString() === today
  );
  // console.log(pendingTasks, completedTasksToday, "Child component", today);
  return (
    // <>
    //   <h1>Pending</h1>
    //   {data.map((task) => (
    //     <section key={task._id}>
    //       {!task.isCompleted ? (
    //         <>
    //           <div key={task._id} onClick={() => handleClick(task._id)}>
    //             {task.taskName}
    //           </div>
    //         </>
    //       ) : (
    //         <>
    //           <h1>Completed</h1>
    //           <div key={task._id} onClick={() => handleClick(task._id)}>
    //             {task.taskName}
    //           </div>
    //         </>
    //       )}
    //     </section>
    //   ))}
    // </>
    <div>
      <div>
        <h4 className="text-secondary p-2">PENDING</h4>
        <ul className="grid grid-cols-3 gap-2 rounded-lg">
          {pendingTasks.map((task) => (
            <li
              key={task._id}
              onClick={() => handleClick(task._id)}
              className="bg-varPrimary px-4 pl-1 rounded-lg flex gap-4  h-min"
            >
              <div
                className={`py-1 w-[3px] h-i ${returnColor(task.category)}`}
              ></div>
              <div className="flex gap-4 flex-col w-full py-4">
                <div className="flex w-full justify-between">
                  {/* <h2>{task.taskName}</h2> */}
                  <h4
                    className={`${returnColor(
                      task.category
                    )} p-1 text-black text-xs rounded-md px-4 bg-secondary`}
                  >
                    {task.category?.toUpperCase()}
                  </h4>
                  <button>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex gap-1 flex-col">
                  <h5>{task.taskName}</h5>
                  {task.subTasks.length > 0 && (
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="text-sm text-secondary">
                          subtasks
                        </AccordionTrigger>
                        <AccordionContent>
                          {task.subTasks.map((item: SubTask, index: number) => (
                            <div
                              className="flex items-center gap-2"
                              key={item.id}
                            >
                              <input type="checkbox" />
                              <h5 className="text-secondary">
                                {/* {index + 1}. */}
                                {item?.task}
                              </h5>
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </div>
                <div className="flex gap-4">
                  <span>{task.taskType}</span>
                  <span>
                    {task?.startTime}-{task?.endTime}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {completedTasksToday.length > 0 && (
        <div>
          <h4 className="text-secondary p-2 pt-8">COMPLETED</h4>
          <ul>
            {completedTasksToday.map((task) => (
              <li key={task._id} onClick={() => handleClick(task._id)}>
                {task.taskName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
