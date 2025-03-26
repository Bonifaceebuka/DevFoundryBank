import { CONFIGS } from ".";
import nodemailer from "nodemailer"
import path from "path"
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const emailTransporter = nodemailer.createTransport({
    host: CONFIGS.MAIL.MAIL_HOST,
    port: CONFIGS.MAIL.MAIL_PORT as unknown as number,
    secure: false,
    auth: {
        user: `${CONFIGS.MAIL.MAIL_USERNAME}`,
        pass: `${CONFIGS.MAIL.MAIL_PASSWORD}`
    }
} as SMTPTransport.Options);

const loadHandlebars = async () => {
    const { default: hbs } = await import("nodemailer-express-handlebars");
    return hbs;
};

(async () => {
const hbs = await loadHandlebars();
emailTransporter.use(
    "compile",
    hbs({
        viewEngine: {
            extname:".hbs",
            partialsDir: path.join(__dirname,  "../../views/emails/partials"),
            layoutsDir: path.join(__dirname,  "../../views/emails/layouts"),
            defaultLayout: false,
        },
        viewPath: path.join(__dirname, "../../views/emails"),
        extName: ".hbs",
    })
);
})