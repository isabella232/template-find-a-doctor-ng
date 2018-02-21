import { Injectable } from "@angular/core";
import { Kinvey } from "kinvey-nativescript-sdk";
import { Observable } from "rxjs/Rx";
import { Appointment } from "../models/appointment.model";


@Injectable()
export class AppointmentService {
    private _appointments: Array<Appointment>;

    private _appointmentStore = Kinvey.DataStore.collection<Appointment>("Appointments");
    private _appointmentsPromise: Promise<any>;

    getAppointmentById(id: string): Promise<any> {
        const query = new Kinvey.Query();
        query.equalTo("appointment_id", id);
        return this._appointmentStore.find(query).toPromise()
            .then(data => {
                return data[0];
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
							//TODO: remove test appointments added here
                            const appointment2 = new Appointment(appointmentData);
                            appointment2.start_date = new Date(2017, 4, 4, 13, 0).toString();
                            appointment2.end_date = new Date(2017, 4, 4, 14, 0).toString();
                            appointments.push(appointment2);
                            const appointment3 = new Appointment(appointmentData);
                            appointment3.start_date = new Date(2018, 4, 4, 13, 0).toString();
                            appointment3.end_date = new Date(2018, 4, 4, 14, 0).toString();
                            appointments.push(appointment3);
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
