import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '../dtos/IFindAllInMonthFromProviderDTO';
import Appointment from '../infra/typeorm/entities/Appointment';

export default interface IAppointimentsReporitory {
   create(data: ICreateAppointmentDTO): Promise<Appointment>;
   findByDate(date: Date): Promise<Appointment | undefined>;
   findAllInMonthFromProvider(
      data: IFindAllInMonthFromProviderDTO,
   ): Promise<Appointment[]>;
}
