import taskModel from "@/models/taskModel";
import timeModel from "@/models/timeModel";
import UserModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    const { _id } = await request.json();
    try {
        //
        const taskToDelete = await taskModel.findOne({ _id })
        if (!taskToDelete) return NextResponse.json({ message: "Task not found" }, { status: 404 });

        const timeWorked = taskToDelete.timeWorked ?? 0;

        // Delete task references from userSchema
        await UserModel.updateMany(
            { taskList: _id },
            { $pull: { taskList: _id } }
        );

        // Delete task references from timeSchema
        await timeModel.updateMany(
            { 'tasks.taskId': _id },
            { $pull: { tasks: { taskId: _id } }, $inc: { totalTimeWorked: -timeWorked } }
        );

        // Delete the actual task
        await taskModel.deleteOne({ _id });
        return NextResponse.json({ message: "Task deleted successfully" }, { status: 202 })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}