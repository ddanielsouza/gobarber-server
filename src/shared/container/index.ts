import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import IAppointimentsReporitory from '@modules/appointments/repositories/IAppointimentsReporitory';
import UsersRepository from '@modules/users/infra/typeorm/respositories/UsersRepository';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/respositories/UsersTokensRepository';

container.registerSingleton<IAppointimentsReporitory>(
   'AppointmentsRepository',
   AppointmentsRepository,
);

container.registerSingleton<IUserRepository>(
   'UsersRepository',
   UsersRepository,
);

container.registerSingleton<IUserTokenRepository>(
   'UserTokenRepository',
   UserTokensRepository,
);
