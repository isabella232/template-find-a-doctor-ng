import { Component, ViewContainerRef } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Kinvey } from "kinvey-nativescript-sdk";
import { Plan } from "../shared/models/plan.model";
import { PlanService } from "./shared/plan.service";
import { openUrl } from "utils/utils";

@Component({
    selector: "PlanComponent",
    moduleId: module.id,
    templateUrl: "./plan.component.html",
    styleUrls: ["./plan-common.css"]
})
export class PlanComponent {
    title: string;
    item: Plan;
    user: any;
    private formatter: Intl.NumberFormat;

    constructor(
        private _planService: PlanService,
        private _routerExtensions: RouterExtensions
    ) { }

    ngOnInit(): void {
        this.formatter = new Intl.NumberFormat("en-US", {style: 'currency', currency: 'USD'});
        this.title = "Plan Information";
        this.item = new Plan({});
        this.user = {};
        Kinvey.User.me().then(user => {
            this.user = user && user.data;
            const planId = (this.user && this.user.plan_id) || "33602TX0420001";
            this._planService.getPlanById(planId).then(plan => {
                this.item = plan;
            },
                error => {
                    alert({
                        title: "Backend operation failed",
                        message: error.message,
                        okButtonText: "Ok"
                    });
                });
        }, error => {
            alert({
                title: "Backend operation failed",
                message: error.message,
                okButtonText: "Ok"
            });
        });
    }

    onBackButtonTap(): void {
        this._routerExtensions.backToPreviousPage();
    }

    formatCurrency(value: number): string {
        if (isNaN(value)) {
            value = 0;
        }

        return this.formatter.format(value);
    }

    onBenefitsTap(url: string): void {
        openUrl(url || 'about:blank');
    }
}
