import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";

import { AppointmentService } from "./services/appointment.service";
import { ProviderService } from "./services/provider.service";
import { PlanService } from "./services/plan.service";

@NgModule({
    imports: [
        NativeScriptUIListViewModule
    ],
    providers: [
        AppointmentService,
        ProviderService,
        PlanService
    ],
    exports: [
        NativeScriptUIListViewModule
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class SharedModule { }
