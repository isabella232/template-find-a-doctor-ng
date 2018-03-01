import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";

import { SearchRoutingModule } from "./search-routing.module";
import { SearchComponent } from "./search.component";

import { SpecialtyService } from "./shared/specialty.service";
import { ProviderService } from "../shared/services/provider.service";

import { SharedModule } from "../shared/shared.module";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptUIListViewModule,
        NativeScriptFormsModule,
        SearchRoutingModule,
        SharedModule
    ],
    declarations: [
        SearchComponent
    ],
    providers: [
        SpecialtyService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class SearchModule { }
