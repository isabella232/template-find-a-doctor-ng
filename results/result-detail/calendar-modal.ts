import { Component, OnInit } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { Page } from "tns-core-modules/ui/page/page";
import { CalendarSelectionEventData, RadCalendar, CalendarViewMode, CalendarDayViewStyle, CalendarDayViewEventSelectedData, CalendarEvent } from "nativescript-pro-ui/calendar";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { Provider } from "../../shared/models/provider.model";

@Component({
    moduleId: module.id,
    templateUrl: "./calendar-modal.html",
})

export class CalendarModalViewComponent implements OnInit {
    showHeader: boolean;
    dateToday: Date;
    item: Provider;

    constructor(private params: ModalDialogParams, private page: Page) {
        this.dateToday = new Date();
        this.item = params.context;
        this.page.on("unloaded", () => {
            // using the unloaded event to close the modal when there is user interaction
            // e.g. user taps outside the modal page
            this.params.closeCallback();
        });
    }

    ngOnInit() {
        this.showHeader = true;
    }

    onCloseButtonTap(){
        this.params.closeCallback();
    }

    onCalendarDateSelected(args: CalendarSelectionEventData) {
        const calendar = <RadCalendar>args.object;
        if (calendar.viewMode !== CalendarViewMode.Day) {
            this.showHeader = false;
            calendar.displayedDate = args.date;
            calendar.viewMode = CalendarViewMode.Day;
        }
        // TODO: Retrieve open slots and set calendar.eventSource
        const tenAM = new Date(args.date.getFullYear(), args.date.getMonth(), args.date.getDate(), 10,0,0,0);
        const elevenAM = new Date(args.date.getFullYear(), args.date.getMonth(), args.date.getDate(), 11,0,0,0);
        const testEvent = new CalendarEvent("10 AM", tenAM, elevenAM, false);
        calendar.eventSource = [testEvent];
    }

    onCalendarEventSelected(args: CalendarDayViewEventSelectedData) {
        
        dialogs.confirm({
			title: "Dear __",
			message: "Please confirm the appointment with __ on __",
			okButtonText: "Confirm",
			cancelButtonText: "Cancel"
		}).then(result => {
			if (result) {
				console.log("TODO: Create apointment");
                // TODO: Create apointment
                this.params.closeCallback(args.eventData);
			}
		});
    }

    getDayViewStyle(): CalendarDayViewStyle {
        var dayViewStyle = new CalendarDayViewStyle();
        dayViewStyle.showWeekNumbers = false;
        dayViewStyle.showDayNames = true;
        dayViewStyle.showTitle = true;

        return dayViewStyle;
    }
}