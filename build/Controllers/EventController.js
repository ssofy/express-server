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
exports.EventController = void 0;
const node_sdk_1 = require("@ssofy/node-sdk");
const Controller_1 = require("./Controller");
const UserSchema_1 = require("../Schema/UserSchema");
const OTPOptionSchema_1 = require("../Schema/OTPOptionSchema");
const Event_1 = require("../Enums/Event");
class EventController extends Controller_1.Controller {
    handle(req, res, next, userRepository, otpRepository, notifiers, eventManagers) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { action } = req.body;
                switch (action) {
                    case 'token_deleted':
                        return this.tokenDeleted(req, res, next, eventManagers);
                    case 'safety_reset':
                        return this.safetyReset(req, res, next, eventManagers);
                    case 'otp_requested':
                        return this.sendOTP(req, res, next, otpRepository, notifiers, eventManagers);
                    case 'password_reset':
                        return this.passwordReset(req, res, next, userRepository, eventManagers);
                    case 'user_created':
                        return this.userCreated(req, res, next, userRepository, eventManagers);
                    case 'user_updated':
                        return this.userUpdated(req, res, next, userRepository, eventManagers);
                }
                yield this.badRequestResponse(req, res);
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    tokenDeleted(req, res, next, eventManagers) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { payload } = req.body;
                eventManagers.forEach((eventManager) => eventManager.publish(Event_1.Event.TokenDeleted, {
                    token: payload.token,
                }));
                yield this.successResponse(req, res, {
                    success: true
                });
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    safetyReset(req, res, next, eventManagers) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                eventManagers.forEach((eventManager) => eventManager.publish(Event_1.Event.SafetyReset));
                yield this.successResponse(req, res, {
                    success: true
                });
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    sendOTP(req, res, next, otpRepository, notifiers, eventManagers) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { payload, ip } = req.body;
                let option = node_sdk_1.Helpers.filterObject(OTPOptionSchema_1.OTPOptionSchema, payload.option);
                const code = yield otpRepository.newVerificationCode(option, ip);
                notifiers.forEach(notifier => notifier.notify(option.to, 'otp', {
                    option: option,
                    code: code,
                }));
                eventManagers.forEach((eventManager) => eventManager.publish(Event_1.Event.OTPSent, {
                    option: option,
                    code: code,
                }));
                yield this.successResponse(req, res, {
                    success: true
                });
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    userCreated(req, res, next, userRepository, eventManagers) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { payload, ip } = req.body;
                let user = node_sdk_1.Helpers.filterObject(UserSchema_1.UserSchema, payload.user);
                user.id = '';
                user.hash = '';
                const createdUser = yield userRepository.create(user, payload.user.password, ip);
                eventManagers.forEach((eventManager) => eventManager.publish(Event_1.Event.UserCreated, {
                    user: createdUser,
                    ip: ip,
                }));
                yield this.successResponse(req, res, {
                    success: true
                });
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    userUpdated(req, res, next, userRepository, eventManagers) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { payload, ip } = req.body;
                let user = node_sdk_1.Helpers.filterObject(UserSchema_1.UserSchema, payload.user);
                const updatedUser = yield userRepository.update(user, ip);
                eventManagers.forEach((eventManager) => eventManager.publish(Event_1.Event.UserUpdated, {
                    user: updatedUser,
                    ip: ip,
                }));
                yield this.successResponse(req, res, {
                    success: true
                });
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    passwordReset(req, res, next, userRepository, eventManagers) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { payload, ip } = req.body;
                const user = yield userRepository.findByToken(payload.token, ip);
                if (!user) {
                    yield this.unauthorizedResponse(req, res);
                    next();
                    return;
                }
                yield userRepository.updatePassword(user.id, payload.password, ip);
                yield userRepository.deleteToken(payload.token);
                eventManagers.forEach((eventManager) => eventManager.publish(Event_1.Event.UserUpdated, {
                    user: user,
                    ip: ip,
                }));
                yield this.successResponse(req, res, {
                    success: true
                });
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.EventController = EventController;
