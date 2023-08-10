import taskModel from "@/models/taskModel";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    const { date } = await request.json();
    try {
        const a = await taskModel.updateMany(
            { isRepeat: true, dueDate: { $gt: date } },
            { $set: { timeWorked: 0 } } // Replace `newValue` with the desired value
        )
        return NextResponse.json(a)
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}