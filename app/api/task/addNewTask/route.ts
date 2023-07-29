import { connectToDatabase } from "@/dbConfig/dbConfig";
import taskModel from "@/models/taskModel";
import { NextRequest, NextResponse } from "next/server";

connectToDatabase();

export async function POST(request: NextRequest) {
    try {
        const { taskName, subTasks, taskType, priority, dueDate, repeat, startTime, endTime } = await request.json();
        console.log(taskName, subTasks, taskType, priority, dueDate, repeat, startTime, endTime)
        const newTask = new taskModel({ taskName, subTasks, taskType, priority, dueDate, repeat })
        await newTask.save();
        return NextResponse.json({ message: "New Task created" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}