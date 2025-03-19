import { Response, Request, NextFunction } from "express";
import { ValidateError } from "tsoa";
import { AppError } from "../errors/AppError";

export const errorHandlerMiddlware = (err: any, req: Request, res: Response, next: NextFunction) =>{
    if (res.headersSent) {
        return next(err);
    }
    if (err instanceof ValidateError) {
         res.status(400).json({
            message: {
                 type: "Field validation",
                 fields: err.fields,
            },
            status_code: 400,
        });
        return;
    }

    if (err instanceof AppError) {
         res.status(err.statusCode).json({
            message: err.message,
            status_code: err.statusCode ? err.statusCode : 400,
            data: err.data ? err.data : null,
        });
        return 
    }

     res.status(500).json({
         status_code: 500,
         data: null,
         message: err instanceof Error ? err.message : "Unknown internal server error",
    });
}