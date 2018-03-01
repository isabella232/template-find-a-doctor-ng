import { Injectable } from "@angular/core";
import { Kinvey } from "kinvey-nativescript-sdk";
import { Observable } from "rxjs/Rx";
import { Appointment } from "../models/appointment.model";


@Injectable()
export class AppointmentService {
    private _appointments: Array<Appointment>;

    private _appointmentStore = Kinvey.DataStore.collection<Appointment>("Appointments");
    private _appointmentsPromise: Promise<any>;

    load(): Promise<Appointment[]> {

        return this._appointmentStore.sync().then(() => {
            const sortByDateQuery = new Kinvey.Query();
            sortByDateQuery.ascending("start_date");
            const stream = this._appointmentStore.find(sortByDateQuery);

            return stream.toPromise();
        }).then((data) => {
            this._appointments = [];
            data.forEach((appointmentData: any) => {
                const appointment = new Appointment(appointmentData);
                this._appointments.push(appointment);
            });

            return this._appointments;
        }).catch((error: Kinvey.BaseError) => {
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

    getAppointmentById(id: string): Appointment {
        if (!id) {
            return;
        }

        return this._appointments.filter((appointment) => {
            return appointment.appointment_id === id;
        })[0];
    }
}
