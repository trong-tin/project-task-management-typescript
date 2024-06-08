import { Router, Request, Response } from "express";
import * as controller from "../controllers/userController";
import * as authMiddleware from "../../middlewares/authMiddleware";
const router: Router = Router();

router.post("/register", controller.register);

router.post("/login", controller.login);

router.get("/detail", authMiddleware.requireAuth, controller.detail);

export const userRoutes: Router = router;
