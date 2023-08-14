import { connectToDatabase } from "@/dbConfig/dbConfig";
import taskModel from "@/models/taskModel";
import { NextRequest, NextResponse } from "next/server";

connectToDatabase()

export async function PUT(request: NextRequest) {
    const { date } = await request.json();
    //
    try {
        const a = await taskModel.updateMany(
            // { repeat: { $exists: true }, dueDate: { $gt: date } },
            { repeat: { $exists: true } },
            { $set: { timeWorked: 0 } } // Replace `newValue` with the desired value
        )
        //
        return NextResponse.json(a)
    } catch (error: any) {
        //
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}