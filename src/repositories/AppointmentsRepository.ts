import { isEqual } from 'date-fns';
import Appointment from '../models/Appointment';

interface CreateAppointmentDTO {
   provider: string;
   date: Date;
}

class AppointmentsRepository {
   private appointmetns: Appointment[];

   constructor() {
      this.appointmetns = [];
   }

   public all(): Appointment[] {
      return this.appointmetns;
   }

   public create({ provider, date }: CreateAppointmentDTO): Appointment {
      const appointment = new Appointment({ provider, date });

      this.appointmetns.push(appointment);
      return appointment;
   }

   public findByDate(date: Date): Appointment | null {
      const findAppointment = this.appointmetns.find(appointment => {
         return isEqual(date, appointment.date);
      });

      return findAppointment || null;
   }
}

export default AppointmentsRepository;
