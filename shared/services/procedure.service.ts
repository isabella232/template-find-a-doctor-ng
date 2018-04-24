import { Injectable } from "@angular/core";
import { Kinvey } from "kinvey-nativescript-sdk";
import { Observable } from "rxjs/Rx";
import { Procedure } from "../models/procedure.model";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";

@Injectable()
export class ProcedureService {

    private _procedures: Array<Procedure>;

    private _procedureStore = Kinvey.DataStore.collection<Procedure>("Procedure", Kinvey.DataStoreType.Network);
    private _proceduresPromise: Promise<any>;

    getProcedures(): Promise<Procedure[]> {
        if (!this._proceduresPromise) {
            // TODO: get procedures from Kinvey
            // this._proceduresPromise = this._procedureStore.find().toPromise()
            this._proceduresPromise = this.proceduresMock()
                .then((data) => {
                    this._procedures = [];

                    if (data && data.length) {
                        data.forEach((procedureData: any) => {
                            const procedure = new Procedure(procedureData);
                            this._procedures.push(procedure);
                        });
                    }

                    return this._procedures;
                })
                .catch((error: Kinvey.BaseError) => {
                    alert({
                        title: "Oops something went wrong.",
                        message: error.message,
                        okButtonText: "Ok"
                    });
                });
        }

        return this._proceduresPromise;
    }

    private proceduresMock() : Promise<any> {
        return new Promise((resolve) => {
            let procedures = [];

            procedures.push(new Procedure({name: "Partial excision bone", category: "surgery", keywords: "catA" })); 
            procedures.push(new Procedure({name: "Percutaneous coronary angioplasty (PTCA)", category: "surgery", keywords: "catA" })); 
            procedures.push(new Procedure({name: "Laminectomy, excision intervertebral disc", category: "surgery", keywords: "catB" })); 
            procedures.push(new Procedure({name: "Hip replacement, total and partial", category: "surgery", keywords: "catB" })); 
            procedures.push(new Procedure({name: "Knee arthroplasty", category: "surgery", keywords: "catC" })); 
            procedures.push(new Procedure({name: "Partial excision bone", category: "cat 3", keywords: "catC" })); 
            procedures.push(new Procedure({name: "Colorectal resection", category: "cat 1", keywords: "catA" })); 
            procedures.push(new Procedure({name: "Excision, lysis peritoneal adhesions", category: "cat 2", keywords: "catA" })); 
            procedures.push(new Procedure({name: "Appendectomy", category: "cat 2", keywords: "catA" })); 
            procedures.push(new Procedure({name: "Flu shot", category: "office visit", keywords: "catA" })); 

            resolve(procedures);
        })
    }

}
