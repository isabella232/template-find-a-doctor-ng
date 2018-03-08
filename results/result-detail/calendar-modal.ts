import { Component, OnInit, ViewChild } from "@angular/core";
import { Kinvey } from "kinvey-nativescript-sdk";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { Page, Color } from "tns-core-modules/ui/page/page";
import { CalendarSelectionEventData, RadCalendar, CalendarViewMode, CalendarDayViewStyle, CalendarDayViewEventSelectedData, CalendarEvent, CalendarMonthViewStyle, DayCellStyle } from "nativescript-ui-calendar";
import { RadCalendarComponent } from "nativescript-ui-calendar/angular/calendar-directives";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { Provider } from "../../shared/models/provider.model";
import { AppointmentService } from "../../shared/services/appointment.service";
import { Appointment } from "../../shared/models/appointment.model";

@Component({
    moduleId: module.id,
    templateUrl: "./calendar-modal.html",
})

export class CalendarModalViewComponent implements OnInit {
    showHeader: boolean;
    dateNextMonth: Date;
    dateToday: Date;
    item: Provider;
    availableText: string = "Book Now";
    unavailableText: string = "Booked";
    selectedDate: Date;

    @ViewChild("appointmentDayPicker") appointmentDayPicker: RadCalendarComponent;

    constructor(private _appointmentService: AppointmentService,
        private params: ModalDialogParams,
        private page: Page) {
        this.dateToday = new Date();
        this.selectedDate = this.dateToday;
        //set the maximum date to today + one month
        const tempDate = new Date(this.dateToday.valueOf());
        tempDate.setMonth(tempDate.getMonth() + 1);
        this.dateNextMonth = tempDate;
        this.item = params.context;
        this.page.on("unloaded", () => {
            // using the unloaded event to close the modal when there is user interaction
            // e.g. user taps outside the modal page
            this.params.closeCallback();
        });
    }

    ngOnInit() {
        this.showHeader = true;
        this.appointmentDayPicker.calendar.selectedDate = this.dateToday;
    }

    onCloseButtonTap() {
        const calendar = this.appointmentDayPicker.calendar;
        if (calendar.viewMode === CalendarViewMode.Day) {
            calendar.eventSource = [];
            calendar.viewMode = CalendarViewMode.Month;
            this.showHeader = true;
        } else {
            this.params.closeCallback();
        }
    }

