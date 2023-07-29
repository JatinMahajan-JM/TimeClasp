import taskModel from "@/models/taskModel";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const allTasks = await taskModel.find();
        console.log(allTasks)
        return NextResponse.json(allTasks)
    } catch (err: any) {
        console.log(err)
    }
}