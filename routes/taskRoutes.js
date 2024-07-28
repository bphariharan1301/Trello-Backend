// routes/taskRoutes.js
const express = require("express");
const {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
} = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/get", getTasks); // Route to get all tasks or a specific task based on id in the request body
router.post("/create", createTask); // Route to create a task
router.post("/update", updateTask); // Route to update a task based on id in the request body
router.post("/delete", deleteTask); // Route to delete a task based on id in the request body

module.exports = router;
