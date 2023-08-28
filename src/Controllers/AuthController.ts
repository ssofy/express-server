import {NextFunction, Request, Response} from 'express';
import {Models, Repositories, Filters, Events, Helpers} from "@ssofy/node-sdk";
import {Controller} from "./Controller";
import {UserSchema} from "../Schema/UserSchema";
import {Event} from '../Enums/Event';
import {UserAuthenticatedEventParameters} from "../EventParameters/UserAuthenticatedEventParameters";

export class AuthController extends Controller {
    public async passwordAuth(
        req: Request,
        res: Response,
        next: NextFunction,
        userRepository: Repositories.UserRepository,
        otpRepository: Repositories.OTPRepository,
        userFilter: Filters.UserFilter,
        eventChannels: Events.EventChannel[]
    ): Promise<void> {
        try {
            const {method, identifier, password, request_token, ip} = req.body;

            let user: Models.UserEntity | false = false;

            switch (method) {
                case 'otp':
                    user = await this.authenticateByOTP(identifier, password, ip, otpRepository, userRepository);
                    break;
                case 'username':
                case 'email':
                case 'phone':
                    user = await this.authenticateByPassword(method, identifier, password, ip, userRepository);
                    break;
            }

            if (!user) {
                await this.unauthorizedResponse(req, res);
                next();
                return;
            }

            let token: Models.TokenEntity | null = null;
            if (request_token) {
                const ttl = 60 * 60;
                token = await userRepository.createToken(user.id, ttl);
            }

            eventChannels.forEach((channel: Events.EventChannel) => channel.publish(Event.UserAuthenticated, <UserAuthenticatedEventParameters>{
                user: user,
                method: method,
                ip: ip,
            }));

            const authResponse: Models.AuthResponseEntity = {
                user: await userFilter.filter(user, []),
                token: token ?? undefined
            }

            await this.successResponse(req, res, authResponse);

            next();
        } catch (error) {
            next(error);
        }
    }

    public async tokenAuth(
        req: Request,
        res: Response,
        next: NextFunction,
        userRepository: Repositories.UserRepository,
        eventChannels: Events.EventChannel[]
    ): Promise<void> {
        try {
            const {token, ip} = req.body;

            const user = await userRepository.findByToken(token, ip);
            if (!user) {
                await this.unauthorizedResponse(req, res);
                next();
                return;
            }

            eventChannels.forEach((channel: Events.EventChannel) => channel.publish(Event.UserAuthenticated, <UserAuthenticatedEventParameters>{
                user: user,
                method: 'token',
                ip: ip,
            }));

            const authResponse: Models.AuthResponseEntity = {
                user: user
            };

            await this.successResponse(req, res, authResponse);

            next();
        } catch (error) {
            next(error);
        }
    }

    public async socialAuth(
        req: Request,
        res: Response,
        next: NextFunction,
        userRepository: Repositories.UserRepository,
        eventChannels: Events.EventChannel[]
    ): Promise<void> {
        try {
            const {provider, user, ip} = req.body;

            let userEntity: Models.UserEntity | null = <Models.UserEntity>Helpers.filterObject(UserSchema, user);
            userEntity.hash = '0';

            userEntity = await userRepository.findBySocialLinkOrCreate(provider, userEntity, ip);

            if (!userEntity) {
                await this.duplicateResponse(req, res);
                next();
                return;
            }

            eventChannels.forEach((channel: Events.EventChannel) => channel.publish(Event.UserAuthenticated, <UserAuthenticatedEventParameters>{
                user: user,
                method: 'social',
                ip: ip,
            }));

            const authResponse: Models.AuthResponseEntity = {
                user: user
            };

            await this.successResponse(req, res, authResponse);

            next();
        } catch (error) {
            next(error);
        }
    }

    public async otpOptions(
        req: Request,
        res: Response,
        next: NextFunction,
        userRepository: Repositories.UserRepository,
        otpRepository: Repositories.OTPRepository
    ): Promise<void> {
        try {
            const {action, method, identifier, ip} = req.body;

            const user = await userRepository.find(method, identifier, ip);

            if (!user) {
                await this.unauthorizedResponse(req, res);
                next();
                return;
            }

            const otpOptions = await otpRepository.findAllByAction(user.id, action, ip);

            await this.successResponse(req, res, otpOptions);

            next();
        } catch (err) {
            next(err);
        }
    }

    protected async authenticateByOTP(
        optionId: string,
        code: string,
        ip: string,
        otpRepository: Repositories.OTPRepository,
        userRepository: Repositories.UserRepository
    ): Promise<Models.UserEntity | false> {
        if (!(await otpRepository.verify(optionId, code, ip))) {
            return false;
        }

        const option = await otpRepository.findById(optionId, ip);
        const user = await userRepository.findById(option?.user_id ?? '', ip);
        if (!user) {
            return false;
        }

        await otpRepository.destroyVerificationCode(optionId, code, ip);

        return user;
    }

    protected async authenticateByPassword(
        method: string,
        identifier: string,
        password: string,
        ip: string,
        userRepository: Repositories.UserRepository
    ): Promise<Models.UserEntity | false> {
        const user = await userRepository.find(method, identifier, ip);
        if (!user) {
            return false;
        }

        if (password) {
            const ok = await userRepository.verifyPassword(user.id, password, ip);
            if (!ok) {
                return false;
            }
        }

        return user;
    }
}
