import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
// import { NativeScriptFormsModule } from "nativescript-angular/forms";
// import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";

// import { SearchRoutingModule } from "../search/search-routing.module";
import { SearchComponent } from "../search/search.component";
import { RootComponent } from "./root.component";

import { RootRoutingModule } from "./root-routing.module";
import { PlanRoutingModule } from "../plan/plan-routing.module";
import { PlanComponent } from "../plan/plan.component";
import { CalculatorComponent } from "../calculator/calculator.component";

// import { SpecialtyService } from "../search/shared/specialty.service";
// import { ProviderService } from "../shared/services/provider.service";

import { SharedModule } from "../shared/shared.module";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        // NativeScriptUIListViewModule,
        // NativeScriptFormsModule,
        RootRoutingModule,
        SharedModule,
        RootRoutingModule
    ],
    declarations: [
        SearchComponent,
        RootComponent,
        PlanComponent
    ],
    providers: [
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class RootModule { }
