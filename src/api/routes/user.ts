import { Container } from 'typedi';
import { Router, Request, Response } from "express";
import UserController from "../controllers/UserController";
import AppMiddleware from "../middlewares/AppMiddleware";

const userRouter = Router();
const userController = Container.get(UserController)
const appMiddleware = Container.get(AppMiddleware)

userRouter.get("/", appMiddleware.userAuthMiddleware, async(req: Request, res: Response)=>{
    userController.fetchProfile(req,res)
});

userRouter.post("/pins", appMiddleware.userAuthMiddleware, async (req: Request, res: Response) => {
    userController.createNewPin(req, res)
});

userRouter.put("/", appMiddleware.userAuthMiddleware, async (req: Request, res: Response) => {
    userController.updateProfile(req, res)
});
export default userRouter;