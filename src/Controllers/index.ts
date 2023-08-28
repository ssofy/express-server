import * as ControllerInternal from "./Controller";
import * as AuthControllerInternal from "./AuthController";
import * as ResourceControllerInternal from "./ResourceController";
import * as EventControllerInternal from "./EventController";

export namespace Controllers {
    export import Controller = ControllerInternal.Controller;
    export import AuthController = AuthControllerInternal.AuthController;
    export import ResourceController = ResourceControllerInternal.ResourceController;
    export import EventController = EventControllerInternal.EventController;
}
