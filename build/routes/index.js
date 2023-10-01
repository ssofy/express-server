"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const node_sdk_1 = require("@ssofy/node-sdk");
const MiddlewareFactory_1 = require("../Middleware/MiddlewareFactory");
const auth_1 = __importDefault(require("./auth"));
const resource_1 = __importDefault(require("./resource"));
const event_1 = __importDefault(require("./event"));
const handlebarsEngine = new node_sdk_1.Notifications.HandlebarsEngine();
const defaultTemplates = [
    {
        name: 'otp',
        path: path_1.default.join(__dirname, '../templates/otp/email.handlebars'),
        engine: handlebarsEngine,
        channel: node_sdk_1.Notifications.Channel.EMAIL,
    },
    {
        name: 'otp',
        path: path_1.default.join(__dirname, '../templates/otp/sms.handlebars'),
        engine: handlebarsEngine,
        channel: node_sdk_1.Notifications.Channel.SMS,
    },
];
exports.default = (config) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
    // create bindings from config
    const otpStorage = (_b = (_a = config.otp) === null || _a === void 0 ? void 0 : _a.storage) !== null && _b !== void 0 ? _b : new node_sdk_1.Storage.MemoryStorage;
    const socialLinkRepository = (_d = (_c = config.repositories) === null || _c === void 0 ? void 0 : _c.socialLink) !== null && _d !== void 0 ? _d : new node_sdk_1.Repositories.DefaultSocialLinkRepository(config.connection, config.socialLink.schema, config.socialLink.columns);
    const userTransformer = (_f = (_e = config.user) === null || _e === void 0 ? void 0 : _e.transformer) !== null && _f !== void 0 ? _f : new node_sdk_1.Transformers.DefaultUserTransformer();
    const userRepository = (_h = (_g = config.repositories) === null || _g === void 0 ? void 0 : _g.user) !== null && _h !== void 0 ? _h : new node_sdk_1.Repositories.DefaultUserRepository(config.connection, config.user.schema, otpStorage, socialLinkRepository, userTransformer, config.user.columns);
    let bindings = {
        clientRepository: (_k = (_j = config.repositories) === null || _j === void 0 ? void 0 : _j.client) !== null && _k !== void 0 ? _k : new node_sdk_1.Repositories.DefaultClientRepository((_m = (_l = config.data) === null || _l === void 0 ? void 0 : _l.clients) !== null && _m !== void 0 ? _m : []),
        scopeRepository: (_p = (_o = config.repositories) === null || _o === void 0 ? void 0 : _o.scope) !== null && _p !== void 0 ? _p : new node_sdk_1.Repositories.DefaultScopeRepository((_r = (_q = config.data) === null || _q === void 0 ? void 0 : _q.scopes) !== null && _r !== void 0 ? _r : []),
        userRepository: userRepository,
        otpRepository: (_t = (_s = config.repositories) === null || _s === void 0 ? void 0 : _s.otp) !== null && _t !== void 0 ? _t : new node_sdk_1.Repositories.DefaultOTPRepository(otpStorage, userRepository),
        socialLinkRepository: socialLinkRepository,
        userFilter: (_v = (_u = config.user) === null || _u === void 0 ? void 0 : _u.filter) !== null && _v !== void 0 ? _v : new node_sdk_1.Filters.DefaultUserFilter,
        userTransformer: userTransformer,
        notifiers: (_x = (_w = config.otp) === null || _w === void 0 ? void 0 : _w.notifiers) !== null && _x !== void 0 ? _x : [],
        eventChannels: (_z = (_y = config.events) === null || _y === void 0 ? void 0 : _y.channels) !== null && _z !== void 0 ? _z : [],
    };
    // setup default notification templates
    bindings.notifiers.forEach((notifier) => {
        defaultTemplates.forEach((template) => {
            if (!notifier.hasTemplate(template.name)) {
                notifier.setTemplate(template);
            }
        });
        for (const key in config.otp.vars) {
            notifier.setVar(key, config.otp.vars[key]);
        }
    });
    // setup router
    const router = express_1.default.Router();
    const requestMiddleware = MiddlewareFactory_1.MiddlewareFactory.requestSignatureVerifier(config.secret);
    router.use((_0 = config.routePrefix) !== null && _0 !== void 0 ? _0 : '/external/ssofy/', [
        requestMiddleware,
        (0, auth_1.default)(config, bindings),
        (0, resource_1.default)(config, bindings),
        (0, event_1.default)(config, bindings),
    ]);
    return router;
};
