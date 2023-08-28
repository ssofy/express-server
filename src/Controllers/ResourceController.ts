import {NextFunction, Request, Response} from 'express';
import {Repositories, Filters} from "@ssofy/node-sdk";
import {Controller} from "./Controller";

export class ResourceController extends Controller {
    public async scopes(
        req: Request,
        res: Response,
        next: NextFunction,
        scopeRepository: Repositories.ScopeRepository
    ): Promise<void> {
        try {
            const {lang} = req.body;

            await this.successResponse(req, res, await scopeRepository.all(lang));

            next();
        } catch (error) {
            next(error);
        }
    }

    public async client(
        req: Request,
        res: Response,
        next: NextFunction,
        clientRepository: Repositories.ClientRepository
    ): Promise<void> {
        try {
            const {id} = req.body;

            const client = await clientRepository.findById(id);

            if (!client) {
                await this.notFoundResponse(req, res);
                next();
                return;
            }

            await this.successResponse(req, res, client);

            next();
        } catch (error) {
            next(error);
        }
    }

    public async user(
        req: Request,
        res: Response,
        next: NextFunction,
        userRepository: Repositories.UserRepository,
        userFilter: Filters.UserFilter
    ): Promise<void> {
        try {
            const {scopes} = req.body;

            const fields = ['id', 'username', 'email', 'phone'];

            for (const field of fields) {
                if (req.body[field]) {
                    const user = await userRepository.find(field, req.body[field]);

                    if (!user) {
                        await this.notFoundResponse(req, res);
                        next();
                        return;
                    }

                    await this.successResponse(req, res, await userFilter.filter(user, scopes));

                    next();
                    return;
                }
            }

            await this.notFoundResponse(req, res);

            next();
        } catch (error) {
            next(error);
        }
    }
}
