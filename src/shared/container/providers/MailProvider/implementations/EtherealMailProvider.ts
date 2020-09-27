import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
   private client: Transporter;

   public constructor(
      @inject('MailTemplateProvider')
      private mailTemplateProvider: IMailTemplateProvider,
   ) {
      const createAccount = async () => {
         const account = await nodemailer.createTestAccount();

         const transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
               user: account.user,
               pass: account.pass,
            },
         });

         this.client = transporter;
      };

      createAccount();
   }

   public async sendMail({
      to,
      subject,
      from,
      templateData,
   }: ISendMailDTO): Promise<void> {
      const message = await this.client.sendMail({
         from: {
            name: from?.name || 'DnSouza',
            address: from?.email || 'test@test.com.br',
         },
         to: {
            name: to.name,
            address: to.email,
         },
         subject,
         html: await this.mailTemplateProvider.parse(templateData),
      });

      console.log('Message sent: %s', message.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
   }
}
