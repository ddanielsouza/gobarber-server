import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
   name: string;
   email: string;
   password?: string;
   old_password?: string;
   user_id: string;
}

@injectable()
export default class UpdateProfileServices {
   constructor(
      @inject('UsersRepository')
      private usersRepository: IUserRepository,
      @inject('HashProvider')
      private hashProvider: IHashProvider,
   ) {}

   public async execute({
      name,
      email,
      password,
      old_password,
      user_id,
   }: IRequest): Promise<User> {
      const user = await this.usersRepository.findById(user_id);

      if (!user) {
         throw new AppError('User not found');
      }

      const userWithUpdateEmail = await this.usersRepository.findByEmail(email);

      if (userWithUpdateEmail && userWithUpdateEmail.id !== user_id) {
         throw new AppError('E-mail already in use');
      }

      user.name = name;
      user.email = email;

      if (password && !old_password) {
         throw new AppError(
            'You need to inform the old password to set a new password',
         );
      }

      if (password && old_password) {
         const checkOldPassword = await this.hashProvider.compareHash(
            old_password,
            user.password as string,
         );

         if (!checkOldPassword) {
            throw new AppError('Old password does not match');
         }

         user.password = await this.hashProvider.genereteHash(password);
      }

      return this.usersRepository.save(user);
   }
}
