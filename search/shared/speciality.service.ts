import { Injectable } from "@angular/core";
import { Kinvey } from "kinvey-nativescript-sdk";
import { Observable } from "rxjs/Rx";
import { DataItem } from "./dataItem";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";

@Injectable()
export class SpecialityService {
    private _kinveyMockPromise: Promise<any>;

    getSpecialities(): Promise<any> {
        if (!this._kinveyMockPromise) {
            this._kinveyMockPromise = new Promise((resolve, reject) => {
                const specialities = new ObservableArray<DataItem>([
                    { name: "General & Family Medicine", selected: false },
                    { name: "Family Practice", selected: false },
                    { name: "Preventive Medicine", selected: false },
                    { name: "General Practitioner", selected: false },
                    { name: "General & Family Medicine", selected: false },
                    { name: "Family Practice", selected: false },
                    { name: "Preventive Medicine", selected: false },
                    { name: "General Practitioner", selected: false },
                    { name: "General & Family Medicine", selected: false },
                    { name: "Family Practice", selected: false },
                    { name: "Preventive Medicine", selected: false },
                    { name: "General Practitioner", selected: false },
                    { name: "General & Family Medicine", selected: false },
                    { name: "Family Practice", selected: false },
                    { name: "Preventive Medicine", selected: false },
                    { name: "General Practitioner", selected: false }
                ]);

                resolve(specialities);
            });
        }

        return this._kinveyMockPromise;
    }
}
