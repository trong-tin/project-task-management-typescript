import { Request, Response } from "express";
import Task from "../models/taskModel";

// [GET] /v1/api/tasks
export const index = async (req: Request, res: Response) => {
  const tasks = await Task.find({
    deleted: false,
  });
  res.json({
    code: 200,
    tasks,
  });
};

// [GET] /v1/api/tasks/detail/:id
export const detail = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const task = await Task.findOne({
    deleted: false,
    _id: id,
  });
  res.json({
    code: 200,
    task,
  });
};
