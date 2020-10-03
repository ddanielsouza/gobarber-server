import AppError from '@shared/errors/AppError';
import FakeHasProvider from '../providers/HashProvider/fakes/FakeHasProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileServices from './UpdateProfileServices';

let fakeUsersRepository: FakeUsersRepository;
let fakeHasProvider: FakeHasProvider;

let updateProfile: UpdateProfileServices;

describe('UpdateProfileServices', () => {
   beforeEach(() => {
      fakeUsersRepository = new FakeUsersRepository();
      fakeHasProvider = new FakeHasProvider();

      updateProfile = new UpdateProfileServices(
         fakeUsersRepository,
         fakeHasProvider,
      );
   });

   it('should be able to update the profiler', async () => {
      const user = await fakeUsersRepository.create({
         name: 'John doe',
         email: 'jhon@exemple.com',
         password: '123456',
      });

      const updatedUser = await updateProfile.execute({
         user_id: user.id,
         name: 'Blonde John',
         email: 'blonde.jhon@exemple.com',
      });

      expect(updatedUser?.name).toBe('Blonde John');
      expect(updatedUser?.email).toBe('blonde.jhon@exemple.com');
   });

   it('should be able to change to another user email', async () => {
      await fakeUsersRepository.create({
         name: 'Blonde John',
         email: 'blonde.jhon@exemple.com',
         password: '123456',
      });

      const user = await fakeUsersRepository.create({
         name: 'John doe',
         email: 'jhon@exemple.com',
         password: '123456',
      });

      await expect(
         updateProfile.execute({
            user_id: user.id,
            name: 'Blonde John',
            email: 'blonde.jhon@exemple.com',
         }),
      ).rejects.toBeInstanceOf(AppError);
   });

   it('should be able to update the password', async () => {
      const user = await fakeUsersRepository.create({
         name: 'John doe',
         email: 'jhon@exemple.com',
         password: '123456',
      });

      const updatedUser = await updateProfile.execute({
         user_id: user.id,
         name: 'Blonde John',
         email: 'blonde.jhon@exemple.com',
         old_password: '123456',
         password: '123123',
      });

      expect(updatedUser?.password).toBe('123123');
   });

   it('should not be able to update the password without old password', async () => {
      const user = await fakeUsersRepository.create({
         name: 'John doe',
         email: 'jhon@exemple.com',
         password: '123456',
      });

      await expect(
         updateProfile.execute({
            user_id: user.id,
            name: 'Blonde John',
            email: 'blonde.jhon@exemple.com',
            password: '123123',
         }),
      ).rejects.toBeInstanceOf(AppError);
   });

   it('should not be able to update the password with wrong old password', async () => {
      const user = await fakeUsersRepository.create({
         name: 'John doe',
         email: 'jhon@exemple.com',
         password: '123456',
      });

      await expect(
         updateProfile.execute({
            user_id: user.id,
            name: 'Blonde John',
            email: 'blonde.jhon@exemple.com',
            old_password: 'wrong old password',
            password: '123123',
         }),
      ).rejects.toBeInstanceOf(AppError);
   });

   it('should not be able to update the profiler from non existing user', async () => {
      await expect(
         updateProfile.execute({
            user_id: 'non-existing-user',
            name: 'Blonde John',
            email: 'blonde.jhon@exemple.com',
         }),
      ).rejects.toBeInstanceOf(AppError);
   });
});
