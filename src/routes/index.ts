import express from 'express';
import path from "path";
import {Notifications, Repositories, Transformers, Filters, Storage} from "@ssofy/node-sdk";
import {MiddlewareFactory} from "../Middleware/MiddlewareFactory";
import {ServerConfig} from "../ServerConfig";
import {Bindings} from "../Bindings";
import authRoutes from "./auth";
import resourceRoutes from "./resource";
import eventRoutes from "./event";

const handlebarsEngine = new Notifications.HandlebarsEngine();
const defaultTemplates: Notifications.Template[] = [
    {
        name: 'otp',
        path: path.join(__dirname, '../templates/otp/email.handlebars'),
        engine: handlebarsEngine,
        channel: Notifications.Channel.EMAIL,
    },
    {
        name: 'otp',
        path: path.join(__dirname, '../templates/otp/sms.handlebars'),
        engine: handlebarsEngine,
        channel: Notifications.Channel.SMS,
    },
];

export default (config: ServerConfig) => {
    // create bindings from config
    const otpStorage = config.otp?.storage ?? new Storage.MemoryStorage;
    const socialLinkRepository = config.repositories?.socialLink ?? new Repositories.DefaultSocialLinkRepository(config.connection, config.socialLink.schema, config.socialLink.columns);
    const userTransformer = config.user?.transformer ?? new Transformers.DefaultUserTransformer();
    const userRepository = config.repositories?.user ?? new Repositories.DefaultUserRepository(
        config.connection,
        config.user.schema,
        otpStorage,
        socialLinkRepository,
        userTransformer,
        config.user.columns
    );
    let bindings: Bindings = {
        clientRepository: config.repositories?.client ?? new Repositories.DefaultClientRepository(config.data?.clients ?? []),
        scopeRepository: config.repositories?.scope ?? new Repositories.DefaultScopeRepository(config.data?.scopes ?? []),
        userRepository: userRepository,
        otpRepository: config.repositories?.otp ?? new Repositories.DefaultOTPRepository(otpStorage, userRepository),
        socialLinkRepository: socialLinkRepository,
        userFilter: config.user?.filter ?? new Filters.DefaultUserFilter,
        userTransformer: userTransformer,
        notifiers: config.otp?.notifiers ?? [],
        eventChannels: config.events?.channels ?? [],
    };

    // setup default notification templates
    bindings.notifiers.forEach((notifier: Notifications.Notifier) => {
        defaultTemplates.forEach((template: Notifications.Template) => {
            if (!notifier.hasTemplate(template.name)) {
                notifier.setTemplate(template);
            }
        });

        for (const key in config.otp.settings as any) {
            notifier.setVar(key, config.otp.settings[key]);
        }
    });

    // setup router
    const router = express.Router();

    const requestMiddleware = MiddlewareFactory.requestSignatureVerifier(config.secret);

    router.use(config.routePrefix ?? '/external/ssofy/', [
        requestMiddleware,
        authRoutes(config, bindings),
        resourceRoutes(config, bindings),
        eventRoutes(config, bindings),
    ]);

    return router;
};
