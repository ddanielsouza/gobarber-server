import ListProviderAppointmentsServices from '@modules/appointments/services/ListProviderAppointmentsServices';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProviderAppointmentsController {
   public async index(request: Request, response: Response): Promise<Response> {
      const { day, month, year } = request.body;
      const provider_id = request.user.id;

      const listProviderAppointments = container.resolve(
         ListProviderAppointmentsServices,
      );

      const appointments = await listProviderAppointments.execute({
         day,
         month,
         year,
         provider_id,
      });

      return response.json(appointments);
   }
}
