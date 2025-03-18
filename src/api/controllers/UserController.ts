import UserService from "../services/UserService";
import { Inject, Service } from 'typedi';
import { Logger } from "../../lib/logger";
import { Example, Get, Request, Route, Security, Tags, Controller, Put } from "tsoa";
import { FetchProfileResponseDTO, UpdateProfileResponseDTO } from "../dtos/UserDTO";
import { CreatePinDTO } from "../dtos/UserPinDTO";

@Service()
@Tags("User Profile")
@Route("user")
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
    @Example<FetchProfileResponseDTO>({
        user: null,
        message: "User profile was fetched successfully",
    })
    @Security("jwt")
    public async fetchProfile(@Request() req: any): Promise<FetchProfileResponseDTO> {
        try {
            const authUserId = req.authId
            const newUser = await this.userService.getUserInformation(authUserId);
            let message = "User account was not found!";
            this.logger.info({
                    activity_type: "Fetch user profile",
                    message,
                    metadata: {
                        user: {
                            email: newUser?.email
                        }
                    }
                });
            if (!newUser) {
                this.setStatus(404)
                return {
                    user: null,
                    message
                 }
            }
            message = "User account info was fetched!";
            this.logger.info({
                    activity_type: "Fetch user profile",
                    message,
                    metadata: {
                        user: {
                            email: newUser.email
                        }
                    }
                });
            this.setStatus(200)
                return {
                    user: newUser,
                    message
                }
        } catch (error: any) {
            this.logger.error({
                activity_type: "Fetch user profile",
                message: error.message,
                metadata: {
                    user: {
                        email: req.body?.email
                    }
                }
            });
            throw new Error("Something went wrong");
        }
    }

    @Example<CreatePinDTO>({
        user_id: 1,
        pin: "97776",
    })
    @Security("jwt")
    public async createNewPin(@Request() req: any) {
        try {
            const pin = req.pin;
            const user_id = req.authId;
            const createPin = await this.userService.setPin(user_id, pin);
            const { message, isSuccess } = createPin

            if (createPin.isSuccess) {
                this.logger.info({
                    activity_type: "Create new transaction PIN",
                    message: message,
                    metadata: {}
                });
                this.setStatus(200)
                return { 
                    isSuccess,
                    message
                }
            }
            this.logger.info({
                    activity_type: "Create new transaction PIN",
                    message: createPin.message,
                    metadata: {
                        user: {}
                    }
                });
            this.setStatus(400)
            return {
                isSuccess,
                message
            }
        } catch (error: any) {
            this.logger.error({
                activity_type: "Create new transaction PIN",
                message: error.message,
                metadata: {}
            });
            throw new Error("Something went wrong");
        }
    }

    @Put("/")
    @Example<UpdateProfileResponseDTO>({
        user: null,
        isSuccess: true,
        message: "User profile was updated successfully",
    })
    @Security("jwt")
    public async updateProfile(@Request() req: any): Promise<UpdateProfileResponseDTO> {
        try {
            const updatedUser = await this.userService.update(req.authId, req.body);
            const { message, user, isSuccess } = updatedUser;
            if (!updatedUser?.isSuccess) {
                this.logger.info({
                    activity_type: "Update user profile",
                    message,
                    metadata: {
                        user: {
                            email: updatedUser?.user?.email
                        }
                    }
                });
                this.setStatus(400)
                return {
                    user,
                    isSuccess,
                    message
                }
            }
            this.logger.info({
                    activity_type: "Update user profile",
                    message: updatedUser.message,
                    metadata: {
                        user: {
                            email: updatedUser?.user?.email
                        }
                    }
                });
            this.setStatus(200)
                return {
                    user,
                    isSuccess,
                    message
                }
        } catch (error: any) {
            this.logger.error({
                activity_type: "Update User profile",
                message: error.message,
                metadata: {}
            });
            throw new Error("Something went wrong");
        }
    }
}