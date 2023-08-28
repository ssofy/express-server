import * as TokenDeletedEventParametersInternal from "./TokenDeletedEventParameters";
import * as UserAuthenticatedEventParametersInternal from "./UserAuthenticatedEventParameters";
import * as UserCreatedEventParametersInternal from "./UserCreatedEventParameters";
import * as UserUpdatedEventParametersInternal from "./UserUpdatedEventParameters";
import * as OTPSentEventParametersInternal from "./OTPSentEventParameters";

export namespace EventParameters {
    export type TokenDeletedEventParameters = TokenDeletedEventParametersInternal.TokenDeletedEventParameters;
    export type UserAuthenticatedEventParameters = UserAuthenticatedEventParametersInternal.UserAuthenticatedEventParameters;
    export type UserCreatedEventParameters = UserCreatedEventParametersInternal.UserCreatedEventParameters;
    export type UserUpdatedEventParameters = UserUpdatedEventParametersInternal.UserUpdatedEventParameters;
    export type OTPSentEventParameters = OTPSentEventParametersInternal.OTPSentEventParameters;
}
