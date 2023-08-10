import { connectToDatabase } from "@/dbConfig/dbConfig";
import timeModel from "@/models/timeModel";
import { NextRequest, NextResponse } from "next/server";

connectToDatabase()

export async function GET() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    try {
        // const allTasks = await timeModel.find({ date: new Date().toISOString().slice(0, 10) }).populate("tasks.taskId");
        const allTasks = await timeModel.find({ date: { $gte: thirtyDaysAgo.toISOString().slice(0, 10) } }).populate("tasks.taskId");
        console.log(allTasks)
        return NextResponse.json(allTasks)
    } catch (err: any) {
        console.log(err)
    }
}

export async function PUT(request: NextRequest) {
    const { _id, timeWorkedToday, date } = await request.json();
    console.log(_id, timeWorkedToday)
    try {
        // const a = await timeModel.updateOne({ _id }, { $set: data });
        // find task using taskId and then update that task 
        // const a = await timeModel.updateOne(
        //     { date: date.slice(0, 10) },
        //     {
        //         $set: {
        //             'tasks.$[elem].timeWorkedToday': timeWorkedToday
        //         },
        //         $setOnInsert: {
        //             // Additional fields you want to set when inserting a new document
        //             __v: 0,
        //             createdAt: new Date(),
        //             tasks: [{ taskId: _id, timeWorkedToday }],
        //         },
        //         $currentDate: {
        //             updatedAt: true,
        //         },
        //     },
        //     {
        //         arrayFilters: [{ 'elem.taskId': _id }],
        //         upsert: true,
        //         // new: true
        //     }
        // )
        // First, try to update the 'timeWorkedToday' field
        let a = await timeModel.findOne({ date: date.slice(0, 10) });
        if (a) {
            const taskToUpdate = a.tasks.find((task: any) => task.taskId.equals(_id));
            if (taskToUpdate) {
                taskToUpdate.timeWorkedToday = timeWorkedToday;
            }
        } else {
            // Document doesn't exist, create a new one and add the task
            a = new timeModel({
                date: date.slice(0, 10),
                tasks: [{ taskId: _id, timeWorkedToday }]
            });
        }

        // Save the updated/created document
        return a.save();
        return NextResponse.json(a)
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}