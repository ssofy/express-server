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
exports.ResourceController = void 0;
const Controller_1 = require("./Controller");
class ResourceController extends Controller_1.Controller {
    scopes(req, res, next, scopeRepository) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { lang } = req.body;
                yield this.successResponse(req, res, yield scopeRepository.all(lang));
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    client(req, res, next, clientRepository) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const client = yield clientRepository.findById(id);
                if (!client) {
                    yield this.notFoundResponse(req, res);
                    next();
                    return;
                }
                yield this.successResponse(req, res, client);
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    user(req, res, next, userRepository, userFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { scopes } = req.body;
                const fields = ['id', 'username', 'email', 'phone'];
                for (const field of fields) {
                    if (req.body[field]) {
                        const user = yield userRepository.find(field, req.body[field]);
                        if (!user) {
                            yield this.notFoundResponse(req, res);
                            next();
                            return;
                        }
                        yield this.successResponse(req, res, yield userFilter.filter(user, scopes));
                        next();
                        return;
                    }
                }
                yield this.notFoundResponse(req, res);
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ResourceController = ResourceController;
