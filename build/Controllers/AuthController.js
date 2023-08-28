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
exports.AuthController = void 0;
const node_sdk_1 = require("@ssofy/node-sdk");
const Controller_1 = require("./Controller");
const UserSchema_1 = require("../Schema/UserSchema");
const Event_1 = require("../Enums/Event");
class AuthController extends Controller_1.Controller {
    passwordAuth(req, res, next, userRepository, otpRepository, userFilter, eventChannels) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { method, identifier, password, request_token, ip } = req.body;
                let user = false;
                switch (method) {
                    case 'otp':
                        user = yield this.authenticateByOTP(identifier, password, ip, otpRepository, userRepository);
                        break;
                    case 'username':
                    case 'email':
                    case 'phone':
                        user = yield this.authenticateByPassword(method, identifier, password, ip, userRepository);
                        break;
                }
                if (!user) {
                    yield this.unauthorizedResponse(req, res);
                    next();
                    return;
                }
                let token = null;
                if (request_token) {
                    const ttl = 60 * 60;
                    token = yield userRepository.createToken(user.id, ttl);
                }
                eventChannels.forEach((channel) => channel.publish(Event_1.Event.UserAuthenticated, {
                    user: user,
                    method: method,
                    ip: ip,
                }));
                const authResponse = {
                    user: yield userFilter.filter(user, []),
                    token: token !== null && token !== void 0 ? token : undefined
                };
                yield this.successResponse(req, res, authResponse);
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    tokenAuth(req, res, next, userRepository, eventChannels) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, ip } = req.body;
                const user = yield userRepository.findByToken(token, ip);
                if (!user) {
                    yield this.unauthorizedResponse(req, res);
                    next();
                    return;
                }
                eventChannels.forEach((channel) => channel.publish(Event_1.Event.UserAuthenticated, {
                    user: user,
                    method: 'token',
                    ip: ip,
                }));
                const authResponse = {
                    user: user
                };
                yield this.successResponse(req, res, authResponse);
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    socialAuth(req, res, next, userRepository, eventChannels) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { provider, user, ip } = req.body;
                let userEntity = node_sdk_1.Helpers.filterObject(UserSchema_1.UserSchema, user);
                userEntity.hash = '0';
                userEntity = yield userRepository.findBySocialLinkOrCreate(provider, userEntity, ip);
                if (!userEntity) {
                    yield this.duplicateResponse(req, res);
                    next();
                    return;
                }
                eventChannels.forEach((channel) => channel.publish(Event_1.Event.UserAuthenticated, {
                    user: user,
                    method: 'social',
                    ip: ip,
                }));
                const authResponse = {
                    user: user
                };
                yield this.successResponse(req, res, authResponse);
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    otpOptions(req, res, next, userRepository, otpRepository) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { action, method, identifier, ip } = req.body;
                const user = yield userRepository.find(method, identifier, ip);
                if (!user) {
                    yield this.unauthorizedResponse(req, res);
                    next();
                    return;
                }
                const otpOptions = yield otpRepository.findAllByAction(user.id, action, ip);
                yield this.successResponse(req, res, otpOptions);
                next();
            }
            catch (err) {
                next(err);
            }
        });
    }
    authenticateByOTP(optionId, code, ip, otpRepository, userRepository) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield otpRepository.verify(optionId, code, ip))) {
                return false;
            }
            const option = yield otpRepository.findById(optionId, ip);
            const user = yield userRepository.findById((_a = option === null || option === void 0 ? void 0 : option.user_id) !== null && _a !== void 0 ? _a : '', ip);
            if (!user) {
                return false;
            }
            yield otpRepository.destroyVerificationCode(optionId, code, ip);
            return user;
        });
    }
    authenticateByPassword(method, identifier, password, ip, userRepository) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userRepository.find(method, identifier, ip);
            if (!user) {
                return false;
            }
            if (password) {
                const ok = yield userRepository.verifyPassword(user.id, password, ip);
                if (!ok) {
                    return false;
                }
            }
            return user;
        });
    }
}
exports.AuthController = AuthController;
