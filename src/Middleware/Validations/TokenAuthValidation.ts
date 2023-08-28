import {Request, Response, NextFunction} from 'express';
import validator from 'validator';
import {Helpers} from "@ssofy/node-sdk";

export default (req: Request, res: Response, next?: NextFunction): void => {
    const {token, ip} = req.body;

    const checks = [
        {
            condition: !token || !Helpers.isString(token),
            error: 'Invalid token'
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
