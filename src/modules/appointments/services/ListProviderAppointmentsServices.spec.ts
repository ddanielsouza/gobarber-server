import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsServices from './ListProviderAppointmentsServices';

let listProviderAppointments: ListProviderAppointmentsServices;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderAppointmentsServices', () => {
   beforeEach(() => {
      fakeAppointmentsRepository = new FakeAppointmentsRepository();

      listProviderAppointments = new ListProviderAppointmentsServices(
         fakeAppointmentsRepository,
      );
   });

   it('should be able to list the appointments from provider on a specific day', async () => {
      const appointment1 = await fakeAppointmentsRepository.create({
         provider_id: 'provider-id',
         date: new Date(`2020-05-20 14:00:00`),
         user_id: 'user-id',
      });

      const appointment2 = await fakeAppointmentsRepository.create({
         provider_id: 'provider-id',
         date: new Date(`2020-05-20 15:00:00`),
         user_id: 'user-id',
      });

      const appointments = await listProviderAppointments.execute({
         provider_id: 'provider-id',
         year: 2020,
         month: 5,
         day: 20,
      });

      expect(appointments).toEqual(
         expect.arrayContaining([appointment1, appointment2]),
      );
   });
});
