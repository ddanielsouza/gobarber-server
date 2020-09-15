import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
   email: string;
   password: string;
}
interface IResponse {
   user: User;
   token: string;
}
@injectable()
export default class AuthenticateUserService {
   constructor(
      @inject('UsersRepository')
      private usersRepository: IUserRepository,
   ) {}

   public async execute({ email, password }: IRequest): Promise<IResponse> {
      const user = await this.usersRepository.findByEmail(email);

      if (!user) {
         throw new AppError('Incorrect email/password combination.', 401);
      }

      const passwordMatched = await compare(password, user.password as string);

      if (!passwordMatched) {
         throw new AppError('Incorrect email/password combination.', 401);
      }

      const token = sign({}, authConfig.jwt.secret, {
         subject: user.id,
         expiresIn: authConfig.jwt.expiresIn,
      });

      return { user, token };
   }
}
