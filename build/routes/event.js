"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EventController_1 = require("../Controllers/EventController");
const MiddlewareFactory_1 = require("../Middleware/MiddlewareFactory");
exports.default = (config, bindings) => {
    const router = express_1.default.Router();
    const eventController = new EventController_1.EventController(config.secret);
    router.post('/event', [MiddlewareFactory_1.MiddlewareFactory.eventRequestValidator(), (req, res, next) => eventController.handle(req, res, next, bindings.userRepository, bindings.otpRepository, bindings.notifiers, bindings.eventChannels)]);
    return router;
};
