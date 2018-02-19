import { Component, ViewContainerRef } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { Provider, ProviderResidency, ProviderLocation } from "../../shared/models/provider.model";
import * as phoneModule from "nativescript-phone";
import { ProviderService } from  "../../shared/services/provider.service";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { ModalDialogOptions, ModalDialogService } from "nativescript-angular/modal-dialog";
import { CalendarModalViewComponent } from "./calendar-modal";

@Component({
	selector: "ResultDetailComponent",
	moduleId: module.id,
	templateUrl: "./result-detail.component.html",
	styleUrls: ["../results-common.css"]
})
export class ResultDetailComponent {
	isLoading: boolean;
	btnRemove: boolean;
	title: string;
	public item: Provider;

	constructor(
		private _modalService: ModalDialogService,
		private _vcRef: ViewContainerRef,
		private _providerService: ProviderService,
		private _pageRoute: PageRoute,
		private _routerExtensions: RouterExtensions
	) { }

	ngOnInit(): void {
		this.isLoading = true;
		this.title = "Result Details";
		this.item = new Provider({});
		this.btnRemove = false;
		this._pageRoute.activatedRoute
			.switchMap((activatedRoute) => activatedRoute.params)
			.forEach((params) => {
				const npi = params.npi;
				this.btnRemove = !!params.remove;
				if (npi) {
					this._providerService.getProviderByNpi(npi).then(providerItem => {
						this.item = providerItem;
						this.title = this.item.prefix + ' ' + this.item.first_name + ' ' + this.item.last_name;
						this.isLoading = false;
					});
				} else {
					alert({
						title: "Oops something went wrong.",
						message: "Unknown Provider",
						okButtonText: "Ok"
					});
				}
			});
	}

	onBackButtonTap(): void {
		this._routerExtensions.backToPreviousPage();
	}

	formatResidencies(residencies: Array<ProviderResidency>): string {
		let formatted = "";
		residencies.forEach(residency => {
			if (residency.institution_name) {
				formatted += residency.institution_name + (residency.type ? ` (${residency.type})` : "") + "\n\n";
			}
		});
		if (formatted.endsWith("\n\n")) formatted = formatted.substring(0, formatted.length - 2);
		return formatted;
	}

	formatLocations(locations: Array<ProviderLocation>): string {
		let formatted = "";
		locations.forEach(location => {
			if (location.address_lines && location.address_lines.length) {
				formatted += location.address_lines.join("\n");
			}
			formatted += `${location.city} ${location.state} - ${location.zipcode}\n`;
			formatted += location.phone + "\n\n";
		});
		if (formatted.endsWith("\n\n")) formatted = formatted.substring(0, formatted.length - 1);
		return formatted;
	}

	formatEducation(education: any): string {
		return education ? (education.medical_school || "") + " " + (education.graduation_year || "") : "";
	}

	onPhoneTap(dataItem: Provider): void {
		phoneModule.dial(dataItem.phone, true);
	}

	onBookButtonTap(dataItem: Provider): void {
		this.createModelView().then(result => {
			if (result) {
				this._routerExtensions.navigate(["/search"], {
					clearHistory: true,
					animated: true,
					transition: {
						name: "slide",
						duration: 200,
						curve: "ease"
					}
				});
			}
		}).catch(error => {
			alert({
				title: "Oops something went wrong.",
				message: error && error.message,
				okButtonText: "Ok"
			});
		});
	}
	
	private createModelView(): Promise<any> {
		const today = new Date();
		const options: ModalDialogOptions = {
			viewContainerRef: this._vcRef,
			context: this.item,
			fullscreen: false,
		};
	
		return this._modalService.showModal(CalendarModalViewComponent, options);
	}

	onCancelButtonTap(dataItem: Provider): void {
		dialogs.confirm({
			title: "Dear __",
			message: `You are canceling the appointment with ${this.title} on __`,
			okButtonText: "Confirm",
			cancelButtonText: "Cancel"
		}).then(result => {
			if (result) {
				console.log("TODO: Delete appointment");
				// TODO: Delete appointment
			}
		});
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
