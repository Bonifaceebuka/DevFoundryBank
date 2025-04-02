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