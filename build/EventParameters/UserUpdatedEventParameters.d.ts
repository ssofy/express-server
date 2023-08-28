import { Models } from "@ssofy/node-sdk";
export interface UserUpdatedEventParameters {
    user: Models.UserEntity;
    ip: string;
}
