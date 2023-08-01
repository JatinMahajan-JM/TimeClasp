"use client";

interface AllTaskProps {
  // data: [{ [key: string]: any }];
  data: { [key: string]: any }[];
  handleClick: (id: string) => void;
}

export default function AllTasksClient({ data, handleClick }: AllTaskProps) {
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
  console.log(pendingTasks, completedTasksToday, "Child component", today);
  return (
    <>
      <h1>Pending</h1>
      {data.map((task) => (
        <section key={task._id}>
          {!task.isCompleted ? (
            <>
              <div key={task._id} onClick={() => handleClick(task._id)}>
                {task.taskName}
              </div>
            </>
          ) : (
            <>
              <h1>Completed</h1>
              <div key={task._id} onClick={() => handleClick(task._id)}>
                {task.taskName}
              </div>
            </>
          )}
        </section>
      ))}
    </>
    // <div>
    //   <div>
    //     <h2>Pending Tasks</h2>
    //     <ul>
    //       {pendingTasks.map((task) => (
    //         <li key={task.id}>{task.taskName}</li>
    //       ))}
    //     </ul>
    //   </div>
    //   <div>
    //     <h2>Completed Tasks Today</h2>
    //     <ul>
    //       {completedTasksToday.map((task) => (
    //         <li key={task.id}>{task.taskName}</li>
    //       ))}
    //     </ul>
    //   </div>
    // </div>
  );
}
