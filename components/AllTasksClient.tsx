"use client";

interface AllTaskProps {
  data: [{ [key: string]: any }];
}

export default function AllTasksClient({ data }: AllTaskProps) {
  return (
    <>
      {data.map((task) => (
        <h1 key={task._id}>{task.taskName}</h1>
      ))}
    </>
  );
}
