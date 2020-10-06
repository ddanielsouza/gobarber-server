import CreateUserServices from '@modules/users/services/CreateUserServices';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class UsersController {
   public async create(request: Request, response: Response): Promise<Response> {
      const { name, email, password } = request.body;
      const createUserServices = container.resolve(CreateUserServices);

      const user = await createUserServices.execute({
         name,
         email,
         password,
      });

      return response.json(classToClass(user));
   }
}
