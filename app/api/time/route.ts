import { connectToDatabase } from "@/dbConfig/dbConfig";
import timeModel from "@/models/timeModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

connectToDatabase();

export async function PUT(request: NextRequest) {
    const session: any = await getServerSession(authOptions);
    const { _id, timeWorkedToday, date } = await request.json();
    //
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
        // let a = await timeModel.findOne({ date: date.slice(0, 10) });
        let a = await timeModel.findOne({ date: date.slice(0, 10), userId: session.user.id });
        if (a) {
            const taskToUpdate = a.tasks.find((task: any) => task.taskId.equals(_id));
            if (taskToUpdate) {
                a.totalTimeWorked = a.totalTimeWorked - taskToUpdate.timeWorkedToday + timeWorkedToday;
                taskToUpdate.timeWorkedToday = timeWorkedToday;
            } else {
                a.totalTimeWorked = a.totalTimeWorked + timeWorkedToday;
                a.tasks.push({ taskId: _id, timeWorkedToday })
            }
        } else {
            // Document doesn't exist, create a new one and add the task
            a = new timeModel({
                date: date.slice(0, 10),
                tasks: [{ taskId: _id, timeWorkedToday }],
                userId: session.user.id,
                totalTimeWorked: timeWorkedToday
            });
        }

        // Save the updated/created document
        a.save();
        return NextResponse.json(a)
    } catch (error: any) {
        //
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}