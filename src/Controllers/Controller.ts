import {Request, Response} from "express";
import {Helpers} from "@ssofy/node-sdk";

export class Controller {
    private readonly apiSecret: string;

    constructor(apiSecret: string) {
        this.apiSecret = apiSecret;
    }

    protected async successResponse(req: Request, res: Response, data: any): Promise<void> {
        res.set('Signature', await Helpers.generateSignature(this.apiSecret, req.originalUrl, data));
        res.json(data);
    }

    protected async notFoundResponse(req: Request, res: Response): Promise<void> {
        res.status(204);
        res.send('Not Found');
    }

    protected async unauthorizedResponse(req: Request, res: Response): Promise<void> {
        res.status(401);
        res.send('Unauthorized');
    }

    protected async duplicateResponse(req: Request, res: Response): Promise<void> {
        res.status(409);
        res.send('Duplicate');
    }

    protected async badRequestResponse(req: Request, res: Response): Promise<void> {
        res.status(400);
        res.send('Bad Request');
    }
}
