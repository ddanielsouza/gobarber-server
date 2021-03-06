import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { getDate, getMonth, getYear } from 'date-fns';
import { uuid } from 'uuidv4';

class FakeAppointmentsRepository implements IAppointmentsRepository {
   private appointments: Appointment[] = [];

   public async create({
      provider_id,
      date,
      user_id,
   }: ICreateAppointmentDTO): Promise<Appointment> {
      const appointment = new Appointment();

      Object.assign(appointment, {
         id: uuid(),
         provider_id,
         date,
         user_id,
      });

      this.appointments.push(appointment);
      return appointment;
   }

   public async findByDate(
      date: Date,
      provider_id: string,
   ): Promise<Appointment | undefined> {
      const findAppointment = this.appointments.find(appointment => {
         return (
            appointment.date.toJSON() === date.toJSON() &&
            appointment.provider_id === provider_id
         );
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
