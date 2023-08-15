import { connectToDatabase } from "@/dbConfig/dbConfig";
import UserModel from "@/models/userModel";
import { NextResponse } from "next/server";


export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        await connectToDatabase();
        console.log(params.id, "Param Id")
        let allTasks: any = [];
        if (params.id) {
            allTasks = await UserModel.findOne({ _id: params.id }).populate("taskList");
            allTasks = allTasks.taskList;
        }
        console.log(allTasks, "TaskList")
        return NextResponse.json({ allTasks }, { status: 200 })
    } catch (err: any) {
        console.log(err);
        return NextResponse.json({ err }, { status: 404 })
    }
}
