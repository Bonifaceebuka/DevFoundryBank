import { Logger } from "../../lib/logger/Logger";
import PasswordResetService from "../services/PasswordResetService";
import { Inject, Service } from "typedi";
import { Controller, Route, Body, Post, Example, Response, SuccessResponse, Tags, Put, Path } from "tsoa";
import { PasswordResetResponseDTO, PasswordResetRequestDTO, SetNewPasswordRequestDTO } from "../dtos/PasswordResetDTO";

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
    : Promise<PasswordResetResponseDTO> 
    {
        const { email } = passwordResetRequest; 
        try {
            const sentRequest = await this.passwordResetService.requestPasswordReset(passwordResetRequest);
                this.logger.info({
                    activity_type: "Request for password reset",
                    message: sentRequest.message,
                    metadata: {
                        user: {
                            email
                        }
                    }
                });
                this.setStatus(201);
                return {
                    ...sentRequest
                }
            } catch (error: any) {
                this.logger.error({
                    activity_type: "Request for password reset",
                    message: error.message,
                    metadata: {
                        user: {
                            email
                        }
                    }
                });
                throw new Error("Something went wrong");
            }
        }

    @Put("/")
    @Example<PasswordResetRequestDTO>({
        email: "boniface@developersfoundry.com"
    })
    public async setNewPassword(
        @Body() setNewPassword: SetNewPasswordRequestDTO)
        : Promise<PasswordResetResponseDTO> {
        try {
            const sentRequest = await this.passwordResetService.setNewPassword(setNewPassword);
            this.logger.info({
                activity_type: "Request for password reset",
                message: sentRequest?.message,
                metadata: {}
            });
            this.setStatus(201);
            return {
                ...sentRequest
            }
        } catch (error: any) {
            this.logger.error({
                activity_type: "Request for password reset",
                message: error.message,
                metadata: {}
            });
            throw new Error("Something went wrong");
        }
    }
}