import { Injectable } from "@angular/core";
import { Kinvey } from "kinvey-nativescript-sdk";
import { Observable } from "rxjs/Rx";
import { Appointment } from "../models/appointment.model";


@Injectable()
export class AppointmentService {
    private _appointments: Array<Appointment>;

    private _appointmentStore = Kinvey.DataStore.collection<any>("Appointments");
    private _appointmentsPromise: Promise<any>;

    getAppointmentById(id: string): Promise<any> {
        const query = new Kinvey.Query();
        query.equalTo("appointment_id",id);
        return this._appointmentStore.find(query).toPromise()
            .then(data => {
                return <Appointment>data[0];
            })
            .catch((error: Kinvey.BaseError) => {
                alert({
                    title: "Oops something went wrong.",
                    message: error.message,
                    okButtonText: "Ok"
                });
            });
    }

    getAppointments(): Promise<Appointment[]> {
        if (!this._appointmentsPromise) {
            this._appointmentsPromise = this._appointmentStore.find().toPromise()
                .then((data) => {
                    const appointments = [];

                    if (data && data.length) {
                        data.forEach((appointmentData: any) => {
                            const appointment = new Appointment(appointmentData);
                            appointments.push(appointment);
                        });
                    }

                    this._appointments = appointments;

                    return appointments;
                })
                .catch((error: Kinvey.BaseError) => {
                    alert({
                        title: "Oops something went wrong.",
                        message: error.message,
                        okButtonText: "Ok"
                    });
                });
        }

        return this._appointmentsPromise;
    }
}
