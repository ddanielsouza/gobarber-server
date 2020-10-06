import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import EtherealMailProvider from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import { container } from 'tsyringe';

type IDriverMail = 'ethereal' | 'fake';

interface IMailConfig {
   driver: IDriverMail;
}
export function mailDrivers(): { [key: string]: IMailProvider } {
   const drivers = {
      ethereal: container.resolve(EtherealMailProvider),
      fake: container.resolve(FakeMailProvider),
   };

   return drivers;
}

const mailConfig = {
   driver: process.env.MAIL_DRIVER || 'ethereal',
};

export default mailConfig as IMailConfig;
