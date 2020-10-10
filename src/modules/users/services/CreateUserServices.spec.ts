import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';
import FakeHasProvider from '../providers/HashProvider/fakes/FakeHasProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserServices from './CreateUserServices';

let fakeUsersRepository: FakeUsersRepository;
let fakeHasProvider: FakeHasProvider;
let fakeCacheProvider: FakeCacheProvider;

let createUsers: CreateUserServices;

describe('CreateUsers', () => {
   beforeEach(() => {
      fakeUsersRepository = new FakeUsersRepository();
      fakeHasProvider = new FakeHasProvider();
      fakeCacheProvider = new FakeCacheProvider();
      createUsers = new CreateUserServices(
         fakeUsersRepository,
         fakeHasProvider,
         fakeCacheProvider,
      );
   });
   it('should be able to create a new user', async () => {
      const user = await createUsers.execute({
         name: 'Jhon doe',
         email: 'jhondoe@gmail.com',
         password: '123456',
      });

      expect(user).toHaveProperty('id');
      expect(user.email).toBe('jhondoe@gmail.com');
   });

   it('should not be able to create a new user if email duplicate', async () => {
      await createUsers.execute({
         name: 'Jhon doe',
         email: 'jhondoe@gmail.com',
         password: '123456',
      });

      await expect(
         createUsers.execute({
            name: 'Jhon doe',
            email: 'jhondoe@gmail.com',
            password: '123456',
         }),
      ).rejects.toBeInstanceOf(AppError);
   });
});
