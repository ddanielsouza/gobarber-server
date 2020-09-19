import { container } from 'tsyringe';
import BCCryptHasProvider from './HashProvider/implementations/BCCryptHasProvider';
import IHashProvider from './HashProvider/models/IHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCCryptHasProvider);
