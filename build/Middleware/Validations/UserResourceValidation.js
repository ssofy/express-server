"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
const node_sdk_1 = require("@ssofy/node-sdk");
exports.default = (req, res, next) => {
    const { id, username, email, phone, scopes } = req.body;
    const checks = [
        {
            condition: id && !node_sdk_1.Helpers.isString(id),
            error: 'Invalid id'
        },
        {
            condition: username && !node_sdk_1.Helpers.isString(username),
            error: 'Invalid username'
        },
        {
            condition: email && !node_sdk_1.Helpers.isString(email),
            error: 'Invalid email'
        },
        {
            condition: phone && !(node_sdk_1.Helpers.isString(phone) && validator_1.default.isMobilePhone(phone)),
            error: 'Invalid phone'
        },
        {
            condition: scopes && !node_sdk_1.Helpers.isArray(scopes),
            error: 'Invalid scopes'
        },
        {
            condition: scopes && scopes.some((scope) => !node_sdk_1.Helpers.isString(scope) || validator_1.default.isEmpty(scope)),
            error: 'Invalid scope'
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
    next();
};
