import {Models} from "@ssofy/node-sdk";

export interface UserCreatedEventParameters {
    user: Models.UserEntity;
    ip: string;
}
