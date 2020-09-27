import AppError from '@shared/errors/AppError';
import FakeHasProvider from '../providers/HashProvider/fakes/FakeHasProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserServices from './CreateUserServices';

describe('AuthenticateUser', () => {
   it('should be able to authenticate', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeHasProvider = new FakeHasProvider();

      const createUsers = new CreateUserServices(
         fakeUsersRepository,
         fakeHasProvider,
      );

      const authenticateUser = new AuthenticateUserService(
         fakeUsersRepository,
         fakeHasProvider,
      );

      const user = await createUsers.execute({
         name: 'Jhon doe',
         email: 'jhondoe@gmail.com',
         password: '123456',
      });

      const auth = await authenticateUser.execute({
         email: 'jhondoe@gmail.com',
         password: '123456',
      });

      expect(auth).toHaveProperty('token');
      expect(auth.user).toEqual(user);
   });

   it('should not be able to authenticate with non existing user', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeHasProvider = new FakeHasProvider();

      const authenticateUser = new AuthenticateUserService(
         fakeUsersRepository,
         fakeHasProvider,
      );

      await expect(
         authenticateUser.execute({
            email: 'jhondoe@gmail.com',
            password: '123456',
         }),
      ).rejects.toBeInstanceOf(AppError);
   });

   it('should not be able to authenticate with wrong password', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeHasProvider = new FakeHasProvider();

      const createUsers = new CreateUserServices(
         fakeUsersRepository,
         fakeHasProvider,
      );

      const authenticateUser = new AuthenticateUserService(
         fakeUsersRepository,
         fakeHasProvider,
      );

      await createUsers.execute({
         name: 'Jhon doe',
         email: 'jhondoe@gmail.com',
         password: '123456',
      });

      await expect(
         authenticateUser.execute({
            email: 'jhondoe@gmail.com',
            password: '*****',
         }),
      ).rejects.toBeInstanceOf(AppError);
   });
});
