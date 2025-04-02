import { CONFIGS } from "../common/configs";
import { emailTransporter } from "../common/configs/mailing";
import { SendMailOptions } from "nodemailer";
import path from "path"
import { create } from "express-handlebars";
import fs from "fs";
interface CustomMailOptions extends SendMailOptions {
    template?: string;
    context?: any;
}


const hbs = create({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "../../views/emails/layouts"),
    partialsDir: path.join(__dirname, "../../views/emails/partials"),
    defaultLayout: "main",
})

const handlebarsInstance = hbs.handlebars as unknown as any;

export const sendEmail = async (to: string, subject: string, template: string, data: any) => {
    const templatePath = path.join(__dirname, `../views/emails/${template}.hbs`);
    if (!fs.existsSync(templatePath)) {
        console.error(`❌ Template "${template}.hbs" not found!`);
        return;
    }
    const templateSource = fs.readFileSync(templatePath, "utf8");
    const compiledTemplate = hbs.handlebars.compile(templateSource,{})(data);
    
    const layoutPath = path.join(__dirname, "../views/emails/layouts/main.hbs");
    const layoutSource = fs.readFileSync(layoutPath, "utf8");

    const registerPartial = (name: string, filePath: string) => {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, "utf8");
            handlebarsInstance.registerPartial(name, content);
        } else {
            console.error(`⚠️ Warning: ${name} partial not found!`);
        }
    };

    registerPartial("header", path.join(__dirname, "../views/emails/partials/header.hbs"));
    registerPartial("footer", path.join(__dirname, "../views/emails/partials/footer.hbs"));


    const compiledMailTemplate = handlebarsInstance.compile(layoutSource)({
        subject,
        body: compiledTemplate,
    });

    try {
        const mailOptions: CustomMailOptions = {
            from: CONFIGS.MAIL.SENDER_NAME,
            to,
            subject,
            template,
            html: compiledMailTemplate,
            context: data,
        };
        
        const info = await emailTransporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};