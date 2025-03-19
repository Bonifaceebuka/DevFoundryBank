import { Logger } from "../../lib/logger/Logger";
import PasswordResetService from "../services/PasswordResetService";
import { Inject, Service } from "typedi";
import { Controller, Route, Body, Post, Example, Response, SuccessResponse, Tags, Put, Path } from "tsoa";
import { PasswordResetResponseDTO, PasswordResetRequestDTO, SetNewPasswordRequestDTO } from "../dtos/PasswordResetDTO";
import { MESSAGES } from "../constants/messages";
import { CustomApiResponse, errorResponse, serverErrorResponse, successResponse } from "../helpers/responseHandlers";
import { ACTIVITY_TYPES } from "../constants/activity_types";

@Route("password/reset")
@Tags("Password Reset")
@Service()
export class PasswordResetController extends Controller {
    private readonly logger: Logger;
    constructor(
        @Inject(()=> Logger) logger: Logger,
        private readonly passwordResetService: PasswordResetService
    ){
        super()
        this.logger = new Logger(PasswordResetController.name);
    }
    @Post("/")
    @Example<PasswordResetRequestDTO>({
        email: "boniface@developersfoundry.com"
    })
    public async performPasswordResetRequest(@Body() passwordResetRequest: PasswordResetRequestDTO)
    : Promise<CustomApiResponse> 
    {
        const { email } = passwordResetRequest; 
        try {
            const sentRequest = await this.passwordResetService.requestPasswordReset(passwordResetRequest);
                this.logger.info({
                    activity_type: ACTIVITY_TYPES.USER.PASSWORD_RESET.REQUEST,
                    message: sentRequest.message,
                    metadata: {
                        user: {
                            email
                        }
                    }
                });
                this.setStatus(201);
                if (sentRequest.isSuccess) {
                    return successResponse(sentRequest.message as string)
                }

                this.setStatus(400);
                return errorResponse(sentRequest.message as string)
            } catch (error: any) {
                this.logger.error({
                    activity_type: ACTIVITY_TYPES.USER.PASSWORD_RESET.REQUEST,
                    message: error.message,
                    metadata: {
                        user: {
                            email
                        }
                    }
                });
                return serverErrorResponse(MESSAGES.COMMON.INTERNAL_SERVER_ERROR);
            }
        }

    @Put("/")
    public async setNewPassword(
        @Body() setNewPassword: SetNewPasswordRequestDTO)
        : Promise<CustomApiResponse> {
        try {
            const sentRequest = await this.passwordResetService.setNewPassword(setNewPassword);
            this.logger.info({
                activity_type: ACTIVITY_TYPES.USER.PASSWORD_RESET.NEW_PASSWORD,
                message: sentRequest?.message,
                metadata: {}
            });
            this.setStatus(200);
            if (sentRequest.isSuccess) {
                return successResponse(sentRequest.message as string)
            }

            this.setStatus(400);
            return errorResponse(sentRequest.message as string)
        } catch (error: any) {
            this.logger.error({
                activity_type: ACTIVITY_TYPES.USER.PASSWORD_RESET.NEW_PASSWORD,
                message: error.message,
                metadata: {}
            });
            return serverErrorResponse(MESSAGES.COMMON.INTERNAL_SERVER_ERROR);
        }
    }
}