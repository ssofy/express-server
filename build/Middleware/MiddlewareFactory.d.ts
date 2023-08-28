import { NextFunction, Request, Response } from "express";
import { ServerConfig } from "../ServerConfig";
export declare class MiddlewareFactory {
    static requestSignatureVerifier(apiSecret: string): {
        (req: Request, res: Response, next: NextFunction): Promise<void>;
    };
    static clientResourceRequestValidator(): {
        (req: Request, res: Response, next: NextFunction): void;
    };
    static scopeResourceRequestValidator(): {
        (req: Request, res: Response, next: NextFunction): void;
    };
    static userResourceRequestValidator(): {
        (req: Request, res: Response, next: NextFunction): void;
    };
    static otpOptionsRequestValidator(): {
        (req: Request, res: Response, next: NextFunction): void;
    };
    static passwordAuthRequestValidator(config: ServerConfig): {
        (req: Request, res: Response, next: NextFunction): void;
    };
    static tokenAuthRequestValidator(config: ServerConfig): {
        (req: Request, res: Response, next: NextFunction): void;
    };
    static socialAuthRequestValidator(config: ServerConfig): {
        (req: Request, res: Response, next: NextFunction): void;
    };
    static eventRequestValidator(): {
        (req: Request, res: Response, next: NextFunction): void;
    };
}
