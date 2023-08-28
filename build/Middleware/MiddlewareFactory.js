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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareFactory = void 0;
const node_sdk_1 = require("@ssofy/node-sdk");
const ClientResourceValidation_1 = __importDefault(require("./Validations/ClientResourceValidation"));
const ScopeResourceValidation_1 = __importDefault(require("./Validations/ScopeResourceValidation"));
const UserResourceValidation_1 = __importDefault(require("./Validations/UserResourceValidation"));
const OTPOptionsValidation_1 = __importDefault(require("./Validations/OTPOptionsValidation"));
const PasswordAuthValidation_1 = __importDefault(require("./Validations/PasswordAuthValidation"));
const TokenAuthValidation_1 = __importDefault(require("./Validations/TokenAuthValidation"));
const SocialAuthValidation_1 = __importDefault(require("./Validations/SocialAuthValidation"));
const EventValidation_1 = __importDefault(require("./Validations/EventValidation"));
class MiddlewareFactory {
    static requestSignatureVerifier(apiSecret) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const signature = req.header('Signature');
            if (!signature) {
                console.debug(req.originalUrl, {
                    error: 'Signature Verification Failed',
                    signature: signature,
                });
                res.sendStatus(400);
                return;
            }
            const path = req.originalUrl;
            const params = req.body;
            const secret = apiSecret;
            const url = path.startsWith('/') ? 'http://localhost' + path : path;
            const signatureGenerator = new node_sdk_1.SignatureGenerator();
            const validator = new node_sdk_1.SignatureVerifier(signatureGenerator);
            if (!(yield validator.verifyBase64Signature(url, params, secret, signature))) {
                console.debug(req.originalUrl, {
                    error: 'Signature Verification Failed',
                    signature: signature,
                });
                res.sendStatus(400);
                return;
            }
            next();
        });
    }
    static clientResourceRequestValidator() {
        return ClientResourceValidation_1.default;
    }
    static scopeResourceRequestValidator() {
        return ScopeResourceValidation_1.default;
    }
    static userResourceRequestValidator() {
        return UserResourceValidation_1.default;
    }
    static otpOptionsRequestValidator() {
        return OTPOptionsValidation_1.default;
    }
    static passwordAuthRequestValidator(config) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            yield (0, PasswordAuthValidation_1.default)(req, res);
            if (res.statusCode === 400) {
                return;
            }
            const { method, password } = req.body;
            const methods = (_b = (_a = config.authentication) === null || _a === void 0 ? void 0 : _a.methods) !== null && _b !== void 0 ? _b : {};
            if (!((_c = methods[method]) !== null && _c !== void 0 ? _c : true)) {
                const message = { error: 'Unauthorized' };
                console.debug(req.originalUrl, message);
                res.status(401).send(message);
                return;
            }
            if ((!password || password === '') && !((_e = (_d = config.authentication) === null || _d === void 0 ? void 0 : _d.passwordless) !== null && _e !== void 0 ? _e : true)) {
                const message = { error: 'Unauthorized' };
                console.debug(req.originalUrl, message);
                res.status(401).send(message);
                return;
            }
            next();
        });
    }
    static tokenAuthRequestValidator(config) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            yield (0, TokenAuthValidation_1.default)(req, res);
            if (res.statusCode === 400) {
                return;
            }
            if (!((_c = (_b = (_a = config.authentication) === null || _a === void 0 ? void 0 : _a.methods) === null || _b === void 0 ? void 0 : _b.token) !== null && _c !== void 0 ? _c : true)) {
                const message = { error: 'Unauthorized' };
                console.debug(req.originalUrl, message);
                res.status(401).send(message);
                return;
            }
            next();
        });
    }
    static socialAuthRequestValidator(config) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            yield (0, SocialAuthValidation_1.default)(req, res);
            if (res.statusCode === 400) {
                return;
            }
            if (!((_c = (_b = (_a = config.authentication) === null || _a === void 0 ? void 0 : _a.methods) === null || _b === void 0 ? void 0 : _b.social) !== null && _c !== void 0 ? _c : true)) {
                const message = { error: 'Unauthorized' };
                console.debug(req.originalUrl, message);
                res.status(401).send(message);
                return;
            }
            next();
        });
    }
    static eventRequestValidator() {
        return EventValidation_1.default;
    }
}
exports.MiddlewareFactory = MiddlewareFactory;
