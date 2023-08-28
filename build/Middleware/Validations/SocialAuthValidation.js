"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_sdk_1 = require("@ssofy/node-sdk");
const validator_1 = __importDefault(require("validator"));
const UserSchema_1 = require("../../Schema/UserSchema");
exports.default = (req, res, next) => {
    const { provider, user, ip } = req.body;
    const checks = [
        {
            condition: !provider || !node_sdk_1.Helpers.isString(provider),
            error: 'Invalid provider'
        },
        {
            condition: !user || !node_sdk_1.Helpers.isObject(user) || !node_sdk_1.Helpers.matchesSchema(user, UserSchema_1.UserSchema),
            error: 'Invalid user'
        },
        {
            condition: !user.email || !validator_1.default.isEmail(user.email),
            error: 'Invalid user.email'
        },
        {
            condition: ip && !(node_sdk_1.Helpers.isString(ip) && validator_1.default.isIP(ip, 4)),
            error: 'Invalid ip'
        },
    ];
    for (let check of checks) {
        if (check.condition) {
            const message = { error: check.error };
            console.debug(req.originalUrl, message);
            res.status(400).send(message);
            return;
        }
    }
    if (next) {
        next();
    }
};
