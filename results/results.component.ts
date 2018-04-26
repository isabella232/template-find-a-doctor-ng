import { Component, ViewContainerRef } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { ProviderService } from "../shared/services/provider.service";
import { Provider } from "../shared/models/provider.model";

@Component({
	selector: "ResultsComponent",
	moduleId: module.id,
	templateUrl: "./results.component.html",
	styleUrls: ["./results-common.css"]
})
export class ResultsComponent {
	title: string;
	isLoading: boolean;
	public resultItems: ObservableArray<Provider>;

	constructor(
		private _providerService: ProviderService,
		private _pageRoute: PageRoute,
		private _routerExtensions: RouterExtensions	) { }

	ngOnInit(): void {
		this.isLoading = true;
		this.title = "Find Results";
		this._pageRoute.activatedRoute
			.switchMap((activatedRoute) => activatedRoute.params)
			.forEach((params) => {
				params = params || {};
				this._providerService.findProviders(params.specialty, params.zipCode)
				.then(providers => {
					this.isLoading = false;
					this.resultItems = new ObservableArray<Provider>(providers);
				})
			});
	}

	onBackButtonTap(): void {
		this._routerExtensions.backToPreviousPage();
	}

	onResultTap(item: Provider) {
		this._routerExtensions.navigate(["results/result-detail", { npi: item.npi }],
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
