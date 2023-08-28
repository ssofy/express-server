"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
const node_sdk_1 = require("@ssofy/node-sdk");
exports.default = (req, res, next) => {
    const { token, ip } = req.body;
    const checks = [
        {
            condition: !token || !node_sdk_1.Helpers.isString(token),
            error: 'Invalid token'
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
