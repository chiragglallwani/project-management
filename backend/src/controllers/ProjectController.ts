import { Request, Response } from "express";
import { IProject } from "../types/types";
const ProjectModel = require("../models/ProjectModel");

interface CreateProjectReqBody {
  name: string;
  description: string;
}

interface UpdateProjectReqBody {
  name?: string;
  description?: string;
}

export const createProject = async (
  req: Request<{}, {}, CreateProjectReqBody>,
  res: Response<{ message: string; success: boolean; error?: string }>
) => {
  try {
    const { name, description } = req.body;
    await ProjectModel.create({
      name,
      description,
    });
    res.status(200).json({
      message: "Project created successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      message: "Failed to create project",
      success: false,
      error: (error as Error).message,
    });
  }
};

export const getProjects = async (
  req: Request,
  res: Response<{
    data?: IProject[];
    success: boolean;
    error?: string;
    message?: string;
  }>
) => {
  try {
    const projects: IProject[] = await ProjectModel.find();
    res.status(200).json({
      data: projects.map((project) => ({
        id: project.id.toString(),
        name: project.name,
        description: project.description,
        createdAt: project.createdAt,
      })),
      success: true,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: (error as Error).message,
    });
  }
};

export const getProject = async (
  req: Request<{ id: string }>,
  res: Response<{
    data?: IProject;
    success: boolean;
    error?: string;
    message?: string;
  }>
) => {
  try {
    const { id } = req.params;
    const project: IProject | null = await ProjectModel.findById(id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.status(200).json({
      data: {
        id: project.id.toString(),
        name: project.name,
        description: project.description,
        createdAt: project.createdAt,
      },
      success: true,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error: (error as Error).message,
    });
  }
};

export const updateProject = async (
  req: Request<{ id: string }, {}, UpdateProjectReqBody>,
  res: Response<{ success: boolean; error?: string; message?: string }>
) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatePayload: UpdateProjectReqBody = {};
    if (name !== undefined) updatePayload.name = name;
    if (description !== undefined) updatePayload.description = description;

    const project: IProject | null = await ProjectModel.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true }
    );

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Project updated successfully" });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: (error as Error).message,
    });
  }
};

export const deleteProject = async (
  req: Request<{ id: string }>,
  res: Response<{ success: boolean; error?: string; message?: string }>
) => {
  try {
    const { id } = req.params;
    const project: IProject | null = await ProjectModel.findByIdAndDelete(id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: (error as Error).message,
    });
  }
};
