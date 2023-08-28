import express, {NextFunction, Request, Response} from 'express';
import {AuthController} from "../Controllers/AuthController";
import {MiddlewareFactory} from "../Middleware/MiddlewareFactory";
import {ServerConfig} from "../ServerConfig";
import {Bindings} from "../Bindings";

export default (config: ServerConfig, bindings: Bindings) => {
    const router = express.Router();

    const authController = new AuthController(config.secret);

    router.post('/otp-options', [MiddlewareFactory.otpOptionsRequestValidator(), (req: Request, res: Response, next: NextFunction) => authController.otpOptions(req, res, next, bindings.userRepository, bindings.otpRepository)]);

    router.post('/auth/password', [MiddlewareFactory.passwordAuthRequestValidator(config), (req: Request, res: Response, next: NextFunction) => authController.passwordAuth(req, res, next, bindings.userRepository, bindings.otpRepository, bindings.userFilter, bindings.eventChannels)]);
    router.post('/auth/token', [MiddlewareFactory.tokenAuthRequestValidator(config), (req: Request, res: Response, next: NextFunction) => authController.tokenAuth(req, res, next, bindings.userRepository, bindings.eventChannels)]);
    router.post('/auth/social', [MiddlewareFactory.socialAuthRequestValidator(config), (req: Request, res: Response, next: NextFunction) => authController.socialAuth(req, res, next, bindings.userRepository, bindings.eventChannels)]);

    return router;
};
