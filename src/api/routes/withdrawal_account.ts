import { Container } from 'typedi';
import { Router, Request, Response } from "express";
import WithdrawalAccountController from "../controllers/WithdrawalAccountController";
import AppMiddleware from "../middlewares/AppMiddleware";
const withdrawalAccountRouter = Router();
const appMiddleware = Container.get(AppMiddleware)
const withdrawalAccountController = Container.get(WithdrawalAccountController)

withdrawalAccountRouter.post("/", appMiddleware.userAuthMiddleware, async (req: Request, res: Response) => {
    withdrawalAccountController.createNewWithdrawalAccount(req,res)
});

withdrawalAccountRouter.get("/", appMiddleware.userAuthMiddleware, async (req: Request, res: Response) => {
    withdrawalAccountController.listWithdrawalAccounts(req, res)
});
withdrawalAccountRouter.delete("/:id", appMiddleware.userAuthMiddleware, async (req: Request, res: Response) => {
    withdrawalAccountController.deleteWithdrawalAccount(req, res)
});
withdrawalAccountRouter.get("/:id", appMiddleware.userAuthMiddleware, async (req: Request, res: Response) => {
    withdrawalAccountController.showWithdrawalAccountDetails(req, res)
});

export default withdrawalAccountRouter;
