import { Component, ViewContainerRef } from "@angular/core";
import { isAndroid } from "platform";
import { EventData } from "data/observable";
import { StackLayout } from "ui/layouts/stack-layout";
import { TextField } from "ui/text-field";
import { SearchBar } from "ui/search-bar";
import * as http from "http";
import { ListViewEventData } from "nativescript-pro-ui/listview";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { DataItem } from "./shared/dataItem";
import { RouterExtensions } from "nativescript-angular/router";
import { SpecialityService } from "./shared/speciality.service";

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
    public zipCode: string;
    public searchText: string;

    constructor(
        private _specialitySerivce: SpecialityService,
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
        this._specialitySerivce.getSpecialities()
            .then(specialities => {
                this.specialityItems = specialities;
            })
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
}
