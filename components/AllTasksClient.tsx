"use client";

import { deleteById, updateRepeated } from "@/api/tasksApi";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteIcon, Edit2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NewTaskForm } from "./NewTaskForm";
import { useToast } from "./ui/use-toast";

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
  mod: (task: any, modification: string) => void;
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

const shouldRunTaskToday = (): boolean => {
  const lastExecutionDate = localStorage.getItem("lastExecutionDate");

  if (lastExecutionDate) {
    const currentDate = new Date();
    const storedDate = new Date(lastExecutionDate);

    // Check if the current date is after the stored date (a new day has started)
    if (
      currentDate.toISOString().slice(0, 10) >
      storedDate.toISOString().slice(0, 10)
    ) {
      return true;
    }
  } else {
    // If no last execution date is stored, it's the first time, so run the task
    return true;
  }

  return false;
};

const runTaskOncePerDay = () => {
  if (shouldRunTaskToday()) {
    // Execute your task here
    updateRepeated({ date: new Date() });

    // Update the last execution date in localStorage
    localStorage.setItem("lastExecutionDate", new Date().toISOString());
  }
};

export default function AllTasksClient({
  data,
  handleClick,
  mod,
}: AllTaskProps) {
  useEffect(() => {
    runTaskOncePerDay();
  }, []);
  // data = dummyData;
  // Filter pending tasks
  let pending = data.filter((task) => !task.isCompleted);
  const [pendingTasks, setPendingTasks] = useState(pending);
  // Filter completed tasks for today
  const today = new Date().toDateString();
  let completedTasks = data.filter(
    (task) =>
      task.isCompleted && new Date(task.createdAt).toDateString() === today
  );
  const [completedTasksToday, setCompleted] = useState(completedTasks);
  useEffect(() => {
    let pending = data.filter((task) => !task.isCompleted);
    let completedTasks = data.filter(
      (task) =>
        task.isCompleted && new Date(task.createdAt).toDateString() === today
    );
    setPendingTasks(pending);
    setCompleted(completedTasks);
  }, [data]);

  // console.log(pendingTasks, completedTasksToday, "Child component", today);

  const { toast } = useToast();
  const handleTaskDelete = async (id: string) => {
    // onClick={() => deleteById({ _id: task._id })}
    const response: any = await deleteById({ _id: id });
    if (response.message) {
      // setPendingTasks(pendingTasks.filter((task) => task._id !== id));
      // setCompleted(completedTasksToday.filter((task) => task._id !== id));
      mod(id, "DELETE");
      toast({
        className: "bg-primary",
        description: "Task has been deleted.",
      });
    } else {
      toast({
        className: "bg-primary",
        variant: "destructive",
        description: "Uh no! Something went wrong while deleting...",
      });
    }
    console.log("Clicked");
  };
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
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 rounded-lg">
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

                  <Dialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        {/* Open */}
                        {/* <button> */}
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
                        {/* </button> */}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-varPrimary border-solid border-gray-600">
                        <DropdownMenuLabel>
                          {task.taskName.slice(0, 15)}...
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-400" />
                        <DropdownMenuItem>
                          <div className="flex gap-4 items-center">
                            {/* <Dialog> */}
                            <Edit2Icon width={15} />
                            {/* <p>Edit</p> */}
                            <DialogTrigger>Open</DialogTrigger>
                            {/* <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Are you sure absolutely sure?
                                </DialogTitle>
                                <DialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete your account and remove
                                  your data from our servers.
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent> */}
                            {/* </Dialog> */}
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          // onClick={() => deleteById({ _id: task._id })}
                          onClick={() => handleTaskDelete(task._id)}
                        >
                          <div className="flex gap-4 items-center">
                            <DeleteIcon width={15} className="text-red-400" />
                            <p>Delete</p>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent className="bg-primary add-border px-2 py-10">
                      <DialogHeader>
                        <DialogTitle></DialogTitle>
                        {/* <DialogDescription> */}
                        <NewTaskForm mod={mod} edit={true} task={task} />
                        {/* </DialogDescription> */}
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
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
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 rounded-lg">
            {completedTasksToday.map((task) => (
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

                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          {/* Open */}
                          {/* <button> */}
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
                          {/* </button> */}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-varPrimary border-solid border-gray-600">
                          <DropdownMenuLabel>
                            {task.taskName.slice(0, 15)}...
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-gray-400" />
                          <DropdownMenuItem>
                            <div className="flex gap-4 items-center">
                              {/* <Dialog> */}
                              <Edit2Icon width={15} />
                              {/* <p>Edit</p> */}
                              <DialogTrigger>Open</DialogTrigger>
                              {/* <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Are you sure absolutely sure?
                                </DialogTitle>
                                <DialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete your account and remove
                                  your data from our servers.
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent> */}
                              {/* </Dialog> */}
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            // onClick={() => deleteById({ _id: task._id })}
                            onClick={() => handleTaskDelete(task._id)}
                          >
                            <div className="flex gap-4 items-center">
                              <DeleteIcon width={15} className="text-red-400" />
                              <p>Delete</p>
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DialogContent className="bg-primary add-border px-2 py-10">
                        <DialogHeader>
                          <DialogTitle></DialogTitle>
                          {/* <DialogDescription> */}
                          <NewTaskForm mod={mod} edit={true} task={task} />
                          {/* </DialogDescription> */}
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
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
                            {task.subTasks.map(
                              (item: SubTask, index: number) => (
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
                              )
                            )}
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
      )}
    </div>
  );
}
