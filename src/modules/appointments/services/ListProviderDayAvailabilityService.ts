import { getHours, isAfter } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
   provider_id: string;
   month: number;
   year: number;
   day: number;
}

interface IDayAvailable {
   hour: number;
   available: boolean;
}

type IResponse = Array<IDayAvailable>;

@injectable()
export default class ListProviderDayAvailabilityService {
   constructor(
      @inject('AppointimentsReporitory')
      private appointmentsReporitory: IAppointmentsRepository,
   ) {}

   public async execute({
      provider_id,
      day,
      month,
      year,
   }: IRequest): Promise<IResponse> {
      const appointments = await this.appointmentsReporitory.findAllInDayFromProvider(
         {
            provider_id,
            day,
            month,
            year,
         },
      );

      const hourStart = 8;

      const eachHourArray = Array.from(
         { length: 10 },
         (_value, index) => index + hourStart,
      );

      const currentDate = new Date(Date.now());
      const availability = eachHourArray.map(hour => {
         const hasAppointmentInHour = appointments.find(
            appointment => getHours(appointment.date) === hour,
         );
         const compareDate = new Date(year, month - 1, day, hour);

         return {
            hour,
            available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
         };
      });

      return availability;
   }
}
