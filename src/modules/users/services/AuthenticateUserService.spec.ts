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

      await createUsers.execute({
         name: 'Jhon doe',
         email: 'jhondoe@gmail.com',
         password: '123456',
      });

      const auth = await authenticateUser.execute({
         email: 'jhondoe@gmail.com',
         password: '123456',
      });

      expect(auth).toHaveProperty('token');
   });
});
