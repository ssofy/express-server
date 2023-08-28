import {NextFunction, Request, Response} from 'express';
import {Models, Notifications, Repositories, Events, Helpers} from "@ssofy/node-sdk";
import {Controller} from "./Controller";
import {UserSchema} from "../Schema/UserSchema";
import {OTPOptionSchema} from "../Schema/OTPOptionSchema";
import {Event} from '../Enums/Event';
import {TokenDeletedEventParameters} from "../EventParameters/TokenDeletedEventParameters";
import {UserCreatedEventParameters} from "../EventParameters/UserCreatedEventParameters";
import {UserUpdatedEventParameters} from "../EventParameters/UserUpdatedEventParameters";
import {OTPSentEventParameters} from "../EventParameters/OTPSentEventParameters";

export class EventController extends Controller {
    public async handle(
        req: Request,
        res: Response,
        next: NextFunction,
        userRepository: Repositories.UserRepository,
        otpRepository: Repositories.OTPRepository,
        notifiers: Notifications.Notifier[],
        eventManagers: Events.EventChannel[]
    ): Promise<void> {
        try {
            const {action} = req.body;

            switch (action) {
                case 'token_deleted':
                    return this.tokenDeleted(req, res, next, eventManagers);

                case 'safety_reset':
                    return this.safetyReset(req, res, next, eventManagers);

                case 'otp_requested':
                    return this.sendOTP(req, res, next, otpRepository, notifiers, eventManagers);

                case 'password_reset':
                    return this.passwordReset(req, res, next, userRepository, eventManagers);

                case 'user_created':
                    return this.userCreated(req, res, next, userRepository, eventManagers);

                case 'user_updated':
                    return this.userUpdated(req, res, next, userRepository, eventManagers);
            }

            await this.badRequestResponse(req, res);

            next();
        } catch (error) {
            next(error);
        }
    }

    public async tokenDeleted(req: Request, res: Response, next: NextFunction, eventManagers: Events.EventChannel[]): Promise<void> {
        try {
            const {payload} = req.body;

            eventManagers.forEach((eventManager: Events.EventChannel) => eventManager.publish(Event.TokenDeleted, <TokenDeletedEventParameters>{
                token: payload.token,
            }));

            await this.successResponse(req, res, {
                success: true
            });

            next();
        } catch (error) {
            next(error);
        }
    }

    public async safetyReset(req: Request, res: Response, next: NextFunction, eventManagers: Events.EventChannel[]): Promise<void> {
        try {
            eventManagers.forEach((eventManager: Events.EventChannel) => eventManager.publish(Event.SafetyReset));

            await this.successResponse(req, res, {
                success: true
            });

            next();
        } catch (error) {
            next(error);
        }
    }

    public async sendOTP(
        req: Request,
        res: Response,
        next: NextFunction,
        otpRepository: Repositories.OTPRepository,
        notifiers: Notifications.Notifier[],
        eventManagers: Events.EventChannel[]
    ): Promise<void> {
        try {
            const {payload, ip} = req.body;

            let option: Models.OTPOptionEntity = <Models.OTPOptionEntity>Helpers.filterObject(OTPOptionSchema, payload.option);

            const code = await otpRepository.newVerificationCode(option, ip);

            notifiers.forEach(notifier => notifier.notify(option.to, 'otp', {
                option: option,
                code: code,
            }));

            eventManagers.forEach((eventManager: Events.EventChannel) => eventManager.publish(Event.OTPSent, <OTPSentEventParameters>{
                option: option,
                code: code,
            }));

            await this.successResponse(req, res, {
                success: true
            });

            next();
        } catch (error) {
            next(error);
        }
    }

    public async userCreated(
        req: Request,
        res: Response,
        next: NextFunction,
        userRepository: Repositories.UserRepository,
        eventManagers: Events.EventChannel[]
    ): Promise<void> {
        try {
            const {payload, ip} = req.body;

            let user: Models.UserEntity = <Models.UserEntity>Helpers.filterObject(UserSchema, payload.user);
            user.id = '';
            user.hash = '';

            const createdUser = await userRepository.create(user, payload.user.password, ip);

            eventManagers.forEach((eventManager: Events.EventChannel) => eventManager.publish(Event.UserCreated, <UserCreatedEventParameters>{
                user: createdUser,
                ip: ip,
            }));

            await this.successResponse(req, res, {
                success: true
            });

            next();
        } catch (error) {
            next(error);
        }
    }

    public async userUpdated(
        req: Request,
        res: Response,
        next: NextFunction,
        userRepository: Repositories.UserRepository,
        eventManagers: Events.EventChannel[]
    ): Promise<void> {
        try {
            const {payload, ip} = req.body;

            let user: Models.UserEntity = <Models.UserEntity>Helpers.filterObject(UserSchema, payload.user);

            const updatedUser = await userRepository.update(user, ip);

            eventManagers.forEach((eventManager: Events.EventChannel) => eventManager.publish(Event.UserUpdated, <UserUpdatedEventParameters>{
                user: updatedUser,
                ip: ip,
            }));

            await this.successResponse(req, res, {
                success: true
            });

            next();
        } catch (error) {
            next(error);
        }
    }

    public async passwordReset(
        req: Request,
        res: Response,
        next: NextFunction,
        userRepository: Repositories.UserRepository,
        eventManagers: Events.EventChannel[]
    ): Promise<void> {
        try {
            const {payload, ip} = req.body;

            const user = await userRepository.findByToken(payload.token, ip);
            if (!user) {
                await this.unauthorizedResponse(req, res);
                next();
                return;
            }

            await userRepository.updatePassword(user.id, payload.password, ip);
            await userRepository.deleteToken(payload.token);

            eventManagers.forEach((eventManager: Events.EventChannel) => eventManager.publish(Event.UserUpdated, <UserUpdatedEventParameters>{
                user: user,
                ip: ip,
            }));

            await this.successResponse(req, res, {
                success: true
            });

            next();
        } catch (error) {
            next(error);
        }
    }
}

