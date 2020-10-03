import { startOfHour } from 'date-fns';
import AppError from '@shared/errors/AppError';

import { inject, injectable } from 'tsyringe';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsReporitory from '../repositories/IAppointmentsReporitory';

interface IRequestDTO {
   date: Date;
   provider_id: string;
}

@injectable()
class CreateAppointmentService {
   constructor(
      @inject('AppointmentsRepository')
      private appointmentsRepository: IAppointmentsReporitory,
   ) {}

   public async execute({
      date,
      provider_id,
   }: IRequestDTO): Promise<Appointment | null> {
      const appointmentDate = startOfHour(date);

      const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
         appointmentDate,
      );

      if (findAppointmentInSameDate) {
         throw new AppError('This appointment is allready booked');
      }

      const appointment = await this.appointmentsRepository.create({
         provider_id,
         date: appointmentDate,
      });

      return appointment;
   }
}

export default CreateAppointmentService;
