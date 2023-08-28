import {Request, Response, NextFunction} from 'express';
import {Helpers} from "@ssofy/node-sdk";
import validator from 'validator';

export default (req: Request, res: Response, next?: NextFunction): void => {
    const {method, identifier, password, request_token, ip} = req.body;

    const checks = [
        {
            condition: !method || !Helpers.isString(method) || !validator.isIn(method, ['username', 'email', 'phone', 'otp']),
            error: 'Invalid method'
        },
        {
            condition: !identifier || !Helpers.isString(identifier) || validator.isEmpty(identifier),
            error: 'Invalid identifier'
        },
        {
            condition: password && !Helpers.isString(password),
            error: 'Invalid password'
        },
        {
            condition: request_token && !validator.isBoolean(request_token),
            error: 'Invalid request_token'
        },
        {
            condition: ip && !(Helpers.isString(ip) && validator.isIP(ip, 4)),
            error: 'Invalid ip'
        },
    ];

    for (let check of checks) {
        if (check.condition) {
            const message = {error: check.error};
            console.debug(req.originalUrl, message);
            res.status(400).send(message);
            return;
        }
    }

    if (next) {
        next();
    }
};
