import { container } from 'tsyringe';
import mailConfig, { mailDrivers } from '@config/mail';
import IMailProvider from './MailProvider/models/IMailProvider';
import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider.';
import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';
import IStorageProvider from './StorageProvider/models/IStorageProvider';

import './CacheProvider';

container.registerSingleton<IStorageProvider>(
   'StorageProvider',
   DiskStorageProvider,
);

container.registerSingleton<IMailTemplateProvider>(
   'MailTemplateProvider',
   HandlebarsMailTemplateProvider,
);

container.registerInstance<IMailProvider>(
   'MailProvider',
   mailDrivers()[mailConfig.driver],
);
