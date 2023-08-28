import {Models} from "@ssofy/node-sdk";

export interface OTPSentEventParameters {
    option: Models.OTPOptionEntity;
    code: string;
}
