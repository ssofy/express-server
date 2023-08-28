"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_sdk_1 = require("@ssofy/node-sdk");
const validator_1 = __importDefault(require("validator"));
exports.default = (req, res, next) => {
    const { action, method, identifier, ip } = req.body;
    const checks = [
        {
            condition: !action || !node_sdk_1.Helpers.isString(action) || !validator_1.default.isIn(action, ['authentication', 'password_reset', 'password_renew']),
            error: 'Invalid action'
        },
        {
            condition: !method || !node_sdk_1.Helpers.isString(method) || !validator_1.default.isIn(method, ['username', 'email', 'phone']),
            error: 'Invalid method'
        },
        {
            condition: !identifier || !node_sdk_1.Helpers.isString(identifier) || validator_1.default.isEmpty(identifier),
            error: 'Invalid identifier'
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
    next();
};
