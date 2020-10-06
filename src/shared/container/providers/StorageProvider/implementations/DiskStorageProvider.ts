import uploadConfig from '@config/upload';
import fs from 'fs';
import path from 'path';
import IStorageProvider from '../models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
   public async saveFile(file: string): Promise<string> {
      const fileNameFormatted = file.replace(/[^0-9A-Za-z.]/gim, '-');

      fs.promises.rename(
         path.resolve(uploadConfig.directory, file),
         path.resolve(uploadConfig.uploadsFolder, fileNameFormatted),
      );

      return fileNameFormatted;
   }

   public async deleteFile(file: string): Promise<void> {
      const filePath = path.resolve(uploadConfig.uploadsFolder, file);

      try {
         await fs.promises.access(filePath);
      } catch {
         return;
      }

      await fs.promises.unlink(filePath);
   }
}
