import { Repositories, Filters, Transformers, Notifications, Events, Storage, Models, Datasource } from "@ssofy/node-sdk";
export interface ServerConfig {
    secret: string;
    connection: Datasource.Connection;
    mockMode?: boolean;
    routePrefix?: string;
    otp: {
        storage?: Storage.Storage;
        notifiers?: Notifications.Notifier[];
        vars: {
            brand: string;
            [key: string]: string;
        };
    };
    authentication?: {
        methods?: {
            username?: boolean;
            email?: boolean;
            phone?: boolean;
            token?: boolean;
            otp?: boolean;
            social?: boolean;
        };
        passwordless?: boolean;
    };
    repositories?: {
        client?: Repositories.ClientRepository;
        scope?: Repositories.ScopeRepository;
        user?: Repositories.UserRepository;
        otp?: Repositories.OTPRepository;
        socialLink?: Repositories.SocialLinkRepository;
    };
    events?: {
        channels?: Events.EventChannel[];
    };
    user: {
        schema: any;
        filter?: Filters.UserFilter;
        transformer?: Transformers.UserTransformer;
        columns?: {
            id?: string;
            hash?: string;
            name?: string;
            display_name?: string;
            picture?: string;
            username?: string;
            email?: string;
            email_verified?: string;
            phone?: string;
            phone_verified?: string;
            password?: string;
            metadata?: string;
        };
    };
    socialLink: {
        schema: any;
        columns?: {
            provider: string;
            identifier: string;
            user_id: string;
        };
    };
    data?: {
        scopes?: Models.ScopeEntity[];
        clients?: Models.ClientEntity[];
    };
}
