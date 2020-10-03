import AppError from '@shared/errors/AppError';
import FakeHasProvider from '../providers/HashProvider/fakes/FakeHasProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHasProvider;

describe('SendForgotPasswordEmailService', () => {
   beforeEach(() => {
      fakeUsersRepository = new FakeUsersRepository();
      fakeUserTokensRepository = new FakeUserTokensRepository();
      fakeHashProvider = new FakeHasProvider();

      resetPasswordService = new ResetPasswordService(
         fakeUsersRepository,
         fakeUserTokensRepository,
         fakeHashProvider,
      );
   });

   it('should be able to reset the password', async () => {
      const user = await fakeUsersRepository.create({
         name: 'Jhon Doe',
         email: 'jhon@test.com',
         password: '123456',
      });

      const { token } = await fakeUserTokensRepository.generate(user.id);

      const genereteHash = jest.spyOn(fakeHashProvider, 'genereteHash');

      await resetPasswordService.execute({
         password: '111',
         token,
      });

      const updatedUser = await fakeUsersRepository.findById(user.id);

      expect(updatedUser?.password).toBe('111');
      expect(genereteHash).toHaveBeenCalledWith('111');
   });

   it('should not be able to reset the password with non-existing token', async () => {
      await expect(
         resetPasswordService.execute({
            password: '123456',
            token: 'non-existing-token',
         }),
      ).rejects.toBeInstanceOf(AppError);
   });

   it('should not be able to reset the password with non-existing user', async () => {
      const { token } = await fakeUserTokensRepository.generate('non-existing-user');

      await expect(
         resetPasswordService.execute({
            password: '123456',
            token,
         }),
      ).rejects.toBeInstanceOf(AppError);
   });

   it('should not be able to reset the password if passed more than 2 hours', async () => {
      const currentDate = new Date();
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
         return currentDate.getTime() + 1000 * 60 * 60 * 4;
      });

      const user = await fakeUsersRepository.create({
         name: 'Jhon Doe',
         email: 'jhon@test.com',
         password: '123456',
      });

      const { token } = await fakeUserTokensRepository.generate(user.id);

      await expect(
         resetPasswordService.execute({
            password: '123456',
            token,
         }),
      ).rejects.toBeInstanceOf(AppError);
   });
});
