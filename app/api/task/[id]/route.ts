import { connectToDatabase } from "@/dbConfig/dbConfig";
import UserModel from "@/models/userModel";
import { NextResponse } from "next/server";

connectToDatabase()

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        let allTasks: any = [];
        if (params.id) {
            allTasks = await UserModel.findOne({ _id: params.id }).populate("taskList");
            allTasks = allTasks.taskList;
        }
        return NextResponse.json({ allTasks }, { status: 200 })
    } catch (err: any) {
        return NextResponse.json({ err }, { status: 404 })
    }
}
