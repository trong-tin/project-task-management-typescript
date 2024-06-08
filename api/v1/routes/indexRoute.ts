import { Express } from "express";
import { taskRoutes } from "./taskRoute";
import { userRoutes } from "./userRoute";
import * as authMiddleware from "../../middlewares/authMiddleware";

const mainV1Routes = (app: Express): void => {
  const version = "/api/v1";

  app.use(version + "/tasks", authMiddleware.requireAuth, taskRoutes);

  app.use(version + "/users", userRoutes);
};

export default mainV1Routes;
