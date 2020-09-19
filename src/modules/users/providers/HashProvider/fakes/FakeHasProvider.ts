import IHashProvider from '../models/IHashProvider';

export default class FakeHasProvider implements IHashProvider {
   public async genereteHash(payload: string): Promise<string> {
      return payload;
   }

   public async compareHash(payload: string, hashed: string): Promise<boolean> {
      return payload === hashed;
   }
}
