const Task = require("../models/task");

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createTask = async (req, res) => {
    const { title, description, status, priority, deadline } = req.body;
    try {
        const task = await Task.create({
            title,
            description,
            status,
            priority,
            deadline,
            user: req.user.id,
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        await Task.findByIdAndDelete(id);
        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
