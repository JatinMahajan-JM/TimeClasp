import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true
    },
    subTasks: [
        {
            type: String,
        }
    ],
    taskType: {
        type: Boolean,
    },
    priority: {
        type: String
    },
    dueDate: {
        type: Date,
    },
    repeat: {
        type: String
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    }
})

const taskModel = mongoose.models.taskModel || mongoose.model("taskModel", taskSchema);
export default taskModel;