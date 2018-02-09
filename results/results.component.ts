import { Component, ViewContainerRef } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { ProviderService } from "./shared/provider.service";
import { Provider } from "../shared/models/provider.model";

@Component({
	selector: "ResultsComponent",
	moduleId: module.id,
	templateUrl: "./results.component.html",
	styleUrls: ["./results-common.css"]
})
export class ResultsComponent {
	title: string;
	filter: string;
	isLoading: boolean;
	public resultItems: ObservableArray<Provider>;

	constructor(
		private _providerSerivce: ProviderService,
		private _pageRoute: PageRoute,
		private _routerExtensions: RouterExtensions
	) { }

	ngOnInit(): void {
		this.isLoading = true;
		this.title = "Find Results";
		this._pageRoute.activatedRoute
			.switchMap((activatedRoute) => activatedRoute.params)
			.forEach((params) => {
				this.filter = JSON.stringify(params);
				this._providerSerivce.getProviders()
					.then(providers => {
						this.isLoading = false;
						this.resultItems = providers;
					})
			});
		this.resultItems = new ObservableArray<Provider>();

	}

	onBackButtonTap(): void {
		this._routerExtensions.backToPreviousPage();
	}

	onResultTap(item: Provider) {
		this._routerExtensions.navigate(["results/result-detail", { id: item._id }],
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
