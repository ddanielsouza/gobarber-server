import ListProviderService from '@modules/appointments/services/ListProviderService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProvidersController {
   public async index(request: Request, response: Response): Promise<Response> {
      const listProviders = container.resolve(ListProviderService);
      const user_id = request.user.id;
      const providers = await listProviders.execute({ user_id });

      return response.json(classToClass(providers));
   }
}
