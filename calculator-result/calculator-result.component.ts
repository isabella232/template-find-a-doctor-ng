import { Component, ViewContainerRef } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { EstimateService } from "../shared/services/estimate.service";
import { Estimate } from "../shared/models/estimate.model";

@Component({
	selector: "CalculatorResultComponent",
	moduleId: module.id,
	templateUrl: "./calculator-result.component.html",
	styleUrls: ["./calculator-result-common.css"]
})
export class CalculatorResultComponent {
	procedure: string;
	title: string;
	isLoading: boolean;
	public resultItems: Array<Estimate>;

	constructor(
		private _estimateService: EstimateService,
		private _pageRoute: PageRoute,
		private _routerExtensions: RouterExtensions
	) { }

	ngOnInit(): void {
		this.isLoading = true;

		this._pageRoute.activatedRoute
			.switchMap((activatedRoute) => activatedRoute.params)
			.forEach((params) => {
				params = params || {};

				this.procedure = params.procedure;
				this.title = this.procedure;
				this._estimateService.getEstimates()
					.then(estimates => {
						this.isLoading = false;
						console.log(estimates);
						this.resultItems = estimates;
					})
			});
	}

	onBackButtonTap(): void {
		this._routerExtensions.backToPreviousPage();
	}

	// onResultTap(item: Provider) {
	// 	this._routerExtensions.navigate(["results/result-detail", { npi: item.npi }],
	// 		{
	// 			animated: true,
	// 			transition: {
	// 				name: "slide",
	// 				duration: 200,
	// 				curve: "ease"
	// 			}
	// 		});
	// }
}
