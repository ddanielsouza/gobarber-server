import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import AppError from '../errors/AppError';

interface RequestDTO {
   date: Date;
   provider_id: string;
}

class CreateAppointmentService {
   public async execute({
      date,
      provider_id,
   }: RequestDTO): Promise<Appointment | null> {
      const appointmentDate = startOfHour(date);
      const appointmentsRepository = getCustomRepository(
         AppointmentsRepository,
      );

      const findAppointmentInSameDate = await appointmentsRepository.findByDate(
         appointmentDate,
      );

      if (findAppointmentInSameDate) {
         throw new AppError('This appointment is allready booked');
      }

      const appointment = appointmentsRepository.create({
         provider_id,
         date: appointmentDate,
      });

      await appointmentsRepository.save(appointment);

      return appointment;
   }
}

export default CreateAppointmentService;
