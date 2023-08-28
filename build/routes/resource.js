"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ResourceController_1 = require("../Controllers/ResourceController");
const MiddlewareFactory_1 = require("../Middleware/MiddlewareFactory");
exports.default = (config, bindings) => {
    const router = express_1.default.Router();
    const resourceController = new ResourceController_1.ResourceController(config.secret);
    router.post('/scopes', [MiddlewareFactory_1.MiddlewareFactory.scopeResourceRequestValidator(), (req, res, next) => resourceController.scopes(req, res, next, bindings.scopeRepository)]);
    router.post('/client', [MiddlewareFactory_1.MiddlewareFactory.clientResourceRequestValidator(), (req, res, next) => resourceController.client(req, res, next, bindings.clientRepository)]);
    router.post('/user', [MiddlewareFactory_1.MiddlewareFactory.userResourceRequestValidator(), (req, res, next) => resourceController.user(req, res, next, bindings.userRepository, bindings.userFilter)]);
    return router;
};
