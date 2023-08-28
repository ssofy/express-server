import {Request, Response, NextFunction} from 'express';
import {Helpers} from "@ssofy/node-sdk";
import validator from 'validator';

export default (req: Request, res: Response, next: NextFunction): void => {
    const {lang} = req.body;

    const checks = [
        {
            condition: !lang || !Helpers.isString(lang) || !validator.isLength(lang, {min: 2, max: 5}),
            error: 'Invalid lang'
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