    _updateCalendarAppointments() {
        // TODO: Retrieve open slots and set calendar.eventSource here
        // in this example we simply generate slots every 30 min and randomly assign free/busy 
        let rSeed = this.selectedDate.getMonth() * 100 + this.selectedDate.getDate();
        const seedRandom = () => {
            rSeed = rSeed = (rSeed * 9301 + 49297) % 233280;
            return rSeed / 233280;
        }
        const testEvents = [];
        for (let startTime = 0; startTime < 16; startTime++) {
            const startDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate(),
                9 + Math.floor(startTime / 2), 30 * (startTime % 2), 0, 0);
            const endDate = new Date(startDate.valueOf());
            endDate.setMinutes(endDate.getMinutes() + 30);
            const isBusy = seedRandom() > 0.7;
            const testEvent = new CalendarEvent(isBusy ? this.unavailableText : this.availableText, startDate, endDate, false, isBusy ? new Color("Gray") : new Color("Green"));
            testEvents.push(testEvent);
        }
        this.appointmentDayPicker.eventSource = testEvents;
    }

    onCalendarDateSelected(args: CalendarSelectionEventData) {
        this.selectedDate = args.date;
        if (args.object.viewMode === CalendarViewMode.Day) {
            this._updateCalendarAppointments();
        }
    }

    onOkButtonTap() {
        const calendar = this.appointmentDayPicker.calendar;

        if (calendar.viewMode !== CalendarViewMode.Day) {
            this.showHeader = false;
            calendar.displayedDate = this.selectedDate;
            calendar.viewMode = CalendarViewMode.Day;
        }

        this._updateCalendarAppointments();
    }

    onCalendarEventSelected(args: CalendarDayViewEventSelectedData) {
        if (args.eventData.title !== this.availableText) {
            return;
        }

        const selectedDate = args.eventData.startDate;
        Kinvey.User.me().then(user => {
            const data = user && user.data as any;
            dialogs.confirm({
                title: `Dear ${(data && data.givenName) || "patient"}`,
                message: `Please confirm the appointment with ${this.getProviderName(this.item)} on ${selectedDate.toLocaleString()}`,
                okButtonText: "Confirm",
                cancelButtonText: "Cancel"
            }).then(result => {
                if (result) {
                    // TODO: Create appointment
                    const appointment = new Appointment({
                        pd_appointment_uuid: "ef987691-0a19-447f-814d-f8f3abbf4859",
                        appointment_id: "UYQDUHSMIRCA",
                        appointment_type: "OV1",
                        patient: {
                            "first_name": "John",
                            "last_name": "Doe",
                            "_uuid": "8b21f7b0-8535-11e4-a6cb-0800272e8da1",
                            "phone": "800-555-1212",
                            "member_id": "M000001",
                            "birth_date": "1970-01-25",
                            "email": "john@johndoe.com"
                        },
                        status: "booked",
                        provider_scheduler_uuid: "8b21efa4-8535-11e4-a6cb-0800272e8da1",
                        start_date: args.eventData.startDate.toISOString(),
                        end_date: args.eventData.endDate.toISOString()
                    });
                    this._appointmentService.create(appointment).then(newAppointment => {
                        this.params.closeCallback(args.eventData);
                    });
                }
            });
        }, error => {
            alert({
                title: "Backend operation failed",
                message: error.message,
                okButtonText: "Ok"
            });
        });
    }

    getProviderName(providerItem: Provider) {
        return providerItem.prefix + ' ' + providerItem.first_name + ' ' + providerItem.last_name;
    }

    getDayViewStyle(): CalendarDayViewStyle {
        const dayViewStyle = new CalendarDayViewStyle();
        dayViewStyle.showWeekNumbers = false;
        dayViewStyle.showDayNames = true;
        dayViewStyle.showTitle = true;

        return dayViewStyle;
    }

    getMonthViewStyle(): CalendarMonthViewStyle {
        const monthViewStyle = new CalendarMonthViewStyle();
        monthViewStyle.backgroundColor = "white";
        monthViewStyle.showTitle = true;
        monthViewStyle.showWeekNumbers = false;
        monthViewStyle.showDayNames = true;
        monthViewStyle.selectionShape = "Round";
        monthViewStyle.selectionShapeSize = 25;
        monthViewStyle.selectionShapeColor = "Red";

        const todayCellStyle = new DayCellStyle();
        todayCellStyle.cellBackgroundColor = "white";
        todayCellStyle.cellBorderWidth = 1;
        todayCellStyle.cellBorderColor = "transparent";
        todayCellStyle.cellTextColor = "blue";
        monthViewStyle.todayCellStyle = todayCellStyle;

        const dayCellStyle = new DayCellStyle();
        dayCellStyle.cellAlignment = "Center"; // HACK
        dayCellStyle.cellBackgroundColor = "white";
        dayCellStyle.cellBorderWidth = 1;
        dayCellStyle.cellBorderColor = "transparent";
        dayCellStyle.cellTextColor = "#745151";
        monthViewStyle.dayCellStyle = dayCellStyle;

        const selectedCellStyle = new DayCellStyle();
        selectedCellStyle.cellTextColor = "white";
        monthViewStyle.selectedDayCellStyle = selectedCellStyle;

        return monthViewStyle;
    }

    formatDate(date: Date): string {
        const split = date.toDateString().split(" ");
        split.pop();
        return split.join(" ");
    }
}