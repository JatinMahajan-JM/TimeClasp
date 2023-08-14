import taskModel from "@/models/taskModel";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    const { _id, subId, data } = await request.json();
    try {
        const task = await taskModel.findById(_id)
        if (task) {
            // Find the specific subtask to be modified within the subtasks array
            const subTask = task.subTasks.find((sub: any) => sub._id.toString() === subId);

            if (!subTask) {
                console.error('Subtask not found.');
                return;
            }

            // Modify the subtask properties as needed
            subTask.done = !subTask.done;

            // Save the parent document to persist changes
            await task.save();
            console.log('Subtask updated:');
            return NextResponse.json({ task: "updated" }, { status: 200 })
        };
        return NextResponse.json({ message: "No task found" }, { status: 404 })
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}