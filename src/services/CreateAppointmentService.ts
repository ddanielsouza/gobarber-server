import { startOfHour } from 'date-fns';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface RequestDTO {
   date: Date;
   provider: string;
}

class CreateAppointmentService {
   private appointmentsRepository: AppointmentsRepository;

   constructor(appointmentsRepository: AppointmentsRepository) {
      this.appointmentsRepository = appointmentsRepository;
   }

   public execute({ date, provider }: RequestDTO): Appointment | null {
      const appointmentDate = startOfHour(date);

      const findAppointmentInSameDate = this.appointmentsRepository.findByDate(
         appointmentDate,
      );

      if (findAppointmentInSameDate) {
         throw new Error('This appointment is allready booked');
      }

      const appointment = this.appointmentsRepository.create({
         provider,
         date: appointmentDate,
      });

      return appointment;
   }
}

export default CreateAppointmentService;
