import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptUIListViewModule } from "nativescript-pro-ui/listview/angular";

import { SearchRoutingModule } from "./search-routing.module";
import { SearchComponent } from "./search.component";

import { SpecialityService } from "./shared/speciality.service";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptUIListViewModule,
        NativeScriptFormsModule,
        SearchRoutingModule
    ],
    declarations: [
        SearchComponent
    ],
    providers: [
        SpecialityService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class SearchModule { }
