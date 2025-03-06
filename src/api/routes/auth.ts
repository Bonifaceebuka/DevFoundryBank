import { Container } from 'typedi';
import { Router, Request, Response } from "express";
import AuthController from "../controllers/AuthController";
const authRouter = Router();
const authController = Container.get(AuthController)

authRouter.post("/register", async (req: Request, res: Response) => {
    authController.register(req,res)
});

authRouter.put("/email/verification", async (req: Request, res: Response) => {
    authController.verifyEmail(req, res)
});

authRouter.post("/login", async (req: Request, res: Response) => {
    authController.login(req, res)
});

export default authRouter;