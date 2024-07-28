const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        status: {
            type: String,
            enum: ["To-Do", "In Progress", "Under Review", "Completed"],
            default: "To-Do",
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "Urgent"],
            default: "Low",
        },
        deadline: { type: Date },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
