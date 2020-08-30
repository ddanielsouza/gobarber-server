import { getRepository } from 'typeorm';
import fs from 'fs';
import path from 'path';
import User from '../models/User';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

interface Request {
   user_id: string;
   avatarFileName: string;
}

export default class UpdateUserAvatarService {
   public async execute({ user_id, avatarFileName }: Request): Promise<User> {
      const usersRepository = getRepository(User);

      const user = await usersRepository.findOne(user_id);

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

      await usersRepository.save(user);

      return user;
   }
}
