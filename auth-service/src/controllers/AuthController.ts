import { Inject, Service } from 'typedi';
import { Tags, Route, Controller, Post, Body, Example, Put } from 'tsoa';
import { CustomApiResponse, errorResponse, serverErrorResponse, successResponse } from '../helpers/responseHandlers';
import { Logger } from '../common/configs/logger';
import AuthService from '../services/AuthService';
import { ACTIVITY_TYPES } from '../common/constants/activity_types';
import { MESSAGES } from '../common/constants/messages';
import { AuthUserDTO } from '../dto/AuthDTO';

@Tags("Auth")
@Route("auth")
@Service()
export class AuthController extends Controller {
    private readonly logger: Logger;
    constructor(
       @Inject(()=> Logger) logger: Logger,
        private readonly authService: AuthService,
    ){
        super()
        this.logger = new Logger(AuthController.name);
    }

    @Post("/register")
    public async register(@Body() req: AuthUserDTO)
    // : Promise<CustomApiResponse> 
    {
            const newUser = await this.authService.registerUser(req);
            if (newUser.itExists) {
                this.logger.info({
                    activity_type:ACTIVITY_TYPES.USER_REGISTRATION,
                    message: newUser?.message,
                    metadata: {
                        // user: {
                        //     email: newUser?.user?.email
                        // }
                    }
                });
                this.setStatus(400)
                return errorResponse(newUser?.message as string, newUser.user)
                }

            this.logger.info({
                activity_type:ACTIVITY_TYPES.USER_REGISTRATION,
                message: newUser?.message,
                metadata: {
                    // user: {
                    //     email: newUser?.user?.email
                    // }
                }
            });
            this.setStatus(201)
            return successResponse(newUser?.message as string, newUser.user, 201)
    }

    // @Post("/login")
    // public async login(@Body() req: AuthUserDTO): Promise<CustomApiResponse> {
    //     const{ email } = req;
    //         const authUser = await this.authService.loginUser(req);
    //         const { message, token, user } = authUser
    //         this.logger.info({
    //             activity_type: ACTIVITY_TYPES.USER_LOGIN,
    //             message,
    //             metadata: {
    //                 user: {
    //                     email
    //                 }
    //             }
    //         });
    //         if (!authUser?.isSuccess) {
    //             this.setStatus(400)
    //             return errorResponse(MESSAGES.LOGIN.INVALID_LOGIN)
    //         }
    //         this.setStatus(200)
    //         const data ={
    //             user,
    //             token
    //         }
    //         return successResponse(MESSAGES.LOGIN.LOGIN_SUCCESSFUL, data)
    // }


    // @Put("/email/verification")
    // @Example<LoginUserResponseDTO>({
    //     isSuccess: true,
    // })

    // public async verifyEmail(@Body() req: EmailVerificationDTO): Promise<CustomApiResponse>{
    //     const { email } = req;

    //     try {
    //         const user = await this.authService.validateEmail(req);
    //         let message = null;
    //         if (user.isSuccess) {
    //             message = MESSAGES.EMAIL_VERIFICATION.FAILED;
    //             this.logger.info({
    //                 activity_type: ACTIVITY_TYPES.USER_EMAIL_VERIFICATION,
    //                 message,
    //                 metadata: {
    //                     user: {
    //                         email
    //                     }
    //                 }
    //             });

    //             this.setStatus(200)
    //             return successResponse(MESSAGES.EMAIL_VERIFICATION.SUCCESS, user.isSuccess);
    //         }
    //         message = "User email verification failed";
    //         this.setStatus(400)
    //         return errorResponse(message, user.isSuccess);

    //     } catch (error: any) {
    //         this.logger.error({
    //             activity_type:ACTIVITY_TYPES.USER_REGISTRATION,
    //             message: error.message,
    //             metadata: {
    //                 user: {
    //                     email
    //                 }
    //             }
    //         });
    //         return serverErrorResponse(MESSAGES.COMMON.INTERNAL_SERVER_ERROR);
    //     }
    // }
}