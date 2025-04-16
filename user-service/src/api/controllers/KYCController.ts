import { CustomApiResponse, serverErrorResponse } from '../helpers/responseHandlers';
import KycService from "../services/KycService";
import { Inject, Service } from 'typedi';
import { Logger } from "../../lib/logger";
import { Example, Get, Request, Route, Security, Tags, Controller, Put, Post } from "tsoa";
import { FetchProfileResponseDTO, UpdateProfileResponseDTO } from "../dtos/UserDTO";
import { CreatePinDTO } from "../dtos/UserPinDTO";
import { errorResponse, successResponse } from "../helpers/responseHandlers";
import { MESSAGES } from "../constants/messages";
import { ACTIVITY_TYPES } from "../constants/activity_types";
import { KycData } from '../dtos/kycDTO';
import { AppError } from '../errors/AppError';

@Service()
@Tags("User KYC")
@Route("kyc")
export class KYCController extends Controller {
    private readonly logger: Logger
      constructor(
            private readonly kycService: KycService,
            @Inject(()=> Logger) logger: Logger,
        ){
          super()
          this.logger = new Logger(KYCController.name);
        }

    @Post("/")
    @Security("bearerAuth")
    public async tier1_kyc(@Request() req: any)
    : Promise<FetchProfileResponseDTO> 
    {
        try {
            const authUserId = req.authId
            const kycData: KycData = {
                id: authUserId,
                bvn: req.body.bvn,
                dob: req.body.dob,
                tier: req.body.tier
            }
            const fetchedUser = await this.kycService.performTier1KYC(kycData);

            let message;
            if (!fetchedUser) {
                message = MESSAGES.USER.NOT_FOUND
                this.logger.info({
                        activity_type: ACTIVITY_TYPES.USER_PROFILE,
                        message,
                        metadata: {
                            user: {
                                id: req?.authId
                            }
                        }
                    });
                this.setStatus(404)
                return errorResponse(message,null,404)
            }
            message = MESSAGES.USER.KYC.SUCCESSFUL;
            this.logger.info({
                activity_type: ACTIVITY_TYPES.USER_PROFILE,
                    message,
                    metadata: {
                        user: {
                            id: fetchedUser.id
                        }
                    }
                });
            this.setStatus(200)
            return successResponse(message, fetchedUser)
        } catch (error: any) {
            this.logger.error({
                activity_type: ACTIVITY_TYPES.USER_PROFILE,
                message: error.message,
                metadata: {
                    user: {
                        email: req.body?.email
                    }
                }
            });
            if(error instanceof AppError && error.statusCode && error.statusCode == 400){
                return serverErrorResponse(error.message);
            }
            return serverErrorResponse(MESSAGES.COMMON.INTERNAL_SERVER_ERROR);
        }
    }
}