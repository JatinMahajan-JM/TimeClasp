import { connectToDatabase } from "@/dbConfig/dbConfig";
import taskModel from "@/models/taskModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/[...nextauth]";
import UserModel from "@/models/userModel";

connectToDatabase();

export async function GET() {
    try {
        const session: any = await getServerSession(authOptions);
        // console.log(session, "session")
        let allTasks: any = [];
        if (session) {
            allTasks = await UserModel.findOne({ _id: session.user?.id }).populate("taskList");
            allTasks = allTasks.taskList;
        }
        // else allTasks = { taskList: [] }
        // console.log(testTasks)
        // const allTasks = await taskModel.find();
        // console.log(allTasks)
        return NextResponse.json(allTasks)
    } catch (err: any) {
        console.log(err)
    }
}

export async function PUT(request: NextRequest) {
    const { _id, data } = await request.json();
    // console.log(_id, data)
    let obj: any = { $set: data };
    if (!data.startTime || !data.endTime) {
        delete data.startTime;
        delete data.endTime;
        obj = { $set: data, $unset: { startTime: 1, endTime: 1 } }
    }
    try {
        const a = await taskModel.findOneAndUpdate({ _id }, obj, { new: true });
        return NextResponse.json({ message: "Update success", task: a }, { status: 200 })
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}