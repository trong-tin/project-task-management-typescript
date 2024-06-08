import { Router, Request, Response } from "express";
import * as controller from "../controllers/userController";
const router: Router = Router();

router.post("/register", controller.register);

router.post("/login", controller.login);

export const userRoutes: Router = router;
