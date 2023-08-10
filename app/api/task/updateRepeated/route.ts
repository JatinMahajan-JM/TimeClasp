import { connectToDatabase } from "@/dbConfig/dbConfig";
import taskModel from "@/models/taskModel";
import { NextRequest, NextResponse } from "next/server";

connectToDatabase()

export async function PUT(request: NextRequest) {
    const { date } = await request.json();
    console.log(date, "date")
    try {
        const a = await taskModel.updateMany(
            // { repeat: { $exists: true }, dueDate: { $gt: date } },
            { repeat: { $exists: true } },
            { $set: { timeWorked: 0 } } // Replace `newValue` with the desired value
        )
        console.log(a, "here it is")
        return NextResponse.json(a)
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}