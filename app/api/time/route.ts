import { connectToDatabase } from "@/dbConfig/dbConfig";
import timeModel from "@/models/timeModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/[...nextauth]";

connectToDatabase()

export async function GET() {
    const session: any = await getServerSession(authOptions);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    try {
        let allTasks: any;
        if (session) {
            if (session.user)
                console.log("IN here", session)
            allTasks = await timeModel.find({ userId: session.user.id, date: { $gte: thirtyDaysAgo.toISOString().slice(0, 10) } }).populate("tasks.taskId");
        } else allTasks = []
        // const allTasks = await timeModel.find({ date: new Date().toISOString().slice(0, 10) }).populate("tasks.taskId");
        console.log(session, allTasks, "this is the stats route")
        return NextResponse.json(allTasks)
    } catch (err: any) {
        console.log(err)
    }
}

export async function PUT(request: NextRequest) {
    const session: any = await getServerSession(authOptions);
    const { _id, timeWorkedToday, date } = await request.json();
    console.log(_id, timeWorkedToday, session, "this is the put request")
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
                a.totalTimeWorked = a.totalTimeWorked - taskToUpdate.timeWorkedToday + timeWorkedToday;
                taskToUpdate.timeWorkedToday = timeWorkedToday;
            }
        } else {
            // Document doesn't exist, create a new one and add the task
            a = new timeModel({
                date: date.slice(0, 10),
                tasks: [{ taskId: _id, timeWorkedToday }],
                userId: session.user.id
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