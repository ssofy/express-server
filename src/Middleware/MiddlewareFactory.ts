import {NextFunction, Request, Response} from "express";
import {SignatureGenerator, SignatureVerifier} from "@ssofy/node-sdk";
import ClientResourceValidation from "./Validations/ClientResourceValidation";
import ScopeResourceValidation from "./Validations/ScopeResourceValidation";
import UserResourceValidation from "./Validations/UserResourceValidation";
import OTPOptionsValidation from "./Validations/OTPOptionsValidation";
import PasswordAuthValidation from "./Validations/PasswordAuthValidation";
import TokenAuthValidation from "./Validations/TokenAuthValidation";
import SocialAuthValidation from "./Validations/SocialAuthValidation";
import EventValidation from "./Validations/EventValidation";
import {ServerConfig} from "../ServerConfig";

export class MiddlewareFactory {
    static requestSignatureVerifier(apiSecret: string): { (req: Request, res: Response, next: NextFunction): Promise<void> } {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const signature = req.header('Signature');

            if (!signature) {
                console.debug(req.originalUrl, {
                    error: 'Signature Verification Failed',
                    signature: signature,
                });
                res.sendStatus(400);
                return;
            }

            const path = req.originalUrl;
            const params = req.body;
            const secret = apiSecret;

            const url = path.startsWith('/') ? 'http://localhost' + path : path;

            const signatureGenerator = new SignatureGenerator();
            const validator = new SignatureVerifier(signatureGenerator);

            if (!(await validator.verifyBase64Signature(url, params, secret, signature))) {
                console.debug(req.originalUrl, {
                    error: 'Signature Verification Failed',
                    signature: signature,
                });
                res.sendStatus(400);
                return;
            }

            next();
        }
    }

    static clientResourceRequestValidator(): { (req: Request, res: Response, next: NextFunction): void } {
        return ClientResourceValidation;
    }

    static scopeResourceRequestValidator(): { (req: Request, res: Response, next: NextFunction): void } {
        return ScopeResourceValidation;
    }

    static userResourceRequestValidator(): { (req: Request, res: Response, next: NextFunction): void } {
        return UserResourceValidation;
    }

    static otpOptionsRequestValidator(): { (req: Request, res: Response, next: NextFunction): void } {
        return OTPOptionsValidation;
    }

    static passwordAuthRequestValidator(config: ServerConfig): { (req: Request, res: Response, next: NextFunction): void } {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            await PasswordAuthValidation(req, res);

            if (res.statusCode === 400) {
                return;
            }

            const {method, password} = req.body;

            const methods: any = config.authentication?.methods ?? {};
            if (!(methods[method] ?? true)) {
                const message = {error: 'Unauthorized'};
                console.debug(req.originalUrl, message);
                res.status(401).send(message);
                return;
            }

            if ((!password || password === '') && !(config.authentication?.passwordless ?? true)) {
                const message = {error: 'Unauthorized'};
                console.debug(req.originalUrl, message);
                res.status(401).send(message);
                return;
            }

            next();
        };
    }

    static tokenAuthRequestValidator(config: ServerConfig): { (req: Request, res: Response, next: NextFunction): void } {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            await TokenAuthValidation(req, res);

            if (res.statusCode === 400) {
                return;
            }

            if (!(config.authentication?.methods?.token ?? true)) {
                const message = {error: 'Unauthorized'};
                console.debug(req.originalUrl, message);
                res.status(401).send(message);
                return;
            }

            next();
        };
    }

    static socialAuthRequestValidator(config: ServerConfig): { (req: Request, res: Response, next: NextFunction): void } {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            await SocialAuthValidation(req, res);

            if (res.statusCode === 400) {
                return;
            }

            if (!(config.authentication?.methods?.social ?? true)) {
                const message = {error: 'Unauthorized'};
                console.debug(req.originalUrl, message);
                res.status(401).send(message);
                return;
            }

            next();
        };
    }

    static eventRequestValidator(): { (req: Request, res: Response, next: NextFunction): void } {
        return EventValidation;
    }
}
