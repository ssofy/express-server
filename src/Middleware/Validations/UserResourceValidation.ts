import {Request, Response, NextFunction} from 'express';
import validator from 'validator';
import {Helpers} from "@ssofy/node-sdk";

export default (req: Request, res: Response, next: NextFunction): void => {
    const {id, username, email, phone, scopes} = req.body;

    const checks = [
        {
            condition: id && !Helpers.isString(id),
            error: 'Invalid id'
        },
        {
            condition: username && !Helpers.isString(username),
            error: 'Invalid username'
        },
        {
            condition: email && !Helpers.isString(email),
            error: 'Invalid email'
        },
        {
            condition: phone && !(Helpers.isString(phone) && validator.isMobilePhone(phone)),
            error: 'Invalid phone'
        },
        {
            condition: scopes && !Helpers.isArray(scopes),
            error: 'Invalid scopes'
        },
        {
            condition: scopes && scopes.some((scope: any) => !Helpers.isString(scope) || validator.isEmpty(scope)),
            error: 'Invalid scope'
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

    next();
};
