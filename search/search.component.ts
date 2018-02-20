import { Component, ViewContainerRef } from "@angular/core";
import { EventData } from "data/observable";
import { StackLayout } from "ui/layouts/stack-layout";
import { SearchBar } from "ui/search-bar";
import { ListViewEventData } from "nativescript-pro-ui/listview";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { DataItem } from "./shared/dataItem";
import { RouterExtensions } from "nativescript-angular/router";
import { SpecialityService } from "./shared/speciality.service";
import { AppointmentService } from "../shared/services/appointment.service";
import { ProviderService } from "../shared/services/provider.service";
import { Appointment } from "../shared/models/appointment.model";

@Component({
    selector: "SearchComponent",
    moduleId: module.id,
    templateUrl: "./search.component.html",
    styleUrls: ["./search-common.css"]
})
export class SearchComponent {
    title: string;
    filterLabel: string;
    filterExpanded: Boolean;
    selectedFilter: string;
    public specialityItems: ObservableArray<DataItem>;
    public recentItems: ObservableArray<any>;
    public outdatedItems: ObservableArray<any>;
    public zipCode: string;
    public searchText: string;

    constructor(
        private _appointmentService: AppointmentService,
        private _providerService: ProviderService,
        private _specialityService: SpecialityService,
        private _routerExtensions: RouterExtensions
    ) { }

    ngOnInit(): void {
        this.filterExpanded = true;
        this.title = "Find a Doctor";
        this.filterLabel = "filter by \u2303";
        this.selectedFilter = "";
        this.searchText = "";
        this.zipCode = "";
        this.recentItems = new ObservableArray();
        this.outdatedItems = new ObservableArray();
        this._specialityService.getSpecialities()
            .then(specialities => {
                this.specialityItems = specialities;
            }, error => {
                alert({
                    title: "Backend operation failed",
                    message: error.message,
                    okButtonText: "Ok"
                });
            });
        this._appointmentService.getAppointments()
            .then(appointments => {
                const past = [];
                const future = [];
                appointments.forEach(element => {
                    var endDate = element.end_date && new Date(element.end_date);
                    if (endDate && (endDate > new Date())) {
                        future.push(element);
                    } else {
                        past.push(element);
                    }
                });
                this.recentItems = new ObservableArray(future);
                this.outdatedItems = new ObservableArray(past);
            }, error => {
                alert({
                    title: "Backend operation failed",
                    message: error.message,
                    okButtonText: "Ok"
                });
            });
    }

    onFilterLabelTap() {
        this.filterExpanded = !this.filterExpanded;
        this.filterLabel = "filter by " + (this.filterExpanded ? "\u2303" : "\u2304");
    }

    onResetLabelTap() {
        this.selectedFilter = "";
        this.searchText = "";
        this.zipCode = "";
        this.specialityItems && this.specialityItems.forEach(item => item.selected = false);
    }

    onFilterButtonTap(args: EventData) {
        const sl = (<StackLayout>args.object).parent;
        this.selectedFilter = sl.get("data-name");
    }

    onFindButtonTap(args: EventData) {
        // hide keyboard if search is still focused
        if (args) {
            const searchTextBar = <SearchBar>args.object;
            searchTextBar.dismissSoftInput();
        }

        const speciality = this.specialityItems && this.specialityItems.filter(item => item.selected)[0];

        let filter = {
            text: this.searchText,
            zipCode: this.zipCode,
            speciality: speciality ? speciality.name : ""
        };
        this._routerExtensions.navigate(["/results", filter],
            {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 200,
                    curve: "ease"
                }
            });
    }

    specialitySelected(args: ListViewEventData) {
        this.specialityItems.forEach(item => item.selected = false);
        const item = this.specialityItems.getItem(args.index);
        item.selected = true;
    }

    specialityDeselected(args: ListViewEventData) {
        const item = this.specialityItems.getItem(args.index);
        item.selected = false;
    }

    onProfileButtonTap() {
        this._routerExtensions.navigate(["/plan"],
            {
                animated: true,
                transition: {
                    name: "fade",
                    duration: 200
                }
            });
    }

    getProviderName(appointment: Appointment): string {
        // TODO: get the provider's name from the appointment
        return "Dr. Jerome Aya-Ay"; // item.prefix + ' ' + item.first_name + ' ' + item.last_name
    }

    getProviderImage(appointment: Appointment): string {
        // TODO: get the provider's small image from the appointment
        return "https://d585tldpucybw.cloudfront.net/sfimages/default-source/blogs/Author-images/sam_basu.jpg";
    }
    
    getStartTime(start: string): string {
        var parsed = start && new Date(start);
        return parsed && parsed.toLocaleString();
    }

    onAppointmentTap(appointment: Appointment) {
        // TODO: get actual provider npi from the appointment - appointment.provider_scheduler_uuid ? 
        const providerNpi = "1467560003"; 
        this._routerExtensions.navigate(["results/result-detail", { npi: providerNpi, remove: true, appointment: appointment.appointment_id }],
			{
				animated: true,
				transition: {
					name: "slide",
					duration: 200,
					curve: "ease"
				}
			});
    }
}
