import {Request, Response, NextFunction} from 'express';
import {Helpers} from "@ssofy/node-sdk";
import validator from 'validator';

export default (req: Request, res: Response, next: NextFunction): void => {
    const {action, method, identifier, ip} = req.body;

    const checks = [
        {
            condition: !action || !Helpers.isString(action) || !validator.isIn(action, ['authentication', 'password_reset', 'password_renew']),
            error: 'Invalid action'
        },
        {
            condition: !method || !Helpers.isString(method) || !validator.isIn(method, ['username', 'email', 'phone']),
            error: 'Invalid method'
        },
        {
            condition: !identifier || !Helpers.isString(identifier) || validator.isEmpty(identifier),
            error: 'Invalid identifier'
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

    next();
};
