import AppError from '@shared/errors/AppError';
import { differenceInHours } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUserRepository from '../repositories/IUserRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';

interface IRequest {
   password: string;
   token: string;
}

@injectable()
export default class ResetPasswordService {
   constructor(
      @inject('UsersRepository')
      private usersRepository: IUserRepository,

      @inject('UserTokenRepository')
      private userTokenRepository: IUserTokenRepository,

      @inject('HashProvider')
      private hashProvider: IHashProvider,
   ) {}

   public async execute({ token, password }: IRequest): Promise<void> {
      const userToken = await this.userTokenRepository.findByToken(token);

      if (!userToken) {
         throw new AppError('user token does not exist ');
      }

      const user = await this.usersRepository.findById(userToken.user_id);

      if (!user) {
         throw new AppError('user does not exist ');
      }

      const tokenCretedAt = userToken.created_at;

      if (differenceInHours(Date.now(), tokenCretedAt) > 2) {
         throw new AppError('Passed more than 2 hours');
      }

      user.password = await this.hashProvider.genereteHash(password);

      await this.usersRepository.save(user);
   }
}
