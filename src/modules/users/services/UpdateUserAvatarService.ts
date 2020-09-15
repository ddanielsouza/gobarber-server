import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
   user_id: string;
   avatarFileName: string;
}

@injectable()
export default class UpdateUserAvatarService {
   constructor(
      @inject('UsersRepository')
      private usersRepository: IUserRepository,
   ) {}

   public async execute({ user_id, avatarFileName }: IRequest): Promise<User> {
      const user = await this.usersRepository.findById(user_id);

      if (!user) {
         throw new AppError('User not found', 401);
      }

      if (user.avatar) {
         const userAvatarFilePath = path.join(
            uploadConfig.directory,
            user.avatar,
         );

         try {
            const userAvatarFileExists = await fs.promises.stat(
               userAvatarFilePath,
            );

            if (userAvatarFileExists) {
               await fs.promises.unlink(userAvatarFilePath);
            }
         } catch {
            console.log('File is not exists');
         }
      }

      user.avatar = avatarFileName;

      await this.usersRepository.save(user);

      return user;
   }
}
