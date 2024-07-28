// controllers/taskController.js
const Task = require("../models/task");

const getTasks = async (req, res) => {
    try {
        const { id } = req.body;

        if (id) {
            const task = await Task.findOne({ _id: id, user: req.user.id });
            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }
            return res.json(task);
        } else {
            const tasks = await Task.find({ user: req.user.id });
            return res.json(tasks);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, deadline } = req.body;

        const newTask = new Task({
            user: req.user.id,
            title,
            description,
            status,
            priority,
            deadline,
        });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id, title, description, status, priority, deadline } = req.body;

        let task = await Task.findOne({ _id: id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        task.priority = priority || task.priority;
        task.deadline = deadline || task.deadline;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.body;

        let task = await Task.findOne({ _id: id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await Task.deleteOne({ _id: id });
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
