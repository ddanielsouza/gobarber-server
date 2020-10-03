import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let listProviderDayAvailability: ListProviderDayAvailabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderDayAvailabilityService', () => {
   beforeEach(() => {
      fakeAppointmentsRepository = new FakeAppointmentsRepository();

      listProviderDayAvailability = new ListProviderDayAvailabilityService(
         fakeAppointmentsRepository,
      );
   });

   it('should be able to list the day availability from provider', async () => {
      await fakeAppointmentsRepository.create({
         provider_id: 'user-id',
         date: new Date(`2020-05-20 14:00:00`),
         user_id: 'user-id',
      });

      await fakeAppointmentsRepository.create({
         provider_id: 'user-id',
         date: new Date(`2020-05-20 15:00:00`),
         user_id: 'user-id',
      });

      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
         return new Date('2020-05-20 11:00:00').getTime();
      });

      const availability = await listProviderDayAvailability.execute({
         provider_id: 'user-id',
         year: 2020,
         month: 5,
         day: 20,
      });

      expect(availability).toEqual(
         expect.arrayContaining([
            { hour: 8, available: false },
            { hour: 9, available: false },
            { hour: 10, available: false },
            { hour: 14, available: false },
            { hour: 15, available: false },
            { hour: 16, available: true },
         ]),
      );
   });
});
