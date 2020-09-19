import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointimentsReporitory from '@modules/appointments/repositories/IAppointimentsReporitory';
import { uuid } from 'uuidv4';

class FakeAppointmentsRepository implements IAppointimentsReporitory {
   private appointments: Appointment[] = [];

   public async create({
      provider_id,
      date,
   }: ICreateAppointmentDTO): Promise<Appointment> {
      const appointment = new Appointment();

      Object.assign(appointment, {
         id: uuid(),
         provider_id,
         date,
      });

      this.appointments.push(appointment);
      return appointment;
   }

   public async findByDate(date: Date): Promise<Appointment | undefined> {
      const findAppointment = this.appointments.find(appointment => {
         return appointment.date.toJSON() === date.toJSON();
      });

      return findAppointment;
   }
}

export default FakeAppointmentsRepository;
