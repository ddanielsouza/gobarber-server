import AppError from '@shared/errors/AppError';
import FakeHasProvider from '../providers/HashProvider/fakes/FakeHasProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserServices from './CreateUserServices';

describe('CreateUsers', () => {
   it('should be able to create a new user', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeHasProvider = new FakeHasProvider();

      const createUsers = new CreateUserServices(
         fakeUsersRepository,
         fakeHasProvider,
      );

      const user = await createUsers.execute({
         name: 'Jhon doe',
         email: 'jhondoe@gmail.com',
         password: '123456',
      });

      expect(user).toHaveProperty('id');
      expect(user.email).toBe('jhondoe@gmail.com');
   });

   it('should not be able to create a new user if email duplicate', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeHasProvider = new FakeHasProvider();
      const createUsers = new CreateUserServices(
         fakeUsersRepository,
         fakeHasProvider,
      );

      await createUsers.execute({
         name: 'Jhon doe',
         email: 'jhondoe@gmail.com',
         password: '123456',
      });

      expect(
         createUsers.execute({
            name: 'Jhon doe',
            email: 'jhondoe@gmail.com',
            password: '123456',
         }),
      ).rejects.toBeInstanceOf(AppError);
   });
});
