import {Request, Response, NextFunction} from 'express';
import {Helpers} from "@ssofy/node-sdk";
import validator from 'validator';
import {UserSchema} from "../../Schema/UserSchema";

export default (req: Request, res: Response, next?: NextFunction): void => {
    const {provider, user, ip} = req.body;

    const checks = [
        {
            condition: !provider || !Helpers.isString(provider),
            error: 'Invalid provider'
        },
        {
            condition: !user || !Helpers.isObject(user) || !Helpers.matchesSchema(user, UserSchema),
            error: 'Invalid user'
        },
        {
            condition: !user.email || !validator.isEmail(user.email),
            error: 'Invalid user.email'
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
