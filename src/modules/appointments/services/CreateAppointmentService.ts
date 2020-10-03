import { getHours, isBefore, startOfHour } from 'date-fns';
import AppError from '@shared/errors/AppError';

import { inject, injectable } from 'tsyringe';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
   date: Date;
   provider_id: string;
   user_id: string;
}

@injectable()
class CreateAppointmentService {
   constructor(
      @inject('AppointmentsRepository')
      private appointmentsRepository: IAppointmentsRepository,
   ) {}

   public async execute({
      date,
      provider_id,
      user_id,
   }: IRequestDTO): Promise<Appointment | null> {
      const appointmentDate = startOfHour(date);

      if (isBefore(appointmentDate, Date.now())) {
         throw new AppError('You not can create an appointment on a past date');
      }

      if (user_id === provider_id) {
         throw new AppError('You not can create an appointment with yourself');
      }

      if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
         throw new AppError('You cal only create appointments between 9am and 5pm');
      }

      const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
         appointmentDate,
      );

      if (findAppointmentInSameDate) {
         throw new AppError('This appointment is already booked');
      }

      const appointment = await this.appointmentsRepository.create({
         provider_id,
         date: appointmentDate,
         user_id,
      });

      return appointment;
   }
}

export default CreateAppointmentService;
