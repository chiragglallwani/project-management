import { Request, Response } from "express";
import { IProject, ITask, TaskStatus } from "../types/types";
const ProjectModel = require("../models/ProjectModel");
const TaskModel = require("../models/TaskModel");
const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const gemini = new GoogleGenAI({ apiKey: API_KEY });
const model = "gemini-2.5-flash";

interface ISummarizeProjectRequest {
  projectId: string;
}

export const summarizeProject = async (
  req: Request<{}, {}, ISummarizeProjectRequest>,
  res: Response<{
    success: boolean;
    error?: string;
    message?: string;
    data?: string;
  }>
) => {
  const { projectId } = req.body;

  const project: IProject | null = await ProjectModel.findById(projectId);
  if (!project) {
    return res
      .status(404)
      .json({ success: false, message: "Project not found" });
  }
  const allTasks: ITask[] | null = await TaskModel.find({ projectId });
  if (!allTasks || allTasks.length === 0) {
    return res.status(404).json({ success: false, message: "Tasks not found" });
  }

  const groupedTasksBasedOnStatus: Record<TaskStatus, ITask[]> =
    allTasks.reduce((acc: any, task: ITask) => {
      acc[task.status] = acc[task.status] || [];
      acc[task.status].push(task);
      return acc;
    }, {});

  const tasksByStatusString = Object.entries(groupedTasksBasedOnStatus)
    .map(([status, tasks]) => {
      const taskList = tasks
        .map(
          (t: ITask) =>
            // Ensure blockReason is included if status is 'blocked'
            ` - ${t.title} [Status: ${t.status}]${
              t.status === "blocked" && t.blockReason
                ? ` (Blocked: ${t.blockReason})`
                : ""
            }`
        )
        .join("\n");
      return `## ${status.toUpperCase()} (${tasks.length} tasks)\n${taskList}`;
    })
    .join("\n\n");

  const systemInstruction = `You are a professional project manager tasked with summarizing the state of a project. Analyze the provided project details and task list to generate a concise summary.`;

  // 2. The User Query (The Data/Context)
  const userQuery = `Project name: ${project.name}
  Project description: ${project.description}
  Tasks by Status:\n${tasksByStatusString}

  Generate a concise summary including:
  - Task counts by status
  - Key blockers (using blockReason)
  - Suggested next steps`;
  try {
    const response = await gemini.models.generateContent({
      model: model,
      contents: [{ role: "user", parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
      config: {
        temperature: 0.3,
        maxOutputTokens: 1024,
        topK: 40,
        topP: 0.9,
      },
    });
    res.status(200).json({
      success: true,
      message: "Project summarized successfully",
      data: response.text ?? "",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to summarize project",
      error: (error as Error).message,
    });
  }
};

interface AssistWithTaskReqBody {
  taskId: string;
  projectId?: string;
  question: string;
}

export const assistWithTask = async (
  req: Request<{}, {}, AssistWithTaskReqBody>,
  res: Response<{
    success: boolean;
    error?: string;
    message?: string;
    data?: string;
  }>
) => {
  try {
    const { taskId, projectId, question } = req.body;

    const task: ITask | null = await TaskModel.findById(taskId);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    let taskContext: string = `Task: ${task.title}\nDescription: ${task.description}\nStatus: ${task.status}`;
    if (task.status === "blocked" && task.blockReason) {
      taskContext += `\nBlock Reason: ${task.blockReason}`;
    }

    if (projectId) {
      const project: IProject | null = await ProjectModel.findById(projectId);
      if (project) {
        taskContext += `\nProject: ${project.name}\nProject Description: ${project.description}`;
      }
    }

    const systemInstruction: string = `You are a helpful project assistant. Answer the user's question concisely, based ONLY on the provided task information and context. If information is missing, clearly state that the details are not available.`;

    const userQuery: string = `${taskContext}\n\nUser question: "${question}"`;

    const response = await gemini.models.generateContent({
      model: model,
      contents: [{ role: "user", parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
      config: {
        temperature: 0.5,
        maxOutputTokens: 1024,
        topK: 40,
        topP: 0.9,
      },
    });
    res.status(200).json({
      success: true,
      message: "Task assisted successfully",
      data: response.text ?? "",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to assist with task",
      error: (error as Error).message,
    });
  }
};
