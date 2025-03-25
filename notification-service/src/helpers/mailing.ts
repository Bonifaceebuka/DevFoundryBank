import { emailTransporter } from "../common/configs/mailing";
import { SendMailOptions } from "nodemailer";

interface CustomMailOptions extends SendMailOptions {
    template: string;
    context?: any;
}

export const sendEmail = async (to: string, name: string, subject: string, template: string, data: any) => {
    try {
        const mailOptions: CustomMailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            template,
            context: data,
        };
        
        await emailTransporter.sendMail(mailOptions);
        
    } catch (error) {
        console.error("Error sending email:", error);
    }
};
