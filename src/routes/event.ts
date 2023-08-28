import express, {NextFunction, Request, Response} from 'express';
import {EventController} from "../Controllers/EventController";
import {MiddlewareFactory} from "../Middleware/MiddlewareFactory";
import {ServerConfig} from "../ServerConfig";
import {Bindings} from "../Bindings";

export default (config: ServerConfig, bindings: Bindings) => {
    const router = express.Router();

    const eventController = new EventController(config.secret);

    router.post('/event', [MiddlewareFactory.eventRequestValidator(), (req: Request, res: Response, next: NextFunction) => eventController.handle(req, res, next, bindings.userRepository, bindings.otpRepository, bindings.notifiers, bindings.eventChannels)]);

    return router;
};
