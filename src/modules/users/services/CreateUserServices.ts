import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
   name: string;
   email: string;
   password: string;
}

@injectable()
export default class CreateUserServices {
   constructor(
      @inject('UsersRepository')
      private usersRepository: IUserRepository,

      @inject('HashProvider')
      private hashProvider: IHashProvider,

      @inject('CacheProvider')
      private cacheProvider: ICacheProvider,
   ) {}

   public async execute({ name, email, password }: IRequest): Promise<User> {
      const checkUserExists = await this.usersRepository.findByEmail(email);

      if (checkUserExists) {
         throw new AppError('Email address already used. ');
      }

      const hashedPassword = await this.hashProvider.genereteHash(password);

      const user = await this.usersRepository.create({
         name,
         email,
         password: hashedPassword,
      });

      await this.cacheProvider.invalidatePrefix('providers-list');

      return user;
   }
}
