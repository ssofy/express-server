"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../Controllers/AuthController");
const MiddlewareFactory_1 = require("../Middleware/MiddlewareFactory");
exports.default = (config, bindings) => {
    const router = express_1.default.Router();
    const authController = new AuthController_1.AuthController(config.secret);
    router.post('/otp-options', [MiddlewareFactory_1.MiddlewareFactory.otpOptionsRequestValidator(), (req, res, next) => authController.otpOptions(req, res, next, bindings.userRepository, bindings.otpRepository)]);
    router.post('/auth/password', [MiddlewareFactory_1.MiddlewareFactory.passwordAuthRequestValidator(config), (req, res, next) => authController.passwordAuth(req, res, next, bindings.userRepository, bindings.otpRepository, bindings.userFilter, bindings.eventChannels)]);
    router.post('/auth/token', [MiddlewareFactory_1.MiddlewareFactory.tokenAuthRequestValidator(config), (req, res, next) => authController.tokenAuth(req, res, next, bindings.userRepository, bindings.eventChannels)]);
    router.post('/auth/social', [MiddlewareFactory_1.MiddlewareFactory.socialAuthRequestValidator(config), (req, res, next) => authController.socialAuth(req, res, next, bindings.userRepository, bindings.eventChannels)]);
    return router;
};
