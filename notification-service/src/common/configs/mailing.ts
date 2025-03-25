import { CONFIGS } from "../config";
import hbs from "nodemailer-express-handlebars"
import nodemailer from "nodemailer"
import path from "path"

export const emailTransporter = nodemailer.createTransport({
    host: CONFIGS.MAIL.MAIL_HOST,
    port: 465,
    secure: CONFIGS.MAIL.MAIL_SECURE as boolean,
    auth: {
        user: `${CONFIGS.MAIL.MAIL_USERNAME}`,
        pass: `${CONFIGS.MAIL.MAIL_PASSWORD}`
    }
});

emailTransporter.use(
    "compile",
    hbs({
        viewEngine: {
            partialsDir: path.join(__dirname, "views/emails/partials"),
            layoutsDir: path.join(__dirname, "views/emails/layouts"),
            defaultLayout: "main",
        },
        viewPath: path.join(__dirname, "views/emails"),
        extName: ".hbs",
    })
);