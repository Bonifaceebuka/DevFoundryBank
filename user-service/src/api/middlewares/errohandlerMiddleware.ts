import { Response, Request } from "express";

export const errorHandlerMiddlware = (req: Request, res: Response) =>{
    return res.status(500).json({

    })
}