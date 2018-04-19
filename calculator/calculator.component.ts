import { Component, ViewContainerRef, ViewChild } from "@angular/core";

@Component({
    selector: "CalculatorComponent",
    moduleId: module.id,
    templateUrl: "./calculator.component.html",
    styleUrls: ["./calculator-common.css"]
})
export class CalculatorComponent {
    title: string;

    constructor(
    ) { }

    ngOnInit(): void {
        this.title = "OOP Calculator";
    }
}
