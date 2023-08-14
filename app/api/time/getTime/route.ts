import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import timeModel from "@/models/timeModel";
import { NextResponse } from "next/server";

export async function POST() {
    const session: any = await getServerSession(authOptions);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    try {
        let allTasks: any = [];
        if (session) {
            if (session.user)
                //
                allTasks = await timeModel.find({ userId: session.user.id, date: { $gte: thirtyDaysAgo.toISOString().slice(0, 10) } }).populate("tasks.taskId");
        }
        // const allTasks = await timeModel.find({ date: new Date().toISOString().slice(0, 10) }).populate("tasks.taskId");
        //
        return NextResponse.json({ allTasks }, { status: 200 })
    } catch (err: any) {
        //
        return NextResponse.json({ err }, { status: 404 })
    }
}