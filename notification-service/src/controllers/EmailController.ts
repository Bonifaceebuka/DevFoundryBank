import { Inject, Service } from 'typedi';
import { Tags, Route, Controller, Post, Get, Body } from 'tsoa';
import { CustomApiResponse, errorResponse, serverErrorResponse, successResponse } from '../helpers/responseHandlers';
import EmailService from '../services/EmailService';
import { SendMailDTO } from '../dto/sendmail.dto';
import { Logger } from '../common/configs/logger';
import { sendEmail } from '../helpers/mailing';

@Tags("Mailing")
@Route("mailing")
@Service()
export class EmailController extends Controller {
    private readonly logger: Logger;
    constructor(
        @Inject(() => Logger) logger: Logger,
        private readonly emailService: EmailService,
    ) {
        super()
        this.logger = new Logger(EmailController.name);
    }

    @Post("/sendmail")
    public async register(@Body() req: SendMailDTO){
        const {to, subject, template, data} = req;
        await sendEmail(to, subject, template, { to, subject, template, data })
        // if (newUser.itExists) {
            // this.logger.info({
            //     activity_type: ACTIVITY_TYPES.USER_REGISTRATION,
            //     message: newUser?.message,
            //     metadata: {
            //         user: {
            //             email: newUser?.user?.email
            //         }
            //     }
            // });
            this.setStatus(400)
            // return errorResponse(newUser?.message as string, newUser.user)
        // }

        // this.logger.info({
        //     activity_type: ACTIVITY_TYPES.USER_REGISTRATION,
        //     message: newUser?.message,
        //     metadata: {
        //         user: {
        //             email: newUser?.user?.email
        //         }
        //     }
        // });
        this.setStatus(201)
        // return successResponse(newUser?.message as string, newUser.user, 201)
    }

    @Get("/")
    public async healthcheck() {
        this.setStatus(200)
        return{
            "message": "Notification service is running!"
        }
    }

}