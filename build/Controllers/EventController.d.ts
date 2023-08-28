import { NextFunction, Request, Response } from 'express';
import { Notifications, Repositories, Events } from "@ssofy/node-sdk";
import { Controller } from "./Controller";
export declare class EventController extends Controller {
    handle(req: Request, res: Response, next: NextFunction, userRepository: Repositories.UserRepository, otpRepository: Repositories.OTPRepository, notifiers: Notifications.Notifier[], eventManagers: Events.EventChannel[]): Promise<void>;
    tokenDeleted(req: Request, res: Response, next: NextFunction, eventManagers: Events.EventChannel[]): Promise<void>;
    safetyReset(req: Request, res: Response, next: NextFunction, eventManagers: Events.EventChannel[]): Promise<void>;
    sendOTP(req: Request, res: Response, next: NextFunction, otpRepository: Repositories.OTPRepository, notifiers: Notifications.Notifier[], eventManagers: Events.EventChannel[]): Promise<void>;
    userCreated(req: Request, res: Response, next: NextFunction, userRepository: Repositories.UserRepository, eventManagers: Events.EventChannel[]): Promise<void>;
    userUpdated(req: Request, res: Response, next: NextFunction, userRepository: Repositories.UserRepository, eventManagers: Events.EventChannel[]): Promise<void>;
    passwordReset(req: Request, res: Response, next: NextFunction, userRepository: Repositories.UserRepository, eventManagers: Events.EventChannel[]): Promise<void>;
}
