import { connectToDatabase } from "@/dbConfig/dbConfig";
import taskModel from "@/models/taskModel";
import { NextRequest, NextResponse } from "next/server";

connectToDatabase();

export async function GET() {
    try {
        const allTasks = await taskModel.find();
        console.log(allTasks)
        return NextResponse.json(allTasks)
    } catch (err: any) {
        console.log(err)
    }
}

export async function PUT(request: NextRequest) {
    const { _id, data } = await request.json();
    console.log(_id, data)
    try {
        const a = await taskModel.updateOne({ _id }, { $set: data });
        return NextResponse.json(a)
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}