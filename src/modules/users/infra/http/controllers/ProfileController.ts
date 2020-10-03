import ShowProfileService from '@modules/users/services/ShowProfileService';
import UpdateProfileServices from '@modules/users/services/UpdateProfileServices';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProfileController {
   public async show(request: Request, response: Response): Promise<Response> {
      const showProfile = container.resolve(ShowProfileService);

      const user = await showProfile.execute({
         user_id: request.user.id,
      });

      delete user.password;

      return response.json(user);
   }

   public async update(request: Request, response: Response): Promise<Response> {
      const { name, email, password, old_password } = request.body;
      const updateProfile = container.resolve(UpdateProfileServices);

      const user = await updateProfile.execute({
         user_id: request.user.id,
         name,
         email,
         password,
         old_password,
      });

      delete user.password;

      return response.json(user);
   }
}
