import { Inject, Service } from 'typedi';
import AuthService from "../services/AuthService";
import { Logger } from '../../lib/logger';
import { Tags, Route, Controller, Post, Body, Example, Put } from 'tsoa';
import { EmailVerificationDTO, LoginUserDTO, LoginUserResponseDTO, RegisterUserDTO, RegisterUserResponseDTO } from '../dtos/AuthDTO';
import { CustomApiResponse, errorResponse, serverErrorResponse, successResponse } from '../helpers/responseHandlers';
import { MESSAGES } from '../constants/messages';
import { ACTIVITY_TYPES } from '../constants/activity_types';

@Tags("Auth")
@Route("auth/gateway")
@Service()
export class GatewayController extends Controller {
    private readonly logger: Logger;
    constructor(
       @Inject(()=> Logger) logger: Logger,
        private readonly authService: AuthService,
    ){
        super()
        this.logger = new Logger(GatewayController.name);
    }

    @Post("/")
    public async register(@Body() req: RegisterUserDTO): Promise<CustomApiResponse> {
            const newUser = await this.authService.registerUser(req);
            if (newUser.itExists) {
                this.logger.info({
                    activity_type:ACTIVITY_TYPES.USER_REGISTRATION,
                    message: newUser?.message,
                    metadata: {
                        user: {
                            email: newUser?.user?.email
                        }
                    }
                });
                this.setStatus(400)
                return errorResponse(newUser?.message as string, newUser.user)
                }

            this.logger.info({
                activity_type:ACTIVITY_TYPES.USER_REGISTRATION,
                message: newUser?.message,
                metadata: {
                    user: {
                        email: newUser?.user?.email
                    }
                }
            });
            this.setStatus(201)
            return successResponse(newUser?.message as string, newUser.user, 201)
    }
}