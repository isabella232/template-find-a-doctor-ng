import { Injectable } from "@angular/core";
import { Kinvey } from "kinvey-nativescript-sdk";
import { Observable } from "rxjs/Rx";
import { Provider } from "../../shared/models/provider.model";


@Injectable()
export class ProviderService {
    private _providers: Array<Provider>;

    private _providerStore = Kinvey.DataStore.collection<any>("Providers");
    private _providersPromise: Promise<any>;

    getProviderById(id: string): Promise<any> {
        return this._providerStore.findById(id).toPromise()
            .then(data => {
                return <Provider>data;
            })
            .catch((error: Kinvey.BaseError) => {
                alert({
                    title: "Oops something went wrong.",
                    message: error.message,
                    okButtonText: "Ok"
                });
            });
    }

    getProviders(): Promise<any> {
        if (!this._providersPromise) {
            this._providersPromise = this._providerStore.find().toPromise()
                .then((data) => {
                    const providers = [];

                    if (data && data.length) {
                        data.forEach((providerData: any) => {
                            const provider = new Provider(providerData);
                            providers.push(provider);
                        });
                    }

                    this._providers = providers;

                    return providers;
                })
                .catch((error: Kinvey.BaseError) => {
                    alert({
                        title: "Oops something went wrong.",
                        message: error.message,
                        okButtonText: "Ok"
                    });
                });
        }

        return this._providersPromise;
    }
}
