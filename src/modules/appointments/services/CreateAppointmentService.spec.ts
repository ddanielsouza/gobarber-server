import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointments: CreateAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointments', () => {
   beforeEach(() => {
      fakeAppointmentsRepository = new FakeAppointmentsRepository();
      fakeCacheProvider = new FakeCacheProvider();
      fakeNotificationsRepository = new FakeNotificationsRepository();

      createAppointments = new CreateAppointmentService(
         fakeAppointmentsRepository,
         fakeNotificationsRepository,
         fakeCacheProvider,
      );
   });

   it('should be able to create a new appointment', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
         return new Date('2020-05-20 12:00:00').getTime();
      });

      const appointment = await createAppointments.execute({
         date: new Date('2020-05-20 14:00:00'),
         provider_id: 'provider-id',
         user_id: 'user-id',
      });

      expect(appointment).toHaveProperty('id');
      expect(appointment?.provider_id).toBe('provider-id');
   });

   it('should not be able to create two appointments on the same time', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
         return new Date('2020-05-20 12:00:00').getTime();
      });

      await createAppointments.execute({
         date: new Date('2020-05-20 15:00:00'),
         provider_id: 'provider-id',
         user_id: 'user-id',
      });

      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
         return new Date('2020-05-20 12:00:00').getTime();
      });

      await expect(
         createAppointments.execute({
            date: new Date('2020-05-20 15:00:00'),
            provider_id: 'provider-id',
            user_id: 'user-id',
         }),
      ).rejects.toBeInstanceOf(AppError);
   });

   it('should not be able to create a new appointment on a past date', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
         return new Date('2020-05-20 12:00:00').getTime();
      });

      await expect(
         createAppointments.execute({
            date: new Date('2020-05-20 11:00:00'),
            provider_id: 'provider-id',
            user_id: 'user-id',
         }),
      ).rejects.toBeInstanceOf(AppError);
   });

   it('should not be able to create a new appointment with same user as provider', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
         return new Date('2020-05-20 12:00:00').getTime();
      });

      await expect(
         createAppointments.execute({
            date: new Date('2020-05-20 13:00:00'),
            provider_id: 'user-id',
            user_id: 'user-id',
         }),
      ).rejects.toBeInstanceOf(AppError);
   });

   it('should not be able to create a new appointment before 8am and after 5pm', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
         return new Date('2020-05-20 12:00:00').getTime();
      });

      await expect(
         createAppointments.execute({
            date: new Date('2020-05-20 07:00:00'),
            provider_id: 'provider-id',
            user_id: 'user-id',
         }),
      ).rejects.toBeInstanceOf(AppError);

      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
         return new Date('2020-05-20 12:00:00').getTime();
      });

      await expect(
         createAppointments.execute({
            date: new Date('2020-05-20 18:00:00'),
            provider_id: 'provider-id',
            user_id: 'user-id',
         }),
      ).rejects.toBeInstanceOf(AppError);
   });
});
