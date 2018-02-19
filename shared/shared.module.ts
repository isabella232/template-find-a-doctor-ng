import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptUIListViewModule } from "nativescript-pro-ui/listview/angular";

import { AppointmentService } from "./services/appointment.service";
import { ProviderService } from "./services/provider.service";

@NgModule({
    imports: [
        NativeScriptUIListViewModule
    ],
    providers: [
        AppointmentService,
        ProviderService
    ],
    exports: [
        NativeScriptUIListViewModule
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class SharedModule { }
