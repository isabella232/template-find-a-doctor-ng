import { Injectable } from "@angular/core";
import { Kinvey } from "kinvey-nativescript-sdk";
import { Observable } from "rxjs/Rx";
import { Appointment } from "../models/appointment.model";


@Injectable()
export class AppointmentService {
    private _appointments: Array<Appointment>;

    private _appointmentStore = Kinvey.DataStore.collection<Appointment>("Appointments", Kinvey.DataStoreType.Network);

    getAppointmentById(id: string): Promise<Appointment> {
        const appointmentIdQuery = new Kinvey.Query();
        appointmentIdQuery.equalTo("appointment_id", id);
        return this._appointmentStore.find(appointmentIdQuery).toPromise<any>().then((data) => {
            if (data && data.length) {
                return new Appointment(data[0]);
            } else {
                return null;
            }
        }).catch((error: Kinvey.BaseError) => {
            alert({
                title: "Oops something went wrong.",
                message: error.message,
                okButtonText: "Ok"
            });
            return null;
        });
    }

    getAppointments(): Promise<Appointment[]> {
        const sortByDateQuery = new Kinvey.Query();
        sortByDateQuery.ascending("start_date");
        return this._appointmentStore.find(sortByDateQuery).toPromise<Appointment[]>().then((data) => {
            this._appointments = [];
            data.forEach((appointmentData: any) => {
                const appointment = new Appointment(appointmentData);
                this._appointments.push(appointment);
            });

            console.log("this._appointments:" + this._appointments);
            return this._appointments;
        }).catch((error: Kinvey.BaseError) => {
            console.log("this._appointments error: " + error);

            alert({
                title: "Oops something went wrong.",
                message: error.message,
                okButtonText: "Ok"
            });
            return null;
        });
    }

    create(appointment: Appointment): Promise<Appointment> {
        return this._appointmentStore.create(appointment).catch((error: Kinvey.BaseError) => {
            alert({
                title: "Oops something went wrong.",
                message: error.message,
                okButtonText: "Ok"
            });
            return null;
        });
    }

    delete(appointment: Appointment): Promise<{ count: number }> {
        return this._appointmentStore.removeById(appointment._id).catch((error: Kinvey.BaseError) => {
            alert({
                title: "Oops something went wrong.",
                message: error.message,
                okButtonText: "Ok"
            });
            return { count: 0 };
        });
    }
}
