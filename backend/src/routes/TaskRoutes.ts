import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/TaskController";

const TaskRoutes = Router();

TaskRoutes.post("/", createTask);
TaskRoutes.get("/", getTasks);
TaskRoutes.put("/:id", updateTask);
TaskRoutes.delete("/:id", deleteTask);

export default TaskRoutes;
