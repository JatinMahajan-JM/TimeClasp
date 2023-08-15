import { connectToDatabase } from "@/dbConfig/dbConfig";
import taskModel from "@/models/taskModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import UserModel from "@/models/userModel";

connectToDatabase();

export async function PUT(request: NextRequest) {
    const { _id, data } = await request.json();
    ////
    let obj: any = { $set: data };
    if (!data.startTime || !data.endTime) {
        delete data.startTime;
        delete data.endTime;
        obj = { $set: data, $unset: { startTime: 1, endTime: 1 } }
    }
    try {
        const a = await taskModel.findOneAndUpdate({ _id }, obj, { new: true });
        return NextResponse.json({ message: "Update success", task: a }, { status: 200 })
    } catch (error: any) {
        //
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}