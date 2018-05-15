import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { SearchComponent } from "../search/search.component";
import { RootComponent } from "./root.component";
import { CalculatorComponent } from "../calculator/calculator.component";
import { PlanComponent } from "../plan/plan.component";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

import { RootRoutingModule } from "./root-routing.module";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        RootRoutingModule,
        SharedModule,
        RootRoutingModule
    ],
    declarations: [
        SearchComponent,
        RootComponent,
        PlanComponent,
        CalculatorComponent
    ],
    providers: [
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class RootModule { }
