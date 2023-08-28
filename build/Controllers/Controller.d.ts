import { Request, Response } from "express";
export declare class Controller {
    private readonly apiSecret;
    constructor(apiSecret: string);
    protected successResponse(req: Request, res: Response, data: any): Promise<void>;
    protected notFoundResponse(req: Request, res: Response): Promise<void>;
    protected unauthorizedResponse(req: Request, res: Response): Promise<void>;
    protected duplicateResponse(req: Request, res: Response): Promise<void>;
    protected badRequestResponse(req: Request, res: Response): Promise<void>;
}
