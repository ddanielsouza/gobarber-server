import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
   it('should be able to update avatar', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeStorageProvider = new FakeStorageProvider();

      const user = await fakeUsersRepository.create({
         name: 'John doe',
         email: 'jhon@exemple.com',
         password: '123456',
      });

      const updateUserAvatar = new UpdateUserAvatarService(
         fakeUsersRepository,
         fakeStorageProvider,
      );

      const userAvatar = await updateUserAvatar.execute({
         user_id: user.id,
         avatarFileName: 'avatar.png',
      });

      expect(userAvatar.avatar).toBe('avatar.png');
   });

   it('should not be able to update avatar from non existing user', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeStorageProvider = new FakeStorageProvider();

      const updateUserAvatar = new UpdateUserAvatarService(
         fakeUsersRepository,
         fakeStorageProvider,
      );

      expect(
         updateUserAvatar.execute({
            user_id: 'not-exits-user-id',
            avatarFileName: 'avatar.png',
         }),
      ).rejects.toBeInstanceOf(AppError);
   });

   it('should delete old avatar when updating new one', async () => {
      const fakeUsersRepository = new FakeUsersRepository();
      const fakeStorageProvider = new FakeStorageProvider();

      const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

      const user = await fakeUsersRepository.create({
         name: 'John doe',
         email: 'jhon@exemple.com',
         password: '123456',
      });

      const updateUserAvatar = new UpdateUserAvatarService(
         fakeUsersRepository,
         fakeStorageProvider,
      );

      await updateUserAvatar.execute({
         user_id: user.id,
         avatarFileName: 'avatar.png',
      });

      const userAvatar = await updateUserAvatar.execute({
         user_id: user.id,
         avatarFileName: 'avatar2.png',
      });

      expect(deleteFile).toHaveBeenCalledWith('avatar.png');

      expect(userAvatar.avatar).toBe('avatar2.png');
   });
});
