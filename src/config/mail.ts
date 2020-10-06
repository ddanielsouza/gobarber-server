import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import EtherealMailProvider from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider';
import { container } from 'tsyringe';

interface IMailConfig {
   driver: 'ethereal' | 'fake';
}
export const mailDrivers = {
   ethereal: container.resolve(EtherealMailProvider),
   fake: container.resolve(FakeMailProvider),
};

const mailConfig = {
   driver: process.env.MAIL_DRIVER || 'ethereal',
};

export default mailConfig as IMailConfig;
