import { Models } from "@ssofy/node-sdk";
export interface UserAuthenticatedEventParameters {
    user: Models.UserEntity;
    method: 'username' | 'email' | 'phone' | 'otp' | 'token' | 'social';
    ip: string;
}
