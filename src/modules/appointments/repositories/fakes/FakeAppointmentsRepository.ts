import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsReporitory from '@modules/appointments/repositories/IAppointmentsReporitory';
import { getDate, getMonth, getYear } from 'date-fns';
import { uuid } from 'uuidv4';

class FakeAppointmentsRepository implements IAppointmentsReporitory {
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

   public async findAllInMonthFromProvider({
      provider_id,
      month,
      year,
   }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
      const appointments = this.appointments.filter(appointment => {
         return (
            appointment.provider_id === provider_id &&
            getMonth(appointment.date) + 1 === month &&
            getYear(appointment.date) === year
         );
      });

      return appointments;
   }

   public async findAllInDayFromProvider({
      provider_id,
      month,
      year,
      day,
   }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
      const appointments = this.appointments.filter(appointment => {
         return (
            appointment.provider_id === provider_id &&
            getMonth(appointment.date) + 1 === month &&
            getYear(appointment.date) === year &&
            getDate(appointment.date) === day
         );
      });

      return appointments;
   }
}

export default FakeAppointmentsRepository;
