import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptUIListViewModule } from "nativescript-pro-ui/listview/angular";
import { NativeScriptUICalendarModule } from "nativescript-pro-ui/calendar/angular";
import { ResultsRoutingModule } from "./results-routing.module";

import { CalendarModalViewComponent } from "./result-detail/calendar-modal";
import { ResultsComponent } from "./results.component";
import { ResultDetailComponent } from "./result-detail/result-detail.component";

import { ProviderService } from "./shared/provider.service";
import { ModalDialogService } from "nativescript-angular/modal-dialog";


@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        NativeScriptUICalendarModule,
        NativeScriptUIListViewModule,
        ResultsRoutingModule
    ],
    declarations: [
        ResultsComponent,
        ResultDetailComponent,
        CalendarModalViewComponent
    ],
    providers: [
        ModalDialogService,
        ProviderService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    entryComponents: [
        CalendarModalViewComponent
    ]
})
export class ResultsModule { }
