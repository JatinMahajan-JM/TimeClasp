import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true
    },
    subTasks: [
        {
            id: { type: Number },
            task: { type: String },
            done: { type: Boolean, default: false }
        }
    ],
    category: {
        type: String
    },
    taskType: {
        type: Number,
    },
    priority: {
        type: String
    },
    dueDate: {
        type: String,
    },
    repeat: {
        type: String
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    },
    timeWorked: {
        type: Number,
        default: 0
    },
    timeAllocated: {
        type: String,
    },
    timerStartTime: {
        type: Number,
    },
    timerEnded: {
        type: Boolean,
        default: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true
    })

const taskModel = mongoose.models.taskModel || mongoose.model("taskModel", taskSchema);
export default taskModel;