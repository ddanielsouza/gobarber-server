import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointments', () => {
   it('should be able to create a new appointment', async () => {
      const fakeAppointmentsRepository = new FakeAppointmentsRepository();

      const createAppointments = new CreateAppointmentService(
         fakeAppointmentsRepository,
      );

      const appointment = await createAppointments.execute({
         date: new Date(),
         provider_id: '123456789',
      });

      expect(appointment).toHaveProperty('id');
      expect(appointment?.provider_id).toBe('123456789');
   });

   it('should not be able to create two appointments on the same time', async () => {
      const fakeAppointmentsRepository = new FakeAppointmentsRepository();
      const createAppointments = new CreateAppointmentService(
         fakeAppointmentsRepository,
      );

      const currentDate = new Date();

      await createAppointments.execute({
         date: currentDate,
         provider_id: '123456789',
      });

      expect(
         createAppointments.execute({
            date: currentDate,
            provider_id: '123456789',
         }),
      ).rejects.toBeInstanceOf(AppError);
   });
});
