import timeModel from "@/models/timeModel";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    const { _id, timeWorkedToday, date } = await request.json();
    console.log(_id, timeWorkedToday)
    try {
        // const a = await timeModel.updateOne({ _id }, { $set: data });
        // find task using taskId and then update that task 
        const a = await timeModel.findOneAndUpdate(
            // { date: date.slice(0, 10), 'tasks.taskId': _id },
            // { $set: { 'tasks.$.timeWorked': timeWorkedToday } },
            // { upsert: true, new: true }// Create a new document if not found and return the updated document)
            { date },
            {
                $set: {
                    'tasks.$[task].timeWorked': timeWorkedToday
                }
            },
            {
                arrayFilters: [{ 'task.taskId': _id }],
                upsert: true,
                new: true
            }
        )
        return NextResponse.json(a)
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}