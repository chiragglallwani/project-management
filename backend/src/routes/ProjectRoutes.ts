import { Router } from "express";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/ProjectController";

const ProjectRoutes = Router();

ProjectRoutes.post("/", createProject);
ProjectRoutes.get("/", getProjects);
ProjectRoutes.get("/:id", getProject);
ProjectRoutes.put("/:id", updateProject);
ProjectRoutes.delete("/:id", deleteProject);

export default ProjectRoutes;
