import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { inject, injectable } from 'tsyringe';

interface IRequest {
   user_id: string;
}

@injectable()
export default class ListProviderService {
   constructor(
      @inject('UsersRepository')
      private usersRepository: IUserRepository,
      @inject('CacheProvider')
      private cacheProvider: ICacheProvider,
   ) {}

   public async execute({ user_id }: IRequest): Promise<User[]> {
      const redisKey = `providers-list: ${user_id}`;

      let users = await this.cacheProvider.recover<User[]>(redisKey);

      if (!users) {
         users = await this.usersRepository.findAllProviders({
            except_user_id: user_id,
         });

         await this.cacheProvider.save(`providers-list: ${user_id}`, users);
      }

      return users;
   }
}
