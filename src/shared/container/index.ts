import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import IAppointimentsReporitory from '@modules/appointments/repositories/IAppointimentsReporitory';
import UsersRepository from '@modules/users/infra/typeorm/respositories/UsersRepository';
import IUserRepository from '@modules/users/repositories/IUserRepository';

container.registerSingleton<IAppointimentsReporitory>(
   'AppointmentsRepository',
   AppointmentsRepository,
);

container.registerSingleton<IUserRepository>(
   'UsersRepository',
   UsersRepository,
);
