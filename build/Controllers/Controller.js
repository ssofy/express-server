"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const node_sdk_1 = require("@ssofy/node-sdk");
class Controller {
    constructor(apiSecret) {
        this.apiSecret = apiSecret;
    }
    successResponse(req, res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            res.set('Signature', yield node_sdk_1.Helpers.generateSignature(this.apiSecret, req.originalUrl, data));
            res.json(data);
        });
    }
    notFoundResponse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(204);
            res.send('Not Found');
        });
    }
    unauthorizedResponse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(401);
            res.send('Unauthorized');
        });
    }
    duplicateResponse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(409);
            res.send('Duplicate');
        });
    }
    badRequestResponse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(400);
            res.send('Bad Request');
        });
    }
}
exports.Controller = Controller;
