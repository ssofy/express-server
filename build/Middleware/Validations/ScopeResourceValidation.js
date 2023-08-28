"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_sdk_1 = require("@ssofy/node-sdk");
const validator_1 = __importDefault(require("validator"));
exports.default = (req, res, next) => {
    const { lang } = req.body;
    const checks = [
        {
            condition: !lang || !node_sdk_1.Helpers.isString(lang) || !validator_1.default.isLength(lang, { min: 2, max: 5 }),
            error: 'Invalid lang'
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
