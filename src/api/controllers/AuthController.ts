import { Inject, Service } from 'typedi';
import AuthService from "../services/AuthService";
import { Request, Response } from "express";
import { Logger } from '../../lib/logger';
import { Tags, Route, Controller, Post, Body, Example, Put } from 'tsoa';
import { EmailVerificationDTO, LoginUserDTO, LoginUserResponseDTO, RegisterUserDTO, RegisterUserResponseDTO } from '../dtos/AuthDTO';

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
    @Example<RegisterUserResponseDTO>({
        itExists: true,
        message: "User registration was successful",
    })
    public async register(@Body() req: RegisterUserDTO): Promise<RegisterUserResponseDTO> {
    try {
            const newUser = await this.authService.registerUser(req);
            if (newUser.itExists) {
                this.logger.info({
                    activity_type: "User registration",
                    message: newUser?.message,
                    metadata: {
                        user: {
                            email: newUser?.user?.email
                        }
                    }
                });
                this.setStatus(400)
                return {
                     itExists: newUser.itExists,
                     user: newUser.user,
                     message: newUser?.message }
            }

            this.logger.info({
                activity_type: "User registration",
                message: newUser?.message,
                metadata: {
                    user: {
                        email: newUser?.user?.email
                    }
                }
            });
            this.setStatus(201)
            return {
                itExists: newUser.itExists,
                user: newUser.user,
                message: newUser?.message
            }
        } catch (error: any) {
            this.logger.error({
                activity_type: "User registration",
                message: error.message,
                metadata: {
                    user: {
                        email: req?.email
                    }
                }
            });
            throw new Error("Something went wrong");
        }
    }

    @Post("/login")
    @Example<LoginUserResponseDTO>({
        isSuccess: true,
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
        message: "User registration was successful",
    })
    public async login(@Body() req: LoginUserDTO): Promise<LoginUserResponseDTO> {
        const{ email } = req;
        try {
            const authUser = await this.authService.loginUser(req);
            const { message, token, user } = authUser
            this.logger.info({
                activity_type: "User login",
                message,
                metadata: {
                    user: {
                        email
                    }
                }
            });
            if (!authUser?.isSuccess) {
                this.setStatus(400)
                return { 
                    isSuccess: false,
                    token: null,
                    user: null,
                    message
                }
            }
            this.setStatus(200)
                return {
                    isSuccess: true,
                    token: token,
                    user: user,
                    message
                }
        } catch (error: any) {
            this.logger.error({
                activity_type: "User registration",
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


    @Put("/email/verification")
    @Example<LoginUserResponseDTO>({
        isSuccess: true,
    })

    public async verifyEmail(@Body() req: EmailVerificationDTO): Promise<LoginUserResponseDTO>{
        const { email } = req;

        try {
            const user = await this.authService.validateEmail(req);
            let message = null;
            if (user.isSuccess) {
                message = "User email verification was successful";
                this.logger.info({
                    activity_type: "User login",
                    message,
                    metadata: {
                        user: {
                            email
                        }
                    }
                });

                this.setStatus(200)
                return {
                    isSuccess: user.isSuccess,
                    message
                };
            }
            message = "User email verification failed";
            this.setStatus(400)
            return {
                isSuccess: user.isSuccess,
                message
            };
        } catch (error: any) {
            this.logger.error({
                activity_type: "User registration",
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
}