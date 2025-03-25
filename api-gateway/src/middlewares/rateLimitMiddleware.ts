import rateLimit from "express-rate-limit";

export const rateLimitMiddleware = rateLimit({
    windowMs: 20 * 60 * 1000,
    max: 100,
    message:{error: "Too many requests already made, pleas try again"},
    headers: true
});