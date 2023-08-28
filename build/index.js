"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareFactory = exports.Event = void 0;
var Event_1 = require("./Enums/Event");
Object.defineProperty(exports, "Event", { enumerable: true, get: function () { return Event_1.Event; } });
var MiddlewareFactory_1 = require("./Middleware/MiddlewareFactory");
Object.defineProperty(exports, "MiddlewareFactory", { enumerable: true, get: function () { return MiddlewareFactory_1.MiddlewareFactory; } });
__exportStar(require("./Controllers"), exports);
__exportStar(require("./EventParameters"), exports);
__exportStar(require("@ssofy/node-sdk"), exports);
const routes_1 = __importDefault(require("./routes"));
exports.default = routes_1.default;
