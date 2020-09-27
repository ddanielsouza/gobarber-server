import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IUserRepository from '../repositories/IUserRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';

interface IRequest {
   email: string;
}

@injectable()
export default class SendForgotPasswordEmailService {
   constructor(
      @inject('UsersRepository')
      private usersRepository: IUserRepository,

      @inject('MailProvider')
      private mailProvider: IMailProvider,

      @inject('UserTokenRepository')
      private userTokenRepository: IUserTokenRepository,
   ) {}

   public async execute({ email }: IRequest): Promise<void> {
      const user = await this.usersRepository.findByEmail(email);

      if (!user) {
         throw new AppError('User does not exists');
      }

      await this.userTokenRepository.generate(user.id);

      this.mailProvider.sendMail(email, 'Recuperar senha');
   }
}
