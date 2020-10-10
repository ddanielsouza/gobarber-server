import User from '@modules/users/infra/typeorm/entities/User';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderService from './ListProviderService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;

let listProvider: ListProviderService;

describe('UpdateProfileServices', () => {
   beforeEach(() => {
      fakeUsersRepository = new FakeUsersRepository();
      fakeCacheProvider = new FakeCacheProvider();
      listProvider = new ListProviderService(fakeUsersRepository, fakeCacheProvider);
   });

   it('should be able to list profiles', async () => {
      const users: User[] = [];

      for (let i = 0; i < 10; i++) {
         const user = await fakeUsersRepository.create({
            name: `user ${i}`,
            email: `user.${i}@exemple.com`,
            password: '123456',
         });

         users.push(user);
      }

      const loggeduser = await fakeUsersRepository.create({
         name: 'John doe',
         email: 'jhon@exemple.com',
         password: '123456',
      });

      const profiles = await listProvider.execute({
         user_id: loggeduser.id,
      });

      expect(profiles).toEqual(users);
   });
});
