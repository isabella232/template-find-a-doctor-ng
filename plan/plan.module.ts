import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptUIListViewModule } from "nativescript-pro-ui/listview/angular";

import { PlanRoutingModule } from "./plan-routing.module";
import { PlanComponent } from "./plan.component";
import { PlanService } from "./shared/plan.service";


@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptUIListViewModule,
        NativeScriptFormsModule,
        PlanRoutingModule
    ],
    declarations: [
        PlanComponent
    ],
    providers: [
        PlanService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class PlanModule { }
