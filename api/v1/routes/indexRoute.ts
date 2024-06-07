import { Express } from "express";
import { taskRoutes } from "./taskRoute";

const mainV1Routes = (app: Express):void => {

  const version = "/api/v1";

  app.use(version + "/tasks", taskRoutes);

};

export default mainV1Routes;
