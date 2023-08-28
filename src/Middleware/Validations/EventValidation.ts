import {Request, Response, NextFunction} from 'express';
import {Helpers} from "@ssofy/node-sdk";
import validator from 'validator';
import {OTPOptionSchema} from "../../Schema/OTPOptionSchema";
import {UserSchema} from "../../Schema/UserSchema";

export default (req: Request, res: Response, next: NextFunction): void => {
    const {action, payload} = req.body;

    const checks = [
        {
            condition: !action || !Helpers.isString(action) || !validator.isIn(action, ['token_deleted', 'safety_reset', 'otp_requested', 'password_reset', 'user_created', 'user_updated']),
            error: 'Invalid action'
        },
    ];

    if (action === 'token_deleted') {
        checks.push(
            {
                condition: !Helpers.isObject(payload),
                error: 'Invalid payload'
            },
            {
                condition: !payload.token || !Helpers.isString(payload.token) || validator.isEmpty(payload.token),
                error: 'Invalid payload.token'
            },
        );
    }

    if (action === 'otp_requested') {
        checks.push(
            {
                condition: !Helpers.isObject(payload),
                error: 'Invalid payload'
            },
            {
                condition: !Helpers.isObject(payload.option) || !Helpers.matchesSchema(payload.option, OTPOptionSchema),
                error: 'Invalid payload.option'
            },
            {
                condition: !validator.isIn(payload.option.action, ['authentication', 'password_reset', 'password_renew']),
                error: 'Invalid payload.option.action'
            },
            {
                condition: payload.ip && !(Helpers.isString(payload.ip) && validator.isIP(payload.ip, 4)),
                error: 'Invalid payload.ip'
            },
        );
    }

    if (action === 'password_reset') {
        checks.push(
            {
                condition: !Helpers.isObject(payload),
                error: 'Invalid payload'
            },
            {
                condition: !payload.token || !Helpers.isString(payload.token) || validator.isEmpty(payload.token),
                error: 'Invalid payload.token'
            },
            {
                condition: !payload.password || !Helpers.isString(payload.password) || validator.isEmpty(payload.password),
                error: 'Invalid payload.password'
            },
            {
                condition: payload.ip && !(Helpers.isString(payload.ip) && validator.isIP(payload.ip, 4)),
                error: 'Invalid payload.ip'
            },
        );
    }

    if (action === 'user_created' || action === 'user_updated') {
        checks.push(
            {
                condition: !(typeof payload === 'object' && payload.constructor === Object),
                error: 'Invalid payload'
            },
            {
                condition: !Helpers.isObject(payload.user) || !Helpers.matchesSchema(payload.user, UserSchema),
                error: 'Invalid payload.user'
            },
            {
                condition: payload.ip && !(Helpers.isString(payload.ip) && validator.isIP(payload.ip, 4)),
                error: 'Invalid payload.ip'
            },
        );
    }

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
