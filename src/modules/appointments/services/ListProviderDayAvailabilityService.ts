import { inject, injectable } from 'tsyringe';
import IAppointmentsReporitory from '../repositories/IAppointmentsReporitory';

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
      private appointmentsReporitory: IAppointmentsReporitory,
   ) {}

   public async execute({
      provider_id,
      day,
      month,
      year,
   }: IRequest): Promise<IResponse> {
      const appointments;

      return [];
   }
}
