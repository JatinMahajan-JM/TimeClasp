import mongoose from "mongoose";
import taskModel from "./taskModel";
import UserModel from "./userModel";

const timeSchema = new mongoose.Schema({
    date: { type: String, required: true }, // Unique document per day
    tasks: [
        {
            taskId: { type: mongoose.Schema.Types.ObjectId, ref: taskModel, required: true },
            timeWorkedToday: { type: Number, default: 0 },
        },
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: UserModel,
    },
    totalTimeWorked: { type: Number, default: 0 }
}, { timestamps: true })

const timeModel = mongoose.models.timeModel || mongoose.model("timeModel", timeSchema);
export default timeModel;