import {Repositories, Filters, Transformers, Notifications, Events} from "@ssofy/node-sdk";

export interface Bindings {
    clientRepository: Repositories.ClientRepository;
    scopeRepository: Repositories.ScopeRepository;
    userRepository: Repositories.UserRepository;
    otpRepository: Repositories.OTPRepository;
    socialLinkRepository: Repositories.SocialLinkRepository;
    userFilter: Filters.UserFilter;
    userTransformer: Transformers.UserTransformer;
    notifiers: Notifications.Notifier[];
    eventChannels: Events.EventChannel[],
}
