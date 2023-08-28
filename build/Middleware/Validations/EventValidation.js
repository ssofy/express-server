"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_sdk_1 = require("@ssofy/node-sdk");
const validator_1 = __importDefault(require("validator"));
const OTPOptionSchema_1 = require("../../Schema/OTPOptionSchema");
const UserSchema_1 = require("../../Schema/UserSchema");
exports.default = (req, res, next) => {
    const { action, payload } = req.body;
    const checks = [
        {
            condition: !action || !node_sdk_1.Helpers.isString(action) || !validator_1.default.isIn(action, ['token_deleted', 'safety_reset', 'otp_requested', 'password_reset', 'user_created', 'user_updated']),
            error: 'Invalid action'
        },
    ];
    if (action === 'token_deleted') {
        checks.push({
            condition: !node_sdk_1.Helpers.isObject(payload),
            error: 'Invalid payload'
        }, {
            condition: !payload.token || !node_sdk_1.Helpers.isString(payload.token) || validator_1.default.isEmpty(payload.token),
            error: 'Invalid payload.token'
        });
    }
    if (action === 'otp_requested') {
        checks.push({
            condition: !node_sdk_1.Helpers.isObject(payload),
            error: 'Invalid payload'
        }, {
            condition: !node_sdk_1.Helpers.isObject(payload.option) || !node_sdk_1.Helpers.matchesSchema(payload.option, OTPOptionSchema_1.OTPOptionSchema),
            error: 'Invalid payload.option'
        }, {
            condition: !validator_1.default.isIn(payload.option.action, ['authentication', 'password_reset', 'password_renew']),
            error: 'Invalid payload.option.action'
        }, {
            condition: payload.ip && !(node_sdk_1.Helpers.isString(payload.ip) && validator_1.default.isIP(payload.ip, 4)),
            error: 'Invalid payload.ip'
        });
    }
    if (action === 'password_reset') {
        checks.push({
            condition: !node_sdk_1.Helpers.isObject(payload),
            error: 'Invalid payload'
        }, {
            condition: !payload.token || !node_sdk_1.Helpers.isString(payload.token) || validator_1.default.isEmpty(payload.token),
            error: 'Invalid payload.token'
        }, {
            condition: !payload.password || !node_sdk_1.Helpers.isString(payload.password) || validator_1.default.isEmpty(payload.password),
            error: 'Invalid payload.password'
        }, {
            condition: payload.ip && !(node_sdk_1.Helpers.isString(payload.ip) && validator_1.default.isIP(payload.ip, 4)),
            error: 'Invalid payload.ip'
        });
    }
    if (action === 'user_created' || action === 'user_updated') {
        checks.push({
            condition: !(typeof payload === 'object' && payload.constructor === Object),
            error: 'Invalid payload'
        }, {
            condition: !node_sdk_1.Helpers.isObject(payload.user) || !node_sdk_1.Helpers.matchesSchema(payload.user, UserSchema_1.UserSchema),
            error: 'Invalid payload.user'
        }, {
            condition: payload.ip && !(node_sdk_1.Helpers.isString(payload.ip) && validator_1.default.isIP(payload.ip, 4)),
            error: 'Invalid payload.ip'
        });
    }
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
