import { NextFunction, Request, Response } from 'express';
import { Models, Repositories, Filters, Events } from "@ssofy/node-sdk";
import { Controller } from "./Controller";
export declare class AuthController extends Controller {
    passwordAuth(req: Request, res: Response, next: NextFunction, userRepository: Repositories.UserRepository, otpRepository: Repositories.OTPRepository, userFilter: Filters.UserFilter, eventChannels: Events.EventChannel[]): Promise<void>;
    tokenAuth(req: Request, res: Response, next: NextFunction, userRepository: Repositories.UserRepository, eventChannels: Events.EventChannel[]): Promise<void>;
    socialAuth(req: Request, res: Response, next: NextFunction, userRepository: Repositories.UserRepository, eventChannels: Events.EventChannel[]): Promise<void>;
    otpOptions(req: Request, res: Response, next: NextFunction, userRepository: Repositories.UserRepository, otpRepository: Repositories.OTPRepository): Promise<void>;
    protected authenticateByOTP(optionId: string, code: string, ip: string, otpRepository: Repositories.OTPRepository, userRepository: Repositories.UserRepository): Promise<Models.UserEntity | false>;
    protected authenticateByPassword(method: string, identifier: string, password: string, ip: string, userRepository: Repositories.UserRepository): Promise<Models.UserEntity | false>;
}
