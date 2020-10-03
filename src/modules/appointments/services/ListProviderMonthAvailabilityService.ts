import { getDate, getDaysInMonth } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
   provider_id: string;
   month: number;
   year: number;
}

interface IDayAvailable {
   day: number;
   available: boolean;
}

type IResponse = Array<IDayAvailable>;

@injectable()
export default class ListProviderMonthAvailabilityService {
   constructor(
      @inject('AppointmentsRepository')
      private appointmentsRepository: IAppointmentsRepository,
   ) {}

   public async execute({ provider_id, month, year }: IRequest): Promise<IResponse> {
      const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
         { provider_id, month, year },
      );

      const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1, 0));

      const eachDayArray = Array.from(
         { length: numberOfDaysInMonth },
         (_value, index) => index + 1,
      );

      const availability = eachDayArray.map(day => {
         const appointmentsInDay = appointments.filter(appointment => {
            return getDate(appointment.date) === day;
         });

         return {
            day,
            available: appointmentsInDay.length < 10,
         };
      });

      return availability;
   }
}
