import { CustomApiResponse, serverErrorResponse } from '../helpers/responseHandlers';
import UserService from "../services/UserService";
import { Inject, Service } from 'typedi';
import { Logger } from "../../lib/logger";
import { Example, Get, Request, Route, Security, Tags, Controller, Put, Post } from "tsoa";
import { FetchProfileResponseDTO, UpdateProfileResponseDTO } from "../dtos/UserDTO";
import { CreatePinDTO } from "../dtos/UserPinDTO";
import { errorResponse, successResponse } from "../helpers/responseHandlers";
import { MESSAGES } from "../constants/messages";
import { ACTIVITY_TYPES } from "../constants/activity_types";

@Service()
@Tags("User Profile")
@Route("")
export class UserController extends Controller {
    private readonly logger: Logger
      constructor(
            private readonly userService: UserService,
            @Inject(()=> Logger) logger: Logger,
        ){
          super()
          this.logger = new Logger(UserController.name);
        }

    @Get("/")
    @Security("bearerAuth")
    public async getUserInformation(@Request() req: any)
    // : Promise<FetchProfileResponseDTO> 
    {
        // try {
        //     const authUserId = req.authId
        //     const fetchedUser = await this.userService.getUserInformation(authUserId);
        //     let message = MESSAGES.USER.NOT_FOUND;
        //     this.logger.info({
        //             activity_type: ACTIVITY_TYPES.USER_PROFILE,
        //             message,
        //             metadata: {
        //                 user: {
        //                     id: fetchedUser?.id
        //                 }
        //             }
        //         });
        //     if (!fetchedUser) {
        //         this.setStatus(404)
        //         return errorResponse(message,null,404)
        //     }
        //     message = MESSAGES.USER.USER_ACCOUNT_FETCHED;
        //     this.logger.info({
        //         activity_type: ACTIVITY_TYPES.USER_PROFILE,
        //             message,
        //             metadata: {
        //                 user: {
        //                     id: fetchedUser.id
        //                 }
        //             }
        //         });
        //     this.setStatus(200)
        //     return successResponse(message, fetchedUser)
        // } catch (error: any) {
        //     this.logger.error({
        //         activity_type: ACTIVITY_TYPES.USER_PROFILE,
        //         message: error.message,
        //         metadata: {
        //             user: {
        //                 email: req.body?.email
        //             }
        //         }
        //     });
        //     return serverErrorResponse(MESSAGES.COMMON.INTERNAL_SERVER_ERROR);
        // }
    }

    @Security("bearerAuth")
    @Post('/pin')
    public async createNewPin(@Request() req: any) {
        try {
            const pin = req.body.pin;
            const user_id = req.authId;
            const createPin = await this.userService.setPin(user_id, pin);
            const { message, isSuccess } = createPin

            if (createPin.isSuccess) {
                this.logger.info({
                    activity_type: ACTIVITY_TYPES.TRANSACTION_PIN.CREATION,
                    message: message,
                    metadata: {}
                });
                this.setStatus(201)
                return successResponse(message as string,null, 201)
            }
            this.logger.info({
                    activity_type: ACTIVITY_TYPES.TRANSACTION_PIN.CREATION,
                    message: createPin.message,
                    metadata: {
                        user: {}
                    }
                });
            this.setStatus(400)
            return errorResponse(message as string)
        } catch (error: any) {
            this.logger.error({
                activity_type: ACTIVITY_TYPES.TRANSACTION_PIN.CREATION,
                message: error.message,
                metadata: {}
            });
            return serverErrorResponse(MESSAGES.COMMON.INTERNAL_SERVER_ERROR);
        }
    }

    @Put("/")
    @Security("bearerAuth")
    public async updateProfile(@Request() req: any)
    : Promise<CustomApiResponse> 
    {
        try {
            const updatedUser = await this.userService.update(req.authId, req.body);
            const { message, user, isSuccess } = updatedUser;
            if (!updatedUser?.isSuccess) {
                this.logger.info({
                    activity_type: ACTIVITY_TYPES.USER.PROFILE_UPDATE,
                    message,
                    metadata: {
                        user: {
                            email: updatedUser?.user?.user_id
                        }
                    }
                });
                this.setStatus(400)
                return errorResponse(message as string, user)
            }
            this.logger.info({
                    activity_type: ACTIVITY_TYPES.USER.PROFILE_UPDATE,
                    message: updatedUser.message,
                    metadata: {
                        user: {
                            id: updatedUser?.user?.user_id
                        }
                    }
                });
            this.setStatus(200)
            return successResponse(message as string, user)
        } catch (error: any) {
            this.logger.error({
                activity_type: ACTIVITY_TYPES.USER.PROFILE_UPDATE,
                message: error.message,
                metadata: {}
            });
            return serverErrorResponse(MESSAGES.COMMON.INTERNAL_SERVER_ERROR);
        }
    }
}