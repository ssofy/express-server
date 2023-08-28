import { NextFunction, Request, Response } from 'express';
import { Repositories, Filters } from "@ssofy/node-sdk";
import { Controller } from "./Controller";
export declare class ResourceController extends Controller {
    scopes(req: Request, res: Response, next: NextFunction, scopeRepository: Repositories.ScopeRepository): Promise<void>;
    client(req: Request, res: Response, next: NextFunction, clientRepository: Repositories.ClientRepository): Promise<void>;
    user(req: Request, res: Response, next: NextFunction, userRepository: Repositories.UserRepository, userFilter: Filters.UserFilter): Promise<void>;
}
