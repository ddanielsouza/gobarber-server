import AppError from '@shared/errors/AppError';
import authConfig from '@config/auth';
import FakeHasProvider from '../providers/HashProvider/fakes/FakeHasProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHasProvider: FakeHasProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
   beforeEach(() => {
      authConfig.jwt.secret = 'secret';

      fakeUsersRepository = new FakeUsersRepository();
      fakeHasProvider = new FakeHasProvider();

      authenticateUser = new AuthenticateUserService(
         fakeUsersRepository,
         fakeHasProvider,
      );
   });

   it('should be able to authenticate', async () => {
      const user = await fakeUsersRepository.create({
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
      await expect(
         authenticateUser.execute({
            email: 'jhondoe@gmail.com',
            password: '123456',
         }),
      ).rejects.toBeInstanceOf(AppError);
   });

   it('should not be able to authenticate with wrong password', async () => {
      await fakeUsersRepository.create({
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
