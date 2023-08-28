import express, {NextFunction, Request, Response} from 'express';
import {ResourceController} from "../Controllers/ResourceController";
import {MiddlewareFactory} from "../Middleware/MiddlewareFactory";
import {Bindings} from "../Bindings";
import {ServerConfig} from "../ServerConfig";

export default (config: ServerConfig, bindings: Bindings) => {
    const router = express.Router();

    const resourceController = new ResourceController(config.secret);

    router.post('/scopes', [MiddlewareFactory.scopeResourceRequestValidator(), (req: Request, res: Response, next: NextFunction) => resourceController.scopes(req, res, next, bindings.scopeRepository)]);
    router.post('/client', [MiddlewareFactory.clientResourceRequestValidator(), (req: Request, res: Response, next: NextFunction) => resourceController.client(req, res, next, bindings.clientRepository)]);
    router.post('/user', [MiddlewareFactory.userResourceRequestValidator(), (req: Request, res: Response, next: NextFunction) => resourceController.user(req, res, next, bindings.userRepository, bindings.userFilter)]);

    return router;
};
