import CreateUserServices from '@modules/users/services/CreateUserServices';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class UsersController {
   public async create(request: Request, response: Response): Promise<Response> {
      const { name, email, password } = request.body;
      const createUserServices = container.resolve(CreateUserServices);

      const user = await createUserServices.execute({
         name,
         email,
         password,
      });

      delete user.password;

      return response.json(user);
   }
}
