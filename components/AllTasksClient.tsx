"use client";

interface AllTaskProps {
  data: [{ [key: string]: any }];
  handleClick: (id: string) => void;
}

export default function AllTasksClient({ data, handleClick }: AllTaskProps) {
  return (
    <>
      {data.map((task) => (
        <div key={task._id} onClick={() => handleClick(task._id)}>
          {task.taskName}
        </div>
      ))}
    </>
  );
}
