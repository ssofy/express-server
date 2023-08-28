import {Request, Response, NextFunction} from 'express';
import {Helpers} from "@ssofy/node-sdk";
import validator from 'validator';

export default (req: Request, res: Response, next: NextFunction): void => {
    const {id} = req.body;

    const checks = [
        {
            condition: !id || !Helpers.isString(id) || validator.isEmpty(id),
            error: 'Invalid id'
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
