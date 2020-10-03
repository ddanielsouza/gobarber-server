import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;

let showProfile: ShowProfileService;

describe('UpdateProfileServices', () => {
   beforeEach(() => {
      fakeUsersRepository = new FakeUsersRepository();

      showProfile = new ShowProfileService(fakeUsersRepository);
   });

   it('should be able to update the profiler', async () => {
      const user = await fakeUsersRepository.create({
         name: 'John doe',
         email: 'jhon@exemple.com',
         password: '123456',
      });

      const profile = await showProfile.execute({
         user_id: user.id,
      });

      expect(profile?.name).toBe('John doe');
      expect(profile?.email).toBe('jhon@exemple.com');
   });

   it('should not be able to update the profiler from non-existing user', async () => {
      await expect(
         showProfile.execute({
            user_id: 'non-existing-user',
         }),
      ).rejects.toBeInstanceOf(AppError);
   });
});
