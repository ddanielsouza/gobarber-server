import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let listProviderMonthAvailability: ListProviderMonthAvailabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderMonthAvailabilityService', () => {
   beforeEach(() => {
      fakeAppointmentsRepository = new FakeAppointmentsRepository();

      listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
         fakeAppointmentsRepository,
      );
   });

   it('should be able to list the month availability from provider', async () => {
      await fakeAppointmentsRepository.create({
         provider_id: 'user-id',
         date: new Date(`2020-04-20 08:00:00`),
         user_id: 'user-id',
      });

      for (let index = 8; index < 18; index++) {
         await fakeAppointmentsRepository.create({
            provider_id: 'user-id',
            date: new Date(`2020-05-20 ${index}:00:00`),
            user_id: 'user-id',
         });
      }

      await fakeAppointmentsRepository.create({
         provider_id: 'user-id',
         date: new Date(`2020-05-21 08:00:00`),

         user_id: 'user-id',
      });

      const availability = await listProviderMonthAvailability.execute({
         provider_id: 'user-id',
         year: 2020,
         month: 5,
      });

      expect(availability).toEqual(
         expect.arrayContaining([
            { day: 19, available: true },
            { day: 20, available: false },
            { day: 21, available: true },
            { day: 22, available: true },
         ]),
      );
   });
});
