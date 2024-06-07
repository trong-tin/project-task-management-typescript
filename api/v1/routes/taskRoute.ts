import { Router, Request, Response } from "express";
import Task from "../models/taskModel";
const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  const tasks = await Task.find({
    deleted: false,
  });
  console.log(tasks);
  res.json({
    code: 200,
    tasks,
  });
});

router.get("/detail/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const task = await Task.findOne({
    deleted: false,
    _id: id,
  });
  res.json({
    code: 200,
    task,
  });
});
export const taskRoutes: Router = router;
