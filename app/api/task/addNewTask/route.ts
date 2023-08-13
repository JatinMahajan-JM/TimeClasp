import { connectToDatabase } from "@/dbConfig/dbConfig";
import taskModel from "@/models/taskModel";
import UserModel from "@/models/userModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "next-auth/react";
import { authOptions } from "../../auth/[...nextauth]/[...nextauth]";

connectToDatabase();

interface User {
    user: {
        id: string
    }
}

export async function POST(request: NextRequest) {
    try {
        const { taskName, subTasks, taskType, priority, dueDate, repeat, startTime, endTime, timeAllocated, category } = await request.json();
        // console.log(taskName, subTasks, taskType, priority, dueDate, repeat, startTime, endTime, timeAllocated)
        const session = await getServerSession(authOptions) as User;
        if (session) {
            const newTask = new taskModel({ taskName, subTasks, taskType, priority, dueDate, repeat, startTime, endTime, timeAllocated, category })
            await newTask.save();
            // const session = await getServerSession() as User;
            // console.log(session)
            const updateUser = await UserModel.findOne({ _id: session.user.id })
            // console.log(updateUser);
            updateUser.taskList.push(newTask._id);
            await updateUser.save()
            return NextResponse.json({ message: "New Task created", newTask }, { status: 200 });
        } else
            return NextResponse.json({ message: "Sign In First" }, { status: 404 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}