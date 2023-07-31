"use client";

interface AllTaskProps {
  // data: [{ [key: string]: any }];
  data: { [key: string]: any }[];
  handleClick: (id: string) => void;
}

export default function AllTasksClient({ data, handleClick }: AllTaskProps) {
  console.log(data, "Child component");
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
  );
}
