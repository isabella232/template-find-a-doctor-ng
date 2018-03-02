import { Component, ViewContainerRef, ViewChild } from "@angular/core";
import { EventData } from "data/observable";
import { StackLayout } from "ui/layouts/stack-layout";
import { SearchBar } from "ui/search-bar";
import { ListViewEventData } from "nativescript-ui-listview";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { RouterExtensions } from "nativescript-angular/router";
import { SpecialtyService } from "./shared/specialty.service";
import { AppointmentService } from "../shared/services/appointment.service";
import { ProviderService } from "../shared/services/provider.service";
import { Appointment } from "../shared/models/appointment.model";
import { RadListViewComponent } from "nativescript-ui-listview/angular";
import { Specialty } from "./shared/specialty";

@Component({
    selector: "SearchComponent",
    moduleId: module.id,
    templateUrl: "./search.component.html",
    styleUrls: ["./search-common.css"]
})
export class SearchComponent {
    title: string;
    selectedFilter: string;
    specialty: string;
    specialtyItems: ObservableArray<Specialty>;
    recentItems: ObservableArray<any>;
    zipCode: string;
    filterSpecialties: string;
    isSpecialtyLoading: boolean;
    specialtyFilteringFunc: Function;

    @ViewChild("recentItemsListView") recentItemsListView: RadListViewComponent;
    @ViewChild("specialtyListView") specialtyListView: RadListViewComponent;

    constructor(
        private _appointmentService: AppointmentService,
        private _providerService: ProviderService,
        private _specialtyService: SpecialtyService,
        private _routerExtensions: RouterExtensions
    ) { }

    ngOnInit(): void {
        this.title = "Find a Doctor";
        this.selectedFilter = "";
        this.zipCode = "";
        this.filterSpecialties = "";
        this.specialty = "";
        this.isSpecialtyLoading = true;
        const filterFunc = (item: Specialty): boolean => {
            return item.specialty.toLowerCase().includes(this.filterSpecialties.toLowerCase());
        };
        this.specialtyFilteringFunc = filterFunc.bind(this);
        this._specialtyService.getSpecialties().then(specialities => {
            this.specialtyItems = new ObservableArray<Specialty>(specialities);
            this.isSpecialtyLoading = false;
        });
        this._appointmentService.load()
            .then(appointments => {
                // TODO: enable group header template when exposed by listview
                // (<any>this.recentItemsListView.listView).defaultGroupTemplate = '<StackLayout class="m-b-15"><Label text="{{ category }}" class="header text-uppercase t-14 p-l-15 p-t-10 p-b-7"></Label><StackLayout class="hr-light"></StackLayout></StackLayout>';
                this.recentItems = new ObservableArray(appointments);
            });
    }


    onResetLabelTap() {
        this.selectedFilter = "";
        this.zipCode = "";
        this.specialty = "";
        this.specialtyItems && this.specialtyItems.forEach(item => item.selected = false);
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

        let filter = {
            zipCode: this.zipCode,
            specialty: this.specialty
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

    specialtySelected(args: ListViewEventData) {
        this.specialtyItems.forEach(item => item.selected = false);
        const selectedItems = args.object.getSelectedItems();
        const item = selectedItems && selectedItems[0];
        if (item) {
            item.selected = true;
            this.specialty = item.specialty;
        }
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

    onFilterSpecialtiesChange(args: EventData) {
        this.specialtyListView.listView.refresh();
    }

    listGroupingFunc(item: Appointment): any {
        var endDate = item && item.end_date && new Date(item.end_date);
        // non-braking space used to force Outdated group to be at the bottom
        return (endDate && (endDate > new Date())) ? " Your Recent Appointments" : "\u00a0Outdated";
    }

    specialtyGroupingFunc(item: Specialty): any {
        return item.specialty[0].toUpperCase();
    }
}
