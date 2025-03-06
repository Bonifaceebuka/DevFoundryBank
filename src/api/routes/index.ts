import { Router } from "express";
import userRouter from "./user";
import authRouter from "./auth";
import withdrawalAccountRouter from "./withdrawal_account";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/withdrawal-accounts", withdrawalAccountRouter); 

router.get("/", (req, res) => {
    res.json({ message: "API URL!" });
});

export default router;