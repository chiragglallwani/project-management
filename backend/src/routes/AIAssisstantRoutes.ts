import { Router } from "express";
import {
  summarizeProject,
  assistWithTask,
} from "../controllers/AIAssistantController";

const AIAssisstantRoutes = Router();

AIAssisstantRoutes.post("/summarize-project", summarizeProject);
AIAssisstantRoutes.post("/ask", assistWithTask);

export default AIAssisstantRoutes;
